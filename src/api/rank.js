import {
    commonData
  } from '../common/js/config'
  import axios from 'axios'
  
  /* 定义请求歌手列表的接口 */
  const getRankList = () => {
    const url = `/v8/fcg-bin/fcg_myqq_toplist.fcg`;
    const data = Object.assign({}, commonData, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1
    })
    return axios.get(url, {
      params: data
    }).then(res => {
      return Promise.resolve(res.data)
    }).catch(err => {
      console.log(err)
    })
}
const getRankSongList = (topid) => {
    const url = `/v8/fcg-bin/fcg_v8_toplist_cp.fcg`;
    const data = Object.assign({}, commonData, {
        topid: topid,
        uin: 0,
        tpl: 3,
        page: 'detail',
        type: 'top',
        platform: 'h5',
        needNewCode: 1
    })
    return axios.get(url, {
      params: data
    }).then(res => {
      return Promise.resolve(res)
    }).catch(err => {
      console.log(err)
    })
}
export{
    getRankList,
    getRankSongList
}