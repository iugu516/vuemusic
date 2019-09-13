<template>
  <div>
    <m-header></m-header>
    <m-tab></m-tab>
    <!-- 四大组件的渲染出口 -->
    <keep-alive>
      <router-view></router-view>    
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from './components/m-header'
import MTab from './components/m-tab'
import Player from './components/player'
export default {
  components: {
    MHeader,
    MTab,
    Player
  }
}
</script>