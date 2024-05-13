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
   <div class="col-12">
    
   </div>
</template>

<style scoped>

</style>