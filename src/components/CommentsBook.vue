<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';

export default {
    props: {
        comments: Object,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
}
</script>
<template>
    <div class="col-12">
        <h6>{{ comments.id_user }}</h6>
        <div class="rating">
            <span v-for="n in 5" :key="n" :class="{ filled: n <= comments.rating }">★</span>
        </div>
        <p class="comments">Comentario: {{ comments.review }}</p>
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