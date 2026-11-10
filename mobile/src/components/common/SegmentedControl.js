import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import colors from '../../theme/colors';

export default function SegmentedControl({
  segments,
  activeSegment,
  onChange,
  scrollable = false,
  style,
}) {
  const content = segments.map((item) => {
    const id = typeof item === 'string' ? item : item.id;
    const label = typeof item === 'string' ? item : item.label;
    const isActive = activeSegment === id;

    return (
      <Pressable
        key={id}
        onPress={() => onChange(id)}
        style={[
          styles.pill,
          isActive ? styles.pillActive : styles.pillInactive,
        ]}
      >
        <Text
          style={[
            styles.pillText,
            isActive ? styles.pillTextActive : styles.pillTextInactive,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, style]}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.secondary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  pillTextInactive: {
    color: colors.textSecondary,
  },
});

