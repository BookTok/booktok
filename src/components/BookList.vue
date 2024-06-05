<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'

export default {
  data() {
    return {
      showModal: false,
      books: [], // Inicializamos books como un array vacío
      usuario: [],
      author: '',
      publisher: '',
      reviews: [],
      rating: '',
      comment: '',
      book_status: {
        id_user: '',
        id_book: '',
        status: ''
      },
      statuses: ['READ', 'READING', 'WISH']
    }
  },
  props: {
    status: String
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
        const responseComapny = await apiService.getUserEmail(this.user.email)
        this.usuario = responseComapny.data
        const read = await apiService.getBookByStatus(this.usuario.id, this.status)
        this.books = read.data.data
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
    this.book_status.id_user = this.usuario.id
    for (const book of this.books) {
      const aut = await apiService.getAuthor(book.id_book.id_author)
      book.author = aut.data.data.user.name
      const pub = await apiService.getPublisher(book.id_book.id_publisher)
      book.publisher = pub.data.data.user.name
      this.book_status.id_book = book.id_book.id
    }

    if (this.status == 'READ') {
      for (const book of this.books) {
        const rat = await apiService.getBookReviewUser(this.usuario.id, book.id_book.id)
        book.rating = rat.data.data.rating
        book.comment = rat.data.data.review
      }
    }
  },
  methods: {
    ...mapActions(useStore, ['cleanUser', 'addMsgArray']),
    updateRead(id) {
      this.$router.push('/update-read/book/' + Number(id))
    },
    openModal(bookId) {
      this.book_status.id_book = bookId
      this.showModal = true
    },
    selectStatus(status) {
      this.book_status.status = status
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
        this.$router.push('/profile')
      } catch (error) {
        this.addMsgArray('danger', 'Error al enviar el estado del libro')
      }
    },
    details(id){
            this.$router.push('/show-details/book/' + id)
        }
  }
}
</script>

<template>
  <div class="folder">
    <h4>{{ status }}</h4>
    <div class="thumbnails">
      <div class="thumbnail" v-for="book in books" :key="book.id">
        <div class="thumbnail-content">
          <img :src="book.id_book.pic" />
          <div class="info">
            <h5 @click="details(book.id_book.id)">{{ book.id_book.name }}</h5>
            <p>{{ book.author }}</p>
            <p>{{ book.publisher }}</p>
            <div v-if="status == 'READING'">
              <button class="btn btn-light" @click="updateRead(book.id_book.id)">
                Actualizar Estado
              </button>
            </div>
            <div v-if="status == 'READ'" class="review">
              <h5>Tu review</h5>
              <div class="rating">
                <span v-for="n in 5" :key="n" :class="{ filled: n <= book.rating }">★</span>
              </div>
            </div>
            <div class="status">
              <form @submit.prevent="handleSubmit">
                <input type="number" v-model="book_status.id_book" name="id_book" hidden />
                <input type="number" v-model="book_status.id_user" name="id_user" hidden />
                <input type="text" v-model="book_status.status" name="status" hidden />
                <button type="button" @click="openModal(book.id_book.id)" class="btn btn-light">
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
              <!-- Fin del modal -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thumbnails {
  display: flex;
  flex-wrap: wrap;
}

.thumbnail {
  margin-right: 20px; /* Espacio entre las miniaturas */
  margin-bottom: 20px; /* Espacio entre las filas de miniaturas */
  width: 40%;
}

.thumbnail img {
  width: 200px; /* Ancho específico para cada imagen */
  height: 300px; /* Altura específica para cada imagen */
  object-fit: cover; /* Mantiene la proporción y recorta la imagen para que llene el contenedor */
}

.thumbnail-content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.info {
  margin-top: 10px;
  margin-left: 5px; /* Espacio entre la imagen y la información */
  width: 50%;

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
textarea {
  height: 100px;
  width: -webkit-fill-available;
  resize: none;
}

.review {
  background-color: rgba(245, 245, 220, 0.619);
  border-radius: 8px;
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

h5{
  cursor: pointer;
}
</style>
