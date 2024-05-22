<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import axios from 'axios'
import CommentsBook from './CommentsBook.vue'
const SERVER = import.meta.env.VITE_URL_API
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  data() {
    return {
      showModal: false,
      showModalList: false,
      book: {},
      rating: '',
      reviews: [],
      review: {
        review: '',
        rating: 0,
        id_user: '',
        id_book: ''
      },
      usuario: {},
      book_status: {
        id_user: '',
        id_book: '',
        status: ''
      },
      statuses: ['READ', 'READING', 'WISH'],
      listas_user: [],
      bookList: {},
      bool: ''
    }
  },
  props: {
    id: String
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  components: {
    Form,
    ErrorMessage,
    Field,
    CommentsBook
  },
  async mounted() {
    const apiService = new APIService(this.user.token)
    try {
      const response = await axios.get(SERVER + '/books/' + this.id)
      this.book = response.data.data
    } catch (error) {
      this.addMsgArray('danger', 'No se puede conetar con el servidor')
    }
    console.log(this.book)

    try {
      const response = await axios.get(SERVER + '/averange/' + this.id)
      this.rating = response.data
    } catch (error) {
      this.addMsgArray('danger', 'No se puede conetar con el servidor')
    }
    console.log(this.rating.total)

    try {
      const response = await axios.get(SERVER + '/reviews/' + this.id)
      this.reviews = response.data
    } catch (error) {
      this.addMsgArray('danger', 'No se puede conetar con el servidor')
    }
    console.log(this.reviews)

    try {
      if (this.user.rol === 'REG') {
        const responseComapny = await apiService.getUserEmail(this.user.email)
        this.usuario = responseComapny.data
        const response = await apiService.getBookReviewUser(this.usuario.id, this.book.id)
        this.review.id = response.data.data.id
        this.review.rating = response.data.data.rating
        this.review.review = response.data.data.review
        this.review.id_user = response.data.data.id_user.id
        this.review.id_book = response.data.data.book.id
      }
    } catch (error) {
      console.log(error)
    }

    try {
      if (this.user.rol === 'REG') {
        const lists = await apiService.getList(this.usuario.id)
        this.listas_user = lists.data.data
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    getUser(id) {
      this.$router.push(`/user/${Number(id)}`)
    },
    submitOrUpdate() {
      const apiService = new APIService(this.user.token)
      if (this.review.id) {
        this.update(apiService)
      } else {
        this.create(apiService)
      }
    },
    async update(apiService) {
      try {
        await apiService.updateReview(this.review.id, this.review)
      } catch (error) {
        this.addMsgArray('danger', 'Error al actualizar la valoración')
      }
    },
    async create(apiService) {
      try {
        this.review.id_user = this.usuario.id
        this.review.id_book = this.book.id
        await apiService.createReview(this.review)
      } catch (error) {
        this.addMsgArray('danger', 'Error al crear la valoración')
      }
    },
    selectStatus(status) {
      this.book_status.status = status
      this.book_status.id_user = this.usuario.id
      this.book_status.id_book = this.book.id
      this.showModal = false
      this.handleSubmit()
    },
    async handleSubmit() {
      const apiService = new APIService(this.user.token)
      try {
        await apiService.updateStateBook(
          this.book_status.id_book,
          this.book_status.id_user,
          this.book_status.status
        )
        this.addMsgArray('success', 'Estado del libro actualizado')
      } catch (error) {
        this.addMsgArray('danger', 'Error al enviar el estado del libro')
      }
    },
    async selectList(listId) {
      this.bookList.id_book = this.book.id
      this.bookList.id_list = listId

      const apiService = new APIService(this.user.token)
      try {
        const isInList = await apiService.isInList(listId, this.book.id)
        if (isInList.data.bool === 1) {
          this.addMsgArray('danger', 'El libro ya está en esta lista')
        } else {
          this.showModalList = false
          this.addBookToList()
        }
      } catch (error) {
        this.addMsgArray('danger', 'Error al verificar la lista')
      }
    },
    async addBookToList() {
      const apiService = new APIService(this.user.token)
      try {
        await apiService.addBookToList(this.bookList)
        this.addMsgArray('success', 'Libro añadido a la lista')
      } catch (error) {
        this.addMsgArray('danger', 'Error al añadir el libro a la lista, no existe la lista')
      }
    },
    listContainsBook(listId) {
      return this.listas_user.find((list) => list.id === listId && list.containsBook)
    }
  }
}
</script>
<template>
  <div class="row details">
    <div class="col-4">
      <img :src="book.pic" :alt="book.name" />
      <p><span>Descripción: </span>{{ book.description }}</p>
      <p><span>Fecha publicación: </span>{{ book.publication }}</p>
    </div>
    <div class="col-4">
      <h5>{{ book.name }}</h5>
      <p class="point" v-if="book.author" @click="getUser(book.author.user.id)">
        <span>Autor: </span>{{ book.author.name }}
      </p>
      <p class="point" v-if="book.publisher" @click="getUser(book.publisher.user.id)">
        <span>Editorial: </span>{{ book.publisher.name }}
      </p>
      <div v-if="this.user.rol == 'REG'">
        <!-- Formulario para el estado del libro -->
        <form @submit.prevent="handleSubmit">
          <input type="number" v-model="book_status.id_book" name="id_book" hidden />
          <input type="number" v-model="book_status.id_user" name="id_user" hidden />
          <input type="text" v-model="book_status.status" name="status" hidden />
          <button type="button" @click="showModal = true" class="btn btn-light">
            <span class="material-symbols-outlined"> bookmarks </span>
          </button>
        </form>

        <!-- Modal para seleccionar estado -->
        <div v-if="showModal" class="modal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Seleccionar Estado del Libro</h5>
                <button type="button" class="btn-close" @click="showModal = false">X</button>
              </div>
              <div class="modal-body">
                <div class="list-group">
                  <button
                    type="button"
                    class="list-group-item list-group-item-action"
                    v-for="status in statuses"
                    :key="status"
                    @click="selectStatus(status)"
                  >
                    {{ status }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario para añadir el libro a una lista -->
        <button type="button" @click="showModalList = true" class="btn btn-light">
          <span class="material-symbols-outlined"> bookmark_add </span>
        </button>

        <!-- Modal para seleccionar lista -->
        <div v-if="showModalList" class="modal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Seleccionar Lista</h5>
                <button type="button" class="btn-close" @click="showModalList = false">X</button>
              </div>
              <div class="modal-body">
                <div class="list-group">
                  <button
                    type="button"
                    class="list-group-item list-group-item-action"
                    v-for="list in listas_user"
                    :key="list.id"
                    :disabled="listContainsBook(list.id)"
                    @click="selectList(list.id)"
                  >
                    {{ list.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario para la valoración -->
        <form @submit.prevent="submitOrUpdate">
          <span>Valoración</span>
          <div class="user-rating">
            <input type="number" v-model="review.id_book" name="id_book" hidden />
            <input type="number" v-model="review.id_user" name="id_user" hidden />
            <span
              v-for="n in 5"
              :key="n"
              @click="review.rating = n"
              :class="{ filled: n <= review.rating }"
              >★</span
            >
            <textarea
              type="text"
              v-model="review.review"
              placeholder="Escribe tu comentario"
            ></textarea>
          </div>
          <button type="submit" class="btn btn-light">Enviar</button>
        </form>
      </div>
    </div>
    <div class="col-4">
      <div class="rating">
        <span v-for="n in 5" :key="n" :class="{ filled: n <= rating.total }">★</span>
        {{ rating.total }}/5
      </div>
      <div class="comments">
        <comments-book
          v-for="comments in reviews.data"
          :comments="comments"
          :key="comments"
        ></comments-book>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: -webkit-fill-available;
  max-height: -webkit-fill-available;
}

.details h5 {
  margin-bottom: 10px;
}

.details p {
  margin-bottom: 5px;
}

span {
  color: black;
}

.details span {
  font-weight: bold;
}

.apuntarse {
  background-color: #7fc7d5;
}
.eliminar {
  background-color: #e52222;
}
.deshablitar {
  background-color: #c131ae;
}

.apuntarse:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.btn {
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: none;
}

img {
  max-width: -webkit-fill-available;
  max-height: -webkit-fill-available;
}

.rating {
  font-style: italic;
}
.rating span {
  color: rgb(255, 241, 162); /* Color de la estrella */
  font-size: 24px; /* Tamaño de la estrella */
}
.rating .filled {
  color: rgb(255, 221, 0); /* Color de la estrella rellena */
}

.user-rating span {
  color: #ccc; /* Color de estrella sin rellenar */
  font-size: 24px; /* Tamaño de la estrella */
  cursor: pointer; /* Cambia el cursor al pasar sobre ellas */
}
.user-rating .filled {
  color: #ffcc00; /* Color de estrella rellenada */
}

textarea {
  height: 100px;
  width: -webkit-fill-available;
  resize: none;
}

form {
  margin-top: 20%;
}

.comments {
  max-height: 80%; /* Altura máxima */
  overflow-x: auto; /* Scroll horizontal */
}

.point {
  cursor: pointer;
}

.modal {
  display: block; /* Mostrar el modal */
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
}

.modal-dialog {
  margin: 100px auto; /* Centrar el modal */
}

.btn-close {
  background: none;
  border: none;
}

.filled {
  color: gold;
}
</style>
