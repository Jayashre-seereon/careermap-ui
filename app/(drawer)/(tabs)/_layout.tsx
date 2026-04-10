import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useAppState } from '../../../src/app-state';
import { palette } from '../../../src/careermap-data';

export default function TabsLayout() {
  const { preferences } = useAppState();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: preferences.darkMode ? '#b7aeb9' : palette.muted,
        tabBarStyle: {
          backgroundColor: preferences.darkMode ? '#1b151f' : palette.surface,
          borderTopColor: preferences.darkMode ? '#2d2430' : palette.border,
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assessment"
        options={{
          title: 'Test',
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <Ionicons name="school" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
