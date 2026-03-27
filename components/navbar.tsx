"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

const navLinks = [
	{ href: "#features", label: "Features" },
	{ href: "#how-it-works", label: "How it works" },
	{ href: "#pricing", label: "Pricing" },
	{ href: "#integrations", label: "Integrations" },
];

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [menuHeight, setMenuHeight] = useState(0);
	const menuContentRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (isMobileMenuOpen && menuContentRef.current) {
			setMenuHeight(menuContentRef.current.scrollHeight);
		} else {
			setMenuHeight(0);
		}
	}, [isMobileMenuOpen]);

	const sign_in_handler = () => {
		router.push("/sign-in");
	};

	const sign_up_handler = () => {
		router.push("/sign-up");
	};

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				isScrolled
					? "backdrop-blur-md bg-[#0a0d14]/80 border-b border-[#1e2638]"
					: "bg-transparent",
			)}
		>
			<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<a href="#" className="flex items-center gap-2">
						<RecoveryArrowIcon className="h-7 w-7 text-[#10b981]" />
						<span className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f1f5f9]">
							FynBack
						</span>
					</a>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
							>
								{link.label}
							</a>
						))}
					</div>

					{/* Desktop CTA Buttons */}
					<div className="hidden md:flex items-center gap-3">
						<Button
							onClick={sign_in_handler}
							variant="ghost"
							className="text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-transparent"
						>
							Sign in
						</Button>
						<Button
							onClick={sign_up_handler}
							className="bg-[#3b82f6] hover:bg-[#2563eb] text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
						>
							Start free trial
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 text-[#94a3b8] hover:text-[#f1f5f9]"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6" suppressHydrationWarning />
						) : (
							<Menu className="h-6 w-6" suppressHydrationWarning />
						)}
					</button>
				</div>

				{/* Mobile Menu with slide-down animation */}
				<div
					className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
					style={{ height: menuHeight }}
					suppressHydrationWarning
				>
					<div ref={menuContentRef} className="py-4 border-t border-[#1e2638]">
						<div className="flex flex-col gap-4">
							{navLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className="text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{link.label}
								</a>
							))}
							<div className="flex flex-col gap-2 pt-4 border-t border-[#1e2638]">
								<Button
									variant="ghost"
									className="justify-start text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-transparent"
								>
									Sign in
								</Button>
								<Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
									Start free trial
								</Button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}
