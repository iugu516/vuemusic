<template>
  <div class="rank" ref="rank">
    <MScroll class="toplist" ref="toplist" :data="rankList">
      <ul>
        <li class="item" v-for="(item,idx) in rankList" :key="idx" @click='selectSinger(item)'>
          <ol class="songlist">
            <li class="song" v-for="(item1,idx) in item.songList" :key="idx">
              <b>{{idx+1}}.{{item1.songname}}</b>&nbsp;
              <span class="name">{{item1.singername}}</span>
            </li>
          </ol>
          <div class="icon">
            <img :src="item.picUrl" width="120" height="120" />
          </div>
        </li>
      </ul>
      <!-- loading -->
      <div class="loading-container" v-show="!rankList.length">
        <loading></loading>
      </div>
    </MScroll>
    <transition name='slide'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getRankList } from "../api/rank";
import MScroll from "../components/m-scroll";
import Loading from "../base/loading/loading";
import { mapMutations } from 'vuex'
import {playlistMixin} from '../common/js/mixin'
export default {
  mixins:[playlistMixin],
  data() {
    return {
      rankList: []
    };
  },
  components: {
    MScroll,
    Loading
  },
  methods: {
    ...mapMutations(['setSingerInfo']),
    _getRankList() {
      getRankList().then(res => {
        this.rankList = res.data.topList;
      });
    },
    selectSinger(sInfo){
      // 通过提交mutation type setSingerInfo 来赋值 
      this.setSingerInfo(sInfo);

      // sInfo -> 歌手信息 Fmid | sname | headImg
      this.$router.push({
        path: `/rank/${ sInfo.id }` 
      })
    },
    handlePlayList(playList){
      const bottom = playList.length > 0 ? "60px" : ""
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh();
    }
  },
  created() {
    this._getRankList();
  }
};
</script>

<style scoped lang="stylus">
@import '../common/stylus/variable';
@import '../common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 10px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 120px;

        img {
          border-radius: 0 8px 8px 0;
        }
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 120px;
        overflow: hidden;
        background: rgba(154, 217, 136, 0.3);
        color: $color-text-d;
        font-size: $font-size-medium-x;
        border-radius: 8px 0 0 8px;

        .song {
          no-wrap();
          line-height: 26px;

          .name {
            color: #888;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s;
  }

  .slide-enter, .slide-leave-to {
    transform: translateX(100%);
  }
}
</style>