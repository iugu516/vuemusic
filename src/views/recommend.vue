<template>
  <div class="recommend" ref='recommend'>
    <MScroll class="recommend-content" :data='hotRecomList' ref='recontent'>
      <div>
        <!-- 轮播图 -->
        <div class="slider-wrapper">
          <m-slide :slideList="slideList"></m-slide>
        </div>
        <!-- 热门歌曲列表 -->
        <div class="recommend-list" v-if="hotRecomList.length">
          <h1 class="list-title">民谣歌曲推荐</h1>
          <ul>
            <li
              v-for="(item, idx) in hotRecomList"
              :key="idx"
              class="item"
              :class="[(idx + 1) % 2 === 1 ? 'p-left': 'p-right']"
              @click='selectSinger(item)'
            >
              <div class="icon">
                <img v-lazy="item.imgurl" class="recom-img">
              </div>
              <div class="text">
                <h2 class="desc">{{ item.dissname }}</h2>
                <p class="name">{{ item.creator.name }}</p>
              </div>
            </li>
          </ul>
        </div>
        <!-- loading -->
        <div class="loading-container" v-show="!hotRecomList.length">
          <loading></loading>
        </div>
      </div>
    </MScroll>
    <router-view></router-view>
  </div>
</template>

<script>
import MSlide from "../base/m-slide";
import { getSlideList, getHotRecom } from "../api/recommend.js";
import { ERR_OK } from "../common/js/config";
import Loading from "../base/loading/loading";
import MScroll from "../components/m-scroll";
import { mapMutations } from 'vuex'
import {playlistMixin} from '../common/js/mixin'
export default {
  mixins:[playlistMixin],
  data() {
    return {
      slideList: [],
      hotRecomList: []
    };
  },
  components: {
    MSlide,
    Loading,
    MScroll
  },
  methods: {
    ...mapMutations(['setSingerInfo']),
    _getSlideList() {
      // 调用接口，请求数据
      getSlideList().then(res => {
        if (res.code === ERR_OK) {
          this.slideList = res.data.slider;
        }
      });
    },
    _getHotRecom() {
      getHotRecom().then(res => {
        if (res.code === ERR_OK) {
          this.hotRecomList = res.data.list;
        }
      });
    },
    selectSinger(sInfo){
      // 通过提交mutation type setSingerInfo 来赋值 
      this.setSingerInfo(sInfo);

      // sInfo -> 歌手信息 Fmid | sname | headImg
      this.$router.push({
        path: `/recommend/${ sInfo.dissid }` 
      })
    },
    handlePlayList(playList){
      const bottom = playList.length > 0 ? "60px" : ""
      this.$refs.recommend.style.bottom = bottom
      this.$refs.recontent.refresh();
    }
  },
  created() {
    // 请求的逻辑不能直接写在其中
    this._getSlideList();
    // 测试
    this._getHotRecom();
  }
};
</script>

<style scoped lang="stylus" >
@import '../common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      height: 100%;
      overflow: hidden;
      position: relative;

      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-theme;
      }

      .item {
        display: inline-flex;
        box-sizing: border-box;
        align-items: center;
        flex-direction: column;
        width: 50%;

        .icon {
          flex: 0 0 60px;
          max-width: 160px;

          .recom-img {
            border-radius: 10px;
            max-width: 160px;
          }
        }

        .text {
          line-height: 20px;
          font-size: $font-size-medium;
          max-width: 160px;
          margin-top: 6px;

          .name {
            margin-bottom: 10px;
            color: #888;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }

      .p-left {
        padding-left: 10px;
      }

      .p-right {
        padding-right: 10px;
      }
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(100%);
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