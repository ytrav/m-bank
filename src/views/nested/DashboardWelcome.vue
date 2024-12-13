<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/userStore'

// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

export default defineComponent({
  components: {
    SvgIcon,
  },
  data(): {
    userStore: ReturnType<typeof useUserStore>
  } {
    return {
      userStore: useUserStore(),
    }
  },
  props: {
    closeIcon: {
      type: String,
      required: true,
    },
  },
})
</script>

<template>
  <div class="welcome-message">
    <div class="wrapper">
      <div class="top-bar">
        <h2>Welcome to mvBank Early Test! 🏦</h2>
        <button
          v-wave="{
            duration: 0.2,
            color: 'currentColor',
            initialOpacity: 0.2,
            easing: 'ease-out',
          }"
          @click="$router.replace('/dashboard')"
        >
          <SvgIcon type="mdi" :path="closeIcon" :size="24" />
        </button>
      </div>
      <div class="body welcome">
        <div class="text-wrapper">
          <p>
            Hello, <span class="uname"> {{ userStore.user?.f_name }} </span> and thank you for
            participating in the early test of the Maevetopian Bank application!
          </p>
          <p>
            You have been granted your very own bank account number,
            <span class="acc">{{ userStore.user?.formatted_account_number }}</span> that you will
            use to log in to the application and, of course, to accept payments from other Citizens
            using mvBank
          </p>
          <p>
            There isn't a lot to play around with here, as getting the base functionality working
            definitely took some time, but I still hope you enjoy tinkering with the app!
          </p>
          <p>
            Please share any feedback or features you'd like to see added, or just anything you
            found interesting, with me on Discord or Twitter! ✨
          </p>
          <caption>
            - Maeve
          </caption>
        </div>
        <div class="bottom">
          <button
            v-wave="{
              duration: 0.2,
              color: 'currentColor',
              initialOpacity: 0.2,
              easing: 'ease-out',
            }"
            @click="$router.replace('/dashboard')"
          >
            Understood!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
