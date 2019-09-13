<template>
  <div class="player" v-if="playList.length">
    <transition name="mormal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.albummid" />
        </div>
        <!-- 返回按钮和歌曲信息 -->
        <div class="top">
          <div class="back" @click="backMini">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.songname}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <!-- 中间播放的CD -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" :class="rotateCD">
                <img class="image" :src="currentSong.albummid" />
              </div>
            </div>
          </div>
        </div>
        <!-- 底部的按钮 -->
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{playTnterval(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <div>
                <ProgressBar :percent='percent' @percentChange='percentChange'></ProgressBar>
              </div>
            </div>
            <span class="time time-r">{{playTnterval(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" @click="togglePlay">
              <i :class="icontogglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
        <div class="icon" @click="openNormal">
          <img width="40" height="40" :src="currentSong.albummid" :class="rotateCD" />
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.songname}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control" @click="togglePlay">
          <i :class="icontoggleMiniPlay"></i>
        </div>
        <div class="control" @click="openNormal">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="readyPlay" @error="playErr" @timeupdate="timeUpdate" @ended="playEnd"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ProgressBar from "../base/progress-bar";
import {playmode} from "../common/js/config"
export default {
  data() {
    return {
      songReady: false,
      currentTime:0
    };
  },
  components: {
    ProgressBar
  },
  computed: {
    ...mapGetters("player", [
      "fullScreen",
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "playMode",
      "orderList"
    ]),
    rotateCD() {
      return this.playing ? "play" : "play pause";
    },
    icontogglePlay() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    icontoggleMiniPlay(){
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    iconMode(){
      return this.playMode === playmode.order ? "icon-sequence" : this.playMode === playmode.loop ? "icon-loop" :"icon-random"
    },
    percent(){
      return this.currentTime/this.currentSong.interval
    }
  },
  methods: {
    //通过提交Mutations来改变状态
    ...mapMutations("player", [
      "setFullScreen",
      "setPlaying",
      "setCurrentIndex",
      "setPlayMode",
      "setplayList",
      "setorderList"
    ]),
    backMini() {
      this.setFullScreen(false);
    },
    openNormal() {
      this.setFullScreen(true);
    },
    togglePlay() {
      this.setPlaying(!this.playing);
    },
    nextSong() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index == this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    prevSong() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    readyPlay() {
      this.songReady = true;
    },
    playErr() {
      this.songReady = false;
    },
    timeUpdate(e){
        this.currentTime = e.target.currentTime
    },
    playTnterval(t){
      let time  = Math.floor(t)
      let m = Math.floor(time/60)
      let s = time%60
      m <10 ? m='0'+m : m
      s <10 ? s='0'+s : s
      return `${m}:${s}`
    },
    percentChange(percent){
      let currentTime = this.currentSong.interval * percent
      this.$refs.audio.currentTime = currentTime
    },
    changeMode(){
      let mode = (this.playMode+1) % 3
      this.setPlayMode(mode)
      let list =null;
      if(this.playMode === playmode.random){
       list = this.randomList(this.orderList)
      }else{
        list = this.orderList
      }
      this.resetIndex(list)
      this.setplayList(list)
    },
    randomList(list){
      let _list = [...list]//数组克隆
      for(let i=0;i<_list.length;i++){
        let r = Math.floor(Math.random()*(i+1))
        let val = _list[i]
        _list[i] = _list[r]
        _list[r] = val
      }
      return _list
    },
    resetIndex(list){
      let cindex = list.findIndex((item)=>{
        return item.songid === this.currentSong.songid
      })
      this.setCurrentIndex(cindex)
    },
    playEnd(){
      if(this.playMode === playmode.loop){
        this.$refs.audio.currentTime =0;
        this.$refs.audio.play()
      }else{
        this.nextSong()
      }
    }
  },
  watch: {
    currentSong(newsong, oldsong) {
      if(newsong.songid === oldsong.songid){
        return;
      }
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        //确保audio src有值
        setTimeout(() => {
          audio.play();
        }, 200);
      });
    },
    playing(newval) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        newval ? audio.play() : audio.pause();
      });
    }
  }
};
</script>

<style scoped lang="stylus" >
@import '../common/stylus/variable';
@import '../common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.9;
      filter: blur(40px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: #f2f2f2;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: #f2f2f2;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: #f9f9f9;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: rgba(250, 250, 250, 0.7);
            font-size: $font-size-medium-x;

            &.current {
              color: #fff;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 20px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 86%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: #f2f2f2;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          margin: 0 10px;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: #31c27c;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>