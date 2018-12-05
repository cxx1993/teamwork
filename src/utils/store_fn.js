import _ from 'lodash'
/**
 * 处理task和user的关联（by id）
 * @param {Array} taskList task数据
 * @param {Object} groups 左侧的slider--分组依据
 */
export const dealTaskList = function (taskList, userList) {
  taskList.forEach(v => {
    const _idx = _.findIndex(userList, (o) => { return o.id === v.userId })

    if (_idx !== -1) {
      if (!userList[_idx].list) {
        userList[_idx].list = []
      }
      userList[_idx].list.push(v)
    }
  })

  return userList
}

/**
 * 插入一条task
 * @param {Array} list tasklist数据
 * @param {Object} task 新插入的task
 */
export const insertTask = function (list, task) {
  const _idx = _.findIndex(list, (o) => { return o.id === task.userId })

  if (_idx !== -1) {
    list[_idx].list.push(task)
  }
  return list
}

/**
 * 修改一条task
 * @param {Array} list tasklist数据
 * @param {Object} task 新插入的task
 */
export const updateTask = function (list, task) {
  const _idx = _.findIndex(list, (o) => { return o.id === task.userId })
  if (_idx !== -1) {
    const _task = list[_idx].list
    const _idx2 = _.findIndex(_task, (o) => { return o.id === task.id })
    if (_idx2 !== -1) {
      list[_idx].list[_idx2] = task
    }
  }
  return list
}

/**
 * @param {Array} list tasklist数据
 * @param {Object} task 新插入的task
 */
export const removeTask = function (list, task) {
  const _idx = _.findIndex(list, (o) => { return o.id === task.userId })
  if (_idx !== -1) {
    const _task = list[_idx].list
    const _idx2 = _.findIndex(_task, (o) => {
      return o.id === task.id
    })
    if (_idx2 !== -1) {
      list[_idx].list.splice(_idx2, 1)
    }
  }

  return list
}
