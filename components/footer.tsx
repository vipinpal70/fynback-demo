function RecoveryArrowIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			suppressHydrationWarning
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
		</svg>
	);
}

function XIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} suppressHydrationWarning>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

function LinkedInIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} suppressHydrationWarning>
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	);
}

const footerLinks = {
	product: [
		{ label: "Features", href: "#features" },
		{ label: "Integrations", href: "#integrations" },
		{ label: "Pricing", href: "#pricing" },
		{ label: "Changelog", href: "#" },
		{ label: "Roadmap", href: "#" },
	],
	company: [
		{ label: "About", href: "#" },
		{ label: "Blog", href: "#" },
		{ label: "Careers", href: "#" },
		{ label: "Contact", href: "#" },
		{ label: "Privacy Policy", href: "#" },
		{ label: "Terms", href: "#" },
	],
	integrations: [
		{ label: "Razorpay", href: "#" },
		{ label: "Stripe", href: "#" },
		{ label: "Cashfree", href: "#" },
		{ label: "PayU", href: "#" },
		{ label: "WhatsApp Business", href: "#" },
	],
};

export function Footer() {

	return (
		<footer className="py-16 px-4 bg-[#0a0d14] border-t border-[#1e2638]">
			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
					{/* Logo Column */}
					<div className="col-span-2 md:col-span-1">
						<a href="#" className="flex items-center gap-2 mb-4">
							<RecoveryArrowIcon className="h-7 w-7 text-[#10b981]" />
							<span className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f1f5f9]">
								FynBack
							</span>
						</a>
						<p className="text-sm text-[#94a3b8] mb-6">
							India&apos;s first intelligent payment recovery platform.
						</p>
						<div className="flex items-center gap-3">
							<a
								href="#"
								className="p-2 rounded-lg border border-[#1e2638] text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#3b82f6] transition-all"
								aria-label="Twitter/X"
							>
								<XIcon className="h-4 w-4" />
							</a>
							<a
								href="#"
								className="p-2 rounded-lg border border-[#1e2638] text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#3b82f6] transition-all"
								aria-label="LinkedIn"
							>
								<LinkedInIcon className="h-4 w-4" />
							</a>
						</div>
					</div>

					{/* Product */}
					<div>
						<h3 className="text-sm font-medium text-[#f1f5f9] mb-4">Product</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div>
						<h3 className="text-sm font-medium text-[#f1f5f9] mb-4">Company</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Integrations */}
					<div>
						<h3 className="text-sm font-medium text-[#f1f5f9] mb-4">
							Integrations
						</h3>
						<ul className="space-y-3">
							{footerLinks.integrations.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-[#1e2638]">
					<p className="text-sm text-[#475569] text-center">
						© 2025 FynBack. Made in India · GST: 07XXXXX1234X1ZX
					</p>
				</div>
			</div>
		</footer>
	);
}
