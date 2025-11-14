# Unified User ID System

## ✅ What Changed

Every user now has **one general ID** that is used across the entire application:
- ✅ Games (scores, leaderboard)
- ✅ Cart
- ✅ Wishlist (when implemented)
- ✅ Analytics (when implemented)
- ✅ All user-related features

## 🆔 How It Works

### **User ID Generation**

1. **First Visit:**
   - System generates unique ID: `user_1234567890_abc123`
   - Stored in cookie (`zuka_user_id`)
   - Stored in localStorage (client-side access)
   - Persists for 1 year

2. **Subsequent Visits:**
   - Same ID retrieved from cookie/localStorage
   - User stays "logged in" across sessions
   - Works across devices (via cookie)

### **Storage**

- **Cookie**: `zuka_user_id` (server & client accessible)
- **LocalStorage**: `zuka_user_id` (client-side access)
- **Zustand Store**: `useUserStore` (React state management)

## 📁 Files Created

1. **`apps/web/lib/user-id.ts`**
   - `getClientUserId()` - Get/create ID on client
   - `getServerUserId()` - Get/create ID on server
   - `formatUserId()` - Format for display (privacy)

2. **`apps/web/lib/user-store.ts`**
   - `useUserStore` - React hook for user ID
   - Auto-initializes on first use
   - Persists across page reloads

3. **`apps/web/app/api/user/id/route.ts`**
   - `GET /api/user/id` - API endpoint to get user ID
   - Used by client-side code

## 🔄 Updated Files

1. **`apps/web/app/api/games/score/route.ts`**
   - Now uses unified `getServerUserId()`
   - All game scores linked to same user ID

2. **`apps/web/lib/store.ts` (Cart)**
   - Cart now linked to user ID
   - Auto-initializes user ID when cart is used

3. **`apps/web/app/(shop)/leaderboard/page.tsx`**
   - Shows "You" badge for current user's scores
   - Uses unified user ID

## 💻 Usage Examples

### **Client-Side (React Components)**

```typescript
import { useUserStore } from '@/lib/user-store';
import { getClientUserId } from '@/lib/user-id';

function MyComponent() {
  // Method 1: Using Zustand store
  const userId = useUserStore((state) => state.getUserId());
  
  // Method 2: Direct function call
  const userId2 = getClientUserId();
  
  return <div>Your ID: {userId}</div>;
}
```

### **Server-Side (API Routes)**

```typescript
import { getServerUserId } from '@/lib/user-id';

export async function POST(req: Request) {
  const userId = await getServerUserId();
  // Use userId for database operations
}
```

### **Games**

```typescript
// Game score submission automatically uses user ID
// No code changes needed in game components
<form action="/api/games/score" method="post">
  <input type="hidden" name="game" value="snake" />
  <input type="hidden" name="score" value={score} />
  <button type="submit">Save Score</button>
</form>
```

## 🎮 Game Scores

- ✅ All scores linked to user ID
- ✅ Same ID used across all games
- ✅ Leaderboard shows user's own scores with "You" badge
- ✅ Scores sync when database is connected

## 🛒 Cart

- ✅ Cart linked to user ID
- ✅ Can sync cart across devices (with database)
- ✅ User ID auto-initialized when cart is used

## 🔐 Privacy & Security

- **User IDs**: Masked in leaderboard (shows last 8 chars)
- **Cookie**: HttpOnly disabled (needed for client access), Secure in production
- **Format**: `user_TIMESTAMP_RANDOM` (not personally identifiable)
- **Persistence**: 1 year expiration

## 📊 Benefits

1. **Unified Tracking**: One ID for everything
2. **Cross-Feature**: Games, cart, wishlist all linked
3. **Analytics Ready**: Can track user behavior across features
4. **Database Ready**: When you add database, all data links to same ID
5. **Guest-Friendly**: Works without accounts

## 🔄 Migration Path

When you add user accounts later:

1. **Keep existing IDs**: Map cookie IDs to account IDs
2. **Merge data**: Link old scores/cart to new account
3. **Seamless transition**: Users keep their history

## ✅ Current Status

- ✅ Unified user ID system implemented
- ✅ Games use unified ID
- ✅ Cart linked to user ID
- ✅ Leaderboard shows "You" badge
- ✅ Works without database
- ✅ Ready for database integration

## 🚀 Next Steps

1. **Add Wishlist**: Link to user ID
2. **Add Analytics**: Track user behavior with unified ID
3. **Add Database**: All data will link to same ID
4. **Add Accounts**: Map cookie IDs to account IDs

## 📝 Example Flow

1. **User visits site** → Gets ID: `user_1234_abc`
2. **Plays Snake** → Score saved with ID `user_1234_abc`
3. **Adds to cart** → Cart linked to ID `user_1234_abc`
4. **Plays Tetris** → Score saved with same ID `user_1234_abc`
5. **Views leaderboard** → Sees "You" badge on their scores
6. **All data linked** → One ID, unified tracking!

---

**Every user now has one general ID that links all their activity!** 🎉

