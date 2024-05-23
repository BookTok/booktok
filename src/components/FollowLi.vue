<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';

export default {
    props: {
        follow: Object,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
}
</script>
<template>
   <div v-if="follow.author" class="col-xl-2 col-md-12 lists">
    <img class="icon" :src="follow.author.user.pic" :alt="follow.author.name" />
    <p>{{ follow.author.name }}</p>
   </div>
   <div v-if="follow && follow.publisher" class="col-xl-2 col-md-12 lists">
    <img class="icon" :src="follow.publisher.user.pic" :alt="follow.publisher.name" />
    <p>{{ follow.publisher.name }}</p>
   </div>
</template>

<style scoped>
.icon {
  width: 100px; /* ajusta el tamaño de la imagen */
  height: 100px; /* ajusta el tamaño de la imagen */
  border-radius: 50%; /* esto convierte la imagen en un círculo */
  overflow: hidden;
  object-fit: cover;
  border: 3px solid rgba(255, 235, 205, 0.664);
}

.lists {
  background-color: #ffebcd5d;
  border-radius: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
}

</style>