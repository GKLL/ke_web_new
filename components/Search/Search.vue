/*
 * @Description: 搜索浮层组件
 * @Author: LiuZhen
 * @Date: 2018-06-13 10:46:17
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 16:41:36
 */
<template>
  <transition name="show">
    <section class="search-ele-container" v-show="searchEleStatus">
      <h1>
        <span @click="closeSearch"><svg-icon iconClass="delete" class="icon-style"></svg-icon></span>
      </h1>
      <div class="search-ele-main">
        <div class="search-input">
          <el-input v-model="keywords" placeholder="请输入搜索结果，比如唯链" ref="searchInput"></el-input>
          <el-button type="primary" round @click="handleSearch"><svg-icon iconClass="search" class="icon-style"></svg-icon></el-button>
        </div>
        <div class="hot-search">
          <h3>热门搜索</h3>
          <ul>
            <li v-for="(keyword,wordsIndex) in hotKeywordsList" :key="wordsIndex">
              <nuxt-link to="" @click.native="clickSearch(keyword.searchwordDesc)">{{keyword.searchwordDesc}}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="near-search">
          <h3>
            <el-row>
              <el-col :span="12"><h3>最近搜索</h3></el-col>
              <el-col :span="12"><div class="clear" @click="clearLocalWords">清空</div></el-col>
            </el-row>
          </h3>
          <ul>
            <li v-for="(localkey,localkeyIndex) in localKeywordsList" :key="localkeyIndex">
              <nuxt-link to="" @click.native="clickSearch(localkey)">{{localkey}}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="search-banner" v-if="resultBannerList.length">
          <el-row>
            <el-col :span="8" class="banner-container" v-for="(item,index) in resultBannerList" :key="index">
              <a :href="item.adverLink" target="_blank">
                <img v-lazy="handleImgAddress(item.imageAddress)" alt="">
              </a>
            </el-col>
          </el-row>
        </div>
      </div>
    </section>
  </transition>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import { mapState, mapMutations } from 'vuex'
import { handleWebStorage } from '@/utils/utils'
import { setTimeout } from 'timers';
import { handleImgMixin } from '@/utils/mixins'

export default {
  name: 'Search',
  mixins: [handleImgMixin],
  data () {
    return {
      keywords: '',
      hotKeywordsList: [],
      localKeywordsList: [],
      resultBannerList: []
    }
  },

  props: {
    searchBannerList: {
      type: Array,
      default: () => []
    },

    mostShowNum: {
      type: Number,
      default: 3
    }
  },

  created () {
    this.resultBannerList = this.searchBannerList.filter((item) => {
      return item.imagePos === 31
    })

    if (this.resultBannerList.length > this.mostShowNum) {
      this.resultBannerList = this.resultBannerList.slice(0, this.mostShowNum)
    }

    if (process.client) {
      // 获取热门搜索关键字
      axios.post('/hotsearch/selectHotAll', {}).then(({ data }) => {
        this.hotKeywordsList = data.code === '10000' ? data.responseBody.data : []
      })

      // 获取本地搜索关键字
      this.getLocalSearchWordsList()
    }
  },

  computed: {
    ...mapState([
      'searchEleStatus'
    ])
  },

  methods: {
    ...mapMutations([
      'SET_SEARCH_STATUS'
    ]),

    // 关闭浮层
    closeSearch () {
      this.SET_SEARCH_STATUS(false)
    },

    // 获取本地搜索关键字
    getLocalSearchWordsList () {
      if (handleWebStorage.getLocalData('localSearchKeyList')) {
        this.localKeywordsList = JSON.parse(handleWebStorage.getLocalData('localSearchKeyList'))
      }
    },

    // 清空本地存储的搜索关键字
    clearLocalWords () {
      handleWebStorage.removeLocalData('localSearchKeyList')
      this.localKeywordsList = []
    },

    // 执行搜索
    handleSearch () {
      if (!this.keywords) {
        return
      }

      if (!handleWebStorage.getLocalData('localSearchKeyList')) {
        handleWebStorage.setLocalData('localSearchKeyList', JSON.stringify([this.keywords]))
      } else {
        let data = JSON.parse(handleWebStorage.getLocalData('localSearchKeyList'))

        // 检查当前关键字是否已存在
        if (data.indexOf(this.keywords) === -1) {
          data.push(this.keywords)

          handleWebStorage.setLocalData('localSearchKeyList', JSON.stringify(data))
        }

        this.getLocalSearchWordsList()
      }

      this.closeSearch()
      this.$router.push(`/search?keywords=${this.keywords}`)
    },

    // 点击搜索关键字
    clickSearch (key) {
      this.closeSearch()
      this.$router.push(`/search?keywords=${key}`)
    }
  },

  watch: {
    searchEleStatus (newVal) {
      if (newVal) {
        // 清空上次的搜索词
        this.keywords = ''

        // 打开搜索框时输入框获取焦点
        try {
          setTimeout(() => {
            this.$refs.searchInput.focus()
          }, 200)
        } catch (e) {
          throw new Error(e)
        }
      }
    }
  },

  components: {
    SvgIcon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.search-ele-container
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color rgba(255, 255, 255, .98)
  padding 40px
  z-index 1001
  &.show-enter-active, &.show-leave-active
    transition: all 0.2s
  &.show-enter
    transform: scale(0.4, 0.4)
  &.show-leave-to
    transform: scale(0, 0)
  h1
    text-align right
    .icon-style
      width 28px
      height 28px
      color #E6E6E6
      border-radius 50%
      cursor pointer
  .search-ele-main
    width 640px
    height 300px
    margin 25px auto 0 auto
    .search-input
      display flex
      width 600px
      height 40px
      border-left 1px solid #e6e6e6
      border-top 1px solid #e6e6e6
      border-bottom 1px solid #e6e6e6
      border-top-left-radius 20px
      border-bottom-left-radius 20px
      border-top-right-radius 0
      border-bottom-right-radius 0
      position relative
      margin-bottom 25px
      input
        width 580px
        height 38px
        border none
        margin-left 15px
        background-color transparent
      button
        position absolute
        top -1px
        right -40px
        width 80px
        height 40px
        .icon-style
          position relative
          top -1px
    .hot-search,
    .near-search
      margin-bottom 25px
      h3
        font-size 16px
        color $color-text-active
        font-weight normal
        margin-bottom 20px
      ul
        width 100%
        li
          display inline-block
          margin-right 10px
          margin-bottom 10px
          border 1px solid #E6E6E6
          border-radius 20px
          a
            display inline-block
            width 100%
            height 100%
            padding 7px 17px
            font-size 14px
            color #747474
    .near-search
      h3
        margin-bottom 10px
        .clear
          text-align right
          font-size 13px
          color #747474
          cursor pointer
    .search-banner
      .banner-container
        width 200px
        height 134px
        &:not(:last-child)
          margin-right 16px
        img
          width 100%
          height 100%
</style>
