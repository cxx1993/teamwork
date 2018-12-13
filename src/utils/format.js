import {
  getDay, setDate, lastDayOfMonth, addMonths, subMonths, format,
} from 'date-fns'
import { split as gb_split } from './global'  // eslint-disable-line


// 返回一周中的某一天
export const ftWeekDay = function (value) {
  const dayOfWeek = getDay(value)
  let str
  switch (dayOfWeek) {
    case 1:
      str = '一'
      break
    case 2:
      str = '二'
      break
    case 3:
      str = '三'
      break
    case 4:
      str = '四'
      break
    case 5:
      str = '五'
      break
    case 6:
      str = '六'
      break
    case 0:
      str = '日'
      break
    default:
      break
  }
  return str
}

// 返回相距天数
export const apartOfDays = function (sdate, edate) {
  const days = new Date(edate).getTime() - new Date(sdate).getTime()
  return parseInt(days / (1000 * 60 * 60 * 24)) // eslint-disable-line
}


/**
 * 根据next prev返回相对于输入的时间段的时间段
 * @param {String} sdate 起始时间 YYYY-MM-DD/Date类型
 * @param {String} edate 结束时间 YYYY-MM-DD/Date类型
 * @param {String} type 上/下一个时间段
 * @param {number} split 按照几个月进行分段
 *
 */
export const caculateDateRange = function
({
  sdate, edate, type, split = gb_split,
}) {
  let start
  let end

  // 如果时间段传的不完整或为空，则去当前时间倒推左右1个月的默认时间段
  if (!sdate || !edate) {
    const nowDate = new Date()
    start = subMonths(nowDate, 1)
    start = setDate(start, 1)
    end = addMonths(nowDate, 1)
    end = lastDayOfMonth(end)
    return [format(start, 'YYYY-MM-DD'), format(end, 'YYYY-MM-DD')]
  }

  // 如果传入的不是Date类型就new Date()
  try {
    switch (type) {
      case 'prev':
        // 往前推split个月
        start = typeof sdate === 'string' ? new Date(sdate) : sdate
        end = typeof sdate === 'string' ? new Date(sdate) : sdate
        // ====
        start = subMonths(start, split)
        end = subMonths(end, 1)
        break
      case 'next':
        // 往后推split个月
        start = typeof edate === 'string' ? new Date(edate) : edate
        end = typeof edate === 'string' ? new Date(edate) : edate
        // ====
        start = addMonths(start, 1)
        end = addMonths(end, split)
        break
      default:
        start = sdate
        end = edate
        break
    }
    start = setDate(start, 1)
    end = lastDayOfMonth(end)
    return [format(start, 'YYYY-MM-DD'), format(end, 'YYYY-MM-DD')]
  } catch (error) {
    return ['', '']
  }
}
