<template>
  <div class="home">
    <q-header elevated class="header bg-black text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center" v-if="$root.state=='idle'">Nothing Playing</q-toolbar-title>
        <q-toolbar-title class="text-center" v-if="$root.state!='idle'&&$root.status.Qd!=0">SandSPA</q-toolbar-title>
        <q-toolbar-title class="text-center" v-if="$root.state!='idle'&&$root.status.Qd==0">Finished Playing</q-toolbar-title>
      </q-toolbar>
      <q-toolbar style="height: 5px !important; margin-top: -20px;" v-if="$root.status.playlist!='false'">
          <q-toolbar-title class="text-center text-grey-4" v-if="$root.state!='idle'&&$root.status.Qd!=0">Playing from {{$root.status.playlistName.replace("sd/","").replace(".seq","").split("-")[1] }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-card v-if="$root.state=='idle'" style="margin: 2vw;" bordered class="my-card">
      <q-card-section>
        <div class="text-h6 text-center"><q-icon  style="font-size: 4.4em;" name="sentiment_dissatisfied" color="black"/></div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center text-h6">
        Nothing is currently playing
      </q-card-section>
    </q-card>

    <q-card v-if="$root.state!='idle'" style="margin: 2vw;" bordered class="my-card">
      <q-card-section class="text-center">
        <img style="width: 80vw" :src="'https://webcenter.sisyphus-industries.com/uploads/track/thr/' + $root.status.file.split('-')[0].replace('sd/', '') + '/thumb_400.png'">
      </q-card-section>

      <q-card-section class="q-pt-none text-center text-h6">
        {{ $root.status.file.replace("sd/", "").split('-')[1].replace(".thr", "") }}
      </q-card-section>

      <q-card-section class="row justify-around">
          <q-btn @click="$root.pause()" v-if="$root.state=='playing'" round color="black" size="lg" icon="pause" />
          <q-btn @click="$root.play()" v-if="$root.state=='paused'" round color="black" size="lg" icon="play_arrow" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import axios from "axios"
import draggable from 'vuedraggable'

export default {
  name: 'Home',
  components: {
    draggable
  },
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  mounted: async function() {
  }
}
</script>
