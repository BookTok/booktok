<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'

export default {
  data() {
    return {
      book: {}
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
      const response = await apiService.showBook(Number(this.id))
      this.book = response.data.data
    } catch (error) {
      this.addMsgArray('danger', 'No se puede conetar con el servidor')
    }
    console.log(this.book);
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    async softDelete() {
      const apiService = new APIService(this.user.token)
      try {
        await apiService.softDelet(Number(this.offer.id))
        this.$router.push('/')
      } catch (error) {
        this.addMsgArray('danger', 'No se pudo eliminar la oferta')
      }
    },
    async deshablitar() {
      const apiService = new APIService(this.user.token)
      try {
        await apiService.deshabiliti(Number(this.offer.id))
        this.$router.push('/')
      } catch (error) {
        this.addMsgArray('danger', 'No se pudo deshabilitar la oferta')
      }
    }
  }
}
</script>
<template>
  <div class="row">
    <div class="details col-12">
      <img :src="book.pic" :alt="book.name" />
      <h5>{{ book.name }}</h5>
      <p><span>Autor: </span>{{ book.author.name }}</p>
      <p><span>Editorial: </span>{{ book.publisher.name }}</p>
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
  </div>
</template>
<style scoped>
.details {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.details h5 {
  margin-bottom: 10px;
}

.details p {
  margin-bottom: 5px;
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
</style>
