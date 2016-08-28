import Vue from 'vue'
import App from './App.vue'
//import VueDeepstramConnector from '/home/rico/copy/dev/deepstream/vue-deepstream-connector/src/vdc.js'
import VueDeepstramConnector from 'vue-deepstream-connector'
import VueCharts from 'vue-charts'

var production = true;

if (production === false) {
    Vue.config.debug = true;
    Vue.config.devtools = true;
}

Vue.use(VueCharts)

Vue.use(VueDeepstramConnector)

new Vue({
    ds: {
        connectionUrl: '163.172.171.82:6020',
        options: {
            //deepstream client connection options
            //find them here: https://deepstream.io/docs/client-js/options/
        }
    },
    el: 'body',
    components: { App }
})