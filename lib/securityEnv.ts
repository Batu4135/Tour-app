function isMissing(value: string | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function isDevAuthBypassEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DISABLE_AUTH === "true";
}

export function assertProductionSecrets(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];
  if (isMissing(process.env.SESSION_SECRET)) missing.push("SESSION_SECRET");
  if (isMissing(process.env.NEXTAUTH_SECRET)) missing.push("NEXTAUTH_SECRET");

  if (missing.length > 0) {
    throw new Error(`Fehlende Pflicht-Umgebungsvariablen in Production: ${missing.join(", ")}`);
  }
}
