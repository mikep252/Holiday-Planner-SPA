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
  apiKey: 'AIzaSyAsHyQC9F8HsX1k-7AAE9aD19ppBAO93FE',
  authDomain: 'holiday-planner-pwa.firebaseapp.com',
  databaseURL: 'https://holiday-planner-pwa.firebaseio.com',
  projectId: 'holiday-planner-pwa',
  storageBucket: 'holiday-planner-pwa.appspot.com',
  messagingSenderId: '364393874700',
  appId: '1:364393874700:web:7f84ee54a4909a2c'
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
