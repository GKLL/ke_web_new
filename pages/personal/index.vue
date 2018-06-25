/*
 * @Description: 个人中心页
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-05-31 13:58:55
 */
<template>
  <main class="personal-container">
    <aside>
      <section class="personal-avatar">
        <span @click="avatarVisible = true" class="avatar" :style="{background: 'url('+handleImgAddrHandle(personInfo.avatar) +') no-repeat center/cover'}">
          <span class="set-avatar">
            <svg-icon iconClass="setavatar" class="svg-icon"></svg-icon>
          </span>
        </span>
      </section>
      <ul class="personal-sidebar">
        <li class="sidebar-li" :id = "item.link" v-for = "(item,index) in personalSidebar" :key = "index" @click = "toColumn(item,$event)">
          <svg-icon :iconClass="item.icon" class="svg-icon sidebar-icon"></svg-icon>{{item.name}}
        </li>
      </ul>
      <span class="quit" @click="loginOut"><svg-icon iconClass="logout" class="svg-icon quit-icon"></svg-icon>退出登录</span>
    </aside>
    <component class="right-main" :is="modulePick"></component>
    <v-cropper :visible="avatarVisible" :cancel="cancelAvatarVisible" :callback="getInfo" :personInfo="personInfo"></v-cropper>
  </main>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import SvgIcon from '@/components/base/SvgIcon/SvgIcon'
import axios from '@/plugins/axios'
import { handleRequestParams, handleImgAddr, handleWebStorage } from '@/utils/utils'
import  C  from '@/utils/personal'
import MyTreasure from './MyTreasure'
import MyColumn from './MyColumn'
import MyComment from './MyComment'
import MyCollect from './MyCollect'
import Account from './Account'
import Shift from './Shift'
import RollOut from './RollOut'
import { mapState, mapActions,mapMutations } from 'vuex'
import VCropper from '@/components/VCropper/VCropper'

export default {
  head: {
        title: '个人中心',
        meta: [
            { hid: 'keywords', name: 'keywords', content: '个人中心' },
            { hid: 'description', name: 'description', content: '个人中心' }
        ],
        script: [
          {src: '//g.alicdn.com/sd/ncpc/nc.js?t=2015052012'}
        ],
        link:[
          {href:'https://g.alicdn.com/sd/ncpc/nc.css?t=1517295462152'}
        ]
  },
  data () {
    return {
      pick:'',
      userData: {},
      avatarVisible:false,
      personInfo:{}
    }
  },
  beforeCreate () {
    if (process.browser) {
      const Distpicker = require('v-distpicker')
      Vue.use(Distpicker)
      Vue.component('v-distpicker', Distpicker)
    }
  },
  components: {
    SvgIcon,MyTreasure,MyColumn,Shift,RollOut,MyCollect,MyComment,Account,VCropper
  },
  computed: {
    ...mapState([
      'personalSidebar',
      'modulePick',
      'tvBalance',
      'tvList',
      'KGUser'
    ])
  },
  async fetch ({ store, params }) {
    let [tvBalance, tvList] = await Promise.all([
      axios.post('/account/selectByUserbalance', {userId: store.state.KGUser.userId}),
      axios.post('/accountFlow/selectByUserflow', {userId:store.state.KGUser.userId,currentPage:1})
    ])

    if(tvList.data.responseBody.currentPage >= tvList.data.responseBody.totalPage){
      store.commit('SET_TVMORE_VISIBLE', false)
    }else{
      store.commit('SET_TVMORE_VISIBLE', true)
    }
    store.commit('SET_TVBALANCE', tvBalance.data.responseBody.data)
    store.commit('SET_TVLIST', tvList.data.responseBody.data)
  },

  mounted(){
    const url = window.location.hash;
    this.SET_MODULE_PICK(C.config[url])
    const lis = document.getElementsByClassName('sidebar-li');
    for(var i = 0,l = lis.length; i < l; i++){
        if(lis[i].id == url){
          lis[i].className = 'sidebar-li active'
        }
    }
    if(url == '#' || url == '' || url == '#shift' || url == '#roll_out'){
      lis[0].className = 'sidebar-li active'
    }
    this.getInfo()
  },

  methods:{
    ...mapMutations([
      'SET_MODULE_PICK',
      'SET_TVMORE_VISIBLE'
    ]),
    toColumn(item,e){
      // e.preventdefault();
      //设置绑定操作 storage
      handleWebStorage.setLocalData('isBind',1)
      //设置交易密码弹窗显示 storage
      handleWebStorage.setLocalData('trader_pwd',1)
      //设置转入显示 storage
      handleWebStorage.setLocalData('shit_open',1)
      //设置转出显示 storage
      handleWebStorage.setLocalData('roll_out_open',1)
      //设置实名认证弹窗显示 storage
      handleWebStorage.setLocalData('approve_open',1)
      const lis = document.getElementsByClassName('sidebar-li');
      const target = e.target;
      for(var i = 0,l = lis.length; i < l; i++){
        lis[i].className = 'sidebar-li'
      }
      target.className = 'sidebar-li active'
      this.SET_MODULE_PICK(item.module)
      C.redirect(item.link)
    },
    cancelAvatarVisible(){
        this.avatarVisible = false
    },
    getInfo(){
          const that = this;
             this.ajax({
                  url: '/userprofile/getProfile',
                  data: {
                    userId:that.KGUser.userId
                  },
                  headers: {
                    token:that.KGUser.token
                  },
                  success: (res) => {
                            if(res.code == 10000){
                                  res = res.responseBody.data
                                  that.personInfo = res;
                            }else{
                                that.$message({
                                    message: res.message,
                                    type: 'error'
                                });
                            }
                  }
                })
    },
    handleImgAddrHandle(data){
      return handleImgAddr(data,1)
    },
    loginOut(){
      this.$store.dispatch('userLogout').then(() => {
        this.$router.push('/')
      })
    }
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

div
  height auto
.personal-container
  margin-top 60px
  padding-bottom 50px
  display flex
  flex-direction row
  .right-main
      width 100%
  aside
    width 240px
    height 600px
    background #fff
    margin-right 30px
    position relative
    .personal-avatar
      .avatar
        display inline-block
        width 100px
        height 100px
        border-radius 50%
        margin 44px 70px
        cursor pointer
        position relative
        .set-avatar
          display inline-block
          width 36px
          height 36px
          background #fff
          border-radius 50%
          position absolute
          bottom -4px
          right -8px
          box-shadow 2px 0px 5px rgba(97,97,97,0.14);
          .svg-icon
            width 30px
            color #2382EA
            margin-top 7px
            margin-left 3px
    .personal-sidebar
      li
        width 100%
        height 30px
        line-height 30px
        text-align left
        margin-bottom 16px
        color #333
        font-size 14px
        cursor pointer
        display flex
        border-left 4px solid #fff
      .active
        border-left 4px solid $color-text-active
    .quit
      position absolute
      display flex
      width 100%
      height 50px
      line-height 50px
      text-align center
      color #666
      bottom 0px
      cursor pointer
      border-top 1px solid #e1e0e1
      font-size 14px
      .quit-icon
        margin 14px 9px 0px 56px
        width 16px
.sidebar-icon
  margin-top 4px
  color #2382EA
  margin-left 30px
  margin-right 15px

</style>
