<template>
  <div class="home">
    <q-header elevated class="header bg-black text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center" v-if="$root.state=='idle'">Nothing Playing</q-toolbar-title>
        <q-toolbar-title class="text-center" v-if="$root.state!='idle'&&$root.status.Qd!=0">SandSPA</q-toolbar-title>
        <q-toolbar-title class="text-center" v-if="$root.state!='idle'&&$root.status.Qd==0">Last Played</q-toolbar-title>
      </q-toolbar>
      <q-toolbar style="height: 5px !important; margin-top: -25px;" v-if="$root.status.playlist!='false'">
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
        <img style="width: 80vw" :src="'https://webcenter.sisyphus-industries.com/uploads/track/thr/' + $root.status.file.split('-')[0].replace('sd/', '') + '/thumb_400.png'"><br>
        <div class="text-h6">{{ $root.status.file.replace("sd/", "").split('-')[1].replace(".thr", "") }}</div><br>
        <q-btn @click="$root.pause()" v-if="$root.state=='playing'&&$root.status.Qd!=0" round color="black" size="lg" icon="pause" />
          <q-btn @click="$root.play()" v-if="$root.state=='paused'&&$root.status.Qd!=0" round color="black" size="lg" icon="play_arrow" />
      </q-card-section>
      <q-card-section class="q-pt-none text-h6" style='padding-top:1vh;' v-if="$root.status.playlist=='trued'">
        Next Up<br>
        <q-list separator style='margin-top:2vh;'>
          <q-item clickable v-ripple v-for="pattern in nextup" :key="pattern.name">
            <q-item-section avatar>
              <img height="60px" :src="'https://webcenter.sisyphus-industries.com/uploads/track/thr/' + pattern.name.split('-')[0].replace('sd/', '') + '/thumb_400.png'">
            </q-item-section>
            <q-item-section>
              <q-item-label class="home__item-title">{{pattern.name.split("-")[1].replace(".THR", "").replace(".thr", "")}}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-btn @click.stop="patterns.splice(i, 1)" v-if="editing==true" round flat color="white" text-color="black" size="lg" icon="remove" />
            </q-item-section>
          </q-item>
        </q-list>
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
      nextup: []
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
