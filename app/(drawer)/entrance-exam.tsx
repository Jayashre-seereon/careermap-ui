import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { palette } from '../../src/careermap-data';
import { Screen, SectionHeader } from '../../src/careermap-ui';

const exams = [
    { name: 'JEE Main', authority: 'NTA', date: 'April 2025', eligibility: 'Class 12 pass (PCM)', type: 'Central', category: 'Engineering' },
    { name: 'NEET UG', authority: 'NTA', date: 'May 2025', eligibility: 'Class 12 pass (PCB)', type: 'Central', category: 'Medical' },
    { name: 'CLAT', authority: 'NLUs', date: 'December 2024', eligibility: 'Class 12 pass', type: 'Central', category: 'Law' },
    { name: 'CUET', authority: 'NTA', date: 'May 2025', eligibility: 'Class 12 pass', type: 'Central', category: 'General' },
    { name: 'BITSAT', authority: 'BITS Pilani', date: 'May 2025', eligibility: 'Class 12 (PCM)', type: 'Private', category: 'Engineering' },
    { name: 'CAT', authority: 'IIMs', date: 'November 2025', eligibility: 'Graduate', type: 'Central', category: 'Business' },
    { name: 'MHT CET', authority: 'Maharashtra Govt', date: 'May 2025', eligibility: 'Class 12 (PCM/PCB)', type: 'State', category: 'Engineering' },
    { name: 'KCET', authority: 'Karnataka Govt', date: 'April 2025', eligibility: 'Class 12 pass', type: 'State', category: 'Engineering' },
    { name: 'AIIMS INI CET', authority: 'AIIMS', date: 'July 2025', eligibility: 'MBBS pass', type: 'Central', category: 'Medical' },
    { name: 'NIFT Entrance', authority: 'NIFT', date: 'February 2025', eligibility: 'Class 12 pass', type: 'Central', category: 'Design' },
    { name: 'GATE', authority: 'IIT', date: 'February 2026', eligibility: 'B.Tech/B.E.', type: 'Central', category: 'Engineering' },
    { name: 'VITEEE', authority: 'VIT', date: 'April 2025', eligibility: 'Class 12 (PCM)', type: 'Private', category: 'Engineering' },
];

const typeFilters = ['All', 'Central', 'State', 'Private'];
const categoryFilters = ['All', 'Engineering', 'Medical', 'Business', 'Law', 'Design', 'General'];

export default function EntranceExamScreen() {
    const [typeFilter, setTypeFilter] = useState('All');
    const [catFilter, setCatFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    let filtered = exams;
    if (typeFilter !== 'All') filtered = filtered.filter(e => e.type === typeFilter);
    if (catFilter !== 'All') filtered = filtered.filter(e => e.category === catFilter);

    return (
        <Screen>
            <SectionHeader title="Entrance Exams" subtitle="Practice tests and exam preparation guides." />

            <View style={styles.filterHeader}>
                <Pressable onPress={() => setShowFilters(!showFilters)} style={[styles.filterButton, showFilters && styles.filterButtonActive]}>
                    <Ionicons name="filter" size={16} color={showFilters ? palette.surface : palette.text} />
                    <Text style={[styles.filterButtonText, showFilters && styles.filterButtonTextActive]}>Filters</Text>
                </Pressable>
            </View>

            {showFilters && (
                <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Exam Type</Text>
                    <View style={styles.filterRow}>
                        {typeFilters.map(f => (
                            <Pressable key={f} onPress={() => setTypeFilter(f)} style={[styles.filterChip, typeFilter === f && styles.filterChipActive]}>
                                <Text style={[styles.filterChipText, typeFilter === f && styles.filterChipTextActive]}>{f}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Text style={styles.filterLabel}>Category</Text>
                    <View style={styles.filterRow}>
                        {categoryFilters.map(f => (
                            <Pressable key={f} onPress={() => setCatFilter(f)} style={[styles.filterChip, catFilter === f && styles.filterChipActive]}>
                                <Text style={[styles.filterChipText, catFilter === f && styles.filterChipTextActive]}>{f}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.examList}>
                {filtered.map((exam, index) => (
                    <View key={exam.name} style={styles.examCard}>
                        <View style={styles.examHeader}>
                            <View style={styles.examIcon}>
                                <Ionicons name="document-text-outline" size={20} color={palette.primary} />
                            </View>
                            <View style={styles.examInfo}>
                                <Text style={styles.examName}>{exam.name}</Text>
                                <Text style={styles.examAuthority}>{exam.authority}</Text>
                                <View style={styles.examMeta}>
                                    <Ionicons name="calendar-outline" size={12} color={palette.muted} />
                                    <Text style={styles.examDate}>{exam.date}</Text>
                                </View>
                                <Text style={styles.examEligibility}>{exam.eligibility}</Text>
                                <View style={styles.examTags}>
                                    <View style={[styles.tag, { backgroundColor: `${palette.blue}20` }]}>
                                        <Text style={[styles.tagText, { color: palette.blue }]}>{exam.type}</Text>
                                    </View>
                                    <View style={[styles.tag, { backgroundColor: `${palette.green}20` }]}>
                                        <Text style={[styles.tagText, { color: palette.green }]}>{exam.category}</Text>
                                    </View>
                                </View>
                            </View>
                            <Pressable style={styles.examAction}>
                                <Ionicons name="open-outline" size={16} color={palette.primary} />
                            </Pressable>
                        </View>
                    </View>
                ))}
                {filtered.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No exams match your filters</Text>
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    filterHeader: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
    },
    filterButtonActive: {
        backgroundColor: palette.primary,
    },
    filterButtonText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '600',
        color: palette.text,
    },
    filterButtonTextActive: {
        color: palette.surface,
    },
    filtersContainer: {
        paddingHorizontal: 24,
        paddingBottom: 12,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: palette.muted,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 8,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
    },
    filterChipActive: {
        backgroundColor: palette.primary,
        borderColor: palette.primary,
    },
    filterChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: palette.text,
    },
    filterChipTextActive: {
        color: palette.surface,
    },
    examList: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    examCard: {
        backgroundColor: palette.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    examHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    examIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: `${palette.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    examInfo: {
        flex: 1,
    },
    examName: {
        fontSize: 16,
        fontWeight: '700',
        color: palette.text,
        marginBottom: 2,
    },
    examAuthority: {
        fontSize: 12,
        color: palette.muted,
        marginBottom: 4,
    },
    examMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    examDate: {
        fontSize: 11,
        color: palette.muted,
        marginLeft: 4,
    },
    examEligibility: {
        fontSize: 11,
        color: palette.muted,
        marginBottom: 6,
    },
    examTags: {
        flexDirection: 'row',
        gap: 6,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tagText: {
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    examAction: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${palette.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        fontSize: 14,
        color: palette.muted,
    },
});