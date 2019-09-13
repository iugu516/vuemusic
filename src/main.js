// 引入 vue.js
import Vue from 'vue'
// 引入 根组件 APP
import App from './App.vue'
import router from './router'
import store from './store'
import Router from 'vue-router'
import fastclick from 'fastclick';
// 作用于整个页面
fastclick.attach(document.body)

// 引入主样式 
import './common/stylus/index.styl'
// 使用 vant 组件库的轮播组件 
import { Swipe, SwipeItem,Lazyload} from 'vant';

Vue.use(Swipe).use(SwipeItem).use(Lazyload,{
  loading:require('./common/images/qq2.png')
});

// 创建一个 实例 
new Vue({
  router,
  store, 
  render: h => h(App)
}).$mount('#app');
