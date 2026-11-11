import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, HeartPulse, Smile, Moon } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useHealth } from '../../context/HealthContext';

export default function DailyLogModalScreen({ navigation }) {
  const { addDailyLog } = useHealth();

  const [fatigueLevel, setFatigueLevel] = useState(4);
  const [acneSeverity, setAcneSeverity] = useState(2);
  const [bloating, setBloating] = useState(2);
  const [pelvicPain, setPelvicPain] = useState(1);
  const [sleepHours, setSleepHours] = useState('7.2');
  const [mood, setMood] = useState('Calm');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = ['Calm', 'Balanced', 'Low Energy', 'Anxious', 'Irritable'];

  const handleSave = async () => {
    setIsSubmitting(true);
    const res = await addDailyLog({
      fatigueLevel,
      acneSeverity,
      bloating,
      pelvicPain,
      sleepHours: parseFloat(sleepHours) || 7,
      mood,
      notes,
    });
    setIsSubmitting(false);
    if (res?.ok) {
      Alert.alert(
        res.demo ? 'Saved Locally (Demo)' : 'Logged Successfully',
        res.demo
          ? 'Recorded in local Demo Mode only.'
          : 'Your daily symptoms and sleep log have been saved to your account.'
      );
      navigation.goBack();
    } else {
      Alert.alert('Sync Failed', res?.error || 'Could not save daily log to backend.');
    }
  };

  const renderRatingRow = (label, value, setValue, max = 5) => {
    return (
      <View style={styles.ratingSection}>
        <View style={styles.ratingLabelRow}>
          <Text style={styles.ratingLabel}>{label}</Text>
          <Text style={styles.ratingValText}>{value} / {max}</Text>
        </View>

        <View style={styles.ratingPillsRow}>
          {Array.from({ length: max }, (_, i) => i + 1).map((num) => {
            const isSelected = value === num;
            return (
              <Pressable
                key={num}
                onPress={() => setValue(num)}
                style={[
                  styles.numPill,
                  isSelected && styles.numPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.numPillText,
                    isSelected && styles.numPillTextActive,
                  ]}
                >
                  {num}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Log Daily Symptoms</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.closeBtn}
        >
          <X size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          {renderRatingRow('Fatigue Level', fatigueLevel, setFatigueLevel, 10)}
          {renderRatingRow('Acne Severity', acneSeverity, setAcneSeverity, 5)}
          {renderRatingRow('Bloating Level', bloating, setBloating, 5)}
          {renderRatingRow('Pelvic Pain', pelvicPain, setPelvicPain, 5)}

          {/* Sleep Hours */}
          <View style={styles.sleepSection}>
            <Text style={styles.ratingLabel}>Sleep Duration (Hours):</Text>
            <View style={styles.sleepInputRow}>
              <Moon size={18} color={colors.primary} />
              <TextInput
                style={styles.sleepInput}
                value={sleepHours}
                onChangeText={setSleepHours}
                keyboardType="numeric"
                maxLength={4}
              />
              <Text style={styles.hoursText}>hours</Text>
            </View>
          </View>

          {/* Mood Selector */}
          <View style={styles.moodSection}>
            <Text style={styles.ratingLabel}>Today's Mood:</Text>
            <View style={styles.moodPills}>
              {moodOptions.map((opt) => {
                const isSelected = mood === opt;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => setMood(opt)}
                    style={[
                      styles.moodPill,
                      isSelected && styles.moodPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.moodText,
                        isSelected && styles.moodTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.notesSection}>
            <Text style={styles.ratingLabel}>Personal Notes (Optional):</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="E.g., high work deadline, ate late dinner..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </Card>

        <Button
          title="Save Daily Log"
          size="large"
          loading={isSubmitting}
          onPress={handleSave}
          style={styles.saveBtn}
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  card: {
    padding: 16,
    marginBottom: 20,
  },
  ratingSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 14,
  },
  ratingLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ratingValText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  ratingPillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  numPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numPillActive: {
    backgroundColor: colors.primary,
  },
  numPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  numPillTextActive: {
    color: '#FFFFFF',
  },
  sleepSection: {
    marginBottom: 16,
  },
  sleepInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sleepInput: {
    width: 60,
    backgroundColor: '#FAF9FC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
  },
  hoursText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  moodSection: {
    marginBottom: 16,
  },
  moodPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  moodPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.secondary,
  },
  moodPillActive: {
    backgroundColor: colors.primary,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  moodTextActive: {
    color: '#FFFFFF',
  },
  notesSection: {
    marginTop: 4,
  },
  notesInput: {
    backgroundColor: '#FAF9FC',
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    textAlignVertical: 'top',
  },
  saveBtn: {
    borderRadius: 20,
  },
});

