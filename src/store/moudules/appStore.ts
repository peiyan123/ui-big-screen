import { defineStore } from 'pinia'
import { store } from '@/store'

export interface IUserState {
  token: string
}

const useUserStore = defineStore({
  id: 'app-token',
  state: (): IUserState => ({
    token: "",
  }),

  getters: {
    getToken(): string {
      return this.token
    }
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
    removeToken() {
      this.token = ''
    }
  }
})

const useUserStoreWithOut = () => {
  return useUserStore(store)
}

export {
  useUserStore,
  useUserStoreWithOut
}