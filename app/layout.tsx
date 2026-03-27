import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Premium display font for headings — expressive, modern, high contrast
const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-heading",
	display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Geist — clean, geometric, made for developer tools & SaaS UIs
const geist = Geist({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
	variable: "--font-sans",
	display: "swap",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "fynback – India's First Failed Payment Recovery Tool",
	description:
		"fynback automatically recovers failed Razorpay and Stripe payments through smart retries, WhatsApp nudges, and personalised email sequences. Average recovery rate: 78%.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${bricolage.variable} ${plusJakartaSans.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col" suppressHydrationWarning>
				{children}
			</body>
		</html>
	);
}
