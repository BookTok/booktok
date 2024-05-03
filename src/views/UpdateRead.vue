<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API

export default {
  data() {
    return {
      book: {},
      
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
    try {
      const response = await axios.get(SERVER + '/books/' + this.id)
      this.book = response.data.data
    } catch (error) {
      this.addMsgArray('danger', 'No se puede conetar con el servidor')
    }
    console.log(this.book)
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    
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
      <p v-if="book.author"><span>Autor: </span>{{ book.author.name }}</p>
      <p v-if="book.publisher"><span>Editorial: </span>{{ book.publisher.name }}</p>
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
