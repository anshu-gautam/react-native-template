import type { ExpoRequest, ExpoResponse } from 'expo-router/server';

export async function GET(req: ExpoRequest): Promise<ExpoResponse> {
  return Response.json({
    status: 'success',
    message: 'API is healthy',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 'N/A',
      environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
    },
  });
}
