import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const localeCookie = cookies().get("locale")?.value;
  const locale = localeCookie === "tr" ? "tr" : "de";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
