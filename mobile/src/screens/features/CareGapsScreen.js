import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, Stethoscope, ClipboardCheck, FileQuestion } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useHealth } from '../../context/HealthContext';

export default function CareGapsScreen({ navigation }) {
  const { careGaps } = useHealth();

  const handleAction = (route) => {
    switch (route) {
      case 'LabDecoder':
      case 'lab-reports':
        navigation.navigate('LabDecoder');
        break;
      case 'Copilot':
      case 'consultation-copilot':
        navigation.navigate('Copilot');
        break;
      case 'DailyLogModal':
      case 'health-tracker':
        navigation.navigate('DailyLogModal');
        break;
      case 'ClinicalExplorer':
      case 'clinical-explorer':
        navigation.navigate('ClinicalExplorer');
        break;
      default:
        navigation.navigate('MainTabs', { screen: 'HomeTab' });
        break;
    }
  };

  const getGapIcon = (cat) => {
    switch (cat) {
      case 'Metabolic':
        return AlertTriangle;
      case 'Clinical':
        return Stethoscope;
      case 'Tracking':
        return ClipboardCheck;
      default:
        return FileQuestion;
    }
  };

  const getIconColor = (cat) => {
    switch (cat) {
      case 'Metabolic':
        return '#D97706';
      case 'Clinical':
        return '#7950A8';
      case 'Tracking':
        return '#9C3A6E';
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title="Care Gap Detector" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Find what's missing in your PCOS care and stay on track
        </Text>

        {/* Action Cards (Mockup Screen 10 Match) */}
        <View style={styles.list}>
          {careGaps.map((gap) => {
            const Icon = getGapIcon(gap.category);
            const iconColor = getIconColor(gap.category);

            return (
              <Card key={gap.id} style={styles.gapCard}>
                <View style={styles.gapTop}>
                  <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
                    <Icon size={20} color={iconColor} />
                  </View>

                  <View style={styles.gapContent}>
                    <Text style={styles.gapTitle}>{gap.title}</Text>
                    <Text style={styles.gapDesc}>{gap.description}</Text>
                  </View>
                </View>

                <View style={styles.gapFooter}>
                  <Text style={styles.dueText}>{gap.dueText}</Text>
                  <Button
                    title={gap.actionLabel}
                    size="small"
                    onPress={() => handleAction(gap.route)}
                    style={styles.actionBtn}
                  />
                </View>
              </Card>
            );
          })}
        </View>

        {/* Clinical Guidelines Note */}
        <View style={styles.guidelinesBox}>
          <Text style={styles.gTitle}>International Guidelines (Monash 2023)</Text>
          <Text style={styles.gText}>
            Regular clinical tracking, biannual metabolic screenings, and proactive consultation
            reduce the long-term risk of cardiovascular and metabolic progression by up to 55%.
          </Text>
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
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  list: {
    gap: 12,
    marginBottom: 20,
  },
  gapCard: {
    padding: 16,
  },
  gapTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  gapContent: {
    flex: 1,
  },
  gapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  gapDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  gapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  dueText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  guidelinesBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  gTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  gText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

