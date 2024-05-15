<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import axios from 'axios'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
const SERVER = import.meta.env.VITE_URL_API

export default {
  data() {
    return {
      book: {},
      book_status: {},
      usuario: [],
      progressPercentage: '0%',
      pages: ''
    }
  },
  components: {
    Form,
    ErrorMessage,
    Field
  },
  props: {
    id: String
  },
  computed: {
    validationSchema() {
      return yup.object({
        pages: yup.number().max(this.pages, `El número máximo de páginas es ${this.pages}`)
      })
    },
    ...mapState(useStore, {
      user: 'user'
    })
  },
  async mounted() {
    const apiService = new APIService(this.user.token)
    try {
      const response = await axios.get(SERVER + '/books/' + this.id)
      this.book = response.data.data
      this.pages = this.book.pages
      const responseComapny = await apiService.getUserEmail(this.user.email)
      this.usuario = responseComapny.data
      const read = await apiService.getBookByStatus(this.usuario.id, 'READING')
      this.book_status = read.data.data[0]
      this.calculateProgress()
    } catch (error) {
      this.addMsgArray('danger', 'No se puede conetar con el servidor')
    }
    console.log(this.book)
    console.log(this.book_status)
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    calculateProgress() {
      // Si el libro tiene páginas y páginas leídas
      if (this.book.pages && this.book_status.pages) {
        const percentage = (this.book_status.pages / this.book.pages) * 100
        this.progressPercentage = percentage.toFixed(2) + '%'
      } else {
        this.progressPercentage = '0%'
      }
    },
    async update() {
      const apiService = new APIService(this.user.token)
      try {
        await apiService.updatePages(this.book.id, this.usuario.id, this.book_status)
        // Después de actualizar las páginas, recalcular el progreso
        this.calculateProgress()
      } catch (error) {
        this.addMsgArray('danger', 'No se puede conectar con el servidor')
      }
    }
  }
}
</script>
<template>
  <div class="row details">
    <div class="col-xl-6 col-xs-12">
      <img :src="book.pic" :alt="book.name" class="book-image" />
      <p><span>Descripción: </span>{{ book.description }}</p>
      <p><span>Fecha publicación: </span>{{ book.publication }}</p>
    </div>
    <div class="col-xl-6 col-xs-12">
      <h5>{{ book.name }}</h5>
      <p v-if="book.author"><span>Autor: </span>{{ book.author.name }}</p>
      <p v-if="book.publisher"><span>Editorial: </span>{{ book.publisher.name }}</p>
      <div class="progreso">
        <p>Leido: {{ progressPercentage }}</p>
        <div class="progress">
          <div
            class="bar shadow indeterminate-25 crosses"
            role="progressbar"
            :style="{ width: progressPercentage }"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <Form :initial-values="book_status" :validation-schema="validationSchema" @submit="update">
          <Field type="number" v-model="this.book_status.pages" name="pages" id="pages" />.../{{
            this.book.pages
          }}
          <ErrorMessage name="pages" class="error" />
          <br />
          <button class="btn btn-light" type="submit">Actualizar</button>
        </Form>
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

input {
  border: 0;
  background-color: #f2f2f2;
  width: 15%;
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

.book-image-container {
  width: 200px; /* Ancho del contenedor de la imagen */
  height: 300px; /* Alto del contenedor de la imagen */
  overflow: hidden; /* Oculta cualquier parte de la imagen que se desborde */
}

.book-image {
  width: 200px; /* Haz que la imagen ocupe todo el ancho del contenedor */
  height: 300px; /* Haz que la imagen ocupe todo el alto del contenedor */
  object-fit: cover; /* Escala la imagen para que cubra todo el contenedor */
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

.comments {
  max-height: 80%; /* Altura máxima */
  overflow-x: auto; /* Scroll horizontal */
}

.progress {
  display: inline-block;
  width: 400px;
  height: 50px;
  border-radius: 20px;
  background: #f9f9f9;
}

.bar {
  border-radius: 20px;
  width: 0%;
  height: 100%;
  transition: width;
  transition-duration: 1s;
  transition-timing-function: cubic-bezier(0.36, 0.55, 0.63, 0.48);
}

.crosses {
  background-color: #dfdbe5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.progreso {
  margin: 35px;
}

.error {
  margin-top: 5px;
  color: red;
}
</style>
