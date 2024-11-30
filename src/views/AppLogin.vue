<script lang="ts">
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      accountNum: '',
      password: '',
      userStore: useUserStore(),
    };
  },
  computed: {
    rawAccountNumber(): string {
      let rawNum = this.accountNum.replace(/-/g, '');
      if (rawNum.startsWith('12')) {
        rawNum = rawNum.slice(2);
      }
      return rawNum;
    }
  },
  methods: {
    login() {
      // console.log('Login', this.accountNum, this.password);
      axios.post('http://localhost:3000/login', {
        accountNum: this.rawAccountNumber,
        password: this.password,
      }).then((response) => {
        console.log('Login response', response);
        this.userStore.setLoggedIn(true);
        // console.log(response.data.userData);

        this.userStore.setUserData(response.data.userData);
        this.$router.push('/dashboard');
      }).catch((error) => {
        console.error('Login error', error);
      });
    },
    handleFocus() {
      // Ensure "12-" is always there when the input is focused
      if (!this.accountNum.startsWith('12-')) {
        this.accountNum = '12-';
      }
    },
  },
  watch: {
    accountNum(newVal) {
      // Allow only numbers and hyphens, ensure the input always starts with "12-"
      newVal = newVal.replace(/[^0-9-]/g, '');
      if (!newVal.startsWith('12-')) {
        newVal = '12-' + newVal.replace(/^12-?/, '');
      }

      // Add hyphens automatically for the first part (after "12-")
      const rawNum = newVal.replace(/-/g, '').slice(2); // Remove hyphens and "12" prefix
      let formattedNum = '12-';
      if (rawNum.length > 4) {
        formattedNum += `${rawNum.slice(0, 4)}-${rawNum.slice(4, 8)}`;
      } else if (rawNum.length > 0) {
        formattedNum += rawNum;
      }

      // Only permit the hyphen after "12-XXXX" and not beyond
      if (rawNum.length === 4 && newVal.length > formattedNum.length) {
        formattedNum += '-';
      }

      this.accountNum = formattedNum;
    },
  },
});
</script>

<template>
  <div class="login">
    <span>Login</span>

    <form @submit.prevent="login">
      <input type="text" maxlength="12" v-model="accountNum" @focus="handleFocus" placeholder="12-XXXX-XXXX" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>
