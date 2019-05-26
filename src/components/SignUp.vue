<template>
  <div class="sign-up">
    <h3>Create a new account</h3>
    <input type="text" placeholder="Email" v-model="email">
    <br>
    <input type="password" placeholder="Password" v-model="password">
    <br>
    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>{{ errorMessage }}</b-alert>
    <b-button variant="primary" @click="signUp">Sign Up</b-button>
    <p>
      Already have an account?
      <router-link to="/login">Login here!</router-link>
    </p>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'signUp',
  data () {
    return {
      email: '',
      password: '',
      showDismissibleAlert: false,
      errorMessage: ''
    }
  },
  methods: {
    signUp () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((user) => {
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
.sign-up {
  margin-top: 40px;
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
button {
  margin-top: 20px;
  width: 10%;
  cursor: pointer;
}
span {
  display: block;
  margin-top: 11px;
  font-size: 11px;
}
</style>
