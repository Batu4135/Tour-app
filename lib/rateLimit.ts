type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

declare global {
  // eslint-disable-next-line no-var
  var npRateLimitStore: Map<string, RateLimitState> | undefined;
}

const store = global.npRateLimitStore ?? new Map<string, RateLimitState>();
if (!global.npRateLimitStore) {
  global.npRateLimitStore = store;
}

function nowMs(): number {
  return Date.now();
}

function cleanupExpired(prefix: string, now: number) {
  for (const [key, value] of store.entries()) {
    if (!key.startsWith(prefix)) continue;
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function consumeRateLimit(
  namespace: string,
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = nowMs();
  cleanupExpired(`${namespace}:`, now);

  const storeKey = `${namespace}:${key}`;
  const existing = store.get(storeKey);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(storeKey, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, options.limit - 1),
      retryAfterMs: options.windowMs
    };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, existing.resetAt - now)
    };
  }

  existing.count += 1;
  store.set(storeKey, existing);
  return {
    allowed: true,
    remaining: Math.max(0, options.limit - existing.count),
    retryAfterMs: Math.max(0, existing.resetAt - now)
  };
}

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
