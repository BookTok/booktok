<script>
import { useStore } from '@/stores/store.js'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import { mapState } from 'pinia'
import { Form, Field } from 'vee-validate'
import HomeLi from '@/components/HomeLi.vue'

export default {
  data() {
    return {
      libros: [],
      query: ''
    }
  },
  components: {
    HomeLi,
    Form,
    Field
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  methods: {
    async buscar() {
      try {
        const response = await axios.get(SERVER + '/books-search/', {
          params: {
            query: this.query
          }
        })
        this.libros = response.data.data
      } catch (error) {
        console.error('Error al buscar libros:', error)
      }
    }
  }
}
</script>


<template>
  <div class="row container">
    <div class="col-12">
      <Form @submit="buscar">
        <Field type="text" v-model="query" name="query" />
        <button type="submit" class="btn btn-light">
          <span class="material-symbols-outlined"> search </span>
        </button>
      </Form>
    </div>
    <div class="col-12 mt-5" v-if="libros.length > 0">
      <h4 v-if="query !== '' && libros !== null">Busquedas para {{ query }}</h4>
      <div class="row">
        <home-li v-for="libro in libros" :libro="libro" :key="libro.id"></home-li>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  text-align: center;
  background-color: #f8f9fa6b;
  max-width: 100%;
  margin-top: 2%;
}
.material-symbols-outlined{
  cursor: pointer;
}

input{
  border:0;
  border-radius: 5px;
  width: 50%;
}

form{
  display: flex
}
</style>
