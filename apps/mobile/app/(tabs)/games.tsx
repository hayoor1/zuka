import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Navbar } from '../../components/Navbar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const games = [
  {
    id: 'snake',
    name: 'Snake Classic',
    description: 'Guide the snake to collect food and grow longer',
    icon: '🐍',
    difficulty: 'Easy',
    maxReward: 500,
    playTime: '2-5 min',
    topScore: 2450,
    gradient: ['#10b981', '#059669'],
  },
  {
    id: 'tetris',
    name: 'Block Stacker',
    description: 'Stack falling blocks to clear lines',
    icon: '🧱',
    difficulty: 'Medium',
    maxReward: 750,
    playTime: '5-10 min',
    topScore: 18500,
    gradient: ['#3b82f6', '#2563eb'],
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs of cards to test your memory',
    icon: '🃏',
    difficulty: 'Medium',
    maxReward: 200,
    playTime: '2-5 min',
    topScore: 980,
    gradient: ['#9333ea', '#7e22ce'],
  },
  {
    id: 'quiz',
    name: 'Naija Trivia',
    description: 'History, geography, culture. Quick questions, big fun.',
    icon: '🧠',
    difficulty: 'Easy',
    maxReward: 600,
    playTime: '3-6 min',
    gradient: ['#f97316', '#ea580c'],
  },
  {
    id: 'wheel',
    name: 'Spin & Win',
    description: 'Daily spin for instant rewards',
    icon: '🎰',
    difficulty: 'Easy',
    maxReward: 1000,
    playTime: 'Instant',
    gradient: ['#eab308', '#ca8a04'],
  },
];

export default function GamesPage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const filteredGames = games.filter(
    game => selectedDifficulty === 'All' || game.difficulty === selectedDifficulty
  );

  const stats = {
    bestScore: 24500,
    pointsToday: 350,
    streak: 7,
    rank: 42,
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#050816', '#120c2c', '#341056']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerBadge}>
              <Ionicons name="game-controller" size={16} color="#e3c268" />
              <Text style={styles.headerBadgeText}>PLAY & EARN</Text>
            </View>
            <Text style={styles.title}>Royale Arcade</Text>
            <Text style={styles.subtitle}>
              Neon-lit challenges inspired by Lagos nights. Play, climb, unlock atelier perks.
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Banner */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#f9d976', '#f39f86', '#f7797d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <View style={styles.statHeader}>
                <Ionicons name="trophy" size={24} color="#333" />
                <Ionicons name="flame" size={20} color="#f97316" />
              </View>
              <Text style={styles.statValue}>{stats.bestScore.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Your Best Score</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#7f5dff', '#6f8bff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statGradient}
            >
              <Ionicons name="sparkles" size={24} color="#fff" />
              <Text style={[styles.statValue, styles.statValueWhite]}>+{stats.pointsToday}</Text>
              <Text style={styles.statLabelWhite}>Points Earned Today</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#ff8f70', '#ff3d68']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statGradient}
            >
              <Ionicons name="flash" size={24} color="#fff" />
              <Text style={[styles.statValue, styles.statValueWhite]}>{stats.streak} days</Text>
              <Text style={styles.statLabelWhite}>Daily Streak</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#4b0f7b', '#b5179e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statGradient}
            >
              <Ionicons name="people" size={24} color="#fff" />
              <Text style={[styles.statValue, styles.statValueWhite]}>#{stats.rank}</Text>
              <Text style={styles.statLabelWhite}>Your Rank</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Difficulty Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                onPress={() => setSelectedDifficulty(difficulty)}
                style={[
                  styles.filterChip,
                  selectedDifficulty === difficulty && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedDifficulty === difficulty && styles.filterChipTextActive,
                  ]}
                >
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Games Grid */}
        <View style={styles.gamesContainer}>
          {filteredGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => router.push(`/games/${game.id}`)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={game.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gameCardGradient}
              >
                <View style={styles.gameHeader}>
                  <Text style={styles.gameEmoji}>{game.icon}</Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{game.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
                <View style={styles.gameMeta}>
                  <View style={styles.gameMetaItem}>
                    <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.gameMetaText}>{game.playTime}</Text>
                  </View>
                  <View style={styles.gameMetaItem}>
                    <Ionicons name="diamond-outline" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.gameMetaText}>Up to {game.maxReward} pts</Text>
                  </View>
                </View>
                {game.topScore && (
                  <View style={styles.topScoreContainer}>
                    <Ionicons name="trophy-outline" size={12} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.topScoreText}>Best: {game.topScore.toLocaleString()}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.playButton}>
                  <Text style={styles.playButtonText}>Play Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/ranks')}
          >
            <LinearGradient
              colors={['#2a1039', '#4b0f7b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.quickActionGradient}
            >
              <Ionicons name="trophy" size={24} color="#e3c268" />
              <Text style={styles.quickActionText}>Leaderboard</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/rewards')}
          >
            <LinearGradient
              colors={['#eab308', '#f59e0b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.quickActionGradient}
            >
              <Ionicons name="gift" size={24} color="#333" />
              <Text style={[styles.quickActionText, styles.quickActionTextDark]}>Redeem</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 194, 104, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  headerBadgeText: {
    color: '#e3c268',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 16,
    gap: 10,
  },
  statCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statGradient: {
    padding: 16,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statValueWhite: {
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  statLabelWhite: {
    color: 'rgba(255,255,255,0.9)',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0d4ff',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4b0f7b',
    borderColor: '#4b0f7b',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  gamesContainer: {
    padding: 20,
    gap: 16,
  },
  gameCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  gameCardGradient: {
    padding: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameEmoji: {
    fontSize: 48,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  gameName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    lineHeight: 20,
  },
  gameMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  gameMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  topScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 4,
  },
  topScoreText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  quickActionTextDark: {
    color: '#333',
  },
});

