<template>
  <div id="app">
    <b-navbar variant="light">
      <b-navbar-brand href="#">🌴 Holiday Planner 🛩</b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-button v-if="user" @click="logout" variant="outline-secondary">Logout</b-button>
        <b-button v-else @click="$router.push('login')" variant="outline-primary">Log In</b-button>
      </b-navbar-nav>
    </b-navbar>
    <main>
      <img src="./assets/logo.png" alt="Holiday Planner">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'app',
  data () {
    return {
      user: firebase.auth().currentUser
    }
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.$router.go('login')
      })
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495e;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 0.02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
