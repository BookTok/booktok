<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'
import foto from '../assets/default.jpg'

export default {
  data() {
    return {
      usuario: {},
      listas: [],
      readBooks: [],
      readingBooks: [],
      wishlistBooks: [],
      defaultPic: foto,
      my_lists: [
        {
          books: []
        }
      ],
      showModal: false
    }
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
    ...mapActions(useStore, ['cleanUser', 'addMsgArray']),
    edit() {
      if (this.user.rol === 'REG') {
        this.$router.push('/user-update/' + Number(this.usuario.id))
      }
    },
    async eliminar() {
      const apiService = new APIService(this.user.token)
      try {
        if (confirm('¿Seguro que quieres eliminar tu perfil?')) {
          if (this.user.rol === 'REG') {
            await apiService.deleteUser(this.usuario.id)
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
    friendView() {
      this.$router.push('/friends')
    },
    async createList() {
      const newList = {
        name: this.newListName,
        id_user: this.usuario.id,
        private: 1
      }

      const apiService = new APIService(this.user.token)
      await apiService
        .addList(newList)
        .then((response) => {
          this.addMsgArray('success', 'Lista agregada exitosamente')
          this.showModal = false
        })
        .catch((error) => {
          this.addMsgArray('danger', 'Error al agregar la lista')
          console.error('Error al agregar la lista:', error)
        })
    },
    listView(id) {
      this.$router.push('/user-list/' + id)
    }
  }
}
</script>

<template>
  <div class="card container">
    <div>
      <h2 class="text-center">Perfil de Usuario</h2>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-xl-4 col-md-12 text-center">
          <div class="image-container">
            <img class="icon" :src="usuario.pic || defaultPic" :alt="usuario.name" />
          </div>
          <p><strong>{{ usuario.name }}</strong></p>
        </div>
        <div class="col-xl-4 col-md-12 text-center">
          <button @click="friendView" class="btn mt-2">
            <span class="material-symbols-outlined"> diversity_4 </span>
          </button>
          <button @click="followView" class="btn mt-2">
            <span class="material-symbols-outlined"> group </span>
          </button>
        </div>
        <div class="col-xl-4 col-md-12 text-xl-end text-md-center">
          <button class="btn btn-light mt-2 edit" @click="edit">Editar Perfil</button>
          <button class="btn mt-2 delete" @click="eliminar">Eliminar Perfil</button>
        </div>
      </div>
      <div class="row lists">
        <h4>Listas</h4>
        <div class="col-xl-4 col-md-12">
          <h5>LEIDOS</h5>
          <div class="folder" @click="viewList('READ')">
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
          <div class="folder" @click="viewList('READING')">
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
          <h5>POR LEER</h5>
          <div class="folder" @click="viewList('WISH')">
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
        <div class="text-center d-flex">
          <h4>Mis Listas</h4>
          <div class="text-end">
            <span class="material-symbols-outlined" @click="showModal = true"> add </span>
          </div>
          <div v-if="showModal" class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Agregar Nueva Lista</h5>
                  <button type="button" class="btn-close" @click="showModal = false">X</button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="createList">
                    <div class="mb-3">
                      <label for="newListName" class="form-label">Nombre de la Lista:</label>
                      <input
                        type="text"
                        class="form-control"
                        id="newListName"
                        v-model="newListName"
                        required
                      />
                    </div>
                    <button type="submit" class="btn btn-light">Crear Lista</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-12 folder list" v-for="list in filteredLists" :key="list.id">
          <div class="thumbnails">
            <h5>{{ list.name }}</h5>
            <img
              class="book-pic"
              v-for="book in list.books.slice(0, 3)"
              :key="book.id_book.id"
              :src="book.id_book.pic"
              @click="listView(list.id)"
            />
          </div>
        </div>
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
  color: #ffc559cf;
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
