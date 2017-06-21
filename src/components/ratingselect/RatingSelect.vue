<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block all" :class="{'active': selectType === 2}" @click="select(2, $event)">{{desc.all}}
        <i class="count">{{ratings.length}}</i>
      </span>
      <span class="block positive" :class="{'active': selectType === 0}" @click="select(0, $event)">{{desc.positive}}
        <i class="count">{{positives.length}}</i>
      </span>
      <span class="block negative" :class="{'active': selectType === 1}" @click="select(1, $event)">{{desc.negative}}
        <i class="count">{{negatives.length}}</i>
      </span>
    </div>
    <div class="switch" :class="{'on': onlyContent}" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const ALL = 2;
const POSITIVE = 0;
const NEGATIVE = 1;
export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '吐槽'
        };
      }
    }
  },
  computed: {
    positives() {
      return this.ratings.filter(rating => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter(rating => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('select', type);
    },
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('toggleContent', !this.onlyContent);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.ratingselect
  .rating-type
    padding 18px 0
    margin 0 18px
    border-1px(rgba(7, 17, 27, .1))
    .block
      padding 8px 12px
      margin-right 8px
      border-radius 2px  
      line-height 16px
      font-size 12px
      color rgb(77, 85, 93)
      background-color rgba(0, 160, 220, .2)
      &.active
        background-color rgb(0, 160, 220)
        color #fff
      .count
        font-size 8px
        margin-left 2px
        font-style normal
        vertical-align middle
      &.negative
         background-color rgba(77, 85, 93, .2)
         &.active
          background-color rgb(77, 85, 93)
  .switch
    padding 12px 18px
    line-height 24px
    border-bottom 1px solid rgba(7, 17, 27, .1)
    color rgb(147, 153, 159)
    font-size 0
    &.on
      .icon-check_circle
        color #00c850
      .text
        color rgb(77, 85, 93)
    .icon-check_circle
      margin-right 4px
      font-size 24px
    .text
      font-size 12px
      vertical-align top





</style>

