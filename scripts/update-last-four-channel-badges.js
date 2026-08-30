/* Replace media in the four latest channel posts while preserving captions and CTA buttons. */
import fs from "fs";
import path from "path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = "@neyrophoto_gpt";

if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

const posts = [
  {
    messageId: 7,
    type: "photo",
    file: "/tmp/channel-telegram-badges/retouch.png",
    caption: `✨ Бережная ретушь и качество

Освежить фото, убрать мелкие недостатки или сделать фон аккуратнее — без замены человека на другого.

Откройте бот и напишите, что хотите изменить ↓`,
    button: { text: "✨ Создать своё фото", source: "src_channel_retouch" },
  },
  {
    messageId: 13,
    type: "photo",
    file: "/tmp/channel-telegram-badges/before-after.png",
    caption: `✨ Одно селфи — много образов

На карточках — одна и та же девушка в разных фотосессиях. Выберите идею, загрузите своё фото — и готовый результат придёт прямо в чат.

Для лучшего сходства: лицо должно быть видно крупно, без очков и рук у лица.`,
    button: { text: "✨ Открыть фотостудию", source: "src_channel_before_after" },
  },
  {
    messageId: 16,
    type: "photo",
    file: "/tmp/channel-telegram-badges/transformation-grid.png",
    caption: "Один кадр — четыре разных настроения. ✨",
    button: { text: "✨ Сделать своё фото", source: "src_channel_transformation_grid" },
  },
  {
    messageId: 17,
    type: "animation",
    file: "/tmp/channel-telegram-badges/transformation.mp4",
    caption: "Одна фотография — четыре разных истории. ✨\n\nВыберите идею и сделайте свою.",
    button: { text: "✨ Сделать своё фото", source: "src_channel_transformation" },
  },
];

async function updatePost(post) {
  if (!fs.existsSync(post.file)) throw new Error(`Media is missing: ${post.file}`);

  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("message_id", String(post.messageId));
  form.append("media", JSON.stringify({
    type: post.type,
    media: "attach://attachment",
    caption: post.caption,
  }));
  form.append("attachment", new Blob([fs.readFileSync(post.file)]), path.basename(post.file));
  form.append("reply_markup", JSON.stringify({
    inline_keyboard: [[{
      text: post.button.text,
      url: `https://t.me/gpt_photoeditor_bot?start=${post.button.source}`,
    }]],
  }));

  const response = await fetch(`https://api.telegram.org/bot${token}/editMessageMedia`, {
    method: "POST",
    body: form,
  });
  const data = await response.json();
  if (!data.ok) throw new Error(`Post #${post.messageId}: ${JSON.stringify(data)}`);
  return post.messageId;
}

const updated = [];
for (const post of posts) updated.push(await updatePost(post));
console.log(JSON.stringify({ updated }));
