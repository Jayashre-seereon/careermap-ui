import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../../../src/app-state';
import { palette } from '../../../src/careermap-data';
export default function TabsLayout() {
    const { preferences } = useAppState();
    const insets = useSafeAreaInsets();
    return (<Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: palette.primary,
            tabBarInactiveTintColor: preferences.darkMode ? '#b7aeb9' : palette.muted,
            tabBarStyle: {
                backgroundColor: preferences.darkMode ? '#050505' : palette.surface,
                borderTopColor: preferences.darkMode ? '#1a1a1a' : palette.border,
                height: 58 + Math.max(insets.bottom, 8),
                paddingBottom: Math.max(insets.bottom, 8),
                paddingTop: 8,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '700',
            },
        }}>
      <Tabs.Screen name="index" options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color}/>,
        }}/>
      <Tabs.Screen name="library" options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color}/>,
        }}/>
      <Tabs.Screen name="assessment" options={{
            title: 'Test',
            tabBarIcon: ({ color, size }) => <Ionicons name="analytics" size={size} color={color}/>,
        }}/>
      <Tabs.Screen name="learn" options={{
            title: 'Learn',
            tabBarIcon: ({ color, size }) => <Ionicons name="school" size={size} color={color}/>,
        }}/>
      <Tabs.Screen name="profile" options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color}/>,
        }}/>
    </Tabs>);
}
