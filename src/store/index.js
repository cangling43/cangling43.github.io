import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_name: "",
    asideIsSpread:true,
  },
  mutations: {
    user_name(state,data){
      state.user_name=data
    },

    asideIsSpread(){
      
    }

  },
  actions: {
  },
  modules: {
  }
})
