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
      book: {},
      rating: '',
      reviews: [],
      review: {
        review: '',
        rating: 0
      },
      usuario: {}
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
      }
      const response = await apiService.getBookReviewUser(this.usuario.id, this.book.id)
      this.review.id = response.data.data.id
      this.review.rating = response.data.data.rating
      this.review.review = response.data.data.review
      this.review.id_user = response.data.data.id_user.id
      this.review.id_book = response.data.data.book.id
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    getUser(id) {
      this.$router.push('/user/' + Number(id))
    },
    submitOrUpdate() {
      const apiService = new APIService(this.user.token)
      // Verificar si la valoración ya existe
      if (this.review.id) {
        // Si la valoración existe (tiene un ID asignado), actualizarla
        this.update(apiService)
      } else {
        // Si la valoración no existe, crear una nueva
        this.create(apiService)
      }
    },

    async update(apiService) {
      try {
        // Actualizar la valoración existente
        await apiService.updateReview(this.review.id, this.review)
        // Manejar la lógica adicional después de la actualización, si es necesario
      } catch (error) {
        this.addMsgArray('danger', 'Error al actualizar la valoración')
      }
    },

    async create(apiService) {
      try {
        // Crear una nueva valoración
        this.review.id_user = this.usuario.id
      this.review.id_book = this.book.id
        await apiService.createReview(this.review)
        // Manejar la lógica adicional después de la creación, si es necesario
      } catch (error) {
        this.addMsgArray('danger', 'Error al crear la valoración')
      }
    }
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
      <p class="point" v-if="book.author" @click="getUser(book.author.user.id)">
        <span>Autor: </span>{{ book.author.name }}
      </p>
      <p class="point" v-if="book.publisher" @click="getUser(book.publisher.user.id)">
        <span>Editorial: </span>{{ book.publisher.name }}
      </p>
      <div v-if="this.user.rol == 'REG'">
        <Form :initial-values="review" @submit="submitOrUpdate">
          <span>Valoración</span>
          <div class="user-rating">
            <Field type="number" v-model="review.id_book" name="id_book" hidden />
            <Field type="number" v-model="review.id_user" name="id_user" hidden />
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
        </Form>
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

.point {
  cursor: pointer;
}
</style>
