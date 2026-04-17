import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAppState } from '../../src/app-state';
import { mentors, palette } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';
export default function BookMentorScreen() {
    const { addBooking } = useAppState();
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
        <View className="items-center gap-[14px] rounded-[26px] border border-line bg-card p-[22px]">
          <Text className="text-center text-[22px] font-black text-ink">Session booked successfully</Text>
          <Text className="text-center text-[14px] leading-[22px] text-muted">Your session with {mentor.name} is confirmed for {selectedDate} at {selectedSlot}.</Text>
          <View className="w-full gap-2.5 rounded-[22px] border border-line bg-card p-[18px]">
            <Text className="text-[13px] text-muted">Mentor: {mentor.name}</Text>
            <Text className="text-[13px] text-muted">Date: {selectedDate}</Text>
            <Text className="text-[13px] text-muted">Time: {selectedSlot}</Text>
            <Text className="text-[13px] text-muted">Price: {mentor.price}</Text>
          </View>
          <Pressable className="w-full rounded-[16px] bg-brand py-[14px]" onPress={() => {
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
          </Pressable>
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

        <Pressable className="rounded-[16px] bg-brand py-[14px]" disabled={!canPay} onPress={() => setProcessing(true)} style={({ pressed }) => ({ opacity: !canPay || pressed ? 0.45 : 1 })}>
          <Text className="text-center text-[14px] font-extrabold text-white">Pay & Confirm</Text>
        </Pressable>
      </Screen>);
    }
    if (selectedIndex !== null) {
        const mentor = mentors[selectedIndex];
        return (<Screen animationKey={animationKey}>
        <SectionHeader title="Mentor Profile" subtitle="Profile, schedule selection, and booking flow aligned with the reference prototype." action={<Pressable className="h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#f2ebe6]" onPress={() => setSelectedIndex(null)}>
              <Ionicons name="arrow-back" size={18} color={palette.text}/>
            </Pressable>}/>

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

        <Pressable className="rounded-[16px] bg-brand py-[14px]" disabled={!selectedDate || !selectedSlot} onPress={() => setShowPayment(true)} style={({ pressed }) => ({ opacity: !selectedDate || !selectedSlot || pressed ? 0.45 : 1 })}>
          <Text className="text-center text-[14px] font-extrabold text-white">Book & Pay</Text>
        </Pressable>
      </Screen>);
    }
    return (<Screen animationKey={animationKey}>
      <SectionHeader title="Book Mentor" subtitle="Mentor list and booking flow adapted closely from the prototype."/>
      <View className="gap-2 rounded-[24px] border border-line bg-card p-5">
        <Text className="text-[20px] font-black text-ink">Expert Guidance for the Next Big Decision</Text>
        <Text className="text-[14px] leading-[21px] text-muted">Explore counsellors across engineering, design, and career planning, then reserve a 1-on-1 slot.</Text>
      </View>
      <View className="gap-3">
        {mentors.map((mentor, index) => (<Pressable key={mentor.name} className="flex-row items-center gap-3 rounded-[22px] border border-line bg-card p-4" onPress={() => setSelectedIndex(index)}>
            <View className="h-[52px] w-[52px] items-center justify-center rounded-[18px]" style={{ backgroundColor: `${mentor.accent}15` }}>
              <Text className="text-[20px] font-black" style={{ color: mentor.accent }}>{mentor.avatar}</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-[15px] font-extrabold text-ink">{mentor.name}</Text>
              <Text className="text-[12px] font-bold text-brand">{mentor.specialty}</Text>
              <View className="flex-row gap-2.5">
                <Text className="text-[11px] text-muted">{mentor.rating} rating</Text>
                <Text className="text-[11px] text-muted">{mentor.experience}</Text>
                <Text className="text-[11px] font-extrabold text-brand">{mentor.price}</Text>
              </View>
            </View>
            <Pill label="Available" tone={palette.green}/>
          </Pressable>))}
      </View>
    </Screen>);
}
