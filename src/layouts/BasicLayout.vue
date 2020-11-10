<template>
  <div :class="[`nav-theme-${navTheme}`,`nav-layout-${navLayout}`]">
    <a-layout id="components-layout-demo-side" style>
      <a-layout-sider
        v-if="navLayout==='left'"
        width="256px"
        v-model="collapsed"
        :theme="navTheme"
        :trigger="null"
        collapsible
        style="position:static;min-height: 100vh;height:100vh;overflow-y: auto"
      >
        <div class="logo">云巅Vue前端通用框架</div>
        <SideMenu :theme="navTheme"></SideMenu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <Header></Header>
        </a-layout-header>
        <a-layout-content
          v-if="delay"
          style="margin:16px;  height: calc(100vh - 100px); overflow-y: auto;"
        >
          <router-view></router-view>
        </a-layout-content>
        <a-spin v-else :spinning="!delay" tip="加载中...">
          <div class="spin-content"></div>
        </a-spin>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Header from "./Header";
import SideMenu from "./SideMenu";
import axios from 'axios'
export default {
  data() {
    return {
      collapsed: false
    };
  },
  created() {
    this.$store.commit("gettedInfo", false);
    this.setMenus();
  },
  computed: {
    navTheme() {
      return this.$route.query.navTheme || "dark";
    },
    navLayout() {
      return this.$route.query.navLayout || "left";
    },
    delay() {
      return this.$store.state.app.isGettedInfo;
    }
  },
  methods: {
    setMenus() {
      // this.$api.user.getUserInfo({}).then(res => {
      //   console.log(res)
      //   if (res.result === true && res.code === "200") {
      //     this.$store.dispatch("add_Routes", JSON.parse(res.data.menuList));
      //     sessionStorage.setItem("userInfo", JSON.stringify(res.data));
      //     this.$store.commit("gettedInfo", true);
      //   } else {
      //     this.$message.error("获取用户信息失败");
      //   }
      // });
      axios.post('/user/info').then(res => {
        if (res.data.result === true && res.data.code === "200") {
          this.$store.dispatch("add_Routes", JSON.parse(res.data.data.menuList));
          sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
          this.$store.commit("gettedInfo", true);
        } else {
          this.$message.error("获取用户信息失败");
        }
      })
    }
  },
  components: {
    Header,
    SideMenu
  }
};
</script>

<style lang="less" scoped>
.trigger-icon {
  padding: 0 20px;
  line-height: 64px;
  font-size: 20px;
}
.trigger-icon :hover {
  background: #eeeeee;
}
.logo {
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  text-align: center;
}
.nav-theme-dark .logo {
  color: white;
}
.spin-content {
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  grid-row: 1;
  margin: 0px;
  padding: 100px;
}
</style>>
