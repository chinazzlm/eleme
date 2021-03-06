<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-for="(ball, index) in balls" v-show="ball.show" key="index"></div>
      </transition-group>
    </div>
    <transition name="slide-fade">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                ￥
                <span>{{food.price * food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <v-cartcontrol :food="food"></v-cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type=text/ecmascript-6>
import CartControl from '@/components/cartcontrol/CartControl';
import BScroll from 'better-scroll';
export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price: 2,
            count: 20
          }
        ];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    dropBall: []
  },
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropedBalls: [],
      fold: true
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return '去结算';
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) { // 优化，在列表显示时才初始化
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    }
  },
  methods: {
    drop(el) { // 小球做动画
      // console.log(ele);
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) { // 找到隐藏的小球做动画
          ball.show = true; // 触发动画
          ball.el = el;
          this.dropedBalls.push(ball); // 已经做完动画的小球
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(${x}px, ${y}px, 0)`;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      }
    },
    enter(el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      el.style.webkitTransform = 'translate3d(0, 0, 0)';
      el.style.transform = 'translate3d(0, 0, 0)';
    },
    afterEnter(el) {
      let ball = this.dropedBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    hideList() {
      this.fold = true;
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付${this.totalPrice}元`);
    }
  },
  components: {
    'v-cartcontrol': CartControl
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.shopcart
  position fixed
  left 0
  bottom 0
  z-index 50
  width 100%
  height 48px
  .content
    display flex
    background-color #141d27
    color rgba(255, 255, 255, .4)
    .content-left
      flex 1
      font-size 0
      .logo-wrapper
        display inline-block
        position relative
        top -10px
        box-sizing border-box
        margin 0 12px
        padding 6px
        width 56px
        height 56px
        border-radius 50%
        background-color #141d27
        .logo
          width 100%
          height 100%
          border-radius 50%
          background-color #2b343c
          text-align center
          &.highlight
            background-color rgb(0, 160, 220)
          .icon-shopping_cart
            line-height 44px
            font-size 24px
            color #80858a
            &.highlight
              color #fff
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          border-radius 16px
          font-size 9px
          font-weight 700
          color #fff
          background-color rgb(340, 20, 20)
          box-shadow 0 4px 8px 0 rgba(0, 0, 0, .4)
      .price
        display inline-block
        vertical-align top
        margin-top 12px
        padding-right 12px
        line-height 24px
        box-sizing border-box
        border-right 1px solid rgba(255, 255, 255, .1)
        font-size 16px
        font-weight 700
        &.highlight
          color #fff
      .desc
        display inline-block
        vertical-align top
        margin 12px 0 0 12px
        line-height 24px
        font-size 10px
    .content-right
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-size 12px
        font-weight 700
        &.not-enough
          background-color #2b333b
        &.enough
          background-color #00b43c
          color #fff
  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      width 16px
      height 16px
      border-radius 50%
      background-color rgb(0, 160, 220)
    .drop-enter-active
      transition all .6s cubic-bezier(.85,-0.25,.34,.54)

  .shopcart-list
    position absolute
    left 0
    top 0
    z-index -1
    width 100%
    transform translate3d(0, -100%, 0)
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background-color #f3f5f7
      border-bottom 2px solid rgba(7, 17, 27, .1)
      .title
        float left
        font-weight 200
        font-size 14px
        color rgb(7, 17, 27)
      .empty
        float right
        font-size 12px
        color rgb(0, 160, 200)
    .list-content
      padding 0 18px
      max-height 217px
      overflow hidden
      background-color #fff
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7, 17, 27, .1))
        .name
          line-height 24px
          font-size 14px
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 10px
          color rgb(240, 20, 20)
          span
             font-weight 700
             font-size 14px
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px
  .slide-fade-enter-active, .slide-fade-leave-active
    transition transform .5s, opacity .5s
  .slide-fade-enter, .slide-fade-leave-active 
    transform translate3d(0, 0, 0)
    opacity 0
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index -2
    background-color rgb(7, 17, 27)
    opacity .6
  .fade-enter-active, .fade-leave-active
    transition opacity .7s
  .fade-enter, .fade-leave-active
    opacity 0





</style>
