<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppDashboard',
  data(): { userStore: ReturnType<typeof useUserStore> } {
    return {
      userStore: useUserStore(),
    };
  },
  computed: {
    formattedAccountNumber(): string {
      return `12-${this.userStore.user?.account_number.toString().slice(0, 4)}-${this.userStore.user?.account_number.toString().slice(4, 8)}`;
    }
  },
  methods: {

  }
})
</script>

<template>
  <div class="dashboard">
    <span>Greetings, <template v-if="userStore.user?.gender === 'f'">Ms.</template><template
        v-else-if="userStore.user?.gender === 'm'">Mr.</template><template v-else>Mx.</template> {{
          userStore.user?.l_name
        }}</span>
    <p>
      Account number: {{ formattedAccountNumber }}
    </p>
  </div>
</template>
