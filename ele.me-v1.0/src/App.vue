<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller">I am content</router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">

import Header from '@/components/header/Header';
import { urlParse } from '@/common/js/util';

const ERR_OK = 0; // sate code

export default {
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          // console.log(queryParam);
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    this.$http.get('/api/seller').then(res => {
      res = res.body;
      if (res.errno === ERR_OK) {
        // this.seller = res.data;
        this.seller = Object.assign({}, this.seller, res.data);
      }
    });
  },
  components: {
    'v-header': Header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display flex
      width 100%
      height 40px
      border-bottom 1px solid rgba(7, 17, 27, .1)
      line-height 40px
      .tab-item
        flex 1
        text-align center
        & > a
          display block
          font-size 14px
          color rgb(77, 85, 93)
          &.active
            color rgb(240, 20, 20)
            
</style>
