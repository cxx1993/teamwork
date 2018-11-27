import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import global from './utils/global'
import './plugins/iview.js'
import '@/assets/css/style.css'


Vue.config.productionTip = false
Vue.prototype.$global = global

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
