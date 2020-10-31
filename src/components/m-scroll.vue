<template>
  <div ref="wrapper">
    <!-- 插槽 -->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
export default {
  props: {
    // 值有三个 ： 1 2 3
    // 1 ： 非实时派发scroll事件
    // 2 ： 实时派发scroll事件
    // 3 ： 动画运行中也派发scroll事件
    probeType: {
      type: Number,
      default: 2
    },
    data: {
      // 监听数据变化
      type: Array,
      default() {
        return [];
      }
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _initScroll() {
      if(!this.$refs.wrapper){
        return;
      }
      // 实例化一个scroll对象  new BScroll(DOM, options[Object])
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true, // 开始click事件
        // 开启滚动动画
        momentum: true,
        // 滚动动画时长 ms
        swipeTime: 1500,
        // 滚动动画减速度
        deceleration: 0.003
      });
      // 判断当前的 listenScroll, 如果有就派发一个scroll事件出去
      if(this.listenScroll){
        // 注册原生scroll事件
        this.scroll.on('scroll', (prop)=>{
          // 把scroll事件派发出去
          this.$emit('scroll', prop)
        })
      }
    },
    enable() {
      // 启动better-scroll
      this.scroll && this.scroll.enable();
    },
    disable() {
      // 关闭 better-scroll
      this.scroll && this.scroll.disable();
    },
    refresh() { // 刷新
      this.scroll && this.scroll.refresh();
    },
    scrollToElement(elem, ms) {
      // elem - 滚动到的元素  ms - 滚动时间
      this.scroll && this.scroll.scrollToElement(elem, ms)
    }
  },
  mounted(){
    setTimeout(()=>{ // 延时加载，确保DOM加载完成
      this._initScroll()
    }, 20)
  },
  watch: { // 监听 data , data 数据变化，重新计算高度
    data() {
      setTimeout(()=>{
        this.refresh()
      }, 20)
    }
  }
};
</script>

<style scoped>
</style>