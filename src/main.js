import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueSocketIO from 'vue-socket.io'

if (window.location.hostname.indexOf("a.zhongtengwang.cn") != -1) {
  Vue.use(new VueSocketIO({
    debug: false,
    connection: 'http://8.129.178.174:8086',
  }))
}else{
  Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://192.168.1.190:8086',
  }))
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
