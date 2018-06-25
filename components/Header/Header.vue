/*
 * @Description: 页头组件
 * @Author: LiuZhen
 * @Date: 2018-05-28 20:04:41
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 15:56:09
 */
<template>
  <header class="header">
    <section class="logo">
      <nuxt-link to="/"><svg-icon iconClass="logo" class="icon-logo"></svg-icon></nuxt-link>
    </section>
    <section class="features-container">
      <div class="nav-list"><nav-list></nav-list></div>
      <div class="features-search" @click="showSearch">
        <svg-icon iconClass="search" class="icon-search"></svg-icon>
      </div>
      <div class="features-creation-btn">
        <el-button type="primary" round>写文章</el-button>
      </div>
      <div class="features-client-app" v-on:mouseenter="toggleNextMenu($event,'show')" v-on:mouseleave="toggleNextMenu($event,'hide')">
        <span><svg-icon iconClass="client" class="icon-client"></svg-icon></span>
        <span>客户端</span>
        <span class="client-qrcode">
          <em><img :src="kgLogo" alt="千氪财经"></em>
          <em>千氪</em>
          <em><img :src="qrCode" alt=""></em>
          <em>iPhone & Android</em>
        </span>
      </div>
      <div class="features-login-register" v-if="$store.state.userLoginStatus===false">
        <span><svg-icon iconClass="member" class="icon-member"></svg-icon></span>
        <span><a href="javascript:;" @click="handlePageChange">登录</a> l </span>
        <span><a href="/register">注册</a></span>
      </div>
      <div v-if="$store.state.userLoginStatus===true" class="user-logined" v-on:mouseenter="toggleNextMenu($event,'show')" v-on:mouseleave="toggleNextMenu($event,'hide')">
        <img v-if="userAvatar" v-lazy="handleImgAddress(userAvatar)" alt="">
        <svg-icon v-if="!userAvatar" iconClass="person" style="position: relative;top: -6px;width: 22px;height: 22px;"></svg-icon>
        <!-- <img src="http://www.shejiye.com/uploadfile/icon/2017/0203/shejiyeicondc4fz0bubgs.png" alt=""> -->
        <div class="user-login-menu">
          <ul>
            <li v-for="(item,index) in loginMenu" :key="index">
              <a :href="item.url">{{item.title}}</a>
            </li>
            <li>
              <a href="javascript:;" @click.stop="logout">退出登录</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </header>
</template>

<script type="text/ecmascript-6">
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { WEBSTORAGE_TOKEN_NAME } from '@/config/config'
import { handleWebStorage } from '@/utils/utils'
import { mapMutations } from 'vuex'
import NavList from '@/components/Header/NavList'
import $http from 'axios'
import { handleImgMixin } from '@/utils/mixins'

export default {
  name: 'Header',
  mixins: [handleImgMixin],
  data () {
    return {
      kgLogo: require('../../assets/img/kg_logo.png'),
      qrCode: require('../../assets/img/down_app_qrcode.png'),
      loginMenu: [
        { title: '我的财富', url: '/personal' },
        { title: '我的专栏', url: '/personal#column' },
        { title: '我的评论', url: '/personal#comment' },
        { title: '我的收藏', url: '/personal#collect' },
        { title: '账号与安全', url: '/personal#account' }
      ],
      userAvatar: ''
    }
  },

  mounted () {
    const avatar = handleWebStorage.getLocalData('userAvatar')
    if (typeof avatar === 'string' && avatar === 'null') {
      this.userAvatar = ''
    } else if (typeof avatar === 'string' && avatar !== 'null') {
      this.userAvatar = avatar
    }
      // this.userAvatar = handleWebStorage.getLocalData('userAvatar') !== 'null' ? handleWebStorage.getLocalData('userAvatar') : ''
  },

  methods: {
    ...mapMutations([
      'SET_SEARCH_STATUS'
    ]),

    logout () {
      this.$store.dispatch('userLogout').then(() => {
        handleWebStorage.removeLocalData('userAvatar')
        // this.$router.push('/')
      })
    },

    // 显示二级菜单信息弹层
    toggleNextMenu (event, type) {
      const ele = event.target.lastChild
      if (type === 'show') {
        if (ele.nodeType === 1) {
          ele.style.display = 'block'
        }
      } else if (type === 'hide') {
        if (ele.style.display === 'block') {
          ele.style.display = 'none'
        }
      }
    },

    // 显示搜索浮层
    showSearch () {
      this.SET_SEARCH_STATUS(true)
    },

    // ...
    handlePageChange () {
      handleWebStorage.setLocalData('prevUrl', location.pathname, 'sessionStorage')
      this.$router.push('/login')
    }
  },

  components: {
    NavList,
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.header
  display flex
  background-color #fff
  width 100%
  height 60px
  padding 0 120px 0 50px
  .logo
    width 140px
    height 100%
    .icon-logo
      width 140px
      height 37px
      color: $color-text-active
      margin-top: 12px
  .features-container
    flex 1
    text-align right
    font-size 14px
    position relative
    &>div
      display inline-block
      height auto
    .features-search
      margin-left 80px
      cursor pointer
      .icon-search
        position relative
        top 5px
        width 18px
    .features-creation-btn
      margin-left 30px
      button
        width 78px
        height 28px
        line-height 28px
        font-size 13px
        color #fff
        padding 0
    .features-client-app
      position relative
      margin-left 30px
      color $color-text-active
      cursor pointer
      font-size 14px
      height 45px
      .client-qrcode
        display none
        position absolute
        top 45px
        left -100%
        background-color #fff
        border 1px solid #E6E6E6
        box-shadow 6px 0px 10px rgba(232, 232, 232, .5)
        width 220px
        text-align center
        z-index 100
        padding 20px 0
        em
          display block
          width 100%
          color #333
          font-size 13px
          &:first-child
            margin-bottom 20px
          &:nth-child(2)
            font-weight bold
            margin-bottom 20px
          &:nth-child(3)
            margin-bottom 20px
      .icon-client
        width 18px
        position relative
        top 5px
        margin-right 5px
    .features-login-register
      margin-left 30px
      .icon-member
        width 18px
        position relative
        top 5px
        margin-right 5px
    .user-logined
      position relative
      margin-left 30px
      top 9px
      height 47px
      img
        width 30px
        height 30px
        border-radius 50%
        &:hover
          cursor pointer
      .user-login-menu
        display none
        position absolute
        top 47px
        right -46px
        width 120px
        height auto
        text-align center
        background-color #fff
        box-shadow 6px 0px 10px rgba(232, 232, 232, .5)
        z-index 100
        ul
          li
            width 100%
            height 45px
            line-height 45px
            font-size 13px
            a
              display inline-block
              width 100%
              height 100%
</style>
