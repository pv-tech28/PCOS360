import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { FileText, Calendar, Activity, Pill, Stethoscope } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import SegmentedControl from '../../components/common/SegmentedControl';
import { useHealth } from '../../context/HealthContext';

export default function TimelineScreen({ navigation }) {
  const { timeline } = useHealth();
  const [activeFilter, setActiveFilter] = useState('All');

  const filterPills = ['All', 'Symptoms', 'Cycle', 'Lab'];

  const filteredTimeline = timeline.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Symptoms') return item.category === 'symptom';
    if (activeFilter === 'Cycle') return item.category === 'cycle';
    if (activeFilter === 'Lab') return item.category === 'lab';
    return true;
  });

  const getTimelineIcon = (cat) => {
    switch (cat) {
      case 'lab':
        return FileText;
      case 'cycle':
        return Calendar;
      case 'symptom':
        return Activity;
      case 'lifestyle':
        return Pill;
      default:
        return Stethoscope;
    }
  };

  const getTimelineIconColor = (cat) => {
    switch (cat) {
      case 'lab':
        return '#9333EA';
      case 'cycle':
        return '#EC4899';
      case 'symptom':
        return '#F59E0B';
      case 'lifestyle':
        return '#10B981';
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack title="My Health Timeline" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Pills (Mockup Screen 9 Match) */}
        <SegmentedControl
          segments={filterPills}
          activeSegment={activeFilter}
          onChange={setActiveFilter}
        />

        {/* Vertical Timeline Tree */}
        <View style={styles.timelineList}>
          {filteredTimeline.map((item, idx) => {
            const Icon = getTimelineIcon(item.category);
            const iconColor = getTimelineIconColor(item.category);
            const isLast = idx === filteredTimeline.length - 1;

            return (
              <View key={item.id} style={styles.timelineRow}>
                {/* Timeline Tree Line & Dot */}
                <View style={styles.treeCol}>
                  <View style={[styles.treeDot, { backgroundColor: iconColor }]} />
                  {!isLast && <View style={styles.treeLine} />}
                </View>

                {/* Timeline Content Card */}
                <Card style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventDate}>{item.date}</Text>
                    <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
                      <Icon size={16} color={iconColor} />
                    </View>
                  </View>

                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDesc}>{item.description}</Text>
                </Card>
              </View>
            );
          })}
        </View>
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
    paddingTop: 8,
    paddingBottom: 28,
  },
  timelineList: {
    marginTop: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  treeCol: {
    alignItems: 'center',
    width: 20,
    marginTop: 20,
  },
  treeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2,
  },
  treeLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E9D8FD',
    marginTop: 4,
    marginBottom: -4,
  },
  eventCard: {
    flex: 1,
    padding: 16,
    marginBottom: 14,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
});

