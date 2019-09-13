<template>
  <MScroll ref="suggest" class="suggest" :data="searchResult">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,idx) in searchResult" :key="idx" @click='currentSong(idx)'>
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ item.songname }} ~ {{ item.singer }}</p>
        </div>
      </li>
    </ul>
    <div class="no-result-wrapper" display="none">
      <!-- <no-result title="抱歉，暂无搜索结果"></no-result> -->
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </MScroll>
</template>
<script type="text/ecmascript-6">
import { getSearchResult } from "../api/search";
import { playmode } from "../common/js/config";
import { mapActions, mapMutations } from "vuex";
import getPlayKey from "../api/getPlayKey";
import Song from "../common/js/songs";
import { ERR_OK } from "../common/js/config";
import MScroll from "../components/m-scroll";
export default {
  data() {
    return {
      searchResult: []
    };
  },
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  watch: {
    query() {
      this._getResult();
    }
  },
  components: {
    MScroll
  },
  methods: {
    ...mapActions("player", ["selectPlay"]),
    ...mapMutations("player", ["setPlayMode"]),
    _getResult() {
      getSearchResult(this.query).then(res => {
        if (res.code === ERR_OK) {
          this.searchResult = this.getSongResult(res.data.song.list);
        }
      });
    },
    getSongResult(list) {
      let ret = [];
      let smid = []; // 存放songmid
      let purl = []; // 存放 purl
      // 1. 获取 songmid -> Arry
      list.forEach(item => {
        smid.push(item.songmid);
      });
      // 根据 songmid 请求 purl
      this._getPlayKey(smid).then(urlinfo => {
        // 遍历 urlinfo
        urlinfo.forEach(item => {
          purl.push(item.purl);
        });
        // 在根据 purl 去获取musicData, 拼接播放源 url,把url和musicData合并成一个对象
        list.forEach((item, index) => {
          if (purl[index]) {
            let dataUrl = `http://223.111.104.155/amobile.music.tc.qq.com/${purl[index]}`;
            // console.log(dataUrl)
            // 在 Song 类中结构对象返回 我们需要的 Song 实例
            let albummid = item.albummid;
            let albumname = item.albumname;
            let songid = item.songid;
            let songmid = item.songmid;
            let songname = item.songname;
            let singer = item.singer;
            let interval = item.interval;
            let url = dataUrl;
            ret.push(
              new Song({
                albummid,
                albumname,
                songname,
                songid,
                singer,
                songmid,
                interval,
                url
              })
            );
          }
        });
      });
      return ret;
    },
    _getPlayKey(songmid) {
      return getPlayKey(songmid).then(res => {
        if (res.code === ERR_OK) {
          // 把正确的数据异步输出
          return Promise.resolve(res.req_0.data.midurlinfo);
        } else {
          return Promise.reject("err");
        }
      });
    },
    currentSong(idx){
      this.setPlayMode(playmode.order)
      this.selectPlay({
        list:this.searchResult,
        index:idx
      })
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../common/stylus/variable';
@import '../common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>