<script>
import { useStore } from '@/stores/store.js'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import APIService from '../axios/axios.js'
import { mapState } from 'pinia'
import HomeLi from '@/components/HomeLi.vue'
export default {
  data() {
    return {
      libros: [
        {
          data: [],
          prev: []
        }
      ],
      friendsActivity: [],
      recommendedBooks: []
    }
  },
  components: {
    HomeLi
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  async mounted() {
    await axios
      .get(SERVER + '/best-reviews')
      .then((response) => (this.libros = response.data))
      .catch()
    console.log(this.libros.data)
    const apiService = new APIService(this.user.token)
    if (this.user && Object.values(this.user).length !== 0) {
      const response = await apiService.friensActivity()
      this.friendsActivity = response.data.data
      const resp = await apiService.recommendedBook()
      this.recommendedBooks = resp.data
    }
  },
  methods: {
    generateActivityMessage(activity) {
      const userName = `${activity.id_user.name} ${activity.id_user.surname}`
      const bookName = activity.id_book.name
      const status = activity.status
      let message = ''

      if (status === 'READ') {
        message = `<strong>${userName}</strong> ha terminado de leer <strong>${bookName}</strong>.`
      } else if (status === 'READING') {
        message = `<strong>${userName}</strong> está leyendo <strong>${bookName}</strong> y ha leído ${activity.pages} páginas.`
      } else if (status === 'WISH') {
        message = `<strong>${userName}</strong> agregó <strong>${bookName}</strong> a su lista de deseos.`
      }

      return message
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <h3>Mejor valorados</h3>
      <div class="col-lg-8 col-md-8 home-li-container">
        <home-li v-for="libro in this.libros.data" :libro="libro" :key="libro.id"></home-li>
      </div>
      <div v-if="this.user && Object.values(this.user).length !== 0" class="col-lg-4 col-md-4 activity-container">
        <h5>Actividad de Amigos</h5>
        <div v-for="activity in friendsActivity" :key="activity.id" class="activity-item" v-html="generateActivityMessage(activity)"></div>
      </div>
    </div>
    <div class="row" v-if="this.user && Object.values(this.user).length !== 0 && recommendedBooks.length >= 1">
      <h3>Te interesarán</h3>
      <div class="col-lg-8 col-md-8 home-li-container">
        <home-li v-for="libro in recommendedBooks" :libro="libro" :key="libro.id"></home-li>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
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

.home-li-container {
  display: flex;
  flex-wrap: wrap;
}

.col-lg-8 {
  display: flex;
  flex-wrap: wrap;
}

.col-lg-4 {
  position: sticky;
  top: 0;
  align-self: flex-start;
  background-color: white; /* Añade un color de fondo si es necesario */
  padding: 1rem; /* Añade un poco de padding para darle espacio */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Añade un poco de sombra si es necesario */
}

.activity-container {
  background-color: #f8f9fa6b;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 6px;
}

.activity-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
