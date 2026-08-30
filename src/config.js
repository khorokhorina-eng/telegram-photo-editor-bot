import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(ROOT_DIR, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const idx = trimmed.indexOf("=");
    if (idx < 0) {
      continue;
    }
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

await loadEnvFile();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function csvNumbers(value = "") {
  return value.split(",").map((item) => Number(item.trim())).filter(Number.isSafeInteger);
}

export const config = {
  rootDir: ROOT_DIR,
  dataDir: path.resolve(ROOT_DIR, process.env.DATA_DIR || "./data"),
  telegramBotToken: requireEnv("TELEGRAM_BOT_TOKEN"),
  telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || "gpt_photoeditor_bot",
  openAiApiKey: requireEnv("OPENAI_API_KEY"),
  databaseUrl: requireEnv("DATABASE_URL"),
  // GPT Image 2 gives substantially better instruction following and image-edit
  // fidelity while retaining the Images edits API used by the bot.
  openAiImageModel: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
  pollIntervalMs: toInt(process.env.POLL_INTERVAL_MS, 1200),
  serverPort: toInt(process.env.PORT, 8788),
  runMode: process.env.RUN_MODE || "polling",
  webhookPublicUrl: process.env.WEBHOOK_PUBLIC_URL || "",
  // Mini Apps are available only over HTTPS. This path is served by the
  // existing HTTPS site until a dedicated branded domain is added.
  miniAppUrl: process.env.MINI_APP_URL || "https://voicetext.world/photo-studio/",
  adminToken: process.env.ADMIN_TOKEN || "",
  starterFreeEdits: 3,
  dailyFreeEdits: 1,
  packs: {
    pack149: { credits: 30, stars: toInt(process.env.PACK_149_STARS, 149) },
    pack299: { credits: 65, stars: toInt(process.env.PACK_299_STARS, 299) },
    pack690: { credits: 170, stars: toInt(process.env.PACK_690_STARS, 690) },
    pack990: { credits: 270, stars: toInt(process.env.PACK_990_STARS, 990) },
    pack1900: { credits: 540, stars: toInt(process.env.PACK_1900_STARS, 1900) }
  },
  actionCosts: {
    // One paid credit equals one completed generation in every mode.
    enhance: 1,
    avatar: 1,
    photoshoot: 1,
    documents: 1,
    background: 1,
    custom: 1
  },
  // Estimate, not an invoice: input-image token usage varies with each photo.
  estimatedOpenAiCostUsd: toNumber(process.env.ESTIMATED_OPENAI_COST_USD_PER_EDIT, 0.12),
  netUsdPerStar: toNumber(process.env.NET_USD_PER_STAR, 0),
  gaMeasurementId: process.env.GA_MEASUREMENT_ID || "",
  gaApiSecret: process.env.GA_API_SECRET || "",
  yandexMetrikaCounterId: process.env.YANDEX_METRIKA_COUNTER_ID || "",
  yandexMetrikaToken: process.env.YANDEX_METRIKA_TOKEN || "",
  // The bot owner's Telegram chat. Feedback is also sent here immediately.
  feedbackRecipientChatId: toInt(process.env.FEEDBACK_RECIPIENT_CHAT_ID, 152555880),
  testUserIds: csvNumbers(process.env.TEST_USER_IDS || "")
};
