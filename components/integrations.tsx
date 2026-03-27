"use client";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const integrationGroups = [
	{
		label: "Payment gateways",
		items: [
			{ name: "Razorpay", color: "bg-blue-500/20 text-blue-400" },
			{ name: "Stripe", color: "bg-purple-500/20 text-purple-400" },
			{ name: "Cashfree", color: "bg-green-500/20 text-green-400" },
			{ name: "PayU", color: "bg-orange-500/20 text-orange-400" },
		],
	},
	{
		label: "Recovery channels",
		items: [
			{ name: "WhatsApp Business", color: "bg-green-500/20 text-green-400" },
			{ name: "Email/Resend", color: "bg-orange-500/20 text-orange-400" },
			{ name: "SMS/MSG91", color: "bg-blue-500/20 text-blue-400" },
			{ name: "Slack", color: "bg-purple-500/20 text-purple-400" },
		],
	},
	{
		label: "Coming soon",
		comingSoon: true,
		items: [
			{ name: "Paddle", color: "bg-[#1e2638] text-[#475569]" },
			{ name: "Chargebee", color: "bg-[#1e2638] text-[#475569]" },
			{ name: "Recurly", color: "bg-[#1e2638] text-[#475569]" },
			{ name: "Zoho Subscriptions", color: "bg-[#1e2638] text-[#475569]" },
		],
	},
];

export function Integrations() {
	const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
	const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

	return (
		<section id="integrations" className="py-20 sm:py-28 px-4 bg-[#0a0d14]">
			<div className="mx-auto max-w-7xl">
				<div
					ref={headerRef}
					className={cn(
						"text-center mb-16 scroll-animate",
						headerVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						INTEGRATIONS
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] text-balance">
						Connects to your existing stack
					</h2>
				</div>

				<div
					ref={contentRef}
					className={cn(
						"space-y-12 scroll-animate",
						contentVisible && "is-visible",
					)}
				>
					{integrationGroups.map((group) => (
						<div key={group.label}>
							<h3
								className={cn(
									"text-sm font-medium mb-4",
									group.comingSoon ? "text-[#475569]" : "text-[#94a3b8]",
								)}
							>
								{group.label}
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{group.items.map((item) => (
									<div
										key={item.name}
										className={cn(
											"group flex flex-col items-center justify-center py-6 px-4 rounded-xl border border-[#1e2638] bg-[#111520] transition-all duration-300",
											!group.comingSoon && "hover:border-[#3b82f6]",
										)}
									>
										<div
											className={cn(
												"h-12 w-12 rounded-xl flex items-center justify-center mb-3",
												item.color,
											)}
										>
											<span className="text-lg font-bold">
												{item.name.charAt(0)}
											</span>
										</div>
										<span
											className={cn(
												"text-sm font-medium text-center",
												group.comingSoon ? "text-[#475569]" : "text-[#f1f5f9]",
											)}
										>
											{item.name}
										</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
