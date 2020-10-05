<template>
  <div class="home">
    <q-header elevated class="header bg-black text-white shadow-0">
      <q-toolbar>
        <q-toolbar-title>Control</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-pull-to-refresh color="white" bg-color="black" @refresh="refreshFiles">
      <q-list bordered separator>
        <q-item clickable v-ripple v-for="playlist in playlists" :key="name" @click.native="openPlaylist(playlist.name)">
          <q-item-section>
            <q-item-label class="home__item-title" overline>{{playlist.name.replace(".seq", "")}}</q-item-label>
            <q-item-label class="home__item-subtitle" v-if="playlist.name != 'All Tracks.seq'">{{playlist.itemCount}} tracks</q-item-label>
            <q-item-label class="home__item-subtitle" v-if="playlist.name == 'All Tracks.seq'">{{patterns.length}} tracks</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-pull-to-refresh>
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
      playlists: []
    }
  },
  methods: {
    openPlaylist: function(pname) {
      this.$router.push("/playlist/" + pname);
    },
    refreshFiles: async function(done) {
      this.patterns = [];
      this.playlists = [];
      await axios.get(this.$root.baseURL + "/filelist").then((response) => {
        response.data.files.forEach(file => {
          if(file.name.includes(".thr")) {
            //thr
            this.patterns.push(file);
          } else if(file.name.includes(".seq")) {
            //sequence / playlist
            axios.get(this.$root.baseURL + "/files/sd/" + file.name).then((response) => {
              const lines = response.data.split("\n");
              file.itemCount = lines.length - 1; 
              this.playlists.push(file);
            })
          }
        });
      });
      this.playlists.push({name: "All Tracks.seq"});
      done();
    }
  },
  mounted: function() {
    this.refreshFiles();
  }
}
</script>
