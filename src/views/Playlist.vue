<template>
  <div class="home">
    <q-header elevated class="header bg-black text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="$router.go(-1)"/>
        <q-toolbar-title class="text-center" v-if="$route.params.name == 'All Tracks.seq'">{{$route.params.name.replace(".seq", "")}}</q-toolbar-title>
        <q-toolbar-title @click="renameAction()" class="text-center" v-if="$route.params.name != 'All Tracks.seq'">{{$route.params.name.split("-")[1].replace(".seq", "")}}</q-toolbar-title>
        <q-btn @click="editing=!editing" v-if="$route.params.name != 'All Tracks.seq' && editing == false" flat round dense icon="create" class="q-mr-sm"/>
        <q-btn @click="editing=!editing; saveEdits()" v-if="$route.params.name != 'All Tracks.seq' && editing == true" flat round dense icon="check" class="q-mr-sm"/>
        <q-btn v-if="$route.params.name == 'All Tracks.seq'" flat round class="q-mr-sm"/>
      </q-toolbar>
      <q-toolbar v-if="$route.params.name != 'All Tracks.seq'" style="padding-top: 0; min-height: 25px;" class="justify-center">
        <q-btn v-if="editing==false" outline rounded color="white" flat icon="play_arrow" @click="$root.playFile('/sd/' + $route.params.name)"/>
        <q-btn v-if="editing==true" outline rounded color="white" flat icon="delete" @click="$root.deleteFile('/sd/' + $route.params.name);$router.go(-1);$toasted.success('Deleted Playlist', {duration: 1500})"/>
      </q-toolbar>
    </q-header>

    <q-dialog v-model="renameprompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Rename Playlist</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input color="black" dense v-model="name" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-black">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Rename" @click="renamePlaylist()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <q-list bordered separator v-if="loaded">
      <draggable v-bind="dragOptions" v-model="patterns">
        <q-item style="border-bottom: 1px solid #ccc" clickable v-ripple v-for="(pattern,i) in patterns" :key="pattern.id" @click.stop="openTrack(pattern.name)">
          <q-item-section avatar>
            <img height="100px" :src="'https://webcenter.sisyphus-industries.com/uploads/track/thr/' + pattern.name.split('-')[0].replace('sd/', '') + '/thumb_400.png'">
          </q-item-section>
          <q-item-section>
            <q-item-label class="home__item-title">{{pattern.name.split("-")[1].replace(".THR", "").replace(".thr", "")}}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn @click.stop="patterns.splice(i, 1)" v-if="editing==true" round flat color="white" text-color="black" size="lg" icon="remove" />
          </q-item-section>
        </q-item>
      </draggable>
    </q-list>
  </div>
</template>

<script>
import axios from "axios"
import draggable from 'vuedraggable'

export default {
  name: 'Playlist',
  components: {
    draggable
  },
  data: function() {
    return {
      patterns: [],
      loaded: false,
      editing: false,
      renameprompt: false,
      name: ""
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        disabled: !this.editing,
        ghostClass: "ghost"
      };
    },
  },
  methods: {
    renameAction: function() {
      if(this.editing == true) {
        this.renameprompt = true;
      }
    },
    renamePlaylist: async function() {
      this.$q.loading.show({
        delay: 100 // ms
      })

      await this.$root.deleteFile("/sd/" + this.$route.params.name);
      let playlistFile = "";
      this.patterns.forEach((pattern) => {
        playlistFile += pattern.name + "\n";
      })

      var formData = new FormData();
      var blob = new Blob([playlistFile], {type: "text/plain"});
      formData.append("file", blob, this.$route.params.name.split("-")[0] + "-" + this.name.replace(/-/g, "") + ".seq");
      await axios.post(this.$root.baseURL + "/uploadtofileman", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
      this.$q.loading.hide()
      this.$router.go(-1);
      this.$toasted.success('Renamed!', {
        duration: 1500
      })
    },
    openTrack: function(pname) {
      if(this.editing == false) {
        this.$router.push("/library/track/" + pname);
      }
    },
    saveEdits: async function() {
      this.$q.loading.show({
        delay: 100 // ms
      })
      let playlistFile = "";
      this.patterns.forEach((pattern) => {
        playlistFile += pattern.name + "\n";
      })

      var formData = new FormData();
      var blob = new Blob([playlistFile], {type: "text/plain"});
      formData.append("file", blob, this.$route.params.name);
      await axios.post(this.$root.baseURL + "/uploadtofileman", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
      this.$q.loading.hide()
      this.$toasted.success('Changes saved!', {
        duration: 750
      })
    },
    refreshFiles: async function(done) {
        if(this.$root.community.authToken == "") {
          //Log in to Webcenter
          await axios.post("https://webcenter.sisyphus-industries.com/auth_user", {
              email: this.$root.community.email, password: this.$root.community.password
          }).then((resp) => {
              this.$root.community.authToken = resp.data.resp[0].auth_token;
          });
        }

        this.patterns = [];
        if(this.$route.params.name != "All Tracks.seq") {
            await axios.get(this.$root.baseURL + "/files/sd/" + this.$route.params.name).then((response) => {
                const ptrns = response.data.split("\n");
                ptrns.forEach(file => {
                    if(file != "") {
                        this.patterns.push({ name : file, size: 1234 });
                    }
                });
            });
        } else {
            await axios.get(this.$root.baseURL + "/filelist").then(async (response) => {
                response.data.files.forEach(async (file) => {
                    if(file.name.includes(".THR") || file.name.includes(".thr")) {
                        //const trackdata = (await axios.get("https://webcenter.sisyphus-industries.com/tracks/" + file.name.replace(".THR", "") + ".json", { headers: {Authorization: this.$root.community.authToken }})).data;
                        this.patterns.push(file);
                        //console.log(trackdata);
                    }
                });
            });
        }
        done();
    }
  },
  mounted: async function() {
    if(this.$route.params.name != "All Tracks.seq") {
      this.name = this.$route.params.name.split("-")[1].replace(".seq", "")
    }
    this.$q.loading.show({
        delay: 100 // ms
    })
    await this.refreshFiles(function() {});
    this.$q.loading.hide();
    this.loaded = true;
  }
}
</script>
