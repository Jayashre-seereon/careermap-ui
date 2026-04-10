import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';

import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';
import { Screen } from '../../src/careermap-ui';

type SettingsView = 'menu' | 'password' | 'notifications' | 'help';

export default function SettingsScreen() {
  const { preferences, toggleDarkMode, updatePreferences } = useAppState();
  const [view, setView] = useState<SettingsView>('menu');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [helpForm, setHelpForm] = useState({
    email: '',
    message: '',
  });

  const settingsItems = useMemo(
    () => [
      { label: 'Edit Profile', icon: 'person-outline' as const, color: palette.blue, action: () => router.push({ pathname: '/(drawer)/(tabs)/profile', params: { mode: 'edit' } }) },
      { label: 'Change Password', icon: 'lock-closed-outline' as const, color: palette.purple, action: () => setView('password') },
      { label: 'Notification Preferences', icon: 'notifications-outline' as const, color: palette.orange, action: () => setView('notifications') },
      { label: preferences.darkMode ? 'Light Mode' : 'Dark Mode', icon: preferences.darkMode ? 'sunny-outline' as const : 'moon-outline' as const, color: palette.secondary, action: toggleDarkMode },
      { label: 'Help Centre', icon: 'help-circle-outline' as const, color: palette.teal, action: () => setView('help') },
    ],
    [preferences.darkMode, toggleDarkMode],
  );

  if (view === 'password') {
    const canSave =
      passwordForm.currentPassword.length > 0 &&
      passwordForm.newPassword.length >= 6 &&
      passwordForm.newPassword === passwordForm.confirmPassword;

    return (
      <Screen>
        <View className="flex-row items-center gap-3">
          <Pressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => setView('menu')}>
            <Ionicons name="arrow-back" size={18} color={palette.text} />
          </Pressable>
          <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Change Password</Text>
        </View>

        <View className={`gap-3 rounded-[24px] border p-5 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
          {[
            ['currentPassword', 'Current Password'],
            ['newPassword', 'New Password'],
            ['confirmPassword', 'Confirm Password'],
          ].map(([key, label]) => (
            <View key={key} className="gap-1.5">
              <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
              <View className={`flex-row items-center gap-3 rounded-[18px] border px-4 py-[14px] ${preferences.darkMode ? 'border-[#3a2f40] bg-[#312636]' : 'border-line bg-surface'}`}>
                <Ionicons name="lock-closed-outline" size={18} color={palette.muted} />
                <TextInput
                  value={passwordForm[key as keyof typeof passwordForm]}
                  onChangeText={(value) => setPasswordForm((current) => ({ ...current, [key]: value }))}
                  secureTextEntry={!showPassword[key as keyof typeof showPassword]}
                  placeholder={label}
                  placeholderTextColor={palette.muted}
                  className={`flex-1 text-[14px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}
                />
                <Pressable onPress={() => setShowPassword((current) => ({ ...current, [key]: !current[key as keyof typeof showPassword] }))}>
                  <Ionicons name={showPassword[key as keyof typeof showPassword] ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.muted} />
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable
            className="rounded-[18px] bg-brand py-4"
            disabled={!canSave}
            onPress={() => {
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setShowPassword({ currentPassword: false, newPassword: false, confirmPassword: false });
              setView('menu');
            }}
            style={({ pressed }) => ({ opacity: !canSave || pressed ? 0.45 : 1 })}
          >
            <Text className="text-center text-[15px] font-extrabold text-white">Save Password</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (view === 'notifications') {
    return (
      <Screen>
        <View className="flex-row items-center gap-3">
          <Pressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => setView('menu')}>
            <Ionicons name="arrow-back" size={18} color={palette.text} />
          </Pressable>
          <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Notification Preferences</Text>
        </View>

        <View className={`gap-3 rounded-[24px] border p-5 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
          {[
            ['pushNotifications', 'Push Notifications', 'General updates and announcements'],
            ['scholarshipAlerts', 'Scholarship Alerts', 'Important scholarship deadlines and reminders'],
            ['mentorReminders', 'Mentor Reminders', 'Booking reminders and follow-up alerts'],
          ].map(([key, title, subtitle]) => (
            <View key={key} className={`flex-row items-center justify-between rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}>
              <View className="flex-1 pr-4">
                <Text className={`text-[14px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{title}</Text>
                <Text className={`mt-1 text-[12px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{subtitle}</Text>
              </View>
              <Switch
                value={preferences.notifications[key as keyof typeof preferences.notifications]}
                onValueChange={(value) =>
                  updatePreferences({
                    notifications: {
                      [key]: value,
                    },
                  })
                }
                trackColor={{ false: '#d8cec7', true: `${palette.primary}66` }}
                thumbColor={preferences.notifications[key as keyof typeof preferences.notifications] ? palette.primary : '#ffffff'}
              />
            </View>
          ))}
        </View>
      </Screen>
    );
  }

  if (view === 'help') {
    return (
      <Screen>
        <View className="flex-row items-center gap-3">
          <Pressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => setView('menu')}>
            <Ionicons name="arrow-back" size={18} color={palette.text} />
          </Pressable>
          <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Help Centre</Text>
        </View>

        <View className={`gap-3 rounded-[24px] border p-5 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
          <View className="gap-1.5">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Your Email</Text>
            <TextInput
              value={helpForm.email}
              onChangeText={(value) => setHelpForm((current) => ({ ...current, email: value }))}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor={palette.muted}
              className={`rounded-[18px] border px-4 py-[14px] text-[14px] ${preferences.darkMode ? 'border-[#3a2f40] bg-[#312636] text-white' : 'border-line bg-surface text-ink'}`}
            />
          </View>
          <View className="gap-1.5">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Message</Text>
            <TextInput
              value={helpForm.message}
              onChangeText={(value) => setHelpForm((current) => ({ ...current, message: value }))}
              multiline
              textAlignVertical="top"
              placeholder="Describe your issue"
              placeholderTextColor={palette.muted}
              className={`min-h-[130px] rounded-[18px] border px-4 py-[14px] text-[14px] ${preferences.darkMode ? 'border-[#3a2f40] bg-[#312636] text-white' : 'border-line bg-surface text-ink'}`}
            />
          </View>
          <Pressable
            className="rounded-[18px] bg-brand py-4"
            onPress={() => {
              setHelpForm({ email: '', message: '' });
              setView('menu');
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.45 : 1 })}
          >
            <Text className="text-center text-[15px] font-extrabold text-white">Send to Email Support</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center gap-3">
        <Pressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={palette.text} />
        </Pressable>
        <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Settings</Text>
      </View>

      <View className={`overflow-hidden rounded-[24px] border ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
        {settingsItems.map((item, index) => (
          <Pressable
            key={item.label}
            className={`flex-row items-center justify-between px-4 py-4 ${index < settingsItems.length - 1 ? 'border-b border-line' : ''}`}
            onPress={item.action}
          >
            <View className="flex-row items-center gap-3">
              <View className={`h-9 w-9 items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.muted} />
          </Pressable>
        ))}
      </View>

      <Pressable className="flex-row items-center justify-center gap-2 rounded-[18px] border border-[#efc8c0] bg-[#fff4f2] py-4" onPress={() => router.replace('/')}>
        <Ionicons name="log-out-outline" size={18} color={palette.danger} />
        <Text className="text-[14px] font-extrabold text-danger">Logout</Text>
      </Pressable>
    </Screen>
  );
}
