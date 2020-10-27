import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './quasar'
import VueSSE from 'vue-sse';
import axios from "axios";
import Toasted from 'vue-toasted';
 
Vue.use(Toasted)
Vue.use(VueSSE);

Vue.config.productionTip = false
const ipaddr = "http://sandy.int.vigue.me";
const wledhost = "http://wled-wled.int.vigue.me";
const username = "acvigue@me.com";
const password = "Goober312$";

Vue.prototype.$log = console.log;
new Vue({
  router,
  data: function() {
    return {
      state: "playing",
      baseURL: ipaddr,
      wledURL: wledhost,
      community: {
        email: username,
        password: password,
        authToken: ""
      },
      sse: null,
      status: null,
      wledStatus: {
        state: {
          bri: 0
        }
      },
      webcentertrackname: ""
    }
  },
  methods: {
    pause: function() {
      axios.get(ipaddr + "/exec/pause");
    },
    play: function() {
      axios.get(ipaddr + "/exec/resume");
    },
    playFile: function(file) {
      axios.get(ipaddr + "/playFile" + file);
    },
    deleteFile: function(file) {
      axios.get(ipaddr + "/deleteFile" + file);
    },
    setSpeed: function(speed) {
      axios.get(ipaddr + "/setrpm/" + speed);
      this.$toasted.success("Set speed!", {duration: 1500})
    },
    setBrightness: function(brightness) {
      //{"on":true,"bri":255}
      const stateObj = {
        on: (brightness == 0) ? false : true,
        bri: (brightness == 0) ? 1 : brightness
      };
      axios.post(wledhost + "/json/state", stateObj)
    },
    updateWLED: function() {
      axios.get(wledhost + "/json").then((resp) => {
        this.wledStatus = resp.data;
      });
    }
  },
  mounted: function () {
    this.updateWLED();
    setInterval(this.updateWLED, 3000);
    axios.get(ipaddr + "/status").then((resp) => {
      this.status = resp.data;
    })
    this.$sse(ipaddr + "/events", { format: 'json' }) // or { format: 'plain' }
      .then(sse => {
      // Store SSE object at a higher scope
      this.sse = sse;

      // Catch any errors (ie. lost connections, etc.)
      sse.onError(e => {
        console.error('lost connection; giving up!', e);

        // This is purely for example; EventSource will automatically
        // attempt to reconnect indefinitely, with no action needed
        // on your part to resubscribe to events once (if) reconnected
        //sse.close();
      });

      // Listen for messages based on their event (in this case, "chat")
      sse.subscribe('status', (message, rawEvent) => {
        this.status = message;
      });
    })
  },
  watch: {
    status: function(val) {
      //Play/pause state

      if(val.pause == 0 && val.file != "") {
        this.state = "playing"
      } else if(val.pause == 1 && val.file != "") {
        this.state = "paused"
      } else {
        this.state = "idle"
      }
    }
  },
  render: h => h(App)
}).$mount('#app')
