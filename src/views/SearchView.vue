<script>
import { useStore } from '@/stores/store.js'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import { mapState } from 'pinia'
import { Form, Field, useForm } from 'vee-validate'
import HomeLi from '@/components/HomeLi.vue'

export default {
  data() {
    return {
      libros: [],
      query: {}
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
      await axios
      .get(SERVER + '/books-search/', this.query)
      .then((response) => (this.libros = response.data))
      .catch()
    }
  }
}
</script>


<template>
  <div class="row container">
    <div class="col-12">
      <Form @submit="buscar" >
        <Field type="text" v-model="query.query" name="query" />
        <button type="submit" @click="submitForm" class="btn btn-light">
          <span class="material-symbols-outlined"> search </span>
        </button>
      </Form>
    </div>
    <div class="col-12" v-if="libros.length > 0">
      <div class="row">
        <home-li v-for="libro in libros.data" :libro="libro" :key="libro.id"></home-li>
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
