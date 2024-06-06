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
      libros: [
        {
          data: [],
          prev: []
        }
      ],
      my_lists: [
        {
          books: []
        }
      ],
      bool: ''
    }
  },
  props: {
    id: String
  },
  components: {
    Form,
    Field,
    HomeLi
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    }),
    filteredLists() {
      return this.my_lists.filter((list) => list.books && list.books.length > 0)
    }
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
        this.friend.id_author = this.usuario.id
        this.friend.id_publisher = 0
      } else if (u.data.data.rol === 'EDI') {
        const pub = await apiService.getPublisheUserId(this.id)
        this.usuario = pub.data.data
        this.friend.id_author = 0
        this.friend.id_publisher = this.usuario.id
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
      } else if (this.usuario.rol === 'AUT') {
        const authBook = await apiService.authorBook(this.usuario.id)
        this.libros = authBook.data
      } else if (this.usuario.rol === 'EDI') {
        const pubBook = await apiService.publisherBook(this.usuario.id)
        this.libros = pubBook.data
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
    try {
      if (this.usuario.rol === 'REG') {
        const are = await apiService.areFriends(this.friend.id_user, this.friend.id_friend)
        this.bool = are.data.bool
      } else if (this.usuario.rol === 'AUT' || this.usuario.rol === 'EDI') {
        const areF = await apiService.areFollow(
          this.friend.id_user,
          this.friend.id_author,
          this.friend.id_publisher
        )
        this.bool = areF.data.bool
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }

    try {
      if (this.user.rol === 'REG') {
        const lists = await apiService.getList(this.usuario.id)
        this.my_lists = lists.data.data
        for (let list of this.my_lists) {
          const booksList = await apiService.getBooksInList(list.id)
          list.books = booksList.data.data
        }
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
        if (this.bool === '0') {
          await apiService.followFriend(this.friend)
          this.bool = '1'
          this.addMsgArray('success', 'Sois amigos')
        } else {
          await apiService.deleteFriend(this.friend.id_user, this.friend.id_friend)
          this.bool = '0'
          this.addMsgArray('info', 'Dejasteis de ser amigos')
        }
      } catch (error) {
        this.addMsgArray('danger', 'Ya sois amigos, no puedes volver a seguiros')
      }
    },
    async follow() {
      const apiService = new APIService(this.user.token)
      try {
        if (this.bool === '0') {
          await apiService.followAuthPub(this.friend)
          this.bool = '1'
          this.addMsgArray('success', 'Seguiste a este usuario')
        } else {
          if (this.usuario.rol == 'AUT') {
            await apiService.unfollowAut(this.friend.id_user, this.friend.id_author)
          this.bool = '0'
          } else {
            await apiService.unfollowPub(this.friend.id_user, this.friend.id_publisher)
          this.bool = '0'
          }
          this.addMsgArray('info', 'Dejaste de seguirlo')
        } 
      } catch (error) {
        this.addMsgArray('danger', 'Ya lo sigues')
      }
    }
  }
}
</script>
<template>
  <div class="card container">
    <div class="card-body">
      <div class="row">
        <div class="col-xl-4 col-md-12 text-center">
          <div class="image-container">
            <img class="icon" :src="usuario.pic || usuario.icon" :alt="usuario.name" />
          </div>
          <p><strong>{{ usuario.name }}</strong></p>
        </div>
        <div class="col-xl-4 col-md-12 text-center">
          <Form v-if="this.usuario.rol === 'REG'" @submit="followFriend()">
            <Field type="number" v-model="friend.id_user" name="id_user" hidden />
            <Field type="number" v-model="friend.id_friend" name="id_friend" hidden />
            <button class="btn mt-2" type="submit">
              <span class="material-symbols-outlined">
                {{ bool === '0' ? 'person_add' : 'person_cancel' }}
              </span>
            </button>
          </Form>
          <Form v-if="this.usuario.rol === 'AUT' || this.usuario.rol === 'EDI'" @submit="follow()">
            <Field type="number" v-model="friend.id_user" name="id_user" hidden />
            <Field type="number" v-model="friend.id_publisher" name="id_publisher" hidden />
            <Field type="number" v-model="friend.id_author" name="id_author" hidden />
            <button class="btn mt-2">
              <span class="material-symbols-outlined">
                {{ bool === '0' ? 'add_box' : 'disabled_by_default' }}
              </span>
            </button>
          </Form>
        </div>
      </div>
      <div v-if="this.usuario.rol === 'REG'" class="row lists">
        <h4>Listas</h4>
        <div class="col-xl-4 col-md-12">
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
        <div class="col-xl-4 col-md-12">
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
        <div class="col-xl-4 col-md-12">
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
      <div v-if="this.usuario.rol === 'REG' && filteredLists.length >= 1" class="row lists">
        <h4>{{ this.usuario.name }} Listas</h4>
        <div class="col-xl-3 col-md-12 folder list" v-for="list in filteredLists" :key="list.id">
          <div class="thumbnails">
            <h5>{{ list.name }}</h5>
            <br />
            <img
              class="book-pic"
              v-for="book in list.books.slice(0, 3)"
              :key="book.id_book.id"
              :src="book.id_book.pic"
            />
          </div>
        </div>
      </div>
      <div v-if="this.usuario.rol === 'AUT' || this.usuario.rol === 'EDI'" class="row">
        <h4>{{ this.usuario.name }} Libros</h4>
        <home-li v-for="libro in this.libros.data" :libro="libro" :key="libro.id"></home-li>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 90%;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
}

.btn {
  margin-right: 15px;
}

.edit{
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
}

.delete{
  background-color: #ffebcdb5;
  color: black;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  display: inline-block;
}

.icon {
  width: 200px; /* ajusta el tamaño de la imagen */
  height: 200px; /* ajusta el tamaño de la imagen */
  border-radius: 50%; /* esto convierte la imagen en un círculo */
  overflow: hidden;
  object-fit: cover;
  border: 3px solid rgba(255, 235, 205, 0.664);
  box-shadow: 0 0 4px 4px rgba(255, 215, 114, 0.656)
}

.upload {
  position: absolute;
  bottom: 0;
  left: 0;
  color: rgb(0, 0, 0); /* Color del icono */
  padding: 5px; /* Ajusta según sea necesario */
  border-radius: 0 0 0 5px; /* Bordes redondeados */
}

.lists {
  background-color: #ffebcdb5;
  border-radius: 8px;
  margin-top: 15px;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1)
}

.list {
  margin: 5px;
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
  cursor: pointer;
  font-size: 35px;
  color: #ffebcdb5;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  background-color: #fff;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.modal-body {
  padding-bottom: 20px;
}

.modal-title {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #888;
}

/* Estilos para el formulario en el modal */
form {
  margin-top: 20px;
}

.form-label {
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
