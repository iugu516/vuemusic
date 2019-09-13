<template>
  <div class="progress-bar" ref="progressBar" @click="clickProgress">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent='touchStart' @touchmove.prevent='touchMove' @touchend='touchEnd'>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    watch: {
        percent(newP){
            if(this.touch.isStart){
                return;
            }
            const barwidth = this.$refs.progressBar.clientWidth -16;
            const offsetwidth = newP * barwidth;
            this._offset(offsetwidth)
        }
    },
    methods: {
        touchStart(e){
            this.touch.isStart = true
            this.touch.startX = e.touches[0].pageX
            this.touch.offsetWidth = this.$refs.progress.clientWidth
        },
        touchMove(e){
            if(!this.touch.isStart){
                return;
            }
            const distanceX = e.touches[0].pageX - this.touch.startX
            const distanceleft = Math.min(this.$refs.progressBar.clientWidth -16,Math.max(0,this.touch.offsetWidth + distanceX))
            this._offset(distanceleft)          
        },
        touchEnd(e){
           this.touch.isStart=false
           this._triggerPercent()
        },
        _offset(o){
            this.$refs.progress.style.width = `${o}px`
            this.$refs.progressBtn.style.transform =`translateX(${o}px)`  
        },
        _triggerPercent(){
            const barwidth = this.$refs.progressBar.clientWidth -16;
            const percent = this.$refs.progress.clientWidth/barwidth;
            this.$emit('percentChange',percent)   
        },
        clickProgress(e){
            this. _offset(e.offsetX)
            this._triggerPercent()
        }
    },
    created() {
        //记录touch事件的事件信息
        this.touch={

        }
    },
};
</script>

<style scoped lang="stylus">
@import '../common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: #fff;
      }
    }
  }
}
</style>