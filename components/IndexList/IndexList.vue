/*
 * @Description: 列表组件，目前主要应用于首页资讯列表和主分类下二级列表页面
 * @Author: LiuZhen
 * @Date: 2018-05-29 13:29:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-21 19:11:14
 */
<template>
  <section class="index-list">
    <el-tabs v-model="activeTabName" @tab-click="changeTab">
      <el-tab-pane :label="item.tabName" :name="item.tabName" v-for="(item,index) in groupLists" :key="index">
        <list-item  :isShipin="checkIsShipin(index)" :listItem="item.list"></list-item>
        <div class="loading-more" v-if="articleMoreBtn">
          <a href="javascript:;" @click="loadingMore(item.tabName)">查看更多</a>
        </div>
        <div class="loading-more" v-if="videoMoreBtn">
          <a href="javascript:;" @click="loadingMore(item.tabName)">查看更多</a>
        </div>
        <div class="dataEmpty" v-if="dataNull"> 
          <div></div>
          <p>暂无数据</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script type="text/ecmascript-6">
import ListItem from '@/components/IndexList/ListItem'
import { mapActions } from 'vuex'
import axios from '@/plugins/axios'

export default {
  name: 'IndexList',
  data () {
    return {
      lists: [],
      activeTabName: this.activeName,
      articleMoreBtn: true,
      videoMoreBtn: false,
      dataNull: false
    }
  },

  props: {
    articleIsEnd: {},
    videoIsEnd: {},
    bestNewArticleEnd: {},
    activeName: {
      type: String,
      default: ''
    },
    indexTabList: {
      type: Array,
      default: () => [],
      required: true
    },
    groupLists: {
      type: Array,
      default: () => [],
      required: true
    }
  },

  methods: {
    checkIsEnd(tabName) {
      if(tabName === '文章') return this.articleIsEnd
      if(tabName === '视频') return this.videoIsEnd
      if(tabName === '最新资讯') return this.bestNewArticleEnd
      return false
    },
    changeTab(item){
      this.dataNull = false
      if(item.name == '视频') {
        this.articleMoreBtn = false
        this.videoMoreBtn = true
        if (this.groupLists[1].list.length === 0) 
        this.videoMoreBtn = false
        this.dataNull = true
      }
      else if(item.name == '文章') {
        this.articleMoreBtn = true
        this.videoMoreBtn = false
      }
      this.$emit('changeTab', item.label)
    },
    checkIsShipin(index) {
      if(index === 1) return true
      else return false
    },
    loadingMore (type) {
      this.$emit('loadingMore', type)
    }
  },
  created () {
    this.groupLists.forEach(element => {
      if (element.list.length === 0) {
        this.articleMoreBtn = false
        this.videoMoreBtn = false
        this.dataNull = true
      }
    });
  },
  components: {
    ListItem
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.index-list
  .loading-more
    width 100%
    height 50px
    text-align center
    line-height 50px
    background-color $color-background-d
    a
      display inline-block
      padding 0 10px
      height 100%
      font-size 13px
      color #2382EA
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
