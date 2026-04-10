import { Text, View } from 'react-native';

import { notifications } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

export default function NotificationsScreen() {
  return (
    <Screen>
      <SectionHeader title="Notifications" subtitle="Recent updates from mentors, scholarships, and learning content." />
      <View className="gap-3">
        {notifications.map((item) => (
          <View key={item.id} className={`gap-2 rounded-[22px] border p-[18px] ${item.unread ? 'border-[#e2b8a8] bg-[#fff8f4]' : 'border-line bg-card'}`}>
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-[16px] font-extrabold text-ink">{item.title}</Text>
              {item.unread ? <View className="h-[10px] w-[10px] rounded-full bg-brand" /> : null}
            </View>
            <Text className="text-[14px] leading-[21px] text-muted">{item.message}</Text>
            <Text className="text-[12px] font-bold text-brand">{item.time}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
