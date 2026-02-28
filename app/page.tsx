import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { isDevAuthBypassEnabled } from "@/lib/securityEnv";

export default function HomePage() {
  const authDisabled = isDevAuthBypassEnabled();
  if (authDisabled) {
    redirect("/drafts");
  }

  const session = getSessionFromCookies();
  if (!session.valid) {
    redirect("/login");
  }
  redirect("/drafts");
}
