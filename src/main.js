import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import App from './App'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

let app = ''

// initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyC5erlhCo7Q8U_DbNMRkmS-bDv3giYLZ28",
  authDomain: "holiday-planner-v2-fdd2e.firebaseapp.com",
  databaseURL: "https://holiday-planner-v2-fdd2e.firebaseio.com",
  projectId: "holiday-planner-v2-fdd2e",
  storageBucket: "holiday-planner-v2-fdd2e.appspot.com",
  messagingSenderId: "60781953191",
  appId: "1:60781953191:web:38d0aca3f18b7610"
})

// initialize the Vue app after we made sure Firebase is ready
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  }
})
