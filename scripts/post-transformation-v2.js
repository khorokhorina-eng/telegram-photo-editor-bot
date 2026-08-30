/* Replace the low-colour GIF with a high-quality MP4 animation in @neyrophoto_gpt. */
import fs from "fs";
import path from "path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = "@neyrophoto_gpt";
const oldMessageId = 15;
const animationPath = "/tmp/transformation-v2-20260828.mp4";

if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
if (!fs.existsSync(animationPath)) throw new Error(`Animation is missing: ${animationPath}`);

const form = new FormData();
form.append("chat_id", chatId);
form.append("animation", new Blob([fs.readFileSync(animationPath)]), path.basename(animationPath));
form.append("caption", "Одна фотография — четыре разных истории. ✨\n\nВыберите идею и сделайте свою.");
form.append("reply_markup", JSON.stringify({
  inline_keyboard: [[{
    text: "✨ Сделать своё фото",
    url: "https://t.me/gpt_photoeditor_bot?start=src_channel_transformation",
  }]],
}));

const response = await fetch(`https://api.telegram.org/bot${token}/sendAnimation`, {
  method: "POST",
  body: form,
});
const data = await response.json();
if (!data.ok) throw new Error(JSON.stringify(data));

const remove = await fetch(`https://api.telegram.org/bot${token}/deleteMessage`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ chat_id: chatId, message_id: oldMessageId }),
});
const removeData = await remove.json();
if (!removeData.ok) throw new Error(`New post sent, but old post was not deleted: ${JSON.stringify(removeData)}`);

console.log(JSON.stringify({ messageId: data.result.message_id, replacedMessageId: oldMessageId }));
