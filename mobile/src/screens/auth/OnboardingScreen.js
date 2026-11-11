import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Scale, Stethoscope, ChevronRight, Check } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';

export default function OnboardingScreen({ navigation }) {
  const { profile, authUser, updateProfile } = useHealth();

  const [age, setAge] = useState(profile.age ? String(profile.age) : '');
  const [heightCm, setHeightCm] = useState(profile.heightCm ? String(profile.heightCm) : '');
  const [weightKg, setWeightKg] = useState(profile.weightKg ? String(profile.weightKg) : '');
  const [pcosStatus, setPcosStatus] = useState(profile.pcosStatus || 'Unsure');
  const [diagnosisYear, setDiagnosisYear] = useState(
    profile.diagnosisYear ? String(profile.diagnosisYear) : String(new Date().getFullYear())
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile.age) setAge(String(profile.age));
    if (profile.heightCm) setHeightCm(String(profile.heightCm));
    if (profile.weightKg) setWeightKg(String(profile.weightKg));
    if (profile.pcosStatus) setPcosStatus(profile.pcosStatus);
    if (profile.diagnosisYear) setDiagnosisYear(String(profile.diagnosisYear));
  }, [profile]);

  // Status Picker Modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('MainTabs');
    }
  };

  const handleContinue = async () => {
    setIsSaving(true);
    const res = await updateProfile({
      fullName: profile.fullName || authUser?.full_name || '',
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      pcosStatus,
      diagnosisYear: diagnosisYear ? Number(diagnosisYear) : null,
    });
    setIsSaving(false);

    if (res?.ok) {
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Profile Not Saved', res?.error || 'Please check your metrics and connection.');
    }
  };

  const statusOptions = ['Diagnosed', 'Not diagnosed', 'Unsure'];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </Pressable>

        {/* Step Indicator: Dot 2 of 4 Active */}
        <View style={styles.stepDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tell us about you</Text>
        <Text style={styles.subtitle}>Let's set up your health profile</Text>

        {/* Form Field 1: Age */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldLeft}>
            <View style={styles.iconBox}>
              <Calendar size={18} color={colors.primary} />
            </View>
            <Text style={styles.fieldLabel}>Age</Text>
          </View>
          <View style={styles.fieldRight}>
            <TextInput
              style={styles.input}
              value={String(age)}
              onChangeText={(txt) => setAge(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.unitText}>years</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </View>
        </View>

        {/* Form Field 2: Height & Weight */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldLeft}>
            <View style={styles.iconBox}>
              <Scale size={18} color={colors.primary} />
            </View>
            <Text style={styles.fieldLabel}>Height & Weight</Text>
          </View>
          <View style={styles.fieldRight}>
            <TextInput
              style={styles.inputSmall}
              value={String(heightCm)}
              onChangeText={(txt) => setHeightCm(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={styles.unitText}>cm •</Text>
            <TextInput
              style={styles.inputSmall}
              value={String(weightKg)}
              onChangeText={(txt) => setWeightKg(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={styles.unitText}>kg</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </View>
        </View>

        {/* Form Field 3: PCOS Status */}
        <Pressable
          style={styles.fieldCard}
          onPress={() => setIsStatusModalOpen(true)}
        >
          <View style={styles.fieldLeft}>
            <View style={styles.iconBox}>
              <Stethoscope size={18} color={colors.primary} />
            </View>
            <Text style={styles.fieldLabel}>PCOS Status</Text>
          </View>
          <View style={styles.fieldRight}>
            <Badge label={pcosStatus} variant="primary" size="medium" />
            <ChevronRight size={18} color={colors.textMuted} />
          </View>
        </Pressable>

        {/* Form Field 4: Diagnosis Year */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldLeft}>
            <View style={styles.iconBox}>
              <Calendar size={18} color={colors.primary} />
            </View>
            <Text style={styles.fieldLabel}>Diagnosis Year</Text>
          </View>
          <View style={styles.fieldRight}>
            <TextInput
              style={[styles.input, { width: 50 }]}
              value={String(diagnosisYear)}
              onChangeText={(txt) => setDiagnosisYear(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={4}
            />
            <ChevronRight size={18} color={colors.textMuted} />
          </View>
        </View>

        {/* Medical Context Card */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Why we need this</Text>
          <Text style={styles.infoText}>
            Your age, physical metrics, and diagnostic timeline allow PCOS360's
            biomarker algorithms to tailor HOMA-IR metabolic calculations and Rotterdam criteria
            analysis precisely to your body.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <Button
          title="Save & Continue"
          size="large"
          loading={isSaving}
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>

      {/* Status Picker Modal */}
      <Modal
        visible={isStatusModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsStatusModalOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsStatusModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select PCOS Status</Text>
            {statusOptions.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  setPcosStatus(opt);
                  setIsStatusModalOpen(false);
                }}
                style={styles.modalOption}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    pcosStatus === opt && styles.modalOptionTextActive,
                  ]}
                >
                  {opt}
                </Text>
                {pcosStatus === opt && (
                  <Check size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2D9EC',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  fieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  fieldRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  input: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  inputSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
    minWidth: 32,
  },
  unitText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoBanner: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D8FD',
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  continueButton: {
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

