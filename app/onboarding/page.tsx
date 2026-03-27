"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { completeOnboarding } from "./_actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 2 | 3 | 4 | 5;

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEPS = [
	{ id: 2, label: "Business Profile" },
	{ id: 3, label: "Gateway" },
	{ id: 4, label: "Recovery Prefs" },
	{ id: 5, label: "Team" },
] as const;

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
	const { user } = useUser();

	const [step, setStep] = React.useState<Step>(2);
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	// Accumulated form data across all steps
	const [formState, setFormState] = React.useState({
		// Step 2 — Business profile
		businessLegalName: "",
		businessType: "",
		websiteUrl: "",
		mrrRange: "",
		gstNumber: "",
		country: "IN",
		// Step 3 — Gateway
		gateway: "",
		gatewayApiKey: "",
		gatewayApiSecret: "",
		// Step 4 — Recovery preferences
		fromName: `Billing team at ${user?.organizationMemberships?.[0]?.organization?.name ?? "your company"}`,
		replyToEmail: user?.primaryEmailAddress?.emailAddress ?? "",
		brandColorHex: "#3b82f6",
		defaultRecoveryCampaign: "standard_10d",
		whatsappOptIn: false,
		// Step 5 — Team & notifications
		teamEmails: "",
		slackWebhookUrl: "",
		digestFrequency: "daily",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;
		setFormState((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const next = () => setStep((s) => Math.min(s + 1, 5) as Step);
	const back = () => setStep((s) => Math.max(s - 1, 2) as Step);

	const handleFinish = async () => {
		setLoading(true);
		setError("");
		const fd = new FormData();
		Object.entries(formState).forEach(([k, v]) => fd.append(k, String(v)));
		const res = await completeOnboarding(fd);
		if (res?.message) {
			// user.reload() refreshes the Clerk User object but the JWT session
			// claims (read by middleware) only update on a full token refresh.
			// A hard navigation forces the browser to fetch a new token so
			// the middleware sees onboardingComplete: true on the first request.
			await user?.reload();
			window.location.href = "/dashboard";
		}
		if (res?.error) {
			setError(res.error);
		}
		setLoading(false);
	};

	const progress = ((step - 2) / (STEPS.length - 1)) * 100;

	return (
		<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
			<div className="w-full max-w-xl">
				{/* Header */}
				<div className="mb-8">
					<p className="text-sm text-indigo-400 font-medium tracking-wide uppercase mb-1">
						Step {step - 1} of {STEPS.length}
					</p>
					<h1 className="text-2xl font-bold text-white">
						{STEPS.find((s) => s.id === step)?.label}
					</h1>
					<div className="mt-4 h-1.5 w-full rounded-full bg-gray-800">
						<div
							className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				{/* Card */}
				<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
					{step === 2 && (
						<Step2
							values={formState}
							onChange={handleChange}
							onNext={next}
						/>
					)}
					{step === 3 && (
						<Step3
							values={formState}
							onChange={handleChange}
							onNext={next}
							onBack={back}
						/>
					)}
					{step === 4 && (
						<Step4
							values={formState}
							onChange={handleChange}
							onNext={next}
							onBack={back}
						/>
					)}
					{step === 5 && (
						<Step5
							values={formState}
							onChange={handleChange}
							onBack={back}
							onFinish={handleFinish}
							loading={loading}
						/>
					)}

					{error && (
						<p className="text-sm text-red-400 mt-2">Error: {error}</p>
					)}
				</div>
			</div>
		</div>
	);
}

// ─── Shared field components ──────────────────────────────────────────────────

function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1">
			<label className="block text-sm font-medium text-gray-200">
				{label}
			</label>
			{hint && <p className="text-xs text-gray-500">{hint}</p>}
			{children}
		</div>
	);
}

const inputCls =
	"w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

const selectCls =
	"w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

function NavButtons({
	onBack,
	onNext,
	onFinish,
	nextLabel,
	loading,
	showBack,
	skipLabel,
	onSkip,
}: {
	onBack?: () => void;
	onNext?: () => void;
	onFinish?: () => void;
	nextLabel?: string;
	loading?: boolean;
	showBack?: boolean;
	skipLabel?: string;
	onSkip?: () => void;
}) {
	return (
		<div className="flex items-center gap-3 pt-2">
			{showBack && (
				<button
					type="button"
					onClick={onBack}
					className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
				>
					Back
				</button>
			)}
			{onSkip && (
				<button
					type="button"
					onClick={onSkip}
					className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 transition"
				>
					{skipLabel ?? "Skip"}
				</button>
			)}
			<button
				type="button"
				disabled={loading}
				onClick={onNext ?? onFinish}
				className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition"
			>
				{loading ? "Saving…" : (nextLabel ?? "Continue")}
			</button>
		</div>
	);
}

// ─── Step 2 — Business Profile ────────────────────────────────────────────────

function Step2({
	values,
	onChange,
	onNext,
}: {
	values: ReturnType<typeof getDefaultForm>;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onNext: () => void;
}) {
	return (
		<>
			<Field label="Business Legal Name" hint="May differ from your brand name — required for GST invoicing">
				<input className={inputCls} name="businessLegalName" value={values.businessLegalName} onChange={onChange} placeholder="Acme Technologies Pvt Ltd" required />
			</Field>

			<Field label="Business Type">
				<select className={selectCls} name="businessType" value={values.businessType} onChange={onChange}>
					<option value="">Select…</option>
					<option value="saas">SaaS</option>
					<option value="d2c_subscription">D2C Subscription</option>
					<option value="edtech">EdTech</option>
					<option value="ott_media">OTT / Media</option>
					<option value="other">Other</option>
				</select>
			</Field>

			<Field label="Website URL">
				<input className={inputCls} name="websiteUrl" type="url" value={values.websiteUrl} onChange={onChange} placeholder="https://acme.com" />
			</Field>

			<Field label="Approximate Monthly Revenue (MRR)" hint="Helps us recommend the right plan">
				<select className={selectCls} name="mrrRange" value={values.mrrRange} onChange={onChange}>
					<option value="">Select range…</option>
					<option value="under_1l">Less than ₹1L/mo</option>
					<option value="1l_to_5l">₹1L – ₹5L/mo</option>
					<option value="5l_to_25l">₹5L – ₹25L/mo</option>
					<option value="25l_to_1cr">₹25L – ₹1Cr/mo</option>
					<option value="above_1cr">Above ₹1Cr/mo</option>
				</select>
			</Field>

			<Field label="GST Number" hint="Optional now — required before your first invoice">
				<input className={inputCls} name="gstNumber" value={values.gstNumber} onChange={onChange} placeholder="07AAAAA0000A1Z5" maxLength={15} />
			</Field>

			<Field label="Country">
				<select className={selectCls} name="country" value={values.country} onChange={onChange}>
					<option value="IN">India</option>
					<option value="US">United States</option>
					<option value="GB">United Kingdom</option>
					<option value="SG">Singapore</option>
					<option value="AU">Australia</option>
					<option value="OTHER">Other</option>
				</select>
			</Field>

			<NavButtons onNext={onNext} nextLabel="Continue →" />
		</>
	);
}

// ─── Step 3 — Gateway Connection ─────────────────────────────────────────────

function Step3({
	values,
	onChange,
	onNext,
	onBack,
}: {
	values: ReturnType<typeof getDefaultForm>;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onNext: () => void;
	onBack: () => void;
}) {
	const isOAuth = values.gateway === "razorpay" || values.gateway === "stripe";

	return (
		<>
			<p className="text-sm text-gray-400">
				Connecting your gateway lets us show you real failed-payment data in seconds. Merchants who connect convert at <span className="text-white font-semibold">3× the rate</span> of those who don&apos;t.
			</p>

			<Field label="Choose your payment gateway">
				<select className={selectCls} name="gateway" value={values.gateway} onChange={onChange}>
					<option value="">Select gateway…</option>
					<option value="razorpay">Razorpay (OAuth)</option>
					<option value="stripe">Stripe (OAuth)</option>
					<option value="cashfree">Cashfree (API keys)</option>
					<option value="payu">PayU (API keys)</option>
				</select>
			</Field>

			{values.gateway && isOAuth && (
				<div className="rounded-lg border border-indigo-700 bg-indigo-950/40 px-4 py-3 text-sm text-indigo-300">
					You&apos;ll be redirected to {values.gateway === "razorpay" ? "Razorpay" : "Stripe"} to authorise access. Come back here once done.
					<button
						type="button"
						className="mt-3 block w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
						onClick={() => {
							// TODO: redirect to OAuth flow
							alert(`Redirecting to ${values.gateway} OAuth…`);
						}}
					>
						Connect {values.gateway === "razorpay" ? "Razorpay" : "Stripe"} →
					</button>
				</div>
			)}

			{values.gateway && !isOAuth && (
				<>
					<Field label="API Key / App ID" hint="Find this in your gateway dashboard under API keys">
						<input className={inputCls} name="gatewayApiKey" value={values.gatewayApiKey} onChange={onChange} placeholder="cf_live_XXXXXXXXXXXXXXXX" />
					</Field>
					<Field label="API Secret / Secret Key">
						<input className={inputCls} name="gatewayApiSecret" type="password" value={values.gatewayApiSecret} onChange={onChange} placeholder="••••••••••••••••" />
					</Field>
				</>
			)}

			<NavButtons showBack onBack={onBack} onNext={onNext} nextLabel={values.gateway ? "Continue →" : "Skip for now"} />
		</>
	);
}

// ─── Step 4 — Recovery Preferences ───────────────────────────────────────────

function Step4({
	values,
	onChange,
	onNext,
	onBack,
}: {
	values: ReturnType<typeof getDefaultForm>;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onNext: () => void;
	onBack: () => void;
}) {
	return (
		<>
			<Field label="From name" hint="Name customers see in recovery emails">
				<input className={inputCls} name="fromName" value={values.fromName} onChange={onChange} placeholder="Billing team at Acme" />
			</Field>

			<Field label="Reply-to email" hint="Where customer replies about billing land">
				<input className={inputCls} name="replyToEmail" type="email" value={values.replyToEmail} onChange={onChange} placeholder="billing@acme.com" />
			</Field>

			<Field label="Brand colour" hint="Used for CTA buttons in email templates">
				<div className="flex items-center gap-3">
					<input
						type="color"
						name="brandColorHex"
						value={values.brandColorHex}
						onChange={onChange}
						className="h-10 w-12 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-1"
					/>
					<input className={inputCls} name="brandColorHex" value={values.brandColorHex} onChange={onChange} placeholder="#3b82f6" maxLength={7} />
				</div>
			</Field>

			<Field label="Default recovery campaign" hint="You can customise individual campaigns later">
				<select className={selectCls} name="defaultRecoveryCampaign" value={values.defaultRecoveryCampaign} onChange={onChange}>
					<option value="aggressive_7d">Aggressive 7-day — high-frequency, urgency-led</option>
					<option value="standard_10d">Standard 10-day — balanced (recommended)</option>
					<option value="gentle_14d">Gentle 14-day — soft, relationship-first</option>
				</select>
			</Field>

			<div className="flex items-start gap-3 rounded-lg border border-gray-700 p-3">
				<input
					id="whatsappOptIn"
					type="checkbox"
					name="whatsappOptIn"
					checked={values.whatsappOptIn}
					onChange={onChange}
					className="mt-0.5 h-4 w-4 rounded border-gray-600 accent-indigo-500"
				/>
				<div>
					<label htmlFor="whatsappOptIn" className="text-sm font-medium text-gray-200 cursor-pointer">
						Enable WhatsApp recovery
					</label>
					<p className="text-xs text-gray-500 mt-0.5">
						We&apos;ll walk you through the Interakt setup after onboarding. Typically adds 8–12% extra recovery.
					</p>
				</div>
			</div>

			<NavButtons showBack onBack={onBack} onNext={onNext} nextLabel="Continue →" />
		</>
	);
}

// ─── Step 5 — Team & Notifications ───────────────────────────────────────────

function Step5({
	values,
	onChange,
	onBack,
	onFinish,
	loading,
}: {
	values: ReturnType<typeof getDefaultForm>;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	onBack: () => void;
	onFinish: () => void;
	loading: boolean;
}) {
	return (
		<>
			<p className="text-xs text-gray-500">Optional — you can configure this later in Settings.</p>

			<Field label="Team member emails" hint="Comma-separated. Each person gets an invite link.">
				<input className={inputCls} name="teamEmails" value={values.teamEmails} onChange={onChange} placeholder="alice@acme.com, bob@acme.com" />
			</Field>

			<Field label="Slack webhook URL" hint="Get a ping every time a payment is recovered">
				<input className={inputCls} name="slackWebhookUrl" value={values.slackWebhookUrl} onChange={onChange} placeholder="https://hooks.slack.com/services/…" />
			</Field>

			<Field label="Recovery digest frequency">
				<select className={selectCls} name="digestFrequency" value={values.digestFrequency} onChange={onChange}>
					<option value="realtime">Real-time</option>
					<option value="daily">Daily summary (recommended)</option>
					<option value="weekly">Weekly summary</option>
					<option value="never">Never</option>
				</select>
			</Field>

			<NavButtons
				showBack
				onBack={onBack}
				onFinish={onFinish}
				nextLabel="Finish setup →"
				loading={loading}
				skipLabel="Skip & finish"
				onSkip={onFinish}
			/>
		</>
	);
}

// Helper — only used for the type of `values` prop
function getDefaultForm() {
	return {
		businessLegalName: "",
		businessType: "",
		websiteUrl: "",
		mrrRange: "",
		gstNumber: "",
		country: "IN",
		gateway: "",
		gatewayApiKey: "",
		gatewayApiSecret: "",
		fromName: "",
		replyToEmail: "",
		brandColorHex: "#3b82f6",
		defaultRecoveryCampaign: "standard_10d",
		whatsappOptIn: false,
		teamEmails: "",
		slackWebhookUrl: "",
		digestFrequency: "daily",
	};
}
