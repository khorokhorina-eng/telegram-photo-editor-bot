# Telegram Photo Editor Bot

Telegram bot MVP for photo editing without a Web App.

## Features

- 3 free edits for each new user
- 1 free edit every day after the starter edits are used
- paid credit packs via Telegram Stars
- photo actions:
  - Improve Photo
  - Make Avatar
  - Change Background
  - Custom Prompt
- avatar styles:
  - AI Glamour
  - Art
  - Anime
  - Black & White
  - Cinematic
  - Business
  - Editorial
  - Y2K

## Requirements

- Node.js 20+
- Telegram bot token
- OpenAI API key with image editing access
- PostgreSQL

## Setup

1. Copy `.env.example` to `.env`
2. Start PostgreSQL:

```bash
docker compose up -d
```

3. If you are not using the bundled docker setup, create a PostgreSQL database manually:
- database: `telegram_photo_editor_bot`
- user: `postgres`
- password: `postgres`

4. Fill the environment variables
5. Install dependencies:

```bash
npm install
```

6. Run:

```bash
npm start
```

## Minimal local `.env`

```env
TELEGRAM_BOT_TOKEN=...
OPENAI_API_KEY=...
OPENAI_IMAGE_MODEL=gpt-image-1
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/telegram_photo_editor_bot
RUN_MODE=polling
PORT=8788
ADMIN_TOKEN=change_me
POLL_INTERVAL_MS=1200
PACK_10_STARS=250
PACK_30_STARS=600
PACK_100_STARS=1500
```

## Telegram setup

1. Create a bot with `@BotFather`
2. Copy the bot token into `.env`
3. Enable payments for digital goods with Telegram Stars
4. Run the bot with `npm start`
5. Open your bot in Telegram and send `/start`

## Useful commands

- `/start`
- `/help`
- `/balance`
- `/buy`

## Run modes

### Polling

Use for local development:

```env
RUN_MODE=polling
```

### Webhook

Use on a server:

```env
RUN_MODE=webhook
WEBHOOK_PUBLIC_URL=https://your-domain.com
```

The bot will listen on:

- `/telegram/webhook`
- `/admin?token=YOUR_ADMIN_TOKEN`
- `/healthz`

## Payment model

- New users: 3 free edits
- After starter edits are used: 1 free edit per day
- Paid packs:
  - 10 edits
  - 30 edits
  - 100 edits

Telegram Stars (`XTR`) are used for digital goods.

## Admin dashboard

Open:

```text
http://127.0.0.1:8788/admin?token=YOUR_ADMIN_TOKEN
```

It shows:
- users count
- jobs by status
- recent jobs
- recent logs

## Notes

- State and balances are stored in PostgreSQL.
- Image edits are queued in the `jobs` table and processed by a worker loop.
- `Change Background -> Remove Only` currently uses a prompt-based transparent cutout request. Depending on the image model output, you may prefer to send the result as a document instead of a compressed Telegram photo.
- In polling mode the bot removes any existing webhook on startup.
