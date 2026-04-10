import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
export default function DrawerRoot() {
  const { preferences } = useAppState();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: preferences.darkMode ? '#1b151f' : palette.surface },
          headerTintColor: preferences.darkMode ? '#ffffff' : palette.text,
          headerTitleStyle: { fontWeight: '800' },
          drawerActiveTintColor: palette.primary,
          drawerInactiveTintColor: preferences.darkMode ? '#b7aeb9' : palette.muted,
          drawerStyle: { backgroundColor: preferences.darkMode ? '#140f17' : palette.surface, width: 280 },
          sceneStyle: { backgroundColor: preferences.darkMode ? '#140f17' : palette.background },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'CareerMap',
            drawerLabel: 'Dashboard',
            drawerIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} />,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            drawerIcon: ({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="scholarship"
          options={{
            title: 'Scholarships',
            drawerIcon: ({ color, size }) => <Ionicons name="ribbon-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="institute"
          options={{
            title: 'Institutes',
            drawerIcon: ({ color, size }) => <Ionicons name="business-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="entrance-exam"
          options={{
            title: 'Entrance Exam',
            drawerIcon: ({ color, size }) => <Ionicons name="clipboard-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="subscription"
          options={{
            title: 'Subscription',
            drawerIcon: ({ color, size }) => <Ionicons name="card-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="book-mentor"
          options={{
            title: 'Book Mentor',
            drawerIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="psychometric-test"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="quiz"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="abroad"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
