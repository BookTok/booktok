<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import axios from 'axios'
import CommentsBook from './CommentsBook.vue'
const SERVER = import.meta.env.VITE_URL_API

export default {
  data() {
    return {
      book: {},
      rating: '',
      reviews: [],
      userRating: 0
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
    CommentsBook
  },
  async mounted() {
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
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray'])
    // async softDelete() {
    //   const apiService = new APIService(this.user.token)
    //   try {
    //     await apiService.softDelet(Number(this.offer.id))
    //     this.$router.push('/')
    //   } catch (error) {
    //     this.addMsgArray('danger', 'No se pudo eliminar la oferta')
    //   }
    // },
    // async deshablitar() {
    //   const apiService = new APIService(this.user.token)
    //   try {
    //     await apiService.deshabiliti(Number(this.offer.id))
    //     this.$router.push('/')
    //   } catch (error) {
    //     this.addMsgArray('danger', 'No se pudo deshabilitar la oferta')
    //   }
    // }
  }
}
</script>
<template>
  <div class="row details">
    <div class="col-4">
      <img :src="book.pic" :alt="book.name" />
      <p><span>Descripción: </span>{{ book.description }}</p>
      <p><span>Fecha publicación: </span>{{ book.publication }}</p>
      <!-- <button
        v-if="this.user.rol == 'EDI' || this.user.rol == 'AUT'"
        class="eliminar btn btn-success"
        @click="softDelete"
      >
        Eliminar
      </button>
      <button
        v-if="this.user.rol == 'EDI' || this.user.rol == 'AUT'"
        class="deshablitar btn btn-success"
        @click="deshablitar"
      >
        Deshabilitar
      </button> -->
    </div>
    <div class="col-4">
      <h5>{{ book.name }}</h5>
      <p v-if="book.author"><span>Autor: </span>{{ book.author.name }}</p>
      <p v-if="book.publisher"><span>Editorial: </span>{{ book.publisher.name }}</p>
      <form>
        <span>Valoración</span><br />
        <div class="user-rating">
          <span v-for="n in 5" :key="n" @click="userRating = n" :class="{ filled: n <= userRating }"
            >★</span
          >
          <textarea type="text" placeholder="Escribe tu comentario"></textarea>
        </div>
        <button class="btn btn-light">Enviar</button>
      </form>
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
      <!-- hacer nueva clase componente -->
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
</style>
