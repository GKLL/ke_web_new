/*
 * @Description: 热门文章列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-01 20:09:40
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-20 16:15:38
 */
<template>
  <ul class="list-hot-article">
    <li v-for="(item,index) in limitedArticleList" :key="index">
      <div v-if="index===0" class="top-one">
        <a :href="'/article/' + item.articleId"  target="_blank">
          <img v-lazy="handleImgAddrHandle(item.articleImage)" alt="item.articleTitle">
          <p class="top-one-article-title"><span>{{item.articleTitle}}</span></p>
        </a>
        <svg-icon iconClass="top-tag" class="icon-top-tag"></svg-icon>
        <span class="text-top">TOP</span>
      </div>
      <div v-if="index>0&&index<10" class="top-two">
        <p class="article-title-container">
          <span class="article-title-num" :class="{'grey-num':index>2}">{{index+1}}.</span>
          <span class="article-title">
            <a :href="'/article/' + item.articleId"  target="_blank">{{item.articleTitle}}</a>
          </span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { OSS_ADDRESS } from '@/config/config'
import { handleImgAddr } from '@/utils/utils'

export default {
  name: 'ListHotArticle',
  data () {
    return {
      limitedArticleList: []
    }
  },

  props: {
    limitNum: {
      type: Number,
      default: 10
    },
    hotArticleList: {
      type: Array,
      default: () => []
    }
  },

  created () {
    if (this.hotArticleList.length > this.limitNum) {
      this.limitedArticleList = this.hotArticleList.slice(0, this.limitNum)
    } else {
      this.limitedArticleList = this.hotArticleList
    }
  },

  methods: {
    handleAvatarUrl (addr) {
      return OSS_ADDRESS + addr
    },
    handleImgAddrHandle(data,type){
      if(type){
         return handleImgAddr(data,1)
      }else{
         return handleImgAddr(data)
      }
    },
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-hot-article
  width 100%
  height auto
  background-color #fff
  padding 16px
  li
    &:not(:first-child)
      height 76px
      padding-top 20px
    &:not(:last-child)
      border-bottom 1px dashed #E6E6E6
    .grey-num
      color #D4D2D2
    .top-one
      position relative
      width 268px
      height 177px
      margin-bottom 20px
      .text-top
        position absolute
        top 10px
        left 1px
        color #fff
        display inline-block
        transform rotate(-45deg)
        font-size 13px
      .icon-top-tag
        position absolute
        top -1px
        left -2px
        width 48px
        height 48px
        color #FC5A5D
      img
        width 100%
        height 100%
      p.top-one-article-title
        width 100%
        height 60px
        background rgba(32, 39, 52, .7)
        position absolute
        left 0
        bottom 0
        color #fff
        font-size 13px
        no-wrap(2)
        span
          display inline-block
          width 234px
          height 40px
          margin 10px auto
          line-height 20px
          no-wrap()
    .top-two
    p.article-title-container
      display flex
      font-size 13px
      .article-title-num
        width 35px
        height 36px
        font-size $font-size-medium-x
        font-style italic
        position relative
        top 3px
      .article-title
        flex 1
        a
          display inline-block
          height 40px
          font-size 13px
          line-height 20px
          no-wrap(2)
          &:hover
            color $color-text-active
</style>
