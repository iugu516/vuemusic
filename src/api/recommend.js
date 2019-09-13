// 引入 HTTP库 axios 
import axios from 'axios';
import { commonData } from '../common/js/config'
// 封装一个接口 , 请求轮播数据 
const getSlideList = () => {
  const url = `/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg`;
  const data = Object.assign({}, commonData, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
  })
  // 发起 Ajax 请求
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(err => {
    console.log(err)
  })
}

// 定义热门歌曲推荐的接口
const getHotRecom = () => {
  const url = `/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg`;
  const data = Object.assign({}, commonData, {
    picmid: 1,
    rnd: Math.random(),
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 28,
    sortId: 5,
    sin: 0,
    ein: 19 
  });
  return axios.get(url,{
    params: data
  }).then(res=>{
    return Promise.resolve(res.data)
  }).catch(err=>{
    console.log(err)
  })
} 
const getHotRecomList = (disstid) => {
  const url = `/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg`;
  const data = Object.assign({}, commonData, {
    disstid: disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    new_format: 1,
    hostUin: 0,
    needNewCode: 0,
  });
  return axios.get(url,{
    params: data
  }).then(res=>{
    return Promise.resolve(res.data)
  }).catch(err=>{
    console.log(err)
  })
}

export {
  getSlideList,
  getHotRecom,
  getHotRecomList
}