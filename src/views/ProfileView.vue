<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'

export default {
  data() {
    return {
      usuario: {},
      listas: []
    }
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  async mounted() {
    const apiService = new APIService(this.user.token)
    try {
      if (this.user.rol === 'AUT') {
        const responseComapny = await apiService.getAuthorEmail(this.user.email)
        this.usuario = responseComapny.data
      } else if (this.user.rol === 'REG') {
        const responseComapny = await apiService.getUserEmail(this.user.email)
        this.usuario = responseComapny.data
      } else {
        const responseComapny = await apiService.getPublisherEmail(this.user.email)
        this.usuario = responseComapny.data
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
  },
  methods: {
    ...mapActions(useStore, ['cleanUser', 'addMsgArray']),
    edit() {
      if (this.user.rol === 'COMP') {
        this.$router.push('/company-mod/' + Number(this.usuario.id))
      } else if (this.user.rol === 'STU') {
        this.$router.push('/student-mod/' + Number(this.usuario.id))
      }
    },
    async eliminar() {
      const apiService = new APIService(this.user.token)
      try {
        if (confirm('¿Seguro que quieres eliminar tu perfil?')) {
          if (this.user.rol === 'COMP') {
            await apiService.deleteCompany(this.usuario.CIF)
          } else if (this.user.rol === 'STU') {
            await apiService.deleteStudent(this.usuario.id)
          }
          this.$router.push('/')
          localStorage.clear()
          this.cleanUser()
        }
      } catch (error) {
        this.addMsgArray('danger', 'Problemas al intentar eliminar el perfil, vuelva a intentarlo')
      }
    }
  }
}
</script>

<template>
  <div class="card container">
    <div class="card-header">
      <h2 class="text-center">Perfil de Usuario</h2>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <img :src="this.usuario.pic" :alt="this.usuario.name" />
          <p><strong>Nombre:</strong> {{ this.usuario.name }}</p>
          <p><strong>Apellidos:</strong> {{ this.usuario.surname }}</p>
          <p><strong>Email:</strong> {{ this.usuario.email }}</p>
        </div>
        <div class="col-6 text-end">
          <button class="btn btn-light mt-2" @click="edit">Editar Perfil</button>
          <button class="btn btn-secondary mt-2" @click="eliminar">Eliminar Perfil</button>
        </div>
      </div>
      <div class="row">
        <h4>Listas</h4>
        <div class="col-4">
          <h5>LEIDOS</h5>
        </div>
        <div class="col-4">
          <h5>LEYENDO</h5>
        </div>
        <div class="col-4">
          <h5>WISHLIST</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 90%;
}

.btn {
  margin-right: 15px;
}

img {
  width: 200px; /* ajusta el tamaño de la imagen */
  height: 200px; /* ajusta el tamaño de la imagen */
  border-radius: 50%; /* esto convierte la imagen en un círculo */
  overflow: hidden;
  object-fit: cover;
  border: 3px solid rgba(255, 235, 205, 0.664);
}
</style>
