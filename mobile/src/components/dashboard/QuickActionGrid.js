import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BarChart2, Activity, Microscope, Sparkles } from 'lucide-react-native';
import colors from '../../theme/colors';

export default function QuickActionGrid({ onSelectAction }) {
  const actions = [
    {
      id: 'pcoscope',
      title: 'PCOSCOPE',
      subtitle: 'Pattern insights',
      icon: BarChart2,
      color: '#7950A8',
      bg: '#FAF5FF',
    },
    {
      id: 'metabolic',
      title: 'Metabolic Health',
      subtitle: 'Lab & Trends',
      icon: Activity,
      color: '#9C3A6E',
      bg: '#FDF2F8',
    },
    {
      id: 'clinical',
      title: 'Clinical Explorer',
      subtitle: 'PCOS Profiles',
      icon: Microscope,
      color: '#6B46C1',
      bg: '#F5F3FF',
    },
    {
      id: 'assistant',
      title: 'AI Assistant',
      subtitle: 'Ask & Get Guidance',
      icon: Sparkles,
      color: '#B45309',
      bg: '#FFFBEB',
    },
  ];

  return (
    <View style={styles.grid}>
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Pressable
            key={act.id}
            onPress={() => onSelectAction(act.id)}
            style={({ pressed }) => [
              styles.tile,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.iconWrapper, { backgroundColor: act.bg }]}>
              <Icon size={20} color={act.color} />
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {act.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {act.subtitle}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  tile: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  pressed: {
    backgroundColor: '#FAF7FD',
    transform: [{ scale: 0.985 }],
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

