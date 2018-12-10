<template>
    <div
      @dblclick.stop.prevent='addTask(userId, $event)'
      class='strip'
      :style="{zIndex:isHover ? 5 : 2,minHeight:minHeight+'px'}"
    >
      <!-- <div class='task'   :style="{transform: 'translate('+item.offset+'px, 0px)',width:item.width+'px'}"> -->
      <VueDraggableResizable
        class='task'
        v-for='(item,idx) in afterCaculateArr'
        :key='idx'
        :hoverTip='true'
        :w='item.w'
        :h='50'
        :z='1000'
        :x='item.offset'
        :y='item.y'
        :resizing="false"
        :dragging="false"
        :spacer="$global.liWidth"
        @hover="isHover = $event"
        @dbclick='editTask(item.id)'
      >
        {{item.title}} == {{item.width}}
        <template slot="explain">
          <!-- hover显示内容 -->
          {{item.start_time}} - {{item.end_time}}
          {{item.content}}
        </template>
      </VueDraggableResizable>
      <!-- </div> -->
    </div>

</template>

<script>
import _ from 'lodash'
import { mapMutations, mapGetters } from 'vuex'
import { isSameDay, differenceInQuarters } from 'date-fns'
// import Drag from './drag'
import VueDraggableResizable from '@/components/vue-draggable-resizable/drag.vue'
import { apartOfDays } from '@/utils/format'

export default {
  props: {
    list: {
      // 原始的一维数据
      type: Array,
      default() {
        return []
      },
    },
    userId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      isHover: false, // 是否是当前行hover tip，提升z-index提升层级
      minHeight: 63,
      afterCaculateArr: [], // 计算后的cell - 二维
    }
  },
  components: {
    // Drag,
    VueDraggableResizable,
  },
  methods: {
    ...mapMutations([
      'updateUserByIndex',
    ]),
    // 排序传入的数据
    boubleSort(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j].start_time > arr[j + 1].start_time) {
            // 升序下沉
            arr[j] = [arr[j + 1], (arr[j + 1] = arr[j])][0] // 交换两个数
          }
        }
      }
      return arr
    },
    // 将arr变为二维数组，按照行排列
    classify(arr) {
      const computed = []
      arr.forEach((v, i) => {
        // 按顺序来的，只需要比较end_time
        let bstop = false // 是否放入目标
        for (let j = 0, len = computed.length; j < len; j++) {
          const vv = computed[j]
          // computed的每一层 最后一个进行比较
          if (v.start_time > vv[vv.length - 1].end_time) {
            vv.push(v) // 找到位置
            bstop = true
            break
          }
        }
        if (!bstop) {
          // 如果没找到位置，重新push一个
          computed[computed.length] = [v]
        }
      })

      return computed
    },
    // 计算y轴偏移值
    calutateY(arr) {
      const singleH = this.$global.taskHeight + 2
      return arr.map((v, i) => {
        return v.map(vv => {
          vv.y = i * singleH
          return vv
        })
      })
    },
    // 计算每条数据的位置x偏移值
    caculateX(arr) {
      const date = this.$store.getters.getDate
      const { liWidth } = this.$global

      return arr.map(v => {
        const _idx = _.findIndex(date, o => {
          return isSameDay(o, v.start_time)
        })
        if (_idx !== -1) {
          v.offset = _idx * liWidth
          // getOverlappingDaysInRanges:获取二个时间段重叠的天数
          v.w = (apartOfDays(v.start_time, v.end_time) + 1) * liWidth
        }
        return v
      })
    },
    // 扁平arr
    flatArr(arr) {
      const newarr = arr.reduce((prev, curr) => {
        return prev.concat(curr)
      }, [])
      return newarr
    },
    /**
     * 完整计算
     * x,y偏移值
     */
    completeCalculation() {
      const arr = this.list
      const xArr = this.caculateX(arr) // 计算x偏移值
      // 排序arr
      const sortArr = this.boubleSort(arr) // 升序start_time
      // 按列分类arr
      const classifyArr = this.classify(sortArr)
      // 给arr计算y轴偏移值
      const calutateArr = this.calutateY(classifyArr)
      const flatArr = this.flatArr(calutateArr)
      this.minHeight = calutateArr.length * (this.$global.taskHeight + 2) // 算出cell的高度
      this.afterCaculateArr = flatArr
    },
    onResize(x, y, width, height) {
      // this.x = x
      // this.y = y
      // this.width = width
      // this.height = height
      console.log(x, y, width, height)
    },
    onDrag(x, y) {
      // this.x = x
      // this.y = y
    },
    addTask(userId, event) {
      // 获取当前的位置，知道是在哪一天进行点击的
      const { clientX, clientY } = event
      this.$emit('add', userId)
    },
    editTask(taskId) {
      this.$emit('edit', taskId)
    },
  },
  computed: {
    ...mapGetters({
      store_getUser: 'getUser',
    }),
  },
  updated() {
    // eslint-disable-next-line
    // this.list.length && this.caculatePosition()
  },
  created() {
    if (this.list.length) {
      this.completeCalculation()
      // 更新user 的min-height
      const { store_getUser, userId,minHeight } = this  // eslint-disable-line
      const _storeGetUser = Object.assign([], store_getUser)
      const idx = _.findIndex(_storeGetUser, (o) => { return o.id === userId })
      if (idx !== -1) {
        // console.log(store_getUser)
        this.updateUserByIndex({ idx, userId, update: { minHeight } })
        // console.log(this.$store.getters.getUser)
      }
    }
  },
}
</script>
