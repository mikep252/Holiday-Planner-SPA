<template>
  <div class="login">
    <h3>Sign In</h3>
    <input type="text" placeholder="Email" v-model="email">
    <br>
    <input type="password" placeholder="Password" v-model="password">
    <br>
    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>{{ errorMessage }}</b-alert>
    <b-button variant="primary" @click="login">Log in</b-button>
    <p>
      or Sign In with Google
      <br>
      <b-button @click="googleLogin" class="social-button">
        <img alt="Google Logo" src="../assets/google-logo.png">
      </b-button>
    </p>
    <p>
      Don't have an account?
      <router-link to="/sign-up">Create one!</router-link>
    </p>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      showDismissibleAlert: false,
      errorMessage: ''
    }
  },
  methods: {
    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.$router.go('home')
        }).catch((error) => {
          this.errorMessage = error.message
          this.showDismissibleAlert = true
        })
    },
    googleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          this.$router.go('home')
        }).catch((error) => {
          this.errorMessage = error.message
          this.showDismissibleAlert = true
        })
    }
  }
}
</script>

<style scoped>
.login {
  margin-top: 40px;
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
p {
  margin-top: 40px;
  font-size: 13px;
}
p a {
  text-decoration: underline;
  cursor: pointer;
}
.social-button {
  width: 75px;
  background: white;
  padding: 10px;
  border-radius: 100%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  outline: 0;
  border: 0;
}
.social-button:active {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.social-button img {
  width: 100%;
}
</style>
