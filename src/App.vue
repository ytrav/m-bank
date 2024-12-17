<script lang="ts">
import axios, { type AxiosResponse } from 'axios'
import { type UserData, useUserStore } from '@/stores/userStore'
import { RouterView } from 'vue-router'

import AppHeader from './components/AppHeader.vue'

export default {
  components: {
    AppHeader,
    RouterView,
  },
  data(): {
    userStore: ReturnType<typeof useUserStore>
    refreshInterval: number
    // isBack: boolean
  } {
    return {
      userStore: useUserStore(),
      refreshInterval: 0,
      // isBack: isBack,
    }
  },
  computed: {
    isPopup(): boolean {
      if (this.$route.path.split('/')[2]) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    closePopup(): void {
      if (this.$route.path.split('/')[2]) {
        this.$router.replace('/dashboard')
      }
    },
  },
  mounted() {
    this.userStore.load('start')
    axios
      .post(
        'https://bank-api.maevetopia.fun/refresh',
        {},
        {
          withCredentials: true,
        },
      )
      .then((refreshResponse: AxiosResponse<{ accessToken: string }>) => {
        const accessToken = refreshResponse.data.accessToken

        axios
          .get<UserData>('https://bank-api.maevetopia.fun/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((userResponse) => {
            console.log('User data: ', userResponse.data.data)
            this.userStore.setUserData(userResponse.data.data)
            this.userStore.setAccessToken(accessToken)
            this.userStore.setLoggedIn(true)
            this.userStore.load('end')
            // this.refreshInterval = setInterval(this.userStore.refreshData, 60000)
            // this.userStore.startInterval()

            if (
              this.$route.path === '/' ||
              this.$route.path === '/login' ||
              this.$route.path === '/register'
            ) {
              this.$router.replace('/dashboard')
            }
          })
          .catch(() => {
            this.userStore.load('end')
            this.userStore.redirect()
            clearInterval(this.refreshInterval)
            // console.error(`Error fetching user data: ${error.response?.data || error.message}`)
          })
      })
      .catch(() => {
        this.userStore.load('end')
        this.userStore.redirect()
        // console.error(`Error refreshing token: ${error.response?.data || error.message}`)
      })
  },
  beforeUnmount() {
    // if (this.refreshInterval) {
    //   clearInterval(this.refreshInterval)
    // }
    this.userStore.stopInterval()
  },
}
</script>

<template>
  <AppHeader />
  <div class="router-wrapper" @scroll="userStore.setUserMenu(false)" :class="{ locked: isPopup }">
    <RouterView tabindex="0" @keydown.esc="closePopup" class="page" v-slot="{ Component }">
      <Transition name="route">
        <Component :is="Component" />
      </Transition>
    </RouterView>
  </div>
  <Transition name="loading">
    <div v-if="userStore.isLoading" class="loading">
      <span class="loader"></span>
    </div>
  </Transition>
</template>
