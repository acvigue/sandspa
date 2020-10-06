<template>
  <div class="bg-black text-white row justify-center items-center nowplaying__container">
      <div class="col" @click="$router.push('/')">
        <div v-if="$root.status.playlist=='true'" class="nowplaying__container-topline">Playing from {{$root.status.playlistName.split("-")[1].replace('sd/', '').replace(".seq", "")}}</div>
        <div v-if="$root.status.playlist=='false'" class="nowplaying__container-topline">Now Playing</div>
        <div class="nowplaying__container-trackname">{{$root.status.file.split("-")[1].replace(".THR", "").replace(".thr", "")}}</div>
      </div>
    <div>
      <q-btn @click.stop="$root.pause()" v-if="$root.state=='playing'" round color="black" size="lg" icon="pause" />
      <q-btn @click.stop="$root.play()" v-if="$root.state=='paused'" round color="black" size="lg" icon="play_arrow" />
    </div>
  </div>
</template>

<style lang="scss">
.nowplaying__container {
  padding-right: 15pt;
  padding-left: 15pt;
  padding-top: 4pt;
  padding-bottom: 4pt;
  border-bottom: 1px solid #fff;

  &-trackname {
    font-size: 14pt;
    letter-spacing: 0.7pt;
    font-weight: 500;
  }

  &-topline {
    font-size: 10pt;
    letter-spacing: 0.5pt;
    font-weight: 700;
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: 'nowplaying',
  data: function() {
    return {
      filename: ""
    }
  },
  methods: {
    async getFilename(trackid) {
      const trackdata = (await axios.get("https://webcenter.sisyphus-industries.com/tracks/" + trackid + ".json", { headers: {Authorization: this.$root.community.authToken }})).data;
      this.filename = trackdata.name;
    }
  },
}
</script>
