import { Pool } from "pg";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export class DatabaseStore {
  constructor({ connectionString }) {
    this.pool = new Pool({
      connectionString
    });
  }

  async init() {
    await this.pool.query(`
      create table if not exists users (
        user_id bigint primary key,
        starter_free_remaining integer not null default 3,
        bonus_free_remaining integer not null default 0,
        starter_exhausted_notice_seen boolean not null default false,
        daily_free_used_on text,
        paid_credits integer not null default 0,
        last_photo jsonb,
        last_result_photo jsonb,
        photo_tips_seen boolean not null default false,
        referrer_user_id bigint,
        acquisition_source text,
        pending_action text,
        pending_payload jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `);

    await this.pool.query(`
      create table if not exists payments (
        id bigserial primary key,
        user_id bigint not null references users(user_id) on delete cascade,
        credits integer not null,
        pack_key text,
        currency text,
        total_amount integer,
        telegram_payment_charge_id text,
        type text,
        reason text,
        created_at timestamptz not null default now()
      );
    `);

    await this.pool.query(`
      create table if not exists card_payments (
        id bigserial primary key,
        yookassa_payment_id text not null unique,
        user_id bigint not null references users(user_id) on delete cascade,
        chat_id bigint not null,
        pack_key text not null,
        credits integer not null,
        amount_rub integer not null,
        status text not null,
        confirmation_url text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        credited_at timestamptz
      );
    `);
    await this.pool.query(`create index if not exists card_payments_pending_idx on card_payments(status, created_at) where credited_at is null;`);
    await this.pool.query(`create index if not exists card_payments_user_created_idx on card_payments(user_id, created_at desc);`);

    await this.pool.query(`
      create table if not exists jobs (
        id bigserial primary key,
        user_id bigint not null references users(user_id) on delete cascade,
        chat_id bigint not null,
        action_key text not null,
        paid_cost integer not null,
        prompt text not null,
        source_type text not null,
        original_file_id text not null,
        original_mime_type text,
        entitlement_source text not null,
        status text not null default 'pending',
        error_message text,
        output_file_name text,
        created_at timestamptz not null default now(),
        started_at timestamptz,
        completed_at timestamptz
      );
    `);

    await this.pool.query(`
      alter table jobs
      add column if not exists feedback text,
      add column if not exists refund_granted boolean not null default false,
      add column if not exists result_label text,
      add column if not exists template_action text;
    `);

    await this.pool.query(`
      alter table users add column if not exists starter_exhausted_notice_seen boolean not null default false;
    `);

    await this.pool.query(`
      alter table users add column if not exists bonus_free_remaining integer not null default 0;
    `);

    await this.pool.query(`
      alter table users
      add column if not exists last_result_photo jsonb,
      add column if not exists photo_tips_seen boolean not null default false,
      add column if not exists referrer_user_id bigint,
      add column if not exists acquisition_source text;
    `);

    await this.pool.query(`
      create index if not exists users_referrer_user_id_idx on users(referrer_user_id);
    `);

    await this.pool.query(`
      create index if not exists users_acquisition_source_idx on users(acquisition_source);
    `);

    await this.pool.query(`
      create index if not exists jobs_status_created_idx on jobs(status, created_at);
    `);

    await this.pool.query(`
      create table if not exists logs (
        id bigserial primary key,
        level text not null,
        scope text not null,
        message text not null,
        meta jsonb,
        created_at timestamptz not null default now()
      );
    `);

    await this.pool.query(`
      create table if not exists analytics_events (
        id bigserial primary key,
        user_id bigint not null references users(user_id) on delete cascade,
        name text not null,
        params jsonb,
        created_at timestamptz not null default now()
      );
    `);

    await this.pool.query(`
      create table if not exists user_suggestions (
        id bigserial primary key,
        user_id bigint not null references users(user_id) on delete cascade,
        chat_id bigint not null,
        username text,
        display_name text,
        message text not null,
        created_at timestamptz not null default now()
      );
    `);

    await this.pool.query(`
      create index if not exists user_suggestions_created_idx
      on user_suggestions(created_at desc);
    `);

    await this.pool.query(`
      create index if not exists analytics_events_created_idx
      on analytics_events(created_at desc);
    `);

    await this.pool.query(`
      create index if not exists analytics_events_name_created_idx
      on analytics_events(name, created_at desc);
    `);

    await this.pool.query(`
      create table if not exists broadcast_campaigns (
        id bigserial primary key,
        text text not null,
        status text not null default 'sending',
        target_count integer not null default 0,
        delivered_count integer not null default 0,
        failed_count integer not null default 0,
        started_at timestamptz not null default now(),
        finished_at timestamptz
      );
    `);

    await this.pool.query(`
      create table if not exists bot_messages (
        key text primary key,
        text text not null,
        updated_at timestamptz not null default now()
      );
    `);
  }

  async getBotMessages(defaults) {
    const { rows } = await this.pool.query(
      `select key, text from bot_messages where key = any($1::text[])`,
      [Object.keys(defaults)]
    );
    return { ...defaults, ...Object.fromEntries(rows.map((row) => [row.key, row.text])) };
  }

  async updateBotMessages(messages, defaults) {
    const entries = Object.entries(messages)
      .filter(([key]) => Object.hasOwn(defaults, key))
      .map(([key, text]) => [key, String(text || "").trim()]);
    if (entries.some(([, text]) => !text || text.length > 4000)) {
      throw new Error("Каждое сообщение должно содержать от 1 до 4000 символов.");
    }
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      for (const [key, text] of entries) {
        await client.query(
          `insert into bot_messages(key, text) values ($1, $2)
           on conflict (key) do update set text = excluded.text, updated_at = now()`,
          [key, text]
        );
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
  }

  async recoverRecentlyInterruptedJobs(maxAgeMinutes = 30) {
    const { rows } = await this.pool.query(
      `
      update jobs
      set status = 'pending',
          started_at = null,
          error_message = null
      where status = 'processing'
        and started_at >= now() - ($1 * interval '1 minute')
      returning id
      `,
      [maxAgeMinutes]
    );
    return rows.map((row) => Number(row.id));
  }

  async ensureUser(userId) {
    await this.pool.query(
      `
      insert into users(user_id)
      values ($1)
      on conflict (user_id) do nothing
      `,
      [userId]
    );
  }

  async captureAcquisitionSource(userId, source) {
    await this.ensureUser(userId);
    const { rows } = await this.pool.query(
      `
      update users
      set acquisition_source = $2,
          updated_at = now()
      where user_id = $1
        and acquisition_source is null
      returning acquisition_source
      `,
      [userId, source]
    );
    return rows[0]?.acquisition_source || null;
  }

  async registerReferral(userId, referrerUserId) {
    if (!Number.isSafeInteger(userId) || !Number.isSafeInteger(referrerUserId) || userId === referrerUserId) {
      return { registered: false, bonusGranted: false };
    }
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const referrerExists = await client.query(
        `select exists(select 1 from users where user_id = $1) as value`,
        [referrerUserId]
      );
      if (!referrerExists.rows[0].value) {
        await client.query("rollback");
        return { registered: false, bonusGranted: false };
      }
      const inserted = await client.query(
        `
        insert into users(user_id, referrer_user_id)
        values ($1, $2)
        on conflict (user_id) do nothing
        returning user_id
        `,
        [userId, referrerUserId]
      );
      if (inserted.rowCount === 0) {
        await client.query("commit");
        return { registered: false, bonusGranted: false };
      }
      const reward = await client.query(
        `
        update users
        set bonus_free_remaining = bonus_free_remaining + 3,
            updated_at = now()
        where user_id = $1
        returning bonus_free_remaining
        `,
        [referrerUserId]
      );
      await client.query("commit");
      return {
        registered: true,
        bonusGranted: reward.rowCount > 0,
        bonusFreeRemaining: reward.rows[0]?.bonus_free_remaining ?? null
      };
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async getReferralStats(userId) {
    await this.ensureUser(userId);
    const { rows } = await this.pool.query(
      `select count(*)::int as invited_users from users where referrer_user_id = $1`,
      [userId]
    );
    const invitedUsers = rows[0].invited_users;
    return { invitedUsers, bonusEdits: invitedUsers * 3 };
  }

  async log(level, scope, message, meta = null) {
    await this.pool.query(
      `
      insert into logs(level, scope, message, meta)
      values ($1, $2, $3, $4)
      `,
      [level, scope, message, meta ? JSON.stringify(meta) : null]
    );
  }

  async createBroadcastCampaign(text, targetCount) {
    const { rows } = await this.pool.query(
      `
      insert into broadcast_campaigns(text, target_count)
      values ($1, $2)
      returning id, text, status, target_count, delivered_count, failed_count, started_at, finished_at
      `,
      [text, targetCount]
    );
    return clone(rows[0]);
  }

  async getBroadcastRecipients() {
    const { rows } = await this.pool.query(`
      select u.user_id
      from users u
      where exists (select 1 from analytics_events e where e.user_id = u.user_id and e.name = 'bot_opened')
         or exists (select 1 from jobs j where j.user_id = u.user_id)
         or u.last_photo is not null
      order by u.user_id asc
    `);
    return rows.map((row) => Number(row.user_id));
  }

  async updateBroadcastProgress(campaignId, { delivered, failed }) {
    await this.pool.query(
      `
      update broadcast_campaigns
      set delivered_count = $2,
          failed_count = $3
      where id = $1
      `,
      [campaignId, delivered, failed]
    );
  }

  async finishBroadcastCampaign(campaignId, { delivered, failed }) {
    await this.pool.query(
      `
      update broadcast_campaigns
      set status = 'completed',
          delivered_count = $2,
          failed_count = $3,
          finished_at = now()
      where id = $1
      `,
      [campaignId, delivered, failed]
    );
  }

  async getRecentBroadcastCampaigns(limit = 10) {
    const { rows } = await this.pool.query(
      `
      select id, text, status, target_count, delivered_count, failed_count, started_at, finished_at
      from broadcast_campaigns
      order by id desc
      limit $1
      `,
      [limit]
    );
    return rows.map(clone);
  }

  async trackAnalyticsEvent(userId, name, params = {}) {
    await this.ensureUser(userId);
    await this.pool.query(
      `
      insert into analytics_events(user_id, name, params)
      values ($1, $2, $3::jsonb)
      `,
      [userId, name, JSON.stringify(params)]
    );
  }

  async getUser(userId) {
    await this.ensureUser(userId);
    const { rows } = await this.pool.query(
      `
      select
        user_id,
        starter_free_remaining,
        bonus_free_remaining,
        daily_free_used_on,
        paid_credits,
        last_photo,
        last_result_photo,
        photo_tips_seen,
        pending_action,
        pending_payload
      from users
      where user_id = $1
      `,
      [userId]
    );
    const row = rows[0];
    return {
      userId: Number(row.user_id),
      starterFreeRemaining: row.starter_free_remaining,
      bonusFreeRemaining: row.bonus_free_remaining,
      dailyFreeUsedOn: row.daily_free_used_on,
      paidCredits: row.paid_credits,
      lastPhoto: row.last_photo ? clone(row.last_photo) : null,
      lastResultPhoto: row.last_result_photo ? clone(row.last_result_photo) : null,
      photoTipsSeen: row.photo_tips_seen,
      pendingAction: row.pending_action,
      pendingPayload: row.pending_payload ? clone(row.pending_payload) : null
    };
  }

  async getBalanceSnapshot(userId) {
    const user = await this.getUser(userId);
    return {
      starterFreeRemaining: user.starterFreeRemaining,
      bonusFreeRemaining: user.bonusFreeRemaining,
      dailyFreeAvailable: user.starterFreeRemaining <= 0 && user.bonusFreeRemaining <= 0 && user.dailyFreeUsedOn !== todayKey() ? 1 : 0,
      paidCredits: user.paidCredits
    };
  }

  async setLastPhoto(userId, photo) {
    await this.ensureUser(userId);
    await this.pool.query(
      `
      update users
      set last_photo = $2::jsonb,
          last_result_photo = null,
          pending_action = null,
          pending_payload = null,
          updated_at = now()
      where user_id = $1
      `,
      [userId, JSON.stringify(photo)]
    );
  }

  async setLastResultPhoto(userId, photo) {
    await this.ensureUser(userId);
    await this.pool.query(
      `
      update users
      set last_result_photo = $2::jsonb,
          updated_at = now()
      where user_id = $1
      `,
      [userId, JSON.stringify(photo)]
    );
  }

  async markPhotoTipsSeen(userId) {
    await this.ensureUser(userId);
    await this.pool.query(
      `update users set photo_tips_seen = true, updated_at = now() where user_id = $1`,
      [userId]
    );
  }

  async setPending(userId, action, payload = null) {
    await this.ensureUser(userId);
    await this.pool.query(
      `
      update users
      set pending_action = $2,
          pending_payload = $3::jsonb,
          updated_at = now()
      where user_id = $1
      `,
      [userId, action, payload ? JSON.stringify(payload) : null]
    );
  }

  async clearPending(userId) {
    await this.ensureUser(userId);
    await this.pool.query(
      `
      update users
      set pending_action = null,
          pending_payload = null,
          updated_at = now()
      where user_id = $1
      `,
      [userId]
    );
  }

  async consumeEdit(userId, paidCost) {
    await this.ensureUser(userId);
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const { rows } = await client.query(
        `
        select starter_free_remaining, bonus_free_remaining, daily_free_used_on, paid_credits
        from users
        where user_id = $1
        for update
        `,
        [userId]
      );
      const user = rows[0];

      if (user.starter_free_remaining > 0) {
        await client.query(
          `
          update users
          set starter_free_remaining = starter_free_remaining - 1,
              updated_at = now()
          where user_id = $1
          `,
          [userId]
        );
        await client.query("commit");
        return { ok: true, source: "starter_free", remainingPaidCredits: user.paid_credits };
      }

      if (user.bonus_free_remaining > 0) {
        await client.query(
          `
          update users
          set bonus_free_remaining = bonus_free_remaining - 1,
              updated_at = now()
          where user_id = $1
          `,
          [userId]
        );
        await client.query("commit");
        return { ok: true, source: "bonus_free", remainingPaidCredits: user.paid_credits };
      }

      if (user.daily_free_used_on !== todayKey()) {
        await client.query(
          `
          update users
          set daily_free_used_on = $2,
              updated_at = now()
          where user_id = $1
          `,
          [userId, todayKey()]
        );
        await client.query("commit");
        return { ok: true, source: "daily_free", remainingPaidCredits: user.paid_credits };
      }

      if (user.paid_credits >= paidCost) {
        await client.query(
          `
          update users
          set paid_credits = paid_credits - $2,
              updated_at = now()
          where user_id = $1
          `,
          [userId, paidCost]
        );
        await client.query("commit");
        return { ok: true, source: "paid_credits", remainingPaidCredits: user.paid_credits - paidCost };
      }

      await client.query("rollback");
      return {
        ok: false,
        source: "insufficient",
        remainingPaidCredits: user.paid_credits,
        requiredCredits: paidCost
      };
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async refundConsumedEdit(userId, source, paidCost) {
    await this.ensureUser(userId);
    if (source === "starter_free") {
      await this.pool.query(
        `
        update users
        set starter_free_remaining = starter_free_remaining + 1,
            updated_at = now()
        where user_id = $1
        `,
        [userId]
      );
      return;
    }
    if (source === "daily_free") {
      await this.pool.query(
        `
        update users
        set daily_free_used_on = null,
            updated_at = now()
        where user_id = $1
        `,
        [userId]
      );
      return;
    }
    if (source === "bonus_free") {
      await this.pool.query(
        `
        update users
        set bonus_free_remaining = bonus_free_remaining + 1,
            updated_at = now()
        where user_id = $1
        `,
        [userId]
      );
      return;
    }
    if (source === "paid_credits") {
      await this.pool.query(
        `
        update users
        set paid_credits = paid_credits + $2,
            updated_at = now()
        where user_id = $1
        `,
        [userId, paidCost]
      );
    }
  }

  async grantCredits(userId, credits, paymentMeta) {
    await this.ensureUser(userId);
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const { rows } = await client.query(
        `
        update users
        set paid_credits = paid_credits + $2,
            updated_at = now()
        where user_id = $1
        returning paid_credits
        `,
        [userId, credits]
      );
      await client.query(
        `
        insert into payments(
          user_id, credits, pack_key, currency, total_amount, telegram_payment_charge_id, type, reason
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          userId,
          credits,
          paymentMeta.packKey || null,
          paymentMeta.currency || null,
          paymentMeta.totalAmount || null,
          paymentMeta.telegramPaymentChargeId || null,
          paymentMeta.type || "purchase",
          paymentMeta.reason || null
        ]
      );
      await client.query("commit");
      return rows[0].paid_credits;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async createCardPayment({ yookassaPaymentId, userId, chatId, packKey, credits, amountRub, status, confirmationUrl }) {
    await this.ensureUser(userId);
    const { rows } = await this.pool.query(
      `insert into card_payments(yookassa_payment_id, user_id, chat_id, pack_key, credits, amount_rub, status, confirmation_url)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (yookassa_payment_id) do update set updated_at = now()
       returning *`,
      [yookassaPaymentId, userId, chatId, packKey, credits, amountRub, status, confirmationUrl || null]
    );
    return rows[0];
  }

  async getCardPaymentForUser(yookassaPaymentId, userId) {
    const { rows } = await this.pool.query(
      `select * from card_payments where yookassa_payment_id = $1 and user_id = $2`,
      [yookassaPaymentId, userId]
    );
    return rows[0] || null;
  }

  async getCardPaymentById(yookassaPaymentId) {
    const { rows } = await this.pool.query(`select * from card_payments where yookassa_payment_id = $1`, [yookassaPaymentId]);
    return rows[0] || null;
  }

  async getPendingCardPayments(maxAgeMinutes, minAgeSeconds = 20) {
    const { rows } = await this.pool.query(
      `select * from card_payments
       where credited_at is null and status in ('pending', 'waiting_for_capture')
         and created_at >= now() - ($1 * interval '1 minute')
         and created_at <= now() - ($2 * interval '1 second')
       order by created_at asc`,
      [maxAgeMinutes, minAgeSeconds]
    );
    return rows;
  }

  async updateCardPaymentStatus(yookassaPaymentId, status) {
    const { rows } = await this.pool.query(
      `update card_payments set status = $2, updated_at = now() where yookassa_payment_id = $1 returning *`,
      [yookassaPaymentId, status]
    );
    return rows[0] || null;
  }

  async creditCardPayment(yookassaPaymentId) {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const { rows: paymentRows } = await client.query(
        `select * from card_payments where yookassa_payment_id = $1 for update`, [yookassaPaymentId]
      );
      const payment = paymentRows[0];
      if (!payment) throw new Error("Card payment not found");
      if (payment.credited_at) {
        await client.query("commit");
        return { payment, credited: false, balance: null };
      }
      const { rows: balanceRows } = await client.query(
        `update users set paid_credits = paid_credits + $2, updated_at = now() where user_id = $1 returning paid_credits`,
        [payment.user_id, payment.credits]
      );
      await client.query(
        `update card_payments set status = 'succeeded', credited_at = now(), updated_at = now() where id = $1`, [payment.id]
      );
      await client.query(
        `insert into payments(user_id, credits, pack_key, currency, total_amount, type, reason)
         values ($1,$2,$3,'RUB',$4,'purchase','yookassa')`,
        [payment.user_id, payment.credits, payment.pack_key, payment.amount_rub]
      );
      await client.query("commit");
      return { payment, credited: true, balance: Number(balanceRows[0].paid_credits) };
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async enqueueJob({ userId, chatId, actionKey, paidCost, prompt, sourceType, originalFileId, originalMimeType, entitlementSource, resultLabel = null, templateAction = null }) {
    await this.ensureUser(userId);
    const { rows } = await this.pool.query(
      `
      insert into jobs(
        user_id,
        chat_id,
        action_key,
        paid_cost,
        prompt,
        source_type,
        original_file_id,
        original_mime_type,
        entitlement_source,
        result_label,
        template_action
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      returning id
      `,
      [userId, chatId, actionKey, paidCost, prompt, sourceType, originalFileId, originalMimeType || null, entitlementSource, resultLabel, templateAction]
    );
    return Number(rows[0].id);
  }

  async claimNextPendingJob() {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const { rows } = await client.query(
        `
        select *
        from jobs
        where status = 'pending'
        order by created_at asc
        for update skip locked
        limit 1
        `
      );
      if (rows.length === 0) {
        await client.query("commit");
        return null;
      }
      const job = rows[0];
      await client.query(
        `
        update jobs
        set status = 'processing',
            started_at = now()
        where id = $1
        `,
        [job.id]
      );
      await client.query("commit");
      return clone(job);
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async completeJob(jobId, outputFileName = null) {
    await this.pool.query(
      `
      update jobs
      set status = 'completed',
          output_file_name = $2,
          completed_at = now()
      where id = $1
      `,
      [jobId, outputFileName]
    );
  }

  async claimStarterExhaustedNotice(userId) {
    const { rows } = await this.pool.query(
      `update users set starter_exhausted_notice_seen = true where user_id = $1 and starter_free_remaining = 0 and not starter_exhausted_notice_seen returning user_id`,
      [userId]
    );
    return rows.length > 0;
  }

  async getJobForUser(jobId, userId) {
    const { rows } = await this.pool.query(
      `select * from jobs where id = $1 and user_id = $2 and status = 'completed'`,
      [jobId, userId]
    );
    return rows[0] ? clone(rows[0]) : null;
  }

  async submitFeedback(jobId, userId, feedback, refund = false) {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const { rows } = await client.query(
        `select entitlement_source, paid_cost, refund_granted from jobs where id = $1 and user_id = $2 and status = 'completed' for update`,
        [jobId, userId]
      );
      const job = rows[0];
      if (!job) { await client.query("rollback"); return { ok: false }; }
      const recentRefund = refund && !job.refund_granted && (await client.query(
        `select exists(select 1 from jobs where user_id = $1 and refund_granted and completed_at >= now() - interval '24 hours') as value`,
        [userId]
      )).rows[0].value;
      const grantRefund = refund && !job.refund_granted && !recentRefund;
      await client.query(`update jobs set feedback = $3, refund_granted = refund_granted or $4 where id = $1 and user_id = $2`, [jobId, userId, feedback, grantRefund]);
      if (grantRefund) {
        if (job.entitlement_source === "starter_free") {
          await client.query(`update users set starter_free_remaining = starter_free_remaining + 1 where user_id = $1`, [userId]);
        } else if (job.entitlement_source === "daily_free") {
          await client.query(`update users set daily_free_used_on = null where user_id = $1`, [userId]);
        } else if (job.entitlement_source === "paid_credits") {
          await client.query(`update users set paid_credits = paid_credits + $2 where user_id = $1`, [userId, job.paid_cost]);
        }
      }
      await client.query("commit");
      return { ok: true, refunded: grantRefund, refundLimited: Boolean(recentRefund) };
    } catch (error) { await client.query("rollback"); throw error; } finally { client.release(); }
  }

  async failJob(jobId, errorMessage) {
    await this.pool.query(
      `
      update jobs
      set status = 'failed',
          error_message = $2,
          completed_at = now()
      where id = $1
      `,
      [jobId, errorMessage]
    );
  }

  async saveSuggestion({ userId, chatId, username = null, displayName = null, message }) {
    await this.ensureUser(userId);
    const { rows } = await this.pool.query(
      `
      insert into user_suggestions(user_id, chat_id, username, display_name, message)
      values ($1, $2, $3, $4, $5)
      returning id
      `,
      [userId, chatId, username, displayName, message]
    );
    return Number(rows[0].id);
  }

  async getAdminSnapshot(limit = 25, estimatedOpenAiCostUsd = 0, netUsdPerStar = 0, days = 30, excludedUserIds = []) {
    const interval = days > 0 ? `${days} days` : "100 years";
    const [statsResult, jobsResult, logsResult, suggestionsResult, funnelResult, conversionFunnelResult, eventCountsResult, dailyResult, sourcesResult, usageResult, miniAppSelectionsResult, broadcastsResult] = await Promise.all([
      this.pool.query(`
        select
          (select count(*) from users) as users_count,
          (select count(*) from jobs) as jobs_count,
          (select count(*) from jobs where status = 'pending') as pending_jobs,
          (select count(*) from jobs where status = 'processing') as processing_jobs,
          (select count(*) from jobs where status = 'completed') as completed_jobs,
          (select count(*) from jobs where status = 'failed') as failed_jobs,
          (select count(distinct user_id) from jobs) as users_with_edits,
          (select count(distinct user_id) from payments where type = 'purchase') as paying_users,
          (select count(*) from payments where type = 'purchase') as purchases_count,
          (select coalesce(sum(total_amount), 0) from payments where type = 'purchase' and currency = 'XTR') as revenue_stars,
          (select coalesce(sum(total_amount), 0) from payments where type = 'purchase' and currency = 'XTR' and created_at >= now() - interval '7 days') as revenue_stars_7d,
          (select coalesce(sum(total_amount), 0) from payments where type = 'purchase' and currency = 'RUB') as revenue_rub,
          (select coalesce(sum(total_amount), 0) from payments where type = 'purchase' and currency = 'RUB' and created_at >= now() - interval '7 days') as revenue_rub_7d,
          (select count(*) from jobs where feedback like 'bad:%') as poor_results,
          (select count(*) from jobs where refund_granted) as refunded_results
      `),
      this.pool.query(
        `
        select id, user_id, chat_id, action_key, paid_cost, source_type, status, feedback, refund_granted, error_message, created_at, started_at, completed_at
        from jobs
        order by id desc
        limit $1
        `,
        [limit]
      ),
      this.pool.query(
        `
        select id, level, scope, message, meta, created_at
        from logs
        order by id desc
        limit $1
        `,
        [limit]
      ),
      this.pool.query(
        `
        select id, user_id, username, display_name, message, created_at
        from user_suggestions
        order by id desc
        limit $1
        `,
        [limit]
      ),
      this.pool.query(
        `
        select
          count(distinct user_id) filter (where name = 'bot_opened') as opened_users,
          count(distinct user_id) as active_users,
          count(distinct user_id) filter (where name = 'photo_uploaded') as uploaded_users,
          count(distinct user_id) filter (where name = 'edit_confirmed') as confirmed_users,
          count(distinct user_id) filter (where name = 'generation_completed') as completed_users,
          count(distinct user_id) filter (where name = 'purchase_completed') as buyers,
          count(*) as events_count
        from analytics_events
        where created_at >= now() - $1::interval
        `,
        [interval]
      ),
      this.pool.query(
        `
        with cohort as (
          select e.user_id, min(e.created_at) as opened_at
          from analytics_events e
          where e.name = 'bot_opened'
            and e.created_at >= now() - $1::interval
            and not (e.user_id = any($2::bigint[]))
          group by e.user_id
        )
        select
          count(*)::integer as opened,
          count(*) filter (where exists (
            select 1 from analytics_events e where e.user_id = c.user_id and e.name = 'photo_uploaded' and e.created_at >= c.opened_at
          ))::integer as uploaded,
          count(*) filter (where exists (
            select 1 from analytics_events e where e.user_id = c.user_id and e.name in ('miniapp_template_selected', 'button_custom_clicked', 'filter_selected') and e.created_at >= c.opened_at
          ))::integer as chose_action,
          count(*) filter (where exists (
            select 1 from analytics_events e where e.user_id = c.user_id and e.name = 'edit_confirmed' and e.created_at >= c.opened_at
          ))::integer as confirmed,
          count(*) filter (where exists (
            select 1 from analytics_events e where e.user_id = c.user_id and e.name = 'generation_completed' and e.created_at >= c.opened_at
          ))::integer as completed,
          count(*) filter (where exists (
            select 1 from analytics_events e where e.user_id = c.user_id and e.name = 'purchase_completed' and e.created_at >= c.opened_at
          ))::integer as purchased
        from cohort c
        `,
        [interval, excludedUserIds]
      ),
      this.pool.query(
        `
        select name, count(*)::integer as events, count(distinct user_id)::integer as users
        from analytics_events
        where created_at >= now() - $1::interval
        group by name
        order by events desc, name asc
        limit 100
        `,
        [interval]
      ),
      this.pool.query(
        `
        select
          to_char(date_trunc('day', created_at), 'DD.MM') as day,
          count(*)::integer as events,
          count(distinct user_id)::integer as users
        from analytics_events
        where created_at >= now() - $1::interval
        group by date_trunc('day', created_at)
        order by date_trunc('day', created_at) desc
        limit 31
        `,
        [interval]
      ),
      this.pool.query(
        `
        select
          coalesce(nullif(acquisition_source, ''), 'Без метки / старые пользователи') as source,
          count(*)::integer as users,
          count(*) filter (where last_photo is not null)::integer as uploaded_users
        from users
        where created_at >= now() - $1::interval
        group by 1
        order by users desc, source asc
        `,
        [interval]
      ),
      this.pool.query(
        `
        select
          action_key,
          coalesce(nullif(result_label, ''), action_key) as item,
          count(*)::integer as launches,
          count(distinct user_id)::integer as users,
          count(*) filter (where status = 'completed')::integer as completed,
          count(*) filter (where status = 'failed')::integer as failed
        from jobs
        where created_at >= now() - $1::interval
        group by action_key, coalesce(nullif(result_label, ''), action_key)
        order by launches desc, item asc
        limit 100
        `,
        [interval]
      ),
      this.pool.query(
        `
        select
          coalesce(params->>'template_key', 'unknown') as template_key,
          count(*)::integer as selections,
          count(distinct user_id)::integer as users
        from analytics_events
        where name = 'miniapp_template_selected'
          and created_at >= now() - $1::interval
        group by coalesce(params->>'template_key', 'unknown')
        order by selections desc, template_key asc
        limit 100
        `,
        [interval]
      ),
      this.pool.query(`
        select id, text, status, target_count, delivered_count, failed_count, started_at, finished_at
        from broadcast_campaigns
        order by id desc
        limit 10
      `)
    ]);

    const stats = statsResult.rows[0];
    const completed = Number(stats.completed_jobs || 0);
    const stars = Number(stats.revenue_stars || 0);
    return {
      stats: { ...stats, estimated_openai_cost_usd: completed * estimatedOpenAiCostUsd, estimated_net_revenue_usd: netUsdPerStar > 0 ? stars * netUsdPerStar - completed * estimatedOpenAiCostUsd : null, net_usd_per_star: netUsdPerStar },
      jobs: jobsResult.rows.map(clone),
      logs: logsResult.rows.map(clone),
      suggestions: suggestionsResult.rows.map(clone),
      broadcasts: broadcastsResult.rows.map(clone),
      analytics: {
        days,
        funnel: clone(funnelResult.rows[0]),
        conversionFunnel: clone(conversionFunnelResult.rows[0]),
        eventCounts: eventCountsResult.rows.map(clone),
        daily: dailyResult.rows.map(clone),
        acquisitionSources: sourcesResult.rows.map(clone),
        usage: usageResult.rows.map(clone),
        miniAppSelections: miniAppSelectionsResult.rows.map(clone)
      }
    };
  }
}
