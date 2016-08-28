<template>
    <div class="modal-mask" v-show="show" transition="modal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
            <vue-chart
                        :columns="columns"
                        :rows="rows"
                        :options="options"
                    ></vue-chart>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <div v-for="(index, tweet) in moods.tweets" v-if="currentTweet==index">
                <p class='tweet'>{{tweet}}</p>
              </div>
              <p>{{moods.name | capitalize}}: last {{moods.timeline.length/5}} minutes</p>
              <p>From {{moods.start}} we analyzed #{{moods.total}} tweets [neutral: {{moods.neutral}} | positive: {{moods.positive}} | negative: {{moods.negative}}]</p>
              <div class="modal-default-button"
                @click="show = false">
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
let rotateTweets
export default {
  props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      moods: {
        type: Object
      },
      rows: {
        type: Array
      }
    },
    ready: function () {
     this.$watch('show', function(newVal, oldVal){
     let self = this

       if (newVal == true) {
         rotateTweets = setInterval(function(){
           self.currentTweet++

           if (self.currentTweet > 14) {
             self.currentTweet = 0
           }
         }, 3000)
       } else if (newVal == false) {
         //self.currentTweet = 0
         clearInterval(rotateTweets)
       }
     })
    },
    data () {
           return {
                    currentTweet: 0,
                    columns: [{
                        'type': 'string',
                        'label': '%'
                    }, {
                        'type': 'number',
                        'label': 'Positive'
                    }, {
                        'type': 'number',
                        'label': 'Negative'
                    }, {
                        'type': 'number',
                        'label': 'Neutral'
                        }
                    ],

                    options: {
                        title: "City's Moods",
                        hAxis: {
                            title: 'Time',
                            minValue: '',
                            maxValue: ''
                        },
                        vAxis: {
                            title: '%',
                            minValue: 0,
                            maxValue: 100
                        },
                        width: 600,
                        height: 300,
                        curveType: 'function'
            }
        }
     },
     methods: {

     }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 700;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  position: absolute;
  top: 50%;
  right: 20px;
  background-color: #42b983;
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
.modal-default-button::before {
    content: "X";
    position: relative;
      top: 2px;
      left: 10px;
      font-size: 42px;
      color: white;
}

/*
 * the following styles are auto-applied to elements with
 * v-transition="modal" when their visiblity is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.tweet {
  background-color: #eee;
}
</style>