import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Activity, ShieldAlert, Heart, TrendingUp, Info } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { initialHistoricalMetabolic } from '../../data/initialData';

export default function MetabolicScreen({ navigation }) {
  // HOMA-IR calculation: (96 * 14.2) / 405 = 3.36
  const homaScore = 3.36;

  const metabolicCards = [
    {
      name: 'Fasting Blood Glucose',
      value: '96',
      unit: 'mg/dL',
      status: 'Normal',
      range: '70 - 99 mg/dL',
      note: 'Within healthy fasting reference boundary.',
    },
    {
      name: 'HbA1c (Glycated Hb)',
      value: '5.8%',
      unit: '',
      status: 'Borderline',
      range: '< 5.7%',
      note: 'Mild pre-diabetic glycemic average over 90 days.',
    },
    {
      name: 'Fasting Insulin',
      value: '14.2',
      unit: 'μIU/mL',
      status: 'Elevated',
      range: '< 10.0 μIU/mL',
      note: 'High compensatory insulin secretion by pancreas.',
    },
    {
      name: 'Triglycerides',
      value: '165',
      unit: 'mg/dL',
      status: 'Borderline',
      range: '< 150 mg/dL',
      note: 'Elevated lipid marker linked with carb processing.',
    },
    {
      name: 'HDL (Protective)',
      value: '48',
      unit: 'mg/dL',
      status: 'Borderline',
      range: '> 50 mg/dL',
      note: 'Protective cholesterol is mildly suppressed.',
    },
    {
      name: 'LDL Cholesterol',
      value: '118',
      unit: 'mg/dL',
      status: 'Borderline',
      range: '< 100 mg/dL',
      note: 'Target for metabolic PCOS is below 100 mg/dL.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        title="Metabolic Intelligence"
        subtitle="HOMA-IR & Cardiometabolic Trends"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HOMA-IR Highlight Card */}
        <Card style={styles.homaCard}>
          <View style={styles.homaHeader}>
            <View>
              <Text style={styles.homaLabel}>HOMA-IR Insulin Resistance Score</Text>
              <Text style={styles.homaFormula}>Formula: (Glucose × Insulin) / 405</Text>
            </View>
            <Badge label="Insulin Resistant (>2.0)" variant="warning" size="small" />
          </View>

          <View style={styles.homaValueRow}>
            <Text style={styles.homaNumber}>{homaScore}</Text>
            <Text style={styles.homaThreshold}>Optimal: &lt; 1.5 • Borderline: 1.5 - 2.0</Text>
          </View>

          <View style={styles.homaGauge}>
            <View style={[styles.gaugeSegment, { backgroundColor: '#10B981', flex: 1.5 }]} />
            <View style={[styles.gaugeSegment, { backgroundColor: '#F59E0B', flex: 0.5 }]} />
            <View style={[styles.gaugeSegment, { backgroundColor: '#EF4444', flex: 2 }]} />
          </View>

          <Text style={styles.homaInterpretation}>
            Your score indicates moderate insulin resistance. Cells require higher insulin levels to absorb circulating glucose, which directly triggers ovarian theca cells to overproduce androgens.
          </Text>
        </Card>

        {/* Section: Biomarkers Grid */}
        <Text style={styles.sectionTitle}>Metabolic & Lipid Panel</Text>

        <View style={styles.cardsGrid}>
          {metabolicCards.map((item, idx) => (
            <Card key={idx} style={styles.bioCard}>
              <View style={styles.bioHeader}>
                <Text style={styles.bioName} numberOfLines={1}>{item.name}</Text>
                <Badge
                  label={item.status}
                  variant={
                    item.status === 'Normal'
                      ? 'success'
                      : item.status === 'Borderline'
                      ? 'borderline'
                      : 'danger'
                  }
                  size="small"
                />
              </View>

              <Text style={styles.bioValue}>
                {item.value} <Text style={styles.bioUnit}>{item.unit}</Text>
              </Text>
              <Text style={styles.bioRange}>Target: {item.range}</Text>
              <Text style={styles.bioNote}>{item.note}</Text>
            </Card>
          ))}
        </View>

        {/* Historical Trajectory */}
        <Text style={styles.sectionTitle}>16-Month Glycemic Trajectory</Text>
        <Card style={styles.historyCard}>
          {initialHistoricalMetabolic.map((m, idx) => (
            <View key={idx} style={styles.historyItemRow}>
              <Text style={styles.historyDate}>{m.date}</Text>
              <View style={styles.historyVals}>
                <Text style={styles.histText}>Glucose: <Text style={styles.histBold}>{m.fastingGlucose}</Text></Text>
                <Text style={styles.histText}>HbA1c: <Text style={styles.histBold}>{m.hba1c}%</Text></Text>
                <Text style={styles.histText}>Trig: <Text style={styles.histBold}>{m.triglycerides}</Text></Text>
              </View>
            </View>
          ))}
        </Card>
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
  homaCard: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D8FD',
    padding: 16,
    marginBottom: 18,
  },
  homaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  homaLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  homaFormula: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  homaValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10,
  },
  homaNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  homaThreshold: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  homaGauge: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gaugeSegment: {
    height: '100%',
  },
  homaInterpretation: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  cardsGrid: {
    gap: 10,
    marginBottom: 18,
  },
  bioCard: {
    padding: 14,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bioName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  bioValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  bioUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  bioRange: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  bioNote: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  historyCard: {
    padding: 14,
    gap: 10,
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 8,
  },
  historyDate: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  historyVals: {
    flexDirection: 'row',
    gap: 12,
  },
  histText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  histBold: {
    fontWeight: '700',
    color: colors.primary,
  },
});

