/*
 * @Description: 标签列表页面
 * @tag: cb
 * @Date: 2018-06-12 14:34
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-20 15:43:46
 * @post:
 */
<template>
    <div>
        <div class="tagBanner">

        </div>
        <div class="tagInfo">
            <div class="tagArticle">
                <!-- 主内容区域 -->
                <section class="index-list-container">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col style="margin-right: 16px">
                    <section class="index-info-list">
                        <index-list :activeName="indexTabList[0]" :indexTabList="indexTabList" :groupLists="groupLists" @loadingMore="loadingMore"></index-list>
                    </section>
                    </el-col>
                    <el-col :span="6">
                        <section class="index-hot-column-list">
                            <list-container activeTabName="热门文章">
                                <list-hot-article :hotArticleList="hotArticleList"></list-hot-article>
                            </list-container>
                        </section>
                        <section class="list-advert" v-if="advertsList[0] && item.imagePos == 21" v-for="(item,index) in  advertsList" :key="index">
                            <img @click="toAddress(item)" :src="handleImgAddrHandle(item.imageAddress)"/>
                        </section>
                    </el-col>
                </el-row>
                </section>

            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import IndexList from '@/components/IndexList/IndexList'
import ListContainer from '@/components/ListContainer/ListContainer'
import ListSpecialColumn from '@/components/ListSpecialColumn/ListSpecialColumn'
import ListHotArticle from '@/components/ListHotArticle/ListHotArticle'
import { handleRequestParams, handleImgAddr } from '@/utils/utils'
import { OSS_ADDRESS } from '@/config/config'

export default {
  head: {
    title: "标签页",
    meta: [
      {
        hid: "keywords",
        name: "keywords",
        content: "标签页"
      },
      {
        hid: "description",
        name: "description",
        content: "标签页"
      }
    ]
  },
  name: 'Index',
  data () {
    return {
      bannerImg:require('../../assets/img/nadine-shaabana-313161-unsplash@2x.png'),
      advertsList: [],
      articleList: [],
      hotSpecialColumn: [],
      hotArticleList: [],
      groupLists: [],  // 传递到列表子组件中的组合好的列表数据
      indexTabList: ['321'],
      newsPageNum: 1,
      videoPageNum: 1,
      tag_name:''
    }
  },

  async asyncData ({ store, redirect, error, route}) {
    const tag_name = decodeURI(route.params.id)
    let [adverts,
         articleList,
         hotArticleList
         ] = await Promise.all([
          axios.post('/siteimageapi/listsiteimage', { "navigator_pos":2 }), //标签广告位
          axios.post('/article/getChannelArt', { "articleTagnames":tag_name,"currentPage":1 }),   // 标签列表数据
          axios.post('/article/selecttoparticle'),     // 热门文章列表数据
      ])
      adverts = adverts.data.responseBody
      const newList = [];
      if(adverts.length != 0){
        for(var i in adverts){
          if(adverts[i].imagePos == 21){
            newList.push(adverts[i])
          }
        }
      }
      console.log('articleList',articleList.data.responseBody)
      return {
        advertsList:newList.splice(0,1),
        articleList: articleList.data.responseBody.data,
        hotArticleList: hotArticleList.data.responseBody,
        indexTabList:[route.params.id],
        tag_name:tag_name
      }
  },
  mounted(){
    let indexTitle = document.getElementsByTagName('title')[0];
    indexTitle.innerHTML = this.indexTabList[0];
    console.log('adverts',this.advertsList)
  },
  created () {
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
  },
  methods: {
        //广告图跳转
    toAddress(item){
      if (item.imageType == 1) {
        window.open('/article/'+ item.articleId)
      } else {
        window.open(item.imageDetail);
      }
    },
    handleImgAddrHandle(data,type){
      if(type){
         return handleImgAddr(data,1)
      }else{
         return handleImgAddr(data)
      }
    },
    loadingMore(type) {
      const that = this;
      if (!type) {
        throw new Error('params "type" is must description')
      }

      let reqUrl = null,
          params = null

      // 根据传递的type类型参数指定获取数据的url地址
      switch (type) {
        case that.indexTabList[0]:
          params = handleRequestParams({"articleTagnames":that.tag_name,"currentPage": this.newsPageNum + 1})
          reqUrl = `/article/getChannelArt/?${params}`
          break
      }

      try {
        Promise.resolve(axios.post(reqUrl))
        .then(({ data }) => {
          if (type === that.indexTabList[0]) {
            let tmpData = data.responseBody.data
            this.articleList = tmpData.reduce((coll, item) => {
              coll.push(item)
              return coll
            }, this.articleList)

            this.newsPageNum += 1
          }
        })
      } catch (e) {
        throw new Error(e)
      }
    }
  },

  components: {
    IndexList,
    ListContainer,
    ListSpecialColumn,
    ListHotArticle,
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">

.list-advert
  width 300px
  height 310px
  overflow hidden
  img
    width 100%
    cursor pointer
.tagBanner {
        width : 100%;
        height: 21vw;
        background-image :url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/tagbanner.png')
        background-size :contain;
        background-repeat :no-repeat;
}
.tagInfo {
    font-family: MicrosoftYaHei;
    width: 1260px;
    margin: 0 auto;
    margin-top: 20px;



    .tagDetail {
        position: relative;
        padding: 19px 60px 41px 228px;
        background-color: #fff;

        p:nth-child(1) {
            font-size: 16px;
            color: #333;

            span {
                padding: 5px 6px 5px 7px;
                color: #2382EA;
                font-size: 12px;
                background: rgba(236, 245, 255, 1);
                border-radius: 11px;
            }
        }

        p:nth-child(2) {
            width 508px
            font-size 12px
            line-height 20px
            color #666
            overflow hidden
            text-overflow ellipsis
            display -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient vertical
            margin-top 16px
            min-height 33px
        }

        .baseData {
            float: right;
            margin-top: -51px;

            div {
                display: inline-flex;
                flex-direction: column;
                text-align: center;

                span:nth-child(2) {
                    color: #9B9B9B;
                    padding-top: 16px;
                    font-size: 12px;
                }

                span:nth-child(1) {
                    font-size: 18px;
                    font-family: MicrosoftYaHei-Bold;
                    font-weight: bold;
                }
            }

            div:nth-child(2) {
                margin: 0 44px 0 50px;
            }
        }

        img {
            position: absolute;
            left: 60px;
            top: -34px;
            border: 9px solid #EBEBEB;
            border-radius: 50%;
            width: 130px;
            height: 130px;
            z-index: 1;
        }
    }

    .tagArticle {
        margin-top: 30px;
        padding: 25px;
    }
}
</style>

