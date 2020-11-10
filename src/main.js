import Vue from "vue"
import { Button, Layout, Icon, Card, Checkbox, Notification, Switch, Drawer, Radio, Popconfirm, Spin, Popover, Menu, Dropdown, Avatar, Tabs, Form, Input, Progress, Select, Table, Divider, Modal, FormModel, Message, DatePicker, Pagination, Upload, Tag, Tree } from "ant-design-vue"
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from './http'

import Auth from './directives/auth'
import Authorized from "./components/Anthorized.vue"
import svgIcon from "./components/common/svgIcon.vue"
import uploadImg from "./components/common/uploadImg";
import Debounce from './components/common/Debounce.js'
import './icon'
import { fliterTimestamp } from "./filters/index"
// 路由重复点击问题
import Router from 'vue-router'
import "./mock";

Vue.filter('fliterTimestamp', fliterTimestamp)
// import moment from 'moment'
Vue.config.productionTip = false;
Vue.prototype.$message = Message
Vue.component("svgIcon", svgIcon)
Vue.component("Authorized", Authorized)
Vue.component("uploadImg", uploadImg)
Vue.component('Debounce', Debounce)
Vue.use(Button)
  .use(Layout)
  .use(Icon)
  .use(Notification)
  .use(Drawer)
  .use(Radio)
  .use(Menu)
  .use(Form)
  .use(Input)
  .use(Spin)
  .use(Auth)
  .use(api)
  .use(Select)
  .use(Table)
  .use(Divider)
  .use(Modal)
  .use(FormModel)
  .use(DatePicker)
  .use(Pagination)
  .use(Upload)
  .use(Dropdown)
  .use(Progress)
  .use(Avatar)
  .use(Popconfirm)
  .use(Card)
  .use(Tag)
  .use(Popover)
  .use(Tabs)
  .use(Tree)
  .use(Switch)
  .use(Checkbox);
Vue.prototype.$message = Message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$notification = Notification
Notification.config({
  placement: 'topRight',
  top: '50px',
  duration: 15
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
