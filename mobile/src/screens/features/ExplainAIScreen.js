import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Sparkles, Send, ShieldCheck, ChevronRight, Brain } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useHealth } from '../../context/HealthContext';

export default function ExplainAIScreen({ navigation }) {
  const { insights } = useHealth();
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Hello Ananya! I am your PCOS360 Clinical Intelligence Assistant. Ask me anything about your Rotterdam criteria, lab markers (HbA1c 5.8%), symptom patterns, or cycle phases.",
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputVal.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputVal.toLowerCase();
    setInputVal('');

    setTimeout(() => {
      let replyText =
        "Based on clinical guidelines (Monash 2023), keeping a steady carbohydrate-to-protein ratio and aiming for 7.5 hours of sleep helps stabilize both fasting insulin and luteinizing hormone pulsatility.";

      if (query.includes('hba1c') || query.includes('sugar') || query.includes('glucose')) {
        replyText =
          "Your latest HbA1c is 5.8%, placing it in the mild borderline category (<5.7% is optimal). Combining resistance training with inositol supplementation is clinically shown to improve peripheral GLUT4 glucose uptake.";
      } else if (query.includes('pregnant') || query.includes('fertility')) {
        replyText =
          "PCOS is a condition of irregular ovulation (subfertility), not permanent sterility. Most women conceive naturally or with first-line medical support like letrozole or lifestyle pacing.";
      } else if (query.includes('sleep') || query.includes('fatigue')) {
        replyText =
          "Your logs reveal a +0.78 correlation between under 6.5h sleep and next-day afternoon fatigue spikes. Aim for a consistent 10:30 PM wind-down routine.";
      }

      const botReply = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        title="AI Assistant & Insights"
        subtitle="Transparent Clinical Guidance"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transparent AI Insights Cards */}
        <Text style={styles.sectionTitle}>Synthesized Health Intelligence</Text>

        {insights.map((ins) => (
          <Card key={ins.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.badgeRow}>
                <Sparkles size={16} color={colors.primary} />
                <Badge label={ins.module} variant="secondary" size="small" />
              </View>
              <Badge label={ins.confidence} variant="success" size="small" />
            </View>

            <Text style={styles.insightTitle}>{ins.title}</Text>
            <Text style={styles.insightSummary}>{ins.summary}</Text>

            <View style={styles.evidenceBox}>
              <Text style={styles.evLabel}>Transparent Evidence Basis:</Text>
              <Text style={styles.evText}>{ins.evidence}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipLabel}>Actionable Guidance:</Text>
              <Text style={styles.tipText}>{ins.actionableTip}</Text>
            </View>
          </Card>
        ))}

        {/* Interactive Chat Conversation */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Ask PCOS360 Assistant
        </Text>

        <Card style={styles.chatCard}>
          <View style={styles.messagesList}>
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.msgBubble,
                    isUser ? styles.msgUser : styles.msgBot,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      isUser ? styles.msgTextUser : styles.msgTextBot,
                    ]}
                  >
                    {m.text}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask about your tests, symptoms or diet..."
              placeholderTextColor={colors.textMuted}
              value={inputVal}
              onChangeText={setInputVal}
            />
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                styles.sendBtn,
                pressed && styles.pressed,
              ]}
            >
              <Send size={18} color="#FFFFFF" />
            </Pressable>
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
  },
  insightCard: {
    padding: 16,
    marginBottom: 14,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  insightSummary: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  evidenceBox: {
    backgroundColor: '#FAF7FD',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  evLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  evText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tipBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  tipLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 11,
    color: colors.textPrimary,
  },
  chatCard: {
    padding: 14,
  },
  messagesList: {
    gap: 10,
    marginBottom: 14,
  },
  msgBubble: {
    maxWidth: '85%',
    borderRadius: 16,
    padding: 12,
  },
  msgUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  msgBot: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAF5FF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  msgTextBot: {
    color: colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#FAF9FC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});

