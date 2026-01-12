import { useEffect } from 'react';
import { useRouter, Stack, useSegments, useRootNavigationState } from 'expo-router';
import { AuthProvider, useAuth } from './(tabs)/AuthContext';

function RootLayoutNav() {
  const { signed } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inPublicGroup = segments[0] === 'login';

    if (!signed && !inPublicGroup) {
      router.replace('/login');
    } else if (signed && inPublicGroup) {
      router.replace('/(tabs)');
    }
  }, [signed, segments, navigationState?.key]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}