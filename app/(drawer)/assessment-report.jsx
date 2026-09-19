import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppState } from '../../src/app-state';
import { useAuthStore } from '../../src/store/auth-store';
import { getAttemptResult } from '../../src/api/psychometricAssessmentApi';
import {
  CLUSTERS,
  CLUSTER_MAP,
  INTERP,
  SEM_SUB,
  CHART_COLOR,
  INTEREST_COLOR,
  VALUES_COLOR,
  PERSON_COLOR,
  VARK_COLOR,
  pct,
  band,
  bandColorHex,
} from '../../src/features/assessment/data/careerCompassData';
import {
  DonutChart,
  ColumnChart,
  LineChart,
  TwinBars,
  HBarChart,
} from '../../src/features/assessment/components/CareerCompassCharts';

export default function AssessmentReportScreen() {
  const { attemptId } = useLocalSearchParams();
  const { preferences } = useAppState();
  const user = useAuthStore((state) => state.user);
  const darkMode = preferences.darkMode;

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [expandedClusters, setExpandedClusters] = useState({});
  const [activeLeg, setActiveLeg] = useState('leg1');

  const scrollViewRef = useRef(null);
  const legRefs = useRef({ leg1: 0, leg2: 0, leg3: 0, leg4: 0 });

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAttemptResult(attemptId);
      if (
        data &&
        (data.report ||
          data.data?.report ||
          data.topCareerCluster ||
          data.data?.topCareerCluster)
      ) {
        setReportData(data.data || data);
      } else {
        setReportData(null);
      }
    } catch (err) {
      console.warn('Could not fetch remote result:', err?.message);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  // Normalize API data
  const rawData = reportData || {};
  const report = rawData.report || {};
  const student = report.student || {};
  const studentName =
    student.name || rawData.studentName || user?.name || 'Student Candidate';
  const studentClass =
    student.class || rawData.className || user?.selectedClass || 'Senior Secondary';
  const studentSchool = student.school || rawData.school || user?.school || '';
  const completedDate =
    student.completedAt || rawData.completedAt || new Date().toISOString();

  const hollandCode = rawData.hollandCode || report.hollandProfile?.code || 'SEC';
  const scores = rawData.scores || {};

  // Extract Goal Orientation percentages
  const domains = report.domains || {};
  const goalObj = domains.goalOrientation || {};
  const longScore =
    goalObj.longTerm?.score ??
    (goalObj.longTerm?.percentage != null ? goalObj.longTerm.percentage / 100 : null) ??
    scores.goalLong ??
    0.6875;
  const shortScore =
    goalObj.shortTerm?.score ??
    (goalObj.shortTerm?.percentage != null ? goalObj.shortTerm.percentage / 100 : null) ??
    scores.goalShort ??
    0.75;

  const longPct = goalObj.longTerm?.percentage ?? pct(longScore);
  const shortPct = goalObj.shortTerm?.percentage ?? pct(shortScore);

  const goalDiff = (longPct - shortPct) / 100;
  const goalKey =
    Math.abs(goalDiff) < 0.1 ? 'balanced' : goalDiff > 0 ? 'long_term' : 'short_term';
  const goalMeta = INTERP.goal_orientation[goalKey] || INTERP.goal_orientation.balanced;

  // Top Cluster & Top 5
  const rawTopCluster = report.careerClusters?.topCluster || {};
  const rawTop5 = report.careerClusters?.top5 || rawData.top5Clusters || [];

  const topClusterCode = rawTopCluster.code || rawTopCluster.clusterId || 'GOV';
  const topClusterMeta =
    CLUSTER_MAP[topClusterCode] ||
    CLUSTER_MAP[rawData.topCareerCluster] ||
    CLUSTERS[8];

  const topCluster = {
    code: topClusterCode,
    name: rawTopCluster.name || rawData.topCareerCluster || topClusterMeta.name,
    matchPercentage:
      rawTopCluster.matchPercentage || rawData.topCareerMatch || 67,
    description: rawTopCluster.description || topClusterMeta.description,
    why_fit: topClusterMeta.why_fit,
    streams_and_pathways_india: topClusterMeta.streams_and_pathways_india,
    careers: topClusterMeta.careers || [],
    fitI: rawTopCluster.fitI || 71,
    fitA: rawTopCluster.fitA || 51,
    fitP: rawTopCluster.fitP || 77,
    fitV: rawTopCluster.fitV || 74,
  };

  const top5Clusters = (rawTop5.length > 0 ? rawTop5 : [topCluster]).map(
    (item, idx) => {
      const code = item.code || item.clusterId || 'GOV';
      const meta =
        CLUSTER_MAP[code] ||
        CLUSTER_MAP[item.name || item.cluster] ||
        CLUSTERS[idx % CLUSTERS.length];
      return {
        rank: idx + 1,
        code,
        name: item.name || item.cluster || meta.name,
        matchPercentage: item.matchPercentage ?? item.match ?? 65,
        description: item.description || meta.description,
        why_fit: meta.why_fit,
        streams_and_pathways_india: meta.streams_and_pathways_india,
        careers: meta.careers || [],
        hollandCode: item.hollandCode || meta.holland_code,
        fitI: item.fitI || 70,
        fitA: item.fitA || 50,
        fitP: item.fitP || 75,
        fitV: item.fitV || 72,
      };
    }
  );

  // Fit Composition breakdown for #1 match
  const fitItems = [
    { label: 'Interests', value: 0.35 * topCluster.fitI, color: CHART_COLOR.slate },
    { label: 'Aptitude', value: 0.3 * topCluster.fitA, color: CHART_COLOR.red },
    { label: 'Personality', value: 0.2 * topCluster.fitP, color: CHART_COLOR.gold },
    { label: 'Values', value: 0.15 * topCluster.fitV, color: CHART_COLOR.sage },
  ];
  const fitTotal = fitItems.reduce((a, b) => a + b.value, 0) || 1;

  // Domain 1: Interests (RIASEC)
  const interestFacets = ['R', 'I', 'A', 'S', 'E', 'C'];
  const domainInterests = domains.interests || [];
  const interestScoreMap = {};
  domainInterests.forEach((d) => {
    interestScoreMap[d.facet] = d.percentage ?? pct(d.score);
  });
  interestFacets.forEach((f) => {
    if (interestScoreMap[f] == null) {
      interestScoreMap[f] = pct(scores[f] ?? 0.6);
    }
  });
  const riItems = interestFacets.map((f) => ({
    label: f,
    value: interestScoreMap[f],
    color: INTEREST_COLOR[f],
  }));
  const riRank = [...interestFacets]
    .map((f) => [f, interestScoreMap[f]])
    .sort((a, b) => b[1] - a[1]);

  // Domain 2: Personality (OCEAN)
  const personFacets = ['O', 'Cn', 'Ex', 'Ag', 'ES'];
  const domainPerson = domains.personality || [];
  const personScoreMap = {};
  domainPerson.forEach((d) => {
    personScoreMap[d.facet] = d.percentage ?? pct(d.score);
  });
  personFacets.forEach((f) => {
    if (personScoreMap[f] == null) {
      personScoreMap[f] = pct(scores[f] ?? 0.7);
    }
  });
  const ocRank = [...personFacets]
    .map((f) => [f, personScoreMap[f]])
    .sort((a, b) => b[1] - a[1]);
  const personChartItems = ocRank.map(([f, v]) => ({
    label: INTERP.personality[f]?.name || f,
    pct: v,
    color: PERSON_COLOR[f],
  }));

  // Domain 3: Values (Schwartz)
  const valFacets = ['OC', 'SE', 'CO', 'ST'];
  const domainValues = domains.values || [];
  const valScoreMap = {};
  domainValues.forEach((d) => {
    valScoreMap[d.facet] = d.percentage ?? pct(d.score);
  });
  valFacets.forEach((f) => {
    if (valScoreMap[f] == null) {
      valScoreMap[f] = pct(scores[f] ?? 0.7);
    }
  });
  const valItems = valFacets.map((f) => ({
    label: f,
    value: valScoreMap[f],
    color: VALUES_COLOR[f],
  }));
  const valRank = [...valFacets]
    .map((f) => [f, valScoreMap[f]])
    .sort((a, b) => b[1] - a[1]);

  // Domain 4: Aptitudes
  const aptFacets = ['Log', 'Num', 'Verb', 'Voc', 'Mech', 'Spat'];
  const domainApt = domains.aptitudes || [];
  const aptScoreMap = {};
  domainApt.forEach((d) => {
    aptScoreMap[d.facet] = d.percentage ?? pct(d.score);
  });
  aptFacets.forEach((f) => {
    if (aptScoreMap[f] == null) {
      aptScoreMap[f] = pct(scores[f] ?? 0.5);
    }
  });
  const aptRank = [...aptFacets]
    .map((f) => [f, aptScoreMap[f]])
    .sort((a, b) => b[1] - a[1]);
  const aptChartItems = aptRank.map(([f, v]) => ({
    label: f,
    pct: v,
    color: bandColorHex(v),
  }));

  // Domain 5: Learning Styles (VARK)
  const varkFacets = ['V', 'A', 'Rd', 'K'];
  const domainVark = domains.learningStyles || [];
  const varkScoreMap = {};
  domainVark.forEach((d) => {
    varkScoreMap[d.facet] = d.percentage ?? pct(d.score);
  });
  varkFacets.forEach((f) => {
    if (varkScoreMap[f] == null) {
      varkScoreMap[f] = pct(scores.vark?.[f] ?? scores[f] ?? 0.7);
    }
  });
  const varkChartItems = varkFacets.map((f) => ({
    label: f,
    pct: varkScoreMap[f],
  }));
  const varkRank = [...varkFacets]
    .map((f) => [f, varkScoreMap[f]])
    .sort((a, b) => b[1] - a[1]);
  const varkGap = varkRank[0][1] - varkRank[1][1];
  const varkMulti = varkGap < 8;
  const varkName = (f) => INTERP.learning_style[f]?.name || f;
  const learnLabel = varkMulti
    ? `${varkName(varkRank[0][0])} + ${varkName(varkRank[1][0])} (multimodal)`
    : varkName(varkRank[0][0]);
  const tipFacets = varkMulti ? [varkRank[0][0], varkRank[1][0]] : [varkRank[0][0]];
  const tips = tipFacets.flatMap((f) => INTERP.learning_style[f]?.tips || []);

  // Roadmap Stops based on Goal Orientation
  const roadStops = [
    { b: 'Class 8–10', s: 'Build basics', k: 'base' },
    { b: 'Stream choice', s: 'Class 11 onward', k: 'stream' },
    { b: 'Entrance prep', s: 'If required', k: 'entrance' },
    { b: 'Degree / course', s: 'College years', k: 'degree' },
    { b: 'Internship', s: 'Real experience', k: 'intern' },
    { b: 'Career', s: 'Your destination', k: 'career' },
  ];
  const hiSet = {
    long_term: ['stream', 'entrance', 'degree'],
    short_term: ['stream', 'intern', 'career'],
    balanced: ['stream', 'degree', 'intern'],
  }[goalKey] || ['stream', 'degree', 'intern'];

  // Summary Passport Narrative
  const top1 = top5Clusters[0] || topCluster;
  const topValue = INTERP.values[valRank[0][0]]?.name || 'Self-Enhancement';
  const topTrait = INTERP.personality[ocRank[0][0]]?.name || 'Conscientiousness';
  const topApt1 = INTERP.aptitude[aptRank[0][0]]?.name || 'Mechanical Reasoning';
  const topApt2 = INTERP.aptitude[aptRank[1][0]]?.name || 'Logical Reasoning';

  const narrative = `${studentName} shows a ${hollandCode} interest pattern, which combined with ${topTrait.toLowerCase()} and a strong pull toward ${topValue.toLowerCase()} points most clearly toward ${top1.name} (${top1.matchPercentage}% match). Aptitude-wise, ${studentName}'s strongest results are in ${topApt1} and ${topApt2}, which support that direction. As a ${learnLabel.toLowerCase()} learner with a ${goalMeta.name.toLowerCase()} approach to the path ahead, the study tips and route in Section 3 are the most relevant starting point.`;

  async function handleShare() {
    try {
      const shareMessage = `Career Compass Report for ${studentName}\n` +
        `Holland Code: ${hollandCode}\n` +
        `Top Career Cluster: ${top1.name} (${top1.matchPercentage}% match)\n` +
        `Top Trait: ${topTrait}\n` +
        `Top Value: ${topValue}\n` +
        `Learning Style: ${learnLabel}\n\n` +
        `${narrative}`;

      await Share.share({
        title: `Career Compass Report - ${studentName}`,
        message: shareMessage,
      });
    } catch (err) {
      console.warn('Share error:', err?.message);
    }
  }

  function handleDownloadJSON() {
    const payload = {
      student: { name: studentName, class: studentClass, school: studentSchool },
      completedAt: completedDate,
      hollandCode,
      topCluster,
      top5Clusters,
      scores,
      domains,
    };
    Alert.alert('Report Data JSON', JSON.stringify(payload, null, 2).slice(0, 400) + '...');
  }

  function scrollToLeg(key) {
    setActiveLeg(key);
    const yOffset = legRefs.current[key] || 0;
    scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
  }

  const cardBg = darkMode ? '#121214' : '#ffffff';
  const borderColor = darkMode ? '#222226' : '#e8dfda';
  const textColor = darkMode ? '#ffffff' : '#211b19';
  const subtextColor = darkMode ? '#a09895' : '#655753';

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#070709' : '#f2f4f6', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9c2a1f" />
        <Text style={{ color: textColor, fontSize: 17, fontWeight: '800', marginTop: 14 }}>
          Generating Career Compass Report...
        </Text>
        <Text style={{ color: subtextColor, fontSize: 12, marginTop: 4 }}>
          Synthesizing RIASEC, OCEAN, Schwartz Values, Aptitude, and Goals
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#070709' : '#f2f4f6' }}>
      {/* Sticky Topbar */}
      <View
        style={{
          backgroundColor: cardBg,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.replace('/(drawer)/(tabs)/assessment')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: darkMode ? '#1c1c20' : '#f1f5f9',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 12,
            gap: 4,
          }}
        >
          <Ionicons name="arrow-back" size={14} color={textColor} />
          <Text style={{ color: textColor, fontSize: 11, fontWeight: '700' }}>Assessments</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleShare}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#9a2119',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              gap: 5,
            }}
          >
            <Ionicons name="share-social-outline" size={13} color="#ffffff" />
            <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '800' }}>Share / PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sticky Section Anchor Tabs */}
      <View
        style={{
          backgroundColor: cardBg,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {[
            { id: 'leg1', label: '1 · Clusters' },
            { id: 'leg2', label: '2 · Your Profile' },
            { id: 'leg3', label: '3 · Direction' },
            { id: 'leg4', label: '4 · Summary' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => scrollToLeg(tab.id)}
              style={{
                backgroundColor: activeLeg === tab.id ? '#9a2119' : (darkMode ? '#1c1c20' : '#f1f5f9'),
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: activeLeg === tab.id ? '#ffffff' : subtextColor,
                  fontSize: 11,
                  fontWeight: '800',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 60, paddingTop: 14 }}
      >
        {/* Report Header */}
        <View style={{ marginBottom: 18 }}>
          <Text style={{ color: '#9a2119', fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>
            CAREER COMPASS · FINAL REPORT
          </Text>
          <Text style={{ color: textColor, fontSize: 24, fontWeight: '900', marginTop: 3 }}>
            {studentName}&apos;s Career Map
          </Text>
          <Text style={{ color: subtextColor, fontSize: 12, marginTop: 4 }}>
            {studentClass}
            {studentSchool ? ` · ${studentSchool}` : ''} · Completed{' '}
            {new Date(completedDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* ============================================================
            LEG 1: Career Clusters Suited to You
        ============================================================ */}
        <View
          onLayout={(event) => {
            legRefs.current.leg1 = event.nativeEvent.layout.y;
          }}
          style={{ marginBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#9a2119' }} />
            <Text style={{ color: '#9a2119', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
              SECTION 1 OF 4
            </Text>
          </View>
          <Text style={{ color: textColor, fontSize: 19, fontWeight: '900' }}>
            Career Clusters Suited to You
          </Text>
          <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
            Your top 5 matches out of 18 career clusters and 360+ careers, ranked by how closely they fit your interests, aptitude, personality, and values.
          </Text>

          {/* Holland Strip */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor,
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {hollandCode.split('').slice(0, 3).map((L, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: '#9a2119',
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '900' }}>
                    {L}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{ flex: 1, color: textColor, fontSize: 12, lineHeight: 17 }}>
              Your <Text style={{ fontWeight: '800' }}>Holland Code: {hollandCode}</Text> — your three strongest interest types, used worldwide to describe career fit.
            </Text>
          </View>

          {/* Top 5 Clusters Cards */}
          <View style={{ marginTop: 14, gap: 14 }}>
            {top5Clusters.map((cluster) => {
              const careers = cluster.careers || [];
              const isExpanded = Boolean(expandedClusters[cluster.code]);
              const shownCareers = isExpanded ? careers : careers.slice(0, 10);
              const isSem =
                cluster.code === 'SEM' || cluster.name.includes('Science, Engineering');

              return (
                <View
                  key={cluster.code}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 18,
                    padding: 16,
                    borderWidth: 1,
                    borderColor,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: darkMode ? 0 : 0.04,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                      <View
                        style={{
                          backgroundColor: '#fee2e2',
                          width: 24,
                          height: 24,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#9a2119', fontSize: 12, fontWeight: '900' }}>
                          {cluster.rank}
                        </Text>
                      </View>
                      <Text style={{ color: textColor, fontSize: 15, fontWeight: '800', flex: 1 }}>
                        {cluster.name}
                      </Text>
                    </View>
                    <Text style={{ color: '#9a2119', fontSize: 16, fontWeight: '900' }}>
                      {cluster.matchPercentage}%
                    </Text>
                  </View>

                  {/* Match Bar */}
                  <View
                    style={{
                      height: 6,
                      backgroundColor: darkMode ? '#222226' : '#e2e8f0',
                      borderRadius: 3,
                      marginTop: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: '100%',
                        width: `${cluster.matchPercentage}%`,
                        backgroundColor: '#9a2119',
                        borderRadius: 3,
                      }}
                    />
                  </View>

                  <Text style={{ color: textColor, fontSize: 12, lineHeight: 18, marginTop: 10 }}>
                    {cluster.description}
                  </Text>

                  {cluster.why_fit ? (
                    <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 17, marginTop: 8 }}>
                      <Text style={{ fontWeight: '700', color: textColor }}>Why it suits you: </Text>
                      {cluster.why_fit}
                    </Text>
                  ) : null}

                  {cluster.streams_and_pathways_india ? (
                    <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 17, marginTop: 8 }}>
                      <Text style={{ fontWeight: '700', color: textColor }}>Pathway in India: </Text>
                      {cluster.streams_and_pathways_india}
                    </Text>
                  ) : null}

                  {/* Career Chips */}
                  {shownCareers.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                      {shownCareers.map((c, ci) => (
                        <View
                          key={ci}
                          style={{
                            backgroundColor: darkMode ? '#1c1c20' : '#f1f5f9',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 8,
                          }}
                        >
                          <Text style={{ color: textColor, fontSize: 11, fontWeight: '600' }}>
                            {c}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {careers.length > 10 && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        setExpandedClusters((prev) => ({
                          ...prev,
                          [cluster.code]: !prev[cluster.code],
                        }))
                      }
                      style={{ marginTop: 10 }}
                    >
                      <Text style={{ color: '#9a2119', fontSize: 11, fontWeight: '800' }}>
                        {isExpanded
                          ? 'Show fewer careers'
                          : `+ ${careers.length - 10} more careers in this cluster`}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* SEM sub-clusters */}
                  {isSem && (
                    <View
                      style={{
                        backgroundColor: darkMode ? '#18181c' : '#f8fafc',
                        borderRadius: 14,
                        padding: 12,
                        marginTop: 12,
                        borderWidth: 1,
                        borderColor,
                      }}
                    >
                      <Text style={{ color: textColor, fontSize: 12, fontWeight: '800', marginBottom: 8 }}>
                        Top Science & Engineering Fields:
                      </Text>
                      {SEM_SUB.slice(0, 3).map((sub, si) => (
                        <View key={sub.sub_id} style={{ marginBottom: 6 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: textColor, fontSize: 11, fontWeight: '700' }}>
                              {si + 1}. {sub.name}
                            </Text>
                            <Text style={{ color: '#9a2119', fontSize: 11, fontWeight: '800' }}>
                              {cluster.matchPercentage - si * 2}%
                            </Text>
                          </View>
                          <Text style={{ color: subtextColor, fontSize: 10, marginTop: 2 }}>
                            {sub.signature} Ex: {sub.careers_hint}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Fit Composition Card */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 16,
            }}
          >
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '800' }}>
              What&apos;s Driving Your #1 Match
            </Text>
            <Text style={{ color: subtextColor, fontSize: 12, marginTop: 2 }}>
              {topCluster.name} — {topCluster.matchPercentage}% overall match, built from four parts of your profile.
            </Text>

            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <DonutChart items={fitItems} size={160} thickness={24} />
            </View>

            <View style={{ marginTop: 14, gap: 8 }}>
              {fitItems.map((it) => (
                <View
                  key={it.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: it.color,
                      }}
                    />
                    <Text style={{ color: textColor, fontSize: 12, fontWeight: '600' }}>
                      {it.label}
                    </Text>
                  </View>
                  <Text style={{ color: textColor, fontSize: 12, fontWeight: '800' }}>
                    {Math.round((it.value / fitTotal) * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ============================================================
            LEG 2: Your Profile, In Detail (6 Domains + Charts)
        ============================================================ */}
        <View
          onLayout={(event) => {
            legRefs.current.leg2 = event.nativeEvent.layout.y;
          }}
          style={{ marginBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#9a2119' }} />
            <Text style={{ color: '#9a2119', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
              SECTION 2 OF 4
            </Text>
          </View>
          <Text style={{ color: textColor, fontSize: 19, fontWeight: '900' }}>
            Your Profile, In Detail
          </Text>
          <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
            Six results from the assessment, each with its own native chart. Bands (developing / moderate / high) describe relative standing.
          </Text>

          {/* 1. Interests (RIASEC) */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '800' }}>
              Interests · RIASEC
            </Text>
            <Text style={{ color: subtextColor, fontSize: 11, marginTop: 2 }}>
              These six types describe what activities energise you — together they form your Holland Code.
            </Text>

            <View style={{ alignItems: 'center', marginVertical: 14 }}>
              <DonutChart items={riItems} size={160} thickness={26} />
            </View>

            <View style={{ gap: 10 }}>
              {riRank.map(([f, val]) => {
                const bd = band(val);
                const meta = INTERP.interest[f] || {};
                return (
                  <View
                    key={f}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: borderColor,
                      paddingTop: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: INTEREST_COLOR[f] }} />
                        <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                          {meta.name || f}
                        </Text>
                        <View
                          style={{
                            backgroundColor: bd === 'high' ? '#fee2e2' : bd === 'moderate' ? '#fef3c7' : '#f1f5f9',
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: bd === 'high' ? '#9a2119' : bd === 'moderate' ? '#b45309' : '#475569',
                              fontSize: 9,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                            }}
                          >
                            {bd}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: textColor, fontSize: 13, fontWeight: '800' }}>
                        {val}%
                      </Text>
                    </View>
                    <Text style={{ color: subtextColor, fontSize: 11, lineHeight: 16, marginTop: 4 }}>
                      {meta.blurbs?.[bd] || ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 2. Personality (OCEAN) */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '800' }}>
              Personality · OCEAN
            </Text>
            <Text style={{ color: subtextColor, fontSize: 11, marginTop: 2 }}>
              Five broad traits that describe how you typically think, feel, and act.
            </Text>

            <View style={{ alignItems: 'center', marginVertical: 14 }}>
              <HBarChart items={personChartItems} width={320} />
            </View>

            <View style={{ gap: 10 }}>
              {ocRank.map(([f, val]) => {
                const bd = band(val);
                const meta = INTERP.personality[f] || {};
                return (
                  <View
                    key={f}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: borderColor,
                      paddingTop: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: PERSON_COLOR[f] }} />
                        <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                          {meta.name || f}
                        </Text>
                        <View
                          style={{
                            backgroundColor: bd === 'high' ? '#fee2e2' : bd === 'moderate' ? '#fef3c7' : '#f1f5f9',
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: bd === 'high' ? '#9a2119' : bd === 'moderate' ? '#b45309' : '#475569',
                              fontSize: 9,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                            }}
                          >
                            {bd}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: textColor, fontSize: 13, fontWeight: '800' }}>
                        {val}%
                      </Text>
                    </View>
                    <Text style={{ color: subtextColor, fontSize: 11, lineHeight: 16, marginTop: 4 }}>
                      {meta.blurbs?.[bd] || ''}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={{ color: subtextColor, fontSize: 10, marginTop: 10, fontStyle: 'italic' }}>
              {INTERP.report_disclaimers.es_note}
            </Text>
          </View>

          {/* 3. Values · Schwartz Values */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '800' }}>
              What You Value · Schwartz Values
            </Text>
            <Text style={{ color: subtextColor, fontSize: 11, marginTop: 2 }}>
              What matters to you when you imagine your work and your life.
            </Text>

            <View style={{ alignItems: 'center', marginVertical: 14 }}>
              <DonutChart items={valItems} size={160} thickness={26} />
            </View>

            <View style={{ gap: 10 }}>
              {valRank.map(([f, val]) => {
                const bd = band(val);
                const meta = INTERP.values[f] || {};
                return (
                  <View
                    key={f}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: borderColor,
                      paddingTop: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: VALUES_COLOR[f] }} />
                        <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                          {meta.name || f}
                        </Text>
                        <View
                          style={{
                            backgroundColor: bd === 'high' ? '#fee2e2' : bd === 'moderate' ? '#fef3c7' : '#f1f5f9',
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: bd === 'high' ? '#9a2119' : bd === 'moderate' ? '#b45309' : '#475569',
                              fontSize: 9,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                            }}
                          >
                            {bd}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: textColor, fontSize: 13, fontWeight: '800' }}>
                        {val}%
                      </Text>
                    </View>
                    <Text style={{ color: subtextColor, fontSize: 11, lineHeight: 16, marginTop: 4 }}>
                      {meta.blurbs?.[bd] || ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 4. Aptitude */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '800' }}>
              Aptitude & Cognitive Reasoning
            </Text>
            <Text style={{ color: subtextColor, fontSize: 11, marginTop: 2 }}>
              How you performed on six kinds of reasoning — these are skills that build with practice.
            </Text>

            <View style={{ alignItems: 'center', marginVertical: 14 }}>
              <ColumnChart items={aptChartItems} width={320} height={190} />
            </View>

            <View style={{ gap: 10 }}>
              {aptRank.map(([f, val]) => {
                const bd = band(val);
                const meta = INTERP.aptitude[f] || {};
                return (
                  <View
                    key={f}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: borderColor,
                      paddingTop: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: bandColorHex(val) }} />
                        <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                          {meta.name || f}
                        </Text>
                        <View
                          style={{
                            backgroundColor: bd === 'high' ? '#fee2e2' : bd === 'moderate' ? '#fef3c7' : '#f1f5f9',
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: bd === 'high' ? '#9a2119' : bd === 'moderate' ? '#b45309' : '#475569',
                              fontSize: 9,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                            }}
                          >
                            {bd}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: textColor, fontSize: 13, fontWeight: '800' }}>
                        {val}%
                      </Text>
                    </View>
                    <Text style={{ color: subtextColor, fontSize: 11, lineHeight: 16, marginTop: 4 }}>
                      {meta.blurbs?.[bd] || ''}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={{ color: subtextColor, fontSize: 10, marginTop: 10, fontStyle: 'italic' }}>
              {INTERP.report_disclaimers.apt_note}
            </Text>
          </View>

          {/* 5. Learning Style · VARK */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '800' }}>
              Learning Style · VARK
            </Text>
            <Text style={{ color: subtextColor, fontSize: 11, marginTop: 2 }}>
              How information tends to stick best for you when you&apos;re studying.
            </Text>

            <View style={{ alignItems: 'center', marginVertical: 14 }}>
              <LineChart items={varkChartItems} width={320} height={180} color={CHART_COLOR.slate} />
            </View>

            <View style={{ gap: 10 }}>
              {varkFacets.map((f) => {
                const meta = INTERP.learning_style[f] || {};
                return (
                  <View
                    key={f}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: borderColor,
                      paddingTop: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: VARK_COLOR[f] }} />
                        <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                          {meta.name || f}
                        </Text>
                      </View>
                      <Text style={{ color: textColor, fontSize: 13, fontWeight: '800' }}>
                        {varkScoreMap[f]}%
                      </Text>
                    </View>
                    <Text style={{ color: subtextColor, fontSize: 11, lineHeight: 16, marginTop: 4 }}>
                      {meta.description || ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 6. Goal Orientation */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '800' }}>
              Goal Orientation
            </Text>
            <Text style={{ color: subtextColor, fontSize: 11, marginTop: 2 }}>
              How you&apos;re currently weighing more years of study against starting work sooner.
            </Text>

            <View style={{ alignItems: 'center', marginVertical: 14 }}>
              <TwinBars longPct={longPct} shortPct={shortPct} width={320} height={100} />
            </View>

            <View style={{ gap: 10 }}>
              <View style={{ borderTopWidth: 1, borderTopColor: borderColor, paddingTop: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                    Long-term orientation
                  </Text>
                  <Text style={{ color: '#9a2119', fontSize: 13, fontWeight: '800' }}>
                    {longPct}%
                  </Text>
                </View>
                <Text style={{ color: subtextColor, fontSize: 11, lineHeight: 16, marginTop: 3 }}>
                  Comfort with investing several more years in education before starting a career.
                </Text>
              </View>

              <View style={{ borderTopWidth: 1, borderTopColor: borderColor, paddingTop: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                    Short-term orientation
                  </Text>
                  <Text style={{ color: CHART_COLOR.slate, fontSize: 13, fontWeight: '800' }}>
                    {shortPct}%
                  </Text>
                </View>
                <Text style={{ color: subtextColor, fontSize: 11, lineHeight: 16, marginTop: 3 }}>
                  Preference for entering work or skill-based training sooner.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ============================================================
            LEG 3: Your Direction: Study & Pathway Advice
        ============================================================ */}
        <View
          onLayout={(event) => {
            legRefs.current.leg3 = event.nativeEvent.layout.y;
          }}
          style={{ marginBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#9a2119' }} />
            <Text style={{ color: '#9a2119', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
              SECTION 3 OF 4
            </Text>
          </View>
          <Text style={{ color: textColor, fontSize: 19, fontWeight: '900' }}>
            Your Direction: Study &amp; Pathway Advice
          </Text>
          <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
            Turning your learning style and goal orientation into concrete next steps.
          </Text>

          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            {/* Recap chips */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <View
                style={{
                  backgroundColor: darkMode ? '#1c1c20' : '#f1f5f9',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: subtextColor, fontSize: 11 }}>
                  Learning style: <Text style={{ fontWeight: '800', color: textColor }}>{learnLabel}</Text>
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: darkMode ? '#1c1c20' : '#f1f5f9',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: subtextColor, fontSize: 11 }}>
                  Goal orientation: <Text style={{ fontWeight: '800', color: textColor }}>{goalMeta.name}</Text>
                </Text>
              </View>
            </View>

            {/* Study Tips */}
            <Text style={{ color: textColor, fontSize: 14, fontWeight: '800' }}>
              How to study, based on how you learn
            </Text>
            <View style={{ marginTop: 8, gap: 6 }}>
              {tips.map((tip, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <Text style={{ color: '#9a2119', fontSize: 13, fontWeight: '900' }}>•</Text>
                  <Text style={{ color: textColor, fontSize: 12, lineHeight: 18, flex: 1 }}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>

            {/* Pathway approach */}
            <Text style={{ color: textColor, fontSize: 14, fontWeight: '800', marginTop: 16 }}>
              Your pathway approach
            </Text>
            <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
              {goalMeta.text}
            </Text>

            {/* 6-step Roadmap */}
            <Text style={{ color: textColor, fontSize: 14, fontWeight: '800', marginTop: 16 }}>
              A general route from where you are now
            </Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {roadStops.map((st, sIdx) => {
                const isHighlighted = hiSet.includes(st.k);
                return (
                  <View
                    key={st.k}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isHighlighted
                        ? (darkMode ? '#9a211925' : '#fee2e2')
                        : (darkMode ? '#18181c' : '#f8fafc'),
                      borderRadius: 12,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: isHighlighted ? '#9a2119' : borderColor,
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: isHighlighted ? '#9a2119' : (darkMode ? '#222226' : '#e2e8f0'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: isHighlighted ? '#ffffff' : subtextColor, fontSize: 10, fontWeight: '800' }}>
                        {sIdx + 1}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ color: textColor, fontSize: 12, fontWeight: '800' }}>
                        {st.b}
                      </Text>
                      <Text style={{ color: subtextColor, fontSize: 11 }}>
                        {st.s}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <Text style={{ color: subtextColor, fontSize: 10, marginTop: 12, fontStyle: 'italic' }}>
              Highlighted stops are where your current goal orientation matters most — this is a general route, not a fixed plan.
            </Text>
          </View>
        </View>

        {/* ============================================================
            LEG 4: Your Complete Career Map (Summary & Passport)
        ============================================================ */}
        <View
          onLayout={(event) => {
            legRefs.current.leg4 = event.nativeEvent.layout.y;
          }}
          style={{ marginBottom: 20 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#9a2119' }} />
            <Text style={{ color: '#9a2119', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
              SECTION 4 OF 4
            </Text>
          </View>
          <Text style={{ color: textColor, fontSize: 19, fontWeight: '900' }}>
            Your Complete Career Map
          </Text>
          <Text style={{ color: subtextColor, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
            Everything above, brought together into one summary.
          </Text>

          {/* Career Passport Card */}
          <LinearGradient
            colors={['#801812', '#9a2119', '#b32b21']}
            style={{
              borderRadius: 20,
              padding: 18,
              marginTop: 14,
              shadowColor: '#801812',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text style={{ color: '#fef08a', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              CAREER COMPASS · COMPREHENSIVE REPORT
            </Text>
            <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '900', marginTop: 2 }}>
              {studentName}
            </Text>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {[
                { k: 'Holland Code', v: hollandCode },
                { k: 'Top Cluster', v: top1.name },
                { k: 'Match', v: `${top1.matchPercentage}%` },
                { k: 'Top Value', v: topValue },
                { k: 'Top Trait', v: topTrait },
                { k: 'Learning Style', v: learnLabel },
                { k: 'Goal Orientation', v: goalMeta.name },
              ].map((st) => (
                <View
                  key={st.k}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    minWidth: '47%',
                    flex: 1,
                  }}
                >
                  <Text style={{ color: '#fecdd3', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
                    {st.k}
                  </Text>
                  <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '900', marginTop: 2 }}>
                    {st.v}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ color: '#ffe4e6', fontSize: 12, lineHeight: 18, marginTop: 14 }}>
              {narrative}
            </Text>
          </LinearGradient>

          {/* Actionable Next Steps */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor,
              marginTop: 14,
            }}
          >
            <Text style={{ color: textColor, fontSize: 15, fontWeight: '800' }}>
              What to do next
            </Text>
            <View style={{ marginTop: 10, gap: 8 }}>
              {[
                'Read through your top 5 clusters in Section 1 with a parent, teacher, or counsellor.',
                'Shortlist 2–3 clusters and look up their stream/subject requirements for your class.',
                'Use the study tips in Section 3 for the next exam cycle.',
                'Retake this assessment in 6–12 months — interests and skills develop as you grow.',
              ].map((step, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" style={{ marginTop: 1 }} />
                  <Text style={{ color: textColor, fontSize: 12, lineHeight: 17, flex: 1 }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ color: subtextColor, fontSize: 10, marginTop: 12, fontStyle: 'italic' }}>
              {INTERP.report_disclaimers.match_note} {INTERP.report_disclaimers.retest_note}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 10, marginTop: 16 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShare}
              style={{
                backgroundColor: '#9a2119',
                borderRadius: 14,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="share-social" size={16} color="#ffffff" />
              <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '800' }}>
                Share / Save as PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleDownloadJSON}
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor,
                borderRadius: 14,
                paddingVertical: 11,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="download-outline" size={16} color={textColor} />
              <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>
                Download Report (JSON)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/(drawer)/(tabs)/library')}
              style={{
                backgroundColor: darkMode ? '#1c1c20' : '#f1f5f9',
                borderRadius: 14,
                paddingVertical: 11,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="book-outline" size={16} color="#9a2119" />
              <Text style={{ color: '#9a2119', fontSize: 13, fontWeight: '800' }}>
                Explore Careers Library
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
