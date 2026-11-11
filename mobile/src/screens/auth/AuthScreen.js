import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, User, AlertCircle, WifiOff, Settings } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useHealth } from '../../context/HealthContext';

export default function AuthScreen({ navigation, route }) {
  const initialMode = route?.params?.mode === 'register';
  const { login, register, enterDemoMode, dbConnected, apiServerUrl, lastError } = useHealth();

  const [isRegister, setIsRegister] = useState(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (isRegister) {
      if (fullName.trim().length < 2) {
        setError('Please enter your full name (at least 2 characters).');
        return;
      }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError('Password must be at least 8 characters and contain both letters and numbers.');
        return;
      }
    } else if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register({ fullName: fullName.trim(), email: trimmedEmail, password });
      } else {
        await login({ email: trimmedEmail, password });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials and server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Settings size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            {isRegister ? 'Your Private Health Space' : 'Welcome Back'}
          </Text>
          <Text style={styles.subtitle}>
            {isRegister
              ? 'Register to keep cycle logs, symptoms, and lab biomarkers isolated to your own account.'
              : 'Sign in to access your saved cycles, symptoms, and lab biomarkers.'}
          </Text>

          {!dbConnected && (
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              style={styles.offlineBanner}
            >
              <WifiOff size={16} color="#92400E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.offlineText}>
                  Backend unreachable at {apiServerUrl}
                </Text>
                <Text style={styles.offlineSub}>
                  Tap here to configure your FastAPI server URL in Settings
                </Text>
              </View>
            </Pressable>
          )}

          {(error || lastError) ? (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color="#B91C1C" />
              <Text style={styles.errorText}>{error || lastError}</Text>
            </View>
          ) : null}

          <Card style={styles.formCard}>
            {isRegister && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputRow}>
                  <User size={16} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="e.g. Priya Nair"
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputRow}>
                <Mail size={16} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Lock size={16} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={isRegister ? '8+ chars with letters & numbers' : 'Your password'}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <Button
              title={isRegister ? 'Create Account' : 'Sign In'}
              loading={loading}
              onPress={handleSubmit}
              size="large"
              style={{ marginTop: 8, borderRadius: 20 }}
            />

            <Pressable
              onPress={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              style={styles.switchModeBtn}
            >
              <Text style={styles.switchModeText}>
                {isRegister
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Create one"}
              </Text>
            </Pressable>
          </Card>

          <View style={styles.demoDivider}>
            <Text style={styles.demoHeader}>Offline Sample Preview</Text>
            <Button
              title="Explore Sample Demo (Local Only)"
              variant="secondary"
              onPress={enterDemoMode}
              style={{ borderRadius: 18 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 18,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  offlineSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '500',
  },
  formCard: {
    padding: 18,
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FAF9FC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  switchModeBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchModeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  demoDivider: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 10,
  },
  demoHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
});

