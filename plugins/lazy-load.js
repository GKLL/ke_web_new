/*
 * @Description: 图片延迟加载插件
 * @Author: LiuZhen
 * @Date: 2018-05-28 13:20:00
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-21 16:46:17
 */
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '',
  loading: require('../assets/img/loading-svg/loading-bars.svg'),
  attempt: 3
})
