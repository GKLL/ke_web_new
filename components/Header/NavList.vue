/*
 * @Description: NavList组件，页头导航列表组件
 * @Author: LiuZhen
 * @Date: 2018-05-28 20:11:10
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 17:19:48
 */
<template>
  <section class="header-nav-list">
    <ul>
      <li v-for="(item,index) in navlist" :key="index" v-on:mouseenter="showNextMenu($event)" v-on:mouseleave="hideNextMenu($event)">
        <nuxt-link :to="item.url" :class="isActive(item.nextClass, item.isActive)">{{item.name}}</nuxt-link>
        <span v-if="item.nextList" class="nav-second-menu-arrow"></span>
        <div class="second-menu" v-if="item.nextList">
          <span v-for="(secondItem,secondIndex) in item.nextList" :key="secondIndex">
            <nuxt-link :to="secondItem.url">{{secondItem.name}}</nuxt-link>
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'nav-list',
  data () {
    return {
      navlist: [
        {
          name: '首页',
          url: '/',
          nextClass: false,
          isActive: true
        },
        {
          name: '链氪',
          url: '/lianke',
          nextClass: true,
          nextList: [
            { name: '政策一览', url: '/zhengce' },
            { name: '行业动向', url: '/hangye' },
            { name: '行情分析', url: '/hangqing' },
            { name: '百家观点', url: '/guandian' },
            { name: '技术动态', url: '/jishu' },
            { name: '项目展示', url: '/show' }
          ],
          isActive: false
        },
        {
          name: '识氪',
          url: '/shike',
          nextClass: true,
          nextList: [
            { name: '千氪朝闻', url: '/zhaowen' },
            { name: '千氪专访', url: '/zhuanfang' },
            { name: '千氪报道', url: '/baodao' },
            { name: '千氪速递', url: '/sudi' },
            { name: '千氪观点', url: '/kgguandian' }
          ],
          isActive: false
        },
        {
          name: '视频',
          url: '/shipin',
          nextClass: false,
          isActive: false
        },
        {
          name: '百科',
          url: '/baike',
          nextClass: false,
          isActive: false
        },
        {
          name: '财经',
          url: '/caijing',
          nextClass: true,
          nextList: [
            { name: '新金融', url: '/jinrong' },
            { name: '宏观经济', url: '/jingji' },
            { name: '外汇风向', url: '/waihui' },
            { name: '股票期货', url: '/gupiao' },
            { name: '商业产经', url: '/shangye' }
          ],
          isActive: false
        },
        {
          name: '动态',
          url: '/dongtai',
          nextClass: true,
          nextList: [
            { name: '版本更新', url: '/banben' },
            { name: '产品上线预热', url: '/yure' },
            { name: '通知', url: '/tongzhi' },
            { name: '奖励公告', url: '/gonggao' }
          ],
          isActive: false
        }
      ]
    }
  },

  methods: {
    isActive (nextClass, isActive) {
      let classList = ''
      if (nextClass) {
        classList += 'has-second-class'
      }

      if (isActive) {
        classList += ' is-active'
      }
      return classList
    },

    // 鼠标移入事件
    showNextMenu (event) {
      const secMenuEle = event.target.lastChild
      const iconEle = secMenuEle.previousSibling  // 当前节点的上一个兄弟节点
      if (secMenuEle.nodeType === 1) {
        // 将当前所有兄弟元素的子元素div隐藏
        const subNodes = event.target.parentNode.childNodes
        for (let i = 0; i < subNodes.length; i++) {
          if (subNodes[i].lastChild.nodeType === 1) {
            subNodes[i].lastChild.style.display = 'none'
          }
        }

        secMenuEle.style.display = 'block'
        iconEle.classList.remove('nav-second-menu-arrow')
        iconEle.classList.add('nav-second-menu-arrow-active')
      }
    },

    // 鼠标移出事件
    hideNextMenu (event) {
      const secMenuEle = event.target.lastChild
      const iconEle = secMenuEle.previousSibling  // 当前节点的上一个兄弟节点
      if (secMenuEle.style && secMenuEle.style.display) {
        if (secMenuEle.style.display === 'block') {
          secMenuEle.style.display = 'none'
        }

        iconEle.classList.remove('nav-second-menu-arrow-active')
        iconEle.classList.add('nav-second-menu-arrow')
      }
    }
  },

  watch: {
    $route () {
      const pathName = location.pathname

      if (pathName !== '/') {
        this.navlist.forEach((item, index) => {
          let mo = pathName.match(/(\/\w+)/)[1]
          item.isActive = mo === item.url ? true : false
        })
      } else {
        this.navlist.forEach((item, index) => {
          item.isActive = index === 0 ? true : false
        })
      }

      // 隐藏所有二级菜单
      const nextMenus = document.querySelectorAll('.second-menu')
      nextMenus.forEach(item => {
        item.style.display = 'none'
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.header-nav-list
  display inline-block
  height: 100%
  ul
    height 60px
    margin 0
    line-height 60px
    li
      display inline-block
      margin-right 50px
      position relative
      .second-menu
        display none
        position absolute
        top 60px
        left -40px
        width 120px
        height auto
        background-color #fff
        text-align center
        z-index 100
        line-height 40px
        border 1px solid #E6E6E6
        box-shadow 6px 0px 10px rgba(232, 232, 232, .5)
        span
          display inline-block
          width 100%
          a
            font-size 13px
            &:hover
              color $color-text-active
      &:last-child
        margin-right 0
      a
        position relative
        display inline-block
        width 100%
        height 100%
        color $color-text-nav
        font-size $font-size-medium
        &.has-second-class
          // &:after
          //   content ''
          //   next-class-tip-icon(3px)
          //   // next-class-tip-icon-active(3px)
          //   position absolute
          //   top 28px
          //   left 32px
        &.is-active
          color $color-text-active
          &:after
            content ''
            position absolute
            bottom 0
            left -1px
            width 100%
            display inline-block
            border 1px solid $color-text-active
      .nav-second-menu-arrow
        position absolute
        top 28px
        left 32px
        next-class-tip-icon()
      .nav-second-menu-arrow-active
        position absolute
        top 28px
        left 32px
        next-class-tip-icon-active()
</style>
