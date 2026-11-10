import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Activity, FileText, Calendar, Download, ChevronRight } from 'lucide-react-native';
import colors from '../../theme/colors';

export default function RecentActivityList({ activities, onViewAll, onSelectActivity }) {
  const getIcon = (type) => {
    switch (type) {
      case 'log':
        return Activity;
      case 'lab':
        return FileText;
      case 'cycle':
        return Calendar;
      case 'copilot':
        return Download;
      default:
        return Activity;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'log':
        return '#9C3A6E';
      case 'lab':
        return '#7950A8';
      case 'cycle':
        return '#10B981';
      case 'copilot':
        return '#F59E0B';
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        {onViewAll && (
          <Pressable onPress={onViewAll} hitSlop={8}>
            <Text style={styles.viewAll}>View Timeline</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.list}>
        {activities.slice(0, 4).map((item) => {
          const Icon = getIcon(item.type);
          const iconColor = getIconColor(item.type);

          return (
            <Pressable
              key={item.id}
              onPress={() => onSelectActivity && onSelectActivity(item)}
              style={({ pressed }) => [
                styles.itemRow,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
                <Icon size={16} color={iconColor} />
              </View>

              <View style={styles.itemContent}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemDetail} numberOfLines={1}>
                  {item.detail}
                </Text>
              </View>

              <Text style={styles.timeText}>{item.time}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  list: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemDetail: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

