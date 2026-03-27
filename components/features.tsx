"use client";

import { cn } from "@/lib/utils";
import {
	useScrollAnimation,
	useStaggeredScrollAnimation,
} from "@/hooks/use-scroll-animation";

function WhatsAppMockup() {
	return (
		<div className="mt-4 p-3 rounded-xl bg-[#1e2638]/50 max-w-xs">
			<div className="flex items-center gap-2 mb-2">
				<div className="h-8 w-8 rounded-full bg-[#10b981]/20 flex items-center justify-center">
					<span className="text-[#10b981] text-xs font-bold">Y</span>
				</div>
				<span className="text-xs text-[#f1f5f9]">YourBrand</span>
			</div>
			<div className="bg-[#0a0d14] rounded-lg p-3 text-xs text-[#94a3b8] leading-relaxed">
				<p>
					Hi Rahul, your subscription payment of ₹999 didn&apos;t go through.
					Tap below to complete it in 30 seconds:
				</p>
				<div className="mt-2 bg-[#10b981] text-white text-center py-1.5 rounded text-xs font-medium">
					Pay ₹999 via UPI
				</div>
			</div>
		</div>
	);
}

function GatewayLogos() {
	return (
		<div className="mt-4 flex flex-wrap gap-2">
			<span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
				Razorpay
			</span>
			<span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
				Stripe
			</span>
			<span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
				Cashfree
			</span>
		</div>
	);
}

function CalendarGrid() {
	return (
		<div className="mt-4 grid grid-cols-7 gap-1 max-w-[160px]">
			{Array.from({ length: 28 }, (_, i) => {
				const day = i + 1;
				const isHighlighted = day === 1 || day === 25;
				return (
					<div
						key={day}
						className={cn(
							"h-5 w-5 rounded text-xs flex items-center justify-center",
							isHighlighted
								? "bg-[#10b981] text-white font-medium"
								: "bg-[#1e2638]/50 text-[#475569]",
						)}
					>
						{day}
					</div>
				);
			})}
		</div>
	);
}

function MiniChart() {
	return (
		<div className="mt-4 h-20 flex items-end gap-1">
			{[30, 45, 40, 55, 60, 75, 85, 80, 90, 95].map((height, i) => (
				<div
					key={i}
					className="flex-1 bg-gradient-to-t from-[#3b82f6] to-[#3b82f6]/50 rounded-t"
					style={{ height: `${height}%` }}
				/>
			))}
		</div>
	);
}

const features = [
	{
		size: "large",
		accentColor: "border-t-[#10b981]",
		title: "WhatsApp-first recovery",
		body: "95% open rate vs 20% for email. FynBack sends pre-approved WhatsApp Business messages with a direct UPI re-authentication link. The highest-converting channel for Indian customers.",
		visual: <WhatsAppMockup />,
	},
	{
		size: "medium",
		accentColor: "border-t-[#3b82f6]",
		title: "Razorpay + Stripe + Cashfree",
		body: "Native integrations with all major Indian gateways. One tool, all your payment providers.",
		visual: <GatewayLogos />,
	},
	{
		size: "medium",
		accentColor: "border-t-[#10b981]",
		title: "India payday timing",
		body: "Retries scheduled around the 1st and 25th of the month when Indian accounts are most likely to have funds.",
		visual: <CalendarGrid />,
	},
	{
		size: "small",
		accentColor: "border-t-orange-500",
		title: "Hard decline protection",
		body: "Stolen cards and fraud flags are never retried. We classify every decline code before scheduling.",
		visual: null,
	},
	{
		size: "small",
		accentColor: "border-t-purple-500",
		title: "UPI mandate compliance",
		body: "Retry windows respect NPCI regulations. No compliance risk.",
		visual: null,
	},
	{
		size: "large",
		accentColor: "border-t-[#3b82f6]",
		title: "Recovery analytics dashboard",
		body: "See exactly how much revenue was recovered, which channel converted it, and your recovery rate vs baseline — per gateway, per campaign, per customer.",
		visual: <MiniChart />,
	},
];

export function Features() {
	const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
	const {
		containerRef,
		isVisible: cardsVisible,
		getItemStyle,
	} = useStaggeredScrollAnimation(features.length);

	return (
		<section id="features" className="py-20 sm:py-28 px-4 bg-[#111520]">
			<div className="mx-auto max-w-7xl">
				<div
					ref={headerRef}
					className={cn(
						"text-center mb-16 scroll-animate",
						headerVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						FEATURES
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] text-balance">
						Everything built for the Indian payment stack
					</h2>
				</div>

				{/* Bento Grid */}
				<div
					ref={containerRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
				>
					{/* Large Card 1 - spans 2 cols */}
					<div
						className={cn(
							"col-span-1 md:col-span-2 rounded-2xl border border-[#1e2638] bg-[#0a0d14] p-6 border-t-2 scroll-animate-stagger",
							features[0].accentColor,
							cardsVisible && "is-visible",
						)}
						style={getItemStyle(0)}
					>
						<h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#f1f5f9] mb-2">
							{features[0].title}
						</h3>
						<p className="text-sm text-[#94a3b8] leading-relaxed">
							{features[0].body}
						</p>
						{features[0].visual}
					</div>

					{/* Medium Card 1 */}
					<div
						className={cn(
							"rounded-2xl border border-[#1e2638] bg-[#0a0d14] p-6 border-t-2 scroll-animate-stagger",
							features[1].accentColor,
							cardsVisible && "is-visible",
						)}
						style={getItemStyle(1)}
					>
						<h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#f1f5f9] mb-2">
							{features[1].title}
						</h3>
						<p className="text-sm text-[#94a3b8] leading-relaxed">
							{features[1].body}
						</p>
						{features[1].visual}
					</div>

					{/* Medium Card 2 */}
					<div
						className={cn(
							"rounded-2xl border border-[#1e2638] bg-[#0a0d14] p-6 border-t-2 scroll-animate-stagger",
							features[2].accentColor,
							cardsVisible && "is-visible",
						)}
						style={getItemStyle(2)}
					>
						<h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#f1f5f9] mb-2">
							{features[2].title}
						</h3>
						<p className="text-sm text-[#94a3b8] leading-relaxed">
							{features[2].body}
						</p>
						{features[2].visual}
					</div>

					{/* Small Card 1 */}
					<div
						className={cn(
							"rounded-2xl border border-[#1e2638] bg-[#0a0d14] p-6 border-t-2 scroll-animate-stagger",
							features[3].accentColor,
							cardsVisible && "is-visible",
						)}
						style={getItemStyle(3)}
					>
						<h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#f1f5f9] mb-2">
							{features[3].title}
						</h3>
						<p className="text-sm text-[#94a3b8] leading-relaxed">
							{features[3].body}
						</p>
					</div>

					{/* Small Card 2 */}
					<div
						className={cn(
							"rounded-2xl border border-[#1e2638] bg-[#0a0d14] p-6 border-t-2 scroll-animate-stagger",
							features[4].accentColor,
							cardsVisible && "is-visible",
						)}
						style={getItemStyle(4)}
					>
						<h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#f1f5f9] mb-2">
							{features[4].title}
						</h3>
						<p className="text-sm text-[#94a3b8] leading-relaxed">
							{features[4].body}
						</p>
					</div>

					{/* Large Card 2 - spans 2 cols */}
					<div
						className={cn(
							"col-span-1 md:col-span-2 rounded-2xl border border-[#1e2638] bg-[#0a0d14] p-6 border-t-2 scroll-animate-stagger",
							features[5].accentColor,
							cardsVisible && "is-visible",
						)}
						style={getItemStyle(5)}
					>
						<h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#f1f5f9] mb-2">
							{features[5].title}
						</h3>
						<p className="text-sm text-[#94a3b8] leading-relaxed">
							{features[5].body}
						</p>
						{features[5].visual}
					</div>
				</div>
			</div>
		</section>
	);
}
