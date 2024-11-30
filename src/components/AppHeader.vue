<script lang="ts">
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
// import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppHeader',
  components: {
    RouterLink,
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
});
</script>

<template>
  <header>
    <span>mBank</span>
    <span v-if="userStore.loggedIn">(Logged in)</span>
    <RouterLink to="/login">Login</RouterLink>
  </header>
</template>
