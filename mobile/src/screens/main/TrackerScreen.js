import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { Calendar, Plus, Sparkles, Clock, CheckCircle } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import CycleProgressCard from '../../components/dashboard/CycleProgressCard';
import { useHealth } from '../../context/HealthContext';

export default function TrackerScreen({ navigation }) {
  const { cycleData } = useHealth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Cycle & Health Tracker"
        subtitle="Menstrual Telemetry"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle Progress Card */}
        <CycleProgressCard
          currentDay={cycleData.currentDay || 18}
          totalDays={cycleData.totalDays || 35}
          phase={cycleData.phase || 'Luteal Phase'}
        />

        {/* Floating Quick Log Button */}
        <Button
          title="Log Daily Symptoms & Mood"
          icon={Plus}
          size="large"
          onPress={() => navigation.navigate('DailyLogModal')}
          style={styles.logBtn}
        />

        {/* Phase Guidance Card */}
        <Card style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Sparkles size={18} color={colors.primary} />
            <Text style={styles.phaseTitle}>{cycleData.phase}</Text>
          </View>
          <Text style={styles.phaseDesc}>{cycleData.phaseDescription}</Text>
        </Card>

        {/* Cycle Metrics Grid */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Next Period</Text>
            <Text style={styles.metricValue}>{cycleData.nextPeriodEstimated}</Text>
            <Text style={styles.metricSub}>Estimated</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Ovulation</Text>
            <Text style={styles.metricValue}>{cycleData.ovulationEstimated}</Text>
            <Text style={styles.metricSub}>Mid-Cycle</Text>
          </Card>
        </View>

        {/* Fertile Window Banner */}
        <Card style={styles.fertileBanner}>
          <View style={styles.fertileLeft}>
            <Clock size={16} color="#9C3A6E" />
            <View>
              <Text style={styles.fertileTitle}>Estimated Fertile Window</Text>
              <Text style={styles.fertileDates}>{cycleData.fertileWindow}</Text>
            </View>
          </View>
          <Badge label="Follicular" variant="accent" size="small" />
        </Card>

        {/* Cycle History Section */}
        <Text style={styles.sectionHeader}>Cycle History</Text>
        <View style={styles.historyList}>
          {(cycleData.history || []).map((h, idx) => (
            <Card key={idx} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Calendar size={18} color={colors.primary} />
                  <View>
                    <Text style={styles.historyCycle}>{h.cycle}</Text>
                    <Text style={styles.historyDays}>
                      {h.length} Days • Flow {h.flowDays} Days
                    </Text>
                  </View>
                </View>

                <Badge
                  label={h.status}
                  variant={
                    h.status === 'Regular'
                      ? 'success'
                      : h.status === 'Improving'
                      ? 'primary'
                      : 'warning'
                  }
                  size="small"
                />
              </View>
            </Card>
          ))}
        </View>
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
  logBtn: {
    borderRadius: 20,
    marginBottom: 16,
  },
  phaseCard: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D8FD',
    padding: 16,
    marginBottom: 14,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  phaseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  phaseDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    padding: 14,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  fertileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#FFF5F8',
    borderColor: '#FCE7F0',
    marginBottom: 18,
  },
  fertileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fertileTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9C3A6E',
  },
  fertileDates: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 1,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  historyList: {
    gap: 8,
  },
  historyCard: {
    padding: 14,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyCycle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  historyDays: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

