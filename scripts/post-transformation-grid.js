import fs from "fs";
import path from "path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const imagePath = "/tmp/transformation-grid.jpg";
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
if (!fs.existsSync(imagePath)) throw new Error(`Image is missing: ${imagePath}`);

const form = new FormData();
form.append("chat_id", "@neyrophoto_gpt");
form.append("photo", new Blob([fs.readFileSync(imagePath)]), path.basename(imagePath));
form.append("caption", "Один кадр — четыре разных настроения. ✨");
form.append("reply_markup", JSON.stringify({
  inline_keyboard: [[{
    text: "✨ Сделать своё фото",
    url: "https://t.me/gpt_photoeditor_bot?start=src_channel_transformation_grid",
  }]],
}));

const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: form });
const data = await response.json();
if (!data.ok) throw new Error(JSON.stringify(data));
console.log(JSON.stringify({ messageId: data.result.message_id }));
