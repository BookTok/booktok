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
   <div v-if="follow.friend" class="col-2 lists">
    <img class="icon" :src="follow.friend.pic" :alt="follow.friend.name" />
    <p>{{ follow.friend.name }}</p>
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
  margin-top: 5px;
}

.lists {
  background-color: #ffebcd5d;
  border-radius: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: center;
}

</style>