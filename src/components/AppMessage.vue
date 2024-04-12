<template>
    <div :class="classList">
      <span><strong>ATENCIÓN: </strong>{{ message.text }}</span>
      <button type="button" class="btn-close" @click="delMessage"></button>
    </div>
  </template>
  
  <script>
  import { useStore } from '@/stores/store.js'
  import { mapActions } from 'pinia';
  export default {
    props: {
      message: Object,
      index: Number
    },
    computed: {
      classList() {
        return "col-sm-12 alert alert-dismissible alert-" + this.message.type
      }
    },
    methods: {
      ...mapActions(useStore, ['clearErrorMessages']),
      delMessage(index) {
        this.clearErrorMessages(index)
      },
    },
  };
  </script>