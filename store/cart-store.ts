import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  restaurantId: string
  image?: string
  customizations?: Record<string, any>
}

interface CartStore {
  items: CartItem[]
  addToCart: (product: any, restaurantId: string, customizations?: Record<string, any>) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getRestaurantId: () => string | null
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, restaurantId, customizations = {}) => {
        const existingItem = get().items.find(
          (item) => item.id === product.id && JSON.stringify(item.customizations) === JSON.stringify(customizations),
        )

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === product.id && JSON.stringify(item.customizations) === JSON.stringify(customizations)
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          }))
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                restaurantId,
                image: product.image,
                customizations,
              },
            ],
          }))
        }
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getRestaurantId: () => {
        const items = get().items
        return items.length > 0 ? items[0].restaurantId : null
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
