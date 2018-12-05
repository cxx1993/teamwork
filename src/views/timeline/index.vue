<template>
  <div id='timeline'>
    <Slider></Slider>
    <div id='timeline-content'>
      <!-- <div :style="{overflow:'scroll',width:'5000px'}"> -->
      <div :style="{width:width+'px'}" style='width:100%;height:100%;position:relative;'>
        <Date :caculateW='setWidth'></Date>
        <div id="timeline-cell">
          <Cell
            v-for='(item,idx) in tbData'
            :key='idx'
            :list='item.list'
            @add='handleAddTask'
            @edit='handleEditTask'
            :userId='item.id'
          >
          </Cell>
        </div>
        <div class='bgGround' :style="{left:offset+'px',width:width-offset+'px',backgroundImage: 'url('+bgBase64+')',backgroundSize: '378px 20px'}">
        </div>
      </div>
      <Drawer
        :title='drawer.title'
        :closable="false"
        @on-close='handleDrawerClose'
        v-model="drawer.show"
        width="500"
      >
          <Task ref='task' @close='drawer.show = $event'></Task>
      </Drawer>
    </div>

  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import axios from 'axios'
import Slider from './slider.vue'
import Cell from './cell.vue'
import Date from './date.vue'
import Task from './task.vue'
import '@/assets/css/timeline/index.scss'


const bgBase64 = 'data:image/png;base64,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'


export default {
  components: {
    Cell,
    Date,
    Slider,
    Task,
  },
  data() {
    return {
      tbData: [],
      // groups: [], // slider的数据
      width: 0, // 滚动区域宽度
      offset: 0, // 背景偏移位置
      bgBase64, // 背景图base64
      drawer: { // 抽屉
        title: '',
        show: false, // 开关
      },
    }
  },
  computed: {
    ...mapGetters({
      store_getUser: 'getUser',
      store_getTask: 'getTask',
    }),
  },
  methods: {
    ...mapMutations({
      store_updateUser: 'updateUser',
      store_updateTask: 'updateTask',
    }),
    // w:滚动区域的宽度，offset:背景偏移的距离
    setWidth(w, offset) {
      this.width = this.width + w
      this.offset = offset
    },
    // combine() {
    // const { groups } = this
    // const groups = this.store_getUser
    // items.forEach(v => {
    //   const _idx = _.findIndex(groups, (o) => { return o.id === v.userId })

    //   if (_idx !== -1) {
    //     if (!groups[_idx].list) {
    //       groups[_idx].list = []
    //     }
    //     groups[_idx].list.push(v)
    //   }
    // })
    // this.tbData = groups
    // },
    // 添加任务
    handleAddTask(userId) {
      this.drawer.show = true
      this.drawer.title = '新建任务'
      this.$refs.task.addInit(userId) // 调用task新增
    },
    handleEditTask(taskId) {
      this.drawer.show = true
      this.drawer.title = '编辑任务'
      this.$refs.task.updateInit(taskId) // 调用task修改
    },
    handleDrawerClose() {
      // 关闭抽屉重置表格
      this.$refs.task.handleReset()
    },
  },
  mounted() {
    this.$el.querySelector('#timeline-content').addEventListener('scroll', this.handleScroll)
  },
  created() {
    axios.get('http://127.0.0.1:3000/db').then(res => {
      const { data: { user, task } } = res
      this.store_updateUser(user)
      // items = task
      // this.combine()
      this.store_updateTask(task, user)
      this.tbData = this.store_getTask
    })
  },
}
</script>

<style scoped lang='scss'>
</style>
