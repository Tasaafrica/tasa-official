import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect(`https://dash.tasa.com.ng/users/${session.user.id}`);
  }

  // Redirect to signin if no session
  redirect("/auth/signin");
}
