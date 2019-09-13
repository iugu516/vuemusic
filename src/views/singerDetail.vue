<template>
  <div class="singer-detail" ref='singerdetail'>
   <music-list :title='singerInfo.sname' :bgImage='bgImage' :songs='songsList' ref='songsList'/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from '../components/music-list'
import { getSongList } from '../api/singer'
import Song from '../common/js/songs'
import getPlayKey from '../api/getPlayKey'
import { ERR_OK } from '../common/js/config';
export default {
  data() {
    return {
      songsList: []
    }
  },
  computed: {
    ...mapGetters(['singerInfo']),
    bgImage() {
      return  `background-image:url(${this.singerInfo.headImg})` 
    }
  },
  components: {
    MusicList
  },
  methods: {
    // 获取 歌曲列表 的方法
    _getSongList() {
      // 判断当前 Fmid 是否存在 
      if(!this.singerInfo.Fmid){
        this.$router.push('/singer')
        return;
      }
      getSongList(this.singerInfo.Fmid).then(res=>{
        this.songsList = this.filterSong(res.data.list)
      })
    },
    // 处理 歌曲数据 Song 类中的 url 
    filterSong(list) {
      let ret = [];
      let smid = []; // 存放songmid 
      let purl = []; // 存放 purl 
      // 1. 获取 songmid -> Arry
      list.forEach(item => {
        let { musicData : { songmid } } = item;
        smid.push(songmid);
      })
      // 根据 songmid 请求 purl 
      this._getPlayKey(smid).then( urlinfo =>{
        // 遍历 urlinfo
        urlinfo.forEach( item => {
          purl.push(item.purl)
        })
        // 在根据 purl 去获取musicData, 拼接播放源 url,把url和musicData合并成一个对象 
        list.forEach((item, index) => {
          let md = item.musicData;
          if(purl[index]) {
            let dataUrl = Object.assign({}, md, {
              url: `http://223.111.104.155/amobile.music.tc.qq.com/${
                purl[index] }`
            })
            // 在 Song 类中结构对象返回 我们需要的 Song 实例
            ret.push(new Song(dataUrl))
          }
        })
      })
      return ret;
    },
    _getPlayKey(songmid) {
      return getPlayKey(songmid).then(res=>{
        if(res.code === ERR_OK){
          // 把正确的数据异步输出
          return Promise.resolve(res.req_0.data.midurlinfo)
        }else {
          return Promise.reject('err')
        }
      }) 
    }
  },
  created(){
    this._getSongList();
  }
}
</script>

<style scoped lang="stylus">
@import '../common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f2f2f2;
}
</style>