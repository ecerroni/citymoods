<template>
  <div id="app">
  <vue-helmet
    title='City Moods'
    :meta="{'description': 'Twitter moods for your city'}"
    :html-attributes='{"viewport": "width=device-width, initial-scale=1"}'
    ></vue-helmet>
   <cm-header></cm-header>
   <div v-if=logged>
    <map :cities='cities'></map>

    <modal :show.sync="showModal" :moods='city' :rows='values' keep-alive>
     <h3 slot="header">{{city.name  | capitalize}}</h3>
    </modal>
   </div>
   <div v-else>
    <p class="loading">Loading...</p>
   </div>
   <cm-footer></cm-footer>
  </div>
</template>

<script>
import VueHelmet from 'vue-helmet'

import Modal from './components/Modal.vue'
import Map from './components/Map.vue'
import CmHeader from './components/Header.vue'
import CmFooter from './components/Footer.vue'

const cities = require('./assets/cities.json');

export default {
  created: function(){
    let self = this;
    this.$dsLogin({username: 'web', password: 'test'}, function(logged) {
      self.logged = logged
    })
    const cityList = this.$ds.record.getList('cities');
    cityList.setEntries(cities);
    console.log('cities', cities)
  },
  ready: function(){
    console.log('App ready!')
  },
  data () {
    return {
      logged: false,
      city: {},
      showModal: false,
      values: [],
   }
 },
 sync: {
   cities: function(){
     return this.$dsListFetchReadOnly('cities')
   }
 },
 methods:{
   login: function () {
     let self = this;
     this.$dsLogin({username: 'web', password: 'test'}, function(logged) {
       self.logged = logged
     })
   },
   logout: function () {
     this.logged = this.$dsLogout()
   },
   passData: function (city) {
   //
   }

 },
 events: {
   'passModal': function (city) {
      this.city = city
      this.values = city.timeline

      this.showModal = true;
    },
    'closeModal': function () {
      //this.showModal = false
    }
 },
 components: {
   vueHelmet: VueHelmet,
   cmHeader: CmHeader,
   cmFooter: CmFooter,
   map: Map,
   modal: Modal
 }
}
</script>

<style>
@font-face {
    font-family:"NeuropoliticalRegular";
    src: url("assets/fonts/neuropolitical.ttf") /* TTF file for CSS3 browsers */
}

body {
  font-family: Helvetica, sans-serif;
}

.loading {
  position: absolute;
  top: 50px;
}
</style>