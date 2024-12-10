<script lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
// import { mapStores } from 'pinia';
import { defineComponent } from 'vue'

// icons
// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiExitToApp, mdiAccountDetails, mdiCog } from '@mdi/js'

export interface Icons {
  mdiExitToApp: string
  mdiAccountDetails: string
  mdiCog: string
}

type MenuOption =
  | {
      component: 'button'
      name: string
      icon: keyof Icons
      action: () => void
      link?: never
    }
  | {
      component: 'RouterLink'
      name: string
      icon: keyof Icons
      link: string
      action?: never
    }

export default defineComponent({
  name: 'AppHeader',
  components: {
    RouterLink,
    SvgIcon,
  },
  data(): {
    userMenuOpen: boolean
    menuFocused: boolean
    userStore: ReturnType<typeof useUserStore>
    links: Array<{
      name: string
      path: string
    }>
    menuOptions: Array<MenuOption>
    icons: Icons
  } {
    return {
      userMenuOpen: false,
      menuFocused: false,
      userStore: useUserStore(),
      links: [
        {
          name: 'About',
          path: '/',
        },
        {
          name: 'FAQ',
          path: '/',
        },
        {
          name: 'Login',
          path: '/login',
        },
      ],
      menuOptions: [
        {
          component: 'RouterLink',
          name: 'Account details (Coming soon)',
          icon: 'mdiAccountDetails',
          link: '/dashboard',
        },
        {
          component: 'RouterLink',
          name: 'Settings (Coming soon)',
          icon: 'mdiCog',
          link: '/dashboard',
        },
        {
          component: 'button',
          name: 'Log out',
          icon: 'mdiExitToApp',
          action: () => this.logout(),
        },
      ],
      icons: {
        mdiExitToApp,
        mdiAccountDetails,
        mdiCog,
      },
    }
  },
  methods: {
    logout(): void {
      this.userMenuOpen = false
      this.userStore.logout()
    },
    toggleUserMenu(): void {
      this.userMenuOpen = true
      if (this.userMenuOpen && this.$refs.userMenuButton) {
        // Focus on the button when the menu is opened
        ;(this.$refs.userMenuButton as HTMLElement).focus()
      }
    },
    closeUserMenu(event: Event): void {
      const target = event.target as HTMLElement
      const button = this.$refs.userMenuButton as HTMLElement
      const menu = this.$refs.userMenu as HTMLElement

      // Close if the click target is outside the button and menu
      if (this.userMenuOpen && !button?.contains(target) && !menu?.contains(target)) {
        this.userMenuOpen = false
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.closeUserMenu)
    // this.userMenuOpen = false
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeUserMenu)
    // this.userMenuOpen = false
  },
})
</script>

<template>
  <header>
    <RouterLink :to="userStore.loggedIn ? 'dashboard' : '/'"
      ><h4>Bank of Maevetopia</h4></RouterLink
    >
    <div v-if="!userStore.loggedIn" class="logged-out">
      <RouterLink
        v-wave="{
          duration: 0.2,
          color: 'currentColor',
          initialOpacity: 0.2,
          easing: 'ease-out',
        }"
        v-for="(link, index) in links"
        :key="index"
        :to="link.path"
      >
        {{ link.name }}
      </RouterLink>
    </div>
    <div v-else class="logged-in">
      <!-- <button @click="logout()">Log out</button> -->
      <button
        @click="toggleUserMenu"
        ref="userMenuButton"
        class="user"
        @keydown.esc="userMenuOpen = false"
        v-wave="{
          duration: 0.2,
          color: 'currentColor',
          initialOpacity: 0.2,
          easing: 'ease-out',
          stopPropagation: true,
        }"
      >
        {{ userStore.user?.f_name.slice(0, 1) }}{{ userStore.user?.l_name.slice(0, 1) }}
        <Transition name="user-popup">
          <div class="user-menu" ref="userMenu" tabindex="-1" v-if="userMenuOpen">
            <div class="profile">
              <div class="avatar">
                {{ userStore.user?.f_name.slice(0, 1) }}{{ userStore.user?.l_name.slice(0, 1) }}
              </div>
              <div class="info">
                <h5>{{ userStore.user?.f_name }} {{ userStore.user?.l_name }}</h5>
                <p>MVBAN: {{ userStore.user?.formatted_account_number }}</p>
              </div>
            </div>
            <div class="options">
              <Component
                :is="option.component"
                v-wave="{
                  duration: 0.2,
                  color: 'currentColor',
                  initialOpacity: 0.2,
                  easing: 'ease-out',
                  stopPropagation: true,
                }"
                v-for="(option, index) in menuOptions"
                :key="index"
                class="option"
                @click="option.action"
                @mouseup="userMenuOpen = false"
                :to="option.link"
              >
                <div class="icon-container">
                  <SvgIcon type="mdi" :path="icons[option.icon]" :size="35" class="icon" />
                </div>
                <span> {{ option.name }} </span>
              </Component>
            </div>
          </div>
        </Transition>
      </button>
    </div>
  </header>
</template>
