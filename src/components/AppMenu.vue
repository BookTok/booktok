<script>
import { useStore } from '@/stores/store.js'
import { mapActions, mapState } from 'pinia';
export default {
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  methods: {
    ...mapActions(useStore, ['cleanUser']),
    logOut() {
      localStorage.clear()
      this.cleanUser()
    },
  },
};
</script>

<template>
  <nav class="row">
    HOLA
  </nav>
</template>
<style scoped>

</style>