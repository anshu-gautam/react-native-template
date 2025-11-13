import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-expo';
import { I18nextProvider } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';

import { tokenCache, CLERK_PUBLISHABLE_KEY } from '@/services/clerk';
import { initSentry } from '@/lib/sentry';
import i18n from '@/lib/i18n';
import { useTheme } from '@/hooks';

// Initialize Sentry
initSentry();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

function RootLayoutNav() {
  const { colorScheme } = useTheme();

  useEffect(() => {
    // Hide splash screen after a delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
          <I18nextProvider i18n={i18n}>
            <RootLayoutNav />
          </I18nextProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
