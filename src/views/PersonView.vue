<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'
import { Form, Field } from 'vee-validate'
import HomeLi from '@/components/HomeLi.vue'

export default {
  data() {
    return {
      usuario: {},
      listas: [],
      readBooks: [],
      readingBooks: [],
      wishlistBooks: [],
      friend: {},
      yo: {},
      libors: [],
      bool: ''
    }
  },
  props: {
    id: String
  },
  components: {
    Form,
    Field
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  async mounted() {
    const apiService = new APIService(this.user.token)
    try {
      this.yo = await apiService.getUserEmail(this.user.email)
      this.friend.id_user = this.yo.data.id
      const u = await apiService.getREG(this.id)
      if (u.data.data.rol === 'REG') {
        this.usuario = u.data.data
        if (this.usuario.email === this.user.email) {
          this.$router.push('/profile')
        } else {
          this.friend.id_friend = this.usuario.id
        }
      } else if (u.data.data.rol === 'AUT') {
        const aut = await apiService.getAuthorUserId(this.id)
        this.usuario = aut.data.data
        this.friend.id_friend = this.usuario.user.id
      } else if (u.data.data.rol === 'EDI') {
        const pub = await apiService.getPublisheUserId(this.id)
        this.usuario = pub.data.data
        this.friend.id_friend = this.usuario.user.id
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }

    try {
      if (this.usuario.rol === 'REG') {
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
    try {
      if (this.usuario.rol === 'REG') {
        const are = await apiService.areFriends(this.friend.id_user, this.friend.id_friend)
        this.bool = are.data.bool
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    back() {
      this.$router.push('/profile')
    },
    async followFriend() {
      const apiService = new APIService(this.user.token)
      try {
        if (this.book === '0') {
          await apiService.followFriend(this.friend)
        this.addMsgArray('success', 'Sois amigos')
        } else {
          await apiService.deleteFriend(this.friend.id_user, this.friend.id_friend)
        this.addMsgArray('info', 'Dejasteis de ser amigos')
        }
        
      } catch (error) {
        this.addMsgArray('danger', 'Ya sois amigos, no puedes volver a seguiros')
      }
    }
  }
}
</script>
<template>
  <div class="card container">
    <div class="card-body">
      <div class="row">
        <div class="col-4">
          <img class="icon" :src="this.usuario.icon || this.usuario.pic" :alt="this.usuario.name" />
          <p><strong>Nombre:</strong> {{ this.usuario.name }}</p>
          <p><strong>Apellidos:</strong> {{ this.usuario.surname }}</p>
          <p><strong>Email:</strong> {{ this.usuario.email }}</p>
        </div>
        <div class="col-4 text-center">
          <Form @submit="followFriend()">
            <Field type="number" v-model="friend.id_user" name="id_user" hidden />
            <Field type="number" v-model="friend.id_friend" name="id_friend" hidden />
            <button
              v-if="this.usuario.rol === 'REG' && this.bool === '0'"
              class="btn mt-2"
              type="submit"
            >
              <span class="material-symbols-outlined"> person_add </span>
            </button>
            <button
              v-if="this.usuario.rol === 'REG' && this.bool === '1'"
              class="btn mt-2"
              type="submit"
            >
              <span class="material-symbols-outlined"> person_cancel </span>
            </button>
            <button v-if="this.usuario.rol === 'AUT' || this.usuario.rol === 'EDI'" class="btn mt-2">
              <span class="material-symbols-outlined"> add_box </span>
            </button>
          </Form>
        </div>
      </div>
      <div v-if="this.usuario.rol === 'REG'" class="row lists">
        <h4>Listas</h4>
        <div class="col-4">
          <h5>LEIDOS</h5>
          <div class="folder">
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
          <div class="folder">
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
          <div class="folder">
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
      <div v-if="this.usuario.rol === 'REG'" class="row lists">
        <h4>{{ this.usuario.name }} Listas</h4>
      </div>
      <div v-else class="row lists">
        <h4>{{ this.usuario.name }} Libros</h4>
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
