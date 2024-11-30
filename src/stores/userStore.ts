import { defineStore } from 'pinia'

export interface User {
  account_number: number
  f_name: string
  l_name: string
  gender: string
}

export interface UserStore {
  loggedIn: boolean
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    loggedIn: false,
    user: null,
  }),
  actions: {
    setLoggedIn(loggedIn: boolean) {
      this.loggedIn = loggedIn
    },
    setUserData(data: User) {
      this.user = data
    },
  },
})
