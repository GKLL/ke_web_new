/*
 * @Description: 默认模板页，用于大多数页面布局
 * @Author: LiuZhen
 * @Date: 2018-05-29 09:27:23
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 16:23:32
 */
<template>
  <section>
    <Header></Header>
    <nuxt/>
    <Footer :showArea="showArea"></Footer>
    <fixed-function></fixed-function>
    <Feedback></Feedback>
  </section>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FixedFunction from '@/components/FixedFunction/FixedFunction'
import Feedback from '@/components/Feedback/Feedback'
import axios from '@/plugins/axios'
import $http from '@/assets/js/request'
Vue.use($http)

export default {
  name: 'default',
  data () {
    return {
      showArea: 'index',
    }
  },

  watch: {
    // 监听路由变化
    $route () {
      this.showArea = this.$router.history.current.fullPath === '/' ? 'index' : 'inSidePage'
    }
  },

  components: {
    Header,
    Footer,
    FixedFunction,
    Feedback
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
