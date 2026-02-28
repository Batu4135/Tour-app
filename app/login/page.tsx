import { redirect } from "next/navigation";
import LoginForm from "./pin-form";
import { getSessionFromCookies } from "@/lib/auth";
import { isDevAuthBypassEnabled } from "@/lib/securityEnv";

export default function LoginPage() {
  const authDisabled = isDevAuthBypassEnabled();
  if (authDisabled) {
    redirect("/drafts");
  }

  const session = getSessionFromCookies();
  if (session.valid) {
    redirect("/drafts");
  }

  return (
    <section className="flex min-h-[70vh] flex-col justify-center">
      <div className="mx-auto w-full max-w-sm space-y-7">
        <div className="text-center">
          <p className="text-3xl font-extrabold tracking-tight text-[#2F7EA1]">nord-pack</p>
          <p className="mt-2 text-sm text-[#4A4A4A]/70">Fahrer Login</p>
        </div>
        <LoginForm />
      </div>
    </section>
  );
}
