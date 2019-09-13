<template>
  <div class="singer" ref="singer">
    <MScroll class="listview" ref="listview" :data='singerList'>
      <!-- 歌手列表 -->
      <ul>
        <li v-for="(group, idx) in singerList" 
          class="list-group" 
          ref="listGroup" 
          :key="idx"
        >
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul>
            <li v-for="(item, idx) in group.items"     
              class="list-group-item" 
              :key="idx"
              @click='selectSinger(item)'
            >
              <img v-lazy="item.headImg" class="avatar">
              <span class="name">{{ item.sname }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- 检索列表 -->
      <div class='list-shortcut'>
        <ul>
          <li v-for='(item, idx) in getCheckIndex'
            @click='scrollTo(idx)'
            :key='idx'
          >{{ item }}</li>
        </ul>
      </div>
    </MScroll>
    <transition name='slide'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from "../api/singer"
import { ERR_OK } from "../common/js/config"
import MScroll from '../components/m-scroll'
import { mapMutations } from 'vuex'
import {playlistMixin} from '../common/js/mixin'
export default {
  mixins:[playlistMixin],
  data() {
    return {
      singerList: []
    };
  },
  components: {
    MScroll
  },
  computed: {
    getCheckIndex() {
      return this.singerList.map((obj, index)=>{
        return obj.title.slice(0,1)
      })
    }
  },
  methods: {
    ...mapMutations(['setSingerInfo']),
    // 获取歌手列表方法
    _getSingerList() {
      // mixins
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this.filterSingerList(res.data.list);
        }
      });
    },
    // 处理歌手列表方法
    filterSingerList(list) {
      let map = {
        hot: {
          title: "热门",
          items: []
        }
      };
      // 处理 歌手列表，取前十条数据为热门
      list.forEach((singer, index) => {
        if (index < 10) {
          map.hot.items.push({
            Fmid: singer.Fsinger_mid,
            sname: singer.Fsinger_name,
            headImg: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${
              singer.Fsinger_mid
            }.jpg?max_age=2592000`
          });
        }
        // 获取 A ~ Z  Findex
        let key = singer.Findex;
        if (!map[key]) {
          // 如果map里面没有对应的key,就创建一个
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push({
          Fmid: singer.Fsinger_mid,
          sname: singer.Fsinger_name,
          headImg: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${
            singer.Fsinger_mid
          }.jpg?max_age=2592000`
        });
      });
      // 把 map 对象转化成 有序 数组，[ 热门, A , B, ...Z ]
      let hot = []; // 存放热门
      let ret = []; // 存放 A ~ Z
      for (let item in map) {
        let value = map[item];
        if (value.title === "热门") {
          hot.push(map[item]);
        } else if (value.title.match(/[a-zA-Z]/)) {
          ret.push(map[item]);
        }
      }
      // 对 ret 排序
      ret.sort(function(a, b) {
        // 把字符串转化成 Unicode 号码在比较
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    // 点击检索字母快速检索方法 
    scrollTo(idx) {
      // 滚动到 检索下标 对应的 歌手列表 
      let currentList =  this.$refs.listGroup[idx]; 
      // 调用MScroll组件实例上的 scrollToElement() 
      this.$refs.listview.scrollToElement(currentList, 500)
    },
    selectSinger(sInfo){
      // 通过提交mutation type setSingerInfo 来赋值 
      this.setSingerInfo(sInfo);

      // sInfo -> 歌手信息 Fmid | sname | headImg
      this.$router.push({
        path: `/singer/${ sInfo.Fmid }` 
      })
    },
    handlePlayList(playList){
      const bottom = playList.length > 0 ? "60px" : ""
      this.$refs.singer.style.bottom = bottom
      this.$refs.listview.refresh();
    }
  },
  created() {
    this._getSingerList();
  }
};
</script>

<style scoped lang="stylus">
@import '../common/stylus/variable';

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;

  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s;
  }

  .slide-enter, .slide-leave-to {
    transform: translateX(100%);
  }

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;

    .list-group {
      padding-bottom: 30px;

      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: #f2f2f2;
      }

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }

        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium-x;
        }
      }
    }

    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: rgba(200, 200, 200, 0.1);
      font-family: Helvetica;

      .item {
        padding: 3px;
        line-height: 1;
        color: #333;
        font-size: $font-size-small;

        &.current {
          color: $color-theme;
        }
      }
    }

    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
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
