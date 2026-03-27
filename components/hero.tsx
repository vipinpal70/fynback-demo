"use client";

import { useEffect, useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

const recoveryFeedItems = [
	{
		amount: "₹4,200",
		gateway: "Razorpay",
		reason: "insufficient funds",
		time: "2 min ago",
		status: "recovered",
	},
	{
		amount: "₹12,800",
		gateway: "Stripe",
		reason: "card expired",
		time: "8 min ago",
		status: "recovered",
	},
	{
		amount: "₹3,600",
		gateway: "Cashfree",
		reason: "UPI failure",
		time: "retry in 4h",
		status: "retrying",
	},
	{
		amount: "₹8,100",
		gateway: "Razorpay",
		reason: "do not honor",
		time: "22 min ago",
		status: "recovered",
	},
];

const gatewayColors: Record<string, string> = {
	Razorpay: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	Stripe: "bg-purple-500/20 text-purple-400 border-purple-500/30",
	Cashfree: "bg-green-500/20 text-green-400 border-green-500/30",
	PayU: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

function LiveRecoveryFeed() {
	const mounted = useMounted();
	const [visibleItems, setVisibleItems] = useState<number[]>([]);
	const [progressKey, setProgressKey] = useState(0);

	useEffect(() => {
		if (!mounted) return;
		const showItem = (index: number) => {
			setVisibleItems((prev) => [...prev, index]);
		};

		const timers = recoveryFeedItems.map((_, index) =>
			setTimeout(() => showItem(index), index * 1500),
		);

		const resetTimer = setTimeout(() => {
			setVisibleItems([]);
			timers.forEach(clearTimeout);
		}, 8000);

		const intervalId = setInterval(() => {
			setVisibleItems([]);
			recoveryFeedItems.forEach((_, index) => {
				setTimeout(() => showItem(index), index * 1500);
			});
		}, 8000);

		return () => {
			timers.forEach(clearTimeout);
			clearTimeout(resetTimer);
			clearInterval(intervalId);
		};
	}, [mounted]);

	// Progress bar cycling animation
	useEffect(() => {
		if (!mounted) return;
		const interval = setInterval(() => {
			setProgressKey((prev) => prev + 1);
		}, 6000);
		return () => clearInterval(interval);
	}, [mounted]);

	if (!mounted) {
		return (
			<div className="relative mx-auto max-w-md lg:max-w-lg min-h-[350px] rounded-2xl border border-[#1e2638] bg-[#111520] p-5 shadow-2xl shadow-black/40" />
		);
	}

	return (
		<div className="relative mx-auto max-w-md lg:max-w-lg">
			<div className="rounded-2xl border border-[#1e2638] bg-[#111520] p-5 shadow-2xl shadow-black/40 overflow-hidden">
				<div className="flex items-center gap-2 mb-4">
					{/* Animated green pulse dot */}
					<span className="relative flex h-2.5 w-2.5">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
						<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10b981]" />
					</span>
					<span className="text-sm font-medium text-[#f1f5f9]">
						Live recovery feed
					</span>
				</div>
				<div className="space-y-3">
					{recoveryFeedItems.map((item, index) => (
						<div
							key={index}
							className={cn(
								"flex items-center gap-3 p-3 rounded-lg bg-[#0a0d14] border border-[#1e2638] transition-all duration-500",
								visibleItems.includes(index)
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-2",
							)}
						>
							{item.status === "recovered" ? (
								<Check className="h-4 w-4 text-[#10b981] shrink-0" suppressHydrationWarning />
							) : (
								<RefreshCw
									className="h-4 w-4 text-[#3b82f6] shrink-0 animate-spin [animation-duration:2s]"
									suppressHydrationWarning
								/>
							)}
							<span className="font-mono text-lg font-semibold text-[#10b981]">
								{item.amount}
							</span>
							<span
								className={cn(
									"text-xs px-2 py-0.5 rounded-full border",
									gatewayColors[item.gateway],
								)}
							>
								{item.gateway}
							</span>
							<span className="text-xs text-[#475569] hidden sm:inline">
								{item.reason}
							</span>
							<span className="text-xs text-[#475569] ml-auto">
								{item.time}
							</span>
						</div>
					))}
				</div>
				{/* Progress bar at the bottom */}
				<div className="mt-4 h-0.5 w-full bg-[#1e2638] rounded-full overflow-hidden">
					<div
						key={progressKey}
						className="h-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] rounded-full [animation:progressCycle_6s_linear_infinite]"
					/>
				</div>
				<style
					dangerouslySetInnerHTML={{
						__html: `
          @keyframes progressCycle {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
        `,
					}}
				/>
			</div>
		</div>
	);
}

export function Hero() {

	return (
		<section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
			<div className="mx-auto max-w-7xl w-full">
				<div className="text-center mb-12">
					{/* Eyebrow Badge */}
					<div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1.5 rounded-full mb-8">
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
						<span>Now supporting Razorpay, Stripe, Cashfree & PayU</span>
					</div>

					{/* Main Headline */}
					<h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#f1f5f9] leading-tight mb-6 text-balance">
						Stop losing{" "}
						<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
							revenue
						</span>{" "}
						to
						<br className="hidden sm:block" /> failed payments.
					</h1>

					{/* Sub-headline */}
					<p className="text-lg sm:text-xl text-[#94a3b8] max-w-xl mx-auto mb-8 text-pretty">
						FynBack automatically recovers failed Razorpay and Stripe payments
						through smart retries, WhatsApp nudges, and personalised email
						sequences. Average recovery rate: 78%.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 w-full sm:w-auto px-4 sm:px-0">
						<Button
							size="lg"
							className="w-full sm:w-auto bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-6 text-base hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all"
						>
							{"Recover your first payment free →"}
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto border-[#1e2638] bg-transparent text-[#f1f5f9] hover:bg-[#1e2638] px-8 py-6 text-base"
						>
							See how it works
						</Button>
					</div>

					{/* Trust Line */}
					<p className="text-sm text-[#475569]">
						No credit card required · 14-day free trial · Setup in under 10
						minutes
					</p>
				</div>

				{/* Hero Visual - Live Recovery Feed */}
				<div className="mb-12">
					<LiveRecoveryFeed />
				</div>

				{/* Stat Pills */}
				<div className="flex flex-wrap items-center justify-center gap-4">
					<div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e2638] bg-[#111520]">
						<span className="font-mono text-sm font-medium text-[#10b981]">
							₹2.4Cr
						</span>
						<span className="text-sm text-[#94a3b8]">recovered this month</span>
					</div>
					<div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e2638] bg-[#111520]">
						<span className="font-mono text-sm font-medium text-[#10b981]">
							78%
						</span>
						<span className="text-sm text-[#94a3b8]">
							average recovery rate
						</span>
					</div>
					<div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e2638] bg-[#111520]">
						<span className="font-mono text-sm font-medium text-[#3b82f6]">
							{"< 5 min"}
						</span>
						<span className="text-sm text-[#94a3b8]">setup time</span>
					</div>
				</div>
			</div>
		</section>
	);
}
