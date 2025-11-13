import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV || 'development';

export const initSentry = (): void => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Skipping Sentry initialization.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    enabled: APP_ENV !== 'development',
    debug: APP_ENV === 'development',
    tracesSampleRate: APP_ENV === 'production' ? 0.2 : 1.0,
    attachStacktrace: true,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    maxBreadcrumbs: 50,
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
        tracePropagationTargets: ['localhost', /^https:\/\/api\.yourapp\.com/],
      }),
    ],
    beforeSend(event) {
      // Filter out events in development
      if (APP_ENV === 'development') {
        return null;
      }
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      // Filter sensitive data from breadcrumbs
      if (breadcrumb.category === 'console') {
        return null;
      }
      return breadcrumb;
    },
  });

  // Set release and dist
  if (Constants.expoConfig?.version) {
    Sentry.setTag('version', Constants.expoConfig.version);
  }
};

export const logError = (error: Error, context?: Record<string, unknown>): void => {
  if (context) {
    Sentry.setContext('error_context', context);
  }
  Sentry.captureException(error);
};

export const logMessage = (
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info'
): void => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (user: {
  id: string;
  email?: string;
  username?: string;
}): void => {
  Sentry.setUser(user);
};

export const clearUserContext = (): void => {
  Sentry.setUser(null);
};

export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb): void => {
  Sentry.addBreadcrumb(breadcrumb);
};
