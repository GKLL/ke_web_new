/*
 * @Description: 快讯列表页
 * @Author: LiuZhen
 * @Date: 2018-06-12 09:47:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-20 16:18:14
 */
<template>
  <section class="news-list-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col>
        <section class="new-list-content">
          <news-flash-list :nowdate="nowdate" :indexTabList="tabList" :groupLists="groupLists" :showAddmore="showAddmore" @loadingMore="loadingMore"></news-flash-list>
        </section>
      </el-col>
      <el-col>
        <section class="new-list-aside">
          <list-container activeTabName="热门文章">
            <list-hot-article :hotArticleList="hotArticleList"></list-hot-article>
          </list-container>
        </section>
        <section class="index-hot-video-list">
          <list-container activeTabName="热门视频">
            <div class="hot-video-list-container">
              <hot-video-list :hotVideoList="hotVideoList"></hot-video-list>
            </div>
          </list-container>
          </section>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import NewsFlashList from '@/components/NewsFlashList/NewsFlashList'
import ListContainer from '@/components/ListContainer/ListContainer'
import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
import HotVideoList from '@/components/HotVideoList/HotVideoList'

const api = '/newsFlash/getNewsFlashListByType'

export default {
  name: 'newslist',
  data () {
    return {
      activeName: '全部',
      groupLists: [],
      tabList: ['全部', '区块链快讯', '金融快讯', '股市快讯'],
      allList: [],
      blockChainNewsList: [],
      financeNewsList: [],
      equityNewsList: [],
      hotArticleList: [],   // 热门文章
      hotVideoList: [], // 热门视频
      allPageNum: 1,
      blockChainNewsPageNum: 1,
      financeNewsPageNum: 1,
      equityNewsPageNum: 1,
      showAddmore: {
        all: true,
        block: true,
        finance: true,
        equity: true
      }
    }
  },

  async asyncData ({ store, redirect, error }) {
    let [allList,
         blockChainNewsList,
         financeNewsList,
         equityNewsList,
         hotArticleList,
         hotVideoList] = await Promise.all([
          axios.post(api, { "currentPage":1, "pageSize":20, "newsflashType":"-1" }),
          axios.post(api, { "currentPage":1, "pageSize":20, "newsflashType":"0" }),
          axios.post(api, { "currentPage":1, "pageSize":20, "newsflashType":"1" }),
          axios.post(api, { "currentPage":1, "pageSize":20, "newsflashType":"2" }),
          axios.post('/article/selecttoparticle'),   // 热门文章列表数据
          axios.post('/video/hotVideoList', {})                         // 热门视频列表
      ])
      let date = new Date()
      let day = date.getDay()
      day = day === 1 ? "一" : day === 2 ? "二" : day === 3 ? "三" : day === 4 ? "四" : day === 5 ? "五" : day === 6 ? "六" : "日"
      let nowdate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + " 星期" + day
      return {
        nowdate,
        allList: allList.data.code === '10000' ? allList.data.responseBody.page.data : [],
        blockChainNewsList: blockChainNewsList.data.code === '10000' ? blockChainNewsList.data.responseBody.page.data : [],
        financeNewsList: financeNewsList.data.code === '10000' ? financeNewsList.data.responseBody.page.data : [],
        equityNewsList: equityNewsList.data.code === '10000' ? equityNewsList.data.responseBody.page.data : [],
        hotArticleList: hotArticleList.data.code === '10000' ? hotArticleList.data.responseBody : [],
        hotVideoList: hotVideoList.data.code === '10000' ? hotVideoList.data.responseBody : [],
        showAddmore: {
          all: allList.data.responseBody.page.currentPage >= allList.data.responseBody.page.totalPage ? false : true,
          block: blockChainNewsList.data.responseBody.page.currentPage >= blockChainNewsList.data.responseBody.page.totalPage ? false : true,
          finance: financeNewsList.data.responseBody.page.currentPage >= financeNewsList.data.responseBody.page.totalPage ? false : true,
          equity: equityNewsList.data.responseBody.page.currentPage >= equityNewsList.data.responseBody.page.totalPage ? false : true
        }
      }
  },

  created () {
    this.tabList.forEach((item, index) => {
      switch (index) {
        case 0:
          this.groupLists.push({ tabName: item, list: this.allList })
          break
        case 1:
          this.groupLists.push({ tabName: item, list: this.blockChainNewsList })
          break
        case 2:
          this.groupLists.push({ tabName: item, list: this.financeNewsList })
          break
        case 3:
          this.groupLists.push({ tabName: item, list: this.equityNewsList })
          break
      }
    })
  },

  methods: {
    loadingMore (type) {
      if (!type) {
        throw new Error('params "type" is must description')
      }

      const data = [
        { type: '全部', newsflashType: '-1', pageNumName: 'allPageNum', listName: 'allList', showAddmore: 'all' },
        { type: '区块链快讯', newsflashType: '0', pageNumName: 'blockChainNewsPageNum', listName: 'blockChainNewsList', showAddmore: 'block' },
        { type: '金融快讯', newsflashType: '1', pageNumName: 'financeNewsPageNum', listName: 'financeNewsList', showAddmore: 'finance' },
        { type: '股市快讯', newsflashType: '2', pageNumName: 'equityNewsPageNum', listName: 'equityNewsList', showAddmore: 'equity' }
      ]

      data.forEach((item, index) => {
        if (item.type === type) {
          let params = {"newsflashType":item.newsflashType, "currentPage": ++this[item.pageNumName], "pageSize":20}
          try {
            Promise.resolve(axios.post(api, params))
            .then(({ data }) => {
              if(data.code === '10000') {
                let tmpInfo = data.responseBody.page
                this.showAddmore[item.showAddmore] = tmpInfo.currentPage >= tmpInfo.totalPage ? false : true
                let tmpData = tmpInfo.data || []
                this[item.listName] = tmpData.reduce((coll, item) => {
                  coll.push(item)
                  return coll
                }, this[item.listName])
              }
            })
          } catch (e) {
            throw new Error(e)
          }
        }
      })
    }
  },

  components: {
    NewsFlashList,
    ListContainer,
    ListHotArticle,
    HotVideoList
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.news-list-container
  width 1260px
  margin 20px auto
  .new-list-content
    width 944px
    margin-right 16px
  .new-list-aside
    width 300px
  .index-hot-video-list
    width 300px
    height auto
    margin-right 16px
    .hot-video-list-container
      padding 16px
      background-color #fff
</style>
