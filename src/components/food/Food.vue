<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">
              <i class="currency">￥</i>{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">
              <i class="currency">￥</i>{{food.oldPrice}}
            </span>
          </div>
          <div class="cartcontrol-wrapper">
            <v-cartcontrol :food="food"></v-cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || 0 === food.count" @click="addFirst">加入购物车</div>
          </transition>
        </div>
        <v-split v-show="food.info"></v-split>
  
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <v-split v-show="food.ratings"></v-split>
  
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-ratingselect :select-type="selectType" @select="select" :only-content="onlyContent" @toggleContent="toggleContent" :desc="desc" :ratings="food.ratings"></v-ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item" v-for="rating in food.ratings" v-show="needShow(rating.rateType, rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formateDate}}</div>
                <p class="text">
                  <i :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>{{rating.text}}</p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
  
      </div>
    </div>
  </transition>
</template>

<script type=text/ecmascript-6>
import BScroll from 'better-scroll';
import Vue from 'vue';
import CartControl from '@/components/cartcontrol/CartControl';
import Split from '@/components/split/Split';
import RatingSelect from '@/components/ratingselect/RatingSelect';
import { formateDate } from '@/common/js/date.js';
const ALL = 2;
// const POSITIVE = 0;
// const NEGATIVE = 1;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL; // 初始组件
      this.onlyContent = true; // 初始组件
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      Vue.set(this.food, 'count', 1);
    },
    select(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    toggleContent(val) {
      this.onlyContent = val;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  filters: {
    formateDate(time) {
      let date = new Date(time);
      return formateDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    'v-cartcontrol': CartControl,
    'v-split': Split,
    'v-ratingselect': RatingSelect
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.food
  position fixed
  left 0
  top 0
  bottom 48px
  width 100%
  background-color #fff
  transform translate3d(0, 0, 0)
  .image-header
    position relative
    width 100%
    height 0
    padding-top 100% // 相对于盒子的宽计算的百分比
    img 
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    .back
      position absolute
      top 10px
      left 0
      .icon-arrow_lift
        display block
        padding 10px // 放大有效点击区域
        font-size 20px
        color #fff
  .content
    position relative
    padding 18px
    .title
      line-height 14px
      margin-bottom 8px
      font-size 14px
      font-weight 700
      color rgb(7, 17, 27)
    .detail
      margin-bottom 18px
      line-height 10px
      font-size 0 // inline-block布局去除子元素间隔
      .sell-count, .rating
        font-size 10px
        color rgb(147, 153, 159)
      .sell-count
        margin-right 12px
    .price
      line-height 24px
      font-size 0
      .now
        vertical-align top
        margin-right 8px
        line-height 24px
        font-weight 700
        font-size 14px
        color rgb(240, 20, 20)
        .currency
          font-style normal
          font-weight normal
          font-size 10px
      .old
        line-height 24px
        text-decoration line-through
        font-weight 700
        font-size 10px
        color rgb(147, 153, 159)
        .currency
          font-style normal
          font-weight normal
    .cartcontrol-wrapper
      position absolute
      right 12px
      bottom 12px
    .buy
      position absolute
      right 18px
      bottom 18px
      z-index 10
      height 24px
      line-height 12px
      padding 6px 12px
      border-radius 12px
      box-sizing border-box
      font-size 10px
      color #fff
      background-color rgb(0, 160, 220)
      opacity 1
    .fad-enter, .fade-leave-active
      opacity 0
    .fad-enter-active, .fade-leave-active
      transition opacity .3s
  .info
    padding 18px
    .title
      line-height 14px
      margin-bottom 6px
      font-weight 700
      font-size 14px
      color rgb(7, 17, 27)
    .text
      line-height 24px
      font-weight 200
      font-size 12px
      color rgb(77, 85, 93)
  .rating
    padding-top 18px
    .title
      line-height 14px
      margin-left 18px
      font-size 14px
      color rgb(7, 17, 27)
    .rating-wrapper
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px(rgba(7, 17, 27, .1))
        .user
          position absolute
          right 0
          top 16px
          font-size 0
          .name
            display inline-block
            margin-right 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .avatar
            width 12px
            height 12px
            border-radius 50%
        .time
          margin-bottom 6px
          line-height 12px
          font-size 10px
          color rgb(147, 153, 159)
        .text
          line-height 16px
          font-size 12px
          color rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right 4px
            line-height 24px
            font-size 12px
          .icon-thumb_down
            color rgb(147, 153, 159)
          .icon-thumb_up
            color rgb(0, 160 ,220)
      .no-rating
        padding-top 16px
        font-size 12px
        color rgb(147, 153, 159)


.move-enter, .move-leave-active
  transform translate3d(100%, 0, 0)
.move-enter-active, .move-leave-active
  transition all .5s 
</style>
