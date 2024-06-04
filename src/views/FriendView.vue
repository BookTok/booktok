<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
import APIService from '../axios/axios.js'
import FriendLi from '../components/FriendLi.vue'

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
        const follow = await apiService.getFriend(this.usuario.id)
        this.follows = follow.data.data
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
  },
  components:{
    FriendLi
  },
  methods:{
    back(){
      this.$router.push('/profile')
    }
  }
}
</script>
<template>
    <span @click="back" class="material-symbols-outlined">
arrow_back_ios
</span>
   <div class="row">
    <h3>Amigos:</h3>
    <friend-li v-for="follow in follows" :follow="follow" :key="follow"></friend-li>
   </div>
</template>

<style scoped>
.material-symbols-outlined {
  margin-top: 5px;
  cursor: pointer; 
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>