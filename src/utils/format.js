import getDay from 'date-fns/get_day'
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
  return parseInt( days / (1000 * 60 * 60 * 24) )
}