// 常量语义化变化 code 为 0 ，请求数据成功
const ERR_OK = 0;

// 请求数据的公共参数
const commonData = {
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf8',
  notice: 0,
  g_tk: 5381
}
const playmode={
  order:0,
  loop:1,
  random:2
}
export {
  ERR_OK,
  commonData,
  playmode
}
