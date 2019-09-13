import Vue from 'vue'
import Router from 'vue-router'
const Recommend = ()=> import('./views/recommend')
const Singer = ()=> import('./views/singer')
const Rank = ()=> import('./views/rank')
const Search = ()=> import('./views/search')
const SingerDetail = ()=> import('./views/singerDetail')
const RankDetail = ()=> import('./views/rankDetail.vue')
const RecommendDetail = ()=> import('./views/recommendDetail.vue')
Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecommendDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})