'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { merchants, merchantBrandSettings } from '@/schema/merchants'

export const completeOnboarding = async (formData: FormData) => {
    const { isAuthenticated, userId } = await auth()

    if (!isAuthenticated || !userId) {
        return { error: 'Not authenticated' }
    }

    // ── 1. Collect fields ────────────────────────────────────────────────────

    const businessLegalName = formData.get('businessLegalName') as string
    const businessType = formData.get('businessType') as string || ""
    const websiteUrl = formData.get('websiteUrl') as string
    const mrrRange = formData.get('mrrRange') as string
    const gstNumber = (formData.get('gstNumber') as string) || ""
    const country = (formData.get('country') as string) || 'IN'
    const gatewayConnected = (formData.get('gateway') as string) || ""
    const fromName = formData.get('fromName') as string
    const replyToEmail = formData.get('replyToEmail') as string
    const brandColorHex = (formData.get('brandColorHex') as string) || '#3b82f6'
    const defaultRecoveryCampaign = (formData.get('defaultRecoveryCampaign') as string) || 'standard_10d'
    const whatsappOptIn = formData.get('whatsappOptIn') === 'true'
    const slackWebhookUrl = (formData.get('slackWebhookUrl') as string) || ""
    const digestFrequency = (formData.get('digestFrequency') as string) || 'daily'

    // Clerk user object for name / email (already available server-side)
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    const email = clerkUser.primaryEmailAddress?.emailAddress ?? ''
    const fullName = `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim()
    const companyName = businessLegalName // use legal name as company name initially

    try {
        // ── 2. Upsert merchant row ───────────────────────────────────────────
        const [merchant] = await db
            .insert(merchants)
            .values({
                clerkUserId: userId,
                email,
                fullName,
                companyName,
                businessLegalName: businessLegalName || null,
                websiteUrl: websiteUrl || null,
                businessType: (businessType || null) as typeof merchants.$inferInsert['businessType'],
                mrrRange: (mrrRange || null) as typeof merchants.$inferInsert['mrrRange'],
                gstNumber,
                country,
                status: 'onboarding',
                onboardingStep: 5,
                onboardingCompletedAt: new Date(),
                trialStartedAt: new Date(),
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
            })
            .onConflictDoUpdate({
                target: merchants.clerkUserId,
                set: {
                    businessLegalName: businessLegalName || null,
                    websiteUrl: websiteUrl || null,
                    businessType: (businessType || null) as typeof merchants.$inferInsert['businessType'],
                    mrrRange: (mrrRange || null) as typeof merchants.$inferInsert['mrrRange'],
                    gstNumber,
                    country,
                    onboardingStep: 5,
                    onboardingCompletedAt: new Date(),
                    updatedAt: new Date(),
                },
            })
            .returning()

        // ── 3. Upsert brand / notification settings ──────────────────────────
        await db
            .insert(merchantBrandSettings)
            .values({
                merchantId: merchant.id,
                fromName,
                replyToEmail,
                brandColorHex,
                defaultRecoveryCampaign: defaultRecoveryCampaign as typeof merchantBrandSettings.$inferInsert['defaultRecoveryCampaign'],
                whatsappOptIn,
                slackWebhookUrl,
                digestFrequency,
                whatsappEnabled: whatsappOptIn,
            })
            .onConflictDoUpdate({
                target: merchantBrandSettings.merchantId,
                set: {
                    fromName,
                    replyToEmail,
                    brandColorHex,
                    defaultRecoveryCampaign: defaultRecoveryCampaign as typeof merchantBrandSettings.$inferInsert['defaultRecoveryCampaign'],
                    whatsappOptIn,
                    whatsappEnabled: whatsappOptIn,
                    slackWebhookUrl,
                    digestFrequency,
                    updatedAt: new Date(),
                },
            })

        // ── 4. Mark onboarding complete in Clerk metadata ────────────────────
        await client.users.updateUser(userId, {
            publicMetadata: {
                onboardingComplete: true,
                merchantId: merchant.id,   // handy for quick lookups
                gatewayConnected,
            },
        })

        // ── 5. Set a long-lived cookie so proxy.ts can gate access ────────────
        // Clerk's JWT session claims don't include publicMetadata unless a custom
        // JWT template is configured in the Clerk dashboard. The cookie is the
        // reliable, zero-config alternative that works immediately.
        const cookieStore = await cookies()
        cookieStore.set('rcvrx_ob', '1', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
        })

        return { message: 'Onboarding complete' }

    } catch (err) {
        console.error('[completeOnboarding]', err)
        return { error: 'Failed to save your profile. Please try again.' }
    }
}