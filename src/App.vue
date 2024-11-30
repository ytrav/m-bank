<script lang="ts">
import { RouterView } from 'vue-router'

import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader,
    RouterView,
  }
}
</script>

<template>
  <AppHeader />
  <RouterView class="page" />
</template>
