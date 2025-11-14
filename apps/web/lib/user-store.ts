import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getClientUserId } from './user-id';

interface UserStore {
  userId: string;
  initialized: boolean;
  initialize: () => void;
  getUserId: () => string;
}

/**
 * Unified User Store
 * 
 * Manages the user ID across the entire application.
 * Automatically initializes on first use.
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userId: '',
      initialized: false,
      
      initialize: () => {
        if (!get().initialized) {
          const userId = getClientUserId();
          set({ userId, initialized: true });
        }
      },
      
      getUserId: () => {
        const state = get();
        if (!state.initialized) {
          state.initialize();
          return get().userId;
        }
        return state.userId || getClientUserId();
      },
    }),
    {
      name: 'zuka-user',
      // Only persist the initialized flag, userId comes from localStorage/cookie
      partialize: (state) => ({ initialized: state.initialized }),
    }
  )
);

// Initialize on import (client-side only)
if (typeof window !== 'undefined') {
  useUserStore.getState().initialize();
}

