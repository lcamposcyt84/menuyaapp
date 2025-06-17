"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { customerAuthService, type CustomerProfile, type CustomerSession } from "@/lib/customer-auth"

interface CustomerAuthState {
  customer: CustomerProfile | null
  session: CustomerSession | null
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    email: string
    password: string
    name: string
    phone?: string
    address?: string
  }) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<CustomerProfile>) => Promise<boolean>
  addRewardPoints: (orderTotal: number) => void
  addToFavorites: (restaurantId: string) => boolean
  removeFromFavorites: (restaurantId: string) => boolean
  clearError: () => void
}

export const useCustomerAuth = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      session: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const session = await customerAuthService.login(email, password)

          if (session) {
            set({
              customer: session.customer,
              session,
              isLoading: false,
            })
            return true
          } else {
            set({
              error: "Credenciales incorrectas",
              isLoading: false,
            })
            return false
          }
        } catch (error) {
          set({
            error: "Error al iniciar sesión",
            isLoading: false,
          })
          return false
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })

        try {
          const session = await customerAuthService.register(data)

          if (session) {
            set({
              customer: session.customer,
              session,
              isLoading: false,
            })
            return true
          } else {
            set({
              error: "Error al registrar la cuenta",
              isLoading: false,
            })
            return false
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error al registrar",
            isLoading: false,
          })
          return false
        }
      },

      logout: () => {
        const { customer } = get()
        if (customer) {
          customerAuthService.logout(customer.id)
        }
        set({ customer: null, session: null, error: null })
      },

      updateProfile: async (updates) => {
        const { customer } = get()
        if (!customer) return false

        const success = customerAuthService.updateProfile(customer.id, updates)
        if (success) {
          set({ customer: { ...customer, ...updates } })
        }
        return success
      },

      addRewardPoints: (orderTotal: number) => {
        const { customer } = get()
        if (!customer) return

        const updatedCustomer = customerAuthService.addRewardPoints(customer.id, orderTotal)
        if (updatedCustomer) {
          set({ customer: updatedCustomer })
        }
      },

      addToFavorites: (restaurantId: string) => {
        const { customer } = get()
        if (!customer) return false

        const success = customerAuthService.addToFavorites(customer.id, restaurantId)
        if (success) {
          const updatedCustomer = {
            ...customer,
            preferences: {
              ...customer.preferences,
              favoriteRestaurants: [...customer.preferences.favoriteRestaurants, restaurantId],
            },
          }
          set({ customer: updatedCustomer })
        }
        return success
      },

      removeFromFavorites: (restaurantId: string) => {
        const { customer } = get()
        if (!customer) return false

        const success = customerAuthService.removeFromFavorites(customer.id, restaurantId)
        if (success) {
          const updatedCustomer = {
            ...customer,
            preferences: {
              ...customer.preferences,
              favoriteRestaurants: customer.preferences.favoriteRestaurants.filter((id) => id !== restaurantId),
            },
          }
          set({ customer: updatedCustomer })
        }
        return success
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "customer-auth-storage",
      partialize: (state) => ({
        customer: state.customer,
        session: state.session,
      }),
    },
  ),
)
