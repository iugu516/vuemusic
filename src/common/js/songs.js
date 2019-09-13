/* 我们歌曲的数据在 musicData 中  
   albummid albumname songid songmid songname singer, interval 是从musicData中单独抽取出来的字段
*/

// 定义一个类，来保存这些数据，可多次使用
class Song {
  constructor({albummid, albumname, songid, songmid, songname, singer,interval, url}) {
    this.albummid = `http://y.gtimg.cn/music/photo_new/T002R300x300M000${ albummid }.jpg?max_age=2592000`; // 专辑图片
    this.albumname = albumname; // 专辑名
    this.songid = songid;      // 歌曲id
    this.songmid = songmid;    // 歌曲播放源mid
    this.songname = songname;  // 歌曲名
    this.singer = filterSinger(singer);// 歌手名
    this.interval = interval;  // 歌曲时长
    this.url = url;
  }
}

// 处理singer的方法 
function filterSinger(s) {
  let ret = [];
  if(!s){
    return;
  }
  s.forEach(item => {
    ret.push(item.name)
  });
  return ret.join(' / ')
}

export default Song;