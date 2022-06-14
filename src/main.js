import Vue from 'vue'
import App from './App.vue'
import rightContext from "./components/rightContext.js"
Vue.config.productionTip = false

Vue.use(rightContext)
new Vue({
  render: h => h(App),
}).$mount('#app')
