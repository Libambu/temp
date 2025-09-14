import Vue from 'vue'
import { set } from 'vue/types/umd'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    businessName: '',
    token: localStorage.getItem('adminToken') || ''
  },
  getters: {
  },
  mutations: {
    setBusinessName(state, name) {
      state.businessName = name
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('adminToken', token);
    },
    REMOVE_TOKEN(state) {
      state.token = '';
      localStorage.removeItem('adminToken');
    }
  },
  actions: {
  },
  modules: {
  }
})
