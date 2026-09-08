import crypto from "node:crypto";
import net from "node:net";

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3";
const YOOKASSA_WEBHOOK_NETWORKS = [
  ["185.71.76.0", 27], ["185.71.77.0", 27], ["77.75.153.0", 25],
  ["77.75.156.11", 32], ["77.75.156.35", 32], ["77.75.154.128", 25],
  ["2a02:5180::", 32]
];

function ipToBigInt(address) {
  const family = net.isIP(address);
  if (family === 4) return address.split(".").reduce((value, part) => (value << 8n) + BigInt(part), 0n);
  if (family !== 6) return null;
  const [left, right = ""] = address.toLowerCase().split("::");
  const leftParts = left ? left.split(":") : [];
  const rightParts = right ? right.split(":") : [];
  const parts = [...leftParts, ...Array(Math.max(0, 8 - leftParts.length - rightParts.length)).fill("0"), ...rightParts];
  if (parts.length !== 8) return null;
  return parts.reduce((value, part) => (value << 16n) + BigInt(`0x${part || "0"}`), 0n);
}

export function isYooKassaWebhookIp(address) {
  const clean = String(address || "").trim().replace(/^::ffff:/, "");
  const family = net.isIP(clean);
  const value = ipToBigInt(clean);
  if (!family || value === null) return false;
  return YOOKASSA_WEBHOOK_NETWORKS.some(([network, prefix]) => {
    const networkFamily = net.isIP(network);
    if (networkFamily !== family) return false;
    const bits = BigInt(family === 4 ? 32 : 128);
    const mask = ((1n << bits) - 1n) ^ ((1n << (bits - BigInt(prefix))) - 1n);
    return (value & mask) === (ipToBigInt(network) & mask);
  });
}

export class YooKassaClient {
  constructor({ shopId, secretKey, returnUrl, receiptEmail, receiptVatCode }) {
    this.shopId = shopId;
    this.secretKey = secretKey;
    this.returnUrl = returnUrl;
    this.receiptEmail = receiptEmail;
    this.receiptVatCode = receiptVatCode;
  }

  get enabled() { return Boolean(this.shopId && this.secretKey); }

  async request(path, { method = "GET", body, idempotenceKey } = {}) {
    if (!this.enabled) throw new Error("YooKassa is not configured");
    const auth = Buffer.from(`${this.shopId}:${this.secretKey}`).toString("base64");
    const response = await fetch(`${YOOKASSA_API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        ...(idempotenceKey ? { "Idempotence-Key": idempotenceKey } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.description || `YooKassa HTTP ${response.status}`);
    return payload;
  }

  async createPayment({ telegramUserId, packKey, credits, rubles }) {
    const amount = `${Number(rubles).toFixed(2)}`;
    const body = {
      amount: { value: amount, currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: this.returnUrl },
      description: `${credits} генераций фото · @gpt_photoeditor_bot · id ${telegramUserId}`,
      metadata: { telegram_user_id: String(telegramUserId), pack_key: packKey, credits: String(credits) }
    };
    if (this.receiptEmail) {
      body.receipt = { customer: { email: this.receiptEmail }, items: [{ description: `${credits} генераций фото`, quantity: "1.00", amount: { value: amount, currency: "RUB" }, vat_code: this.receiptVatCode, payment_mode: "full_payment", payment_subject: "service" }] };
    }
    return this.request("/payments", { method: "POST", body, idempotenceKey: crypto.randomUUID() });
  }

  getPayment(paymentId) { return this.request(`/payments/${encodeURIComponent(paymentId)}`); }
}
