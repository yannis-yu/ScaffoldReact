import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsState {
  amadeusClientId: string
  amadeusClientSecret: string
  setAmadeusCredentials: (clientId: string, clientSecret: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      amadeusClientId: '',
      amadeusClientSecret: '',
      setAmadeusCredentials: (clientId, clientSecret) => set({ amadeusClientId: clientId, amadeusClientSecret: clientSecret }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
