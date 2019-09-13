<template>
  <div class="search">
    <div class="search-box-wrapper">
      <Searchbox ref='searchBox' @queryChange='queryChange'></Searchbox>
    </div>
    <div class="shortcut-wrapper" v-show="!searchquery">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(item,idx) in hotkey" :key="idx" @click="selectItem(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="searchquery">
      <Suggest :query='searchquery'></Suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getHotKey } from "../api/search";
import { ERR_OK } from "../common/js/config";
import Searchbox from "../base/search-box"
import Suggest from '../base/suggest'
export default {
  data() {
    return {
      hotkey: [],
      searchquery:''
    };
  },
  components:{
    Searchbox,
    Suggest
  },
  methods: {
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code == ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    selectItem(key){
      this.$refs.searchBox.setQuery(key)
    },
    queryChange(query){
      this.searchquery=query
    }
  },
  created() {
    this._getHotKey();
  }
};
</script>

<style lang="stylus" >
@import '../common/stylus/variable';
@import '../common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium-x;
          color: $color-text-l;
          font-weight: 900;
        }

        .item {
          display: inline-block;
          padding: 5px 8px;
          margin: 0 20px 10px 0;
          border-radius: 18px;
          background: $color-text-ll;
          font-size: $font-size-medium;
          color: $color-text-d;
          border: 1px solid #999;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>