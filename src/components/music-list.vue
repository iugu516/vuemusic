<template>
  <div class="music-list" ref='musiclist'>
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImage" ref="bgImage">
      <div class="filter"></div>
    </div>
    <!-- 向上滚动背景层 -->
    <div class='bg-layer' ref='bglayer'></div> 
    <!-- song-list组件 -->
      <MScroll class="list" ref="list" :data="songs" :listenScroll="true" @scroll="scrollChange" :probeType='3'>
        <div class="song-list-wrapper">
          <song-list :songs="songs" @select='currentSong'></song-list>
        </div>
      </MScroll>
  </div>
</template>

<script>
import SongList from "./song-list.vue";
import MScroll from "./m-scroll";
import {playmode} from "../common/js/config"
import {mapActions,mapMutations} from 'vuex'
import {playlistMixin} from '../common/js/mixin'
export default {
  mixins:[playlistMixin],
  props: {
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    ...mapActions('player',['selectPlay']),
    ...mapMutations('player',['setPlayMode']),
    back() {
      this.$router.back();
    },
    // 触发向上滚动
    scrollChange(prop) {
      let zIndex = 0;
      let scale = 1;
      // 获取 bgImage 的height 和 图片的paddingTop 
      let bgHeight = this.$refs.bgImage.style.height;
      let paddingTop = this.$refs.bgImage.style.paddingTop;
      // 列表向上滚动的最大距离 (bgImage 的高度) + 40(歌手名字的高度)
      let offsetTop = Math.max(-this.bgTop + 40, prop.y)  
      // 设置 bglayer 的 y 轴向上滚动距离(负值)
      this.$refs.bglayer.style.transform = `translateY(${ offsetTop }px)`;
      this.$refs.bglayer.style.webkitTransform = `translateY(${ offsetTop }px)`;
      // 滚动距离 超过 最大滚动距离 
      if(prop.y < offsetTop) {
        zIndex = 10; // 设置bgImage 图层顺序在前面盖住文字
        paddingTop = 0; // 把图片的paddingTop设置为0
        bgHeight = `40px`; // 设置 bgImage 的高度 40px; 
      }else{
        // 滚动距离 不超过 最大距离, bgImage 值设置回去
        zIndex = 0;
        paddingTop = `70%`;
        bgHeight = 0;
      }
      // 计算 缩放的百分比 
      const percent = Math.abs(prop.y / this.bgTop)
      if(prop.y > 0) {
        scale = 1 + percent;
        zIndex = 10;
      }
      
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style.height = bgHeight;
      this.$refs.bgImage.style.paddingTop = paddingTop;
      // 设置缩放 
      this.$refs.bgImage.style.transform = `scale(${scale})`
      this.$refs.bgImage.style.webkitTransform = `scale(${scale})`
    },
    currentSong(song,idx){
      this.setPlayMode(playmode.order)
      this.selectPlay({
        list:this.songs,
        index:idx
      })
    },
    handlePlayList(playList){
      const bottom = playList.length > 0 ? "60px" : ""
      this.$refs.musiclist.style.bottom = bottom
      this.$refs.list.refresh();
    }
  },
  components: {
    SongList,
    MScroll
  },
  mounted() {
    // 获取图片高度
    this.bgTop = this.$refs.bgImage.clientHeight;
    // 设置 list 的 top 值
    this.$refs.list.$el.style.top = `${this.bgTop}px`;
  }
};
</script>

<style scoped lang="stylus">
@import '../common/stylus/variable';
@import '../common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #f2f2f2;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: #fff;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: #fff;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    // overflow: hidden;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(100%);
    }
  }
}
</style>