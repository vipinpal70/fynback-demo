// schema/merchants.ts
// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

import {
    pgTable, pgEnum, uuid, text, integer, boolean,
    timestamp, jsonb, index, uniqueIndex,
} from 'drizzle-orm/pg-core';

export const businessTypeEnum = pgEnum('business_type', [
    'saas',
    'd2c_subscription',
    'edtech',
    'ott_media',
    'other',
]);

export const mrrRangeEnum = pgEnum('mrr_range', [
    'under_1l',       // < ₹1,00,000
    '1l_to_5l',       // ₹1L – ₹5L
    '5l_to_25l',      // ₹5L – ₹25L
    '25l_to_1cr',     // ₹25L – ₹1Cr
    'above_1cr',      // > ₹1Cr
]);

export const planEnum = pgEnum('plan', [
    'trial',          // 14-day free trial
    'starter',        // ₹2,999/mo
    'growth',         // ₹6,999/mo
    'scale',          // ₹14,999/mo
    'suspended',      // payment failed on your own billing
]);

export const merchantStatusEnum = pgEnum('merchant_status', [
    'onboarding',     // signed up, not yet connected a gateway
    'active',         // gateway connected, recovery running
    'trial_expired',  // trial over, not upgraded
    'suspended',      // billing failed
    'cancelled',      // voluntarily cancelled
]);

export const gatewayEnum = pgEnum('gateway', [
    'razorpay',
    'stripe',
    'cashfree',
    'payu',
]);

export const gatewayConnectionStatusEnum = pgEnum('gateway_connection_status', [
    'connected',
    'disconnected',
    'token_expired',
    'webhook_failing',  // PayU-style: gateway stopped sending because of repeated failures
]);

export const billingCycleEnum = pgEnum('billing_cycle', [
    'monthly',
    'annual',
]);

export const recoveryCampaignEnum = pgEnum('recovery_campaign', [
    'aggressive_7d',   // 7-day aggressive follow-up sequence
    'standard_10d',    // 10-day balanced sequence (default)
    'gentle_14d',      // 14-day soft-touch sequence
]);

// ─────────────────────────────────────────────────────────────────────────────
// TABLE 1 — merchants
// The core client profile. One row per customer of your SaaS.
// ─────────────────────────────────────────────────────────────────────────────

export const merchants = pgTable('merchants', {

    // Identity
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(), // Clerk auth ID → links auth to your DB
    email: text('email').notNull().unique(),
    fullName: text('full_name').notNull(),

    // Business profile (collected in Step 2)
    companyName: text('company_name').notNull(),
    businessLegalName: text('business_legal_name'),       // may differ from brand name
    websiteUrl: text('website_url'),
    businessType: businessTypeEnum('business_type'),
    mrrRange: mrrRangeEnum('mrr_range'),
    country: text('country').notNull().default('IN'),

    // GST & compliance (India-specific)
    gstNumber: text('gst_number'),                // 15-char GSTIN e.g. 07AAAAA0000A1Z5
    gstVerified: boolean('gst_verified').notNull().default(false),
    panNumber: text('pan_number'),                // needed for invoices above ₹50L/year

    // Subscription / billing (YOUR billing of this merchant)
    plan: planEnum('plan').notNull().default('trial'),
    billingCycle: billingCycleEnum('billing_cycle').default('monthly'),
    trialStartedAt: timestamp('trial_started_at'),
    trialEndsAt: timestamp('trial_ends_at'),
    currentPeriodStart: timestamp('current_period_start'),
    currentPeriodEnd: timestamp('current_period_end'),
    stripeCustomerId: text('stripe_customer_id'),        // YOUR Stripe customer ID for this merchant
    stripeSubId: text('stripe_subscription_id'),    // YOUR Stripe subscription ID

    // Merchant status & lifecycle
    status: merchantStatusEnum('merchant_status').notNull().default('onboarding'),
    onboardingStep: integer('onboarding_step').notNull().default(1), // 1–5, tracks where they are in setup
    onboardingCompletedAt: timestamp('onboarding_completed_at'),

    // Recovery statistics (written by your system, not the merchant)
    // Stored here for fast dashboard queries — avoids expensive aggregations on every load
    totalFailedAmountInr: integer('total_failed_amount_inr').notNull().default(0),    // lifetime, in paise
    totalRecoveredAmountInr: integer('total_recovered_amount_inr').notNull().default(0), // lifetime, in paise
    recoveryRatePct: integer('recovery_rate_pct').notNull().default(0),           // 0–100
    activeFailedPaymentsCount: integer('active_failed_payments_count').notNull().default(0),
    statsLastCalculatedAt: timestamp('stats_last_calculated_at'),

    // Timestamps
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    cancelledAt: timestamp('cancelled_at'),
    cancelReason: text('cancel_reason'),

}, (table) => ({
    emailIdx: uniqueIndex('merchants_email_idx').on(table.email),
    clerkIdx: uniqueIndex('merchants_clerk_idx').on(table.clerkUserId),
    statusIdx: index('merchants_status_idx').on(table.status),
    planIdx: index('merchants_plan_idx').on(table.plan),
}));


// ─────────────────────────────────────────────────────────────────────────────
// TABLE 2 — merchant_brand_settings
// Everything needed to send white-label emails and WhatsApp under their brand.
// Separate table so the main merchants table stays lean for queries.
// ─────────────────────────────────────────────────────────────────────────────

export const merchantBrandSettings = pgTable('merchant_brand_settings', {

    id: uuid('id').primaryKey().defaultRandom(),
    merchantId: uuid('merchant_id').notNull().unique()
        .references(() => merchants.id, { onDelete: 'cascade' }),

    // Email identity
    fromName: text('from_name'),          // "Billing at Acme SaaS"
    fromEmail: text('from_email'),          // "billing@acmesaas.com" — must be verified with Resend
    replyToEmail: text('reply_to_email'),      // where customer replies go
    emailDomainVerified: boolean('email_domain_verified').notNull().default(false),
    resendDomainId: text('resend_domain_id'),    // Resend's domain ID for DKIM verification

    // Branding
    logoUrl: text('logo_url'),            // stored in Supabase Storage
    brandColorHex: text('brand_color_hex').default('#3b82f6'), // used in email CTA buttons
    companyTagline: text('company_tagline'),     // optional, shown in email footer

    // WhatsApp configuration
    whatsappEnabled: boolean('whatsapp_enabled').notNull().default(false),
    interaktApiKey: text('interakt_api_key'),    // encrypted at rest
    whatsappSenderName: text('whatsapp_sender_name'), // your business name as it appears on WA
    whatsappTemplatesApproved: boolean('whatsapp_templates_approved').notNull().default(false),

    // SMS configuration
    smsEnabled: boolean('sms_enabled').notNull().default(false),
    msg91ApiKey: text('msg91_api_key'),       // encrypted at rest
    msg91SenderId: text('msg91_sender_id'),     // 6-char DLT sender ID e.g. RECVRX
    dltRegistered: boolean('dlt_registered').notNull().default(false),

    // Notification preferences
    slackWebhookUrl: text('slack_webhook_url'),   // for "payment recovered" Slack alerts
    notifyOnRecovery: boolean('notify_on_recovery').notNull().default(true),
    digestFrequency: text('digest_frequency').default('daily'), // 'realtime' | 'daily' | 'weekly' | 'never'
    digestEmail: text('digest_email'),        // defaults to merchant email if null

    // Recovery campaign defaults (Step 4)
    defaultRecoveryCampaign: recoveryCampaignEnum('default_recovery_campaign').default('standard_10d'),
    // ↑ pre-built template chosen during onboarding; merchant can customise individual campaigns later
    whatsappOptIn: boolean('whatsapp_opt_in').notNull().default(false),
    // ↑ explicit opt-in captured during onboarding Step 4 before showing Interakt setup guide

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

});


// ─────────────────────────────────────────────────────────────────────────────
// TABLE 3 — gateway_connections
// One row per gateway per merchant. A merchant can have multiple gateways.
// ─────────────────────────────────────────────────────────────────────────────

export const gatewayConnections = pgTable('gateway_connections', {

    id: uuid('id').primaryKey().defaultRandom(),
    merchantId: uuid('merchant_id').notNull()
        .references(() => merchants.id, { onDelete: 'cascade' }),

    gateway: gatewayEnum('gateway').notNull(),
    status: gatewayConnectionStatusEnum('status').notNull().default('connected'),

    // Credentials — ALL encrypted with AES-256 before storing
    // Never store raw. Use encryptToken() from your crypto lib before insert.
    encryptedAccessToken: text('encrypted_access_token'),   // Razorpay/Stripe OAuth token
    encryptedRefreshToken: text('encrypted_refresh_token'),  // for token refresh flows
    encryptedApiKey: text('encrypted_api_key'),        // Cashfree/PayU API key
    encryptedApiSecret: text('encrypted_api_secret'),     // Cashfree/PayU API secret
    encryptedWebhookSecret: text('encrypted_webhook_secret'), // for verifying inbound webhooks

    // Gateway-side identifiers
    gatewayMerchantId: text('gateway_merchant_id'),        // e.g. Razorpay's account_id
    gatewayAccountName: text('gateway_account_name'),       // display name from gateway
    gatewayWebhookId: text('gateway_webhook_id'),         // ID of the webhook we registered

    // Webhook health tracking
    lastWebhookReceivedAt: timestamp('last_webhook_received_at'),
    consecutiveWebhookFailures: integer('consecutive_webhook_failures').notNull().default(0),
    // ↑ Critical for PayU — they disable your webhook after 20 consecutive failures
    webhookHealthAlertSentAt: timestamp('webhook_health_alert_sent_at'),

    // Permissions granted (what we can do with this connection)
    canReadSubscriptions: boolean('can_read_subscriptions').notNull().default(false),
    canRetryPayments: boolean('can_retry_payments').notNull().default(false),
    canReadCustomers: boolean('can_read_customers').notNull().default(false),

    // Token expiry
    tokenExpiresAt: timestamp('token_expires_at'),      // null = does not expire
    tokenRefreshedAt: timestamp('token_refreshed_at'),

    connectedAt: timestamp('connected_at').notNull().defaultNow(),
    disconnectedAt: timestamp('disconnected_at'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

}, (table) => ({
    // A merchant can only have one connection per gateway:
    merchantGatewayUnique: uniqueIndex('merchant_gateway_unique')
        .on(table.merchantId, table.gateway),
    merchantIdIdx: index('gw_conn_merchant_idx').on(table.merchantId),
    statusIdx: index('gw_conn_status_idx').on(table.status),
}));


// ─────────────────────────────────────────────────────────────────────────────
// TABLE 4 — merchant_team_members
// Additional users who can access a merchant's dashboard.
// ─────────────────────────────────────────────────────────────────────────────

export const merchantTeamMembers = pgTable('merchant_team_members', {

    id: uuid('id').primaryKey().defaultRandom(),
    merchantId: uuid('merchant_id').notNull()
        .references(() => merchants.id, { onDelete: 'cascade' }),

    email: text('email').notNull(),
    fullName: text('full_name'),
    role: text('role').notNull().default('viewer'), // 'owner' | 'admin' | 'viewer'
    clerkUserId: text('clerk_user_id'),        // set once they accept the invite and sign up
    inviteToken: text('invite_token'),          // UUID, used in the invite email link
    inviteAcceptedAt: timestamp('invite_accepted_at'),
    invitedAt: timestamp('invited_at').notNull().defaultNow(),

}, (table) => ({
    merchantIdIdx: index('team_merchant_idx').on(table.merchantId),
    // One email per merchant — can't invite same person twice:
    emailMerchantUnique: uniqueIndex('team_email_merchant_unique').on(table.email, table.merchantId),
}));


// ─────────────────────────────────────────────────────────────────────────────
// TABLE 5 — merchant_api_keys
// API keys merchants use to access YOUR API (for custom integrations later).
// ─────────────────────────────────────────────────────────────────────────────

export const merchantApiKeys = pgTable('merchant_api_keys', {

    id: uuid('id').primaryKey().defaultRandom(),
    merchantId: uuid('merchant_id').notNull()
        .references(() => merchants.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),         // "Production key", "Test integration"
    keyPrefix: text('key_prefix').notNull(),    // first 8 chars shown in UI: "rcvx_pr_"
    keyHash: text('key_hash').notNull(),      // bcrypt hash of the full key — never store raw
    lastUsedAt: timestamp('last_used_at'),
    expiresAt: timestamp('expires_at'),         // null = never expires
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),

}, (table) => ({
    merchantIdIdx: index('api_keys_merchant_idx').on(table.merchantId),
}));


// ─────────────────────────────────────────────────────────────────────────────
// TYPE EXPORTS
// Use these throughout your app for type safety on DB queries.
// ─────────────────────────────────────────────────────────────────────────────

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = typeof merchants.$inferInsert;

export type GatewayConnection = typeof gatewayConnections.$inferSelect;
export type InsertGatewayConnection = typeof gatewayConnections.$inferInsert;

export type MerchantBrandSettings = typeof merchantBrandSettings.$inferSelect;
export type InsertMerchantBrandSettings = typeof merchantBrandSettings.$inferInsert;

export type MerchantTeamMember = typeof merchantTeamMembers.$inferSelect;
export type InsertMerchantTeamMember = typeof merchantTeamMembers.$inferInsert;

export type MerchantApiKey = typeof merchantApiKeys.$inferSelect;
export type InsertMerchantApiKey = typeof merchantApiKeys.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// Table relationships (for reference)
// merchants(1)
//   ├── merchant_brand_settings(1:1)   — email / whatsapp / sms / brand / campaign config
//   ├── gateway_connections(1:many)    — one row per connected gateway
//   ├── merchant_team_members(1:many)  — additional dashboard users
//   └── merchant_api_keys(1:many)      — API keys for custom integrations
// ─────────────────────────────────────────────────────────────────────────────