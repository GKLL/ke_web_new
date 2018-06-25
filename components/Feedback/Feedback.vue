/*
 * @Description: 意见反馈弹出层组件
 * @Author: LiuZhen
 * @Date: 2018-06-21 17:04:07
 * @Last Modified by: LiuZhen
 * @Last Modified time: 2018-06-22 11:39:00
 */
<template>
  <section class="feedback">
    <el-dialog title="意见反馈" :visible="feedbackStatus" @close="close">
      <el-input type="textarea"
                :rows="5"
                placeholder="您的意见"
                v-model="textarea"
                class="feed-content"
                @keyup.native="handleCount($event)">
      </el-input>
      <el-input v-model="feedbackPhone" placeholder="您的手机号"></el-input>
      <div class="content-count" ref="contentCount">{{currentCount}}/200</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendFeedback" class="confirm-btn">确认</el-button>
        <el-button type="text" @close="close">取消</el-button>
      </div>
    </el-dialog>
    <!-- feedback/addFeedback -->
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Feedback',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      feedbackPhone: '',
      textarea: '',
      currentCount: 0
    }
  },

  computed: {
    ...mapState([
      'feedbackStatus'
    ])
  },

  methods: {
    ...mapMutations([
      'SET_FEEDBACK_STATUS'
    ]),

    sendFeedback () {
      if (!this.textarea || !this.feedbackPhone) {
        return
      }

      axios.post('/feedback/addFeedback', {
        feedbackDetail: this.textarea,
        feedbackPhone: this.feedbackPhone
      }).then(({ data }) => {
        if (data.code === '10000') {
          this.textarea = ''
          this.feedbackPhone = ''
          this.close()
          this.$message({ type: 'success', message: '发送成功' })
        }
      })
    },

    close () {
      this.SET_FEEDBACK_STATUS(false)
    },

    // 统计数字
    handleCount (event) {
      this.currentCount = this.textarea.length
      // 如果数量超过200
      if (this.currentCount > 200) {
        this.$refs.contentCount.style.color = '#f30'
      } else {
        this.$refs.contentCount.style.color = '#333'
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.feedback
  .el-dialog
    position relative
    width 690px
    padding 30px 40px
    .content-count
      position absolute
      top 180px
      right 50px
      display inline-block
      font-size 12px
    div
      padding 0
    .el-dialog__header
      margin-bottom 30px
    .el-dialog__body
      margin-bottom 16px
    .feed-content
      margin-bottom 30px
      textarea
        resize none
    .el-dialog__footer
    .dialog-footer
      text-align left
      .confirm-btn
        width 170px
</style>
