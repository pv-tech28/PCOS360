import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export default function CycleProgressCard({
  currentDay = 18,
  totalDays = 35,
  phase = 'Luteal Phase',
  onPressCalendar,
}) {
  const progressPercent = Math.min(100, Math.max(0, (currentDay / totalDays) * 100));

  return (
    <View style={styles.container}>
      {/* Background floral accents */}
      <View style={styles.floralDecoRight} />
      <View style={styles.floralDecoBottom} />

      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Cycle Progress</Text>
        </View>
        <Pressable
          onPress={onPressCalendar}
          hitSlop={8}
          style={({ pressed }) => [styles.calButton, pressed && styles.pressed]}
        >
          <Calendar size={18} color={colors.primary} />
        </Pressable>
      </View>

      <Text style={styles.dayText}>
        Day {currentDay} <Text style={styles.ofTotal}>of {totalDays}</Text>
      </Text>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.phaseText}>{phase}</Text>
        <Text style={styles.statusText}>{Math.round(progressPercent)}% of cycle</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF5FF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E9D8FD',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  floralDecoRight: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(232, 184, 208, 0.25)',
  },
  floralDecoBottom: {
    position: 'absolute',
    bottom: -30,
    right: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(121, 80, 168, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  calButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  dayText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  ofTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  track: {
    height: 8,
    backgroundColor: '#E9D8FD',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  statusText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

