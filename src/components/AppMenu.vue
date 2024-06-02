<script>
import { useStore } from '@/stores/store.js'
import { mapActions, mapState } from 'pinia'
export default {
  computed: {
    ...mapState(useStore, {
      user: 'user'
    }),
    isAuthenticated() {
      return this.user && Object.values(this.user).length !== 0;
    }
  },
  methods: {
    ...mapActions(useStore, ['cleanUser']),
    logOut() {
      localStorage.clear()
      this.cleanUser()
      this.$router.push("/")
    },
    register(){
      this.$router.push("/user-add")
    },
    logIn(){
      this.$router.push("/log-in")
    },
    profile(){
      this.$router.push("/profile")
    },
    index(){
      this.$router.push("/")
    },
    booksByType(tipo){
      this.$router.push("/books-type/" + tipo)
    },
    search(){
      this.$router.push("/search")
    }
  }
}
</script>

<template>
  <nav class="row">
    <div class="navar col-4 border-top border-bottom border-light">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="collapse navbar-collapse justify-content-xs-start justify-content-md-start justify-content-lg-start"
            id="navbarNavAltMarkup"
          >
            <div class="navbar-nav">
              <div class="dropdown">
                <a
                  class="nav-link dropdown-toggle text-start"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Libros
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <a class="dropdown-item" @click="booksByType('FIC')">Ficción</a>
                  <a class="dropdown-item" @click="booksByType('NO_FIC')">No Ficción</a>
                  <a class="dropdown-item" @click="booksByType('POE')">Poesía</a>
                  <a class="dropdown-item" @click="booksByType('TEA')">Teatro</a>
                  <a class="dropdown-item" @click="booksByType('INF')">Infantil</a>
                  <a class="dropdown-item" @click="booksByType('OTROS')">Otros</a>
                </div>
              </div>
              <div class="text-start">
                <a class="nav-link d-flex text-start search" @click="search"
                  ><span class="material-symbols-outlined"> search </span>Buscar</a
                >
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div
      class="navar-img col-4 border-top border-bottom border-light d-flex align-items-center justify-content-end text-center"
    >
    <div @click="index()">
      <img src="/Book__1.png" alt="booktok">
    </div>
    </div>
    <div
      class="navar-end col-4 border-top border-bottom border-light d-flex align-items-center justify-content-end text-center"
    >
      <div class="navbar-nav">
        <div class="dropdown align-items-center justify-content-end" style="color: rgba(0,0,0,.55)">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span class="material-symbols-outlined"> person </span>
          </a>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a v-if="!isAuthenticated" @click="logIn" class="dropdown-item" href="#">Iniciar Sesión</a>
            <a v-if="!isAuthenticated" @click="register" class="dropdown-item" href="#">Registrarse</a>
            <a v-if="isAuthenticated" @click="profile" class="dropdown-item" href="#">Perfil</a>
            <a v-if="isAuthenticated" @click="logOut" class="dropdown-item" href="#">Log Out</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped>
img{
  height: 20%;
  width: 20%;
  cursor: pointer;
}
.search{
  cursor: pointer;
}

.navar{
  background-color: #ffebcdb5;
  border-top-left-radius: 5px; 
  border-bottom-left-radius: 5px;
}

.navar-img{
  background-color: #ffebcdb5;
}

.navar-end{
  background-color: #ffebcdb5;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
