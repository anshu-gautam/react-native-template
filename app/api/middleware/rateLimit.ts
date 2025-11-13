import type { ExpoRequest, ExpoResponse } from 'expo-router/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimitMiddleware = (
  options: {
    maxRequests?: number;
    windowMs?: number;
  } = {}
) => {
  const maxRequests = options.maxRequests || 100;
  const windowMs = options.windowMs || 60000; // 1 minute

  return (
    handler: (req: ExpoRequest, res: ExpoResponse) => Promise<void>
  ) => {
    return async (req: ExpoRequest, res: ExpoResponse) => {
      try {
        // Get client identifier (IP address or user ID)
        const clientId =
          req.headers.get('x-forwarded-for') ||
          req.headers.get('x-real-ip') ||
          'unknown';

        const now = Date.now();
        const clientData = store[clientId];

        if (!clientData || now > clientData.resetTime) {
          // Initialize or reset the client data
          store[clientId] = {
            count: 1,
            resetTime: now + windowMs,
          };
        } else if (clientData.count >= maxRequests) {
          // Rate limit exceeded
          return res.status(429).json({
            status: 'error',
            message: 'Too many requests, please try again later.',
            retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
          });
        } else {
          // Increment the request count
          clientData.count++;
        }

        // Call the actual handler
        return handler(req, res);
      } catch (error) {
        console.error('Rate limit middleware error:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      }
    };
  };
};
