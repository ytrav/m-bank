<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { defineComponent } from 'vue'
// import axios from 'axios'

// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

import AppWarning from '@/components/AppWarning.vue'

export default defineComponent({
  name: 'DashboardIssueCard',
  components: {
    SvgIcon,
    AppWarning,
  },
  props: {
    closeIcon: {
      type: String,
      required: true,
    },
  },
  data(): {
    error: string
    userStore: ReturnType<typeof useUserStore>
  } {
    return {
      error: '',
      userStore: useUserStore(),
    }
  },
})
</script>

<template>
  <div class="card-issue">
    <div class="wrapper">
      <div class="top-bar">
        <h2>Issue a new card</h2>
        <button
          @click="$router.back()"
          v-wave="{
            duration: 0.2,
            color: 'currentColor',
            initialOpacity: 0.2,
            easing: 'ease-out',
          }"
        >
          <SvgIcon type="mdi" :path="closeIcon" :size="24" class="close" />
        </button>
      </div>

      <AppWarning
        class="error"
        v-if="error"
        :warning="{
          type: 'other',
          message: error,
          outline: false,
        }"
      />
    </div>
  </div>
</template>
