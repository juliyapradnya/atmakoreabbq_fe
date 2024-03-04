import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import axios from 'axios'
import VueMoment from "vue-moment";
import moment from "moment-timezone";

Vue.config.productionTip = false

moment.tz.guess();
Vue.use(VueMoment, { moment });

Vue.prototype.$http = axios;
//Vue.prototype.$api = 'http://127.0.0.1:8000/api';
Vue.prototype.$api = 'https://akbresto.juliyapradnya.my.id/api';

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')