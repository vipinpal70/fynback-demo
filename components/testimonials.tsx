"use client";

import { cn } from "@/lib/utils";
import {
	useScrollAnimation,
	useStaggeredScrollAnimation,
} from "@/hooks/use-scroll-animation";

const testimonials = [
	{
		quote:
			"We were losing ₹60,000 a month to failed UPI payments and had no idea. FynBack set up in 8 minutes and recovered ₹47,000 in the first month alone.",
		name: "Rahul M.",
		role: "Founder, EdTech SaaS",
		metric: "₹47,000 recovered in month 1",
	},
	{
		quote:
			"The WhatsApp recovery is unreal. Customers actually respond and update their UPI in minutes. Our recovery rate went from 34% to 81% in 3 weeks.",
		name: "Priya S.",
		role: "Co-founder, D2C Subscription Box",
		metric: "81% recovery rate",
	},
	{
		quote:
			"I didn't realise how much Razorpay's default retry was leaving on the table. FynBack's payday-timing feature alone recovered an extra ₹1.2L last month.",
		name: "Karthik R.",
		role: "CTO, B2B SaaS",
		metric: "+₹1.2L extra/month",
	},
];

export function Testimonials() {
	const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
	const {
		containerRef,
		isVisible: cardsVisible,
		getItemStyle,
	} = useStaggeredScrollAnimation(testimonials.length);

	return (
		<section className="py-20 sm:py-28 px-4 bg-[#0a0d14]">
			<div className="mx-auto max-w-7xl">
				<div
					ref={headerRef}
					className={cn(
						"text-center mb-16 scroll-animate",
						headerVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						RESULTS
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] text-balance">
						What founders are recovering
					</h2>
				</div>

				<div ref={containerRef} className="grid md:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<div
							key={testimonial.name}
							className={cn(
								"rounded-2xl border border-[#1e2638] bg-[#111520] p-6 scroll-animate-stagger",
								cardsVisible && "is-visible",
							)}
							style={getItemStyle(index)}
						>
							<span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
								{testimonial.metric}
							</span>
							<blockquote className="text-[#f1f5f9] mb-6 leading-relaxed">
								&ldquo;{testimonial.quote}&rdquo;
							</blockquote>
							<div>
								<p className="font-medium text-[#f1f5f9]">{testimonial.name}</p>
								<p className="text-sm text-[#475569]">{testimonial.role}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
