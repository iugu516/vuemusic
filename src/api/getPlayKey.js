import {
  commonData
} from '../common/js/config'
import axios from 'axios';
// 定义获取播放源的接口  songmid 是一个数组
const getPlayKey = (songmid) => {
  const url = `/cgi-bin/musicu.fcg`;
  const data = Object.assign({}, commonData, {
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      "req": {
        "module": "CDN.SrfCdnDispatchServer",
        "method": "GetCdnDispatch",
        "param": {
          "guid": "7592953634",
          "calltype": 0,
          "userip": ""
        }
      },
      "req_0": {
        "module": "vkey.GetVkeyServer",
        "method": "CgiGetVkey",
        "param": {
          "guid": "7592953634",
          // 测试 飞云之下 存在   晴天 需要版权
          "songmid": songmid,  
          "songtype": [0],
          "uin": "729346758",
          "loginflag": 1,
          "platform": "20"
        }
      },
      "comm": {
        "uin": 729346758,
        "format": "json",
        "ct": 24,
        "cv": 0
      }  
    }
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(err => {
    console.log(err)
  })
}

export default getPlayKey;