<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'

export default {
  data() {
    return {
      usuario: {},
      listas: [],
      readBooks: [],
      readingBooks: [],
      wishlistBooks: []
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

    try {
      if (this.user.rol === 'REG') {
        const read = await apiService.getBookByStatus(this.usuario.id, 'READ')
        this.readBooks = read.data
        const reading = await apiService.getBookByStatus(this.usuario.id, 'READING')
        this.readingBooks = reading.data
        const wish = await apiService.getBookByStatus(this.usuario.id, 'WISH')
        this.wishlistBooks = wish.data
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
    },
    viewList(listName) {
      this.$router.push('/book-list/' + listName)
    },
    followView() {
      this.$router.push('/follow')
    },
    friendView(){
      this.$router.push('/friends')
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
        <div class="col-4">
          <img class="icon" :src="this.usuario.pic" :alt="this.usuario.name" />
          <p><strong>Nombre:</strong> {{ this.usuario.name }}</p>
          <p><strong>Apellidos:</strong> {{ this.usuario.surname }}</p>
          <p><strong>Email:</strong> {{ this.usuario.email }}</p>
        </div>
        <div class="col-4 text-center">
          <button @click="friendView" class="btn mt-2">
            <span class="material-symbols-outlined"> diversity_4 </span> Amigos
          </button>
          <button @click="followView" class="btn mt-2">
            <span class="material-symbols-outlined"> group </span>Seguidos
          </button>
        </div>
        <div class="col-4 text-end">
          <button class="btn btn-light mt-2" @click="edit">Editar Perfil</button>
          <button class="btn btn-secondary mt-2" @click="eliminar">Eliminar Perfil</button>
        </div>
      </div>
      <div class="row lists">
        <h4>Listas</h4>
        <div class="col-4">
          <h5>LEIDOS</h5>
          <div class="folder" @click="viewList('READ')">
            <!-- <img src="/carpeta-leidos.png" alt="Leídos" /> -->
            <div class="thumbnails" v-if="readBooks.data">
              <img
                class="book-pic"
                v-for="book in readBooks.data.slice(0, 3)"
                :key="book.id"
                :src="book.id_book.pic"
              />
            </div>
          </div>
        </div>
        <div class="col-4">
          <h5>LEYENDO</h5>
          <div class="folder" @click="viewList('READING')">
            <!-- <img src="/carpeta-leyendo.png" alt="Leyendo" /> -->
            <div class="thumbnails" v-if="readingBooks.data">
              <img
                class="book-pic"
                v-for="book in readingBooks.data.slice(0, 3)"
                :key="book.id"
                :src="book.id_book.pic"
              />
            </div>
          </div>
        </div>
        <div class="col-4">
          <h5>WISHLIST</h5>
          <div class="folder" @click="viewList('WISH')">
            <!-- <img src="/carpeta-wishlist.png" alt="Wishlist" /> -->
            <div class="thumbnails" v-if="wishlistBooks.data">
              <img
                class="book-pic"
                v-for="book in wishlistBooks.data.slice(0, 3)"
                :key="book.id"
                :src="book.id_book.pic"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row lists">
        <h4>Mis Listas</h4>
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

.icon {
  width: 200px; /* ajusta el tamaño de la imagen */
  height: 200px; /* ajusta el tamaño de la imagen */
  border-radius: 50%; /* esto convierte la imagen en un círculo */
  overflow: hidden;
  object-fit: cover;
  border: 3px solid rgba(255, 235, 205, 0.664);
}

.lists {
  background-color: #ffebcd5d;
  border-radius: 8px;
  margin-top: 5px;
}

.book-pic {
  height: 100px;
  width: 75px;
  object-fit: cover;
  margin-bottom: 10px;
}
.folder {
  cursor: pointer;
}

h4 {
  margin-bottom: 2%;
  text-align: center;
}
.material-symbols-outlined {
  font-size: 35px;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
