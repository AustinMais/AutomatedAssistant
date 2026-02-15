import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** Only enable rate limiting when Upstash Redis env vars are set. */
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(10, '1 m'),
        analytics: true,
      })
    : null;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

export async function middleware(req: NextRequest) {
  if (!ratelimit) return NextResponse.next();

  const ip = getClientIp(req);
  const result = await ratelimit.limit(ip);

  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Limit', result.limit.toString());
  res.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  res.headers.set('X-RateLimit-Reset', result.reset.toString());

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests. Please slow down and try again in a minute.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    );
  }

  return res;
}

export const config = {
  matcher: '/api/chat',
};
