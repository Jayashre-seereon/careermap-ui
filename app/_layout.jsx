import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider, useAppState } from '../src/app-state';
function RootNavigator() {
    const { preferences } = useAppState();
    return (<>
      <StatusBar style={preferences.darkMode ? 'light' : 'dark'}/>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="onboarding"/>
        <Stack.Screen name="login"/>
        <Stack.Screen name="signup"/>
        <Stack.Screen name="otp-verify"/>
        <Stack.Screen name="profile-setup"/>
        <Stack.Screen name="promo"/>
        <Stack.Screen name="forgot-password"/>
        <Stack.Screen name="checkout"/>
        <Stack.Screen name="payment-success"/>
        <Stack.Screen name="(drawer)"/>
      </Stack>
    </>);
}
export default function RootLayout() {
    return (<AppStateProvider>
      <RootNavigator />
    </AppStateProvider>);
}
