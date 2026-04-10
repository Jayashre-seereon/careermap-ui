import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useAppState } from '../../../src/app-state';
import { palette } from '../../../src/careermap-data';
import { Pill, Screen } from '../../../src/careermap-ui';

export default function ProfileScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const {
    activePlanId,
    bookings,
    hasActiveSubscription,
    onboarding,
    preferences,
    savedCareers,
    saveUserProfile,
    subscriptionRecords,
    testHistory,
    toggleDarkMode,
    userProfile,
  } = useAppState();
  const [editMode, setEditMode] = useState(mode === 'edit');
  const [form, setForm] = useState(userProfile);
  const [openSection, setOpenSection] = useState<'saved' | 'tests' | 'bookings' | 'subscription' | null>(null);

  useEffect(() => {
    setForm(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (mode === 'edit') {
      setEditMode(true);
    }
  }, [mode]);

  const displayName = onboarding.userType === 'parent' ? userProfile.name || 'Parent User' : userProfile.name || 'Student User';
  const profileClass = onboarding.selectedClass || 'Class 11';
  const profileStream = onboarding.selectedStream || 'Science';

  const menuItems = useMemo(
    () => [
      { label: 'Edit Profile', icon: 'create-outline' as const, tone: palette.blue, action: () => setEditMode(true), value: undefined },
      {
        label: 'Saved Careers',
        icon: 'star-outline' as const,
        tone: palette.orange,
        action: () => setOpenSection((current) => (current === 'saved' ? null : 'saved')),
        value: `${savedCareers.length} saved`,
      },
      {
        label: 'Test History',
        icon: 'time-outline' as const,
        tone: palette.blue,
        action: () => setOpenSection((current) => (current === 'tests' ? null : 'tests')),
        value: `${testHistory.length} tests`,
      },
      {
        label: 'Mentor Bookings',
        icon: 'calendar-outline' as const,
        tone: palette.purple,
        action: () => setOpenSection((current) => (current === 'bookings' ? null : 'bookings')),
        value: `${bookings.length} bookings`,
      },
      {
        label: 'Subscription',
        icon: 'card-outline' as const,
        tone: palette.secondary,
        action: () => setOpenSection((current) => (current === 'subscription' ? null : 'subscription')),
        value: hasActiveSubscription ? 'Active' : 'None',
      },
      { label: 'Settings', icon: 'settings-outline' as const, tone: palette.muted, action: () => router.push('/(drawer)/settings'), value: 'Open' },
    ],
    [bookings.length, hasActiveSubscription, savedCareers.length, testHistory.length],
  );

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const renderInlineSection = (section: 'saved' | 'tests' | 'bookings' | 'subscription') => {
    if (section === 'saved' && savedCareers.length > 0) {
      return (
        <View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {savedCareers.map((career) => (
            <Pressable
              key={career}
              className={`flex-row items-center justify-between rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}
              onPress={() => router.push('/(drawer)/(tabs)/library')}
            >
              <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{career}</Text>
              <Ionicons name="chevron-forward" size={16} color={palette.muted} />
            </Pressable>
          ))}
        </View>
      );
    }

    if (section === 'tests' && testHistory.length > 0) {
      return (
        <View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {testHistory.map((item) => (
            <Pressable
              key={item.id}
              className={`flex-row items-center justify-between rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}
              onPress={() => router.push('/(drawer)/(tabs)/assessment')}
            >
              <View className="flex-1 pr-3">
                <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.title}</Text>
                <Text className={`mt-1 text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.subtitle}</Text>
              </View>
              <Pill label={item.status} tone={item.status === 'Completed' ? palette.green : palette.secondary} />
            </Pressable>
          ))}
        </View>
      );
    }

    if (section === 'bookings' && bookings.length > 0) {
      return (
        <View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {bookings.map((booking) => (
            <View key={booking.id} className={`flex-row items-center justify-between rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}>
              <View>
                <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{booking.mentorName}</Text>
                <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{booking.date} | {booking.time}</Text>
              </View>
              <Pill label={booking.status} tone={palette.green} />
            </View>
          ))}
        </View>
      );
    }

    if (section === 'subscription' && subscriptionRecords.length > 0) {
      return (
        <View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {subscriptionRecords.map((record) => (
            <Pressable
              key={record.id}
              className={`gap-1 rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}
              onPress={() => router.push('/(drawer)/subscription')}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{record.planName}</Text>
                <Text className="text-[13px] font-extrabold text-brand">{record.price}</Text>
              </View>
              <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Valid until: {record.expiryDate}</Text>
              <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>TXN: {record.transactionId}</Text>
            </Pressable>
          ))}
        </View>
      );
    }

    return null;
  };

  if (editMode) {
    return (
      <Screen>
        <View className="flex-row items-center gap-3">
          <Pressable className="h-10 w-10 items-center justify-center rounded-[14px] bg-surface" onPress={() => setEditMode(false)}>
            <Ionicons name="arrow-back" size={18} color={palette.text} />
          </Pressable>
          <Text className="text-[20px] font-black text-ink">Edit Profile</Text>
        </View>

        <View className="gap-3 rounded-[24px] border border-line bg-card p-5">
          {[
            { key: 'name', label: onboarding.userType === 'parent' ? 'Parent Name' : 'Full Name', placeholder: 'Enter full name', keyboardType: 'default' },
            { key: 'email', label: 'Email Address', placeholder: 'Enter email address', keyboardType: 'email-address' },
            { key: 'mobile', label: 'Mobile Number', placeholder: '+91 XXXXX XXXXX', keyboardType: 'phone-pad' },
            { key: 'password', label: 'Password', placeholder: 'Update password', keyboardType: 'default' },
            { key: 'address', label: 'Address', placeholder: 'Enter address', keyboardType: 'default' },
            { key: 'city', label: 'City', placeholder: 'Enter city', keyboardType: 'default' },
            { key: 'stateName', label: 'State', placeholder: 'Enter state', keyboardType: 'default' },
            { key: 'dob', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', keyboardType: 'numbers-and-punctuation' },
          ].map((field) => (
            <View key={field.key} className="gap-1.5">
              <Text className="text-[12px] font-extrabold text-muted">{field.label}</Text>
              <TextInput
                value={form[field.key as keyof typeof form]}
                onChangeText={(value) => updateField(field.key as keyof typeof form, value)}
                placeholder={field.placeholder}
                placeholderTextColor={palette.muted}
                keyboardType={field.keyboardType as never}
                secureTextEntry={field.key === 'password'}
                className="rounded-[18px] border border-line bg-surface px-4 py-[14px] text-[14px] text-ink"
              />
            </View>
          ))}

          {onboarding.userType === 'parent' ? (
            <View className="gap-1.5">
              <Text className="text-[12px] font-extrabold text-muted">Child&apos;s Name</Text>
              <TextInput
                value={form.childName}
                onChangeText={(value) => updateField('childName', value)}
                placeholder="Enter child's name"
                placeholderTextColor={palette.muted}
                className="rounded-[18px] border border-line bg-surface px-4 py-[14px] text-[14px] text-ink"
              />
            </View>
          ) : null}

          <View className="gap-2">
            <Text className="text-[12px] font-extrabold text-muted">Gender</Text>
            <View className="flex-row gap-2.5">
              {['Male', 'Female', 'Other'].map((option) => {
                const active = form.gender === option;
                return (
                  <Pressable
                    key={option}
                    className={`flex-1 rounded-[16px] border py-3 ${active ? 'border-brand bg-brand' : 'border-line bg-card'}`}
                    onPress={() => updateField('gender', option)}
                  >
                    <Text className={`text-center text-[13px] font-extrabold ${active ? 'text-white' : 'text-ink'}`}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View className="gap-3 rounded-[24px] border border-line bg-card p-5">
          <Text className="text-[15px] font-black text-brand">Onboarding Details</Text>
          <View className="gap-2">
            {[
              ['User Type', onboarding.userType || 'Not set'],
              ['Class', onboarding.selectedClass || 'Not set'],
              ['Stream', onboarding.selectedStream || 'Not set'],
              ['Guidance', onboarding.selectedGuidance || 'Not set'],
            ].map(([label, value]) => (
              <View key={label} className="flex-row items-center justify-between rounded-[16px] bg-surface px-4 py-3">
                <Text className="text-[12px] font-bold text-muted">{label}</Text>
                <Text className="text-[12px] font-extrabold text-ink">{value}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {onboarding.selectedInterests.map((item) => (
              <Pill key={item} label={item} tone={palette.primary} />
            ))}
          </View>
        </View>

        <Pressable
          className="rounded-[18px] bg-brand py-4"
          onPress={() => {
            saveUserProfile(form);
            setEditMode(false);
          }}
        >
          <Text className="text-center text-[15px] font-extrabold text-white">Save Changes</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center justify-between">
        <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>My Profile</Text>
        <Pressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={toggleDarkMode}>
          <Ionicons name={preferences.darkMode ? 'sunny-outline' : 'moon-outline'} size={18} color={preferences.darkMode ? palette.secondary : palette.muted} />
        </Pressable>
      </View>

      <View className={`items-center rounded-[28px] border p-5 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
        <View className="h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: `${palette.primary}12` }}>
          <Text className="text-[30px] font-black text-brand">{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text className={`mt-3 text-[22px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{displayName}</Text>
        {onboarding.userType === 'parent' && userProfile.childName ? (
          <Text className="mt-1 text-[12px] font-extrabold text-brand">Child: {userProfile.childName}</Text>
        ) : null}
        <Text className={`mt-1 text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{userProfile.email || 'Not set'}</Text>
        <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{userProfile.mobile || 'Not set'}</Text>
        <View className="mt-3 flex-row gap-2">
          <Pill label={profileClass} tone={palette.primary} />
          <Pill label={profileStream} tone={palette.purple} />
        </View>
        {onboarding.userType === 'parent' ? <Pill label="Parent Account" tone={palette.secondary} /> : null}
      </View>

      <View className={`overflow-hidden rounded-[24px] border ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
        {menuItems.map((item, index) => {
          const sectionKey =
            item.label === 'Saved Careers'
              ? 'saved'
              : item.label === 'Test History'
                ? 'tests'
                : item.label === 'Mentor Bookings'
                  ? 'bookings'
                  : item.label === 'Subscription'
                    ? 'subscription'
                  : null;

          const isOpen = sectionKey !== null && openSection === sectionKey;

          return (
            <View key={item.label}>
              <Pressable
                className={`flex-row items-center justify-between px-4 py-4 ${index < menuItems.length - 1 || isOpen ? 'border-b border-line' : ''}`}
                onPress={item.action}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-[12px] bg-surface">
                    <Ionicons name={item.icon} size={18} color={item.tone} />
                  </View>
                  <Text className="text-[14px] font-bold text-ink">{item.label}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {item.value ? <Text className="text-[11px] text-muted">{item.value}</Text> : null}
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-forward'}
                    size={18}
                    color={palette.muted}
                  />
                </View>
              </Pressable>
              {isOpen ? renderInlineSection(sectionKey) : null}
            </View>
          );
        })}
      </View>

      <Pressable className="flex-row items-center justify-center gap-2 rounded-[18px] border border-[#efc8c0] bg-[#fff4f2] py-4" onPress={() => router.replace('/')}>
        <Ionicons name="log-out-outline" size={18} color={palette.danger} />
        <Text className="text-[14px] font-extrabold text-danger">Logout</Text>
      </Pressable>

      <Text className={`text-center text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
        Current plan: {hasActiveSubscription ? activePlanId : 'No active plan'}
      </Text>
    </Screen>
  );
}
