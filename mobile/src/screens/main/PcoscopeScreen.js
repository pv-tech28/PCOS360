import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lightbulb, ChevronRight, TrendingUp, Sparkles, AlertCircle } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import SegmentedControl from '../../components/common/SegmentedControl';
import SymptomAreaChart from '../../components/charts/SymptomAreaChart';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';
import { initialCorrelations } from '../../data/initialData';

export default function PcoscopeScreen({ navigation }) {
  const { symptomTrends, insights } = useHealth();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Correlations', 'Trends'];

  // 3-Month Symptom Trend Data for Area Chart (Oct, Nov, Dec)
  const last3MonthsData = [
    { label: 'Oct', value: 2.2 },
    { label: 'Nov', value: 4.1 },
    { label: 'Dec', value: 3.6 },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        showBack
        title="PCOSCOPE"
        subtitle="Pattern Insights"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Segmented Tab Bar (Mockup Match) */}
        <SegmentedControl
          segments={tabs}
          activeSegment={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'Overview' && (
          <>
            {/* Key Insights Card (Mockup Match) */}
            <Card style={styles.insightsCard}>
              <View style={styles.insightsHeader}>
                <View style={styles.lightbulbIcon}>
                  <Lightbulb size={18} color="#D97706" />
                </View>
                <Text style={styles.cardHeading}>Key Insights</Text>
              </View>

              {/* Bullet 1 */}
              <Pressable
                onPress={() => setActiveTab('Correlations')}
                style={({ pressed }) => [
                  styles.insightRow,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.bulletDot} />
                <Text style={styles.insightText}>
                  Lower sleep (<Text style={styles.boldText}>&lt;6 hrs</Text>) is often linked with higher fatigue.
                </Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </Pressable>

              <View style={styles.divider} />

              {/* Bullet 2 */}
              <Pressable
                onPress={() => setActiveTab('Correlations')}
                style={({ pressed }) => [
                  styles.insightRow,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.bulletDot} />
                <Text style={styles.insightText}>
                  Stress spikes coincide with longer cycle length.
                </Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </Pressable>
            </Card>

            {/* Symptom Trend (Last 3 Months) Card (Mockup Match) */}
            <Card style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.cardHeading}>Symptom Trend (Last 3 Months)</Text>
                <Badge label="Dec: Moderate" variant="primary" size="small" />
              </View>

              {/* Native Area Chart */}
              <SymptomAreaChart data={last3MonthsData} height={160} />

              <View style={styles.chartFooter}>
                <Text style={styles.chartFooterText}>
                  Symptom severity peaked in November following high work stress and normalized in December.
                </Text>
              </View>
            </Card>

            {/* Quick Action to What-If Simulator */}
            <Pressable
              onPress={() => navigation.navigate('WhatIf')}
              style={({ pressed }) => [
                styles.promoCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.promoLeft}>
                <Sparkles size={18} color={colors.primary} />
                <View>
                  <Text style={styles.promoTitle}>Run What-If Simulator</Text>
                  <Text style={styles.promoSubtitle}>
                    Simulate how sleeping 7.5h or walking reduces fatigue
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.primary} />
            </Pressable>
          </>
        )}

        {activeTab === 'Correlations' && (
          <View style={styles.correlationsList}>
            <Text style={styles.tabIntroText}>
              Statistically observed lifestyle correlations computed from your daily logs:
            </Text>

            {initialCorrelations.map((corr, idx) => (
              <Card key={idx} style={styles.corrCard}>
                <View style={styles.corrHeader}>
                  <View style={styles.factorTags}>
                    <Badge label={corr.factorA} variant="secondary" size="small" />
                    <Text style={styles.corrArrow}>→</Text>
                    <Badge label={corr.factorB} variant="primary" size="small" />
                  </View>
                  <Badge
                    label={corr.strength}
                    variant={corr.strength.includes('Strong') ? 'danger' : 'warning'}
                    size="small"
                  />
                </View>

                <Text style={styles.corrDesc}>{corr.description}</Text>

                <View style={styles.recommendationBox}>
                  <Text style={styles.recTitle}>Recommended Action:</Text>
                  <Text style={styles.recText}>{corr.recommendation}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'Trends' && (
          <View style={styles.trendsList}>
            <Text style={styles.tabIntroText}>
              Historical symptom trajectory across the last 6 months:
            </Text>

            {symptomTrends.map((t, idx) => (
              <Card key={idx} style={styles.trendRowCard}>
                <View style={styles.trendMonthCol}>
                  <Text style={styles.trendMonth}>{t.month} 2024</Text>
                  <Text style={styles.trendSleep}>{t.sleepHours}h sleep avg</Text>
                </View>
                <View style={styles.metricsPills}>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricLabel}>Fatigue</Text>
                    <Text style={styles.metricVal}>{t.fatigue}/10</Text>
                  </View>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricLabel}>Acne</Text>
                    <Text style={styles.metricVal}>{t.acne}/10</Text>
                  </View>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricLabel}>Bloat</Text>
                    <Text style={styles.metricVal}>{t.bloating}/10</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  insightsCard: {
    padding: 16,
    marginBottom: 14,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  lightbulbIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  chartCard: {
    padding: 16,
    marginBottom: 14,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartFooter: {
    backgroundColor: '#FAF5FF',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  chartFooterText: {
    fontSize: 11,
    color: colors.primary,
    lineHeight: 15,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D8FD',
    marginBottom: 16,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  promoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  promoSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  tabIntroText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  correlationsList: {
    gap: 12,
  },
  corrCard: {
    padding: 16,
  },
  corrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  factorTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  corrArrow: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '700',
  },
  corrDesc: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 10,
  },
  recommendationBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  recTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  recText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  trendsList: {
    gap: 10,
  },
  trendRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  trendMonthCol: {
    width: 90,
  },
  trendMonth: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trendSleep: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsPills: {
    flexDirection: 'row',
    gap: 8,
  },
  metricPill: {
    backgroundColor: '#FAF7FD',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});

