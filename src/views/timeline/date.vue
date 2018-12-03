<template>
  <div id='timeline-date' ref='timeline-date'>
    <!-- <DatePicker class='picker' type="date" placeholder="Select date" style="width: 100px"></DatePicker> -->
    <ul class='month-split'>
      <li v-for='(item,idx) in dataRange' :key='idx' :style="{ width: liWidth * item.list.length+'px' }">
        <span class='month'>{{item.month+1}}月</span>
        <ul class='day-split'>
          <li v-for='(date,idx2) in item.list' :key='idx2'  :date='date.dateStr' :class="{ week: date.isWeekend, sunday: date.isSunday }">
             <Tooltip :content="date.dateStr" style='width:100%;'>
                <b>{{date.dayOfMonth}}</b>
                <span>/ {{date.dayOfWeek}}</span>
            </Tooltip>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>


<script>
import { mapMutations, mapGetters } from 'vuex'
import {
  setDate, eachDay, lastDayOfMonth, getDate, getMonth, isWeekend, isSunday, format,
} from 'date-fns'
import { ftWeekDay } from '@/utils/format'

export default {
  data() {
    return {
      dataRange: [], // 时间区间
      liWidth: 0,
      firstWeekendPosition: -1, // 第一个周末的位置
    }
  },
  props: ['caculateW'],
  methods: {
    ...mapMutations([
      'updateDate',
    ]),
    dateRange(sdate, edate) {
      const { liWidth } = this
      const start = setDate(sdate, 1)
      const end = lastDayOfMonth(edate)
      const result = eachDay(
        start,
        end,
      )
      this.dataRange = this.mutiDate(result)
      this.updateDate(result)
      this.caculateW(result.length * liWidth, (this.firstWeekendPosition - 5) * liWidth)
    },
    // 丰富数据
    mutiDate(result) {
      let _firstWeekendPosition = this.firstWeekendPosition
      const re1 = result.map((v, i) => {
        if (_firstWeekendPosition === -1 && isWeekend(v)) { // 第一个周末的位置
          _firstWeekendPosition = i
        }
        return {
          date: v,
          dateStr: format(v, 'YYYY-MM-DD'),
          month: getMonth(v),
          dayOfWeek: ftWeekDay(v),
          dayOfMonth: getDate(v),
          isWeekend: isWeekend(v),
          isSunday: isSunday(v),
        }
      })
      // 按月分类
      let temp
      const rv = []
      re1.forEach(v => {
        if (v.month === temp) {
          // 相同月份追加
          rv[rv.length - 1].list.push(v)
        } else {
          // 不同月份新建
          rv.push({
            month: v.month,
            list: [v],
          })
        }
        temp = v.month
      })
      this.firstWeekendPosition = _firstWeekendPosition
      return rv
    },
  },
  computed: {
    ...mapGetters({
      store_getDate: 'getDate',
    }),
  },
  filters: {},
  created() {
    this.liWidth = this.$global.liWidth
    this.dateRange(new Date('2018-09-09'), new Date())
  },
}
</script>

<style lang='scss'>
ul.day-split {
  li {
    width: 54px;
  }
}
</style>
