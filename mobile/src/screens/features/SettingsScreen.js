import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {
  User,
  Database,
  RefreshCw,
  Server,
  Shield,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';

export default function SettingsScreen({ navigation }) {
  const {
    profile,
    updateProfile,
    dbConnected,
    checkBackendStatus,
    apiServerUrl,
    updateApiUrl,
  } = useHealth();

  const [inputUrl, setInputUrl] = useState(apiServerUrl);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    await updateApiUrl(inputUrl);
    const isHealthy = await checkBackendStatus();
    setIsTesting(false);
    if (isHealthy) {
      Alert.alert('Connection Successful', `Connected to PCOS360 FastAPI Backend at ${inputUrl}`);
    } else {
      Alert.alert(
        'Connection Failed',
        `Could not reach ${inputUrl}. If using Android Emulator, use http://10.0.2.2:8000. If using a physical phone with Expo Go, use your computer's Wi-Fi IP (e.g. http://192.168.1.X:8000).`
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title="Settings & Integration" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Profile Card */}
        <Text style={styles.sectionTitle}>Patient Profile</Text>
        <Card style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarBox}>
              <User size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.fullName || profile.name}</Text>
              <Text style={styles.profileDetails}>
                {profile.age} yrs • {profile.heightCm} cm • {profile.weightKg} kg
              </Text>
            </View>
            <Badge label={profile.pcosStatus} variant="primary" size="small" />
          </View>

          <Button
            title="Edit Profile Data"
            variant="outline"
            size="small"
            onPress={() => navigation.navigate('Onboarding')}
            style={{ marginTop: 10 }}
          />
        </Card>

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
              • Android Emulator: http://10.0.2.2:8000{'\n'}
              • Physical Phone (Expo Go): http://&lt;PC_IP&gt;:8000
            </Text>

            <Button
              title="Test & Save Connection"
              icon={RefreshCw}
              size="small"
              loading={isTesting}
              onPress={handleTestConnection}
              style={{ marginTop: 10 }}
            />
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

