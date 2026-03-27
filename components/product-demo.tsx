"use client";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
	TrendingUp,
	Percent,
	CreditCard,
	ArrowUpRight,
	ArrowDownRight,
	MoreHorizontal,
	Bell,
	Search,
	ChevronDown,
} from "lucide-react";

export function ProductDemo() {
	const { ref, isVisible } = useScrollAnimation();

	return (
		<section className="py-20 sm:py-28 px-4 bg-[#111520]">
			<div className="mx-auto max-w-6xl">
				<div
					ref={ref}
					className={cn(
						"text-center mb-12 scroll-animate",
						isVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						PRODUCT
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] text-balance">
						See it in action
					</h2>
				</div>

				{/* Browser Chrome Mockup */}
				<div
					className={cn("scroll-animate", isVisible && "is-visible", "delay-150")}
				>
					<div className="rounded-xl border border-[#1e2638] bg-[#0a0d14] overflow-hidden shadow-2xl shadow-black/50">
						{/* Browser Header */}
						<div className="flex items-center gap-3 px-4 py-3 bg-[#111520] border-b border-[#1e2638]">
							{/* Traffic Lights */}
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
								<div className="w-3 h-3 rounded-full bg-[#febc2e]" />
								<div className="w-3 h-3 rounded-full bg-[#28c840]" />
							</div>
							{/* URL Bar */}
							<div className="flex-1 flex items-center justify-center">
								<div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#0a0d14] border border-[#1e2638] text-sm max-w-md w-full">
									<svg
										className="w-3.5 h-3.5 text-[#10b981]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-[#94a3b8]">
										app.FynBack.in/dashboard
									</span>
								</div>
							</div>
							{/* Placeholder for symmetry */}
							<div className="w-[52px]" />
						</div>

						{/* Dashboard Content - 16:9 aspect ratio */}
						<div className="aspect-video bg-[#0a0d14] p-4 sm:p-6">
							{/* Dashboard Header */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
											<span className="text-white font-bold text-sm">R</span>
										</div>
										<span className="font-[family-name:var(--font-heading)] font-semibold text-[#f1f5f9] hidden sm:inline">
											FynBack
										</span>
									</div>
									<nav className="hidden md:flex items-center gap-6 ml-8">
										<span className="text-sm font-medium text-[#3b82f6]">
											Dashboard
										</span>
										<span className="text-sm text-[#475569]">Campaigns</span>
										<span className="text-sm text-[#475569]">Analytics</span>
										<span className="text-sm text-[#475569]">Settings</span>
									</nav>
								</div>
								<div className="flex items-center gap-3">
									<div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111520] border border-[#1e2638]">
										<Search className="w-4 h-4 text-[#475569]" />
										<span className="text-sm text-[#475569]">Search...</span>
									</div>
									<button className="p-2 rounded-lg hover:bg-[#111520] transition-colors relative">
										<Bell className="w-5 h-5 text-[#475569]" />
										<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444]" />
									</button>
									<div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#10b981]" />
								</div>
							</div>

							{/* Page Title */}
							<div className="flex items-center justify-between mb-6">
								<div>
									<h1 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[#f1f5f9]">
										Dashboard
									</h1>
									<p className="text-sm text-[#475569]">
										Welcome back! Here&apos;s your recovery overview.
									</p>
								</div>
								<div className="hidden sm:flex items-center gap-2">
									<button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111520] border border-[#1e2638] text-sm text-[#94a3b8]">
										Last 30 days
										<ChevronDown className="w-4 h-4" />
									</button>
									<button className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-medium">
										Export
									</button>
								</div>
							</div>

							{/* Metrics Cards */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
								{/* Recovered Amount */}
								<div className="rounded-xl border border-[#1e2638] bg-[#111520] p-4 sm:p-5">
									<div className="flex items-start justify-between mb-3">
										<div className="p-2 rounded-lg bg-[#10b981]/10">
											<TrendingUp className="w-5 h-5 text-[#10b981]" />
										</div>
										<button className="p-1 rounded hover:bg-[#1e2638] transition-colors">
											<MoreHorizontal className="w-4 h-4 text-[#475569]" />
										</button>
									</div>
									<p className="text-xs sm:text-sm text-[#475569] mb-1">
										Recovered this month
									</p>
									<p className="font-mono text-xl sm:text-2xl font-bold text-[#f1f5f9]">
										₹2,40,000
									</p>
									<div className="flex items-center gap-1 mt-2">
										<ArrowUpRight className="w-4 h-4 text-[#10b981]" />
										<span className="text-xs sm:text-sm text-[#10b981]">
											+23% from last month
										</span>
									</div>
								</div>

								{/* Recovery Rate */}
								<div className="rounded-xl border border-[#1e2638] bg-[#111520] p-4 sm:p-5">
									<div className="flex items-start justify-between mb-3">
										<div className="p-2 rounded-lg bg-[#3b82f6]/10">
											<Percent className="w-5 h-5 text-[#3b82f6]" />
										</div>
										<button className="p-1 rounded hover:bg-[#1e2638] transition-colors">
											<MoreHorizontal className="w-4 h-4 text-[#475569]" />
										</button>
									</div>
									<p className="text-xs sm:text-sm text-[#475569] mb-1">
										Recovery rate
									</p>
									<p className="font-mono text-xl sm:text-2xl font-bold text-[#f1f5f9]">
										78%
									</p>
									<div className="flex items-center gap-1 mt-2">
										<ArrowUpRight className="w-4 h-4 text-[#10b981]" />
										<span className="text-xs sm:text-sm text-[#10b981]">
											+5% from last month
										</span>
									</div>
								</div>

								{/* Payments Processed */}
								<div className="rounded-xl border border-[#1e2638] bg-[#111520] p-4 sm:p-5">
									<div className="flex items-start justify-between mb-3">
										<div className="p-2 rounded-lg bg-[#f59e0b]/10">
											<CreditCard className="w-5 h-5 text-[#f59e0b]" />
										</div>
										<button className="p-1 rounded hover:bg-[#1e2638] transition-colors">
											<MoreHorizontal className="w-4 h-4 text-[#475569]" />
										</button>
									</div>
									<p className="text-xs sm:text-sm text-[#475569] mb-1">
										Payments processed
									</p>
									<p className="font-mono text-xl sm:text-2xl font-bold text-[#f1f5f9]">
										143
									</p>
									<div className="flex items-center gap-1 mt-2">
										<ArrowDownRight className="w-4 h-4 text-[#ef4444]" />
										<span className="text-xs sm:text-sm text-[#ef4444]">
											-8% from last month
										</span>
									</div>
								</div>
							</div>

							{/* Chart Placeholder */}
							<div className="rounded-xl border border-[#1e2638] bg-[#111520] p-4 sm:p-5 hidden sm:block">
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-medium text-[#f1f5f9]">Recovery Trend</h3>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
											<span className="text-xs text-[#475569]">Recovered</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-3 h-3 rounded-full bg-[#1e2638]" />
											<span className="text-xs text-[#475569]">Failed</span>
										</div>
									</div>
								</div>
								{/* Simple chart visualization */}
								<div className="h-32 flex items-end gap-2">
									{[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
										(height, i) => (
											<div key={i} className="flex-1 flex flex-col gap-1">
												<div
													className="w-full rounded-t bg-[#3b82f6]"
													style={{ height: `${height}%` }}
												/>
												<div
													className="w-full rounded-b bg-[#1e2638]"
													style={{ height: `${100 - height}%` }}
												/>
											</div>
										),
									)}
								</div>
								<div className="flex justify-between mt-2">
									<span className="text-xs text-[#475569]">Jan</span>
									<span className="text-xs text-[#475569]">Dec</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
