import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    date: [],
  },
  getters: {
    getDate: state => {
      return state.date
    },
  },
  mutations: {
    updateDate(state, newDate) {
      state.date = newDate
    },
  },
  actions: {

  },
})
