/*
 * @Description: 页脚组件
 * @Author: LiuZhen
 * @Date: 2018-05-28 20:05:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-15 13:52:47
 */
<template>
  <footer class="footer">
    <section class="in-side-footer" v-if="showArea=='inSidePage'">
      <p>
        <nuxt-link :to="item.url" v-for="(item,index) in inSideNavList" :key="index">{{item.title}}</nuxt-link>
      </p>
      <p>
        <span>{{recordNumber}}</span>
        <span>举报电话:{{serviceTel}}</span>
        <span>举报邮箱:{{email}}</span>
      </p>
    </section>
    <section class="index-footer" v-if="showArea=='index'">
      <div class="index-footer-top">
        <div class="index-footer-parnet-list">
          <div class="parnet-list">
            <h5 class="title">合作伙伴</h5>
            <ul>
              <li v-for="(cooParItem,cooParIndex) in cooPartnerList" :key="cooParIndex">
                <a :href="cooParItem.linkAddress" target="_blank"><img :src="cooParItem.linkName" :alt="cooParItem.linkAddress"></a>
              </li>
            </ul>
          </div>
          <div class="parnet-other">
            <h5 class="title">相关</h5>
            <nuxt-link v-for="(parnetItem,parnetIndex) in indexFooterNavList" :key="parnetIndex" :to="parnetItem.url">{{parnetItem.title}}</nuxt-link >
          </div>
        </div>
        <div class="index-footer-qrcode">
          <p>千氪APP下载</p>
          <p><img :src="qrcode" alt="千氪APP下载"></p>
          <p>iPhone & Android</p>
        </div>
      </div>
      <div class="index-footer-link">
        <div class="friendship-link">
          <!-- <h5 class="title">友情链接</h5>
          <nuxt-link v-for="(parnetItem,parnetIndex) in indexFooterNavList" :key="parnetIndex" :to="parnetItem.url">{{parnetItem.title}}</nuxt-link > -->
        </div>
        <div class="footer-copyright">Copyright © kg.com {{getCurrentYear}}. All rights reserved. {{recordNumber}}</div>
      </div>
    </section>
  </footer>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
  name: 'Footer',
  data () {
    return {
      inSideNavList: [
        { title: 'KG.com', url: '/' },
        { title: '关于我们', url: '/aboutus' },
        { title: '联系我们', url: '/contactus ' },
        { title: '版权说明', url: '/copyright' },
        { title: '专栏申请协议', url: '/columnagreement' }
      ],
      indexFooterNavList: [
        { title: '关于我们', url: '/aboutus' },
        { title: '联系我们', url: '/contactus' },
        { title: '版权申明', url: '/copyright' },
        { title: '注册用户协议', url: '/useragreement' },
        { title: '专栏申请协议', url: '/columnagreement' }
      ],
      recordNumber: '蜀ICP备18000636号-1',
      serviceTel: '028-86056123',
      email: 'maxin@kg.com',
      qrcode: require('../../assets/img/down_app_qrcode.png'),
      year: 2018
    }
  },

  props: {
    showArea: {
      type: String,
      default: 'inSidePage'
    },
    coopPartnerList: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    getCurrentYear () {
      return new Date().getFullYear()
    },

    ...mapState([
      'cooPartnerList'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.footer
  width 100%
  background-color $color-background-b
  color #fff
  div
    height auto
  .in-side-footer,
  .index-footer
    width 1260px
    text-align center
    margin 0 auto
    font-size 12px
  .in-side-footer
    height 250px
    p
      &:first-child
        padding-top 178px
        a
          color #9B9B9B
          &:not(:last-child)
            margin-right 15px
      &:last-child
        margin-top 15px
        span
          color #9B9B9B
          &:not(:last-child)
            margin-right 20px
  .index-footer
    height 409px
    color #747474
    text-align left
    padding-top 35px
    h5.title
      font-size 15px
      color #fff
      margin-bottom 30px
    .index-footer-top
      display flex
      border-bottom 1px solid #30343D
      padding-bottom 30px
      .index-footer-parnet-list
        flex 1
        .parnet-list
          ul
            width 925px
            li
              display inline-block
              width 106px
              height 38px
              margin-right 28px
              a
                display inline-block
                width 100%
                height 100%
                text-align left
                img
                  width 100%
                  height 100%
        .parnet-other
          text-align left
          margin-top 30px
          a
            group-link()
      .index-footer-qrcode
        width 150px
        text-align center
        p
          &:first-child
            color #fff
            font-size 15px
            margin-bottom 25px
          &:last-child
            margin-top 15px
    .index-footer-link
      line-height 43px
      .footer-copyright
        text-align center
</style>
