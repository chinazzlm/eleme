<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <div class="title">服务态度</div>
            <v-star :size="36" :score="seller.serviceScore"></v-star>
            <div class="score">{{seller.serviceScore}}</div>
          </div>
          <div class="score-wrapper">
            <div class="title">商品评分</div>
            <v-star :size="36" :score="seller.foodScore"></v-star>
            <div class="score">{{seller.foodScore}}</div>
          </div>
          <div class="delivery-wrapper">
            <div class="title">送达时间</div>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings" :desc="desc" @select="select" @toggleContent="toggleContent"></v-ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item" v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name"></h1>
              <div class="star-wrapper">
                <v-star :size="24" :score="rating.score">{{rating.score}}</v-star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <i :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
                <span class="item" v-for="recommend in rating.recommend">{{recommend}}</span>
              </div>
              <div class="time">{{rating.rateTime | formateDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type=text/ecmascript-6>
import Star from '@/components/star/Star';
import Split from '@/components/split/Split';
import RatingSelect from '@/components/ratingselect/RatingSelect';
import BScroll from 'better-scroll';
import { formateDate } from '@/common/js/date.js';
const ALL = 2;
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '吐槽'
      }
    };
  },
  created() {
    this.$http.get('/api/ratings').then(res => {
      res = res.body;
      if (res.errno === ERR_OK) {
        this.ratings = res.data;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          });
        });
      }
    });
  },
  methods: {
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
    'v-star': Star,
    'v-split': Split,
    'v-ratingselect': RatingSelect
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.ratings
  position absolute
  top 174px
  bottom 0
  left 0
  width 100%
  overflow hidden
  .overview
    display flex
    padding 18px 0
    .overview-left
      flex 0 0 137px
      width 137px
      padding-top 6px
      border-right 1px solid rgba(7, 17, 27, .1) 
      text-align center
      @media only screen and (max-width: 320px)
        flex 0 0 120px 
        width 120px
      .score  
        margin-bottom 6px
        line-height 28px
        font-size 24px
        color rgb(255, 153, 0)
      .title
        margin-bottom 8px
        line-height 12px
        font-size 12px
        color rgb(7, 17, 27)
      .rank
        margin-bottom 6px
        line-height 10px
        font-size 10px
        color rgb(147, 153, 159)
    .overview-right
      flex 1
      padding 6px 0 0 24px
      @media only screen and (max-width: 320px)
        padding-left 6px
      .score-wrapper, .delivery-wrapper
        font-size 0
        margin-bottom 8px
        .title
          display inline-block
          line-height 18px
          vertical-align top
          line-height 18px
          color rgb(7, 17, 27)
          font-size 12px
        .star
          display inline-block
          margin 0 12px
          vertical-align top
        .score
          display inline-block
          vertical-align top
          font-size 12px
          line-height 18px
          color rgb(255, 153, 0)
        .delivery
          margin-left 12px
          line-height 18px
          font-size 12px
          color rgb(147, 153, 159)
  .rating-wrapper
    padding 0 18px
    .rating-item
      display flex
      padding 18px 0
      border-1px(rgba(7, 17, 27, .1))
      .avatar
        flex 0 0 28px
        margin-right 12px
        width 28px
        height 28px
        img
          border-radius 50%
      .content
        position relative
        flex 1
        .name
          margin-bottom 4px
          line-height 12px
          font-size 10px
          color rgb(7, 17, 27)
        .star-wrapper
          margin-bottom 6px
          font-size 0
          .star
            display inline-block
            margin-right 6px
            vertical-align top
          .delivery
            display inline-block
            vertical-align top
            line-height 12px
            font-size 10px
            font-weight 200
            color rgb(147, 153, 159)
        .text
          margin-bottom 8px
          line-height 18px
          font-size 12px
          color rgb(7, 17, 27)
        .recommend
          font-size 0
          .icon-thumb_up, .item
            display inline-block
            margin 0 8px 4px 0
            line-height 16px
          .icon-thumb_up
            color rgb(0, 160, 220)
            font-size 12px
          .icon-thumb_down
            color rgb(183, 187, 191)
            font-size 12px
          .item
            padding 1px 6px 0 6px
            border 1px solid rgba(7, 17, 27, .1)
            border-radius 1px
            font-size 9px
            color rgb(147, 153, 159)
        .time 
          position absolute
          top 0
          right 0
          line-height 12px
          font-weight 200
          font-size 10px
          color rgb(147, 153, 159)
          

</style>
