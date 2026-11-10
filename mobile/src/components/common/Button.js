import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isPrimary = variant === 'primary';

  const getBackgroundColor = (pressed) => {
    if (disabled) return '#E8E4ED';
    if (isPrimary) return pressed ? colors.primaryDark : colors.primary;
    if (isSecondary) return pressed ? '#E1D5EF' : colors.secondary;
    if (isOutline || isGhost) return pressed ? 'rgba(121, 80, 168, 0.08)' : 'transparent';
    return colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (isPrimary) return '#FFFFFF';
    return colors.primary;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        size === 'small' && styles.buttonSmall,
        size === 'large' && styles.buttonLarge,
        isOutline && styles.buttonOutline,
        { backgroundColor: getBackgroundColor(pressed) },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isPrimary ? '#FFFFFF' : colors.primary} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={size === 'small' ? 16 : 18} color={getTextColor()} />
          )}
          <Text
            style={[
              styles.text,
              size === 'small' && styles.textSmall,
              size === 'large' && styles.textLarge,
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {Icon && iconPosition === 'right' && (
            <Icon size={size === 'small' ? 16 : 18} color={getTextColor()} />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  text: {
    ...typography.button,
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 16,
  },
});

