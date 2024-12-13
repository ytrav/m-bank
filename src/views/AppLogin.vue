<script lang="ts">
import axios, { type AxiosResponse } from 'axios'
import { useUserStore, type User } from '@/stores/userStore'
import { defineComponent } from 'vue'

import AppWarning from '@/components/AppWarning.vue'

export interface LoginData {
  accountNum: string
  password: string
  remember: boolean
}

export default defineComponent({
  components: {
    AppWarning,
  },
  data(): {
    error: string
    loginData: LoginData
    userStore: ReturnType<typeof useUserStore>
    loginFields: Array<{
      label: string
      type: string
      name: string
      model: keyof LoginData
      length: string
    }>
  } {
    return {
      error: '',
      loginData: {
        accountNum: '',
        password: '',
        remember: false,
      },
      userStore: useUserStore(),
      loginFields: [
        {
          label: 'Your mBank account number',
          type: 'text',
          name: 'accountNum',
          model: 'accountNum',
          length: '12',
        },
        {
          label: 'Password',
          type: 'password',
          name: 'password',
          model: 'password',
          length: '255',
        },
      ],
    }
  },
  computed: {
    rawAccountNumber(): string {
      let rawNum = this.loginData.accountNum.replace(/-/g, '')
      if (rawNum.startsWith('12')) {
        rawNum = rawNum.slice(2)
      }
      return rawNum
    },
  },
  methods: {
    login(): void {
      // console.log('Login', this.accountNum, this.password);
      axios
        .post(
          'https://bank-api.maevetopia.fun/login',
          {
            accountNum: this.rawAccountNumber,
            password: this.loginData.password,
            remember: this.loginData.remember,
          },
          {
            withCredentials: true,
          },
        )
        .then((response: AxiosResponse<{ accessToken: string; user: User }>) => {
          console.log('Login response', response)
          this.userStore.setLoggedIn(true)
          // console.log(response.data.userData);
          this.userStore.setUserData(response.data.user)
          this.userStore.setAccessToken(response.data.accessToken)
          // sessionStorage.setItem('token', response.data.token)
          this.$router.replace('/dashboard')
        })
        .catch((error) => {
          console.error('Login error', error)
          this.error = error.response?.data?.error || 'Unexpected error occurred'
        })
    },
    handleFocus(): void {
      // Ensure "12-" is always there when the input is focused
      if (!this.loginData.accountNum.startsWith('12-')) {
        this.loginData.accountNum = '12-'
      }
    },
  },
  watch: {
    'loginData.accountNum'(newVal) {
      // Allow only numbers and hyphens, ensure the input always starts with "12-"
      newVal = newVal.replace(/[^0-9-]/g, '')
      if (!newVal.startsWith('12-')) {
        newVal = '12-' + newVal.replace(/^12-?/, '')
      }

      // Add hyphens automatically for the first part (after "12-")
      const rawNum = newVal.replace(/-/g, '').slice(2) // Remove hyphens and "12" prefix
      let formattedNum = '12-'
      if (rawNum.length > 4) {
        formattedNum += `${rawNum.slice(0, 4)}-${rawNum.slice(4, 8)}`
      } else if (rawNum.length > 0) {
        formattedNum += rawNum
      }

      // Only permit the hyphen after "12-XXXX" and not beyond
      if (rawNum.length === 4 && newVal.length > formattedNum.length) {
        formattedNum += '-'
      }

      this.loginData.accountNum = formattedNum
    },
  },
})
</script>

<template>
  <div class="login">
    <h2>Welcome back!</h2>
    <form @submit.prevent="login">
      <Transition name="warning">
        <AppWarning
          class="error"
          v-if="error"
          :warning="{
            type: 'other',
            message: error,
            outline: false,
          }"
        />
      </Transition>
      <div v-for="(field, index) in loginFields" :key="index" class="input-container">
        <input
          :id="field.name"
          v-model="loginData[field.model]"
          :type="field.type"
          :maxlength="field.length"
          @focus="index === 0 ? handleFocus() : null"
          :placeholder="field.label"
        />
        <label :for="field.name"> {{ field.label }} </label>
      </div>
      <label for="remember" class="remember"
        ><span
          v-wave="{
            duration: 0.2,
            color: 'currentColor',
            initialOpacity: 0.2,
            easing: 'ease-out',
            stopPropagation: true,
          }"
          class="label"
          >Remember me</span
        >
        <input v-model="loginData.remember" type="checkbox" name="remember" id="remember" />
        <span class="checkmark"></span>
      </label>
      <button
        v-wave="{
          duration: 0.2,
          color: 'currentColor',
          initialOpacity: 0.2,
          easing: 'ease-out',
        }"
        type="submit"
      >
        Login
      </button>
      <caption>
        Don't have an account?
        <RouterLink to="/register">Become a member</RouterLink>
      </caption>
    </form>
  </div>
</template>
