<script>
import { useStore } from '@/stores/store.js'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
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
      ]
    }
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
    await axios
      .get(SERVER + '/best-reviews')
      .then((response) => (this.libros = response.data))
      .catch()
      console.log(this.libros.data)
  }
}
</script>

<template>
  <div class="row container">
    <home-li v-for="libro in this.libros.data" :libro="libro" :key="libro.id"></home-li>
    <div v-if="this.user.rol == 'REG'" class="col-lg-4">
        hola
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
