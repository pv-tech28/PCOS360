import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ClipboardList,
  CheckCircle2,
  Download,
  Share2,
  HelpCircle,
  Stethoscope,
} from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';

export default function CopilotScreen({ navigation }) {
  const { profile, cycleData, labReports } = useHealth();
  const [isGenerating, setIsGenerating] = useState(false);

  const checklistItems = [
    'Your health summary',
    'Symptom timeline',
    'Lab report highlights',
    'Questions to ask',
  ];

  const suggestedQuestions = [
    'My latest HbA1c is 5.8%. Should we conduct a fasting insulin or oral glucose tolerance test (OGTT)?',
    'My cycle intervals average 35 days (luteal phase). Would cyclic progesterone support or inositol continuation be optimal?',
    'Should we schedule a follow-up pelvic ultrasound to evaluate ovarian follicular count under Rotterdam criteria?',
    'Are there specific cardiovascular lipid monitoring markers recommended for metabolic PCOS?',
  ];

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>PCOS360 Consultation Summary</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #292431; }
              h1 { color: #7950A8; margin-bottom: 4px; }
              .tagline { color: #77717F; font-size: 14px; margin-bottom: 20px; }
              .card { border: 1px solid #EFEAF4; border-radius: 12px; padding: 16px; margin-bottom: 16px; background-color: #FAF9FC; }
              .title { font-weight: bold; font-size: 16px; color: #7950A8; margin-bottom: 8px; }
              .metric { margin-bottom: 6px; font-size: 14px; }
              ul { padding-left: 20px; }
              li { margin-bottom: 8px; font-size: 13px; line-height: 1.5; }
              .badge { display: inline-block; background-color: #EDE5F7; color: #7950A8; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>PCOS360 Consultation Summary</h1>
            <div class="tagline">Prepared for Physician Visit • Patient: ${profile.name || 'Ananya Sharma'}</div>
            
            <div class="card">
              <div class="title">Patient Profile</div>
              <div class="metric"><strong>Age:</strong> ${profile.age || 23} years | <strong>Status:</strong> ${profile.pcosStatus || 'Diagnosed'} (${profile.diagnosisYear || 2023})</div>
              <div class="metric"><strong>Cycle Metrics:</strong> Day ${cycleData.currentDay || 18} of ${cycleData.totalDays || 35} (${cycleData.phase || 'Luteal Phase'})</div>
              <div class="metric"><strong>Supplements:</strong> ${(profile.medications || []).join(', ')}</div>
            </div>

            <div class="card">
              <div class="title">Latest Laboratory Highlights (Apex Diagnostics)</div>
              <ul>
                <li><strong>HbA1c:</strong> 5.8% <span class="badge">Borderline</span> (Reference: < 5.7%)</li>
                <li><strong>Fasting Blood Glucose:</strong> 96 mg/dL (Reference: 70 - 99 mg/dL)</li>
                <li><strong>Fasting Insulin:</strong> 14.2 μIU/mL (Optimal: < 10.0 μIU/mL)</li>
                <li><strong>Total Testosterone:</strong> 52 ng/dL <span class="badge">Elevated</span> (Reference: 15 - 45 ng/dL)</li>
                <li><strong>LH / FSH Ratio:</strong> 2.3:1 (Reference: 1.0 - 1.5)</li>
              </ul>
            </div>

            <div class="card">
              <div class="title">Physician Discussion Points & Questions</div>
              <ul>
                ${suggestedQuestions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
            
            <p style="font-size: 11px; color: #77717F; margin-top: 30px; text-align: center;">
              PCOS360 Healthcare Intelligence • Not a medical prescription • Consult authorized physician.
            </p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setIsGenerating(false);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Report Generated', `Saved locally to ${uri}`);
      }
    } catch (err) {
      setIsGenerating(false);
      Alert.alert('Export Error', err.message || 'Could not export consultation report.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title="Consultation Copilot" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Get a ready summary and questions for your next doctor visit
        </Text>

        {/* Central Clipboard Card (Mockup Match) */}
        <Card style={styles.clipboardCard}>
          {/* Clipboard Graphic Illustration */}
          <View style={styles.clipboardGraphic}>
            <View style={styles.clipTop} />
            <View style={styles.clipBody}>
              <View style={styles.plusCircle}>
                <Text style={styles.plusSign}>+</Text>
              </View>
            </View>
          </View>

          {/* Checklist Items */}
          <View style={styles.checklist}>
            {checklistItems.map((item, idx) => (
              <View key={idx} style={styles.checkRow}>
                <CheckCircle2 size={18} color={colors.primary} />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Action Button: Download Report (Mockup Match) */}
        <Button
          title={isGenerating ? 'Preparing PDF Report...' : 'Download Report'}
          icon={Download}
          size="large"
          loading={isGenerating}
          onPress={handleDownloadPDF}
          style={styles.downloadBtn}
        />

        {/* Suggested Questions Section */}
        <View style={styles.questionsSection}>
          <View style={styles.qHeader}>
            <HelpCircle size={18} color={colors.primary} />
            <Text style={styles.qTitle}>Evidence-Based Questions to Ask</Text>
          </View>

          {suggestedQuestions.map((q, idx) => (
            <Card key={idx} style={styles.questionCard}>
              <Text style={styles.questionNum}>Q{idx + 1}</Text>
              <Text style={styles.questionText}>{q}</Text>
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
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  clipboardCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  clipboardGraphic: {
    width: 80,
    height: 90,
    marginBottom: 20,
    alignItems: 'center',
  },
  clipTop: {
    width: 36,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EDE5F7',
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 2,
  },
  clipBody: {
    width: 74,
    height: 80,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E9D8FD',
    backgroundColor: '#FAF5FF',
    marginTop: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSign: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  checklist: {
    width: '100%',
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  downloadBtn: {
    borderRadius: 20,
    marginBottom: 24,
  },
  questionsSection: {
    marginBottom: 16,
  },
  qHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  qTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    marginBottom: 10,
  },
  questionNum: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 1,
  },
  questionText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});

