<template>
  <div class="aboutUs">
    <a-tabs defaultActiveKey="1" @change="changeTabs">
      <a-tab-pane key="1" tab="市民云介绍" :forceRender="false" v-auth="['getIntroduce']">
       <Introduce v-if="activeKey==='1'"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="服务协议" :forceRender="false" v-auth="['getServiceAgreement']">
        <ServiceAgreement v-if="activeKey==='2'" :type="2"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="隐私政策" :forceRender="false" v-auth="['getPrivacyPolicy']">
        <ServiceAgreement v-if="activeKey==='3'" :type="3"/>
        </a-tab-pane>
      <a-tab-pane key="4" tab="用户授权协议" :forceRender="false" v-auth="['getEULA']">
        <ServiceAgreement v-if="activeKey==='4'" :type="4"/>
        </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>

import Introduce from "./AbousUsChild/Introduce"
import ServiceAgreement from "./AbousUsChild/ServiceAgreement"
export default {
  components: { Introduce, ServiceAgreement },
  data() {
    return {
      activeKey: "1",
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      other: "",
      formIntro: {
        officialWebsite: "",
        phoneNumber: "",
        mailbox: "",
        address: ""
      },
      rules: {
        officialWebsite: [
          {
            required: true,
            message: "请输入官网网址！",
            trigger: "blur"
          }
          //   {
          //     min: 3,
          //     max: 5,
          //     message: "Length should be 3 to 5",
          //     trigger: "blur"
          //   }
        ],
        phoneNumber: [
          {
            required: true,
            message: "请输入座机！",
            trigger: "blur"
          }
        ],
        mailbox: [
          {
            required: true,
            message: "请输入邮箱！",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入地址！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {

  },
  methods: {
    changeTabs(activeKey) {
      this.activeKey = activeKey
    }
  }
};
</script>

<style lang="less" scoped>
.aboutUs {
  height: 100%;
  overflow-y: auto;
  padding: 15px;
  background-color: #fff;
}
</style>
