import crypto from "node:crypto";
import http from "node:http";
import { URL } from "node:url";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const EVENT_LABELS = {
  bot_opened: "Открыли бота (/start)",
  photo_uploaded: "Загрузили фото",
  photo_instruction_received: "Добавили текст к фото",
  edit_confirmation_shown: "Увидели подтверждение",
  edit_confirmed: "Запустили обработку",
  generation_completed: "Получили результат",
  generation_failed: "Ошибка обработки",
  purchase_started: "Открыли оплату",
  purchase_completed: "Купили кредиты",
  result_feedback: "Оценили результат",
  retry_clicked: "Нажали «Повторить»",
  button_new_photo_clicked: "Нажали «Загрузить новое фото»",
  button_enhance_clicked: "Выбрали «Ретушь и качество»",
  button_avatar_clicked: "Открыли «Аватарки»",
  button_photoshoot_clicked: "Открыли «Фотосессии»",
  button_documents_clicked: "Открыли «Фото на документы»",
  button_background_clicked: "Открыли «Сменить фон»",
  button_custom_clicked: "Открыли «Свой запрос»",
  button_buy_clicked: "Открыли «Купить кредиты»",
  feedback_opened: "Открыли обратную связь",
  user_feedback_submitted: "Отправили обратную связь"
};

const ACTION_LABELS = {
  avatar: "Аватарки",
  photoshoot: "Фотосессии",
  background: "Смена фона",
  enhance: "Ретушь и качество",
  documents: "Фото на документы",
  custom: "Свой запрос"
};

function eventLabel(name) {
  if (EVENT_LABELS[name]) return EVENT_LABELS[name];
  if (name.startsWith("avatar_style_")) return `Аватарка: ${name.slice("avatar_style_".length, -"_selected".length).replaceAll("_", " ")}`;
  if (name.startsWith("photoshoot_")) return `Фотосессия: ${name.slice("photoshoot_".length, -"_selected".length).replaceAll("_", " ")}`;
  if (name.startsWith("background_")) return `Фон: ${name.slice("background_".length, -"_selected".length).replaceAll("_", " ")}`;
  return name.replaceAll("_", " ");
}

function actionLabel(action) {
  return ACTION_LABELS[action] || String(action).replaceAll("_", " ");
}

function templateLabel(templateKey) {
  return String(templateKey)
    .replace(/^photoshoot:/, "Фотосессия: ")
    .replace(/^avatar:/, "Аватарка: ")
    .replace(/^background:/, "Фон: ")
    .replaceAll("_", " ");
}

function renderDashboard(snapshot) {
  const stats = snapshot.stats;
  const analytics = snapshot.analytics;
  const funnel = analytics.funnel;
  const conversionFunnel = analytics.conversionFunnel;
  const period = analytics.days === 0 ? "за всё время" : `за ${analytics.days} дней`;
  const conversion = Number(funnel.opened_users) > 0 ? Math.round((Number(funnel.completed_users) / Number(funnel.opened_users)) * 100) : 0;
  const conversionSteps = [
    ["Запустили бот", Number(conversionFunnel.opened || 0)],
    ["Загрузили фото", Number(conversionFunnel.uploaded || 0)],
    ["Выбрали действие", Number(conversionFunnel.chose_action || 0)],
    ["Подтвердили обработку", Number(conversionFunnel.confirmed || 0)],
    ["Получили результат", Number(conversionFunnel.completed || 0)],
    ["Купили кредиты", Number(conversionFunnel.purchased || 0)]
  ];
  const conversionRows = conversionSteps.map(([label, users], index) => {
    const started = conversionSteps[0][1];
    const previous = index === 0 ? started : conversionSteps[index - 1][1];
    const fromStart = started > 0 ? Math.round((users / started) * 100) : 0;
    const fromPrevious = index === 0 ? "—" : `${previous > 0 ? Math.round((users / previous) * 100) : 0}%`;
    return `<tr><td>${label}</td><td>${users}</td><td>${fromStart}%</td><td>${fromPrevious}</td></tr>`;
  }).join("");
  const periodLinks = [7, 30, 90, 0].map((days) => `<a class="period ${analytics.days === days ? "active" : ""}" href="?token=__TOKEN__&days=${days}">${days === 0 ? "Всё время" : `${days} дней`}</a>`).join("");
  const eventRows = analytics.eventCounts.map((event) => `<tr><td>${escapeHtml(eventLabel(event.name))}</td><td>${escapeHtml(event.events)}</td><td>${escapeHtml(event.users)}</td></tr>`).join("");
  const dailyRows = analytics.daily.map((day) => `<tr><td>${escapeHtml(day.day)}</td><td>${escapeHtml(day.users)}</td><td>${escapeHtml(day.events)}</td></tr>`).join("");
  const sourceRows = analytics.acquisitionSources.map((source) => `<tr><td>${escapeHtml(source.source)}</td><td>${escapeHtml(source.users)}</td><td>${escapeHtml(source.uploaded_users)}</td></tr>`).join("");
  const usageRows = analytics.usage.map((item) => `<tr><td>${escapeHtml(actionLabel(item.action_key))}</td><td>${escapeHtml(item.item)}</td><td>${escapeHtml(item.launches)}</td><td>${escapeHtml(item.users)}</td><td>${escapeHtml(item.completed)}</td><td>${escapeHtml(item.failed)}</td></tr>`).join("");
  const miniAppRows = analytics.miniAppSelections.map((item) => `<tr><td>${escapeHtml(templateLabel(item.template_key))}</td><td>${escapeHtml(item.selections)}</td><td>${escapeHtml(item.users)}</td></tr>`).join("");
  const jobsRows = snapshot.jobs
    .map(
      (job) => `
        <tr>
          <td>${escapeHtml(job.id)}</td>
          <td>${escapeHtml(job.user_id)}</td>
          <td>${escapeHtml(job.action_key)}</td>
          <td>${escapeHtml(job.status)}</td>
          <td>${escapeHtml(job.paid_cost)}</td>
          <td>${escapeHtml(job.source_type)}</td>
          <td>${escapeHtml(job.error_message || "")}</td>
          <td>${escapeHtml(job.created_at)}</td>
        </tr>
      `
    )
    .join("");

  const logsRows = snapshot.logs
    .map(
      (log) => `
        <tr>
          <td>${escapeHtml(log.id)}</td>
          <td>${escapeHtml(log.level)}</td>
          <td>${escapeHtml(log.scope)}</td>
          <td>${escapeHtml(log.message)}</td>
          <td><pre>${escapeHtml(JSON.stringify(log.meta || {}, null, 2))}</pre></td>
          <td>${escapeHtml(log.created_at)}</td>
        </tr>
      `
    )
    .join("");

  const suggestionsRows = snapshot.suggestions
    .map(
      (suggestion) => `
        <tr>
          <td>${escapeHtml(suggestion.id)}</td>
          <td>${escapeHtml(suggestion.user_id)}</td>
          <td>${escapeHtml(suggestion.username || suggestion.display_name || "")}</td>
          <td>${escapeHtml(suggestion.message)}</td>
          <td>${escapeHtml(suggestion.created_at)}</td>
        </tr>
      `
    )
    .join("");
  const broadcastRows = snapshot.broadcasts
    .map((broadcast) => `
      <tr>
        <td>${escapeHtml(broadcast.id)}</td>
        <td>${escapeHtml(broadcast.status)}</td>
        <td>${escapeHtml(broadcast.target_count)}</td>
        <td>${escapeHtml(broadcast.delivered_count)}</td>
        <td>${escapeHtml(broadcast.failed_count)}</td>
        <td>${escapeHtml(broadcast.text)}</td>
        <td>${escapeHtml(broadcast.started_at)}</td>
      </tr>
    `)
    .join("");

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Панель управления фотоботом</title>
    <style>
      body { font-family: sans-serif; margin: 24px; background: #f7f7fb; color: #1f2937; }
      h1, h2 { margin-bottom: 12px; }
      .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 24px; }
      .card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
      .periods { display:flex; gap:8px; margin: 0 0 20px; flex-wrap:wrap; }
      .period { padding:8px 12px; border:1px solid #d1d5db; border-radius:8px; text-decoration:none; color:#374151; background:white; }
      .period.active { background:#2563eb; color:white; border-color:#2563eb; }
      .hint { color:#6b7280; margin-top:-4px; margin-bottom:16px; }
      .wide { overflow-x:auto; margin-bottom:24px; }
      table { width: 100%; border-collapse: collapse; background: white; }
      th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; vertical-align: top; font-size: 14px; }
      pre { margin: 0; white-space: pre-wrap; }
      textarea { width: 100%; max-width: 760px; min-height: 120px; font: inherit; padding: 10px; box-sizing: border-box; }
      input { font: inherit; padding: 8px; }
      button { font: inherit; padding: 10px 14px; cursor: pointer; }
      .broadcast { margin: 28px 0; background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; }
      .danger { background: #b91c1c; color: white; border: 0; border-radius: 8px; }
    </style>
  </head>
  <body>
    <h1>Панель управления фотоботом</h1>
    <div class="periods">${periodLinks}</div>
    <p class="hint">Аналитика ${escapeHtml(period)}. События в этой таблице сохраняются в базе бота; исторические данные начнут накапливаться после обновления.</p>
    <h2>Общая активность</h2>
    <div class="stats">
      <div class="card"><strong>Уникально открыли бот</strong><div>${escapeHtml(funnel.opened_users)}</div></div>
      <div class="card"><strong>Активных пользователей</strong><div>${escapeHtml(funnel.active_users)}</div></div>
      <div class="card"><strong>Загрузили фото</strong><div>${escapeHtml(funnel.uploaded_users)}</div></div>
      <div class="card"><strong>Запустили обработку</strong><div>${escapeHtml(funnel.confirmed_users)}</div></div>
      <div class="card"><strong>Получили результат</strong><div>${escapeHtml(funnel.completed_users)}</div><small>${conversion}% от открывших</small></div>
      <div class="card"><strong>Покупатели</strong><div>${escapeHtml(funnel.buyers)}</div><small>Всего событий: ${escapeHtml(funnel.events_count)}</small></div>
    </div>
    <h2>Воронка конверсии новых пользователей</h2>
    <p class="hint">В расчёт попадают пользователи, впервые запустившие бот в выбранный период. Каждый следующий шаг учитывается только после этого первого запуска. Тестовые аккаунты исключены.</p>
    <div class="wide"><table><thead><tr><th>Этап</th><th>Пользователей</th><th>От старта</th><th>Конверсия с прошлого шага</th></tr></thead><tbody>${conversionRows}</tbody></table></div>
    <h2>Клики и действия</h2>
    <div class="wide"><table><thead><tr><th>Действие</th><th>Количество</th><th>Уникальных пользователей</th></tr></thead><tbody>${eventRows || "<tr><td colspan=\"3\">Пока нет данных за выбранный период.</td></tr>"}</tbody></table></div>
    <h2>Что используют: шаблоны или «Свой запрос»</h2>
    <p class="hint">Это реальные запуски обработки. «Свой запрос» — текстовая обработка исходного или уже готового фото; остальные строки — фильтры и шаблоны.</p>
    <div class="wide"><table><thead><tr><th>Раздел</th><th>Фильтр / шаблон</th><th>Запусков</th><th>Уникальных пользователей</th><th>Готово</th><th>Ошибки</th></tr></thead><tbody>${usageRows || "<tr><td colspan=\"6\">Пока нет запусков за выбранный период.</td></tr>"}</tbody></table></div>
    <h2>Что выбирают в фотостудии</h2>
    <p class="hint">Выборы до подтверждения: видно интерес к шаблонам, даже если пользователь не запустил обработку.</p>
    <div class="wide"><table><thead><tr><th>Шаблон</th><th>Выборов</th><th>Уникальных пользователей</th></tr></thead><tbody>${miniAppRows || "<tr><td colspan=\"3\">Пока нет выборов за выбранный период.</td></tr>"}</tbody></table></div>
    <h2>Откуда пришли пользователи</h2>
    <p class="hint">Учитывается первая размеченная ссылка, например <code>?start=src_instagram</code>. «Без метки» — старые пользователи или прямые открытия бота.</p>
    <div class="wide"><table><thead><tr><th>Источник</th><th>Новых пользователей</th><th>Загрузили фото</th></tr></thead><tbody>${sourceRows || "<tr><td colspan=\"3\">За период пока нет новых пользователей.</td></tr>"}</tbody></table></div>
    <h2>Активность по дням</h2>
    <div class="wide"><table><thead><tr><th>День</th><th>Уникальных пользователей</th><th>Событий</th></tr></thead><tbody>${dailyRows || "<tr><td colspan=\"3\">Пока нет данных за выбранный период.</td></tr>"}</tbody></table></div>
    <h2>Финансы и качество — всё время</h2>
    <div class="stats">
      <div class="card"><strong>Пользователи / обработали фото</strong><div>${escapeHtml(stats.users_count)} / ${escapeHtml(stats.users_with_edits)}</div></div>
      <div class="card"><strong>Платящие / покупки</strong><div>${escapeHtml(stats.paying_users)} / ${escapeHtml(stats.purchases_count)}</div></div>
      <div class="card"><strong>Выручка</strong><div>${escapeHtml(stats.revenue_stars)} Stars</div><small>За 7 дней: ${escapeHtml(stats.revenue_stars_7d)} Stars</small></div>
      <div class="card"><strong>Готово / ошибки</strong><div>${escapeHtml(stats.completed_jobs)} / ${escapeHtml(stats.failed_jobs)}</div></div>
      <div class="card"><strong>Жалобы / возвраты</strong><div>${escapeHtml(stats.poor_results)} / ${escapeHtml(stats.refunded_results)}</div></div>
      <div class="card"><strong>Estimated OpenAI cost</strong><div>$${escapeHtml(Number(stats.estimated_openai_cost_usd).toFixed(2))}</div><small>$${escapeHtml(Number(stats.estimated_openai_cost_usd / Math.max(1, stats.completed_jobs)).toFixed(3))} per completed edit</small></div>
      <div class="card"><strong>Estimated net revenue</strong><div>${stats.estimated_net_revenue_usd === null ? "Set NET_USD_PER_STAR" : `$${escapeHtml(Number(stats.estimated_net_revenue_usd).toFixed(2))}`}</div><small>Revenue after configured Star payout and OpenAI estimate</small></div>
    </div>

    <h2>Последние обработки</h2>
    <div class="wide"><table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Action</th>
          <th>Status</th>
          <th>Cost</th>
          <th>Source</th>
          <th>Error</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>${jobsRows}</tbody>
    </table></div>

    <h2>Последние технические записи</h2>
    <div class="wide"><table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Level</th>
          <th>Scope</th>
          <th>Message</th>
          <th>Meta</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>${logsRows}</tbody>
    </table></div>
    <h2>Комментарии и идеи пользователей</h2>
    <div class="wide"><table>
      <thead><tr><th>ID</th><th>Telegram ID</th><th>Пользователь</th><th>Сообщение</th><th>Дата</th></tr></thead>
      <tbody>${suggestionsRows || "<tr><td colspan=\"5\">Пока нет комментариев.</td></tr>"}</tbody>
    </table></div>
    <section class="broadcast">
      <h2>Рассылка обновления</h2>
      <p class="hint">Получат пользователи, которые запускали бот, загружали фото или делали обработку. Текст отправляется без форматирования. Перед запуском введите слово <strong>РАЗОСЛАТЬ</strong> — это защита от случайной отправки.</p>
      <form method="post" action="/admin/broadcast?token=__TOKEN__" onsubmit="return confirm('Отправить это сообщение всем получателям?');">
        <p><textarea name="text" maxlength="4000" required placeholder="✨ В фотостудии появились новые шаблоны…"></textarea></p>
        <p><label>Подтверждение: <input name="confirmation" required autocomplete="off" placeholder="РАЗОСЛАТЬ" /></label></p>
        <button class="danger" type="submit">Отправить рассылку</button>
      </form>
    </section>
    <h2>Последние рассылки</h2>
    <div class="wide"><table>
      <thead><tr><th>ID</th><th>Статус</th><th>Получателей</th><th>Доставлено</th><th>Ошибок</th><th>Текст</th><th>Начата</th></tr></thead>
      <tbody>${broadcastRows || "<tr><td colspan=\"7\">Рассылок ещё не было.</td></tr>"}</tbody>
    </table></div>
  </body>
</html>`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verifyMiniAppInitData(initData, botToken) {
  const params = new URLSearchParams(initData || "");
  const receivedHash = params.get("hash");
  const rawUser = params.get("user");
  if (!receivedHash || !rawUser || !botToken) return null;
  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const expected = Buffer.from(calculatedHash, "hex");
  const received = Buffer.from(receivedHash, "hex");
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return null;
  try {
    const user = JSON.parse(rawUser);
    return Number.isSafeInteger(user?.id) ? user : null;
  } catch {
    return null;
  }
}

export function createAdminAndWebhookServer({ port, adminToken, telegramBotToken, bot }) {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://127.0.0.1:${port}`);

      if (req.method === "POST" && url.pathname === "/telegram/webhook") {
        const body = await readBody(req);
        const update = JSON.parse(body.toString("utf8"));
        await bot.handleUpdate(update);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      if (req.method === "POST" && url.pathname === "/miniapp/select") {
        const body = await readBody(req);
        const payload = JSON.parse(body.toString("utf8"));
        const user = verifyMiniAppInitData(payload?.initData, telegramBotToken);
        if (!user || typeof payload?.action !== "string" || !["new", "last"].includes(payload?.photoMode)) {
          res.writeHead(401, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: false }));
          return;
        }
        // Wait until the bot has posted the next chat message before closing
        // the Mini App. Telegram then returns the user to that newest message
        // instead of to the place where they opened the studio.
        const selection = bot.handleMiniAppData(user.id, user.id, JSON.stringify({
          type: "miniapp_action",
          action: payload.action,
          photoMode: payload.photoMode
        })).then(
          () => ({ delivered: true }),
          (error) => ({ delivered: false, error })
        );
        const result = await Promise.race([
          selection,
          new Promise((resolve) => setTimeout(() => resolve({ delivered: false, timedOut: true }), 8000))
        ]);
        if (result.error) {
          console.error("[miniapp] failed to process template selection", result.error);
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: false }));
          return;
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true, chatReady: result.delivered }));
        return;
      }

      if (req.method === "GET" && url.pathname === "/admin") {
        if (adminToken && url.searchParams.get("token") !== adminToken) {
          res.writeHead(401, { "content-type": "text/plain; charset=utf-8" });
          res.end("Unauthorized");
          return;
        }
        const requestedDays = Number.parseInt(url.searchParams.get("days") || "30", 10);
        const days = [7, 30, 90, 0].includes(requestedDays) ? requestedDays : 30;
        const snapshot = await bot.getAdminSnapshot(days);
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(renderDashboard(snapshot).replaceAll("__TOKEN__", encodeURIComponent(url.searchParams.get("token") || "")));
        return;
      }

      if (req.method === "POST" && url.pathname === "/admin/broadcast") {
        if (adminToken && url.searchParams.get("token") !== adminToken) {
          res.writeHead(401, { "content-type": "text/plain; charset=utf-8" });
          res.end("Unauthorized");
          return;
        }
        const form = new URLSearchParams((await readBody(req)).toString("utf8"));
        const text = (form.get("text") || "").trim();
        const confirmation = (form.get("confirmation") || "").trim().toUpperCase();
        if (!text || text.length > 4000 || confirmation !== "РАЗОСЛАТЬ") {
          res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
          res.end("Введите текст до 4000 символов и точное подтверждение: РАЗОСЛАТЬ");
          return;
        }
        const campaign = await bot.startBroadcast(text);
        res.writeHead(303, { location: `/admin?token=${encodeURIComponent(url.searchParams.get("token") || "")}` });
        res.end();
        return;
      }

      if (req.method === "GET" && url.pathname === "/healthz") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end(String(error?.message || error));
    }
  });

  return {
    listen() {
      return new Promise((resolve, reject) => {
        server.once("error", reject);
        // Polling does not require an internet-facing HTTP endpoint. Keep the
        // administrative interface on the server itself unless a reverse
        // proxy is explicitly configured for webhook mode.
        server.listen(port, "127.0.0.1", () => resolve(server));
      });
    },
    close() {
      return new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  };
}
