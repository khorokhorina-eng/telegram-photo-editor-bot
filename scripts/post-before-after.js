/* Publish one before/after promotional post to @neyrophoto_gpt. */
import fs from "fs";
import path from "path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = "@neyrophoto_gpt";
const imagePath = "/tmp/before-after-story-20260828.png";

if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
if (!fs.existsSync(imagePath)) throw new Error(`Image is missing: ${imagePath}`);

const form = new FormData();
form.append("chat_id", chatId);
form.append("photo", new Blob([fs.readFileSync(imagePath)]), path.basename(imagePath));
form.append("caption", `✨ Одно селфи — много образов\n\nНа карточках — одна и та же девушка в разных фотосессиях. Выберите идею, загрузите своё фото — и готовый результат придёт прямо в чат.\n\nДля лучшего сходства: лицо должно быть видно крупно, без очков и рук у лица.`);
form.append("reply_markup", JSON.stringify({
  inline_keyboard: [[{
    text: "✨ Открыть фотостудию",
    url: "https://t.me/gpt_photoeditor_bot?start=src_channel_before_after",
  }]],
}));

const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
  method: "POST",
  body: form,
});
const data = await response.json();
if (!data.ok) throw new Error(JSON.stringify(data));
const remove = await fetch(`https://api.telegram.org/bot${token}/deleteMessage`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ chat_id: chatId, message_id: 12 }),
});
const removeData = await remove.json();
console.log(JSON.stringify({ messageId: data.result.message_id, previousPostDeleted: removeData.ok }));
