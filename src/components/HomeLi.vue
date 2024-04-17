<script>
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';

export default {
    props: {
        libro: Object,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
    methods:{
        ...mapActions(useStore, ['addMsgArray']),
        showDetails(){
            this.$router.push('/show-details/book/' + this.libro.id)
        },
    }
}
</script>
<template>
    <div class="col-sm-12 col-md-6 col-lg-4 cart">
        <img :src='libro.pic' :alt="libro.name">
        <h5>{{ libro.name }}</h5>
        <div class="rating">
            <span v-for="n in 5" :key="n" :class="{ filled: n <= libro.rating_average }">★</span>
        </div>
        <p class="description">Descripción: {{ libro.description }}</p>
        <button class="details btn" @click="showDetails">Detalles</button>
    </div>    
</template>

<style scoped>
.cart {
    text-align: center;
    background-color: rgba(255, 255, 255, 0.5); 
    border-radius: 10px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); 
    padding: 10px;
    margin-bottom: 5px;
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

img{
    height: -webkit-fill-available;
    width: -webkit-fill-available;
}
</style>