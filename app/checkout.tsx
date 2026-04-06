import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, subscriptions } from '../src/careermap-data';

type PaymentMethod = 'upi' | 'card' | 'netbanking';

const paymentMethods: { id: PaymentMethod; label: string; description: string }[] = [
  { id: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Card', description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', description: 'All major banks supported' },
];

const popularBanks = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak', 'Bank of Baroda'];
const quickUpiApps = ['GPay', 'PhonePe', 'Paytm'];

export default function CheckoutScreen() {
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const plan = subscriptions.find((item) => item.id === planId) ?? subscriptions[0];
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const transactionId = useMemo(() => `TXN${Date.now().toString().slice(-8)}`, []);

  const canPay = (() => {
    if (selectedMethod === 'upi') return upiId.includes('@');
    if (selectedMethod === 'card') {
      return (
        cardName.trim().length > 0 &&
        cardNumber.length === 16 &&
        cardExpiry.length === 5 &&
        cardCvv.length >= 3
      );
    }
    return selectedBank.length > 0;
  })();

  const handlePay = () => {
    if (!canPay || isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      router.replace({
        pathname: '/payment-success',
        params: {
          planId: plan.id,
          transactionId,
          method: selectedMethod,
        },
      });
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{isProcessing ? 'Processing' : 'Payment'}</Text>
            <Text style={styles.subtitle}>
              {isProcessing ? 'We are confirming your payment.' : 'Choose a payment method to unlock premium access.'}
            </Text>
          </View>
        </View>

        {isProcessing ? (
          <View style={styles.processingWrap}>
            <View style={styles.processingOrb}>
              <ActivityIndicator size="large" color={palette.primary} />
            </View>
            <Text style={styles.processingTitle}>Processing payment</Text>
            <Text style={styles.processingText}>
              Please wait while we verify your {selectedMethod === 'upi' ? 'UPI' : selectedMethod === 'card' ? 'card' : 'bank'} payment.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{plan.name}</Text>
                  <Text style={styles.summaryValue}>{plan.price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>GST</Text>
                  <Text style={styles.summaryValue}>Included</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Validity</Text>
                  <Text style={styles.summaryValue}>1 Year</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>{plan.price}</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Choose Payment Method</Text>
                <View style={styles.methodList}>
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <Pressable
                        key={method.id}
                        onPress={() => setSelectedMethod(method.id)}
                        style={[styles.methodCard, isSelected && styles.methodCardActive]}
                      >
                        <View style={styles.methodBody}>
                          <Text style={[styles.methodTitle, isSelected && styles.methodTitleActive]}>{method.label}</Text>
                          <Text style={styles.methodDesc}>{method.description}</Text>
                        </View>
                        <View style={[styles.radio, isSelected && styles.radioActive]}>
                          {isSelected ? <View style={styles.radioDot} /> : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {selectedMethod === 'upi' ? (
                  <View style={styles.formBlock}>
                    <Text style={styles.inputLabel}>Choose UPI App</Text>
                    <View style={styles.quickApps}>
                      {quickUpiApps.map((app) => (
                        <View key={app} style={styles.quickAppChip}>
                          <Text style={styles.quickAppText}>{app}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.inputLabel}>Add UPI ID</Text>
                    <TextInput
                      value={upiId}
                      onChangeText={setUpiId}
                      autoCapitalize="none"
                      placeholder="yourname@upi"
                      placeholderTextColor={palette.muted}
                      style={styles.input}
                    />
                  </View>
                ) : null}

                {selectedMethod === 'card' ? (
                  <View style={styles.formBlock}>
                    <Text style={styles.inputLabel}>Cardholder Name</Text>
                    <TextInput
                      value={cardName}
                      onChangeText={setCardName}
                      placeholder="Name on card"
                      placeholderTextColor={palette.muted}
                      style={styles.input}
                    />
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                      value={cardNumber}
                      onChangeText={(value) => setCardNumber(value.replace(/\D/g, '').slice(0, 16))}
                      keyboardType="number-pad"
                      placeholder="1234567890123456"
                      placeholderTextColor={palette.muted}
                      style={styles.input}
                    />
                    <View style={styles.inlineFields}>
                      <View style={styles.inlineField}>
                        <Text style={styles.inputLabel}>Expiry</Text>
                        <TextInput
                          value={cardExpiry}
                          onChangeText={(value) => setCardExpiry(value.slice(0, 5))}
                          placeholder="MM/YY"
                          placeholderTextColor={palette.muted}
                          style={styles.input}
                        />
                      </View>
                      <View style={styles.inlineField}>
                        <Text style={styles.inputLabel}>CVV</Text>
                        <TextInput
                          value={cardCvv}
                          onChangeText={(value) => setCardCvv(value.replace(/\D/g, '').slice(0, 4))}
                          keyboardType="number-pad"
                          secureTextEntry
                          placeholder="123"
                          placeholderTextColor={palette.muted}
                          style={styles.input}
                        />
                      </View>
                    </View>
                  </View>
                ) : null}

                {selectedMethod === 'netbanking' ? (
                  <View style={styles.formBlock}>
                    <Text style={styles.inputLabel}>Select Bank</Text>
                    <View style={styles.bankGrid}>
                      {popularBanks.map((bank) => {
                        const isSelected = selectedBank === bank;
                        return (
                          <Pressable
                            key={bank}
                            onPress={() => setSelectedBank(bank)}
                            style={[styles.bankChip, isSelected && styles.bankChipActive]}
                          >
                            <Text style={[styles.bankChipText, isSelected && styles.bankChipTextActive]}>{bank}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ) : null}
              </View>

              <View style={styles.securityBanner}>
                <Text style={styles.securityTitle}>Secure Payment</Text>
                <Text style={styles.securityText}>Your checkout is protected with encrypted verification.</Text>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                onPress={handlePay}
                disabled={!canPay}
                style={[styles.primaryButton, !canPay && styles.primaryButtonDisabled]}
              >
                <Text style={styles.primaryButtonText}>Pay {plan.price}</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 14 },
  backButton: {
    borderRadius: 14,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  backButtonText: { fontSize: 13, fontWeight: '800', color: palette.text },
  headerText: { flex: 1, gap: 4, paddingTop: 2 },
  title: { fontSize: 28, fontWeight: '900', color: palette.text },
  subtitle: { fontSize: 13, lineHeight: 20, color: palette.muted },
  scrollContent: { paddingBottom: 28, gap: 16 },
  card: {
    backgroundColor: palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: palette.text },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: palette.muted },
  summaryValue: { fontSize: 14, fontWeight: '700', color: palette.text },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 12,
    marginTop: 2,
  },
  totalLabel: { fontSize: 15, fontWeight: '900', color: palette.text },
  totalValue: { fontSize: 22, fontWeight: '900', color: palette.primary },
  methodList: { gap: 10 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
  },
  methodCardActive: {
    borderColor: palette.primary,
    backgroundColor: `${palette.primary}08`,
  },
  methodBody: { flex: 1, gap: 2 },
  methodTitle: { fontSize: 14, fontWeight: '800', color: palette.text },
  methodTitleActive: { color: palette.primary },
  methodDesc: { fontSize: 12, color: palette.muted },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: palette.primary },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
  formBlock: { gap: 10, marginTop: 4 },
  inputLabel: { fontSize: 12, fontWeight: '800', color: palette.muted },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: palette.text,
  },
  quickApps: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  quickAppChip: {
    borderRadius: 14,
    backgroundColor: `${palette.blue}12`,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quickAppText: { fontSize: 12, fontWeight: '800', color: palette.blue },
  inlineFields: { flexDirection: 'row', gap: 10 },
  inlineField: { flex: 1, gap: 10 },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bankChip: {
    minWidth: '47%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bankChipActive: {
    borderColor: palette.primary,
    backgroundColor: `${palette.primary}08`,
  },
  bankChipText: { fontSize: 13, fontWeight: '800', color: palette.text },
  bankChipTextActive: { color: palette.primary },
  securityBanner: {
    borderRadius: 20,
    backgroundColor: `${palette.green}12`,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  securityTitle: { fontSize: 14, fontWeight: '800', color: palette.green },
  securityText: { fontSize: 12, lineHeight: 18, color: palette.green },
  footer: {
    paddingTop: 10,
    paddingBottom: 16,
  },
  primaryButton: {
    borderRadius: 18,
    backgroundColor: palette.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#d8aab3',
  },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  processingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  processingOrb: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingTitle: { fontSize: 24, fontWeight: '900', color: palette.text },
  processingText: { fontSize: 14, lineHeight: 22, color: palette.muted, textAlign: 'center' },
});
