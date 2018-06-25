/*
 * @Description: 列表二级页面
 * @Author: LiuZhen
 * @Date: 2018-06-10 22:20:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-21 19:05:16
 */
<template>
  <section class="list-container">
    <header class="list-header" :style="{background: 'url(' + bannerUrl + ') no-repeat center/100%'}"></header>
    <main class="list-content">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col>
          <section class="list-content-main">
            <column-list isColumn="true" :isShipin="isShipin" :activeIndex="activeIndex" :indexTabList="list" @loadingMore="loadingMore"></column-list>
          </section>
        </el-col>
        <el-col>
          <section class="list-content-aside">
            <list-container activeTabName="热门文章">
              <list-hot-article :hotArticleList="hotArticleList"></list-hot-article>
            </list-container>
          </section>
        </el-col>
      </el-row>
    </main>
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import ColumnList from '@/components/IndexList/ColumnList'
import { handleRequestParams } from '@/utils/utils'
import ListContainer from '@/components/ListContainer/ListContainer'
import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
import columnConfig from '@/utils/columnConfig'

export default {
  name: 'NavColumnList',
  data () {
    return {
      bannerUrl: '',
      isShipin: false, // 是否为视屏栏目
      activeIndex: 0, // 激活的tab页下标
      list: [], // tab页数据(包括页码,栏目名称)
      hotArticleList: []   // 热门文章
    }
  },

  async asyncData ({ store, redirect, error, route }) {
    let id = route.params.id
    let url = '/article/getChannelArt'
    let asyncData = {list: []}
    if(id === 'shipin') asyncData.isShipin = true
    else asyncData.isShipin = false

    let list = columnConfig.config[columnConfig.mapping[id]] // 获取tab列表配置数据
    asyncData.bannerUrl = columnConfig.bannerConfig[columnConfig.mapping[id]] // 获取banner图地址
    let promiseList = []
    list.forEach((item, index)=> {
      if(id === item.type) asyncData.activeIndex = index
      promiseList.push(axios.post(url, { "columnId": item.columnId, "currentPage":1 }))
    })
    promiseList.push(axios.post('/article/selectArticleAll', {"currentPage":1})) // 热门文章列表数据

    let results = await Promise.all(promiseList)

    // 设置tab页数据
    list.forEach((item, index) => {
      let result = results[index]
      let obj = {
        columnId: item.columnId,
        columnName: item.columnName,
        totalPage: 0,
        currentPage: 1,
        data: []
      }
      if(result.data.code === '10000') {
        let info = result.data.responseBody
        obj = Object.assign(obj, {
          totalPage: info.totalPage,
          currentPage: info.currentPage,
          data: info.data || []
        })
      }
      asyncData.list.push(obj)
    })
    // 设置热门文章数据
    let hotArticleList = results[results.length - 1].data
    asyncData.hotArticleList = hotArticleList.code === '10000' ? hotArticleList.responseBody.data : []

    return asyncData
  },
  methods: {
    loadingMore (index) {
      let url = '/article/getChannelArt'
      try {
        let item = this.list[index]
        let params = {
          "columnId": item.columnId,
          "currentPage": ++item.currentPage
        }
        Promise.resolve(axios.post(url, params))
        .then(({ data }) => {
          if(data.code === '10000') {
            let info = data.responseBody
            item.totalPage = info.totalPage
            item.currentPage = info.currentPage
            item.data = item.data.concat(info.data || [])
          }
        })
      } catch (e) {
        throw new Error(e)
      }

      // data.forEach((item, index) => {
      //   if (item.type === type) {
      //     params = handleRequestParams({"columnId":item.columnId, "currentPage":this[item.pageNumName] + 1})
      //     reqUrl = `${api}/?${params}`

      //     try {
      //       Promise.resolve(axios.post(reqUrl))
      //       .then(({ data }) => {
      //         let tmpData = data.responseBody.data
      //           this[item.listName] = tmpData.reduce((coll, item) => {
      //             coll.push(item)
      //             return coll
      //           }, this[item.listName])

      //           this[item.pageNumName] += 1
      //       })
      //     } catch (e) {
      //       throw new Error(e)
      //     }
      //   }
      // })
    }
  },

  components: {
    ColumnList,
    ListContainer,
    ListHotArticle
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.list-container
  width 100%
  .list-header
    width 100%
    height 400px
    background-color #333
  .list-content
    width 1260px
    margin 30px auto
    .list-content-main
      width 944px
      margin-right 16px
    .list-content-aside
      width 300px
</style>
