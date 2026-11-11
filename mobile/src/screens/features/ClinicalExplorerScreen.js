import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Microscope, Check, AlertCircle, Info, ChevronRight } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EthicalDisclaimer from '../../components/common/EthicalDisclaimer';
import PhenotypeRadarChart from '../../components/charts/PhenotypeRadarChart';
import {
  rotterdamFeatures,
  phenotypesList,
  userClinicalAssessment,
} from '../../data/phenotypesData';

export default function ClinicalExplorerScreen({ navigation }) {
  const [selectedPhenotype, setSelectedPhenotype] = useState(phenotypesList[1]); // Phenotype B

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        title="Clinical Explorer"
        subtitle="Rotterdam Phenotypes & Genome"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Current Match Banner */}
        <Card style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <View style={styles.iconBox}>
              <Microscope size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.matchTitle}>Clinical Assessment Indication</Text>
              <Text style={styles.matchSubtitle}>
                {userClinicalAssessment.currentMatchIndication}
              </Text>
            </View>
          </View>
          <Text style={styles.matchRecommendation}>
            {userClinicalAssessment.recommendation}
          </Text>
        </Card>

        {/* Rotterdam Criteria Checklist */}
        <Text style={styles.sectionTitle}>Rotterdam Diagnostic Pillars (2 of 3)</Text>
        <View style={styles.pillarsList}>
          {rotterdamFeatures.map((feat) => {
            const isPresent = feat.userStatus === 'Present';
            return (
              <Card key={feat.id} style={styles.pillarCard}>
                <View style={styles.pillarHeader}>
                  <View style={styles.pillarTitleRow}>
                    <Text style={styles.pillarCode}>{feat.code}</Text>
                    <Text style={styles.pillarName}>{feat.name}</Text>
                  </View>
                  <Badge
                    label={feat.userStatus}
                    variant={isPresent ? 'danger' : 'warning'}
                    size="small"
                  />
                </View>
                <Text style={styles.pillarDesc}>{feat.description}</Text>
                <Text style={styles.pillarConfidence}>{feat.confidence}</Text>
              </Card>
            );
          })}
        </View>

        {/* Radar Chart Section */}
        <Text style={styles.sectionTitle}>Hormone & Phenotypic Fingerprint</Text>
        <Card style={styles.radarCard}>
          <Text style={styles.radarTitle}>{selectedPhenotype.name}</Text>
          <Text style={styles.radarSubtitle}>{selectedPhenotype.subtitle}</Text>

          <PhenotypeRadarChart metrics={selectedPhenotype.radarMetrics} />

          <View style={styles.phenoPillsRow}>
            {phenotypesList.map((p) => {
              const isSelected = selectedPhenotype.id === p.id;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setSelectedPhenotype(p)}
                  style={[
                    styles.phenoPill,
                    isSelected && styles.phenoPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.phenoPillText,
                      isSelected && styles.phenoPillTextActive,
                    ]}
                  >
                    Type {p.code}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.phenoDesc}>{selectedPhenotype.description}</Text>
          <View style={styles.phenoRiskBox}>
            <Text style={styles.riskLabel}>Metabolic Profile:</Text>
            <Text style={styles.riskText}>{selectedPhenotype.metabolicRisk}</Text>
          </View>
        </Card>

        {/* Ethical Safety Notice */}
        <EthicalDisclaimer text={userClinicalAssessment.ethicalNotice} />
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
  matchCard: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D8FD',
    padding: 16,
    marginBottom: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchTitle: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  matchSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  matchRecommendation: {
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
  pillarsList: {
    gap: 10,
    marginBottom: 18,
  },
  pillarCard: {
    padding: 14,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pillarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillarCode: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillarName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pillarDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  pillarConfidence: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  radarCard: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  radarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  radarSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  phenoPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  phenoPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.secondary,
  },
  phenoPillActive: {
    backgroundColor: colors.primary,
  },
  phenoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  phenoPillTextActive: {
    color: '#FFFFFF',
  },
  phenoDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginVertical: 8,
  },
  phenoRiskBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  riskLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  riskText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
});

