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
    }
  }
}
</script>

<template>
  <nav class="row">
    <div class="col-6 border-top border-bottom border-light bg-light">
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
            class="collapse navbar-collapse justify-content-md-start justify-content-lg-start"
            id="navbarNavAltMarkup"
          >
            <div class="navbar-nav">
              <div class="dropdown">
                <a
                  class="nav-link dropdown-toggle"
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
                  <a class="dropdown-item" href="#">Ficción</a>
                  <a class="dropdown-item" href="#">No Ficción</a>
                  <a class="dropdown-item" href="#">Poesía</a>
                  <a class="dropdown-item" href="#">Teatro</a>
                  <a class="dropdown-item" href="#">Infantil</a>
                  <a class="dropdown-item" href="#">Otros</a>
                </div>
              </div>
              <div class="text-center">
                <a class="nav-link d-flex align-items-center justify-content-center" href="#"
                  ><span class="material-symbols-outlined"> search </span>Buscar</a
                >
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div
      class="col-6 border-top border-bottom border-light bg-light d-flex align-items-center justify-content-end text-center"
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
            <a v-if="isAuthenticated" @click="profile(user.id)" class="dropdown-item" href="#">Perfil</a>
            <a v-if="isAuthenticated" @click="logOut" class="dropdown-item" href="#">Log Out</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped></style>
