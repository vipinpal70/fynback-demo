"use client";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const companies = ["Acme SaaS", "PayFlow", "LearnHub", "FitPro", "BoxDelights"];

export function SocialProof() {
	const { ref, isVisible } = useScrollAnimation();


	return (
		<section className="py-8 bg-[#111520] border-y border-[#1e2638]">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div
					ref={ref}
					className={cn(
						"flex flex-col sm:flex-row items-center justify-between gap-6 scroll-animate",
						isVisible && "is-visible",
					)}
				>
					<p className="text-sm text-[#94a3b8] shrink-0">
						Trusted by subscription businesses across India
					</p>
					<div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
						{companies.map((company) => (
							<div
								key={company}
								className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#1e2638]/50"
							>
								<span className="text-sm font-medium text-[#475569]">
									{company}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
