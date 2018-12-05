<template>
  <div id='timeline-slider'>
      {{store_getUser}}
      <template v-for='(item, key) in store_getUser'>
        <div class='avatar-container'
          :key='key'
          :style="{minHeight:item.minHeight+'px'}"
          @click='editGroup(item.id)'
        >
          <Tooltip :content="item.username" placement="right">
            <Avatar size='large'>{{item.username | cut}}</Avatar>
          </Tooltip>
          <div class='username'>{{item.username}}</div>
        </div>
      </template>
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
        title: ''
      }
    }
  },
  filters: {
    cut: function (value) {
      return value.slice(0, 3)
    }
  },
  components: {
    User
  },
  computed: {
    ...mapGetters({
      store_getUser: 'getUser',
    }),
  },
  methods: {
    // 点击新增
    addGroup() {
      this.drawer.show = true
      this.drawer.title = '新建任务'
      this.$refs.user.addInit() // 调用user新增
    },
    // 编辑左侧点击的group
    editGroup(userId) {
      this.drawer.title = '编辑用户'
      this.drawer.show = true
      this.$refs.user.updateInit(userId) // 调用user编辑
    },
    handleDrawerClose(){

    }
  },
  created() {
    
  },
}
</script>

<style lang='scss'>

</style>
