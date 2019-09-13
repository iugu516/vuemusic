import {mapGetters} from  'vuex'
export const playlistMixin={
    computed: {
        ...mapGetters('player',['playList'])
    },
    methods:{
        handlePlayList(){
            throw new Error('handlePlayList must be defined')
        }
    },
    mounted(){
        this.handlePlayList(this.playList)
    },
    activated() {//切换组件的
        this.handlePlayList(this.playList)
    },
    watch:{
        playList(newval){
            this.handlePlayList(newval)
        }
    }
}