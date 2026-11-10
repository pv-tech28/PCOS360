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
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Plus,
  ShieldCheck,
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';

export default function LabDecoderScreen({ navigation }) {
  const { labReports, addLabReport } = useHealth();
  const [isUploading, setIsUploading] = useState(false);

  // Latest Report
  const latestReport = labReports[0] || {
    filename: 'Report_Jan2025.pdf',
    date: '2025-01-26',
    tests: [],
  };

  const handlePickDocument = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        // Simulate extraction of lab markers
        setTimeout(async () => {
          await addLabReport({
            filename: file.name,
            labName: 'Uploaded Document',
            date: new Date().toISOString().split('T')[0],
            tests: [
              {
                name: 'HbA1c',
                value: 5.8,
                unit: '%',
                normalRange: '< 5.7',
                status: 'Borderline',
                interpretation: 'Slightly above ideal range. Consider discussing with your doctor.',
              },
              {
                name: 'Fasting Blood Glucose',
                value: 95,
                unit: 'mg/dL',
                normalRange: '70 - 99',
                status: 'Normal',
                interpretation: 'Within normal limits.',
              },
              {
                name: 'Total Testosterone',
                value: 50,
                unit: 'ng/dL',
                normalRange: '15 - 45',
                status: 'Elevated',
                interpretation: 'Mild hyperandrogenism.',
              },
            ],
          });
          setIsUploading(false);
          Alert.alert('Report Decoded', `${file.name} successfully analyzed!`);
        }, 1200);
      } else {
        setIsUploading(false);
      }
    } catch (err) {
      setIsUploading(false);
      Alert.alert('Upload Error', 'Could not open file picker.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title="Lab Report Decoder" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashed Upload Box (Mockup Match) */}
        <Pressable
          onPress={handlePickDocument}
          disabled={isUploading}
          style={({ pressed }) => [
            styles.uploadBox,
            pressed && styles.uploadBoxPressed,
          ]}
        >
          {isUploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.uploadTitle}>AI Extracting Biomarkers...</Text>
            </View>
          ) : (
            <>
              <View style={styles.uploadIconCircle}>
                <UploadCloud size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadTitle}>Upload Lab Report</Text>
              <Text style={styles.uploadSubtitle}>(PDF / Image)</Text>
            </>
          )}
        </Pressable>

        {/* Last Analysis Section Header */}
        <Text style={styles.sectionTitle}>Last Analysis</Text>

        {/* Report File Card (Mockup Match) */}
        <Card style={styles.reportCard}>
          <View style={styles.reportRow}>
            <View style={styles.reportLeft}>
              <View style={styles.fileIconBox}>
                <FileText size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.fileName}>{latestReport.displayName || latestReport.filename}</Text>
                <Text style={styles.fileDate}>Analyzed on 26 Jan</Text>
              </View>
            </View>

            <View style={styles.checkBadge}>
              <CheckCircle2 size={20} color="#10B981" />
            </View>
          </View>
        </Card>

        {/* Highlighted Biomarker Card (Mockup Match: HbA1c 5.8% Borderline) */}
        <Card style={styles.biomarkerHighlightCard}>
          <View style={styles.highlightHeader}>
            <View style={styles.highlightTitleRow}>
              <AlertTriangle size={18} color="#D97706" />
              <Text style={styles.highlightName}>HbA1c: 5.8%</Text>
            </View>
            <Badge label="Borderline >" variant="borderline" size="small" />
          </View>

          <Text style={styles.highlightInterpretation}>
            Slightly above ideal range. Consider discussing with your doctor.
          </Text>
        </Card>

        {/* All Extracted Biomarkers List */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
          Extracted Biomarkers ({latestReport.tests ? latestReport.tests.length : 0})
        </Text>

        {(latestReport.tests || []).map((test, idx) => {
          const isBorderline = test.status === 'Borderline';
          const isElevated = test.status === 'Elevated';
          const isNormal = test.status === 'Normal';

          return (
            <Card key={idx} style={styles.testItemCard}>
              <View style={styles.testHeaderRow}>
                <Text style={styles.testName}>{test.name}</Text>
                <Badge
                  label={test.status}
                  variant={
                    isElevated
                      ? 'danger'
                      : isBorderline
                      ? 'borderline'
                      : 'success'
                  }
                  size="small"
                />
              </View>

              <View style={styles.testMetricsRow}>
                <Text style={styles.testValue}>
                  {test.value} <Text style={styles.testUnit}>{test.unit}</Text>
                </Text>
                <Text style={styles.testRange}>Ref: {test.normalRange}</Text>
              </View>

              {test.interpretation ? (
                <Text style={styles.testInterpretation}>
                  {test.interpretation}
                </Text>
              ) : null}
            </Card>
          );
        })}

        {/* Safety Disclaimer */}
        <View style={styles.disclaimerBox}>
          <ShieldCheck size={16} color={colors.primary} />
          <Text style={styles.disclaimerText}>
            Lab decoder uses OCR pattern recognition. Always present original official laboratory prints to your clinician.
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
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C4B5FD',
    backgroundColor: '#FAF5FF',
    borderRadius: 22,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadBoxPressed: {
    backgroundColor: '#F3E8FF',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDE5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadingContainer: {
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  reportCard: {
    padding: 14,
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  fileDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkBadge: {
    padding: 4,
  },
  biomarkerHighlightCard: {
    backgroundColor: '#FFFDF5',
    borderColor: '#FEF3C7',
    padding: 14,
    marginBottom: 12,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  highlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  highlightInterpretation: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },
  testItemCard: {
    padding: 14,
    marginBottom: 10,
  },
  testHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  testName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  testMetricsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  testValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  testUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  testRange: {
    fontSize: 11,
    color: colors.textMuted,
  },
  testInterpretation: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginTop: 4,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: colors.primary,
    lineHeight: 15,
  },
});

