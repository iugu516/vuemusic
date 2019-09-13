<template>
  <div class="song-list" ref='songlist'>
    <ul>
      <li v-for='(song,idx) in songs'
        :key='idx'
        class='item'
        @click="slectSong(song,idx)"
      >
       <div class='content' ref='content'>
         <div class='index'>{{ idx + 1 }}</div>
         <div>
           <h2 class='name'>{{ song.songname }}</h2>
           <p class='desc'>{{ song.singer }} ~ {{ song.albumname }} </p> 
         </div>  
       </div>
      </li>
    </ul>
  </div>
</template>

<script>
// 滚动  | loading  | 点击背景颜色变化
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    slectSong(song,idx){
      this.$emit('select',song,idx)
    }
  },
}
</script>

<style scoped lang="stylus">
@import '../common/stylus/variable'
@import '../common/stylus/mixin'
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    // .rank {
    // flex: 0 0 25px;
    // width: 25px;
    // margin-right: 30px;
    // text-align: center;

    // .icon {
    // display: inline-block;
    // width: 25px;
    // height: 24px;
    // background-size: 25px 24px;

    // &.icon0 {
    // bg-image('first');
    // }

    // &.icon1 {
    // bg-image('second');
    // }

    // &.icon2 {
    // bg-image('third');
    // }
    // }

    // .text {
    // color: $color-theme;
    // font-size: $font-size-large;
    // }
    // }
    .content
      flex 1
      line-height 20px
      overflow hidden
      display flex
      align-items center
      .index
        margin-right 15px
      .name
        no-wrap()
        color #222
        font-size 16px
      .desc
        no-wrap()
        margin-top 4px
        color #888
  .bgColor
    background #f3f3f3
</style>