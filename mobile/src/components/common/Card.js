import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import colors from '../../theme/colors';

export default function Card({ children, style, onPress, activeOpacity = 0.7 }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#292431',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.995 }],
  },
});

