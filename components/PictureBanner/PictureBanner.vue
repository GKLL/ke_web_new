/*
 * @Description: 纯图片广告位组件，需要传入图片地址及其链接地址，自适应父元素宽高
 * @Author: LiuZhen
 * @Date: 2018-05-29 10:51:05
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 13:39:43
 */
<template>
  <section class="picture-banner">
    <a :href="item.adverLink || ''" target="_blank" v-for="(item,index) in showBannerList" :key="index">
      <img v-lazy="handleImgAddress(item.imageAddress)" alt="">
      <span class="article" v-show="item.imageType == 1">{{item.articleTitle}}</span>
      <span class="adv" v-show="item.imageType == 2"></span>
      <span class="other" v-show="item.imageType == 3"></span>
      <span class="activity" v-show="item.imageType == 4">活动</span>
    </a>
  </section>
</template>

<script type="text/ecmascript-6">
import { handleImgMixin } from '@/utils/mixins'

export default {
  name: 'PictureBanner',
  mixins: [handleImgMixin],
  data () {
    return {
      showBannerList: []
    }
  },

  props: {
    bannerList: {
      type: Array,
      default: () => []
    },
    // 广告位位置
    bannerPos: {
      type: Number,
      default: 0
    },
    // 最多显示的数量
    mostShowNum: {
      type: Number,
      default: 3
    }
  },

  created () {
    switch (this.bannerPos) {
      case 12:
        this.handleBannerPos(12)
        break
      case 13:
        this.handleBannerPos(13)
        break
      case 14:
        this.handleBannerPos(14)
        break
      case 15:
        this.handleBannerPos(15)
        break
      case 16:
        this.handleBannerPos(16)
        break
    }

  },

  methods: {
    handleBannerPos (pos) {
      for (let i = 0; i < this.bannerList.length; i++) {
        if (this.bannerList[i].imagePos === pos) {
          this.showBannerList.push(this.bannerList[i])
        }
        if (this.showBannerList.length === this.mostShowNum) {
          break
        }
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.picture-banner
  width 100%
  height 100%
  a
    display inline-block
    width 100%
    position relative
    height 100%
    margin-bottom 16px
    img
      width 100%
      height 100%
    .adv 
      display inline-block
      width 24px
      height 14px
      background-size 100% 100%
      background-image url('../../assets/img/adv.png')
      position absolute
      right 3px
      bottom 3px
    .article
      position absolute
      bottom 0px
      left 0px
      right 0px
      display block
      color #fff
      font-size 14px
      background-color rgba(0,0,0,.7)
      line-height 30px
      text-align center
      overflow  hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient vertical
</style>
