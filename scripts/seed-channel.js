/* Run on the production server with TELEGRAM_BOT_TOKEN configured. */
import fs from 'fs';
import path from 'path';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = '@neyrophoto_gpt';

if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

async function telegram(method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, body);
  const data = await response.json();
  if (!data.ok) throw new Error(`${method}: ${JSON.stringify(data)}`);
  return data.result;
}

async function sendPhoto(fileName, caption, source) {
  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('photo', new Blob([fs.readFileSync(fileName)]), path.basename(fileName));
  form.append('caption', caption);
  form.append('reply_markup', JSON.stringify({
    inline_keyboard: [[{
      text: '✨ Создать своё фото',
      url: `https://t.me/gpt_photoeditor_bot?start=${source}`,
    }]],
  }));
  return telegram('sendPhoto', { method: 'POST', body: form });
}

async function main() {
  const assets = '/var/www/photo-studio/assets/templates';
  const posts = [
    {
      image: '0.png',
      source: 'src_channel_pinned',
      caption: `✨ Нейрофотошоп — идеи для фото

Создавайте трендовые фото из своей фотографии: глянцевые фотосессии, аватарки, смена фона, ретушь и свой запрос.

Выберите образ, загрузите фото — и получите свой вариант. Лицо и черты сохраняем узнаваемыми.

Откройте фотостудию и выберите первую идею ↓`,
    },
    {
      image: '2.png',
      source: 'src_channel_autumn',
      caption: `🍂 Золотая осень

Тёплый fashion-кадр в золотом свете: шоколадная шляпа, объёмное пальто и мягкое солнце.

Повторите образ со своей фотографией ↓`,
    },
    {
      image: '3.png',
      source: 'src_channel_flash',
      caption: `📸 Flash-вечеринка

Вспышки, диско-шар, вечерний макияж и кадр как из модной съёмки.

Загрузите фото — и создайте свой праздничный образ ↓`,
    },
    {
      image: '5.png',
      source: 'src_channel_city',
      caption: `🏙 Городской кадр

Динамичный street-style: город, ветер в волосах и модный силуэт.

Выберите идею в фотостудии ↓`,
    },
    {
      image: 'retouch-before-after.png',
      source: 'src_channel_retouch',
      caption: `✨ Бережная ретушь и качество

Освежить фото, убрать мелкие недостатки или сделать фон аккуратнее — без замены человека на другого.

Откройте бот и напишите, что хотите изменить ↓`,
    },
  ];

  const messageIds = [];
  for (const post of posts) {
    const message = await sendPhoto(path.join(assets, post.image), post.caption, post.source);
    messageIds.push(message.message_id);
  }
  await telegram('pinChatMessage', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageIds[0], disable_notification: true }),
  });
  console.log(JSON.stringify({ messageIds, pinned: messageIds[0] }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
