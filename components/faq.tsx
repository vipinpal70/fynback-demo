"use client";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		question: "How does FynBack connect to my Razorpay account?",
		answer:
			"Through Razorpay's official OAuth partner API. You click 'Connect Razorpay', approve access on Razorpay's page, and we receive a scoped access token. We never see your Razorpay password or full account credentials.",
	},
	{
		question: "Will customers know their payment failed before I do?",
		answer:
			"No. FynBack handles the entire outreach on your behalf, with your brand name and email domain. Customers receive emails from you, WhatsApp messages branded to you, and never see 'FynBack'.",
	},
	{
		question: "What happens to UPI AutoPay failures?",
		answer:
			"UPI AutoPay has strict NPCI retry rules — maximum 4 attempts with timing restrictions. FynBack respects these rules automatically and sends a re-authentication link via WhatsApp, which has the highest conversion rate for UPI recovery.",
	},
	{
		question: "Is my customers' payment data safe?",
		answer:
			"We never store card numbers, UPI IDs, or CVVs — we don't handle payment instruments at all. We only receive failure notifications from your gateway and trigger the retry via the gateway's official API.",
	},
	{
		question:
			"What if a payment is recovered without FynBack — do I still pay the success fee?",
		answer:
			"No. Our analytics track exactly which recoveries were triggered by FynBack retries or outreach. If a customer self-updated their card directly on your site, that's not attributed to us.",
	},
	{
		question: "Can I customise the email and WhatsApp messages?",
		answer:
			"Yes. The campaign editor lets you customise the copy, timing, and sequence for each step. You can A/B test subject lines and track open and click rates per variant.",
	},
];

export function FAQ() {
	const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
	const { ref: accordionRef, isVisible: accordionVisible } =
		useScrollAnimation();


	return (
		<section className="py-20 sm:py-28 px-4 bg-[#111520]">
			<div className="mx-auto max-w-3xl">
				<div
					ref={headerRef}
					className={cn(
						"text-center mb-12 scroll-animate",
						headerVisible && "is-visible",
					)}
				>
					<span className="text-xs font-medium tracking-widest text-[#10b981] uppercase mb-4 block">
						FAQ
					</span>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#f1f5f9] text-balance">
						Common questions
					</h2>
				</div>

				<div
					ref={accordionRef}
					className={cn("scroll-animate", accordionVisible && "is-visible")}
				>
					<Accordion type="single" collapsible className="space-y-4">
						{faqs.map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="rounded-xl border border-[#1e2638] bg-[#0a0d14] px-6 data-[state=open]:border-[#3b82f6]"
							>
								<AccordionTrigger className="text-left text-[#f1f5f9] hover:no-underline py-5">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-[#94a3b8] pb-5">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
