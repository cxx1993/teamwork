import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    date: [],
    user: [],
    task: [],
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
    updateTask(state, newTask) {
      state.task = newTask
    },
  },
  actions: {

  },
})
