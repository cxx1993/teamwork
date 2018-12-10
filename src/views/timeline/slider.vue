<template>
  <div id='timeline-slider'>
      <!-- <template > -->
        <div class='avatar-container'
          v-for='(item, key) in store_getUser'
          :key='key'
          :style="{minHeight:item.minHeight+'px'}"
          @click='editGroup(item.id)'
        >
          <Tooltip :content="item.username" placement="right">
            <Avatar size='large'>{{item.username | cut}}</Avatar>
          </Tooltip>
          <div class='username'>{{item.username}}</div>
        </div>
      <!-- </template> -->
      <Drawer
        :title='drawer.title'
        :closable="false"
        @on-close='handleDrawerClose'
        v-model="drawer.show"
        width="500"
      >
          <User ref='user' @close='drawer.show = $event'></User>
      </Drawer>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import User from './user'

export default {
  data() {
    return {
      drawer: { // 抽屉
        show: false,
        title: '',
      },
      list: [{ username: '陈昕', id: '22123', minHeight: '1' }, { username: '林和博豪', id: '42343', minHeight: '2' }, { username: '测试用户1', id: '4421', minHeight: '3' }, { username: '超级管理员', id: '9092', minHeight: '4' }],
    }
  },
  filters: {
    cut(value) {
      if (value) {
        return value.slice(0, 3)
      }
      return value
    },
  },
  components: {
    User,
  },
  computed: {
    ...mapGetters({
      store_getUser: 'getUser',
    }),
    // dataList() {
    //   return this.$store.getters.getUser
    // },
  },
  watch: {
    store_getUser(after, before) {
      // console.log('===')
      // console.log(after, before)
      // console.log('===')
    },
  },
  methods: {
    // 点击新增
    addGroup() {
      this.drawer.show = true
      this.drawer.title = '新建任务'
      this.$refs.user.addInit({ type: 0 }) // 调用user新增
    },
    // 编辑左侧点击的group
    editGroup(userId) {
      this.drawer.title = '编辑用户'
      this.drawer.show = true
      this.$refs.user.updateInit({ type: 1, userId }) // 调用user编辑
    },
    handleDrawerClose() {

    },
  },
  updated() {
  },
  created() {
  },
}
</script>

<style lang='scss'>

</style>
