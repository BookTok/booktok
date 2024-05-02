<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'

export default {
  data() {
    return {
      books: [] // Inicializamos books como un array vacío
    }
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  created() {
    const booksDataString = this.$route.query.books;
    if (booksDataString) {
      // Parsear la cadena JSON de nuevo a un array de objetos
      this.books = JSON.parse(booksDataString);
    }
  }
}
</script>

<template>
    <div class="folder">
      <h5>titulo</h5>
      <div class="thumbnails">
        <img v-for="book in this.books" :key="book.id" :src="book.pic"/>
      </div>
    </div>
  </template>
