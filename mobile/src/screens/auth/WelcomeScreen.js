import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import colors from '../../theme/colors';
import Button from '../../components/common/Button';
import { useHealth } from '../../context/HealthContext';

export default function WelcomeScreen({ navigation }) {
  const { enterDemoMode } = useHealth();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Butterfly & Logo */}
        <View style={styles.brandContainer}>
          <View style={styles.butterflyIcon}>
            <View style={[styles.wing, styles.leftWing]} />
            <View style={[styles.wing, styles.rightWing]} />
          </View>
          <Text style={styles.brandTitle}>PCOS360</Text>
          <Text style={styles.tagline}>Beyond Symptoms</Text>
          <Text style={styles.subtitle}>
            Your AI-powered companion for understanding, managing and exploring PCOS.
          </Text>
        </View>

        {/* Central Illustration Art */}
        <View style={styles.illustrationArea}>
          {/* Decorative floral circles */}
          <View style={styles.glowCircleLarge} />
          <View style={styles.glowCircleMedium} />
          <View style={styles.glowCircleSmall} />

          {/* Stylized Silhouette Avatar Graphic */}
          <View style={styles.avatarCard}>
            <View style={styles.hairGraphic} />
            <View style={styles.faceGraphic} />
            <View style={styles.flowerAccents}>
              <View style={[styles.petal, { top: 0, left: 10 }]} />
              <View style={[styles.petal, { top: 8, left: 24 }]} />
              <View style={[styles.petal, { top: 20, left: 8 }]} />
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomArea}>
          <Button
            title="Sign In / Create Account"
            icon={ArrowRight}
            iconPosition="right"
            size="large"
            onPress={() => navigation.navigate('Auth', { mode: 'login' })}
            style={styles.getStartedButton}
          />

          <Pressable
            onPress={enterDemoMode}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Try Sample Demo (Local Preview Only)</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  butterflyIcon: {
    width: 38,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  wing: {
    width: 14,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  leftWing: {
    transform: [{ rotate: '-25deg' }],
    marginRight: -2,
  },
  rightWing: {
    transform: [{ rotate: '25deg' }],
    marginLeft: -2,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 260,
  },
  glowCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(237, 229, 247, 0.6)',
  },
  glowCircleMedium: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(232, 184, 208, 0.35)',
  },
  glowCircleSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(121, 80, 168, 0.12)',
  },
  avatarCard: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#EDE5F7',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 4,
  },
  hairGraphic: {
    width: 110,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#292431',
    position: 'absolute',
    top: 15,
  },
  faceGraphic: {
    width: 60,
    height: 75,
    borderRadius: 30,
    backgroundColor: '#F7D0BA',
    position: 'absolute',
    top: 45,
  },
  flowerAccents: {
    position: 'absolute',
    top: 25,
    left: 20,
    width: 40,
    height: 40,
  },
  petal: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  bottomArea: {
    gap: 12,
    marginBottom: 16,
  },
  getStartedButton: {
    borderRadius: 24,
    paddingVertical: 16,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});

