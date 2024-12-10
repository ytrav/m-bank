import router from '@/router'
import { defineStore } from 'pinia'
import axios, { AxiosError, type AxiosResponse } from 'axios'

export type Gender = 'm' | 'f' | 'n' | 'o' | 'p' | ''

export interface User {
  id: number
  f_name: string
  l_name: string
  account_number: string
  formatted_account_number: string
  gender: Gender
  balance: number
  formatted_balance: string
  card: Card
  transactions: Transaction[]
}

export interface UserData extends AxiosResponse {
  message: string
  data: User
}

export interface Card {
  expiry_date: string
  number: string
}

export interface Transaction {
  amount: number
  description: string
  id: number
  receiver_account_number: string
  sender_account_number: string
  timestamp: string
  type: 'outgoing' | 'incoming'
  personal_type: 'subtraction' | 'addition'
}
export interface UserStore {
  loggedIn: boolean
  user: User | null
  refreshInterval: ReturnType<typeof setInterval> | null
}

// export type ProtectedRoutes = string[]

export const protectedRoutes: string[] = ['dashboard', 'settings', 'account']

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    loggedIn: false,
    user: null,
    refreshInterval: null,
  }),
  actions: {
    setLoggedIn(loggedIn: boolean): void {
      this.loggedIn = loggedIn
    },
    setUserData(data: User): void {
      this.user = data
      this.user.formatted_balance = this.formatAmount(this.user.balance)
      this.user.formatted_account_number = this.formatAccountNumber(this.user.account_number)
    },
    logout(): void {
      axios
        .post('https://bank-api.maevetopia.fun/logout', {}, { withCredentials: true })
        .then(() => {
          this.user = null
          this.loggedIn = false
          this.stopInterval()
          sessionStorage.removeItem('token')
          router.replace({ path: '/' })
        })
    },
    redirect(): void {
      if (protectedRoutes.includes(router.currentRoute.value.path.split('/')[1])) {
        router.replace({ name: 'login' })
      }
    },
    startInterval(): void {
      this.refreshInterval = setInterval(this.refreshData, 60000)
    },
    stopInterval(): void {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
      }
    },
    formatAmount(amount: number): string {
      return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    formatAccountNumber(accountNumber: string): string {
      return `12-${accountNumber.toString().slice(0, 4)}-${accountNumber.toString().slice(4, 8)}`
    },
    refreshData(): void {
      axios
        .post<{ accessToken: string }>(
          'https://bank-api.maevetopia.fun/refresh',
          {},
          { withCredentials: true },
        )
        .then((refreshResponse: AxiosResponse<{ accessToken: string }>) => {
          const newAccessToken = refreshResponse.data.accessToken

          return axios.get<UserData>('https://bank-api.maevetopia.fun/user', {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          })
        })
        .then((userResponse: AxiosResponse<{ data: User }>) => {
          this.setUserData(userResponse.data.data)
        })
        .catch((error: AxiosError) => {
          console.error('Error refreshing data:', error.response?.data || error.message)
          this.logout()
        })
    },
  },
})
