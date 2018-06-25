/*
 * @Description: 搜索结果页
 * @Author: LiuZhen
 * @Date: 2018-06-13 16:49:45
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-19 10:59:17
 */
<template>
  <section class="search-result-container">
    <section class="search-result-list">
      <div class="search-input">
        <el-input v-model="keywords" placeholder="请输入搜索结果，比如唯链" ref="searchInput"></el-input>
        <el-button type="primary" round @click="handleSearch"><svg-icon iconClass="search" class="icon-style"></svg-icon></el-button>
      </div>
      <index-list activeName="文章"  :indexTabList="tabList" :groupLists="groupLists" @loadingMore="loadingMore" @changeTab="changeTab" :articleIsEnd="articleIsEnd" :videoIsEnd="videoIsEnd"></index-list>
      <div class="dataEmpty" v-if="!isHave"> 
          <div></div>
          <p>暂无数据</p>
      </div>
    </section>
    <section class="search-keywords-list">
      <list-container activeTabName="热门搜索">
        <hot-keywords :hotKeywordsList="hotKeywordsList" keyName="searchwordDesc"></hot-keywords>
      </list-container>
      <list-container activeTabName="最近搜索">
        <hot-keywords :hotKeywordsList="localKeywordsList"></hot-keywords>
      </list-container>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import IndexList from '@/components/IndexList/IndexList'
import ListContainer from '@/components/ListContainer/ListContainer'
import HotKeywords from '@/components/HotKeywords/HotKeywords'
import { handleWebStorage } from '@/utils/utils'

export default {
  name: 'Search',
  data () {
    return {
      tabType: '文章',
      keywords: '',
      searchResultList: [],
      groupLists: [],
      articleSearchList: [],
      videoSearchList: [],
      tabList: ['文章', '视频'],
      hotKeywordsList: [],
      localKeywordsList: [],
      currentPage: 1,
      totalPage: 1,
      articleIsEnd: false,
      videoIsEnd: true,
      max: 1,
      isSearchData: true // 默认有数据
    }
  },

  created () {
    if (process.client) {
      this.keywords = decodeURIComponent(location.search.match(/\?keywords\=(.*)/)[1])

      // 请求搜索结果
      axios.post('/article/getSearchArticle', {"articleTitle": this.keywords, "currentPage": 1, "publishKind": 1}).then(({ data }) => {

        this.searchResultList = data.code === '10000' ? data.responseBody.data : []
        if(data.responseBody.currentPage >= data.responseBody.totalPage) {
          this.articleIsEnd = true
        } else {
          this.articleIsEnd = false
        }
        if (this.searchResultList && this.searchResultList.length) {
          // 区分文章和视频
          for (let i = 0; i < this.searchResultList.length; i++) {
            if (this.searchResultList[i].publishKind === 1 || this.searchResultList[i].publishKind === null) {
              this.articleSearchList.push(this.searchResultList[i])
            } else {
              this.videoSearchList.push(this.searchResultList[i])
            }
          }

          for (let i = 0; i < this.tabList.length; i++) {
            if (i === 0) {
              this.groupLists.push({
                tabName: this.tabList[i],
                list: this.articleSearchList
              })
            }
            if (i === 1) {
              this.groupLists.push({
                tabName: this.tabList[i],
                list: this.videoSearchList
              })
            }
          }
        }
      })

      // 请求热门关键字
      axios.post('/hotsearch/selectHotAll', {}).then(({ data }) => {
        // 拼接跳转url
        let tmpData = data.code === '10000' ? data.responseBody.data : []
        if (tmpData && tmpData.length) {
          tmpData.forEach((item,index) => {
            item.keywordLink = `/search?keywords=${item.searchwordDesc}`
          })
        }

        this.hotKeywordsList = tmpData
      })

      // 获取最近搜索关键字列表
      if (handleWebStorage.getLocalData('localSearchKeyList')) {
        let tmpData = JSON.parse(handleWebStorage.getLocalData('localSearchKeyList'))
        for (let i = 0; i < tmpData.length; i++) {
          this.localKeywordsList.push({
            keywordDesc: tmpData[i],
            keywordLink: `/search?keywords=${tmpData[i]}`
          })
        }
      }
    }
  },

  methods: {
    changeTab(type) {
      this.tabType = type
    },
    loadingMore (type) {
      let publishKind = 2
      if(this.tabType === '文章') publishKind = 1
      // 请求搜索结果
      axios.post('/article/getSearchArticle', {"articleTitle": this.keywords, "currentPage": ++this.currentPage, publishKind}).then(({ data }) => {
        this.searchResultList = data.code === '10000' ? data.responseBody.data : []
        if(data.responseBody.currentPage >= data.responseBody.totalPage) {
           if(this.tabType === '文章') this.articleIsEnd = true
           else this.videoIsEnd = true
        } else {
          if(this.tabType === '文章') this.articleIsEnd = false
           else this.videoIsEnd = false
        }

        if (this.searchResultList && this.searchResultList.length) {
          // 区分文章和视频
          for (let i = 0; i < this.searchResultList.length; i++) {
            if (this.searchResultList[i].publishKind === 1 || this.searchResultList[i].publishKind === null) {
              this.groupLists[0].list.push(this.searchResultList[i])
            } else {
              this.groupLists[1].list.push(this.searchResultList[i])
            }
          }
        }
      })
    },
    handleSearch () {
      this.isHave = true
      let tmpData = []
      if (handleWebStorage.getLocalData('localSearchKeyList')) tmpData = JSON.parse(handleWebStorage.getLocalData('localSearchKeyList'))
      if(tmpData.indexOf(this.keywords) === -1){
        this.localKeywordsList.unshift({
          keywordDesc: this.keywords,
          keywordLink: `/search?keywords=${this.keywords}`
        })
        tmpData.unshift(this.keywords)
        if(tmpData.length > this.max) {
          this.localKeywordsList.length = this.max
          tmpData.length = this.max
        }
        handleWebStorage.setLocalData('localSearchKeyList', JSON.stringify(tmpData))
      }

      let publishKind = 2
      if(this.tabType === '文章') publishKind = 1
      this.groupLists = []
      this.articleSearchList = []
      this.videoSearchList = []
      this.currentPage = 1
      this.totalPage = 1
      // 请求搜索结果
      axios.post('/article/getSearchArticle', {"articleTitle": this.keywords, "currentPage": 1, publishKind}).then(({ data }) => {
        this.searchResultList = data.code === '10000' ? data.responseBody.data : []
        if (this.searchResultList.length === 0) this.isSearchData = false // 请求后数据为空
        if(data.responseBody.currentPage >= data.responseBody.totalPage) {
           if(this.tabType === '文章') this.articleIsEnd = true
           else this.videoIsEnd = true
        } else {
          if(this.tabType === '文章') this.articleIsEnd = false
           else this.videoIsEnd = false
        }
        if (this.searchResultList && this.searchResultList.length) {
          // 区分文章和视频
          for (let i = 0; i < this.searchResultList.length; i++) {
            if (this.searchResultList[i].publishKind === 1 || this.searchResultList[i].publishKind === null) {
              this.articleSearchList.push(this.searchResultList[i])
            } else {
              this.videoSearchList.push(this.searchResultList[i])
            }
          }
        }

        for (let i = 0; i < this.tabList.length; i++) {
          if (i === 0) {
            this.groupLists.push({
              tabName: this.tabList[i],
              list: this.articleSearchList
            })
          }
          if (i === 1) {
            this.groupLists.push({
              tabName: this.tabList[i],
              list: this.videoSearchList
            })
          }
        }
      })
    }
    

  },

  components: {
    IndexList,
    ListContainer,
    SvgIcon,
    HotKeywords
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.search-result-container
  display flex
  width 972px
  margin 50px auto
  .search-result-list
    width 632px
    margin-right 40px
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
      background-color #fff
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
  .search-keywords-list
    width 300px
  .dataEmpty
    div
      width 151px
      height 157px
      background-image url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/dataNull.png')
      background-size 100% 100%
      margin 0 auto
      margin-top 100px
    p
      text-align center 
      font-size 14px
      color #333
      margin-top 20px
</style>
