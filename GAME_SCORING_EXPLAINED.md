# Game Scoring & Leaderboard System

## ✅ How It Works

### **Current Implementation**

1. **User Identification**
   - Each customer gets a unique ID stored in a cookie (`game_user_id`)
   - ID persists for 1 year
   - Works without user accounts (guest-friendly)
   - Format: `user_1234567890_abc123`

2. **Score Storage**

   **Without Database (Current Launch):**
   - Scores stored in server memory (`globalThis.__scores`)
   - ✅ Works for testing
   - ❌ Doesn't persist across server restarts
   - ❌ Doesn't sync across deployments
   - ❌ Lost when server restarts

   **With Database (After Setup):**
   - Scores stored in PostgreSQL (`game_scores` table)
   - ✅ Persists forever
   - ✅ Syncs across all deployments
   - ✅ Works for all customers globally
   - ✅ Real-time leaderboard updates

3. **Leaderboard**
   - Shows top 50 scores
   - Filterable by game type
   - Real-time updates
   - Shows rank, user ID (masked), score, and points earned

## 🎮 How Customers Submit Scores

1. Customer plays a game (Snake, Tetris, Memory, Quiz, etc.)
2. Game ends with a final score
3. Customer clicks "Save Score" button
4. Score is sent to `/api/games/score` with:
   - `game`: Game type (snake, tetris, memory, quiz)
   - `score`: Numeric score
5. API:
   - Gets/creates user ID from cookie
   - Saves score to database (or memory)
   - Returns success confirmation

## 📊 Leaderboard Display

- **Route**: `/leaderboard`
- **Features**:
  - Top 50 scores globally
  - Filter by game type
  - Shows rank, user ID, score, points earned
  - Special badges for top 3
  - Auto-refresh button
  - Shows sync status

## 🔄 Syncing Across Deployments

### **Without Database:**
```
❌ Scores DON'T sync
- Each deployment has separate memory
- Scores lost on restart
- Not shared between customers
```

### **With Database:**
```
✅ Scores DO sync
- All scores stored in PostgreSQL
- Shared across all deployments
- Persists forever
- Real-time updates for all customers
```

## 🚀 Setup for Production

### **Step 1: Add Database**

1. Sign up for Neon (neon.tech) - Free tier
2. Create database
3. Copy connection string
4. Add to Vercel: `DATABASE_URL=postgresql://...`

### **Step 2: Run Migrations**

```bash
cd packages/db
pnpm drizzle-kit push
```

This creates the `game_scores` table.

### **Step 3: Deploy**

Push to GitHub → Vercel auto-deploys → Scores start syncing!

## 📋 Score Data Structure

```typescript
{
  userId: string;        // Unique per customer (from cookie)
  gameType: string;      // 'snake', 'tetris', 'memory', 'quiz'
  score: number;        // Game score
  pointsEarned: number;  // Points earned (score / 10)
  createdAt: Date;       // When score was submitted
}
```

## 🔐 Privacy & Security

- **User IDs**: Masked in leaderboard (shows last 8 chars)
- **Cookie**: HttpOnly, Secure in production
- **Validation**: Score limits (5-50,000) prevent abuse
- **Rate Limiting**: Can be added via Upstash Redis

## 📈 Analytics Potential

With database, you can track:
- Total games played
- Average scores per game
- Player retention
- Peak playing times
- Score distributions
- Top players per game

## 🎯 Current Status

✅ **Works Now:**
- User identification (cookie-based)
- Score submission
- In-memory leaderboard
- Per-customer tracking

⚠️ **Needs Database:**
- Persistent storage
- Cross-deployment syncing
- Long-term leaderboard

## 💡 Example Flow

1. **Customer A** plays Snake, scores 1,500
   - Gets user ID: `user_1234_abc`
   - Score saved to database
   - Appears on leaderboard

2. **Customer B** plays Snake, scores 2,000
   - Gets user ID: `user_5678_xyz`
   - Score saved to database
   - Appears above Customer A

3. **Both customers** see updated leaderboard:
   - Customer B: Rank #1 (2,000)
   - Customer A: Rank #2 (1,500)
   - Scores sync across all devices/deployments

## 🔧 API Endpoints

### **POST `/api/games/score`**
Submit a score
```json
{
  "game": "snake",
  "score": 1500
}
```

### **GET `/api/games/score?game=snake&limit=50`**
Get leaderboard
```json
{
  "scores": [
    {
      "rank": 1,
      "userId": "...abc123",
      "gameType": "snake",
      "score": 2000,
      "pointsEarned": 200,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "source": "database",
  "synced": true
}
```

## ✅ Summary

**Yes, different customers can have their scores tracked and synced!**

- ✅ Each customer gets unique ID (cookie-based)
- ✅ Scores are tracked separately per customer
- ✅ Leaderboard updates in real-time
- ✅ With database: Scores sync across all deployments
- ✅ Works for unlimited customers
- ✅ Persistent storage (with database)

**To enable full syncing:** Just add `DATABASE_URL` environment variable and run migrations!

