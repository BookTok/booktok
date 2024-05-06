<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'

export default {
  data() {
    return {
      books: [], // Inicializamos books como un array vacío
      usuario: [],
      author: '',
      publisher: '',
      reviews: [],
      rating: '',
      comment: ''
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

    for (const book of this.books) {
      const aut = await apiService.getAuthor(book.id_book.id_author)
      book.author = aut.data.data.user.name
      const pub = await apiService.getPublisher(book.id_book.id_publisher)
      book.publisher = pub.data.data.user.name
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
            <h5>{{ book.id_book.name }}</h5>
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
              <textarea
                type="text"
                v-model="book.comment"
                placeholder="Escribe tu comentario"
              ></textarea>
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
</style>
