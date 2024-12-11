<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { Transaction } from '@/stores/userStore'

// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

import { mdiBankTransfer } from '@mdi/js'

export default defineComponent({
  components: {
    SvgIcon,
  },
  props: {
    closeIcon: {
      type: String,
      required: true,
    },
  },
  data(): {
    transaction: Transaction | null
    userStore: ReturnType<typeof useUserStore>
    icons: {
      mdiBankTransfer: string
    }
  } {
    return {
      transaction: null,
      userStore: useUserStore(),
      icons: {
        mdiBankTransfer,
      },
    }
  },
  mounted() {
    if (this.$route.params.id) {
      try {
        this.transaction =
          this.userStore.user?.transactions.find(
            (transaction) => transaction.id === parseInt(this.$route.params.id as string),
          ) || null
        // console.log(this.transaction)
      } catch (error) {
        console.error(error)
      }
    }
    // const dashboardElement = document.getElementsByClassName('dashboard-router')[0] as HTMLElement
    // if (dashboardElement) {
    //   dashboardElement.focus()
    // }
    // console.log(this.$refs.dashboardRouter)

    // ;(this.$refs.dashboardRouter as HTMLElement).focus()
  },
  methods: {
    formatAccountNumber(account_number: string): string {
      // add 12- to the account number and hyphen 4 digits
      return `12-${account_number.slice(0, 4)}-${account_number.slice(4, 8)}`
    },
  },
  computed: {
    formattedDateTime(): string {
      if (this.transaction) {
        const date: Date = new Date(this.transaction.timestamp)
        const options: Intl.DateTimeFormatOptions = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }
        const formatter = new Intl.DateTimeFormat('pl-PL', options)
        return formatter.format(date)
      }
      return ''
    },
  },
})
</script>

<template>
  <div class="transaction-view" v-if="transaction">
    <div class="wrapper">
      <div class="top-bar">
        <h2>Transaction</h2>
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
      <div class="body">
        <SvgIcon type="mdi" :path="icons.mdiBankTransfer" :size="60" class="icon" />
        <h3>Direct transfer</h3>
        <span
          class="amount"
          :class="{
            addition: transaction.personal_type === 'addition',
          }"
        >
          <template v-if="transaction.personal_type === 'subtraction'">-</template>₣{{
            transaction.amount
          }}
        </span>
        <div class="info">
          <caption>
            {{
              formattedDateTime
            }}
          </caption>
          <span class="sender-receiver">
            <template v-if="transaction.personal_type === 'addition'"
              >From: {{ formatAccountNumber(transaction.sender_account_number) }}
            </template>
            <template v-else
              >To: {{ formatAccountNumber(transaction.receiver_account_number) }}
            </template>
          </span>
          <div class="description">
            <h4>Transaction description:</h4>
            <p>{{ transaction.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
