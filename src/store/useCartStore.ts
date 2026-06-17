import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  sku: string;
  slug: string;
  weight?: number; // in kg
}

interface CartState {
  items: CartProduct[];
  couponCode: string | null;
  discount: number;
  addItem: (product: CartProduct) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getTotalWeight: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: (product) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) =>
            item.id === product.id &&
            item.color === product.color
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += product.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, product] });
        }
      },

      removeItem: (id, _size, color) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.id === id && item.color === color)
          ),
        });
      },

      updateQuantity: (id, quantity, _size, color) => {
        if (quantity <= 0) {
          get().removeItem(id, _size, color);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, discount }),

      removeCoupon: () => set({ couponCode: null, discount: 0 }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalWeight: () =>
        get().items.reduce(
          (sum, item) => sum + (item.weight || 0.3) * item.quantity,
          0
        ),
    }),
    {
      name: "batik-heritage-cart",
    }
  )
);
