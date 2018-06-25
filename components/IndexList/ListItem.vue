/*
 * @Description: 列表组件，依次展示列表数据
 * @Author: LiuZhen
 * @Date: 2018-05-29 19:23:30
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 17:12:41
 */
<template>
  <ul class="list-item-container">
    <li v-for="(item, index) in listItem" :key="index" :class="{'ad-style':item.itemType==='AD'}">
      <section class="list-item" v-if="!item.itemType">
        <div class="article-img-container">
          <nuxt-link :to="concatUrl(checkIsVideo(item) ? 'video' : 'article', item.articleId)" target="_blank">
            <p class="item-pic">
              <img v-lazy="handleImgAddress(item.articleImage)" :alt="item.articleTitle">
              <span v-if="checkIsVideo(item)" class="icon-round"><svg-icon iconClass="play" class="icon-play"></svg-icon></span>
            </p>
          </nuxt-link>
        </div>
        <div class="article-content-container">
          <p class="article-title">
            <span v-if="getDisplayStatus(item.displayStatus) && !checkIsVideo(item)" class="article-title-tag">{{getDisplayStatus(item.displayStatus)}}</span>
            <span class="article-title-content">
              <nuxt-link :to="concatUrl(checkIsVideo(item) ? 'video' : 'article', item.articleId)" target="_blank">{{strOverflow(item.articleTitle)}}</nuxt-link>
            </span>
          </p>
          <p class="article-desc" :title="item.articleDescription">{{item.articleDescription}}</p>
          <div class="article-info">
            <p class="article-info-author">
              <nuxt-link :to="concatUrl('author', item.createUser)" target="_blank">
                <em class="article-info-author-pic"><img :src="handleImgAddress(item.profileavatar,1)"></em>
              </nuxt-link>
              <nuxt-link :to="concatUrl('author', item.createUser)" target="_blank">
                <em class="article-info-author-name" style="display:inline-block">{{item.username}}</em>
              </nuxt-link>
            </p>
            <p class="article-info-time"><svg-icon iconClass="time" class="icon-time"></svg-icon>{{transformTime(item.updateTimestamp)}}</p>
            <p class="article-info-browsenum"><svg-icon iconClass="view" class="icon-view"></svg-icon>{{item.browseNum}}</p>
          </div>
        </div>
      </section>
      <section class="list-item-ad" v-if="item.itemType==='AD'" :class="{'article-ad':item.itemType==='ad'}">
        <a :href="item.adverLink || ''" target="_blank"><img v-lazy="handleImgAddress(item.imageAddress)" alt=""></a>
      </section>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { handleStrOverflow, formatMsgTime } from '@/utils/utils'
import { handleImgMixin, concatUrlMixin } from '@/utils/mixins'

export default {
  name: 'ListItem',
  mixins: [handleImgMixin, concatUrlMixin],
  data () {
    return {
    }
  },

  props: {
    isColumn: {},
    isShipin: {
      type: Boolean,
      default: false
    },
    listItem: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    checkIsVideo(item){
      if(this.isShipin) return true
      if(item.videoUrl) return true
      return false
    },
    getDisplayStatus (num) {
      if(num == 1) return ''
      if(num == 2) return '置顶'
      if(num == 3) return '推荐'
      return ''
    },
    strOverflow (str) {
      return handleStrOverflow(str)
    },
    transformTime(time){
      return formatMsgTime(time)
    },
  },
  mounted(){
  },
  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-item-container
  li
    background-color $color-background-d
    margin-bottom 16px
    padding 16px
    &.ad-style
      padding 0
    .list-item
      display flex
      .article-img-container
        display inline-block
        width 220px
        height 146px
        margin-right 16px
        p.item-pic
          position relative
          width 220px
          height 146px
          margin-bottom 16px
          img
            width 100%
            height 100%
          .icon-round
            display inline-block
            width 34px
            height 34px
            line-height 34px
            text-align center
            background-color $color-text-active
            border-radius 50%
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
            .icon-play
              width 14px
              height 14px
              color #fff
              position relative
              top 1px
              left 1px
      .article-content-container
        flex: 1
        position relative
        height auto
        .article-title
          font-size $font-size-large
          color #333
          font-weight bold
          margin-bottom 10px
          line-height 26px
          .article-title-tag
            display inline-block
            width 34px
            height 18px
            text-align center
            line-height 18px
            background-color #FC5A5D
            color #fff
            margin-right 10px
            font-size 12px
            position relative
            top -2px
        .article-desc
          font-size $font-size-medium - 1
          color #666
          line-height 22px
          height 40px
          no-wrap()
        .article-info
          position absolute
          left 0
          bottom 0
          display flex
          width 100%
          font-size 12px
          color #9B9B9B
          height 26px
          line-height 26px
          p.article-info-author
            flex: 2
            no-wrap(1)
            .article-info-author-pic
              display inline-block
              width 26px
              height 26px
              border-radius 50%
              overflow hidden
              cursor pointer
              img
                width 100%
                height 100%
            .article-info-author-name
              display inline-block
              width 80px
              vertical-align top
              margin-left 6px
              cursor pointer
              no-wrap(1)
          p.article-info-time
            flex: 2
            .icon-time
              width 12px
              height 12px
              color #9B9B9B
              margin-right 2px
              position relative
              top 2px
          p.article-info-browsenum
            flex: 1
            text-align right
            .icon-view
              width 14px
              height 14px
              color #9B9B9B
              margin-right 2px
              position relative
              top 2px
    .list-item-ad
      width 628px
      height 180px
      a
        display inline-block
        width 100%
        height 100%
        img
          width 100%
          height 100%
</style>
