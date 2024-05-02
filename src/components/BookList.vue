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
      publisher: ''
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
  async mounted(){
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
          book.author = await apiService.getAuthor(book.id_book.id_author);
          book.publisher = await apiService.getPublisher(book.id_book.id_publisher);
        }
  },
  methods:{
    ...mapActions(useStore, ['cleanUser', 'addMsgArray']),
  }
}
</script>

<template>
  <div class="folder">
    <h5>{{ status }}</h5>
    <div class="thumbnails">
      <div class="thumbnail" v-for="book in books" :key="book.id">
        <div class="thumbnail-content">
          <img :src="book.id_book.pic" />
          <div class="info">
            <p>{{ book.id_book.name }}</p>
            <p>{{ book.author.data.data.user.name }}</p>
            <p>{{ book.publisher.data.data.user.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder {
  /* Estilos para el contenedor de la carpeta */
}

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
</style>