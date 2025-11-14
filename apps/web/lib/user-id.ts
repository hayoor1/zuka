/**
 * Unified User ID System
 * 
 * Generates and manages a single user ID that persists across:
 * - Games (scores, leaderboard)
 * - Cart
 * - Wishlist
 * - Analytics
 * - All user-related features
 */

// Client-side: Get or create user ID from localStorage
export function getClientUserId(): string {
  if (typeof window === 'undefined') {
    // Server-side: Return a placeholder (will be handled by server)
    return 'temp-user-id';
  }

  let userId = localStorage.getItem('zuka_user_id');
  
  if (!userId) {
    // Generate a unique user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('zuka_user_id', userId);
    
    // Also sync to cookie for server-side access
    document.cookie = `zuka_user_id=${userId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }
  
  return userId;
}

// Server-side: Get or create user ID from cookies
export async function getServerUserId(): Promise<string> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  let userId = cookieStore.get('zuka_user_id')?.value;
  
  if (!userId) {
    // Generate a unique user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    cookieStore.set('zuka_user_id', userId, {
      httpOnly: false, // Allow client-side access too
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }
  
  return userId;
}

// Format user ID for display (privacy)
export function formatUserId(userId: string): string {
  if (!userId) return 'Anonymous';
  // Show last 8 characters for privacy
  return userId.length > 8 ? `...${userId.slice(-8)}` : userId;
}

// Check if user ID exists
export function hasUserId(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('zuka_user_id');
}

