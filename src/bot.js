import { config } from "./config.js";
import { BOT_MESSAGE_DEFAULTS } from "./messages.js";
import { bottomMenuKeyboard, cardPackKeyboard, creditPackKeyboard, paymentMethodKeyboard, avatarStyleKeyboard, backgroundKeyboard, mainActionKeyboard, confirmEditKeyboard, legalKeyboard, photoshootKeyboard, referralKeyboard, welcomeKeyboard } from "./keyboards.js";
import {
  AVATAR_STYLES,
  BACKGROUND_OPTIONS,
  PHOTOSHOOT_TEMPLATES,
  buildAvatarPrompt,
  buildBackgroundPrompt,
  buildCustomPrompt,
  buildDocumentPhotoPrompt,
  buildEnhancePrompt,
  buildPhotoshootPrompt
} from "./prompts.js";

const IMAGE_DOCUMENT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);

const IMAGE_DOCUMENT_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);

function documentExtension(document) {
  const name = String(document?.file_name || "");
  return name.includes(".") ? name.split(".").pop().toLowerCase() : "";
}

function isImageDocument(document) {
  return IMAGE_DOCUMENT_MIME_TYPES.has(document?.mime_type) || IMAGE_DOCUMENT_EXTENSIONS.has(documentExtension(document));
}

function documentImageMimeType(document) {
  if (IMAGE_DOCUMENT_MIME_TYPES.has(document?.mime_type)) return document.mime_type;
  const extension = documentExtension(document);
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "heic" || extension === "heif") return "image/heic";
  return "image/jpeg";
}

function templateSelectionEventName(action) {
  const [kind, rawKey] = String(action || "").split(":", 2);
  const prefix = kind === "photoshoot" ? "template" : kind === "avatar" ? "avatar" : kind === "background" ? "background" : "template";
  const key = (rawKey || "unknown").replace(/[^a-z0-9_]/gi, "_").slice(0, 30).toLowerCase();
  return `${prefix}_${key}_selected`.slice(0, 40);
}

function getLargestPhoto(photos) {
  if (!Array.isArray(photos) || photos.length === 0) {
    return null;
  }
  return [...photos].sort((a, b) => (b.file_size || 0) - (a.file_size || 0))[0];
}

function acquisitionSourceFromStartPayload(payload) {
  const match = /^src_([a-z0-9_-]{1,64})$/i.exec(payload || "");
  return match ? match[1].toLowerCase() : null;
}

function formatBalance(balance) {
  const hasFreeEditsBeforeDaily = balance.starterFreeRemaining > 0 || balance.bonusFreeRemaining > 0;
  const dailyStatus = hasFreeEditsBeforeDaily
    ? "станет доступна после бесплатных попыток"
    : balance.dailyFreeAvailable
      ? "доступна"
      : "уже использована";
  const lines = [];
  if (balance.bonusFreeRemaining > 0) {
    lines.push(`Бонусные обработки: ${balance.bonusFreeRemaining}`);
  }
  if (balance.starterFreeRemaining > 0) {
    lines.push(`Бесплатные обработки при старте: ${balance.starterFreeRemaining}`);
  }
  lines.push(`Бесплатная обработка сегодня: ${dailyStatus}`);
  lines.push(`Генерации: ${balance.paidCredits}`);
  return lines.join("\n");
}

function helpText() {
  return [
    "В «Фотостудии» выбирайте шаблоны: аватарки, фотосессии, фон и ретушь. Затем отправьте исходное фото в этот чат.",
    "В чате доступен «Свой запрос»: загрузите фото и напишите, что изменить.",
    "Для лучшего сходства: одно лицо крупно, без закрывающих лицо волос, очков и рук; взгляд в камеру; ровный свет.",
    "",
    "Доступные действия:",
    "- Фотостудия с примерами и шаблонами",
    "- Свой запрос в чате",
    "",
    "Бесплатно:",
    "- 3 попытки для нового пользователя",
    "- затем 1 попытка каждый день",
    "",
    "Команды:",
    "/start",
    "/help",
    "/balance",
    "/buy"
  ].join("\n");
}

function photoTipsText() {
  return [
    "Как выбрать фото, чтобы результат был максимально похож:",
    "• одно лицо в кадре, достаточно крупно (лучше портрет по плечи);",
    "• смотрите в камеру, держите лицо прямо;",
    "• лицо должно быть хорошо освещено и без сильных теней;",
    "• не закрывайте глаза, нос и контур лица волосами, руками, телефоном или очками;",
    "• выбирайте чёткое фото без фильтров и сильного блюра.",
    "",
    "Для максимальной чёткости отправьте исходник как файл: 📎 → Файл."
  ].join("\n");
}

function referralText(referralLink, stats) {
  return [
    "👥 Пригласите друга",
    "",
    "За каждого друга, который впервые запустит бот по вашей ссылке, вы получите 3 бесплатные обработки.",
    "",
    "🔗 Ваша реферальная ссылка:",
    referralLink,
    "",
    `📈 Приглашено друзей: ${stats.invitedUsers}`,
    `🎁 Получено бонусных обработок: ${stats.bonusEdits}`,
    "",
    "Поделитесь ссылкой с друзьями — бонус начислится автоматически после первого запуска бота."
  ].join("\n");
}

function welcomeText() {
  return [
    "✨ Добро пожаловать в «Фоторедактор онлайн. Нейрофотошоп»!",
    "",
    "Создавайте красивые фото с ИИ — готовые фотосессии, аватарки, новые фоны, ретушь и фото на документы.",
    "",
    "✨ В «Фотостудии» можно посмотреть примеры и выбрать готовый шаблон. После выбора отправьте фото в этот чат — или будет использовано последнее загруженное.",
    "✍️ В «Своём запросе» загрузите фото и напишите, что изменить: например, «убери фон», «сделай ретушь» или «измени причёску».",
    "Перед первой загрузкой откройте «Как выбрать фото» в нижнем меню — это поможет получить более точный результат.",
    "",
    "Используя бота, вы принимаете Пользовательское соглашение и Политику конфиденциальности — они доступны кнопками ниже."
  ].join("\n");
}

function termsText() {
  return [
    "Пользовательское соглашение",
    "Версия от 19.08.2026",
    "",
    "1. Бот @gpt_photoeditor_bot предоставляет инструменты ИИ-обработки изображений.",
    "2. Пользователь подтверждает, что имеет право загружать фото и использовать полученный результат.",
    "3. Результаты создаются ИИ и могут отличаться от ожиданий. Бот не гарантирует точное сохранение всех деталей изображения.",
    "4. Для цифровых услуг внутри Telegram оплата производится в Telegram Stars. Кредиты зачисляются после подтверждённой оплаты.",
    "5. Нельзя использовать бот для нарушения прав третьих лиц, закона или правил Telegram и OpenAI.",
    "6. Условия могут обновляться; актуальная версия доступна по команде /terms."
  ].join("\n");
}

function privacyText() {
  return [
    "Политика конфиденциальности",
    "Версия от 19.08.2026",
    "",
    "1. Бот обрабатывает Telegram ID, технические данные чата, баланс генераций, историю задач и оценки результата — чтобы предоставить услугу и предотвратить злоупотребления.",
    "2. Исходные файлы фото не сохраняются на сервере бота. Для обработки фото передаётся в Telegram и API OpenAI; бот сохраняет только технический идентификатор последнего фото, чтобы вы могли повторно применить действие.",
    "3. В аналитике используются обезличенные технические события: открытия бота, нажатия кнопок, обработки и покупки. Фото, Telegram ID и текст запросов в Google Analytics не передаются.",
    "4. Оплата обрабатывается Telegram Stars. Бот не получает данные банковских карт.",
    "5. Продолжая пользоваться ботом, вы соглашаетесь с этой политикой."
  ].join("\n");
}

function makeCaption(source, cost) {
  if (source === "test") {
    return "Готово. Тестовый режим: генерации не списаны.";
  }
  if (source === "starter_free") {
    return "Готово. Использована одна стартовая бесплатная попытка.";
  }
  if (source === "daily_free") {
    return "Готово. Использована бесплатная попытка на сегодня.";
  }
  return `Готово. Использована ${cost} генерация.`;
}

export class PhotoEditorBot {
  constructor({ telegram, store, imageService, analytics }) {
    this.telegram = telegram;
    this.store = store;
    this.imageService = imageService;
    this.analytics = analytics;
    this.offset = 0;
    this.broadcastRunning = false;
  }

  async getAdminSnapshot(days = 30) {
    return this.store.getAdminSnapshot(25, config.estimatedOpenAiCostUsd, config.netUsdPerStar, days, config.testUserIds);
  }

  async getBotMessages() {
    return this.store.getBotMessages(BOT_MESSAGE_DEFAULTS);
  }

  async updateBotMessages(messages) {
    return this.store.updateBotMessages(messages, BOT_MESSAGE_DEFAULTS);
  }

  async startBroadcast(text) {
    if (this.broadcastRunning) {
      throw new Error("Рассылка уже выполняется. Дождитесь отчёта в админке.");
    }
    const recipients = await this.store.getBroadcastRecipients();
    const campaign = await this.store.createBroadcastCampaign(text, recipients.length);
    this.broadcastRunning = true;
    void this.deliverBroadcast(campaign.id, recipients, text);
    return campaign;
  }

  async deliverBroadcast(campaignId, recipients, text) {
    let delivered = 0;
    let failed = 0;
    try {
      for (const userId of recipients) {
        try {
          await this.telegram.sendMessage(userId, text);
          delivered += 1;
        } catch (error) {
          failed += 1;
          console.warn(`[broadcast] could not deliver campaign ${campaignId} to ${userId}:`, error.message);
        }
        if ((delivered + failed) % 20 === 0) {
          await this.store.updateBroadcastProgress(campaignId, { delivered, failed });
        }
        // Keep below Telegram's global bot message limit.
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      await this.store.finishBroadcastCampaign(campaignId, { delivered, failed });
      await this.store.log("info", "broadcast", "Broadcast completed", { campaignId, delivered, failed });
    } catch (error) {
      await this.store.updateBroadcastProgress(campaignId, { delivered, failed });
      await this.store.log("error", "broadcast", "Broadcast interrupted", { campaignId, delivered, failed, error: error.message });
      console.error(`[broadcast] campaign ${campaignId} interrupted`, error);
    } finally {
      this.broadcastRunning = false;
    }
  }

  async runForever() {
    for (;;) {
      try {
        const updates = await this.telegram.getUpdates(this.offset, 25);
        for (const update of updates) {
          this.offset = update.update_id + 1;
          await this.handleUpdate(update);
        }
      } catch (error) {
        console.error("[bot] polling error:", error);
        await new Promise((resolve) => setTimeout(resolve, config.pollIntervalMs));
      }
    }
  }

  async handleUpdate(update) {
    if (update.pre_checkout_query) {
      await this.handlePreCheckout(update.pre_checkout_query);
      return;
    }
    if (update.callback_query) {
      await this.handleCallback(update.callback_query);
      return;
    }
    if (update.message?.successful_payment) {
      await this.handleSuccessfulPayment(update.message);
      return;
    }
    if (update.message) {
      await this.handleMessage(update.message);
    }
  }

  async handleMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;

    const startMatch = /^\/start(?:\s+(\S+))?$/.exec(message.text || "");
    if (startMatch) {
      if (startMatch[1]?.startsWith("studio_")) {
        let action = "";
        const useNewPhoto = startMatch[1].startsWith("studio_new_");
        try {
          action = Buffer.from(startMatch[1].slice(useNewPhoto ? "studio_new_".length : "studio_".length), "base64url").toString("utf8");
        } catch {
          // The generic welcome below is a safe fallback for malformed links.
        }
        const edit = this.getMiniAppEdit(action);
        if (edit) {
          void this.analytics.track(userId, "miniapp_template_selected", { template_key: action });
          void this.analytics.track(userId, templateSelectionEventName(action), { template_key: action, selection_source: "miniapp_link" });
          void this.analytics.track(userId, "filter_selected", { category: "фотостудия", key: action });
          const user = await this.store.getUser(userId);
          if (!useNewPhoto && user.lastPhoto?.fileId) {
            await this.confirmEdit(chatId, userId, edit);
            return;
          }
          await this.store.setPending(userId, "awaiting_miniapp_photo", { action });
          await this.telegram.sendMessage(
            chatId,
            `Вы выбрали: «${edit.resultLabel}».\n\nТеперь отправьте исходное фото в этот чат — затем я покажу стоимость и попрошу подтвердить обработку.`,
            mainActionKeyboard()
          );
          return;
        }
      }
      if (startMatch[1] === "terms") {
        await this.telegram.sendMessage(chatId, termsText(), legalKeyboard());
        return;
      }
      if (startMatch[1] === "privacy") {
        await this.telegram.sendMessage(chatId, privacyText(), legalKeyboard());
        return;
      }
      const referralMatch = /^ref_(\d+)$/.exec(startMatch[1] || "");
      if (referralMatch) {
        const referrerUserId = Number(referralMatch[1]);
        const referral = await this.store.registerReferral(userId, referrerUserId);
        if (referral.bonusGranted) {
          void this.telegram.sendMessage(
            referrerUserId,
            "🎉 Друг впервые запустил бот по вашей ссылке. Вам начислено 3 бесплатные обработки."
          ).catch(() => {});
          void this.analytics.track(referrerUserId, "referral_bonus_granted", { invited_user_id: userId, bonus_edits: 3 });
        }
      }
      const acquisitionSource = acquisitionSourceFromStartPayload(startMatch[1]);
      if (acquisitionSource) {
        const capturedSource = await this.store.captureAcquisitionSource(userId, acquisitionSource);
        if (capturedSource) {
          void this.analytics.track(userId, "acquisition_source_captured", { source: capturedSource });
        }
      }
      void this.analytics.track(userId, "bot_opened");
      const balance = await this.store.getBalanceSnapshot(userId);
      await this.telegram.sendMessage(
        chatId,
        `${welcomeText()}\n\nВам доступны 3 бесплатные обработки, затем — 1 в день.\n\n${formatBalance(balance)}\n\n✨ Нажмите «Трендовые фото», чтобы выбрать шаблон.`,
        welcomeKeyboard(),
        "HTML",
        { disableLinkPreview: true }
      );
      await this.telegram.sendMessage(chatId, "Внизу — быстрые действия.", bottomMenuKeyboard());
      return;
    }

    if (message.text === "/help") {
      await this.telegram.sendMessage(chatId, helpText(), mainActionKeyboard());
      return;
    }

    if (message.text === "/terms") {
      await this.telegram.sendMessage(chatId, termsText(), legalKeyboard());
      return;
    }

    if (message.text === "/privacy") {
      await this.telegram.sendMessage(chatId, privacyText(), legalKeyboard());
      return;
    }

    if (message.text === "/balance") {
      await this.telegram.sendMessage(
        chatId,
        `👛 Баланс\n\n${formatBalance(await this.store.getBalanceSnapshot(userId))}\n\nВыберите способ пополнения:`,
        paymentMethodKeyboard()
      );
      return;
    }

    if (message.text === "/buy" || message.text === "⭐ Купить генерации" || message.text === "⭐ Купить кредиты") {
      await this.telegram.sendMessage(chatId, "Выберите способ пополнения:", paymentMethodKeyboard());
      return;
    }

    if (message.text === "/feedback") {
      await this.store.setPending(userId, "awaiting_feedback");
      await this.telegram.sendMessage(chatId, "💬 Напишите, что понравилось, что неудобно или какую идею хотите предложить. Сообщение увидит команда бота.");
      return;
    }

    if (message.text === "✨ Трендовые фото" || message.text === "🔥 Трендовые фото") {
      // The native Telegram Web App button handles the usual tap. This keeps
      // the text command useful on Telegram clients that do not open Web Apps.
      await this.telegram.sendMessage(chatId, "✨ Откройте Фотостудию через кнопку «Трендовые фото» внизу.");
      return;
    }

    if (message.text === "💡 Как выбрать фото") {
      void this.analytics.track(userId, "photo_tips_opened", { source: "bottom_menu" });
      await this.store.markPhotoTipsSeen(userId);
      await this.telegram.sendMessage(chatId, `💡 ${photoTipsText()}`, mainActionKeyboard());
      return;
    }

    if (message.text === "🏠 Главное меню") {
      const balance = await this.store.getBalanceSnapshot(userId);
      await this.telegram.sendMessage(
        chatId,
        `${welcomeText()}\n\n${formatBalance(balance)}\n\n✨ Нажмите «Трендовые фото», чтобы выбрать шаблон.`,
        welcomeKeyboard(),
        "HTML",
        { disableLinkPreview: true }
      );
      return;
    }

    if (message.text === "💳 Баланс" || message.text === "👛 Баланс") {
      await this.telegram.sendMessage(
        chatId,
        `👛 Баланс\n\n${formatBalance(await this.store.getBalanceSnapshot(userId))}\n\nВыберите способ пополнения:`,
        paymentMethodKeyboard()
      );
      return;
    }

    if (message.text === "👥 Пригласить друга" || message.text === "💰 Пригласить друга" || message.text === "/referral") {
      await this.sendReferralInfo(chatId, userId);
      return;
    }

    if (message.text === "💬 Обратная связь" || message.text === "💬 Отзыв") {
      void this.analytics.track(userId, "feedback_opened", { source: "bottom_menu" });
      await this.store.setPending(userId, "awaiting_feedback");
      await this.telegram.sendMessage(chatId, "💬 Напишите, что понравилось, что неудобно или какую идею хотите предложить. Сообщение увидит команда бота.");
      return;
    }

    if (message.web_app_data?.data) {
      await this.handleMiniAppData(chatId, userId, message.web_app_data.data);
      return;
    }

    const user = await this.store.getUser(userId);

    if (user.pendingAction === "awaiting_feedback" && message.text?.trim()) {
      const feedback = message.text.trim().slice(0, 4000);
      await this.store.clearPending(userId);
      await this.store.saveSuggestion({
        userId,
        chatId,
        username: message.from.username ? `@${message.from.username}` : null,
        displayName: [message.from.first_name, message.from.last_name].filter(Boolean).join(" ") || null,
        message: feedback
      });
      void this.analytics.track(userId, "user_feedback_submitted");
      const senderName = [message.from.first_name, message.from.last_name].filter(Boolean).join(" ") || "Пользователь";
      const senderHandle = message.from.username ? ` @${message.from.username}` : "";
      // The owner can use the feedback flow too. Avoid showing them a second,
      // bot-authored copy of their own message in the same chat.
      if (config.feedbackRecipientChatId && config.feedbackRecipientChatId !== chatId) {
        await this.telegram.sendMessage(
          config.feedbackRecipientChatId,
          `💬 Новая обратная связь\n\nОт: ${senderName}${senderHandle}\nID: ${userId}\n\n${feedback}`
        ).catch((error) => console.error("Could not forward feedback to owner", error));
      }
      await this.telegram.sendMessage(chatId, "Спасибо! Комментарий сохранён — мы читаем идеи и используем их для улучшения бота.", mainActionKeyboard());
      return;
    }

    if (user.pendingAction === "awaiting_custom_background" && message.text) {
      await this.store.clearPending(userId);
      await this.confirmEdit(chatId, userId, {
        actionKey: "background",
        paidCost: config.actionCosts.background,
        prompt: buildBackgroundPrompt("custom", message.text),
        requestText: message.text
      });
      return;
    }

    if (user.pendingAction === "awaiting_custom_prompt" && message.text) {
      await this.store.clearPending(userId);
      await this.confirmEdit(chatId, userId, {
        actionKey: "custom",
        paidCost: config.actionCosts.custom,
        prompt: buildCustomPrompt(message.text),
        requestText: message.text
      });
      return;
    }

    if (user.pendingAction === "awaiting_custom_result_prompt" && message.text) {
      await this.store.clearPending(userId);
      if (!user.lastResultPhoto?.fileId) {
        await this.telegram.sendMessage(chatId, "Последний результат больше недоступен. Выберите «Свой запрос» или загрузите новое фото.", mainActionKeyboard());
        return;
      }
      await this.confirmEdit(chatId, userId, {
        actionKey: "custom",
        paidCost: config.actionCosts.custom,
        prompt: buildCustomPrompt(message.text),
        requestText: message.text,
        sourcePhoto: user.lastResultPhoto,
        sourceLabel: "готовому результату"
      });
      return;
    }

    if (user.pendingAction === "awaiting_instruction_after_photo" && message.text) {
      await this.store.clearPending(userId);
      void this.analytics.track(userId, "photo_instruction_received");
      await this.confirmEdit(chatId, userId, {
        actionKey: "custom",
        paidCost: config.actionCosts.custom,
        prompt: buildCustomPrompt(message.text),
        requestText: message.text
      });
      return;
    }

    const photo = getLargestPhoto(message.photo);
    const document = isImageDocument(message.document) ? message.document : null;

    if (photo || document) {
      void this.analytics.track(userId, "photo_uploaded", { format: document?.mime_type || "image/jpeg" });
      const miniAppAction = user.pendingAction === "awaiting_miniapp_photo" ? user.pendingPayload?.action : null;
      const awaitingCustomPhoto = user.pendingAction === "awaiting_custom_photo";
      const fileId = photo?.file_id || document.file_id;
      await this.store.setLastPhoto(userId, {
        fileId,
        fileUniqueId: photo?.file_unique_id || document.file_unique_id,
        mimeType: document ? documentImageMimeType(document) : "image/jpeg"
      });
      const requestText = message.caption?.trim();
      const miniAppEdit = miniAppAction ? this.getMiniAppEdit(miniAppAction) : null;
      if (miniAppEdit) {
        await this.confirmEdit(chatId, userId, miniAppEdit);
        return;
      }
      if (requestText) {
        void this.analytics.track(userId, "photo_instruction_received", { source: "caption" });
        await this.confirmEdit(chatId, userId, {
          actionKey: "custom",
          paidCost: config.actionCosts.custom,
          prompt: buildCustomPrompt(requestText),
          requestText
        });
        return;
      }

      if (awaitingCustomPhoto) {
        await this.store.setPending(userId, "awaiting_custom_prompt");
        await this.telegram.sendMessage(chatId, "Фото получено. Теперь напишите, что хотите изменить.");
        return;
      }

      await this.store.setPending(userId, "awaiting_instruction_after_photo");
      await this.telegram.sendMessage(
        chatId,
        "Фото получено. Выберите действие или сразу напишите, что изменить — заранее покажу стоимость.",
        mainActionKeyboard()
      );
      return;
    }

    if (user.pendingAction === "awaiting_miniapp_photo" && user.pendingPayload?.action) {
      const edit = this.getMiniAppEdit(user.pendingPayload.action);
      await this.telegram.sendMessage(
        chatId,
        `Этот файл не похож на поддерживаемую фотографию. Шаблон «${edit?.resultLabel || "выбранная фотосессия"}» сохранён.\n\nОтправьте другое фото как JPG, PNG, WEBP или HEIC — выбирать шаблон заново не нужно.`
      );
      return;
    }
    await this.telegram.sendMessage(chatId, "Сначала отправьте фото.");
  }

  getMiniAppEdit(action) {
    if (action === "enhance") {
      return { actionKey: "enhance", paidCost: config.actionCosts.enhance, prompt: buildEnhancePrompt(), resultLabel: "Ретушь и качество", templateAction: action };
    }
    if (action === "documents") {
      return { actionKey: "documents", paidCost: config.actionCosts.documents, prompt: buildDocumentPhotoPrompt(), resultLabel: "Фото на документы", templateAction: action };
    }
    if (action.startsWith("avatar:")) {
      const styleKey = action.slice("avatar:".length);
      if (!AVATAR_STYLES[styleKey]) return null;
      return { actionKey: "avatar", paidCost: config.actionCosts.avatar, prompt: buildAvatarPrompt(styleKey), resultLabel: AVATAR_STYLES[styleKey].label, templateAction: action };
    }
    if (action.startsWith("photoshoot:")) {
      const templateKey = action.slice("photoshoot:".length);
      if (!PHOTOSHOOT_TEMPLATES[templateKey]) return null;
      return { actionKey: "photoshoot", paidCost: config.actionCosts.photoshoot, prompt: buildPhotoshootPrompt(templateKey), resultLabel: `Фотосессия: ${PHOTOSHOOT_TEMPLATES[templateKey].label.replace(/^\S+\s/, "")}`, templateAction: action };
    }
    if (action.startsWith("background:")) {
      const optionKey = action.slice("background:".length);
      if (!BACKGROUND_OPTIONS[optionKey] || optionKey === "custom") return null;
      return { actionKey: "background", paidCost: config.actionCosts.background, prompt: buildBackgroundPrompt(optionKey), resultLabel: BACKGROUND_OPTIONS[optionKey].label, templateAction: action };
    }
    return null;
  }

  async handleMiniAppData(chatId, userId, rawData) {
    let payload;
    try {
      payload = JSON.parse(rawData);
    } catch {
      await this.telegram.sendMessage(chatId, "Не удалось прочитать выбор из фотостудии. Откройте её ещё раз.", mainActionKeyboard());
      return;
    }
    if (payload?.type !== "miniapp_action" || typeof payload.action !== "string") {
      await this.telegram.sendMessage(chatId, "Неизвестное действие фотостудии.", mainActionKeyboard());
      return;
    }
    const edit = this.getMiniAppEdit(payload.action);
    if (!edit) {
      await this.telegram.sendMessage(chatId, "Этот шаблон пока недоступен. Выберите другой.", mainActionKeyboard());
      return;
    }
    void this.analytics.track(userId, "miniapp_template_selected", { template_key: payload.action });
    void this.analytics.track(userId, templateSelectionEventName(payload.action), { template_key: payload.action, selection_source: "miniapp" });
    void this.analytics.track(userId, "filter_selected", { category: "фотостудия", key: payload.action });
    const user = await this.store.getUser(userId);
    if (payload.photoMode === "last" && user.lastPhoto?.fileId) {
      await this.confirmEdit(chatId, userId, edit);
      return;
    }
    await this.store.setPending(userId, "awaiting_miniapp_photo", { action: payload.action });
    await this.telegram.sendMessage(
      chatId,
      payload.photoMode === "last"
        ? `Вы выбрали: «${edit.resultLabel}».\n\nПоследнего фото в чате пока нет. Отправьте исходное фото — затем я покажу стоимость и попрошу подтвердить обработку.`
        : `Вы выбрали: «${edit.resultLabel}».\n\nТеперь отправьте исходное фото в этот чат — затем я покажу стоимость и попрошу подтвердить обработку.`,
      mainActionKeyboard()
    );
  }

  async sendReferralInfo(chatId, userId) {
    const referralLink = `https://t.me/${config.telegramBotUsername}?start=ref_${userId}`;
    const stats = await this.store.getReferralStats(userId);
    await this.telegram.sendMessage(chatId, referralText(referralLink, stats), referralKeyboard(referralLink));
  }

  async replaceLegalMessage(callbackQuery, text, replyMarkup = legalKeyboard(), parseMode = null) {
    try {
      await this.telegram.editMessageText(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id,
        text,
        replyMarkup,
        parseMode
      );
    } catch {
      // Old messages cannot always be edited. In that case the legal text is
      // still delivered as a safe fallback.
      await this.telegram.sendMessage(callbackQuery.message.chat.id, text, replyMarkup, parseMode);
    }
  }

  async handleCallback(callbackQuery) {
    const data = callbackQuery.data || "";
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;

    await this.telegram.answerCallbackQuery(callbackQuery.id);

    if (data === "nav:main") {
      await this.telegram.sendMessage(chatId, "Выберите действие для последнего фото.", mainActionKeyboard());
      return;
    }

    if (data === "nav:balance") {
      await this.telegram.sendMessage(
        chatId,
        `👛 Баланс\n\n${formatBalance(await this.store.getBalanceSnapshot(userId))}\n\nВыберите способ пополнения:`,
        paymentMethodKeyboard()
      );
      return;
    }

    if (data === "payment:methods") {
      await this.telegram.sendMessage(chatId, "Выберите способ пополнения:", paymentMethodKeyboard());
      return;
    }

    if (data === "payment:stars") {
      void this.analytics.track(userId, "payment_method_selected", { method: "telegram_stars" });
      await this.telegram.sendMessage(chatId, "⭐ Выберите пакет звёзд:", creditPackKeyboard());
      return;
    }

    if (data === "payment:card") {
      void this.analytics.track(userId, "payment_method_selected", { method: "card_sbp" });
      await this.telegram.sendMessage(chatId, "💳 Выберите сумму для пополнения:", cardPackKeyboard());
      return;
    }

    if (data === "legal:terms") {
      await this.replaceLegalMessage(callbackQuery, termsText());
      return;
    }

    if (data === "legal:privacy") {
      await this.replaceLegalMessage(callbackQuery, privacyText());
      return;
    }

    if (data === "legal:back") {
      const balance = await this.store.getBalanceSnapshot(userId);
      await this.replaceLegalMessage(
        callbackQuery,
        `${welcomeText()}\n\n${formatBalance(balance)}\n\n✨ Нажмите «Трендовые фото», чтобы выбрать шаблон.`,
        welcomeKeyboard(),
        "HTML"
      );
      return;
    }

    if (data === "nav:new_photo") {
      void this.analytics.track(userId, "button_new_photo_clicked");
      const user = await this.store.getUser(userId);
      if (!user.photoTipsSeen) {
        await this.store.markPhotoTipsSeen(userId);
        await this.telegram.sendMessage(
          chatId,
          `📷 Перед загрузкой посмотрите рекомендации — они помогут сохранить сходство.\n\n${photoTipsText()}\n\nТеперь отправьте новое фото. Оно заменит текущий исходник.`
        );
      } else {
        await this.telegram.sendMessage(chatId, "📷 Отправьте новое фото. Оно заменит текущий исходник.");
      }
      return;
    }

    if (data === "nav:photo_tips") {
      void this.analytics.track(userId, "photo_tips_opened");
      await this.store.markPhotoTipsSeen(userId);
      await this.telegram.sendMessage(chatId, `💡 ${photoTipsText()}`, mainActionKeyboard());
      return;
    }

    if (data === "nav:referral") {
      void this.analytics.track(userId, "referral_opened");
      await this.sendReferralInfo(chatId, userId);
      return;
    }

    if (data === "nav:feedback") {
      void this.analytics.track(userId, "feedback_opened");
      await this.store.setPending(userId, "awaiting_feedback");
      await this.telegram.sendMessage(chatId, "💬 Напишите, что понравилось, что неудобно или какую идею хотите предложить. Сообщение увидит команда бота.");
      return;
    }

    if (data === "confirm:no") { void this.analytics.track(userId, "edit_cancelled"); await this.store.clearPending(userId); await this.telegram.sendMessage(chatId, "Отменено.", mainActionKeyboard()); return; }
    if (data === "confirm:yes") {
      const user = await this.store.getUser(userId);
      const pending = user.pendingAction === "confirm_edit" ? user.pendingPayload : null;
      if (!pending) { await this.telegram.sendMessage(chatId, "Это подтверждение уже неактуально. Выберите действие снова.", mainActionKeyboard()); return; }
      await this.store.clearPending(userId);
      void this.analytics.track(userId, "edit_confirmed", { action_key: pending.actionKey, credits: pending.paidCost });
      await this.runEdit(chatId, userId, pending);
      return;
    }

    if (data.startsWith("retry:")) {
      void this.analytics.track(userId, "retry_clicked");
      const job = await this.store.getJobForUser(Number(data.slice(6)), userId);
      if (!job) { await this.telegram.sendMessage(chatId, "Этот результат уже недоступен для повтора."); return; }
      await this.confirmEdit(chatId, userId, { actionKey: job.action_key, paidCost: job.paid_cost, prompt: job.prompt });
      return;
    }

    if (data.startsWith("feedback:")) {
      const [, kind, jobIdRaw] = data.split(":");
      const result = await this.store.submitFeedback(Number(jobIdRaw), userId, kind === "bad" ? "bad:not_similar" : "good", kind === "bad");
      void this.analytics.track(userId, "result_feedback", { rating: kind, refund_granted: result.refunded ? 1 : 0, refund_limited: result.refundLimited ? 1 : 0 });
      const feedbackText = result.refunded
        ? "Спасибо — попытка возвращена. Выберите действие с тем же исходным фото."
        : result.refundLimited
          ? "Спасибо, жалоба сохранена. Автоматический возврат доступен не чаще одного раза в 24 часа."
          : "Спасибо за оценку!";
      await this.telegram.sendMessage(
        chatId,
        kind === "bad" ? `${feedbackText}\n\n💡 ${photoTipsText()}` : feedbackText,
        mainActionKeyboard()
      );
      return;
    }

    if (data === "action:enhance") {
      void this.analytics.track(userId, "button_enhance_clicked");
      void this.analytics.track(userId, "filter_selected", { category: "инструменты", key: "ретушь_и_качество" });
      await this.confirmEdit(chatId, userId, {
        actionKey: "enhance",
        paidCost: config.actionCosts.enhance,
        prompt: buildEnhancePrompt()
      });
      return;
    }

    if (data === "action:avatar") {
      void this.analytics.track(userId, "button_avatar_clicked");
      await this.telegram.sendMessage(chatId, "Выберите стиль аватара.", avatarStyleKeyboard());
      return;
    }

    if (data === "action:photoshoot") {
      void this.analytics.track(userId, "button_photoshoot_clicked");
      await this.telegram.sendMessage(
        chatId,
        "Выберите фотосессию. Для лучшего сходства загрузите фото, где хорошо видно одно лицо.",
        photoshootKeyboard()
      );
      return;
    }

    if (data === "action:documents") {
      void this.analytics.track(userId, "button_documents_clicked");
      void this.analytics.track(userId, "filter_selected", { category: "инструменты", key: "фото_на_документы" });
      await this.confirmEdit(chatId, userId, {
        actionKey: "documents",
        paidCost: config.actionCosts.documents,
        prompt: buildDocumentPhotoPrompt(),
        resultLabel: "Фото на документы"
      });
      return;
    }

    if (data === "action:background") {
      void this.analytics.track(userId, "button_background_clicked");
      await this.telegram.sendMessage(chatId, "Выберите фон. Лёгкая естественная ретушь и нейтральный свет будут применены автоматически.", backgroundKeyboard());
      return;
    }

    if (data === "action:custom" || data === "action:custom_source") {
      void this.analytics.track(userId, "button_custom_clicked");
      void this.analytics.track(userId, "edit_mode_selected", { mode: "исходное_фото" });
      const user = await this.store.getUser(userId);
      if (!user.lastPhoto?.fileId) {
        await this.store.setPending(userId, "awaiting_custom_photo");
        await this.telegram.sendMessage(chatId, "📷 Сначала отправьте фото. Можно сразу добавить подпись с тем, что нужно изменить.");
        return;
      }
      await this.store.setPending(userId, "awaiting_custom_prompt");
      await this.telegram.sendMessage(chatId, "Напишите, что изменить на загруженном фото. Для нового стиля, фотосессии или аватарки это даст более точное сходство.");
      return;
    }

    if (data === "action:custom_result") {
      void this.analytics.track(userId, "button_custom_result_clicked");
      void this.analytics.track(userId, "edit_mode_selected", { mode: "готовый_результат" });
      const user = await this.store.getUser(userId);
      if (!user.lastResultPhoto?.fileId) {
        await this.telegram.sendMessage(chatId, "Пока нет готового результата для доработки. Сначала создайте фото или выберите «Свой запрос».", mainActionKeyboard());
        return;
      }
      await this.store.setPending(userId, "awaiting_custom_result_prompt");
      await this.telegram.sendMessage(chatId, "Напишите, что изменить в готовом результате. Например: «сделай волосы объёмнее», «измени цвет платья», «убери очки».");
      return;
    }

    if (data === "action:buy") {
      void this.analytics.track(userId, "button_buy_clicked");
      await this.telegram.sendMessage(chatId, "Выберите способ пополнения:", paymentMethodKeyboard());
      return;
    }

    if (data.startsWith("avatar:")) {
      const styleKey = data.slice("avatar:".length);
      if (!AVATAR_STYLES[styleKey]) {
        await this.telegram.sendMessage(chatId, "Неизвестный стиль аватара.");
        return;
      }
      void this.analytics.track(userId, `avatar_style_${styleKey}_selected`);
      void this.analytics.track(userId, "filter_selected", { category: "аватарки", key: styleKey });
      await this.confirmEdit(chatId, userId, {
        actionKey: "avatar",
        paidCost: config.actionCosts.avatar,
        prompt: buildAvatarPrompt(styleKey),
        resultLabel: AVATAR_STYLES[styleKey].label
      });
      return;
    }

    if (data.startsWith("photoshoot:")) {
      const templateKey = data.slice("photoshoot:".length);
      if (!PHOTOSHOOT_TEMPLATES[templateKey]) {
        await this.telegram.sendMessage(chatId, "Неизвестный шаблон фотосессии.");
        return;
      }
      void this.analytics.track(userId, `photoshoot_${templateKey}_selected`);
      void this.analytics.track(userId, "filter_selected", { category: "фотосессии", key: templateKey });
      await this.confirmEdit(chatId, userId, {
        actionKey: "photoshoot",
        paidCost: config.actionCosts.photoshoot,
        prompt: buildPhotoshootPrompt(templateKey),
        resultLabel: `Фотосессия: ${PHOTOSHOOT_TEMPLATES[templateKey].label.replace(/^\S+\s/, "")}`
      });
      return;
    }

    if (data.startsWith("background:")) {
      const optionKey = data.slice("background:".length);
      if (optionKey === "custom") {
        void this.analytics.track(userId, "background_custom_selected");
        await this.store.setPending(userId, "awaiting_custom_background");
        await this.telegram.sendMessage(chatId, "Опишите желаемый фон.");
        return;
      }
      if (!BACKGROUND_OPTIONS[optionKey]) {
        await this.telegram.sendMessage(chatId, "Неизвестный вариант фона.");
        return;
      }
      void this.analytics.track(userId, `background_${optionKey}_selected`);
      void this.analytics.track(userId, "filter_selected", { category: "инструменты", key: `фон_${optionKey}` });
      await this.confirmEdit(chatId, userId, {
        actionKey: "background",
        paidCost: config.actionCosts.background,
        prompt: buildBackgroundPrompt(optionKey)
      });
      return;
    }

    if (data.startsWith("buy:")) {
      const packKey = data.slice("buy:".length);
      const pack = config.packs[packKey];
      if (!pack) {
        await this.telegram.sendMessage(chatId, "Неизвестный пакет.");
        return;
      }
      void this.analytics.track(userId, "purchase_started", { pack_key: packKey, stars: pack.stars, credits: pack.credits });
      await this.telegram.sendInvoice(chatId, packKey, pack.stars, pack.credits);
      return;
    }

    if (data.startsWith("card:")) {
      const packKey = data.slice("card:".length);
      const pack = config.packs[packKey];
      if (!pack) {
        await this.telegram.sendMessage(chatId, "Неизвестный пакет.");
        return;
      }
      void this.analytics.track(userId, "card_purchase_selected", { pack_key: packKey, rubles: Number(packKey.slice(4)), credits: pack.credits });
      await this.telegram.sendMessage(
        chatId,
        (await this.store.getBotMessages(BOT_MESSAGE_DEFAULTS)).card_payment_unavailable,
        paymentMethodKeyboard()
      );
    }
  }

  async handlePreCheckout(preCheckoutQuery) {
    const payload = preCheckoutQuery.invoice_payload || "";
    const isCreditsPayload = /^credits:(pack(?:50|100|500|1000|149|299|690|990|1900)):\d+$/.test(payload);
    if (!isCreditsPayload) {
      await this.telegram.answerPreCheckoutQuery(
        preCheckoutQuery.id,
        false,
        "Неподдерживаемый платёж."
      );
      return;
    }
    await this.telegram.answerPreCheckoutQuery(preCheckoutQuery.id, true);
  }

  async handleSuccessfulPayment(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const payment = message.successful_payment;
    const payload = payment.invoice_payload || "";
    const match = /^credits:(pack(?:50|100|500|1000|149|299|690|990|1900)):(\d+)$/.exec(payload);
    if (!match) {
      await this.telegram.sendMessage(chatId, "Платёж получен, но пакет не удалось определить.");
      return;
    }

    const [, packKey, creditsRaw] = match;
    const credits = Number.parseInt(creditsRaw, 10);
    const newBalance = await this.store.grantCredits(userId, credits, {
      packKey,
      currency: payment.currency,
      totalAmount: payment.total_amount,
      telegramPaymentChargeId: payment.telegram_payment_charge_id
    });
    void this.analytics.track(userId, "purchase_completed", { pack_key: packKey, stars: payment.total_amount, credits });

    const user = await this.store.getUser(userId);
    await this.telegram.sendMessage(
      chatId,
      `Оплата прошла. Зачислено генераций: ${credits}.\nВаш баланс: ${newBalance} генераций.\n\n📷 Загрузите фото или выберите действие для последнего фото.`,
      user.lastPhoto?.fileId ? mainActionKeyboard() : welcomeKeyboard()
    );
  }

  async runEdit(chatId, userId, { actionKey, paidCost, prompt, resultLabel = null, sourcePhoto = null, templateAction = null }) {
      const user = await this.store.getUser(userId);
      const effectiveSourcePhoto = sourcePhoto || user.lastPhoto;
      if (!effectiveSourcePhoto?.fileId) {
        await this.telegram.sendMessage(chatId, "Сначала отправьте фото.");
      return;
    }

      const isTestUser = config.testUserIds.includes(userId);
      const entitlement = isTestUser
        ? { ok: true, source: "test", remainingPaidCredits: user.paidCredits }
        : await this.store.consumeEdit(userId, paidCost);
    if (!entitlement.ok) {
      const balance = await this.store.getBalanceSnapshot(userId);
      await this.telegram.sendMessage(
        chatId,
        [
          "Сейчас нет бесплатной попытки и недостаточно генераций.",
          "",
          formatBalance(balance),
          "",
          "Пополните баланс, чтобы продолжить."
        ].join("\n"),
        creditPackKeyboard()
      );
      return;
    }

    const jobId = await this.store.enqueueJob({
      userId,
      chatId,
      actionKey,
      paidCost,
      prompt,
      sourceType: actionKey,
      originalFileId: effectiveSourcePhoto.fileId,
      originalMimeType: effectiveSourcePhoto.mimeType,
      entitlementSource: entitlement.source,
      resultLabel,
      templateAction
    });
    await this.store.log("info", "bot", "Enqueued edit job", {
      jobId,
      userId,
      actionKey,
      entitlementSource: entitlement.source
    });
    await this.telegram.sendMessage(
      chatId,
      "Начинаем обработку фото. Это займёт несколько секунд.\n\nМожно закрыть Telegram — готовый результат придёт в этот чат."
    );
  }

  async confirmEdit(chatId, userId, edit) {
    const user = await this.store.getUser(userId);
    if (!(edit.sourcePhoto || user.lastPhoto)?.fileId) { await this.telegram.sendMessage(chatId, "Сначала загрузите фото."); return; }
    await this.store.setPending(userId, "confirm_edit", edit);
    void this.analytics.track(userId, "edit_confirmation_shown", { action_key: edit.actionKey, credits: edit.paidCost });
    const testMode = config.testUserIds.includes(userId);
    const balance = await this.store.getBalanceSnapshot(userId);
    const chargeText = testMode
      ? "Тестовый режим: генерации не будут списаны."
      : balance.starterFreeRemaining > 0
        ? "Спишется 1 стартовая бесплатная попытка."
        : balance.bonusFreeRemaining > 0
          ? "Спишется 1 бонусная бесплатная обработка."
        : balance.dailyFreeAvailable
          ? "Спишется бесплатная попытка на сегодня."
          : `Спишется: ${edit.paidCost} генерация.`;
    const requestPreview = edit.requestText
      ? `\n\nВаш запрос: «${edit.requestText.trim().slice(0, 300)}${edit.requestText.trim().length > 300 ? "…" : ""}»`
      : "";
    const selectionText = edit.resultLabel ? `Вы выбрали: «${edit.resultLabel}».\n\n` : "";
    const sourceText = edit.sourceLabel ? "Основа: готовый результат." : "Основа: исходное фото.";
    const identityText = "Лицо и человек на фото будут сохранены максимально похожими.";
    const extraText = edit.actionKey === "avatar"
      ? "Для лучшего сходства выберите фото, где лицо видно достаточно крупно."
      : edit.actionKey === "documents"
        ? "Будет создан вертикальный портрет со светлым фоном. Требования учреждений различаются — проверьте готовое фото перед подачей."
        : "";
    await this.telegram.sendMessage(
      chatId,
      `${selectionText}${sourceText}\n${chargeText}${requestPreview}\n\n${identityText}${extraText ? `\n\n${extraText}` : ""}\n\nПродолжить?`,
      confirmEditKeyboard(testMode || balance.starterFreeRemaining > 0 || balance.bonusFreeRemaining > 0 || balance.dailyFreeAvailable ? "✅ Использовать бесплатно" : "✅ Использовать генерацию")
    );
  }
}
