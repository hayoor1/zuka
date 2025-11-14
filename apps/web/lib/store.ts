import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getClientUserId } from './user-id';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  userId: string; // Link cart to user ID
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
  initialize: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: '',
      
      initialize: () => {
        const currentUserId = get().userId;
        if (!currentUserId) {
          const userId = getClientUserId();
          set({ userId });
        }
      },
      
      addItem: (item) => {
        // Ensure user ID is set
        if (!get().userId) {
          get().initialize();
        }
        set((state) => {
          const existingItem = state.items.find(i => 
            i.productId === item.productId && 
            i.size === item.size && 
            i.color === item.color
          );
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === existingItem.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return {
            items: [...state.items, { ...item, id: `${item.productId}-${Date.now()}` }],
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      total: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      itemCount: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'zuka-cart',
      // Initialize user ID on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize();
        }
      },
    }
  )
);

// Initialize cart store with user ID
if (typeof window !== 'undefined') {
  useCartStore.getState().initialize();
}



