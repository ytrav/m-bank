<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AppDashboard',
  data(): {
    userStore: ReturnType<typeof useUserStore>;
    isTransferUI: boolean;
    transferData: {
      receiver: string;
      amount: number;
    };
  } {
    return {
      userStore: useUserStore(),
      isTransferUI: false,
      transferData: {
        receiver: '',
        amount: 0
      }
    };
  },
  computed: {
    formattedAccountNumber(): string {
      return `12-${this.userStore.user?.account_number.toString().slice(0, 4)}-${this.userStore.user?.account_number.toString().slice(4, 8)}`;
    }
  },
  methods: {
    transferUI() {
      this.isTransferUI = !this.isTransferUI;
    },
    sendTransfer() {
      console.log('Send transfer');
      console.log('Transfer data: ', this.userStore.user?.account_number, this.transferData.receiver, this.transferData.amount);

      axios.post('http://localhost:3000/transfer', {
        sender: this.userStore.user?.account_number,
        receiver: this.transferData.receiver,
        amount: this.transferData.amount
      }).then((response) => {
        console.log('Transfer response', response);
      }).catch((error) => {
        console.error('Transfer error', error);
      })
    }
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
    <p>
      Balance: {{ userStore.user?.balance }}
    </p>
    <button v-if="!isTransferUI" @click="transferUI">Send Transfer</button>
    <div class="transfer" v-if="isTransferUI">
      <form @submit.prevent="sendTransfer">
        <input v-model="transferData.receiver" type="text" placeholder="Recipient account number" />
        <input v-model="transferData.amount" type="number" placeholder="Amount" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>
