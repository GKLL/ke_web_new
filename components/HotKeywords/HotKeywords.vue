/*
 * @Description: 热门关键词列表组件
 * @Author: LiuZhen
 * @Date: 2018-06-02 11:20:58
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-15 20:43:33
 */
<template>
  <ul class="hot-keywords">
    <li v-for="(item,index) in hotKeywordsList" :key="index">
      <a :href="'/search?keywords='+item[keyName]">{{item[keyName]}}</a>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
  name: 'HotKeywords',
  data () {
    return {
    }
  },

  props: {
    hotKeywordsList: {
      type: Array,
      default: () => []
    },

    // 自定义传入的keyName和keyUrlName
    keyName: {
      type: String,
      default: 'keywordDesc'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.hot-keywords
  width: 100%;
  height: 220px;
  overflow: hidden;
  padding: 10px;
  background-color: #fff;
  word-wrap: break-word;
  line-height: 31px;
  li
    display inline-block
    margin-right 10px
    margin-bottom 10px
    a
      width 100%
      height 100%
      padding 7px 17px
      font-size 13px
      color #747474
      border 1px solid #E6E6E6
      border-radius 14px
</style>
