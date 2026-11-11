import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, CheckCircle2, XCircle, AlertCircle, BookOpen } from 'lucide-react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { mythsData } from '../../data/mythsData';

export default function LearningHubScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fertility', 'Metabolism', 'Weight', 'Nutrition', 'Treatments'];

  const filteredMyths = mythsData.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verdictShort.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        showBack
        title="PCOS Myth Buster"
        subtitle="Evidence-Based Clinical Guidance"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar (Mockup Match) */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search PCOS questions or myths..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.searchIcon}>
            <Search size={18} color={colors.textSecondary} />
          </View>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.catPill,
                selectedCategory === cat && styles.catPillActive,
              ]}
            >
              <Text
                style={[
                  styles.catText,
                  selectedCategory === cat && styles.catTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Highlighted Fact Card (Mockup Screen 8 Match) */}
        {filteredMyths.map((item, idx) => {
          const isMyth = item.classification === 'Myth';
          const isFact = item.classification === 'Fact';

          return (
            <Card key={item.id} style={styles.mythCard}>
              <View style={styles.cardHeader}>
                <View style={styles.verdictBadge}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text style={styles.verdictBadgeText}>Fact</Text>
                </View>
                <Badge label={item.category} variant="secondary" size="small" />
              </View>

              <Text style={styles.questionText}>{item.question}</Text>

              <Text style={styles.verdictText}>{item.verdictShort}</Text>

              <Text style={styles.explanationText}>{item.explanation}</Text>

              {/* Decorative Floral Footer Accents for the first card (Mockup Match) */}
              {idx === 0 && (
                <View style={styles.cardFloralGraphic}>
                  <View style={styles.floralBranch}>
                    <View style={[styles.leaf, { transform: [{ rotate: '-30deg' }] }]} />
                    <View style={[styles.leaf, { transform: [{ rotate: '40deg' }] }]} />
                    <View style={[styles.leaf, { transform: [{ rotate: '-10deg' }] }]} />
                  </View>
                  <View style={styles.miniSilhouette}>
                    <View style={styles.miniHair} />
                    <View style={styles.miniFace} />
                  </View>
                </View>
              )}

              <View style={styles.citationRow}>
                <Text style={styles.citationText}>Source: {item.citation}</Text>
              </View>
            </Card>
          );
        })}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  searchIcon: {
    padding: 2,
  },
  catScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  catPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.secondary,
  },
  catPillActive: {
    backgroundColor: colors.primary,
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catTextActive: {
    color: '#FFFFFF',
  },
  mythCard: {
    padding: 18,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verdictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verdictBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  verdictText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    lineHeight: 20,
  },
  explanationText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFloralGraphic: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    height: 50,
    marginTop: -10,
    marginRight: -10,
    gap: 12,
  },
  floralBranch: {
    flexDirection: 'row',
    gap: 4,
  },
  leaf: {
    width: 14,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EDE5F7',
  },
  miniSilhouette: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniHair: {
    width: 24,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7950A8',
  },
  miniFace: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F7D0BA',
    marginTop: -4,
  },
  citationRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    marginTop: 6,
  },
  citationText: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

