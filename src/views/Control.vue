<template>
  <div class="home">
    <q-header elevated class="header bg-black text-white shadow-0">
      <q-toolbar>
        <q-toolbar-title class="text-center">Control</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-card style="margin: 2vw;" bordered class="my-card">
      <q-card-section>
        <div class="text-h6">Speed</div>
      </q-card-section>

      <q-card-section class="q-pt-none row justify-around items-center">
        <q-icon name="remove" style="font-size: 25px;"/>
        <q-slider color="black" style="width: 75% !important;" v-model="$root.status.rpm" :min="1" :max="20" label @change="$root.setSpeed" />
        <q-icon name="add" style="font-size: 25px;"/>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Brightness</div>
      </q-card-section>

      <q-card-section class="q-pt-none row justify-around items-center">
        <q-icon name="brightness_6" style="font-size: 19px;"/>
        <q-slider color="black" style="width: 75% !important;" v-model="$root.wledStatus.state.bri" :min="0" :max="255" label @change="$root.setBrightness"/>
        <q-icon name="brightness_7" style="font-size: 25px;"/>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Lighting Mode</div>
      </q-card-section>

      <q-card-section class="q-pt-none row justify-around items-center">
        <q-select  style="width: 95% !important;" outlined v-model="lightingMode" :options="this.$root.wledStatus.effects" color="black">
          <template v-slot:append v-if="lightingMode=='Solid'">
          <q-icon @click.stop name="colorize" :style="'color: ' + solidcolor" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="solidcolor" />
            </q-popup-proxy>
          </q-icon>
        </template>
        </q-select>
      </q-card-section>
    </q-card>
    <q-card style="margin: 2vw;" bordered class="my-card">
      <q-card-section class="row justify-between">
        <div class="text-h6">Commands</div>
        <div class="text-h6">{{ $root.status.Qd }} in queue</div>
      </q-card-section>

      <q-card-section class="q-pt-none row justify-around">
        <q-btn color="black" icon="home" @click="sendGcode('G28');" label="Home"/>
        <q-btn color="black" icon="stop" @click="stop();" label="Halt"/>
        <q-btn color="black" icon="power" @click="reset();" label="Reset"/>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss">
.header {
  padding-top: 4pt;
  padding-bottom: 4pt;
}

.home__item {
  padding-top: 3pt !important;
  padding-bottom: 3pt !important;

  &-title {
    font-size: 14pt !important;
    letter-spacing: 0.5pt !important;
  }
  &-subtitle {
    font-size: 12pt;
  }
}
</style>

<script>
import axios from "axios"

export default {
  name: 'Control',
  components: {
  },
  data: function() {
    return {
      patterns: [],
      playlists: [],
      solidcolor: '',
      speed: 7,
      lightingMode: null
    }
  },
  methods: {
    stop: function() {
      axios.get(this.$root.baseURL + "/exec/stop");
      this.$toasted.success('Robot halted', {
        duration: 750
      })
    },
    componentToHex: function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    hexToRgb: function(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    home: function() {
      axios.get(this.$root.baseURL + "/exec/G28");
      this.$toasted.success('Homing in progress', {
        duration: 750
      })
    },
    reset: function() {
      axios.get(this.$root.baseURL + "/reset");
      this.$toasted.success('Robot reset, please exit and reopen app', {
        duration: 750
      })
    }
  },
  mounted: function() {
    this.speed = this.$root.status.rpm;
    this.lightingMode = this.$root.wledStatus.effects[this.$root.wledStatus.state.seg[0].fx];
    this.solidcolor = this.rgbToHex(this.$root.wledStatus.state.seg[0].col[0][0], this.$root.wledStatus.state.seg[0].col[0][1], this.$root.wledStatus.state.seg[0].col[0][2]);
  },
  watch: {
    solidcolor: function(val) {
      const newR = this.hexToRgb(val).r;
      const newG = this.hexToRgb(val).g;
      const newB = this.hexToRgb(val).b;

      if(newR != this.$root.wledStatus.state.seg[0].col[0][0] || newG != this.$root.wledStatus.state.seg[0].col[0][1] || newB != this.$root.wledStatus.state.seg[0].col[0][2]) {
        axios.post(this.$root.wledURL + "/json/state", {seg: [{ col: [
            [newR, newG, newB]
          ]
        }]});
      }
    },
    lightingMode: function(val) {
      if(this.$root.wledStatus.effects.indexOf(val) != this.$root.wledStatus.state.seg[0].fx) {
        //update effect
        axios.post(this.$root.wledURL + "/json/state", {seg: [{fx: this.$root.wledStatus.effects.indexOf(val)}]});
      }
    }
  }
}
</script>
