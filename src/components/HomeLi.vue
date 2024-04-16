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
        <h5>{{ libro.name }}</h5>
        <p class="rating">Valoración:  {{ libro.rating_average }}/5</p>
        <p class="description">Descripción: {{ libro.description }}</p>
        <button class="details btn" @click="showDetails">Detalles</button>
    </div>    
</template>
<style scoped>
.cart {
    text-align: left;
    background-color: rgba(255, 255, 255, 0.5); 
    border-radius: 10px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); 
    padding: 20px;
}
.apuntarse {
    margin-right: 5px;
    background-color: #A8CED6;
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

</style>