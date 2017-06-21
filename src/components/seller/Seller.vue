<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h3 class="title">{{seller.name}}</h3>
        <div class="desc border-1px">
          <v-star :size="36" :score="seller.score"></v-star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">{{seller.minPrice}}
              <small>元</small>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">{{seller.deliveryPrice}}
              <small>元</small>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">{{seller.deliveryTime}}
              <small>元</small>
            </div>
          </li>
        </ul>
        <div class="favorite">
          <span class="icon-favorite" :class="{'active': favorite}" @click="toggleFavorite"></span>
          <span class="favorite-text">{{favoriteText}}</span>
        </div>
      </div>
      <v-split></v-split>
      <div class="bulletin">
        <h3 class="title">公告与活动</h3>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul class="supports" v-if="seller.supports">
          <li class="supports-item border-1px" v-for="(item, index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="pics">
        <h3 class="title">商家实景</h3>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <div class="info">
        <h3 class="title">商家信息</h3>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type=text/ecmascript-6>
import BScroll from 'better-scroll';
import Star from '@/components/star/Star';
import Split from '@/components/split/Split';
import {saveToLocal, loadFromLocal} from '@/common/js/store';
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      favorite: (() => { // 获取状态
        return loadFromLocal(this.seller.id, 'favorite', false);
      })()
    };
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  mounted() {
    this._initSellerScroll();
    this._initPics();
  },
  updated() {
    this._initSellerScroll();
    this._initPics();
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏';
    }
  },
  methods: {
    toggleFavorite(event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, 'favorite', this.favorite);
    },
    _initPics() { // 图片滚动
      if (this.seller.pics) {
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs.picList.style.width = width + 'px';
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              click: true,
              scrollX: true,
              eventPassthrough: 'vertical'
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    },
    _initSellerScroll() { // 滚动
      if (!this.sellerScroll) { // 优化
        this.sellerScroll = new BScroll(this.$refs.seller, {
          click: true
        });
      } else {
        this.sellerScroll.refresh();
      }
    }
  },
  components: {
    'v-star': Star,
    'v-split': Split
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7, 17, 27)
      .desc
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, .1))
        font-size 0
        .star
          display inline-block
          margin-right 8px
          vertical-align top
        .text
          margin-right 12px
          vertical-align top
          line-height 18px
          font-size 10px
          color rgb(77, 85, 93)
      .remark
        display flex
        padding-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7, 17, 27, .1)
          &:last-child
            border none
          h2
            margin-bottom 4px
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .content
            line-height 24px
            font-weight 200
            font-size 24px
            color rgb(7, 17, 27)
            small
              font-size 10px
      .favorite
        position absolute
        right 18px
        top 18px
        text-align center
        font-size 0
        .icon-favorite
          display block
          width 36px
          margin-bottom 4px
          line-height 24px
          font-size 24px
          color #d4d6d9
          text-align center
          &.active
            color rgb(240, 20, 20)
        .favorite-text
          line-height 10px
          font-size 10px
          color rgb(77, 85, 93)
    .bulletin
      padding 18px 18px 0 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7, 17, 27)
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, .1))
        .content
          line-height 24px
          font-size 12px
          color rgb(240, 20, 20)
      .supports
        .supports-item
          padding 16px 12px
          border-1px(rgba(7, 17, 27, .1))
          font-size 0
          &:last-child
            border none
          .icon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            margin-right 4px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.special
              bg-image('special_4')
            &.invoice
              bg-image('invoice_4')
          .text
            line-height 16px
            font-weight 200
            font-size 12px
            color rgb(7, 17, 27)
    .pics
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7, 17, 27)
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size 0
          .pic-item
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin-right 0
    .info
      padding 18px 18px 0 18px
      color rgb(7, 17, 27)
      .title
        padding-bottom 12px
        line-height 14px
        border-1px(rgba(7, 17, 27, .1))
        font-size 14px
      .info-item
        padding 16px 12px
        border-1px(rgba(7, 17, 27, .1))
        line-height 16px
        font-weight 200
        font-size 12px
        &:last-child
          border-none()

</style>
