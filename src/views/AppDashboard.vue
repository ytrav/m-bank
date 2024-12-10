<script lang="ts">
import { useUserStore } from '@/stores/userStore'
import { defineComponent } from 'vue'
import axios from 'axios'

import DashboardCard from '@/components/DashboardCard.vue'
import type { Card } from '@/stores/userStore'

import DashboardTransactions from '@/components/DashboardTransactions.vue'

// icons
// @ts-expect-error - icon import has type any
import SvgIcon from '@jamescoyle/vue-icon'

import { mdiIntegratedCircuitChip, mdiPlusCircleOutline, mdiClose, mdiCashFast } from '@mdi/js'

export default defineComponent({
  name: 'AppDashboard',
  components: {
    DashboardCard,
    DashboardTransactions,
    SvgIcon,
  },
  data(): {
    userStore: ReturnType<typeof useUserStore>
    card: Card | null
    isTransferUI: boolean
    transferData: {
      receiver: string
      amount: number
    }
    icons: {
      mdiIntegratedCircuitChip: string
      mdiPlusCircleOutline: string
      mdiClose: string
      mdiCashFast: string
    }
  } {
    return {
      userStore: useUserStore(),
      card: null,
      isTransferUI: false,
      transferData: {
        receiver: '',
        amount: 0,
      },
      icons: {
        mdiIntegratedCircuitChip,
        mdiPlusCircleOutline,
        mdiClose,
        mdiCashFast,
      },
    }
  },
  computed: {
    formattedAccountNumber(): string {
      return `12-${this.userStore.user?.account_number.toString().slice(0, 4)}-${this.userStore.user?.account_number.toString().slice(4, 8)}`
    },
    formattedBalance(): string {
      // if number doesn't have a decimal part, add .00
      return this.userStore.user?.balance.toString().includes('.')
        ? this.userStore.user?.balance.toString()
        : `${this.userStore.user?.balance}.00`
    },
  },
  methods: {
    transferUI() {
      this.isTransferUI = !this.isTransferUI
    },
    sendTransfer() {
      console.log('Send transfer')
      console.log(
        'Transfer data: ',
        this.userStore.user?.account_number,
        this.transferData.receiver,
        this.transferData.amount,
      )

      axios
        .post('https://bank-api.maevetopia.fun/transfer', {
          sender: this.userStore.user?.account_number,
          receiver: this.transferData.receiver,
          amount: this.transferData.amount,
        })
        .then((response) => {
          console.log('Transfer response', response)
        })
        .catch((error) => {
          console.error('Transfer error', error)
        })
    },
  },
})
</script>

<template>
  <div class="dashboard" v-if="userStore.user">
    <div class="top-row">
      <h1>₣ {{ userStore.user.formatted_balance }}</h1>
      <RouterLink
        to="/dashboard/transfer"
        v-wave="{ duration: 0.15, color: 'currentColor', initialOpacity: 0.2, easing: 'ease-out' }"
      >
        <SvgIcon type="mdi" :path="icons.mdiCashFast" :size="30" />
        Transfer
      </RouterLink>
    </div>
    <DashboardCard
      :exists="!!userStore.user?.card.number"
      :chipIcon="icons.mdiIntegratedCircuitChip"
      :plusIcon="icons.mdiPlusCircleOutline"
      :card="userStore.user?.card"
      :f_name="userStore.user?.f_name"
      :l_name="userStore.user?.l_name"
    />
    <h2>
      Greetings, <template v-if="userStore.user?.gender === 'f'">Ms.</template
      ><template v-else-if="userStore.user?.gender === 'm'">Mr.</template
      ><template v-else>Mx.</template> {{ userStore.user?.l_name }}
    </h2>
    <!-- <p>Account number: {{ formattedAccountNumber }}</p>
    <p>Balance: {{ userStore.user?.balance }}</p> -->
    <p v-if="userStore.user?.card.number">
      Card details: 44{{ userStore.user?.card.number.slice(0, 2) }}
      {{ userStore.user?.card.number.slice(2, 6) }} ({{ userStore.user?.card.expiry_date }})
    </p>
    <DashboardTransactions />
    <RouterView
      :closeIcon="icons.mdiClose"
      class="dashboard-router"
      ref="dashboardRouter"
      v-slot="{ Component }"
    >
      <Transition name="popup" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>
