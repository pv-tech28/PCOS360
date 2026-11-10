import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  Sparkles,
  FileText,
  Sliders,
  FileCheck2,
  AlertTriangle,
  PlusCircle,
  Database,
  ArrowRight,
} from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import CycleProgressCard from '../../components/dashboard/CycleProgressCard';
import QuickActionGrid from '../../components/dashboard/QuickActionGrid';
import RecentActivityList from '../../components/dashboard/RecentActivityList';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';

export default function DashboardScreen({ navigation }) {
  const {
    profile,
    cycleData,
    recentActivities,
    careGaps,
    dbConnected,
    checkBackendStatus,
  } = useHealth();

  const handleSelectQuickAction = (id) => {
    switch (id) {
      case 'pcoscope':
        navigation.navigate('Pcoscope');
        break;
      case 'metabolic':
        navigation.navigate('Metabolic');
        break;
      case 'clinical':
        navigation.navigate('ClinicalExplorer');
        break;
      case 'assistant':
        navigation.navigate('ExplainAI');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showLogo
        showBell
        onMenuPress={() => navigation.navigate('Settings')}
        onBellPress={() => navigation.navigate('CareGaps')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            Hi, {profile.name || 'Ananya'} 👋
          </Text>
          <Text style={styles.greetingSubtitle}>
            Here's your health overview
          </Text>
        </View>

        {/* Database Status Ribbon */}
        <Pressable
          onPress={checkBackendStatus}
          style={[
            styles.dbStatusBanner,
            { backgroundColor: dbConnected ? '#ECFDF5' : '#FFFBEB' },
          ]}
        >
          <Database size={13} color={dbConnected ? '#10B981' : '#F59E0B'} />
          <Text
            style={[
              styles.dbStatusText,
              { color: dbConnected ? '#065F46' : '#92400E' },
            ]}
          >
            {dbConnected
              ? 'FastAPI Backend & PostgreSQL Connected'
              : 'Offline Mode (Local Storage Active)'}
          </Text>
        </Pressable>

        {/* Cycle Progress Card (Mockup Match) */}
        <CycleProgressCard
          currentDay={cycleData.currentDay || 18}
          totalDays={cycleData.totalDays || 35}
          phase={cycleData.phase || 'Luteal Phase'}
          onPressCalendar={() => navigation.navigate('Tracker')}
        />

        {/* 2x2 Quick Action Tiles (Mockup Match) */}
        <QuickActionGrid onSelectAction={handleSelectQuickAction} />

        {/* Daily Symptom Logging Quick Bar */}
        <Pressable
          onPress={() => navigation.navigate('DailyLogModal')}
          style={({ pressed }) => [
            styles.quickLogBar,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.quickLogLeft}>
            <View style={styles.quickLogIcon}>
              <PlusCircle size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.quickLogTitle}>Log Today's Symptoms</Text>
              <Text style={styles.quickLogSubtitle}>
                Energy, mood, acne, bloating & sleep
              </Text>
            </View>
          </View>
          <Badge label="Quick Log" variant="primary" size="small" />
        </Pressable>

        {/* Feature Cards Grid (What-If, Lab Reports, Copilot, Care Gaps) */}
        <View style={styles.secondarySection}>
          <Text style={styles.sectionHeader}>Healthcare Intelligence</Text>

          <View style={styles.featureRow}>
            {/* Lab Decoder */}
            <Pressable
              onPress={() => navigation.navigate('LabDecoder')}
              style={({ pressed }) => [
                styles.featureCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#FAF5FF' }]}>
                <FileText size={18} color="#7950A8" />
              </View>
              <Text style={styles.cardTitle}>Lab Decoder</Text>
              <Text style={styles.cardSubtitle}>PDF & Biomarkers</Text>
            </Pressable>

            {/* What-If Simulator */}
            <Pressable
              onPress={() => navigation.navigate('WhatIf')}
              style={({ pressed }) => [
                styles.featureCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#FDF2F8' }]}>
                <Sliders size={18} color="#9C3A6E" />
              </View>
              <Text style={styles.cardTitle}>What-If</Text>
              <Text style={styles.cardSubtitle}>Simulate habits</Text>
            </Pressable>
          </View>

          <View style={styles.featureRow}>
            {/* Consultation Copilot */}
            <Pressable
              onPress={() => navigation.navigate('Copilot')}
              style={({ pressed }) => [
                styles.featureCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#F0FDF4' }]}>
                <FileCheck2 size={18} color="#10B981" />
              </View>
              <Text style={styles.cardTitle}>Copilot</Text>
              <Text style={styles.cardSubtitle}>Doctor visit prep</Text>
            </Pressable>

            {/* Care Gaps */}
            <Pressable
              onPress={() => navigation.navigate('CareGaps')}
              style={({ pressed }) => [
                styles.featureCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#FFFBEB' }]}>
                <AlertTriangle size={18} color="#F59E0B" />
              </View>
              <Text style={styles.cardTitle}>Care Gaps</Text>
              <Text style={styles.cardSubtitle}>
                {careGaps.length} Action items
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Activity List */}
        <RecentActivityList
          activities={recentActivities}
          onViewAll={() => navigation.navigate('Timeline')}
          onSelectActivity={(item) => {
            if (item.type === 'lab') navigation.navigate('LabDecoder');
            else if (item.type === 'copilot') navigation.navigate('Copilot');
            else navigation.navigate('Timeline');
          }}
        />
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
  greetingSection: {
    marginBottom: 12,
  },
  greetingTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dbStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  dbStatusText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  quickLogBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D8FD',
    marginBottom: 18,
    elevation: 1,
  },
  quickLogLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickLogIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLogTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  quickLogSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  secondarySection: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 1,
  },
  cardSubtitle: {
    fontSize: 10.5,
    color: colors.textSecondary,
  },
});

