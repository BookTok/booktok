<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API

export default {
  data() {
    return {
      books: [], // Inicializamos books como un array vacío
      author: '',
      publisher: '',
      list: []
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
  async mounted() {
    const apiService = new APIService(this.user.token)
    try {
      if (this.user.rol === 'REG') {
        const response = await axios.get(`${SERVER}/book-list/${this.id}`)
        this.books = response.data.data
        const resp = await axios.get(`${SERVER}/list/${this.id}`)
        this.list = resp.data.data
      }
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido recuperar los datos intentelo mas tarde')
    }
    for (const book of this.books) {
      const aut = await apiService.getAuthor(book.id_book.author.id)
      book.author = aut.data.data.user.name
      const pub = await apiService.getPublisher(book.id_book.publisher.id)
      book.publisher = pub.data.data.user.name
    }
  },
  methods: {
    ...mapActions(useStore, ['cleanUser', 'addMsgArray']),
    showDetails(id){
            this.$router.push('/show-details/book/' + id)
        },
  }
}
</script>

<template>
  <div class="folder">
    <h4>{{ this.list.name }}</h4>
    <div class="thumbnails">
      <div class="thumbnail" v-for="book in books" :key="book.id">
        <div class="thumbnail-content">
          <img :src="book.id_book.pic" />
          <div class="info">
            <h5>{{ book.id_book.name }}</h5>
            <p>{{ book.author }}</p>
            <p>{{ book.publisher }}</p>
            <button class="btn btn-light" @click="showDetails(book.id_book.id)">Detalles</button>
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

.filled {
  color: gold;
}
</style>
