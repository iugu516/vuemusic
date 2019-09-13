import {playmode} from '../common/js/config'
const state ={
    //记录player状态
    playing:false,
    playList:[],//保存当前歌曲列表
    orderList:[],//随机播放
    currentIndex:-1,
    fullScreen:false,//全屏切换
    playMode:playmode.order,
    url:''//当前播放源
}
const getters ={
    playing(state){
        return state.playing
    },
    playList(state){
        return state.playList
    },
    orderList(state){
        return state.orderList
    },
    currentIndex(state){
        return state.currentIndex
    },
    fullScreen(state){
        return state.fullScreen
    },
    playMode(state){
        return state.playMode
    },
    //当前播放歌曲
    currentSong(state){
        return state.playList[state.currentIndex] || {}
    }
}
const mutations={
    setPlaying(stae,bool){
        stae.playing=bool
    },
    setplayList(state,list){
        state.playList = list
    },
    setorderList(state,list){
        state.orderList = list
    },
    setFullScreen(state,bool){
        state.fullScreen = bool
    },
    setCurrentIndex(state,index){
        state.currentIndex=index
    },
    setPlayMode(state,mode){
        state.playMode=mode
    }
}
const actions={
    selectPlay({commit},{list,index}){
        commit('setPlaying',true)
        commit('setplayList',list)
        commit('setorderList',list)
        commit('setCurrentIndex',index)
    }
}
export default {
    state,
    getters,
    mutations,
    actions,
    namespaced:true//开启命名空间
}