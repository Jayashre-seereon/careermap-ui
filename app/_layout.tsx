import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppStateProvider } from '../src/app-state';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="otp-verify" />
          <Stack.Screen name="profile-setup" />
          <Stack.Screen name="promo" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="payment-success" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </>
    </AppStateProvider>
  );
}
