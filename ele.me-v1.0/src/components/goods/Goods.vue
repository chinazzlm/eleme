<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
  
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="item in goods">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item border-1px" v-for="food in item.foods" @click="selectFood(food, $event)">
  
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
  
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">
                    <i class="currency">￥</i>{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">
                    <i class="currency">￥</i>{{food.oldPrice}}
                  </span>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol :food="food" @drop="drop"></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
    <v-food :food="selectedFood" ref="food"></v-food>
  </div>
</template>

<script type=text/ecmascript-6>
import CartControl from '@/components/cartcontrol/CartControl';
import Shopcart from '@/components/shopcart/Shopcart';
import Food from '@/components/food/Food';
import BScroll from 'better-scroll';
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  computed: {
    currentIndex() { // 左侧菜单当前索引
      for (let k = 0; k < this.listHeight.length; k++) {
        let height1 = this.listHeight[k];
        let height2 = this.listHeight[k + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return k;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this.$http.get('/api/goods').then(res => {
      res = res.body;
      if (res.errno === ERR_OK) { // goods变化时计算滚动
        this.goods = res.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  methods: {
    _initScroll() { // 滚动
      if (!this.menuScroll) { // 优化
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
      } else {
        this.menuScroll.refresh();
      }
      if (!this.foodsScroll) {
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3, // 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
          click: true
        });
      } else {
        this.foodsScroll.refresh();
      }
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() { // 计算foodList高度
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let selected = foodList[index];
      this.foodsScroll.scrollToElement(selected, 300);
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    drop(target) { // 小球动画
      this.$refs.shopcart.drop(target); // 调用购物车的方法执行
    }
  },
  components: {
    'v-cartcontrol': CartControl,
    'v-shopcart': Shopcart,
    'v-food': Food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.goods
  display flex
  position absolute
  top 175px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px // 兼容android
    background-color #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      line-height 14px
      &.current
        position relative
        z-index 10
        margin-top -1px
        background-color #fff
        .text
          border-none()
          font-weight 400
          color rgb(240, 20, 20)
      .text
        display table-cell
        width 56px
        vertical-align middle
        font-size 12px
        font-weight 200
        line-height 14px
        border-1px(rgba(7, 17, 27, .1))
       .icon
        display inline-block
        vertical-align top
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.special
          bg-image('special_3')
        &.invoice
          bg-image('invoice_3')
  .foods-wrapper
    flex 1
    .title
      height 26px
      padding-left 14px
      border-left 2px solid #d9dde1
      line-height 26px
      font-size 12px
      color rgb(147, 153, 159)
      background-color #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7, 17, 27, .1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        display relative
        flex 1
        .name
          height 14px 
          margin 2px 0 8px 0
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
        .desc
          margin-bottom 8px
          line-height 12px
          font-size 10px
          color rgb(147, 153, 159)
        .extra
          font-size 0
          span
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
            &:first-child
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
              vertical-align bottom
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
          right 0
          bottom 12px




        

</style>
