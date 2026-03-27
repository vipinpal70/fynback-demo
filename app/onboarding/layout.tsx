import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { merchants } from "@/schema/merchants";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export default async function OnboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { sessionClaims } = await auth();

	// 1. Check Clerk claims (fastest, requires JWT template)
	if ((sessionClaims as any)?.metadata?.onboardingComplete === true) {
		redirect("/dashboard");
	}

	return <>{children}</>;
}
