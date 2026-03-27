"use client";

import { cn } from "@/lib/utils";
import {
	useScrollAnimation,
	useStaggeredScrollAnimation,
} from "@/hooks/use-scroll-animation";

function PlugIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 22V16M12 16H8M12 16H16"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<rect
				x="6"
				y="8"
				width="12"
				height="8"
				rx="2"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<path
				d="M9 8V4"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M15 8V4"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function RadarIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
			<circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
			<circle cx="12" cy="12" r="2" fill="currentColor" />
			<path
				d="M12 2V6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function RecoveryIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 14C4 14 6 12 12 12C18 12 20 14 20 14"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M12 12V4M12 4L8 8M12 4L16 8"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7 17L12 20L17 17"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const steps = [
	{
		number: "01",
		icon: PlugIcon,
		iconColor: "text-[#3b82f6]",
		title: "Connect your gateway",
		body: "Link your Razorpay, Stripe, or Cashfree account in one click. We start monitoring failed payments immediately.",
		badge: "5 minutes",
		badgeColor: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
	},
	{
		number: "02",
		icon: RadarIcon,
		iconColor: "text-purple-400",
		title: "We detect every failure",
		body: "Our webhook listener catches every failed payment — expired cards, UPI failures, insufficient funds — and classifies the decline code automatically.",
		badge: "Real-time",
		badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
	},
	{
		number: "03",
		icon: RecoveryIcon,
		iconColor: "text-[#10b981]",
		title: "Smart recovery fires",
		body: "Timed retries, personalised WhatsApp messages, and email sequences launch automatically. Recovery happens even while you sleep.",
		badge: "Up to 78% recovered",
		badgeColor: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
	},
];

export function HowItWorks() {
	const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
	const {
		containerRef,
		isVisible: cardsVisible,
		getItemStyle,
	} = useStaggeredScrollAnimation(steps.length);


	return (
		<section id="how-it-works" className="py-20 sm:py-28 px-4 bg-[#0a0d14]">
			<div className="mx-auto max-w-7xl">
				<div
					ref={headerRef}
					className={cn(
						"text-center mb-16 scroll-animate",
						headerVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						HOW IT WORKS
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] text-balance">
						Recovery on autopilot. You don&apos;t lift a finger.
					</h2>
				</div>

				<div className="relative">
					{/* Desktop Dashed Line */}
					<div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-px border-t-2 border-dashed border-[#1e2638]" />

					<div ref={containerRef} className="grid md:grid-cols-3 gap-6">
						{steps.map((step, index) => {
							const Icon = step.icon;
							return (
								<div
									key={step.number}
									className={cn(
										"group relative rounded-2xl border border-[#1e2638] bg-[#111520] p-7 transition-all duration-300 hover:border-[#3b82f6] scroll-animate-stagger",
										index !== steps.length - 1 && "md:mb-0 mb-4",
										cardsVisible && "is-visible",
									)}
									style={getItemStyle(index)}
								>
									<div className="flex items-start justify-between mb-5">
										<div
											className={cn(
												"p-3 rounded-xl bg-[#1e2638]/50",
												step.iconColor,
											)}
										>
											<Icon className="h-6 w-6" />
										</div>
										<span className="font-mono text-3xl font-bold text-[#1e2638]">
											{step.number}
										</span>
									</div>
									<h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f1f5f9] mb-3">
										{step.title}
									</h3>
									<p className="text-[#94a3b8] text-sm leading-relaxed mb-5">
										{step.body}
									</p>
									<span
										className={cn(
											"inline-flex px-3 py-1 rounded-full text-xs font-medium border",
											step.badgeColor,
										)}
									>
										{step.badge}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
