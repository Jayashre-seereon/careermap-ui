import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { mentors, palette } from '../../src/careermap-data';
import { Pill, Screen, SectionHeader } from '../../src/careermap-ui';

export default function BookMentorScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [upiId, setUpiId] = useState('');
  const [booked, setBooked] = useState(false);
  const [processing, setProcessing] = useState(false);

  const dates = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const current = new Date();
        current.setDate(current.getDate() + index);
        return {
          key: current.toISOString().split('T')[0],
          day: current.toLocaleDateString('en-IN', { weekday: 'short' }),
          date: current.getDate().toString(),
          month: current.toLocaleDateString('en-IN', { month: 'short' }),
          available: index % 4 !== 1,
        };
      }),
    [],
  );

  const slots = ['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'];

  useEffect(() => {
    if (!processing) return;
    const timer = setTimeout(() => {
      setProcessing(false);
      setBooked(true);
    }, 1600);
    return () => clearTimeout(timer);
  }, [processing]);

  if (processing) {
    return (
      <Screen>
        <SectionHeader
          title="Processing"
          subtitle="Confirming your mentor booking."
          action={
            <Pressable onPress={() => setProcessing(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />
        <View style={styles.processingCard}>
          <View style={styles.loaderRing} />
          <Text style={styles.confirmTitle}>Processing Payment</Text>
          <Text style={styles.confirmCopy}>Please wait while we confirm your mentor booking.</Text>
        </View>
      </Screen>
    );
  }

  if (booked && selectedIndex !== null) {
    const mentor = mentors[selectedIndex];

    return (
      <Screen>
        <SectionHeader
          title="Booking Confirmed"
          subtitle="The mentor booking flow now mirrors the prototype much more closely."
          action={
            <Pressable
              onPress={() => {
                setBooked(false);
                setSelectedIndex(null);
                setSelectedDate('');
                setSelectedSlot('');
                setShowPayment(false);
                setSelectedPayment('');
                setUpiId('');
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Session booked successfully</Text>
          <Text style={styles.confirmCopy}>
            Your session with {mentor.name} is confirmed for {selectedDate} at {selectedSlot}.
          </Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryRow}>Mentor: {mentor.name}</Text>
            <Text style={styles.summaryRow}>Date: {selectedDate}</Text>
            <Text style={styles.summaryRow}>Time: {selectedSlot}</Text>
            <Text style={styles.summaryRow}>Price: {mentor.price}</Text>
          </View>
          <Pressable
            onPress={() => {
              setBooked(false);
              setSelectedIndex(null);
              setSelectedDate('');
              setSelectedSlot('');
              setShowPayment(false);
              setSelectedPayment('');
              setUpiId('');
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Back to Mentor List</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (selectedIndex !== null && showPayment) {
    const mentor = mentors[selectedIndex];
    const canPay = selectedPayment !== '' && (selectedPayment !== 'upi' || upiId.includes('@'));

    return (
      <Screen>
        <SectionHeader
          title="Payment"
          subtitle="Booking summary and payment choices adapted from the prototype flow."
          action={
            <Pressable onPress={() => setShowPayment(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Booking Summary</Text>
          <Text style={styles.summaryRow}>Mentor: {mentor.name}</Text>
          <Text style={styles.summaryRow}>Date: {selectedDate}</Text>
          <Text style={styles.summaryRow}>Time: {selectedSlot}</Text>
          <Text style={styles.summaryRow}>Duration: 45 mins</Text>
          <Text style={[styles.summaryRow, styles.summaryPrice]}>Total: {mentor.price}</Text>
        </View>

        <View style={styles.list}>
          {[
            { id: 'upi', title: 'UPI', subtitle: 'Google Pay, PhonePe, Paytm' },
            { id: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay' },
            { id: 'netbanking', title: 'Net Banking', subtitle: 'All major banks supported' },
          ].map((method) => (
            <Pressable
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              style={[styles.paymentCard, selectedPayment === method.id && styles.paymentCardActive]}
            >
              <View style={styles.paymentIconWrap}>
                <Ionicons
                  name={method.id === 'upi' ? 'phone-portrait-outline' : method.id === 'card' ? 'card-outline' : 'business-outline'}
                  size={18}
                  color={selectedPayment === method.id ? palette.primary : palette.muted}
                />
              </View>
              <View style={styles.paymentBody}>
                <Text style={styles.name}>{method.title}</Text>
                <Text style={styles.meta}>{method.subtitle}</Text>
              </View>
              <View style={[styles.radioOuter, selectedPayment === method.id && styles.radioOuterActive]}>
                {selectedPayment === method.id ? <View style={styles.radioInner} /> : null}
              </View>
            </Pressable>
          ))}
        </View>

        {selectedPayment === 'upi' ? (
          <TextInput
            value={upiId}
            onChangeText={setUpiId}
            placeholder="yourname@upi"
            placeholderTextColor={palette.muted}
            style={styles.input}
          />
        ) : null}

        {selectedPayment === 'netbanking' ? (
          <View style={styles.bankGrid}>
            {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
              <View key={bank} style={styles.bankCard}>
                <Text style={styles.bankCardText}>{bank}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.secureCard}>
          <Ionicons name="shield-checkmark-outline" size={16} color={palette.green} />
          <Text style={styles.secureText}>Your payment is secured with 256-bit SSL encryption</Text>
        </View>

        <Pressable disabled={!canPay} onPress={() => setProcessing(true)} style={[styles.primaryButton, !canPay && styles.disabledButton]}>
          <Text style={styles.primaryButtonText}>Pay & Confirm</Text>
        </Pressable>
      </Screen>
    );
  }

  if (selectedIndex !== null) {
    const mentor = mentors[selectedIndex];

    return (
      <Screen>
        <SectionHeader
          title="Mentor Profile"
          subtitle="Profile, schedule selection, and booking flow aligned with the reference prototype."
          action={
            <Pressable onPress={() => setSelectedIndex(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={palette.text} />
            </Pressable>
          }
        />

        <View style={styles.detailHero}>
          <View style={[styles.avatar, { backgroundColor: `${mentor.accent}15` }]}>
            <Text style={[styles.avatarText, { color: mentor.accent }]}>{mentor.avatar}</Text>
          </View>
          <Text style={styles.detailName}>{mentor.name}</Text>
          <Text style={styles.specialty}>{mentor.specialty}</Text>
          <View style={styles.detailMetaRow}>
            <Text style={styles.meta}>{mentor.rating} rating</Text>
            <Text style={styles.meta}>{mentor.experience}</Text>
            <Text style={[styles.meta, styles.price]}>{mentor.price}</Text>
          </View>
          <View style={styles.tagWrap}>
            {mentor.tags.map((tag) => (
              <Pill key={tag} label={tag} tone={mentor.accent} />
            ))}
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>About</Text>
          <Text style={styles.heroCopy}>{mentor.bio}</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Select Date</Text>
          <View style={styles.dateRow}>
            {dates.map((date) => (
              <Pressable
                key={date.key}
                disabled={!date.available}
                onPress={() => setSelectedDate(date.key)}
                style={[styles.dateChip, selectedDate === date.key && styles.dateChipActive, !date.available && styles.dateChipDisabled]}
              >
                <Text style={[styles.dateChipDay, selectedDate === date.key && styles.dateChipTextActive]}>{date.day}</Text>
                <Text style={[styles.dateChipDate, selectedDate === date.key && styles.dateChipTextActive]}>{date.date}</Text>
                <Text style={[styles.dateChipMonth, selectedDate === date.key && styles.dateChipTextActive]}>{date.month}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {selectedDate ? (
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Select Time</Text>
            <View style={styles.slotGrid}>
              {slots.map((slot) => (
                <Pressable key={slot} onPress={() => setSelectedSlot(slot)} style={[styles.slotChip, selectedSlot === slot && styles.slotChipActive]}>
                  <Text style={[styles.slotChipText, selectedSlot === slot && styles.slotChipTextActive]}>{slot}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <Pressable
          disabled={!selectedDate || !selectedSlot}
          onPress={() => setShowPayment(true)}
          style={[styles.primaryButton, (!selectedDate || !selectedSlot) && styles.disabledButton]}
        >
          <Text style={styles.primaryButtonText}>Book & Pay</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Book Mentor"
        subtitle="Mentor list and booking flow adapted closely from the prototype."
      />

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Expert Guidance for the Next Big Decision</Text>
        <Text style={styles.heroCopy}>
          Explore counsellors across engineering, design, and career planning, then reserve a 1-on-1 slot.
        </Text>
      </View>

      <View style={styles.list}>
        {mentors.map((mentor, index) => (
          <Pressable key={mentor.name} onPress={() => setSelectedIndex(index)} style={styles.card}>
            <View style={[styles.avatar, { backgroundColor: `${mentor.accent}15` }]}>
              <Text style={[styles.avatarText, { color: mentor.accent }]}>{mentor.avatar}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{mentor.name}</Text>
              <Text style={styles.specialty}>{mentor.specialty}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{mentor.rating} rating</Text>
                <Text style={styles.meta}>{mentor.experience}</Text>
                <Text style={[styles.meta, styles.price]}>{mentor.price}</Text>
              </View>
            </View>
            <Pill label="Available" tone={palette.green} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: palette.text,
  },
  heroCopy: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
  },
  list: {
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.text,
  },
  specialty: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  meta: {
    fontSize: 11,
    color: palette.muted,
  },
  price: {
    color: palette.primary,
    fontWeight: '800',
  },
  detailHero: {
    alignItems: 'center',
    gap: 8,
  },
  detailName: {
    fontSize: 22,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  detailMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dateChip: {
    width: 62,
    borderRadius: 16,
    backgroundColor: '#f2ebe6',
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  dateChipActive: {
    backgroundColor: palette.primary,
  },
  dateChipDisabled: {
    opacity: 0.35,
  },
  dateChipDay: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.muted,
  },
  dateChipDate: {
    fontSize: 17,
    fontWeight: '900',
    color: palette.text,
  },
  dateChipMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.muted,
  },
  dateChipTextActive: {
    color: '#fff',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotChip: {
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  slotChipActive: {
    backgroundColor: palette.primary,
  },
  slotChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.text,
  },
  slotChipTextActive: {
    color: '#fff',
  },
  primaryButton: {
    borderRadius: 16,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.45,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  paymentCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentCardActive: {
    borderColor: palette.primary,
    backgroundColor: `${palette.primary}08`,
  },
  paymentBody: {
    flex: 1,
    gap: 3,
  },
  paymentIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f2ebe6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#d2c7bf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: palette.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: palette.text,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bankCard: {
    minWidth: '47%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bankCardText: {
    fontSize: 12,
    fontWeight: '800',
    color: palette.text,
  },
  secureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: `${palette.green}10`,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secureText: {
    flex: 1,
    fontSize: 11,
    color: palette.green,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 10,
  },
  summaryHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.text,
  },
  summaryRow: {
    fontSize: 13,
    color: palette.muted,
  },
  summaryPrice: {
    color: palette.primary,
    fontWeight: '800',
  },
  confirmCard: {
    backgroundColor: palette.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 22,
    gap: 14,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: palette.text,
    textAlign: 'center',
  },
  confirmCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
    textAlign: 'center',
  },
  processingCard: {
    backgroundColor: palette.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 28,
    gap: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  loaderRing: {
    width: 54,
    height: 54,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#eadfd6',
    borderTopColor: palette.primary,
  },
});
