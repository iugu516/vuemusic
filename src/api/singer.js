import {
  commonData
} from '../common/js/config'
import axios from 'axios'

/* 定义请求歌手列表的接口 */
const getSingerList = () => {
  const url = `/v8/fcg-bin/v8.fcg`;
  const data = Object.assign({}, commonData, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq.json',
    page: 'list',
    channel: 'singer',
    key: 'all_all_all',
    pagesize: 80,
    pagenum: 1
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(err => {
    console.log(err)
  })
}

/* 定义获取歌手歌曲列表的接口  */
const getSongList = (singermid) => {
  const url = `/v8/fcg-bin/fcg_v8_singer_track_cp.fcg`;
  const data = Object.assign({}, commonData, {
    singermid: singermid,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(err => {
    console.log(err)
  })
}

export {
  getSingerList,
  getSongList
}