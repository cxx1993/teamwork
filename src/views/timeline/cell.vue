<template>
  <!-- <tr class='ivu-table-row'>
    <td v-for='(item,idx) in list' :key='idx'>
      {{item.content}}
    </td>
  </tr> -->
  <div class='strip'>
    <!-- <div class='task'   :style="{transform: 'translate('+item.offset+'px, 0px)',width:item.width+'px'}"> -->
      <VueDraggableResizable
        class='task'
        v-for='(item,idx) in list' :key='idx'
        :hoverTip='true'
        :w='item.width' :h='50' :z='1000'
        :x='item.offset' :y='0'
        :resizing="onResize"
        :dragging="onDrag"
        :spacer="$global.liWidth"
        >
        {{item.content}}
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
import { isSameDay, differenceInQuarters } from 'date-fns'
// import Drag from './drag'
import VueDraggableResizable from '@/components/vue-draggable-resizable/drag.vue'
import { apartOfDays } from '@/utils/format'

export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {}
  },
  components: {
    // Drag,
    VueDraggableResizable,
  },
  methods: {
    // 计算每条数据的位置
    caculatePosition() {
      const date = this.$store.getters.getDate
      const { list } = this
      const { liWidth } = this.$global
      list.forEach((v, i) => {
        const _idx = _.findIndex(date, (o) => { return isSameDay(o, v.start_time) })
        if (_idx !== -1) {
          v.offset = _idx * liWidth
          // getOverlappingDaysInRanges:获取二个时间段重叠的天数
          v.width = (apartOfDays(v.start_time, v.end_time) + 1) * liWidth
        }
      })
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
  },
  computed: {

  },
  created() {
    // eslint-disable-next-line
    this.list.length && this.caculatePosition()
  },
}
</script>
