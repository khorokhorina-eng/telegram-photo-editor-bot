/* Publish the fictional-woman transformation GIF to @neyrophoto_gpt. */
import fs from "fs";
import path from "path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = "@neyrophoto_gpt";
const animationPath = "/tmp/transformation-20260828.gif";

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
console.log(JSON.stringify({ messageId: data.result.message_id }));
