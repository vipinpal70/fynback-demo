"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	useScrollAnimation,
	useStaggeredScrollAnimation,
} from "@/hooks/use-scroll-animation";

const plans = [
	{
		name: "Starter",
		price: { monthly: 2999, annual: 2399 },
		subtext: "Up to ₹5L MRR",
		features: [
			"Razorpay + Stripe integration",
			"3-email dunning sequence",
			"Smart retry scheduling",
			"Basic analytics dashboard",
			"Email support",
		],
		cta: "Start free trial",
		featured: false,
	},
	{
		name: "Growth",
		price: { monthly: 6999, annual: 5599 },
		subtext: "Up to ₹25L MRR",
		features: [
			"Everything in Starter",
			"WhatsApp Business recovery",
			"SMS reminders (MSG91)",
			"Cashfree + PayU integration",
			"Campaign editor & A/B testing",
			"Pause subscription flow",
			"Priority support",
		],
		cta: "Start free trial",
		featured: true,
	},
	{
		name: "Scale",
		price: { monthly: 14999, annual: 11999 },
		subtext: "Unlimited MRR",
		features: [
			"Everything in Growth",
			"AI-powered email copy",
			"Customer segmentation",
			"Custom retry schedules",
			"White-label emails",
			"Dedicated Slack channel",
			"SLA guarantee",
		],
		cta: "Talk to us",
		featured: false,
	},
];

function AnimatedPrice({
	value,
	duration = 500,
}: {
	value: number;
	duration?: number;
}) {
	const [displayValue, setDisplayValue] = useState(value);
	const previousValue = useRef(value);

	useEffect(() => {
		const startValue = previousValue.current;
		const endValue = value;
		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease out cubic
			const easeOut = 1 - Math.pow(1 - progress, 3);
			const currentValue = Math.round(
				startValue + (endValue - startValue) * easeOut,
			);

			setDisplayValue(currentValue);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				previousValue.current = endValue;
			}
		};

		requestAnimationFrame(animate);
	}, [value, duration]);

	return <>{displayValue.toLocaleString("en-IN")}</>;
}

export function Pricing() {
	const [isAnnual, setIsAnnual] = useState(false);
	const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
	const {
		containerRef,
		isVisible: cardsVisible,
		getItemStyle,
	} = useStaggeredScrollAnimation(plans.length);

	return (
		<section id="pricing" className="py-20 sm:py-28 px-4 bg-[#111520]">
			<div className="mx-auto max-w-7xl">
				<div
					ref={headerRef}
					className={cn(
						"text-center mb-12 scroll-animate",
						headerVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						PRICING
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] mb-8 text-balance">
						Pays for itself in the first recovery
					</h2>

					{/* Toggle */}
					<div className="inline-flex items-center gap-3 p-1 rounded-full border border-[#1e2638] bg-[#0a0d14]">
						<button
							onClick={() => setIsAnnual(false)}
							className={cn(
								"px-4 py-2 rounded-full text-sm font-medium transition-all",
								!isAnnual
									? "bg-[#3b82f6] text-white"
									: "text-[#94a3b8] hover:text-[#f1f5f9]",
							)}
						>
							Monthly
						</button>
						<button
							onClick={() => setIsAnnual(true)}
							className={cn(
								"px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
								isAnnual
									? "bg-[#3b82f6] text-white"
									: "text-[#94a3b8] hover:text-[#f1f5f9]",
							)}
						>
							Annual
							<span className="text-xs px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
								Save 20%
							</span>
						</button>
					</div>
				</div>

				<div
					ref={containerRef}
					className="flex md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-auto md:px-0"
				>
					{plans.map((plan, index) => (
						<div
							key={plan.name}
							className={cn(
								"relative rounded-2xl border p-6 transition-all duration-300 scroll-animate-stagger shrink-0 w-[85vw] md:w-auto snap-center",
								plan.featured
									? "border-[#3b82f6] bg-[#0a0d14] md:scale-105 shadow-xl shadow-[#3b82f6]/10 hover:shadow-[#3b82f6]/30 hover:shadow-2xl hover:border-[#60a5fa]"
									: "border-[#1e2638] bg-[#0a0d14] hover:border-[#2a3548]",
								cardsVisible && "is-visible",
							)}
							style={getItemStyle(index)}
						>
							{plan.featured && (
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-[#3b82f6] text-white">
									Most popular
								</span>
							)}
							<div className="mb-6">
								<h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f1f5f9] mb-2">
									{plan.name}
								</h3>
								<div className="flex items-baseline gap-2">
									<span className="font-mono text-3xl font-bold text-[#f1f5f9]">
										₹
										<AnimatedPrice
											value={isAnnual ? plan.price.annual : plan.price.monthly}
										/>
									</span>
									<span className="text-[#475569]">/mo</span>
									{isAnnual && (
										<span className="font-mono text-sm text-[#475569] line-through">
											₹{plan.price.monthly.toLocaleString("en-IN")}
										</span>
									)}
								</div>
								<p className="text-sm text-[#475569] mt-1">{plan.subtext}</p>
							</div>

							<ul className="space-y-3 mb-6">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-3">
										<Check className="h-4 w-4 text-[#10b981] shrink-0 mt-0.5" />
										<span className="text-sm text-[#94a3b8]">{feature}</span>
									</li>
								))}
							</ul>

							<Button
								className={cn(
									"w-full",
									plan.featured
										? "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
										: "bg-[#1e2638] hover:bg-[#2a3548] text-[#f1f5f9]",
								)}
							>
								{plan.cta}
							</Button>
						</div>
					))}
				</div>

				<p className="text-center text-sm text-[#475569] mt-8">
					All plans include a 14-day free trial. No credit card required. Cancel
					anytime.
				</p>
			</div>
		</section>
	);
}
