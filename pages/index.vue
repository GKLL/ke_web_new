/*
 * @Description: 首页
 * @Author: LiuZhen
 * @Date: 2018-05-28 20:04:41
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 16:37:57
 */
<template>
  <main class="main">
    <!-- 轮播行情 -->
    <section class="index-full-broadcast">
      <broadcast-info :broadcaseData="marketData" showType="quotation" :broaddelay="6000"></broadcast-info>
    </section>
    <!-- 轮播Banner -->
    <Carousel :bannerList="bannerList"></Carousel>
    <!-- 首页横屏广告位 -->
    <section class="index-full-banner" v-if="chkBannerLength(bannerList,12)">
      <picture-banner :bannerList="bannerList" :bannerPos="12"></picture-banner>
    </section>
    <!-- 快讯 -->
    <section class="index-full-broadcast">
      <broadcast-info :broadcaseData="hoursData" :isTitle="true" titleName="7X24小时快讯"></broadcast-info>
    </section>
    <!-- 主内容区域 -->
    <section class="index-list-container">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col>
          <section class="index-info-list">
            <index-list activeName="最新资讯" :indexTabList="indexTabList" :groupLists="groupLists" @loadingMore="loadingMore" bestNewArticleEnd="true" videoIsEnd="true"></index-list>
          </section>
        </el-col>
        <el-col>
          <section class="index-hot-video-list">
            <list-container activeTabName="热门视频">
              <div class="hot-video-list-container">
                <hot-video-list :hotVideoList="hotVideoList"></hot-video-list>
              </div>
            </list-container>
          </section>
          <section class="index-banner-3" v-if="chkBannerLength(bannerList,13)">
            <picture-banner :bannerList="bannerList" :bannerPos="13"></picture-banner>
          </section>
          <section class="index-hot-article-list" ref="hotArticleContent">
            <list-container activeTabName="热门文章">
              <list-hot-article :hotArticleList="hotArticleList"></list-hot-article>
            </list-container>
          </section>
        </el-col>
        <el-col>
          <section class="index-hot-column-list">
            <list-container activeTabName="热门专栏">
              <list-special-column :hotSpecialColumn="hotSpecialColumn"></list-special-column>
            </list-container>
          </section>
          <section class="index-banner-5" v-if="chkBannerLength(bannerList,15)">
            <picture-banner :bannerList="bannerList" :bannerPos="15"></picture-banner>
          </section>
          <list-container activeTabName="百科词条" moreInfoUrl = "/baike" :showMore="true">
            <Encyclopedia :encyclopediaList="encyclopediaList"></Encyclopedia>
          </list-container>
          <list-container activeTabName="热门关键字" :moreInfoUrl = "hotKeyWords" :showMore="true">
            <hot-keywords :hotKeywordsList="hotKeywordsList"></hot-keywords>
          </list-container>
          <section class="index-banner-5" v-if="chkBannerLength(bannerList,16)">
            <picture-banner :bannerList="bannerList" :bannerPos="16"></picture-banner>
          </section>
        </el-col>
      </el-row>
    </section>
    <Search :searchBannerList="searchBannerList"></Search>
  </main>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import Carousel from '@/components/Carousel/Carousel'
import PictureBanner from '@/components/PictureBanner/PictureBanner'
import IndexList from '@/components/IndexList/IndexList'
import ListContainer from '@/components/ListContainer/ListContainer'
import HotVideoList from '@/components/HotVideoList/HotVideoList'
import ListSpecialColumn from '@/components/ListSpecialColumn/ListSpecialColumn'
import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
import Encyclopedia from '@/components/Encyclopedia/Encyclopedia'
import HotKeywords from '@/components/HotKeywords/HotKeywords'
import BroadcastInfo from '@/components/BroadcastInfo/BroadcastInfo'
import { handleRequestParams, handleWebStorage } from '@/utils/utils'
import { WEBSOCKET_ADDRESS } from '@/config/config'
import Search from '@/components/Search/Search'

export default {
  name: 'Index',
  data () {
    return {
      bannerList: [],
      searchBannerList: [],
      articleList: [],
      videoList: [],
      hotVideoList: [],
      hotSpecialColumn: [],
      hotArticleList: [],
      encyclopediaList: [],
      hotKeywordsList: [],
      groupLists: [],  // 传递到列表子组件中的组合好的列表数据
      indexTabList: ['最新资讯', '视频'],
      newsPageNum: 1,
      videoPageNum: 1,
      hoursData:[],    // 新闻轮播数据
      marketData: [],  // 行情轮播数据
      hotKeyWords: 'hotKeyWords',
      carouselList: []   // 左右轮播banner广告数据
    }
  },

  async asyncData ({ store, redirect, error }) {
    console.log("======================开始进入node服务器首页=======================")
    console.log("======================接口调用api接口=======================")
    let [bannerList,
         searchBannerList,
         articleList,
         videoList,
         hotVideoList,
         hotSpecialColumn,
         hotArticleList,
         encyclopediaList,
         hotKeywordsList,
         hoursData,
         marketData] = await Promise.all([
          axios.post('/siteimageapi/listsiteimage', { "navigator_pos":1 }),
          axios.post('/siteimageapi/listsiteimage', { "navigator_pos":3 }),
          axios.post('/article/selectArticleAll', { "currentPage":1 }),   // 文章列表数据
          axios.post('/article/getChannelArt', { "currentPage":1 }),      // 视频列表数据
          axios.post('/video/hotVideoList', {}),                          // 热门视频列表
          axios.post('/userprofile/getUserprofile', {"currentPage":1}),   // 热门专栏列表数据
          axios.post('/article/selecttoparticle', {}),                    // 热门文章列表数据
          axios.post('/article/encyclopediaList', {}),                    // 百科词条列表数据
          axios.post('/keywords/getkeywordsAll', {"secondChannel":0}),    // 热门关键字列表数据
          axios.post('/newsFlash/websocketNewsFlash', {}),                // 获取第一次的24小时新闻数据
          axios.post('/ticker/getTicker', {})                             // 获取第一次的行情轮播数据
      ])
      console.log("======================api接口调用完毕=======================")
      return {
        bannerList: bannerList.data.code === '10000' ? bannerList.data.responseBody : [],
        searchBannerList: searchBannerList.data.code === '10000' ? searchBannerList.data.responseBody : [],
        articleList: articleList.data.code === '10000' ? articleList.data.responseBody.data : [],
        videoList: videoList.data.code === '10000' ? videoList.data.responseBody.data : [],
        hotVideoList: hotVideoList.data.code === '10000' ? hotVideoList.data.responseBody : [],
        hotSpecialColumn: hotSpecialColumn.data.code === '10000' ? hotSpecialColumn.data.responseBody.data : [],
        hotArticleList: hotArticleList.data.code === '10000' ? hotArticleList.data.responseBody : [],
        encyclopediaList: encyclopediaList.data.code === '10000' ? encyclopediaList.data.responseBody : [],
        hotKeywordsList: hotKeywordsList.data.code === '10000' ? hotKeywordsList.data.responseBody.data : [],
        hoursData: hoursData.data.code === '10000' ? hoursData.data.responseBody.data : [],
        marketData: marketData.data.code === '10000' ? marketData.data.responseBody : [],
      }
  },

  // set cooPartner to vuex
  async fetch ({ store, params }) {
    let { data } = await axios.post('/friendlylink/getfriendlyAll', {"secondChannel":0})
    if (data.code === '10000') {
      store.commit('SET_COOPARTNER_LIST', data.responseBody.data)
    }
  },

  created () {
    if (this.marketData) {
      // 格式化行情数据
      this.marketData = this.handleDataFormat(this.marketData)
    }

    if (process.client) {
      // 向资讯列表数据中插入广告数据
      // 获取资讯列表页中的广告数据列表
      let articleBannerList = []
      if (this.bannerList && this.bannerList.length) {
        for (let i = 0; i < this.bannerList.length; i++) {
          if (this.bannerList[i].imagePos === 14) {
            this.bannerList[i].itemType = 'AD'
            articleBannerList.push(this.bannerList[i])
          }
        }

        if (process.client && articleBannerList && articleBannerList.length) {
          switch (articleBannerList.length) {
            case 1:
              this.articleList.splice(4, 0, articleBannerList[0])
              break
            case 2:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(4, 0, articleBannerList[1])
              break
            case 3:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(4, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              break
            case 4:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(4, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              this.articleList.splice(15, 0, articleBannerList[3])
              break
            case 5:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(4, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              this.articleList.splice(15, 0, articleBannerList[3])
              this.articleList.splice(20, 0, articleBannerList[4])
              break
            case 6:
              this.articleList.splice(4, 0, articleBannerList[0])
              this.articleList.splice(4, 0, articleBannerList[1])
              this.articleList.splice(15, 0, articleBannerList[2])
              this.articleList.splice(15, 0, articleBannerList[3])
              this.articleList.splice(20, 0, articleBannerList[4])
              this.articleList.splice(20, 0, articleBannerList[5])
              break
          }
        }
      }

      // 拼装返回的资讯列表数据
      for (let i = 0; i < this.indexTabList.length; i++) {
        if (i === 0) {
          this.groupLists.push({
            tabName: this.indexTabList[i],
            list: this.articleList
          })
        }
        if (i === 1) {
          this.groupLists.push({
            tabName: this.indexTabList[i],
            list: this.videoList
          })
        }
      }
    }
  },

  mounted () {
    // 处理websocket数据
    const that = this;
    //websocket 获取24小时快讯
    // 初始化快讯数据
    // this.hoursData = JSON.parse(handleWebStorage.getLocalData('hoursData'))
    var hoursSoket;
    // 快讯websocket地址
    // var urlTiket = "wss://snatch.kg.com/newsFlashSocket";
    var urlTiket = WEBSOCKET_ADDRESS + "newsFlashSocket"
    hoursSoket = new WebSocket(urlTiket)
    hoursSoket.onopen = function() {
      //发送连接
      hoursSoket.send("index_newsFlash")
    };
    hoursSoket.onmessage = function(data) {
      //获取返回数据
      var allData = JSON.parse(data.data)
      //判断websocket 是否异常
      if(allData.ifHave == 0){
        that.hoursData = JSON.parse(handleWebStorage.getLocalData('hoursData'))
      }else{
        that.hoursData = allData
        handleWebStorage.setLocalData('hoursData',JSON.stringify(allData))
      }
    };
    //websocket 获取行情数据
    var marketSoket;
    var marketPost = WEBSOCKET_ADDRESS + "indexPriceSocket"
    marketSoket = new WebSocket(marketPost)
    marketSoket.onopen = function() {
      //发送连接
      marketSoket.send("index_Price");
    };
    marketSoket.onmessage = function(data) {
      //获取返回数据
      var marketData = JSON.parse(data.data)

      // 重新组合数据
      that.marketData = that.handleDataFormat(marketData)

      //判断websocket 是否异常
      if(marketData.ifHave == 0){
        that.marketData = JSON.parse(handleWebStorage.getLocalData('marketData'))
      }else{
        handleWebStorage.setLocalData('marketData',JSON.stringify(marketData))
      }
    }
  },

  methods: {
    loadingMore (type) {
      if (!type) {
        throw new Error('params "type" is must description')
      }

      let reqUrl = null,
          params = null

      // 根据传递的type类型参数指定获取数据的url地址
      switch (type) {
        case '最新资讯':
          params = handleRequestParams({"currentPage": this.newsPageNum + 1})
          reqUrl = `/article/selectArticleAll/?${params}`
          break

        case '视频':
          params = handleRequestParams({"currentPage": this.videoPageNum + 1})
          reqUrl = `/article/getChannelArt/?${params}`
          break
      }

      try {
        Promise.resolve(axios.post(reqUrl))
        .then(({ data }) => {
          if (type === '最新资讯') {
            let tmpData = data.responseBody.data
            this.articleList = tmpData.reduce((coll, item) => {
              coll.push(item)
              return coll
            }, this.articleList)

            this.newsPageNum += 1
          }

          if (type === '视频') {
            let tmpData = data.responseBody.data
            this.videoList = tmpData.reduce((coll, item) => {
              coll.push(item)
              return coll
            }, this.videoList)

            this.videoPageNum += 1
          }
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    handleDataFormat (data) {
      let tmpData = [], resultData = []

      if (data.coinTicker && data.coinTicker.length) {
        tmpData = data.coinTicker.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      if (data.stock && data.stock.ggMarket && data.stock.ggMarket.length) {
        tmpData = data.stock.ggMarket.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      if (data.stock && data.stock.mgMarket && data.stock.mgMarket.length) {
        tmpData = data.stock.mgMarket.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      if (data.stock && data.stock.hsMarket && data.stock.hsMarket.length) {
        tmpData = data.stock.hsMarket.reduce((coll, item) => {
          coll.push(item)
          return coll
        }, tmpData)
      }

      resultData.push(tmpData.slice(0, 7))
      resultData.push(tmpData.slice(7, 14))
      resultData.push(tmpData.slice(14, tmpData.length))

      // 如果最后一组数据不满7个，则从原始数据中读取填入
      if (resultData[2].length < 7) {
        let num = 7 - resultData[2].length
        for (let i = 0; i < tmpData.length; i++) {
          if ((i + 1) <= num) {
            resultData[2].push(tmpData[i])
          }
        }
      }

      return resultData
    },

    chkBannerLength (data, pos) {
      if (Object.prototype.toString.call(data) !== "[object Array]") {
        return
      }

      const tmp = data.filter((item) => {
        return item.imagePos === pos
      })

      return tmp.length ? true : false
    }
  },

  components: {
    Carousel,
    PictureBanner,
    IndexList,
    ListContainer,
    HotVideoList,
    ListSpecialColumn,
    ListHotArticle,
    Encyclopedia,
    HotKeywords,
    BroadcastInfo,
    Search
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../assets/stylus/index.styl'

.main
  width 1260px
  margin 16px auto 0 auto
  overflow hidden
  .index-full-broadcast
    width 100%
    margin-bottom 16px
  .index-full-banner
    width 100%
    height 100px
    margin-bottom 16px
    background-color $color-background-d
  .index-news-flash
    width 100%
    height 115px
    margin-bottom 30px
    background-color $color-background-d
  .index-list-container
    width 100%
    height auto
    margin-bottom 30px
    .index-info-list
      width 628px
      height auto
      margin-right 16px
    .index-hot-video-list
      width 300px
      height auto
      margin-right 16px
      .hot-video-list-container
        padding 16px
        background-color #fff
    .index-hot-column-list
      width 300px
      height auto
    .index-banner-3
      width 300px
      height 400px
      margin-bottom 30px
    .index-banner-5
      width 300px
      height 100px
      margin-bottom 30px
    .index-hot-article-list
      width 300px
      height auto
</style>
