import Vue from 'vue'
import Vuex from 'vuex'
import {
  dealTaskList, insertTask, removeTask, updateTask as _updateTask,
} from './utils/store_fn'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    date: [],
    user: [],
    task: [1, 2, 3],
  },
  getters: {
    getDate: state => {
      return state.date
    },
    getUser: state => {
      return state.user
    },
    getTask: state => {
      return state.task
    },
  },
  mutations: {
    updateDate(state, newDate) {
      state.date = newDate
    },
    updateUser(state, newUser) {
      state.user = newUser
    },
    // 更新指定的user
    updateUserByIndex(state, { idx, user }) {
      state.user[idx] = user
    },
    updateTask(state, newTask) {
      state.task = dealTaskList(newTask, state.user)
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
