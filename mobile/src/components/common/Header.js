import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell, Menu } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
  showLogo = false,
  showBell = true,
  onMenuPress,
  onBellPress,
}) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </Pressable>
        ) : showLogo ? (
          <Pressable
            onPress={onMenuPress || (() => navigation.navigate('Settings'))}
            hitSlop={12}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Menu size={22} color={colors.textPrimary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.center}>
        {showLogo ? (
          <View style={styles.logoRow}>
            {/* Butterfly Shape Icon */}
            <View style={styles.butterflyIcon}>
              <View style={[styles.wing, styles.leftWing]} />
              <View style={[styles.wing, styles.rightWing]} />
            </View>
            <Text style={styles.logoText}>PCOS360</Text>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        )}
      </View>

      <View style={styles.right}>
        {rightAction ? (
          rightAction
        ) : showBell ? (
          <Pressable
            onPress={onBellPress || (() => navigation.navigate('CareGaps'))}
            hitSlop={12}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Bell size={20} color={colors.textPrimary} />
            <View style={styles.notificationDot} />
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 234, 244, 0.6)',
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colors.secondary,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  butterflyIcon: {
    width: 20,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wing: {
    width: 8,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.6,
    borderColor: colors.primary,
  },
  leftWing: {
    transform: [{ rotate: '-25deg' }],
    marginRight: -1,
  },
  rightWing: {
    transform: [{ rotate: '25deg' }],
    marginLeft: -1,
  },
  logoText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
});

