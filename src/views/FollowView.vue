<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
import APIService from '../axios/axios.js'
import FollowLi from '@/components/FollowLi.vue'

export default {
    data() {
    return {
      follows: [], // Inicializamos books como un array vacío
      usuario: {}
    }
  },
    props: {
        tipo: String,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
    async mounted() {
    const apiService = new APIService(this.user.token)
    try {
      if (this.user.rol === 'REG') {
        const response = await apiService.getUserEmail(this.user.email)
        this.usuario = response.data
        const follow = await apiService.getFollow(this.usuario.id)
        this.follows = follow.data.data
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
  },
  component:{
    FollowLi
  }
}
</script>
<template>
   <div class="row">
    <follow-li v-for="follow in follows" :key="follow"></follow-li>
   </div>
</template>

<style scoped>

</style>