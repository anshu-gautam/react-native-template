import type { ExpoRequest, ExpoResponse } from 'expo-router/server';

export interface AuthenticatedRequest extends ExpoRequest {
  userId?: string;
}

export const authMiddleware = (
  handler: (req: AuthenticatedRequest, res: ExpoResponse) => Promise<void>
) => {
  return async (req: AuthenticatedRequest, res: ExpoResponse) => {
    try {
      // Get the authorization header
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized - No token provided',
        });
      }

      // Extract the token
      const token = authHeader.substring(7);

      // In a real app, you would verify the token here
      // For now, we'll just check if it exists
      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized - Invalid token',
        });
      }

      // You can decode the token and attach user info to the request
      // For example, using Clerk's verifyToken or JWT verification
      // req.userId = decodedToken.userId;

      // Call the actual handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
};
