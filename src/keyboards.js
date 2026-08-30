import { config } from "./config.js";
import { AVATAR_STYLES, BACKGROUND_OPTIONS, PHOTOSHOOT_TEMPLATES } from "./prompts.js";

function inlineKeyboard(rows) {
  return { inline_keyboard: rows };
}

function mainActionRows({ includeCustom = true } = {}) {
  const rows = [];
  if (includeCustom) {
    rows.push([{ text: "✍️ Свой запрос · 1 генерация", callback_data: "action:custom" }]);
  }
  rows.push([{ text: "📷 Загрузить новое фото", callback_data: "nav:new_photo" }]);
  return rows;
}

export function bottomMenuKeyboard() {
  return {
    keyboard: [
      [{ text: "🔥 Трендовые фото", web_app: { url: config.miniAppUrl } }],
      [{ text: "💡 Как выбрать фото" }, { text: "👛 Баланс" }],
      [{ text: "💰 Пригласить друга" }, { text: "🏠 Главное меню" }]
    ],
    resize_keyboard: true,
    is_persistent: true
  };
}

export function mainActionKeyboard() {
  return inlineKeyboard(mainActionRows());
}

export function legalKeyboard() {
  return inlineKeyboard([
    [{ text: "📷 Загрузить фото", callback_data: "nav:new_photo" }],
    [{ text: "↩️ Назад", callback_data: "legal:back" }]
  ]);
}

export function welcomeKeyboard() {
  return inlineKeyboard([
    [{ text: "✨ Трендовые фото", web_app: { url: config.miniAppUrl } }],
    [{ text: "✍️ Свой запрос", callback_data: "action:custom" }],
    [{ text: "💬 Обратная связь", callback_data: "nav:feedback" }],
    [{ text: "Пользовательское соглашение", callback_data: "legal:terms" }, { text: "Политика конфиденциальности", callback_data: "legal:privacy" }]
  ]);
}

export function confirmEditKeyboard(confirmLabel = "✅ Продолжить") {
  return inlineKeyboard([[{ text: confirmLabel, callback_data: "confirm:yes" }], [{ text: "↩️ Отмена", callback_data: "confirm:no" }]]);
}

export function resultKeyboard(jobId, paidCost) {
  return inlineKeyboard([
    [{ text: "✏️ Доработать этот вариант · 1 генерация", callback_data: "action:custom_result" }],
    [{ text: `🔄 Ещё вариант · ${paidCost} генерация`, callback_data: `retry:${jobId}` }],
    [{ text: "📷 Загрузить новое фото", callback_data: "nav:new_photo" }]
  ]);
}

export function avatarStyleKeyboard() {
  const rows = Object.entries(AVATAR_STYLES).map(([key, value]) => [
    { text: value.label, callback_data: `avatar:${key}` }
  ]);
  rows.push([{ text: "↩️ Назад", callback_data: "nav:main" }]);
  return inlineKeyboard(rows);
}

export function photoshootKeyboard() {
  const rows = Object.entries(PHOTOSHOOT_TEMPLATES).map(([key, value]) => [
    { text: value.label, callback_data: `photoshoot:${key}` }
  ]);
  rows.push([{ text: "↩️ Назад", callback_data: "nav:main" }]);
  return inlineKeyboard(rows);
}

export function backgroundKeyboard() {
  const order = [
    "remove_only",
    "white",
    "studio",
    "office",
    "sea",
    "mountains",
    "sunset",
    "city"
  ];
  const rows = order.map((key) => [
    { text: BACKGROUND_OPTIONS[key].label, callback_data: `background:${key}` }
  ]);
  rows.push([{ text: "Свой фон", callback_data: "background:custom" }]);
  rows.push([{ text: "↩️ Назад", callback_data: "nav:main" }]);
  return inlineKeyboard(rows);
}

export function creditPackKeyboard() {
  return inlineKeyboard([
    [{ text: "149 ⭐ → 30 генераций (5 ⭐/ген)", callback_data: "buy:pack149" }],
    [{ text: "299 ⭐ → 65 генераций (4.6 ⭐/ген)", callback_data: "buy:pack299" }],
    [{ text: "690 ⭐ → 170 генераций (4.1 ⭐/ген)", callback_data: "buy:pack690" }],
    [{ text: "990 ⭐ → 270 генераций (3.7 ⭐/ген)", callback_data: "buy:pack990" }],
    [{ text: "1900 ⭐ → 540 генераций (3.5 ⭐/ген)", callback_data: "buy:pack1900" }],
    [{ text: "↩️ Назад", callback_data: "payment:methods" }]
  ]);
}

export function paymentMethodKeyboard() {
  return inlineKeyboard([
    [
      { text: "💳 Карта / СБП", callback_data: "payment:card" },
      { text: "⭐ Звёзды", callback_data: "payment:stars" }
    ]
  ]);
}

export function cardPackKeyboard() {
  return inlineKeyboard([
    [{ text: "149 ₽ → 30 генераций (5 ₽/ген)", callback_data: "card:pack149" }],
    [{ text: "299 ₽ → 65 генераций (4.6 ₽/ген)", callback_data: "card:pack299" }],
    [{ text: "690 ₽ → 170 генераций (4.1 ₽/ген)", callback_data: "card:pack690" }],
    [{ text: "990 ₽ → 270 генераций (3.7 ₽/ген)", callback_data: "card:pack990" }],
    [{ text: "1900 ₽ → 540 генераций (3.5 ₽/ген)", callback_data: "card:pack1900" }],
    [{ text: "↩️ Назад", callback_data: "payment:methods" }]
  ]);
}

export function referralKeyboard(referralLink) {
  const shareText = "Попробуй «Фоторедактор онлайн» — там можно сделать фотосессию, аватарку или отредактировать фото с ИИ.";
  return inlineKeyboard([
    [{ text: "📤 Поделиться ссылкой", url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}` }],
    [{ text: "↩️ Главное меню", callback_data: "nav:main" }]
  ]);
}
