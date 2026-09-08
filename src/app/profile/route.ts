import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const role = (session.user as any)?.role;
    if (role === "vendor") {
      redirect("/v/dashboard");
    }
    redirect("/c/dashboard");
  }

  // Redirect to signin if no session
  redirect("/auth/signin");
}
