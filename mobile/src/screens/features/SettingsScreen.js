import React, { useEffect, useState } from 'react';
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
import {
  User,
  Database,
  RefreshCw,
  LogOut,
  Shield,
} from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';
import { getApiBaseUrl, isLocalOrDevUrl } from '../../services/api';

export default function SettingsScreen({ navigation }) {
  const {
    authUser,
    isAuthenticated,
    isDemoMode,
    logout,
    profile,
    dbConnected,
    checkBackendStatus,
    apiServerUrl,
    defaultApiUrl,
    updateApiUrl,
  } = useHealth();

  const [inputUrl, setInputUrl] = useState(apiServerUrl);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setInputUrl(apiServerUrl);
  }, [apiServerUrl]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    const isHealthy = await updateApiUrl(inputUrl);
    const activeUrl = getApiBaseUrl();
    setInputUrl(activeUrl);
    setIsTesting(false);
    if (isHealthy) {
      Alert.alert('Connection Successful', `Connected to PCOS360 FastAPI Backend at ${activeUrl}`);
    } else {
      const isLocal = isLocalOrDevUrl(activeUrl);
      Alert.alert(
        'Connection Failed',
        isLocal
          ? `Could not reach ${activeUrl}. Over Wi-Fi without USB, use your computer LAN IP (e.g. ${defaultApiUrl}). With USB adb reverse, use http://localhost:8000.`
          : `Could not reach cloud backend at ${activeUrl}. Verify your internet connection or allow 30 seconds for the cloud server to spin up.`
      );
    }
  };

  const handleResetDefaultUrl = async () => {
    setIsTesting(true);
    const isHealthy = await updateApiUrl(defaultApiUrl);
    setInputUrl(getApiBaseUrl());
    setIsTesting(false);
    if (isHealthy) {
      Alert.alert('Reset Complete', `Connected to default API at ${defaultApiUrl}`);
    } else {
      Alert.alert('Reset Complete', `Reset URL to ${defaultApiUrl}.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title="Settings & Account" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {(isAuthenticated || isDemoMode) && (
          <>
            <Text style={styles.sectionTitle}>
              {isDemoMode ? 'Demo Mode (Sample Data)' : 'Account & Health Profile'}
            </Text>
            <Card style={styles.card}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarBox}>
                  <User size={24} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileName}>
                    {profile.fullName || authUser?.full_name || 'Member'}
                  </Text>
                  <Text style={styles.profileDetails}>
                    {isDemoMode
                      ? 'Sample data stored locally only'
                      : authUser?.email || ''}
                    {profile.initialized
                      ? ` • ${profile.age} yrs • ${profile.heightCm} cm • ${profile.weightKg} kg`
                      : ' • Profile setup pending'}
                  </Text>
                </View>
                <Badge
                  label={isDemoMode ? 'Demo' : profile.pcosStatus}
                  variant={isDemoMode ? 'warning' : 'primary'}
                  size="small"
                />
              </View>

              <Button
                title="Edit Health Profile"
                variant="outline"
                size="small"
                onPress={() => navigation.navigate('Onboarding')}
                style={{ marginTop: 10 }}
              />

              <Button
                title={isDemoMode ? 'Exit Demo & Sign In' : 'Sign Out'}
                icon={LogOut}
                variant="secondary"
                size="small"
                onPress={logout}
                style={{ marginTop: 8 }}
              />
            </Card>
          </>
        )}

        {/* Backend & PostgreSQL Status */}
        <Text style={styles.sectionTitle}>FastAPI & PostgreSQL Backend</Text>
        <Card style={styles.card}>
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <Database size={20} color={dbConnected ? '#10B981' : '#F59E0B'} />
              <View>
                <Text style={styles.statusTitle}>PostgreSQL Database Status</Text>
                <Text style={styles.statusSub}>
                  {dbConnected ? 'Online & Synchronized' : 'Offline / Standalone Cache'}
                </Text>
              </View>
            </View>

            <Badge
              label={dbConnected ? 'Connected' : 'Offline'}
              variant={dbConnected ? 'success' : 'warning'}
              size="small"
            />
          </View>

          <View style={styles.urlInputSection}>
            <Text style={styles.inputLabel}>Backend Server URL:</Text>
            <TextInput
              style={styles.urlInput}
              value={inputUrl}
              onChangeText={setInputUrl}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="http://10.0.2.2:8000"
            />
            <Text style={styles.helperText}>
              {isLocalOrDevUrl(defaultApiUrl) ? (
                `• Physical Phone (Wi-Fi LAN): http://<PC_LAN_IP>:8000\n• Physical Phone (USB adb reverse): http://localhost:8000\n• Android Emulator: http://10.0.2.2:8000`
              ) : (
                `• Production Cloud Backend: ${defaultApiUrl}\n• Ready for any cellular/Wi-Fi network without laptop or USB.`
              )}
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <Button
                title="Test Connection"
                icon={RefreshCw}
                size="small"
                loading={isTesting}
                onPress={handleTestConnection}
                style={{ flex: 1 }}
              />
              {inputUrl !== defaultApiUrl && (
                <Button
                  title="Reset to Default"
                  variant="outline"
                  size="small"
                  disabled={isTesting}
                  onPress={handleResetDefaultUrl}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </View>
        </Card>

        {/* App Version & Architecture */}
        <Text style={styles.sectionTitle}>Application Information</Text>
        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>Native Android (React Native + Expo)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0 (Production Release)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Architecture</Text>
            <Text style={styles.infoValue}>FastAPI REST + PostgreSQL ORM</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Guidelines</Text>
            <Text style={styles.infoValue}>Monash & Rotterdam Consensus 2023</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },
  card: {
    padding: 16,
    marginBottom: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  urlInputSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  urlInput: {
    backgroundColor: '#FAF9FC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helperText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

