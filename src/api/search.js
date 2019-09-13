import axios from 'axios';
import { commonData } from '../common/js/config'
const getHotKey = () => {
    const url = `/splcloud/fcgi-bin/gethotkey.fcg`;
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
const getSearchResult = (query) => {
    const url = `/soso/fcgi-bin/search_for_qq_cp`;
    const data = Object.assign({}, commonData, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        w:  query,
        zhidaqu: 1,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 40,
        n: 20,
        p: 1,
        remoteplace: 'txt.mqq.all'
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
export{
    getHotKey,
    getSearchResult
}