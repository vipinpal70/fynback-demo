"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

function AnimatedBarChart() {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.3 },
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);


	return (
		<div
			ref={ref}
			className="relative p-6 rounded-2xl border border-[#1e2638] bg-[#111520]"
		>
			<div className="space-y-6">
				{/* Without FynBack */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-[#94a3b8]">Without FynBack</span>
						<span className="font-mono text-[#f97316]">38%</span>
					</div>
					<div className="h-8 bg-[#1e2638] rounded-lg overflow-hidden">
						<div
							className={cn(
								"h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-lg transition-all duration-1000 ease-out",
								isVisible ? "w-[38%]" : "w-0",
							)}
						/>
					</div>
				</div>

				{/* With FynBack */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-[#94a3b8]">With FynBack</span>
						<span className="font-mono text-[#10b981]">78%</span>
					</div>
					<div className="h-8 bg-[#1e2638] rounded-lg overflow-hidden">
						<div
							className={cn(
								"h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-lg transition-all duration-1000 ease-out delay-300",
								isVisible ? "w-[78%]" : "w-0",
							)}
						/>
					</div>
				</div>

				{/* Gap Label */}
				<div className="flex items-center justify-center">
					<div className="px-4 py-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10">
						<span className="text-sm font-medium text-[#10b981]">
							+40% more revenue recovered
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ProblemStatement() {
	const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
	const { ref: chartRef, isVisible: chartVisible } = useScrollAnimation();

	return (
		<section className="py-20 sm:py-28 px-4">
			<div className="mx-auto max-w-7xl">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* Left - Text */}
					<div
						ref={textRef}
						className={cn("scroll-animate", textVisible && "is-visible")}
					>
						<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
							THE PROBLEM
						</span>
						<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] mb-6 text-balance">
							Every month, you&apos;re silently losing revenue.
						</h2>
						<p className="text-[#94a3b8] mb-6 leading-relaxed">
							Failed payments don&apos;t announce themselves. A card expires, a
							UPI mandate fails, a bank declines — and your customer silently
							churns without either of you knowing what happened.
						</p>
						<p className="text-[#94a3b8] mb-8 leading-relaxed">
							For a SaaS doing ₹10L MRR, that&apos;s typically ₹40,000–80,000
							per month walking out the door. Razorpay&apos;s basic retry
							catches less than half of it.
						</p>

						{/* Stat Callout Box */}
						<div className="border-l-4 border-[#3b82f6] bg-[#3b82f6]/5 p-5 rounded-r-lg">
							<p className="text-[#94a3b8] italic">
								20–40% of SaaS churn is caused by failed payments, not unhappy
								customers.
							</p>
						</div>
					</div>

					{/* Right - Visual */}
					<div
						ref={chartRef}
						className={cn("scroll-animate", chartVisible && "is-visible", "delay-150")}
					>
						<AnimatedBarChart />
					</div>
				</div>
			</div>
		</section>
	);
}
