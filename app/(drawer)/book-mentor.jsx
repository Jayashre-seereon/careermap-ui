import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text, TextInput, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { mentors, palette } from '../../src/careermap-data';
import { AnimatedPressable, Pill, Screen, SectionHeader, UnlockBottomSheet } from '../../src/careermap-ui';
import { openSubscriptionPrompt } from '../../src/subscription-flow';
export default function BookMentorScreen() {
    const params = useLocalSearchParams();
    const { addBooking, canAccessFreeDetail, isUnlocked, registerFreeDetailAccess } = useAppState();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [upiId, setUpiId] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [booked, setBooked] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showUnlockSheet, setShowUnlockSheet] = useState(false);
    const celebration = useRef(new Animated.Value(0)).current;
    const selectedMentor = selectedIndex !== null ? mentors[selectedIndex] : null;
    const detailUnlocked = selectedMentor ? canAccessFreeDetail('book-mentor', selectedMentor.name) : true;
    const formatCardNumber = (value) => value.replace(/\D/g, '').slice(0, 16);
    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length < 3)
            return digits;
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    };
    const isValidExpiry = (value) => {
        if (!/^\d{2}\/\d{2}$/.test(value))
            return false;
        const [month] = value.split('/').map(Number);
        return month >= 1 && month <= 12;
    };
    const animationKey = processing
        ? 'processing'
        : booked && selectedIndex !== null
            ? `booked-${selectedIndex}`
            : selectedIndex !== null && showPayment
                ? `payment-${selectedIndex}-${selectedDate || 'date'}-${selectedSlot || 'slot'}`
                : selectedIndex !== null
                    ? `mentor-${selectedIndex}`
                    : 'mentor-list';
    const dates = useMemo(() => Array.from({ length: 14 }, (_, index) => {
        const current = new Date();
        current.setDate(current.getDate() + index);
        return {
            key: current.toISOString().split('T')[0],
            day: current.toLocaleDateString('en-IN', { weekday: 'short' }),
            date: current.getDate().toString(),
            month: current.toLocaleDateString('en-IN', { month: 'short' }),
            available: index % 4 !== 1,
        };
    }), []);
    const slots = ['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'];
    useEffect(() => {
        if (!processing)
            return;
        const timer = setTimeout(() => {
            setProcessing(false);
            if (selectedIndex !== null) {
                const mentor = mentors[selectedIndex];
                addBooking({
                    id: `booking-${mentor.name}-${selectedDate}-${selectedSlot}`,
                    mentorName: mentor.name,
                    date: selectedDate,
                    time: selectedSlot,
                    status: 'Confirmed',
                });
            }
            setBooked(true);
        }, 1600);
        return () => clearTimeout(timer);
    }, [addBooking, processing, selectedDate, selectedIndex, selectedSlot]);
    useEffect(() => {
        if (typeof params.selected === 'string') {
            setSelectedIndex(Number(params.selected));
        }
    }, [params.selected]);
    useEffect(() => {
        if (!booked) {
            celebration.setValue(0);
            return;
        }
        Animated.spring(celebration, {
            toValue: 1,
            useNativeDriver: true,
            speed: 11,
            bounciness: 10,
        }).start();
    }, [booked, celebration]);
    if (processing) {
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Processing" subtitle="Confirming your mentor booking." action={<Pressable className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]" onPress={() => setProcessing(false)}>
              <Ionicons name="arrow-back" size={18} color={palette.text}/>
            </Pressable>}/>
        <View className="min-h-[280px] items-center justify-center gap-[14px] rounded-[26px] border border-line bg-card p-7">
          <View className="h-[54px] w-[54px] rounded-full border-4 border-[#eadfd6] border-t-brand"/>
          <Text className="text-center text-[22px] font-black text-ink">Processing Payment</Text>
          <Text className="text-center text-[14px] leading-[22px] text-muted">Please wait while we confirm your mentor booking.</Text>
        </View>
      </Screen>);
    }
    if (booked && selectedIndex !== null) {
        const mentor = mentors[selectedIndex];
        const confetti = [
            { top: 16, left: 22, color: palette.secondary, rotate: '-20deg' },
            { top: 34, right: 24, color: palette.orange, rotate: '24deg' },
            { top: 86, left: 10, color: palette.blue, rotate: '-32deg' },
            { top: 100, right: 12, color: palette.pink, rotate: '18deg' },
            { bottom: 132, left: 28, color: palette.green, rotate: '-12deg' },
            { bottom: 118, right: 26, color: palette.primary, rotate: '16deg' },
        ];
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Booking Confirmed" subtitle="The mentor booking flow now mirrors the prototype much more closely." action={<Pressable className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]" onPress={() => {
                    setBooked(false);
                    setSelectedIndex(null);
                    setSelectedDate('');
                    setSelectedSlot('');
                    setShowPayment(false);
                    setSelectedPayment('');
                    setUpiId('');
                    setCardName('');
                    setCardNumber('');
                    setCardExpiry('');
                    setCardCvv('');
                    setSelectedBank('');
                }}>
              <Ionicons name="arrow-back" size={18} color={palette.text}/>
            </Pressable>}/>
        <View className="overflow-hidden rounded-[26px] border border-line bg-card p-[22px]">
          {confetti.map((piece, index) => (<Animated.View key={index} className="absolute h-4 w-4 rounded-[4px]" style={[
                    piece,
                    {
                        backgroundColor: piece.color,
                        opacity: celebration.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        transform: [
                            { translateY: celebration.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) },
                            { scale: celebration.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
                            { rotate: piece.rotate },
                        ],
                    },
                ]}/>))}
          <View className="items-center gap-[14px]">
          <Animated.View style={{
                    transform: [{ scale: celebration.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }) }],
                    opacity: celebration,
                }}>
            <View className="h-[90px] w-[90px] items-center justify-center rounded-[30px]" style={{ backgroundColor: `${palette.green}14` }}>
              <Ionicons name="checkmark-circle" size={52} color={palette.green}/>
            </View>
          </Animated.View>
          <Text className="text-center text-[22px] font-black text-ink">Session booked successfully</Text>
          <Text className="text-center text-[14px] leading-[22px] text-muted">Payment successful. Your session with {mentor.name} is confirmed for {selectedDate} at {selectedSlot}.</Text>
          <View className="w-full gap-2.5 rounded-[22px] border border-line bg-card p-[18px]">
            <Text className="text-[13px] text-muted">Mentor: {mentor.name}</Text>
            <Text className="text-[13px] text-muted">Date: {selectedDate}</Text>
            <Text className="text-[13px] text-muted">Time: {selectedSlot}</Text>
            <Text className="text-[13px] text-muted">Price: {mentor.price}</Text>
            <Text className="text-[13px] text-muted">Payment Method: {selectedPayment === 'upi' ? 'UPI' : selectedPayment === 'card' ? 'Credit / Debit Card' : 'Net Banking'}</Text>
          </View>
          <AnimatedPressable className="w-full rounded-[16px] bg-brand py-[14px]" onPress={() => {
                setBooked(false);
                setSelectedIndex(null);
                setSelectedDate('');
                setSelectedSlot('');
                setShowPayment(false);
                setSelectedPayment('');
                setUpiId('');
                setCardName('');
                setCardNumber('');
                setCardExpiry('');
                setCardCvv('');
                setSelectedBank('');
            }}>
            <Text className="text-center text-[14px] font-extrabold text-white">Back to Mentor List</Text>
          </AnimatedPressable>
          </View>
        </View>
      </Screen>);
    }
    if (selectedIndex !== null && showPayment) {
        const mentor = mentors[selectedIndex];
        const canPay = selectedPayment === 'upi'
            ? upiId.includes('@')
            : selectedPayment === 'card'
                ? cardName.trim().length > 0 && cardNumber.length === 16 && isValidExpiry(cardExpiry) && cardCvv.length >= 3
                : selectedPayment === 'netbanking'
                    ? selectedBank.length > 0
                    : false;
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Payment" subtitle="Booking summary and payment choices adapted from the prototype flow." action={<Pressable className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]" onPress={() => setShowPayment(false)}>
              <Ionicons name="arrow-back" size={18} color={palette.text}/>
            </Pressable>}/>

        <View className="gap-2.5 rounded-[22px] border border-line bg-card p-[18px]">
          <Text className="text-[15px] font-extrabold text-ink">Booking Summary</Text>
          <Text className="text-[13px] text-muted">Mentor: {mentor.name}</Text>
          <Text className="text-[13px] text-muted">Date: {selectedDate}</Text>
          <Text className="text-[13px] text-muted">Time: {selectedSlot}</Text>
          <Text className="text-[13px] text-muted">Duration: 45 mins</Text>
          <Text className="text-[13px] font-extrabold text-brand">Total: {mentor.price}</Text>
        </View>

        <View className="gap-3">
          {[
                { id: 'upi', title: 'UPI', subtitle: 'Google Pay, PhonePe, Paytm' },
                { id: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay' },
                { id: 'netbanking', title: 'Net Banking', subtitle: 'All major banks supported' },
            ].map((method) => (<Pressable key={method.id} className="flex-row items-center gap-3 rounded-[22px] border p-4" onPress={() => setSelectedPayment(method.id)} style={{
                    borderColor: selectedPayment === method.id ? palette.primary : palette.border,
                    backgroundColor: selectedPayment === method.id ? `${palette.primary}08` : palette.card,
                }}>
              <View className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]">
                <Ionicons name={method.id === 'upi' ? 'phone-portrait-outline' : method.id === 'card' ? 'card-outline' : 'business-outline'} size={18} color={selectedPayment === method.id ? palette.primary : palette.muted}/>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[15px] font-extrabold text-ink">{method.title}</Text>
                <Text className="text-[12px] text-muted">{method.subtitle}</Text>
              </View>
              <View className="h-5 w-5 items-center justify-center rounded-full border-2" style={{ borderColor: selectedPayment === method.id ? palette.primary : '#d2c7bf' }}>
                {selectedPayment === method.id ? <View className="h-2 w-2 rounded-full bg-brand"/> : null}
              </View>
            </Pressable>))}
        </View>

        {selectedPayment === 'upi' ? (<TextInput value={upiId} onChangeText={setUpiId} placeholder="yourname@upi" placeholderTextColor={palette.muted} className="rounded-[16px] border border-line bg-card px-4 py-[14px] text-[14px] text-ink"/>) : null}

        {selectedPayment === 'card' ? (<View className="gap-2.5">
            <TextInput value={cardName} onChangeText={setCardName} placeholder="Name on card" placeholderTextColor={palette.muted} className="rounded-[16px] border border-line bg-card px-4 py-[14px] text-[14px] text-ink"/>
            <TextInput value={cardNumber} onChangeText={(value) => setCardNumber(formatCardNumber(value))} keyboardType="number-pad" placeholder="1234567890123456" placeholderTextColor={palette.muted} className="rounded-[16px] border border-line bg-card px-4 py-[14px] text-[14px] text-ink"/>
            <View className="flex-row gap-2.5">
              <TextInput value={cardExpiry} onChangeText={(value) => setCardExpiry(formatExpiry(value))} keyboardType="number-pad" placeholder="MM/YY" placeholderTextColor={palette.muted} className="flex-1 rounded-[16px] border border-line bg-card px-4 py-[14px] text-[14px] text-ink"/>
              <TextInput value={cardCvv} onChangeText={(value) => setCardCvv(value.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" secureTextEntry placeholder="CVV" placeholderTextColor={palette.muted} className="flex-1 rounded-[16px] border border-line bg-card px-4 py-[14px] text-[14px] text-ink"/>
            </View>
          </View>) : null}

        {selectedPayment === 'netbanking' ? (<View className="flex-row flex-wrap gap-2.5">
            {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => {
                const active = selectedBank === bank;
                return (<Pressable key={bank} className="min-w-[47%] items-center rounded-[14px] border py-3" onPress={() => setSelectedBank(bank)} style={{
                        borderColor: active ? palette.primary : palette.border,
                        backgroundColor: active ? `${palette.primary}08` : palette.card,
                    }}>
                <Text className="text-[12px] font-extrabold" style={{ color: active ? palette.primary : palette.text }}>{bank}</Text>
              </Pressable>);
            })}
          </View>) : null}

        <View className="flex-row items-center gap-2 rounded-[14px] px-3 py-2.5" style={{ backgroundColor: `${palette.green}10` }}>
          <Ionicons name="shield-checkmark-outline" size={16} color={palette.green}/>
          <Text className="flex-1 text-[11px] font-bold text-success">Your payment is secured with 256-bit SSL encryption</Text>
        </View>

        <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]" disabled={!canPay} onPress={() => setProcessing(true)}>
          <Text className="text-center text-[14px] font-extrabold text-white">Pay {mentor.price} & Confirm</Text>
        </AnimatedPressable>
      </Screen>);
    }
    if (selectedIndex !== null) {
        const mentor = mentors[selectedIndex];
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Mentor Profile" subtitle="Profile, schedule selection, and booking flow aligned with the reference prototype." action={<Pressable className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]" onPress={() => setSelectedIndex(null)}>
              <Ionicons name="arrow-back" size={18} color={palette.text}/>
            </Pressable>}/>
        {!isUnlocked('book-mentor') ? (<View className="self-start rounded-full px-3 py-2" style={{ backgroundColor: `${detailUnlocked ? palette.green : palette.orange}14` }}>
            <Text className="text-[12px] font-extrabold" style={{ color: detailUnlocked ? palette.green : palette.orange }}>
              {detailUnlocked ? '1 free mentor detail unlocked' : 'Subscribe to unlock more mentor profiles'}
            </Text>
          </View>) : null}

        <View className="relative">
          <>
        <View className="items-center gap-2">
          <View className="h-[52px] w-[52px] items-center justify-center rounded-[18px]" style={{ backgroundColor: `${mentor.accent}15` }}>
            <Text className="text-[20px] font-black" style={{ color: mentor.accent }}>{mentor.avatar}</Text>
          </View>
          <Text className="text-center text-[22px] font-black text-ink">{mentor.name}</Text>
          <Text className="text-[12px] font-bold text-brand">{mentor.specialty}</Text>
          <View className="flex-row flex-wrap justify-center gap-2.5">
            <Text className="text-[11px] text-muted">{mentor.rating} rating</Text>
            <Text className="text-[11px] text-muted">{mentor.experience}</Text>
            <Text className="text-[11px] font-extrabold text-brand">{mentor.price}</Text>
          </View>
          <View className="flex-row flex-wrap justify-center gap-2">
            {mentor.tags.map((tag) => (<Pill key={tag} label={tag} tone={mentor.accent}/>))}
          </View>
        </View>

        <View className="gap-2 rounded-[24px] border border-line bg-card p-5">
          <Text className="text-[20px] font-black text-ink">About</Text>
          <Text className="text-[14px] leading-[21px] text-muted">{mentor.bio}</Text>
        </View>

        <View className="gap-2 rounded-[24px] border border-line bg-card p-5">
          <Text className="text-[20px] font-black text-ink">Select Date</Text>
          <View className="flex-row flex-wrap gap-2.5">
            {dates.map((date) => (<Pressable key={date.key} disabled={!date.available} onPress={() => setSelectedDate(date.key)} className="w-[62px] items-center gap-0.5 rounded-[16px] py-2.5" style={{
                    backgroundColor: selectedDate === date.key ? palette.primary : '#f2ebe6',
                    opacity: date.available ? 1 : 0.35,
                }}>
                <Text className="text-[10px] font-bold" style={{ color: selectedDate === date.key ? '#fff' : palette.muted }}>{date.day}</Text>
                <Text className="text-[17px] font-black" style={{ color: selectedDate === date.key ? '#fff' : palette.text }}>{date.date}</Text>
                <Text className="text-[10px] font-bold" style={{ color: selectedDate === date.key ? '#fff' : palette.muted }}>{date.month}</Text>
              </Pressable>))}
          </View>
        </View>

        {selectedDate ? (<View className="gap-2 rounded-[24px] border border-line bg-card p-5">
            <Text className="text-[20px] font-black text-ink">Select Time</Text>
            <View className="flex-row flex-wrap gap-2.5">
              {slots.map((slot) => (<Pressable key={slot} className="rounded-[12px] px-[14px] py-2.5" onPress={() => setSelectedSlot(slot)} style={{ backgroundColor: selectedSlot === slot ? palette.primary : '#f2ebe6' }}>
                  <Text className="text-[12px] font-extrabold" style={{ color: selectedSlot === slot ? '#fff' : palette.text }}>{slot}</Text>
                </Pressable>))}
            </View>
          </View>) : null}

        <AnimatedPressable className="rounded-[16px] bg-brand py-[14px]" disabled={!selectedDate || !selectedSlot} onPress={() => setShowPayment(true)}>
          <Text className="text-center text-[14px] font-extrabold text-white">Book & Pay</Text>
        </AnimatedPressable>
          </>
        </View>
      </Screen>);
    }
    return (<Screen animationKey={animationKey}>
      <SectionHeader title="Book Mentor" subtitle="Mentor list and booking flow adapted closely from the prototype."/>
      <View className="gap-2 rounded-[24px] border border-line bg-card p-5">
        <Text className="text-[20px] font-black text-ink">Expert Guidance for the Next Big Decision</Text>
        <Text className="text-[14px] leading-[21px] text-muted">Explore counsellors across engineering, design, and career planning, then reserve a 1-on-1 slot.</Text>
      </View>
      <View className="gap-3">
        {mentors.map((mentor, index) => (<Pressable key={mentor.name} className="flex-row items-center gap-3 rounded-[22px] border border-line bg-card p-4" onPress={() => {
                if (!isUnlocked('book-mentor') && !canAccessFreeDetail('book-mentor', mentor.name)) {
                    setShowUnlockSheet(true);
                    return;
                }
                registerFreeDetailAccess('book-mentor', mentor.name);
                setSelectedIndex(index);
            }}>
            <View className="h-[52px] w-[52px] items-center justify-center rounded-[18px]" style={{ backgroundColor: `${mentor.accent}15` }}>
              <Text className="text-[20px] font-black" style={{ color: mentor.accent }}>{mentor.avatar}</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-[15px] font-extrabold text-ink">{mentor.name}</Text>
              <Text className="text-[12px] font-bold text-brand">{mentor.specialty}</Text>
              <Text className="text-[11px] text-muted">{mentor.experience}</Text>
            </View>
            <View className="items-end gap-1">
              <Text className="text-[12px] font-black text-brand">{mentor.price}</Text>
              <View className="flex-row items-center gap-1 rounded-full bg-[#f7efe8] px-2.5 py-1">
                <Ionicons name="star" size={12} color={palette.secondary}/>
                <Text className="text-[11px] font-extrabold text-ink">{mentor.rating}</Text>
              </View>
            </View>
          </Pressable>))}
      </View>
      {showUnlockSheet ? (<UnlockBottomSheet title="Unlock Mentor Access" subtitle="Subscribe to more mentor profiles and booking access." onClose={() => setShowUnlockSheet(false)} onPress={() => {
                setShowUnlockSheet(false);
                openSubscriptionPrompt({ pathname: '/(drawer)/book-mentor' });
            }}/>) : null}
    </Screen>);
}
