/*
 * @Description: 页面右下角Fixed功能区域，包含微信,QQ,聊天和回到顶部功能
 * @Author: LiuZhen
 * @Date: 2018-06-05 21:08:48
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 16:44:29
 */
<template>
  <aside class="fixed-function" ref="fixedFun">
    <div class="weixin" v-on:mouseenter="toggleThisInfo($event,'show')" v-on:mouseleave="toggleThisInfo($event,'hide')">
      <svg-icon iconClass="wechat" class="icon-style"></svg-icon>
      <div class="weixin-qrcode">
        <section class="weixin-qrcode-container">
          <section class="qrcode"><img v-lazy="wxPublicImg"></section>
          <section class="info">
            <p>千氪财经</p>
            <p>微信公众号</p>
            <p>微信号：KG</p>
          </section>
        </section>
      </div>
    </div>
    <div class="weixin" v-on:mouseenter="toggleThisInfo($event,'show')" v-on:mouseleave="toggleThisInfo($event,'hide')">
      <svg-icon iconClass="weibo" class="icon-style"></svg-icon>
      <!-- <div class="weixin-qrcode">
        <section class="weixin-qrcode-container">
          <section class="qrcode"><img v-lazy="wxPublicImg"></section>
          <section class="info">
            <p>千氪财经</p>
            <p>微信公众号</p>
            <p>微信号：KG</p>
          </section>
        </section>
      </div> -->
    </div>
    <div class="qq" v-on:mouseenter="toggleThisInfo($event,'show')" v-on:mouseleave="toggleThisInfo($event,'hide')">
      <svg-icon iconClass="qq" class="icon-style"></svg-icon>
      <div class="qq-qrcode">
        <section class="qq-qrcode-container">
          <section class="qrcode"><img v-lazy="qqGroupImg"></section>
          <section class="info">
            <p>千氪财经</p>
            <p>官方QQ群</p>
            <p>群号：711044678</p>
          </section>
        </section>
      </div>
    </div>
    <div class="chat" v-on:mouseenter="toggleThisInfo($event,'show')" v-on:mouseleave="toggleThisInfo($event,'hide')">
      <svg-icon iconClass="message" class="icon-style"></svg-icon>
      <a @click="handleFeedback" href="javascript:;" class="feedback">意见反馈</a>
    </div>
    <div class="return-top" @click.stop="toTop"><svg-icon iconClass="top_arrow" class="icon-style"></svg-icon></div>
  </aside>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FixedFunction',
  data () {
    return {
      wxPublicImg: require('../../assets/img/kg_wechat_public_number_qrcode.png'),
      qqGroupImg: require('../../assets/img/kg_qq_group_qrcode.png')
    }
  },

  created () {
    // 动态修改工具栏左右侧的距离
    if (process.client) {
      let screenWidth = window.innerWidth
      // 计算位置
      const position = (screenWidth - 1260) / 2 / 2 / 2
      this.$nextTick(() => {
        this.$refs.fixedFun.style.right = position + 'px'
      })
    }

  },

  methods: {
    ...mapMutations([
      'SET_FEEDBACK_STATUS'
    ]),

    toggleThisInfo (event, type) {
      const ele = event.target.lastChild
      if (type === 'show') {
        ele.style.top = 0
      } else if (type === 'hide') {
        ele.style.top = '-10000px'
      }
    },

    // 回到顶部
    toTop () {
      const sTop = document.body.scrollTop + document.documentElement.scrollTop
      if (sTop !== 0) {
        document.body.scrollTop = document.documentElement.scrollTop = 0
      }
    },

    // 显示意见反馈弹出层
    handleFeedback () {
      this.SET_FEEDBACK_STATUS(true)
    }
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.fixed-function
  position fixed
  right -10000px
  bottom 50px
  div
    width 34px
    height 34px
    line-height 46px
    background-color #fff
    text-align center
    &:hover
      cursor pointer
      background-color $color-text-active
    &:not(:last-child)
      margin-bottom 6px
    .icon-style
      width 24px
      height 24px
      color #ccc
      &:hover
        color #fff
  .weixin
    position relative
    .weixin-qrcode
      position absolute
      top -10000px
      right 34px
      width 198px
      height 97px
      background-color transparent
      padding-right 10px
      .weixin-qrcode-container
        display flex
        width 188px
        height 100%
        padding 14px 10px
        z-index 100
        background-color #fff
        box-shadow 3px 3px 10px rgba(232, 232, 232, .5)
        .qrcode
          width 70px
          height 70px
          margin-right 5px
          border 1px dashed #333
          padding 3px
          img
            width 62px
            height 62px
        .info
          flex 1
          width 100%
          height 100%
          font-size 13px
          text-align left
          p
            margin 0
            padding 0
            line-height 1.8
            &:not(:last-child)
              color #333
              font-weight 700
            &:last-child
              color #666
              font-size 12px
  .qq
    position relative
    .qq-qrcode
      position absolute
      top -10000px
      right 34px
      width 215px
      height 97px
      background-color transparent
      padding-right 10px
      .qq-qrcode-container
        display flex
        width 205px
        height 97px
        padding 14px 10px
        z-index 100
        background-color #fff
        box-shadow 3px 3px 10px rgba(232, 232, 232, .5)
        .qrcode
          width 70px
          height 70px
          margin-right 5px
          border 1px dashed #333
          padding 3px
          img
            width 62px
            height 62px
        .info
          flex 1
          width 100%
          height 100%
          font-size 13px
          text-align left
          p
            margin 0
            padding 0
            line-height 1.8
            &:not(:last-child)
              color #333
              font-weight 700
            &:last-child
              color #666
              font-size 12px
  .chat
    position relative
    .feedback
      position absolute
      top -10000px
      right 34px
      width 70px
      height 34px
      line-height 36px
      z-index 100
      background-color $color-text-active
      color #fff
      font-size 12px
</style>
