import { config } from "./config.js";
import { createAdminAndWebhookServer } from "./adminServer.js";
import { PhotoEditorBot } from "./bot.js";
import { ImageService } from "./imageService.js";
import { DatabaseStore } from "./store.js";
import { TelegramClient } from "./telegram.js";
import { JobWorker } from "./worker.js";
import { Analytics } from "./analytics.js";
import { YooKassaClient } from "./yookassa.js";

async function main() {
  const store = new DatabaseStore({
    connectionString: config.databaseUrl
  });
  await store.init();
  const recoveredJobIds = await store.recoverRecentlyInterruptedJobs();
  if (recoveredJobIds.length > 0) {
    console.log(`[bot] recovered interrupted jobs: ${recoveredJobIds.join(", ")}`);
  }

  const telegram = new TelegramClient(config.telegramBotToken);
  const analytics = new Analytics({
    measurementId: config.gaMeasurementId,
    apiSecret: config.gaApiSecret,
    yandexCounterId: config.yandexMetrikaCounterId,
    yandexToken: config.yandexMetrikaToken,
    store
  });
  await telegram.setMyCommands([
    { command: "start", description: "Начать работу" },
    { command: "help", description: "Помощь" },
    { command: "balance", description: "Баланс и бесплатные попытки" },
    { command: "buy", description: "Купить генерации" },
    { command: "referral", description: "Пригласить друга" },
    { command: "feedback", description: "Обратная связь" },
    { command: "terms", description: "Пользовательское соглашение" },
    { command: "privacy", description: "Политика конфиденциальности" }
  ]);
  if (config.miniAppUrl) {
    try {
      await telegram.setChatMenuButton("Фотостудия", config.miniAppUrl);
    } catch (error) {
      console.error("[bot] unable to configure Mini App menu button:", error.message);
    }
  }
  const imageService = new ImageService({
    apiKey: config.openAiApiKey,
    model: config.openAiImageModel
  });

  const bot = new PhotoEditorBot({
    telegram,
    store,
    imageService,
    analytics,
    yookassa: new YooKassaClient({ shopId: config.yookassaShopId, secretKey: config.yookassaSecretKey, returnUrl: config.yookassaReturnUrl, receiptEmail: config.yookassaReceiptEmail, receiptVatCode: config.yookassaReceiptVatCode })
  });
  if (bot.yookassa.enabled) {
    console.log("[bot] card payments enabled");
    setInterval(() => void bot.reconcilePendingCardPayments(), config.yookassaPollIntervalMs).unref();
    void bot.reconcilePendingCardPayments();
  } else {
    console.log("[bot] card payments disabled");
  }

  const worker = new JobWorker({
    store,
    telegram,
    imageService,
    analytics,
    idleDelayMs: config.pollIntervalMs
  });
  worker.start();

  const server = createAdminAndWebhookServer({
    port: config.serverPort,
    adminToken: config.adminToken,
    telegramBotToken: config.telegramBotToken,
    bot
  });
  await server.listen();

  if (config.runMode === "webhook") {
    if (!config.webhookPublicUrl) {
      throw new Error("WEBHOOK_PUBLIC_URL is required when RUN_MODE=webhook");
    }
    await telegram.setWebhook(`${config.webhookPublicUrl.replace(/\/$/, "")}/telegram/webhook`, false);
    console.log(`[bot] webhook mode started on port ${config.serverPort}`);
  } else {
    await telegram.deleteWebhook(false);
    console.log(`[bot] polling mode started on port ${config.serverPort}`);
    await bot.runForever();
  }
}

main().catch((error) => {
  console.error("[bot] fatal:", error);
  process.exitCode = 1;
});
