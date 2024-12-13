<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { defineComponent } from 'vue'

// icons
// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

// import { mdiBankTransfer } from '@mdi/js'
import { mdiBankTransfer } from '@mdi/js'

export default defineComponent({
  name: 'DashboardTransactions',
  components: {
    SvgIcon,
  },
  data(): {
    userStore: ReturnType<typeof useUserStore>
    icons: {
      // mdiBankTransfer: string
      mdiBankTransfer: string
    }
  } {
    return {
      userStore: useUserStore(),
      icons: {
        mdiBankTransfer,
      },
    }
  },
  methods: {
    getType(personal_type: 'subtraction' | 'addition'): boolean {
      return personal_type === 'addition'
    },
  },
})
</script>

<template>
  <div class="transactions">
    <h3>Transactions:</h3>
    <RouterLink
      v-wave="{
        duration: 0.2,
        color: 'currentColor',
        initialOpacity: 0.2,
        easing: 'ease-out',
      }"
      :to="`/dashboard/transaction/${transaction.id}`"
      class="transaction"
      v-for="(transaction, index) in userStore.user?.transactions"
      :key="index"
      :title="userStore.formatTimestampAgo(transaction.timestamp)"
    >
      <div class="icon">
        <SvgIcon type="mdi" :size="35" :path="icons.mdiBankTransfer" />
      </div>
      <div class="description">
        <span
          >Direct transfer
          <caption>
            {{
              userStore.formatTimestampAgo(transaction.timestamp)
            }}
          </caption></span
        >
        <p>{{ transaction.description }}</p>
      </div>
      <span class="amount" :class="{ addition: getType(transaction.personal_type) }"
        ><template v-if="transaction.personal_type === 'addition'">+</template>
        <template v-else>-</template>₣{{ transaction.amount }}</span
      >
    </RouterLink>
    <span
      class="empty"
      v-if="userStore.user?.transactions && userStore.user?.transactions.length < 1"
      >No recorded transactions yet</span
    >
  </div>
</template>
