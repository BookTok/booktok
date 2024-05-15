<script>
import { useStore } from '@/stores/store.js'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import { mapState } from 'pinia'
import HomeLi from '@/components/HomeLi.vue'

export default {
  data() {
    return {
      libros: [],
      titulo: ''
    }
  },
  props:{
    tipo: String
  },
  components: {
    HomeLi
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    }),
  },
  async mounted() {
    await this.fetchBooksByType(this.tipo)
    this.updateTitulo(this.tipo)
  },
  watch: {
    tipo: {
      handler: function(newTipo) {
        this.fetchBooksByType(newTipo)
        this.updateTitulo(newTipo)
      },
      immediate: true
    }
  },
  methods: {
    async fetchBooksByType(tipo) {
      try {
        const response = await axios.get(`${SERVER}/books-genre/${tipo}`)
        this.libros = response.data.data
      } catch (error) {
        console.error('Error al obtener los libros:', error)
      }
    },
    updateTitulo(tipo) {
      switch (tipo) {
        case 'FIC':
          this.titulo = 'Ficción'
          break;
        case 'NO_FIC':
          this.titulo = 'No Ficción'
          break;
        case 'POE':
          this.titulo = 'Poesía'
          break;
        case 'INF':
          this.titulo = 'Infantil'
          break;
        case 'TEA':
          this.titulo = 'Teatro'
          break;
        case 'OTROS':
          this.titulo = 'Otros'
          break;
        default:
          this.titulo = ''
      }
    }
  }
}
</script>

<template>
  <div class="row container">
    <h3>{{ titulo }}</h3>
    <home-li v-for="libro in libros" :libro="libro" :key="libro.id"></home-li>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  background-color: #f8f9fa6b;
  max-width: 100%;
  margin-top: 2%;
}

.btn {
  position: relative;
  width: 100%;
  padding: 20px;
  border-radius: 6px;
  border: 0;
  background: #f26964;
  font-size: 1.2em;
  color: #fff;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 3px 0px #c1524e;
}

.btn:active {
  top: 3px;
  box-shadow: none;
}

.student {
  margin-top: 15px;
  background: #7bb0ff;
  color: white;
  box-shadow: 0px 3px 0px #2c416e;
}

.company {
  margin-top: 15px;
  background: #ff8181;
  color: white;
  box-shadow: 0px 3px 0px #2c416e;
}
</style>
