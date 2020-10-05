import Vue from 'vue'
import VueRouter from 'vue-router'
import Library from '../views/Library.vue'
import Playlist from "../views/Playlist.vue"
import Track from "../views/Track.vue"
import Community from "../views/Community.vue"
import CommunityPopular from "../views/CommunityPopular.vue"
import CommunityNewest from "../views/CommunityNewest.vue"
import CommunityPlaylists from "../views/CommunityPlaylists.vue"
import CommunityPlaylist from "../views/CommunityPlaylist.vue"
import Control from "../views/Control.vue"
import Home from "../views/Home.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: "Home",
    component: Home
  },
  {
    path: '/library',
    name: 'Library',
    component: Library
  },
  {
    path: "/library/playlist/:name",
    name: "Playlist",
    component: Playlist
  },
  {
    path: "/library/track/:name",
    name: "Track",
    component: Track
  },
  {
    path: "/community",
    name: "CommunityHome",
    component: Community
  },
  {
    path: "/community/popular",
    name: "CommunityPopular",
    component: CommunityPopular
  },
  {
    path: "/community/newest",
    name: "CommunityNewest",
    component: CommunityNewest
  },
  {
    path: "/community/playlists",
    name: "CommunityPlaylists",
    component: CommunityPlaylists
  },
  {
    path: "/community/playlist/:name/:id",
    name: "CommunityPlaylist",
    component: CommunityPlaylist
  },
  {
    path: "/control",
    name: "Control",
    component: Control
  }
]

const router = new VueRouter({
  routes
})

export default router
