const API_ROOT = "https://api.telegram.org";
const FILE_ROOT = "https://api.telegram.org/file";

function extensionFromMimeType(mimeType = "") {
  if (mimeType === "image/png") {
    return "png";
  }
  if (mimeType === "image/webp") {
    return "webp";
  }
  if (mimeType === "image/heic" || mimeType === "image/heif") {
    return "heic";
  }
  return "jpg";
}

function imageMimeTypeFrom({ buffer, filePath = "", contentType = "" }) {
  // Telegram's file CDN frequently responds with application/octet-stream for
  // photos. Inspect the bytes first, then fall back to the file extension.
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer.subarray(1, 4).toString("ascii") === "PNG"
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  // HEIC/HEIF use an ISO base media file container. Telegram often labels a
  // document as application/octet-stream, so recognise the container brand.
  if (buffer.length >= 12 && buffer.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("ascii").toLowerCase();
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand)) return "image/heic";
  }

  const lowerPath = filePath.toLowerCase();
  if (lowerPath.endsWith(".png")) return "image/png";
  if (lowerPath.endsWith(".webp")) return "image/webp";
  if (lowerPath.endsWith(".heic") || lowerPath.endsWith(".heif")) return "image/heic";
  if (lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) return "image/jpeg";

  const normalizedContentType = contentType.split(";", 1)[0].toLowerCase();
  return ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(normalizedContentType)
    ? normalizedContentType
    : null;
}

export class TelegramClient {
  constructor(token) {
    this.token = token;
    this.baseUrl = `${API_ROOT}/bot${token}`;
    this.fileBaseUrl = `${FILE_ROOT}/bot${token}`;
  }

  async call(method, payload = undefined, options = {}) {
    const response = await fetch(`${this.baseUrl}/${method}`, {
      method: "POST",
      body: payload instanceof FormData ? payload : payload ? JSON.stringify(payload) : undefined,
      headers:
        payload && !(payload instanceof FormData)
          ? { "content-type": "application/json" }
          : undefined,
      signal: options.signal
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Telegram API error in ${method}: ${data.description || "Unknown error"}`);
    }
    return data.result;
  }

  async getUpdates(offset, timeoutSeconds = 25) {
    return this.call("getUpdates", {
      offset,
      timeout: timeoutSeconds,
      allowed_updates: [
        "message",
        "callback_query",
        "pre_checkout_query"
      ]
    });
  }

  async deleteWebhook(dropPendingUpdates = false) {
    return this.call("deleteWebhook", { drop_pending_updates: dropPendingUpdates });
  }

  async setWebhook(url, dropPendingUpdates = false) {
    return this.call("setWebhook", {
      url,
      drop_pending_updates: dropPendingUpdates
    });
  }

  async setMyCommands(commands) {
    return this.call("setMyCommands", { commands });
  }

  async setChatMenuButton(text, url) {
    return this.call("setChatMenuButton", {
      menu_button: { type: "web_app", text, web_app: { url } }
    });
  }

  async sendMessage(chatId, text, replyMarkup = null, parseMode = null, options = {}) {
    return this.call("sendMessage", {
      chat_id: chatId,
      text,
      reply_markup: replyMarkup || undefined,
      parse_mode: parseMode || undefined,
      link_preview_options: options.disableLinkPreview ? { is_disabled: true } : undefined
    });
  }

  async answerCallbackQuery(callbackQueryId, text = "") {
    return this.call("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      text: text || undefined
    });
  }

  async editMessageReplyMarkup(chatId, messageId, replyMarkup = null) {
    return this.call("editMessageReplyMarkup", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: replyMarkup || undefined
    });
  }

  async editMessageText(chatId, messageId, text, replyMarkup = null, parseMode = null) {
    return this.call("editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: replyMarkup || undefined,
      parse_mode: parseMode || undefined,
      link_preview_options: { is_disabled: true }
    });
  }

  async sendPhoto(chatId, buffer, filename, caption = "", mimeType = "image/png") {
    const form = new FormData();
    form.append("chat_id", String(chatId));
    if (caption) {
      form.append("caption", caption);
    }
    form.append("photo", new Blob([buffer], { type: mimeType }), filename);
    return this.call("sendPhoto", form);
  }

  async sendDocument(chatId, buffer, filename, caption = "", mimeType = "image/png") {
    const form = new FormData();
    form.append("chat_id", String(chatId));
    if (caption) {
      form.append("caption", caption);
    }
    form.append("document", new Blob([buffer], { type: mimeType }), filename);
    return this.call("sendDocument", form);
  }

  async sendInvoice(chatId, packKey, stars, credits) {
    return this.call("sendInvoice", {
      chat_id: chatId,
      title: `${credits} генераций фото`,
      description: `Пополнение: ${credits} генераций для обработки фото.`,
      payload: `credits:${packKey}:${credits}`,
      currency: "XTR",
      prices: [{ label: `${credits} генераций`, amount: stars }]
    });
  }

  async answerPreCheckoutQuery(id, ok, errorMessage = "") {
    return this.call("answerPreCheckoutQuery", {
      pre_checkout_query_id: id,
      ok,
      error_message: ok ? undefined : errorMessage
    });
  }

  async getFile(fileId) {
    return this.call("getFile", { file_id: fileId });
  }

  async downloadFile(fileId) {
    const file = await this.getFile(fileId);
    const response = await fetch(`${this.fileBaseUrl}/${file.file_path}`);
    if (!response.ok) {
      throw new Error(`Failed to download Telegram file: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageMimeTypeFrom({
      buffer,
      filePath: file.file_path,
      contentType: response.headers.get("content-type") || ""
    });
    if (!mimeType) {
      throw new Error("Unsupported image format. Send a JPEG, PNG, WebP, or HEIC image.");
    }
    const extension = extensionFromMimeType(mimeType);
    return {
      buffer,
      mimeType,
      filePath: file.file_path,
      filename: `source.${extension}`
    };
  }
}
