import { bottomMenuKeyboard, resultKeyboard } from "./keyboards.js";
import { BOT_MESSAGE_DEFAULTS } from "./messages.js";
import sharp from "sharp";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientNetworkError(error) {
  const message = String(error?.message || error).toLowerCase();
  return message === "fetch failed" || message.includes("network") || message.includes("timeout");
}

function getCustomRequest(prompt = "") {
  const marked = String(prompt).match(/USER REQUEST \(verbatim\): <<<([\s\S]*?)>>>/i);
  if (marked?.[1]) {
    return marked[1].trim();
  }
  const legacy = String(prompt).match(/following user request:\s*([\s\S]*?)\. Apply requested facial changes/i);
  return legacy?.[1]?.trim() || "";
}

function isMaterialCustomRequest(request = "") {
  return /волос|причес|причёс|уклад|чёлк|окрас|стриж|hair|hairstyl|bang|fringe|background|фон|одежд|плать|костюм|куртк|юбк|макияж|makeup|сцен|сделай.*(?:поз|свет)|outfit|dress|jacket|scene|lighting/i.test(request);
}

async function measureImageSimilarity(sourceBuffer, resultBuffer) {
  const toGrayscalePixels = (buffer) => sharp(buffer, { failOn: "none" })
    .rotate()
    .resize(64, 64, { fit: "fill" })
    .removeAlpha()
    .grayscale()
    .raw()
    .toBuffer();
  const [source, result] = await Promise.all([
    toGrayscalePixels(sourceBuffer),
    toGrayscalePixels(resultBuffer)
  ]);
  const sourceAverage = source.reduce((total, value) => total + value, 0) / source.length;
  const resultAverage = result.reduce((total, value) => total + value, 0) / result.length;
  let hashDifferenceBits = 0;
  let meanAbsoluteDifference = 0;
  for (let index = 0; index < source.length; index += 1) {
    if ((source[index] >= sourceAverage) !== (result[index] >= resultAverage)) {
      hashDifferenceBits += 1;
    }
    meanAbsoluteDifference += Math.abs(source[index] - result[index]);
  }
  return {
    hashDifferenceBits,
    meanAbsoluteDifference: meanAbsoluteDifference / source.length
  };
}

function isNearDuplicate(similarity) {
  return similarity.hashDifferenceBits <= 180 && similarity.meanAbsoluteDifference <= 9;
}

// Image models tend to compose a square output tightly when given a vertical
// close-up. Supplying a smaller, centred source on a transparent square canvas
// gives the model real room to extend the setting around the person in the same
// edit, instead of sacrificing the crown of the head to make the crop fit.
async function prepareAvatarSource(imageBuffer) {
  const canvasSize = 1024;
  const subjectArea = 820;
  const source = await sharp(imageBuffer, { failOn: "none" })
    .rotate()
    .resize({ width: subjectArea, height: subjectArea, fit: "contain", withoutEnlargement: true })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: source, gravity: "centre" }])
    .png()
    .toBuffer();
}

async function prepareUploadedSource(original) {
  // OpenAI's image-edit endpoint accepts JPEG/PNG/WebP. Telegram users often
  // send originals with uncommon colour profiles, progressive JPEG modes or
  // HEIC metadata. Normalize every accepted input to a standard sRGB JPEG
  // before uploading it to the Image API. This preserves orientation and
  // resolution while avoiding “invalid image file or mode” errors.
  return {
    buffer: await sharp(original.buffer, { failOn: "none" })
      .rotate()
      .toColorspace("srgb")
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
      .toBuffer(),
    mimeType: "image/jpeg",
    filename: "source-normalized.jpg"
  };
}

// The full source remains the first image sent to the editor. This separate,
// high-resolution crop is a second reference solely for retaining facial
// identity when a photoshoot replaces the setting, wardrobe and pose. It is
// deliberately not used as a mask or composited into the finished image.
async function prepareIdentityFaceReference(imageBuffer) {
  const normalized = sharp(imageBuffer, { failOn: "none" }).rotate();
  const metadata = await normalized.metadata();
  const width = metadata.width;
  const height = metadata.height;
  if (!width || !height || width < 240 || height < 240) {
    throw new Error("Image is too small to prepare an identity reference");
  }

  const cropSize = Math.floor(Math.min(width, height) * 0.88);
  const left = Math.max(0, Math.floor((width - cropSize) / 2));
  // Most user portraits place the face slightly above centre. This leaves room
  // for the crown without replacing the face with a generic centre crop.
  const top = Math.max(0, Math.min(height - cropSize, Math.floor((height - cropSize) * 0.18)));

  return normalized
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize({ width: 768, height: 768, fit: "cover", withoutEnlargement: true })
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

async function prepareBusinessOutpaint(imageBuffer) {
  const canvasSize = 1024;
  const inset = 102;
  const image = await sharp(imageBuffer, { failOn: "none" })
    .rotate()
    .resize({ width: 820, height: 820, fit: "contain" })
    .extend({ top: inset, bottom: inset, left: inset, right: inset, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Opaque pixels are protected. The transparent outer area plus the top overlap
  // is editable, so the model can rebuild a cropped crown without changing the face.
  const mask = await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
    .composite([{
      input: {
        create: {
          width: 820,
          height: 750,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 255 }
        }
      },
      left: inset,
      top: 170
    }])
    .png()
    .toBuffer();

  return { image, mask };
}

function makeCaption(source, cost, balance, actionKey, resultLabel = null, showStarterExhausted = false) {
  const prefix =
    source === "test"
      ? "Готово. Тестовый режим: генерации не списаны."
      : source === "starter_free"
      ? "Готово. Использована одна стартовая бесплатная попытка."
      : source === "bonus_free"
        ? "Готово. Использована одна бонусная бесплатная обработка."
      : source === "daily_free"
        ? "Готово. Использована бесплатная попытка на сегодня."
        : `Готово. Использована ${cost} генерация.`;

  const lines = [prefix, ""];
  if (balance.bonusFreeRemaining > 0) {
    lines.push(`Бонусные обработки: ${balance.bonusFreeRemaining}`);
  }
  if (balance.starterFreeRemaining > 0) {
    lines.push(`Бесплатные обработки при старте: ${balance.starterFreeRemaining}`);
  }
  if (showStarterExhausted) {
    lines.push("Стартовые бесплатные обработки закончились.");
  }
  lines.push(`Бесплатная обработка сегодня: ${balance.starterFreeRemaining > 0 || balance.bonusFreeRemaining > 0 ? "станет доступна после бесплатных обработок" : balance.dailyFreeAvailable ? "доступна" : "уже использована"}`);
  lines.push(`Генерации: ${balance.paidCredits}`);
  if (resultLabel) {
    lines.splice(1, 0, `${actionKey === "avatar" ? "Стиль аватара" : "Режим обработки"}: ${resultLabel}.`);
  }
  return lines.join("\n");
}

export class JobWorker {
  constructor({ store, telegram, imageService, analytics, idleDelayMs = 1200 }) {
    this.store = store;
    this.telegram = telegram;
    this.imageService = imageService;
    this.analytics = analytics;
    this.idleDelayMs = idleDelayMs;
    this.running = false;
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    void this.loop();
  }

  stop() {
    this.running = false;
  }

  async loop() {
    while (this.running) {
      try {
        const job = await this.store.claimNextPendingJob();
        if (!job) {
          await sleep(this.idleDelayMs);
          continue;
        }
        await this.process(job);
      } catch (error) {
        await this.store.log("error", "worker", "Worker loop failure", {
          error: String(error?.message || error)
        });
        await sleep(this.idleDelayMs);
      }
    }
  }

  async process(job) {
    await this.store.log("info", "worker", "Started processing job", {
      jobId: job.id,
      actionKey: job.action_key,
      userId: job.user_id
    });

    try {
      const original = await this.telegram.downloadFile(job.original_file_id);
      const preparedOriginal = await prepareUploadedSource(original);
      let sourceBuffer = preparedOriginal.buffer;
      let sourceMimeType = preparedOriginal.mimeType || job.original_mime_type || "image/jpeg";
      let sourceFilename = preparedOriginal.filename;
      let identityReferenceBuffer = null;

      // For a free-form request, the full source image is enough to keep identity.
      // A second face crop also contains hair and styling, which can unintentionally
      // overpower an explicit request to change those elements.
      if (job.action_key !== "custom") {
        try {
          identityReferenceBuffer = await prepareIdentityFaceReference(preparedOriginal.buffer);
        } catch (error) {
          // The first image is still a complete source reference. Do not fail a
          // paid edit merely because an unusual or tiny upload cannot be cropped.
          await this.store.log("warn", "worker", "Could not prepare identity face reference", {
            jobId: job.id,
            error: String(error?.message || error)
          });
        }
      }

      if (job.action_key === "avatar") {
        try {
          sourceBuffer = await prepareAvatarSource(sourceBuffer);
          sourceMimeType = "image/png";
          sourceFilename = "avatar-with-headroom.png";
        } catch (error) {
          // A rare unsupported source should still be edited rather than fail a
          // paid request; the regular avatar framing rules remain in force.
          await this.store.log("warn", "worker", "Could not prepare avatar canvas", {
            jobId: job.id,
            error: String(error?.message || error)
          });
        }
      }
      const editParams = {
        imageBuffer: sourceBuffer,
        mimeType: sourceMimeType,
        filename: sourceFilename,
        prompt: job.prompt,
        size: job.action_key === "avatar" ? "1024x1024" : job.action_key === "documents" || job.action_key === "photoshoot" ? "1024x1536" : "auto",
        identityReferenceBuffer
      };
      let edited;
      try {
        edited = await this.imageService.editImage(editParams);
      } catch (error) {
        if (!isTransientNetworkError(error)) {
          throw error;
        }
        await this.store.log("warn", "worker", "Retrying transient image API error", {
          jobId: job.id,
          actionKey: job.action_key,
          userId: job.user_id,
          error: String(error?.message || error)
        });
        await sleep(2_000);
        edited = await this.imageService.editImage(editParams);
      }

      const customRequest = job.action_key === "custom" ? getCustomRequest(job.prompt) : "";
      if (customRequest && isMaterialCustomRequest(customRequest)) {
        try {
          const similarity = await measureImageSimilarity(sourceBuffer, edited.buffer);
          if (isNearDuplicate(similarity)) {
            await this.store.log("warn", "worker", "Retrying near-duplicate custom edit", {
              jobId: job.id,
              actionKey: job.action_key,
              similarity
            });
            edited = await this.imageService.editImage({
              ...editParams,
              identityReferenceBuffer: null,
              prompt: `${job.prompt}\n\nRETRY REQUIREMENT: the first result was too similar to the source. Apply the user's requested change (${customRequest}) clearly and visibly in this retry. Do not return an almost unchanged copy. Preserve the same person's identity and natural proportions.`
            });
          }
        } catch (error) {
          // Similarity checking is a quality safeguard, not a reason to fail or
          // charge the user again for an otherwise successful generation.
          await this.store.log("warn", "worker", "Could not evaluate custom edit similarity", {
            jobId: job.id,
            error: String(error?.message || error)
          });
        }
      }

      if (job.action_key === "avatar" && job.result_label === "Деловой") {
        try {
          const outpaint = await prepareBusinessOutpaint(edited.buffer);
          edited = await this.imageService.editImage({
            imageBuffer: outpaint.image,
            mimeType: "image/png",
            filename: "business-avatar-expanded.png",
            maskBuffer: outpaint.mask,
            size: "1024x1024",
            prompt: "Extend only the transparent masked outer canvas of this exact finished business portrait. Reconstruct a realistic continuation of the neutral interior background and the missing upper hair/crown where needed. The entire head, forehead, hair, crown, and neck must be visible with at least 15% empty background above the hair. Do not change any unmasked pixel: do not alter the face, eye shape, expression, hairline, neck, clothing, body, lighting, or identity. Deliver one seamless square portrait without a cropped head."
          });
        } catch (error) {
          await this.store.log("warn", "worker", "Could not outpaint business avatar", {
            jobId: job.id,
            error: String(error?.message || error)
          });
        }
      }

      const balance = await this.store.getBalanceSnapshot(job.user_id);
      const showStarterExhausted = await this.store.claimStarterExhaustedNotice(job.user_id);
      const caption = makeCaption(job.entitlement_source, job.paid_cost, balance, job.action_key, job.result_label, showStarterExhausted);

      const sentResult = job.action_key === "background" && job.prompt.includes("transparent-background")
        ? await this.telegram.sendDocument(job.chat_id, edited.buffer, edited.filename, caption, edited.mimeType)
        : await this.telegram.sendPhoto(job.chat_id, edited.buffer, edited.filename, caption, edited.mimeType);
      const output = sentResult.document || sentResult.photo?.at(-1);
      if (output?.file_id) {
        await this.store.setLastResultPhoto(job.user_id, {
          fileId: output.file_id,
          fileUniqueId: output.file_unique_id || null,
          mimeType: sentResult.document?.mime_type || edited.mimeType || "image/jpeg"
        });
      }

      await this.telegram.sendMessage(
        job.chat_id,
        "Что хотите сделать дальше?",
        resultKeyboard(job.id, job.paid_cost)
      );
      await this.telegram.sendMessage(job.chat_id, "Быстрые действия — внизу.", bottomMenuKeyboard());
      await this.store.completeJob(job.id, edited.filename);
      void this.analytics.track(job.user_id, "generation_completed", { action_key: job.action_key, credits: job.paid_cost });
      await this.store.log("info", "worker", "Completed job", {
        jobId: job.id,
        actionKey: job.action_key,
        userId: job.user_id
      });
    } catch (error) {
      const message = String(error?.message || error);
      const isOpenAiBalanceExhausted = message.includes("credit_balance_exhausted") || message.includes("insufficient_quota");
      const isUnreadableHeic = message.includes("Security limit exceeded") || message.includes("corrupt header: heif");
      const isOpenAiSafetyBlocked = message.includes("moderation_blocked") || message.includes("safety_violations");
      const botMessages = await this.store.getBotMessages(BOT_MESSAGE_DEFAULTS);
      await this.store.refundConsumedEdit(job.user_id, job.entitlement_source, job.paid_cost);
      await this.store.failJob(job.id, message);
      if (job.template_action) {
        await this.store.setPending(job.user_id, "awaiting_miniapp_photo", { action: job.template_action });
      }
      void this.analytics.track(job.user_id, "generation_failed", { action_key: job.action_key });
      const savedTemplateText = job.template_action
        ? `\n\nШаблон «${job.result_label || "выбранная фотосессия"}» сохранён. Отправьте другое фото — выбирать его заново не нужно.`
        : "";
      await this.telegram.sendMessage(
        job.chat_id,
        isOpenAiBalanceExhausted
          ? `Сервис обработки временно недоступен. Попытка возвращена — повторно ничего не спишется.\n\nПопробуйте немного позже.${savedTemplateText}`
          : isUnreadableHeic
            ? `Не удалось прочитать этот файл: некоторые оригиналы HEIC содержат служебные слои, которые сервис не поддерживает. Попытка возвращена.\n\nОтправьте это фото как обычное фото из галереи или экспортируйте его в JPEG — качество останется высоким.${savedTemplateText}`
            : isOpenAiSafetyBlocked
              ? `${botMessages.openai_safety_blocked}${savedTemplateText}`
            : `${botMessages.processing_error}${savedTemplateText}`
      );
      await this.store.log("error", "worker", "Failed job", {
        jobId: job.id,
        actionKey: job.action_key,
        userId: job.user_id,
        error: message
      });
    }
  }
}
