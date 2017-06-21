<template>
  <div class="cartcontrol">
    <transition name="scroll">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if (!event._constructed) { // 修复pc端点击触发2次
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      this.$emit('drop', event.target); // 获得被点击的dom，小球动画
    },
    decreaseCart(event) {
      if (!event._constructed) { // 修复pc端点击触发2次
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size 0
  .cart-decrease, .cart-add
    display inline-block
    padding 6px
    line-height 24px
    font-size 24px
    color rgb(0, 160, 220)
  .cart-decrease // animate
    opacity 1
    transform translate3d(0, 0, 0) rotate(0deg)
  .cart-count
    display inline-block
    vertical-align top
    width 12px
    padding-top 7px
    font-size 10px
    line-height 24px
    text-align center
    color rgb(147, 153, 159)
  .scroll-enter, .scroll-leave-active
    opacity 0
    transform translate3d(24px, 0, 0) rotate(180deg)
  .scroll-enter-active, .scroll-leave-active
    transition opacity .5s, transform .5s 
</style>

