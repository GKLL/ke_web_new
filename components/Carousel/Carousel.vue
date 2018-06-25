/*
 * @Description: 轮播组件，支持多种轮播方式
 * @Author: LiuZhen
 * @Date: 2018-05-29 10:07:45
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 15:34:34
 */
<template>
  <el-carousel class="index-carousel" :height="height" :autoplay="autoplay" indicator-position="none" :interval="interval">
    <el-carousel-item v-for="(item,index) in carouselList" :key="index">
      <a :href="item.imageType===2?bannerItem.adverLink:bannerItem.imageDetail || ''" target="_blank" v-for="(bannerItem,bannerIndex) in item" :key="bannerIndex">
        <img v-lazy="handleImgAddress(bannerItem.imageAddress)" alt="">
        <p class="banner-title">{{bannerItem.articleTitle}}</p>
      </a>
    </el-carousel-item>
  </el-carousel>
</template>

<script type="text/ecmascript-6">
import { handleImgMixin } from '@/utils/mixins'

export default {
  name: 'Carousel',
  mixins: [handleImgMixin],
  data () {
    return {
      carouselList: [],
      gourpNum: 0
    }
  },

  props: {
    bannerList: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '216px'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    }
  },

  created () {
    let tmpList = []

    for (let i = 0; i < this.bannerList.length; i++) {
      if (this.bannerList[i].imagePos === 11) {
        tmpList.push(this.bannerList[i])
      }
    }

    // 如果结果数量大于12，则只截取前12条数据
    if (tmpList.length > 12) {
      tmpList = tmpList.slice(0, 12)
    }

    // 获取分组数
    this.groupNum = Math.ceil(tmpList.length / 4)
    let inSideList = []

    switch (this.groupNum) {
      case 1:
        // 当前组不够4张banner时添加占位图
        while (tmpList.length < 4) {
          tmpList.push({
            imageAddress: 'index_carsoule_bitmap.png',
            articleTitle: '',
            url: '/'
          })
        }

        // 将当前tmpList推入结果数组
        this.carouselList.push(tmpList)
        break
      case 2:
        // 当前组不够8张banner时添加占位图
        while (tmpList.length < 8) {
          tmpList.push({
            imageAddress: 'index_carsoule_bitmap.png',
            articleTitle: '',
            url: '/'
          })
        }

        // 将当前tmpList推入结果数组
        inSideList = []

        for (let i = 0; i < tmpList.length; i++) {
          if (i < 4) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        inSideList = []

        for (let i = 4; i < tmpList.length; i++) {
          if (i < 8) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        break
      case 3:
        // 当前组不够8张banner时添加占位图
        while (tmpList.length < 12) {
          tmpList.push({
            imageAddress: 'index_carsoule_bitmap.png',
            articleTitle: '',
            url: '/'
          })
        }

        // 将当前tmpList推入结果数组
        inSideList = []

        for (let i = 0; i < tmpList.length; i++) {
          if (i < 4) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        inSideList = []

        for (let i = 4; i < tmpList.length; i++) {
          if (i < 8) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        inSideList = []

        for (let i = 8; i < tmpList.length; i++) {
          if (i < 12) {
            inSideList.push(tmpList[i])
          }
        }
        this.carouselList.push(inSideList)
        break
    }
  },

  methods: {
    bannerJump (url) {
      if (!url) {
        return
      }

      console.log(url)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.index-carousel
  background-color #fff
  margin-bottom: 16px
  a
    display inline-block
    position relative
    &:not(:last-child)
      width 314px
      height 100%
      margin-right 1px
    img
      width 100%
      height 100%
    &:last-child
      width 315px
      height 100%
    p.banner-title
      position absolute
      left 0
      bottom 0
      color #fff
      font-size 16px
      margin 0 10px 16px 10px
      line-height 1.5
      height 44px
      no-wrap()
  .el-carousel__item.is-active
    z-index 0
</style>
