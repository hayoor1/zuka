import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Navbar } from '../components/Navbar';

const gemLevelDetails = {
  Quartz: { color: '#9ca3af', minXP: 0, perks: ['Welcome bonus ₦500', '5% off first order'] },
  Sapphire: { color: '#3b82f6', minXP: 100, perks: ['10% off all orders', 'Early access to sales'] },
  Ruby: { color: '#ef4444', minXP: 300, perks: ['15% off all orders', 'Free shipping on ₦10k+'] },
  Emerald: { color: '#10b981', minXP: 700, perks: ['20% off all orders', 'Free shipping always', 'Birthday gift'] },
  Diamond: { color: '#06b6d4', minXP: 1500, perks: ['25% off all orders', 'VIP customer service', 'Exclusive products'] },
  Obsidian: { color: '#9333ea', minXP: 3000, perks: ['30% off all orders', 'Personal shopper', 'Private sales'] },
  Crown: { color: '#f59e0b', minXP: 6000, perks: ['Lifetime benefits', '40% off everything', 'Crown member events'] },
};

const GemLevels = ['Quartz', 'Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Obsidian', 'Crown'];

function levelForXP(xp: number): string {
  for (let i = GemLevels.length - 1; i >= 0; i--) {
    if (xp >= gemLevelDetails[GemLevels[i] as keyof typeof gemLevelDetails].minXP) {
      return GemLevels[i];
    }
  }
  return 'Quartz';
}

export default function RanksPage() {
  const router = useRouter();
  const currentXP = 420;
  const currentLevel = levelForXP(currentXP);
  const currentLevelIndex = GemLevels.indexOf(currentLevel);
  const nextLevel = currentLevelIndex < GemLevels.length - 1 ? GemLevels[currentLevelIndex + 1] : null;
  const nextLevelXP = nextLevel ? gemLevelDetails[nextLevel as keyof typeof gemLevelDetails].minXP : 10000;
  const progress = ((currentXP - gemLevelDetails[currentLevel as keyof typeof gemLevelDetails].minXP) / (nextLevelXP - gemLevelDetails[currentLevel as keyof typeof gemLevelDetails].minXP)) * 100;

  const xpSources = [
    { action: 'Complete purchase', xp: 100, icon: 'bag-outline' },
    { action: 'Play daily game', xp: 50, icon: 'game-controller-outline' },
    { action: 'Refer a friend', xp: 200, icon: 'people-outline' },
    { action: 'Daily login streak', xp: 25, icon: 'calendar-outline' },
    { action: 'Leave product review', xp: 30, icon: 'star-outline' },
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.badge}>ROYALE RANKS</Text>
          <Text style={styles.title}>Gem Ranks</Text>
          <Text style={styles.subtitle}>Level up to unlock exclusive perks and rewards</Text>
        </View>

        {/* Current Status */}
        <View style={styles.statusCard}>
          <LinearGradient
            colors={['#fff', '#f9f2ff', '#fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusGradient}
          >
            <View style={styles.statusHeader}>
              <View style={styles.badgeContainer}>
                <Ionicons name="sparkles" size={16} color="#570a70" />
                <Text style={styles.badgeText}>Current Rank</Text>
              </View>
            </View>

            <View style={styles.levelInfo}>
              <View
                style={[
                  styles.levelIcon,
                  { backgroundColor: gemLevelDetails[currentLevel as keyof typeof gemLevelDetails].color },
                ]}
              >
                <Ionicons name="trophy" size={32} color="#fff" />
              </View>
              <View style={styles.levelText}>
                <Text style={styles.levelName}>{currentLevel}</Text>
                <Text style={styles.levelXP}>{currentXP} XP Total</Text>
              </View>
            </View>

            {/* Progress Bar */}
            {nextLevel && (
              <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>{currentLevel}</Text>
                  <Text style={styles.progressValue}>{currentXP} / {nextLevelXP} XP</Text>
                  <Text style={styles.progressLabel}>{nextLevel}</Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#3d074e', '#570a70']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.min(100, progress)}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {nextLevelXP - currentXP} XP to {nextLevel}
                </Text>
              </View>
            )}

            {/* Current Perks */}
            <View style={styles.perksContainer}>
              <Text style={styles.perksTitle}>Your Perks</Text>
              {gemLevelDetails[currentLevel as keyof typeof gemLevelDetails].perks.map((perk, index) => (
                <View key={index} style={styles.perkItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#e49b09" />
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* XP Sources */}
        <View style={styles.sourcesCard}>
          <Text style={styles.sourcesTitle}>Earn XP</Text>
          {xpSources.map((source, index) => (
            <View key={index} style={styles.sourceItem}>
              <View style={styles.sourceIconContainer}>
                <Ionicons name={source.icon as any} size={20} color="#570a70" />
              </View>
              <Text style={styles.sourceText}>{source.action}</Text>
              <View style={styles.xpBadge}>
                <Text style={styles.xpBadgeText}>+{source.xp} XP</Text>
              </View>
            </View>
          ))}
        </View>

        {/* All Levels */}
        <View style={styles.levelsSection}>
          <Text style={styles.levelsTitle}>All Gem Levels</Text>
          <View style={styles.levelsGrid}>
            {GemLevels.map((level) => {
              const details = gemLevelDetails[level as keyof typeof gemLevelDetails];
              const isUnlocked = GemLevels.indexOf(level) <= currentLevelIndex;
              const isCurrent = level === currentLevel;

              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelCard,
                    isCurrent && styles.levelCardCurrent,
                  ]}
                >
                  <View style={styles.levelCardHeader}>
                    <View
                      style={[
                        styles.levelCardIcon,
                        { backgroundColor: details.color },
                      ]}
                    >
                      <Ionicons
                        name={isUnlocked ? 'trophy' : 'lock-closed'}
                        size={20}
                        color="#fff"
                      />
                    </View>
                    <View style={styles.levelCardInfo}>
                      <Text style={styles.levelCardName}>{level}</Text>
                      <Text style={styles.levelCardXP}>{details.minXP}+ XP</Text>
                    </View>
                    {isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.levelCardPerks}>
                    {details.perks.slice(0, 2).map((perk, idx) => (
                      <View key={idx} style={styles.levelCardPerk}>
                        <Ionicons name="gift" size={12} color="#e49b09" />
                        <Text style={styles.levelCardPerkText}>{perk}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8ff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  badge: {
    fontSize: 10,
    color: '#570a70',
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#570a70',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#570a70',
    opacity: 0.7,
    textAlign: 'center',
  },
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0e6ff',
    shadowColor: '#570a70',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statusGradient: {
    padding: 24,
  },
  statusHeader: {
    marginBottom: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#570a70',
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  levelIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    flex: 1,
  },
  levelName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#570a70',
    marginBottom: 4,
  },
  levelXP: {
    fontSize: 14,
    color: '#570a70',
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#570a70',
    opacity: 0.7,
  },
  progressValue: {
    fontSize: 12,
    color: '#570a70',
    opacity: 0.7,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3e9ff',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#570a70',
    opacity: 0.7,
  },
  perksContainer: {
    marginTop: 8,
  },
  perksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#570a70',
    marginBottom: 12,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  perkText: {
    fontSize: 14,
    color: '#570a70',
    opacity: 0.8,
  },
  sourcesCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  sourcesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#570a70',
    marginBottom: 16,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0e6ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  sourceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3e9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceText: {
    flex: 1,
    fontSize: 14,
    color: '#570a70',
    opacity: 0.8,
  },
  xpBadge: {
    backgroundColor: '#f3e9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#570a70',
  },
  levelsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  levelsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#570a70',
    marginBottom: 16,
    textAlign: 'center',
  },
  levelsGrid: {
    gap: 12,
  },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  levelCardCurrent: {
    borderColor: '#e49b09',
    backgroundColor: '#fff7e1',
  },
  levelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  levelCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCardInfo: {
    flex: 1,
  },
  levelCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#570a70',
    marginBottom: 2,
  },
  levelCardXP: {
    fontSize: 12,
    color: '#570a70',
    opacity: 0.6,
  },
  currentBadge: {
    backgroundColor: '#e49b09',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#570a70',
  },
  levelCardPerks: {
    gap: 6,
  },
  levelCardPerk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelCardPerkText: {
    fontSize: 12,
    color: '#570a70',
    opacity: 0.7,
  },
});

