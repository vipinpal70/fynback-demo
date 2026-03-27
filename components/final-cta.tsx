"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const trustPoints = [
	"14-day free trial",
	"No credit card",
	"Setup in 5 minutes",
	"Cancel anytime",
];

export function FinalCTA() {
	const { ref, isVisible } = useScrollAnimation();

	return (
		<section className="relative py-20 sm:py-28 px-4 overflow-hidden">
			{/* Background Glow */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

			<div
				ref={ref}
				className={cn(
					"relative mx-auto max-w-3xl text-center scroll-animate",
					isVisible && "is-visible",
				)}
			>
				<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f1f5f9] mb-6 text-balance">
					Start recovering lost revenue today. For free.
				</h2>
				<p className="text-lg text-[#94a3b8] mb-8">
					Connect your Razorpay account in 5 minutes.
					<br />
					See your first recovery in 24 hours.
				</p>

				<Button
					size="lg"
					className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-10 py-6 text-base hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all mb-8"
				>
					{"Start your free trial →"}
				</Button>

				<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
					{trustPoints.map((point) => (
						<div key={point} className="flex items-center gap-2">
							<Check className="h-4 w-4 text-[#10b981]" />
							<span className="text-sm text-[#94a3b8]">{point}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
