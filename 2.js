
const _ = require('lodash')
const { areRangesOverlapping } = require('date-fns')
const axios = require('axios')

function getData() {
  return axios.get('http://127.0.0.1:3000/task').then(res => res.data)
}


// 冒泡 - 按start_time升序
function boubleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j].start_time > arr[j + 1].start_time) { // 升序下沉
        arr[j] = [arr[j + 1], arr[j + 1] = arr[j]][0]	// 交换两个数
      }
    }
  }
  return arr
}

// 计算y轴偏移值
function classify(arr) {
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
}

function calutateY(arr) {
  return arr.map(v => {
    return v.map((vv, ii) => {
      vv.y = ii * 55
      return vv
    })
  })
}

async function fnf() {
  const arr = await getData()
  const insert = {
    id: 3,
    start_time: '2018-09-11',
    end_time: '2018-09-18',
  }
  arr.push(insert)
  // 排序arr
  const sortArr = boubleSort(arr) // 升序start_time
  // 按列分类arr
  const classifyArr = classify(sortArr)
  // 给arr计算y轴偏移值
  const _arr = calutateY(classifyArr)

  console.log(_arr)
}


fnf()
// =======其实这是一行的都=======
// ======顺序排列========
// ==============
// ==============
const data = [
  {
    id: 1,
    start_time: '2018-09-01',
    end_time: '2018-09-07',
  },
  {
    id: 2,
    start_time: '2018-09-08',
    end_time: '2018-09-10',
  },
  {
    id: 4,
    start_time: '2018-09-14',
    end_time: '2018-09-16',
  },
  {
    id: 5,
    start_time: '2018-09-18',
    end_time: '2018-09-26',
  },

]

const single = {
  id: 3,
  start_time: '2018-09-11',
  end_time: '2018-09-18',
}


function insertLine() {
  for (let i = 0, len = data.length; i < len; i++) {
    // 找到插入点，升序
    if (single.start_time > data[i].end_time) {
      let sign2
      if (i === len - 1) { // 最后一个
        sign2 = true
      } else {
        sign2 = single.end_time < data[i + 1].start_time
      }
      if (sign2) {
        // 可以插入其中
        return i
      }
    }
  }
}

// const _insertIdx = insertLine()
// if (_insertIdx !== undefined) {
//   data.splice(_insertIdx + 1, 0, single)
// }
