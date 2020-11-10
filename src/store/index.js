import Vue from 'vue'
import vuex from 'vuex'

import app from './modules/app.js'
import addRoutes from './modules/addRoutes'
import codeTable from './modules/codeTable'

Vue.use(vuex);
const store = new vuex.Store({
  modules: {
    app: app,
    addRoutes: addRoutes,
    codeTable: codeTable
  }
})
export default store