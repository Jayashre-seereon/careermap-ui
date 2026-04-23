import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useAppState } from '../../../src/app-state';
import { palette } from '../../../src/careermap-data';
import { AnimatedPressable, Pill, Screen } from '../../../src/careermap-ui';
import { StaggerFadeUpItem } from '../../../src/page-transition';
export default function ProfileScreen() {
    const { activePlanId, bookings, hasActiveSubscription, onboarding, preferences, profileEditRequestKey, requestProfileEdit, savedCareers, saveUserProfile, subscriptionRecords, testHistory, toggleDarkMode, userProfile, } = useAppState();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(userProfile);
    const [openSection, setOpenSection] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        setForm(userProfile);
    }, [userProfile]);
    useEffect(() => {
        if (profileEditRequestKey > 0) {
            setEditMode(true);
        }
    }, [profileEditRequestKey]);
    const displayName = onboarding.userType === 'parent' ? userProfile.name || 'Parent User' : userProfile.name || 'Student User';
    const profileClass = onboarding.selectedClass || 'Class 11';
    const profileStream = onboarding.selectedStream || 'Science';
    const menuItems = useMemo(() => [
        {
            label: 'Saved Careers',
            icon: 'star-outline',
            tone: palette.orange,
            action: () => setOpenSection((current) => (current === 'saved' ? null : 'saved')),
            value: `${savedCareers.length} saved`,
        },
        {
            label: 'Test History',
            icon: 'time-outline',
            tone: palette.blue,
            action: () => setOpenSection((current) => (current === 'tests' ? null : 'tests')),
            value: `${testHistory.length} tests`,
        },
        {
            label: 'Mentor Bookings',
            icon: 'calendar-outline',
            tone: palette.purple,
            action: () => setOpenSection((current) => (current === 'bookings' ? null : 'bookings')),
            value: `${bookings.length} bookings`,
        },
        {
            label: 'Subscription',
            icon: 'card-outline',
            tone: palette.secondary,
            action: () => setOpenSection((current) => (current === 'subscription' ? null : 'subscription')),
            value: hasActiveSubscription ? 'Active' : 'None',
        },
        { label: 'Settings', icon: 'settings-outline', tone: palette.muted, action: () => router.push('/(drawer)/settings'), value: 'Open' },
    ], [bookings.length, hasActiveSubscription, savedCareers.length, testHistory.length]);
    const updateField = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
    };
    const renderInlineSection = (section) => {
        if (section === 'saved' && savedCareers.length > 0) {
            return (<View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {savedCareers.map((career, index) => (<StaggerFadeUpItem key={career} index={index}>
              <AnimatedPressable className={`flex-row items-center justify-between rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.push('/(drawer)/(tabs)/library')}>
                <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{career}</Text>
                <Ionicons name="chevron-forward" size={16} color={palette.muted}/>
              </AnimatedPressable>
            </StaggerFadeUpItem>))}
        </View>);
        }
        if (section === 'tests' && testHistory.length > 0) {
            return (<View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {testHistory.map((item) => (<AnimatedPressable key={item.id} className={`flex-row items-center justify-between rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.push('/(drawer)/(tabs)/assessment')}>
              <View className="flex-1 pr-3">
                <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.title}</Text>
                <Text className={`mt-1 text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.subtitle}</Text>
              </View>
              <Pill label={item.status} tone={item.status === 'Completed' ? palette.green : palette.secondary}/>
            </AnimatedPressable>))}
        </View>);
        }
        if (section === 'bookings' && bookings.length > 0) {
            return (<View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {bookings.map((booking) => (<AnimatedPressable key={booking.id} className={`gap-1 rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.push('/(drawer)/book-mentor')}>
            <View key={booking.id} className={`flex-row items-center justify-between rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}>
              <View>
                <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{booking.mentorName}</Text>
                <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{booking.date} | {booking.time}</Text>
              </View>
              <Pill label={booking.status} tone={palette.green}/>
            </View>
            </AnimatedPressable>))}
        </View>);
        }
        if (section === 'subscription' && subscriptionRecords.length > 0) {
            return (<View className={`gap-3 border-t px-4 py-4 ${preferences.darkMode ? 'border-[#2d2430] bg-[#1a141f]' : 'border-line bg-[#fcf8f5]'}`}>
          {subscriptionRecords.map((record) => (<AnimatedPressable key={record.id} className={`gap-1 rounded-[18px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => router.push('/(drawer)/subscription')}>
              <View className="flex-row items-center justify-between">
                <Text className={`text-[13px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{record.planName}</Text>
                <Text className="text-[13px] font-extrabold text-brand">{record.price}</Text>
              </View>
              <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Valid until: {record.expiryDate}</Text>
              <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>TXN: {record.transactionId}</Text>
            </AnimatedPressable>))}
        </View>);
        }
        return null;
    };
    if (editMode) {
        return (<Screen>
        <View className="flex-row items-center gap-3">
          <AnimatedPressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={() => setEditMode(false)}>
            <Ionicons name="arrow-back" size={18} color={preferences.darkMode ? '#ffffff' : palette.text}/>
          </AnimatedPressable>
          <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>Edit Profile</Text>
        </View>

        <View className={`gap-3 rounded-[24px] border p-5 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
          {[
                { key: 'name', label: onboarding.userType === 'parent' ? 'Parent Name' : 'Full Name', placeholder: 'Enter full name', keyboardType: 'default' },
                { key: 'email', label: 'Email Address', placeholder: 'Enter email address', keyboardType: 'email-address' },
                { key: 'mobile', label: 'Mobile Number', placeholder: '+91 XXXXX XXXXX', keyboardType: 'phone-pad' },
                { key: 'password', label: 'Password', placeholder: 'Update password', keyboardType: 'default' },
                { key: 'address', label: 'Address', placeholder: 'Enter address', keyboardType: 'default' },
                { key: 'city', label: 'City', placeholder: 'Enter city', keyboardType: 'default' },
                { key: 'stateName', label: 'State', placeholder: 'Enter state', keyboardType: 'default' },
                { key: 'dob', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', keyboardType: 'numbers-and-punctuation' },
            ].map((field) => (<View key={field.key} className="gap-1.5">
              <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{field.label}</Text>
              {field.key === 'password' ? (<View className={`flex-row items-center gap-3 rounded-[18px] border px-4 py-[14px] ${preferences.darkMode ? 'border-[#3a2f40] bg-[#312636]' : 'border-line bg-surface'}`}>
                  <TextInput value={form[field.key]} onChangeText={(value) => updateField(field.key, value)} placeholder={field.placeholder} placeholderTextColor={palette.muted} keyboardType={field.keyboardType} secureTextEntry={!showPassword} className={`flex-1 text-[14px] ${preferences.darkMode ? 'text-white' : 'text-ink'}`}/>
                  <AnimatedPressable onPress={() => setShowPassword((value) => !value)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.muted}/>
                  </AnimatedPressable>
                </View>) : (<TextInput value={form[field.key]} onChangeText={(value) => updateField(field.key, value)} placeholder={field.placeholder} placeholderTextColor={palette.muted} keyboardType={field.keyboardType} className={`rounded-[18px] border px-4 py-[14px] text-[14px] ${preferences.darkMode ? 'border-[#3a2f40] bg-[#312636] text-white' : 'border-line bg-surface text-ink'}`}/>)}
            </View>))}

          {onboarding.userType === 'parent' ? (<View className="gap-1.5">
              <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Child&apos;s Name</Text>
              <TextInput value={form.childName} onChangeText={(value) => updateField('childName', value)} placeholder="Enter child's name" placeholderTextColor={palette.muted} className={`rounded-[18px] border px-4 py-[14px] text-[14px] ${preferences.darkMode ? 'border-[#3a2f40] bg-[#312636] text-white' : 'border-line bg-surface text-ink'}`}/>
            </View>) : null}

          <View className="gap-2">
            <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>Gender</Text>
            <View className="flex-row gap-2.5">
              {['Male', 'Female', 'Other'].map((option) => {
                const active = form.gender === option;
                return (<AnimatedPressable key={option} className={`flex-1 rounded-[16px] border py-2 px-3 ${active ? 'border-brand bg-brand' : preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`} onPress={() => updateField('gender', option)}>
                    <Text className={`text-center text-[13px] font-extrabold ${active ? 'text-white' : preferences.darkMode ? 'text-white' : 'text-ink'}`}>{option}</Text>
                  </AnimatedPressable>);
            })}
            </View>
          </View>
        </View>

        <View className={`gap-3 rounded-[24px] border p-5 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
          <Text className="text-[15px] font-black text-brand">Onboarding Details</Text>
          <View className="gap-2">
            {[
                ['User Type', onboarding.userType || 'Not set'],
                ['Class', onboarding.selectedClass || 'Not set'],
                ['Stream', onboarding.selectedStream || 'Not set'],
                ['Guidance', onboarding.selectedGuidance || 'Not set'],
                ['Interests', onboarding.selectedInterests.length > 0 ? onboarding.selectedInterests.join(', ') : 'Not set'],
            ].map(([label, value]) => (<View key={label} className={`flex-row items-center justify-between rounded-[16px] px-4 py-3 ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`}>
                <Text className={`text-[12px] font-bold ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{label}</Text>
                <Text className={`text-[12px] font-extrabold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{value}</Text>
              </View>))}
          </View>

        </View>

        <AnimatedPressable className="rounded-[18px] bg-brand py-4" onPress={() => {
                saveUserProfile(form);
                setEditMode(false);
            }}>
          <Text className="text-center text-[15px] font-extrabold text-white">Save Changes</Text>
        </AnimatedPressable>
      </Screen>);
    }
    return (<Screen>
      <View className="flex-row items-center justify-between">
        <Text className={`text-[20px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>My Profile</Text>
        <AnimatedPressable className={`h-10 w-10 items-center justify-center rounded-[14px] ${preferences.darkMode ? 'bg-[#312636]' : 'bg-surface'}`} onPress={toggleDarkMode}>
          <Ionicons name={preferences.darkMode ? 'sunny-outline' : 'moon-outline'} size={18} color={preferences.darkMode ? palette.secondary : palette.muted}/>
        </AnimatedPressable>
      </View>

      <View className={`items-center rounded-[28px] border p-5 ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
        <View className="h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: `${palette.primary}12` }}>
          <Text className="text-[30px] font-black text-brand">{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text className={`mt-3 text-[22px] font-black ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{displayName}</Text>
        {onboarding.userType === 'parent' && userProfile.childName ? (<Text className="mt-1 text-[12px] font-extrabold text-brand">Child: {userProfile.childName}</Text>) : null}
        <Text className={`mt-1 text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{userProfile.email || 'Not set'}</Text>
        <Text className={`text-[13px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{userProfile.mobile || 'Not set'}</Text>
        <View className="mt-3 flex-row gap-2">
          <Pill label={profileClass} tone={palette.primary}/>
          <Pill label={profileStream} tone={palette.purple}/>
        </View>
        {onboarding.userType === 'parent' ? <Pill label="Parent Account" tone={palette.secondary}/> : null}
        <AnimatedPressable className="mt-4 rounded-[16px] bg-brand px-5 py-3" onPress={requestProfileEdit}>
          <Text className="text-[13px] font-extrabold text-white">Edit Profile</Text>
        </AnimatedPressable>
      </View>

      <View className={`overflow-hidden rounded-[24px] border ${preferences.darkMode ? 'border-[#2d2430] bg-[#211927]' : 'border-line bg-card'}`}>
        {menuItems.map((item, index) => {
            const sectionKey = item.label === 'Saved Careers'
                ? 'saved'
                : item.label === 'Test History'
                    ? 'tests'
                    : item.label === 'Mentor Bookings'
                        ? 'bookings'
                        : item.label === 'Subscription'
                            ? 'subscription'
                            : null;
            const isOpen = sectionKey !== null && openSection === sectionKey;
            return (<StaggerFadeUpItem key={item.label} index={index}>
              <View>
              <AnimatedPressable className={`flex-row items-center justify-between px-4 py-4 ${index < menuItems.length - 1 || isOpen ? preferences.darkMode ? 'border-b border-[#2d2430]' : 'border-b border-line' : ''}`} onPress={item.action}>
                <View className="flex-row items-center gap-3">
                  <View className={`h-9 w-9 items-center justify-center rounded-[12px] ${preferences.darkMode ? 'bg-[#141417]' : 'bg-surface'}`}>
                    <Ionicons name={item.icon} size={18} color={item.tone}/>
                  </View>
                  <Text className={`text-[14px] font-bold ${preferences.darkMode ? 'text-white' : 'text-ink'}`}>{item.label}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {item.value ? <Text className={`text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>{item.value}</Text> : null}
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-forward'} size={18} color={palette.muted}/>
                </View>
              </AnimatedPressable>
              {isOpen ? renderInlineSection(sectionKey) : null}
            </View>
            </StaggerFadeUpItem>);
        })}
      </View>

      <AnimatedPressable className={`flex-row items-center justify-center gap-2 rounded-[18px] border py-4 ${preferences.darkMode ? 'border-[#5a2630] bg-[#2b151b]' : 'border-[#efc8c0] bg-[#fff4f2]'}`} onPress={() => router.replace('/auth-entry')}>
        <Ionicons name="log-out-outline" size={18} color={palette.danger}/>
        <Text className="text-[14px] font-extrabold text-danger">Logout</Text>
      </AnimatedPressable>

      <Text className={`text-center text-[11px] ${preferences.darkMode ? 'text-[#b7aeb9]' : 'text-muted'}`}>
        Current plan: {hasActiveSubscription ? activePlanId : 'No active plan'}
      </Text>
    </Screen>);
}
