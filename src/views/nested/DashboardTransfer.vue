<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { defineComponent } from 'vue'
import axios from 'axios'

// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

import AppWarning from '@/components/AppWarning.vue'

export default defineComponent({
  name: 'DashboardTransfer',
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
    transferData: {
      receiver: string
      amount: string
    }
    userStore: ReturnType<typeof useUserStore>
    // router: typeof router
    // icons: {
    //   mdiClose: string
    // }
  } {
    return {
      error: '',
      transferData: {
        receiver: '',
        amount: '',
      },
      userStore: useUserStore(),
      // router,
      // icons: {
      //   mdiClose,
      // },
    }
  },
  methods: {
    handleFocus(): void {
      // Ensure "12-" is always there when the input is focused
      if (!this.transferData.receiver.startsWith('12-')) {
        this.transferData.receiver = '12-'
      }
    },
    sendTransfer() {
      if (
        this.userStore.user?.balance_number &&
        parseFloat(this.transferData.amount) > this.userStore.user?.balance_number
      ) {
        this.error = 'Insufficient funds for the transaction'
        return
      }
      this.userStore.load('start')
      let receiver = this.transferData.receiver

      if (receiver.startsWith('12-')) {
        receiver = receiver.replace(/^12-?/, '')
      }

      receiver = receiver.replace(/[^0-9]/g, '')
      axios
        .post(
          'https://bank-api.maevetopia.fun/transfer',
          {
            sender: this.userStore.user?.account_number,
            receiver: receiver,
            amount: this.transferData.amount,
          },
          {
            headers: {
              Authorization: `Bearer ${this.userStore.accessToken}`,
            },
            withCredentials: true,
          },
        )
        .then(() => {
          // console.log('Transfer response', response)
          this.userStore.refreshData()
          this.userStore.load('end')
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          this.userStore.load('end')
          console.error('Transfer error', error)
          this.error = error.response.data.error
        })
    },
  },
  watch: {
    'transferData.receiver'(newVal: string): void {
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

      this.transferData.receiver = formattedNum
    },
    'transferData.amount'(newVal: number): void {
      // Ensure there's only one decimal point
      const parts = newVal.toString().split('.')

      // Ensure there's only two decimal places
      if (parts.length > 1) {
        this.transferData.amount = parts[0] + '.' + parts[1].slice(0, 2)
      }
    },
  },
})
</script>

<template>
  <div class="transfer">
    <div class="wrapper">
      <div class="top-bar">
        <h2>New Transfer</h2>
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
      <form class="body" @submit.prevent="sendTransfer">
        <div class="input-container">
          <input
            id="receiver"
            v-model="transferData.receiver"
            type="text"
            placeholder="Receiver's account number"
            maxlength="14"
            @focus="handleFocus"
            required
          />
          <label for="receiver">Receiver's account number</label>
        </div>
        <div class="input-container">
          <input
            class="currency-input"
            id="amount"
            v-model="transferData.amount"
            type="number"
            placeholder="0,00"
            step="0.01"
            min="1"
            required
          />
          <label for="amount">Amount</label>
        </div>
        <div class="bottom">
          <button
            v-wave="{
              duration: 0.2,
              color: 'currentColor',
              initialOpacity: 0.2,
              easing: 'ease-out',
            }"
            type="submit"
          >
            Send Transfer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
