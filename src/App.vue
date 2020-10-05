<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view/>
    </q-page-container>
    <q-footer elevated>
      <NowPlaying v-if="$route.path!='/' && $root.state!='idle' && $root.status.Qd!=0"></NowPlaying>
      <Footer></Footer>
    </q-footer>
  </q-layout>
</template>

<script>
import Footer from './components/Footer.vue'
import NowPlaying from './components/NowPlaying.vue'

export default {
  name: 'LayoutDefault',

  components: {
    Footer,
    NowPlaying
  },

  data () {
    return {
    }
  }
}
</script>

<style>
</style>
