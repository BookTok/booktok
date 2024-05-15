<script>
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API

export default {
    data(){
        return{
            rating: 0
        }
    },
    props: {
        libro: Object,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
    async mounted() {
    try {
      const response = await axios.get(SERVER + '/averange/' + this.libro.id)
      this.rating = response.data.total
      console.log(this.rating)
    } catch (error) {
      this.addMsgArray('danger', 'No se puede conetar con el servidor')
    }
  },
    methods:{
        ...mapActions(useStore, ['addMsgArray']),
        showDetails(id){
            this.$router.push('/show-details/book/' + id)
        },
    }
}
</script>
<template>
    <div class="col-sm-12 col-md-6 col-lg-4 cart">
        <div class="book-cover">
            <img :src='libro.pic' :alt="libro.name" class="book-image">
        </div>
        <h5>{{ libro.name }}</h5>
        <div class="rating">
            <span v-for="n in 5" :key="n" :class="{ filled: n <= (libro.rating_average || rating) }">★</span>
        </div> 
        <p class="description">Descripción: {{ libro.description }}</p>
        <button class="details btn" @click="showDetails(libro.id)">Detalles</button>
    </div>    
</template>

<style scoped>
.cart {
    display: inline-block; /* Hace que el contenedor ocupe solo el espacio que necesita */
    max-width: 250px; /* Ancho máximo igual al del libro */
    max-height: 650px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.5); 
    border-radius: 10px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); 
    padding: 10px;
    margin: 5px;
}

.details{
    background-color: #E64663;
}
.btn {
    margin-bottom: 10px;
    transition: box-shadow 0.3s ease;
}
.btn:hover{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.rating{
    font-style: italic;
}
.rating span {
    color: rgb(255, 241, 162); /* Color de la estrella */
    font-size: 24px; /* Tamaño de la estrella */
}
.rating .filled {
    color: rgb(255, 221, 0); /* Color de la estrella rellena */
}

.book-cover {
    width: 200px; /* Ancho de la portada del libro */
    height: 300px; /* Alto de la portada del libro */
    border: 5px solid #ccc; /* Grosor del borde */
    border-radius: 10px; /* Bordes redondeados */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* Sombra */
    overflow: hidden; /* Oculta el contenido que se desborda */
    margin-left: 15px;
    margin-bottom: 5px;
}

.book-image {
    width: 100%; /* La imagen ocupa todo el espacio disponible */
    height: 100%; /* La imagen ocupa todo el espacio disponible */
    object-fit: cover; /* La imagen se ajusta para cubrir todo el contenedor */
}
</style>