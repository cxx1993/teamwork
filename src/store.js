import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import {
  dealTaskList, insertTask, removeTask, updateTask as _updateTask,
} from './utils/store_fn'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    date: [],
    collection: [], // 处理后的数据集合
  },
  getters: {
    getDate: state => {
      return state.date
    },
    // 获取userlist
    getUser: state => {
      const { collection } = state
      // console.log(collection)
      if (collection.length) {
        return collection.map(v => {
          const { username, id, minHeight } = v
          return {
            username, id, minHeight,
          }
        })
      }
      return []
    },
    // 获取task
    getCollection: state => {
      return state.collection
    },
  },
  mutations: {
    updateDate(state, newDate) {
      state.date = newDate
    },
    // 更新指定的user
    updateUserByIndex(state, { idx, userId, update }) {
      const { collection } = state
      const _idx = _.findIndex(collection, (o) => { return o.id === userId })
      if (_idx !== -1) {
        collection[idx] = Object.assign(collection[idx], update)
      }
    },
    updateCollection(state, { task, user }) {
      state.collection = dealTaskList(task, user)
    },
    curdTask(state, { data, type }) {
      switch (type) {
        case 'add':
          state.task = insertTask(state.task, data)
          break
        case 'update':
          state.task = _updateTask(state.task, data)
          break
        case 'remove':
          state.task = removeTask(state.task, data)
          break
        default:
          break
      }
    },
  },
  actions: {

  },
})
