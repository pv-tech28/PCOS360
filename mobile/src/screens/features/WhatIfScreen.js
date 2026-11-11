import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bed, Activity, Apple, ChevronRight, Check, Sparkles, TrendingUp } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function WhatIfScreen({ navigation }) {
  // Lifestyle Toggles (matching mockup)
  const [selectedChanges, setSelectedChanges] = useState({
    sleep: true,
    exercise: true,
    mealPlan: false,
  });

  const [hasSimulated, setHasSimulated] = useState(false);

  const toggleChange = (key) => {
    setSelectedChanges((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasSimulated(false);
  };

  const handleSimulate = () => {
    setHasSimulated(true);
  };

  const changesList = [
    {
      key: 'sleep',
      icon: Bed,
      title: 'Improve Sleep',
      detail: '(7–8 hrs)',
      desc: 'Consistent circadian rhythm lowers nocturnal cortisol and balances ghrelin.',
      iconColor: '#7950A8',
      iconBg: '#FAF5FF',
    },
    {
      key: 'exercise',
      icon: Activity,
      title: 'Add Regular Exercise',
      detail: '(30–45 min/day)',
      desc: 'Combination of low-impact walking and resistance training increases GLUT4 glucose receptors.',
      iconColor: '#10B981',
      iconBg: '#ECFDF5',
    },
    {
      key: 'mealPlan',
      icon: Apple,
      title: 'Balanced Meal Plan',
      detail: '(nutrient rich)',
      desc: 'Fiber + protein pairing mitigates blood sugar spikes and reduces hyperinsulinemia.',
      iconColor: '#D946EF',
      iconBg: '#FDF4FF',
    },
  ];

  // Count active levers
  const activeCount = Object.values(selectedChanges).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title="What-If Simulator" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenSubtitle}>
          See how lifestyle changes may influence your PCOS health.
        </Text>

        {/* Change Selectors (Mockup Match) */}
        <View style={styles.list}>
          {changesList.map((item) => {
            const isSelected = selectedChanges[item.key];
            const Icon = item.icon;

            return (
              <Pressable
                key={item.key}
                onPress={() => toggleChange(item.key)}
                style={({ pressed }) => [
                  styles.changeRow,
                  isSelected && styles.changeRowSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                    <Icon size={20} color={item.iconColor} />
                  </View>
                  <View>
                    <Text style={styles.changeTitle}>
                      {item.title}{' '}
                      <Text style={styles.changeDetail}>{item.detail}</Text>
                    </Text>
                    <Text style={styles.changeDesc}>{item.desc}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxActive,
                  ]}
                >
                  {isSelected && <Check size={14} color="#FFFFFF" />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Action Button: Simulate Changes (Mockup Match) */}
        <Button
          title="Simulate Changes"
          icon={Sparkles}
          size="large"
          onPress={handleSimulate}
          style={styles.simulateBtn}
        />

        {/* Projected Simulation Results */}
        {hasSimulated && (
          <Card style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleRow}>
                <TrendingUp size={18} color={colors.primary} />
                <Text style={styles.resultTitle}>
                  Projected Health Impact ({activeCount} Habit{activeCount !== 1 ? 's' : ''})
                </Text>
              </View>
              <Badge label="AI Projection" variant="primary" size="small" />
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricBig}>
                  +{activeCount * 9}%
                </Text>
                <Text style={styles.metricLabel}>Insulin Sensitivity</Text>
                <Text style={styles.metricSub}>Higher GLUT4 expression</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={[styles.metricBig, { color: '#10B981' }]}>
                  -{activeCount * 14}%
                </Text>
                <Text style={styles.metricLabel}>Fatigue Severity</Text>
                <Text style={styles.metricSub}>Reduced cortisol burden</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={[styles.metricBig, { color: '#9C3A6E' }]}>
                  +{activeCount * 11}%
                </Text>
                <Text style={styles.metricLabel}>Cycle Regularity</Text>
                <Text style={styles.metricSub}>Stabilized LH pulsatility</Text>
              </View>
            </View>

            <View style={styles.resultSummary}>
              <Text style={styles.summaryText}>
                Clinical modeling suggests that sustaining these {activeCount} habits for 8–12 weeks
                creates measurable cumulative improvements in ovulatory regularity and metabolic markers.
              </Text>
            </View>
          </Card>
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
    paddingTop: 12,
    paddingBottom: 28,
  },
  screenSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  list: {
    gap: 12,
    marginBottom: 20,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  changeRowSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FAF7FD',
  },
  pressed: {
    opacity: 0.85,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  changeDetail: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  changeDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
    paddingRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D8CEE3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  simulateBtn: {
    borderRadius: 20,
    marginBottom: 20,
  },
  resultCard: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  metricBig: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  metricSub: {
    fontSize: 9.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  resultSummary: {
    backgroundColor: '#FAF5FF',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  summaryText: {
    fontSize: 11.5,
    color: colors.primary,
    lineHeight: 16,
  },
});

