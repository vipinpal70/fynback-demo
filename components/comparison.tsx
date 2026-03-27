"use client";

import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

type FeatureStatus = "yes" | "no" | "partial";

interface ComparisonRow {
	feature: string;
	fynback: FeatureStatus;
	razorpay: FeatureStatus;
	stripe: FeatureStatus;
}

const comparisonData: ComparisonRow[] = [
	{
		feature: "Smart retry scheduling",
		fynback: "yes",
		razorpay: "no",
		stripe: "partial",
	},
	{
		feature: "WhatsApp recovery",
		fynback: "yes",
		razorpay: "no",
		stripe: "no",
	},
	{
		feature: "India payday timing",
		fynback: "yes",
		razorpay: "no",
		stripe: "no",
	},
	{
		feature: "Decline code classification",
		fynback: "yes",
		razorpay: "partial",
		stripe: "yes",
	},
	{
		feature: "Campaign analytics",
		fynback: "yes",
		razorpay: "no",
		stripe: "partial",
	},
	{
		feature: "White-label emails",
		fynback: "yes",
		razorpay: "no",
		stripe: "yes",
	},
	{
		feature: "UPI mandate compliance",
		fynback: "yes",
		razorpay: "partial",
		stripe: "no",
	},
];

function StatusIcon({ status }: { status: FeatureStatus }) {
	if (status === "yes") {
		return (
			<div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10b981]/10">
				<Check className="w-4 h-4 text-[#10b981]" />
			</div>
		);
	}
	if (status === "no") {
		return (
			<div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#ef4444]/10">
				<X className="w-4 h-4 text-[#ef4444]" />
			</div>
		);
	}
	return (
		<div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f59e0b]/10">
			<Minus className="w-4 h-4 text-[#f59e0b]" />
		</div>
	);
}

export function Comparison() {
	const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
	const { ref: tableRef, isVisible: tableVisible } = useScrollAnimation();


	return (
		<section className="py-20 sm:py-28 px-4 bg-[#0a0d14]">
			<div className="mx-auto max-w-4xl">
				<div
					ref={headerRef}
					className={cn(
						"text-center mb-12 scroll-animate",
						headerVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						COMPARISON
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] text-balance">
						Why fynback over Razorpay&apos;s built-in recovery
					</h2>
				</div>

				<div
					ref={tableRef}
					className={cn("scroll-animate", tableVisible && "is-visible")}
				>
					{/* Table Container */}
					<div className="rounded-2xl border border-[#1e2638] bg-[#111520] overflow-hidden">
						{/* Table Header */}
						<div className="grid grid-cols-4 border-b border-[#1e2638]">
							<div className="p-4 sm:p-5">
								<span className="text-sm font-medium text-[#475569]">
									Feature
								</span>
							</div>
							<div className="p-4 sm:p-5 text-center border-l border-[#1e2638] bg-[#3b82f6]/5">
								<span className="text-sm font-semibold text-[#3b82f6]">
									fynback
								</span>
							</div>
							<div className="p-4 sm:p-5 text-center border-l border-[#1e2638]">
								<span className="text-sm font-medium text-[#475569]">
									Razorpay
								</span>
							</div>
							<div className="p-4 sm:p-5 text-center border-l border-[#1e2638]">
								<span className="text-sm font-medium text-[#475569]">
									Stripe
								</span>
							</div>
						</div>

						{/* Table Body */}
						{comparisonData.map((row, index) => (
							<div
								key={row.feature}
								className={cn(
									"grid grid-cols-4",
									index !== comparisonData.length - 1 &&
										"border-b border-[#1e2638]",
								)}
							>
								<div className="p-4 sm:p-5 flex items-center">
									<span className="text-sm text-[#f1f5f9]">{row.feature}</span>
								</div>
								<div className="p-4 sm:p-5 flex items-center justify-center border-l border-[#1e2638] bg-[#3b82f6]/5">
									<StatusIcon status={row.fynback} />
								</div>
								<div className="p-4 sm:p-5 flex items-center justify-center border-l border-[#1e2638]">
									<StatusIcon status={row.razorpay} />
								</div>
								<div className="p-4 sm:p-5 flex items-center justify-center border-l border-[#1e2638]">
									<StatusIcon status={row.stripe} />
								</div>
							</div>
						))}
					</div>

					{/* Caption */}
					<p className="text-center text-xs text-[#475569] mt-4">
						Comparison based on features available as of March 2026
					</p>
				</div>
			</div>
		</section>
	);
}
