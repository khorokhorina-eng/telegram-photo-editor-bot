import crypto from "node:crypto";

export class Analytics {
  constructor({ measurementId, apiSecret, yandexCounterId, yandexToken, store }) {
    this.measurementId = measurementId;
    this.apiSecret = apiSecret;
    this.yandexCounterId = yandexCounterId;
    this.yandexToken = yandexToken;
    this.store = store;
  }

  get enabled() {
    return Boolean(this.measurementId && this.apiSecret);
  }

  get yandexEnabled() {
    return Boolean(this.yandexCounterId && this.yandexToken);
  }

  clientId(userId) {
    // GA receives a stable anonymous identifier, never the Telegram user ID.
    const digest = crypto.createHash("sha256").update(String(userId)).digest("hex");
    return `${Number.parseInt(digest.slice(0, 12), 16)}.${Number.parseInt(digest.slice(12, 24), 16)}`;
  }

  async track(userId, name, params = {}) {
    // The local event log powers the human-readable bot dashboard. It stores
    // only Telegram's numeric user id, event name, and safe product metadata.
    try {
      await this.store?.trackAnalyticsEvent(userId, name, params);
    } catch (error) {
      console.error("[analytics] local event failed:", error.message);
    }

    const tasks = [];
    if (this.enabled) {
      tasks.push(fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(this.measurementId)}&api_secret=${encodeURIComponent(this.apiSecret)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          client_id: this.clientId(userId),
          events: [{ name, params: { ...params, engagement_time_msec: 1 } }]
        })
      }));
    }
    if (this.yandexEnabled) {
      const request = new URL("https://mc.yandex.ru/collect");
      request.searchParams.set("tid", this.yandexCounterId);
      request.searchParams.set("cid", this.clientId(userId));
      request.searchParams.set("t", "event");
      request.searchParams.set("ea", name);
      request.searchParams.set("dl", "https://t.me/gpt_photoeditor_bot");
      request.searchParams.set("ms", this.yandexToken);
      request.searchParams.set("params", JSON.stringify({ telegram_bot: { ...params } }));
      tasks.push(fetch(request, { method: "POST" }));
    }
    if (tasks.length === 0) return;
    try {
      await Promise.all(tasks);
    } catch (error) {
      // External analytics must never interrupt the user-facing bot flow.
      console.error("[analytics] remote event failed:", error.message);
    }
  }
}
