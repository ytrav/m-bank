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
  balance: string
  balance_number: number
  card: Card
  transactions: Transaction[]
}

export interface UserData extends AxiosResponse {
  message: string
  data: User
}

export interface Card {
  expiry_date: string
  formatted_expiry_date: Date
  formatted_expiry_date_string: string
  number: string
}

export interface Transaction {
  amount: string
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

type FormatExpiryDateArgs =
  | {
      type: 'string'
      date: string | null
    }
  | {
      type: 'date'
      date: string | null
    }

type FormatExpiryDateReturnType<T extends FormatExpiryDateArgs['type']> = T extends 'date'
  ? Date
  : string

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
      this.user.balance_number = parseFloat(data.balance)
      this.user.formatted_account_number = this.formatAccountNumber(data.account_number)
      this.user.card.formatted_expiry_date_string = this.formatExpiryDate<'string'>(
        this.user.card.expiry_date,
        'string',
      )
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
    formatAccountNumber(accountNumber: string): string {
      return `12-${accountNumber.toString().slice(0, 4)}-${accountNumber.toString().slice(4, 8)}`
    },
    formatExpiryDate<T extends FormatExpiryDateArgs['type']>(
      date: string | null,
      type: 'string' | 'date',
    ): FormatExpiryDateReturnType<T> {
      if (date) {
        if (type === 'date') {
          return new Date(date) as FormatExpiryDateReturnType<T>
        } else {
          let date_obj: Date
          if (this.user?.card?.formatted_expiry_date instanceof Date) {
            date_obj = this.user.card.formatted_expiry_date
          } else {
            date_obj = new Date(date)
          }
          return `${date_obj.getMonth() + 1}/${date_obj.getFullYear()}` as FormatExpiryDateReturnType<T>
        }
      } else {
        return '' as FormatExpiryDateReturnType<T>
      }
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
