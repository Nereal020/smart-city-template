<template>
  <div class="service-agreement">
    <a-spin tip="加载中..." :spinning="!readLoadEditor">
      <div class="content-box">
        <a-form-model layout="inline" :model="form" :rules="rules" ref="form">
          <a-form-model-item ref="content" :label="typeObj.title" prop="content">
            <Editor
              v-if="readLoadEditor"
              v-model="form.content"
              class="editor"
              @change="editorChange"
            />
            <!-- <Editor
              v-else
              v-model="form.content"
              class="editor"
              @change="editorChange"
            /> -->

            <!-- <div v-else class="placeholder">            </div> -->
          </a-form-model-item>
          <!-- <a-form-model-item ref="content" v-show="true" prop="content">
          <a-input v-model="form.content"></a-input>
          </a-form-model-item>-->
        </a-form-model>
      </div>
      <div class="button-box">
        <!-- <Debounce :time="1000" isDebounce>
        <button
          :loading="confirmBtnLoading"
          class="ant-btn ant-btn-primary"
          type="primary"
          @click="update"
          v-auth="[typeObj.auth]"
        >立即修改</button>
        </Debounce>-->
        <a-button
          :loading="confirmBtnLoading"
          class="ant-btn ant-btn-primary"
          type="primary"
          @click="update"
          v-auth="[typeObj.auth]"
        >立即修改</a-button>
        <!-- <a-button type>取消</a-button> -->
      </div>
    </a-spin>
  </div>
</template>

<script>
import Editor from "@/components/Editor01";
export default {
  components: { Editor },
  props: {
    type: {
      type: Number
    }
  },

  data() {
    let typeArr = [
      {
        type: 2,
        name: "ServiceAgreement",
        title: "服务协议",
        auth: "updateServiceAgreement"
      },
      {
        type: 3,
        name: "PrivacyPolicy",
        title: "隐私政策",
        auth: "updatePrivacyPolicy"
      },
      { type: 4, name: "EULA", title: "授权协议", auth: "updateEULA" }
    ];
    return {
      readLoadEditor: false,
      confirmBtnLoading: false, //确定按钮加载状态
      typeArr,
      form: {
        id: "",
        content: ""
      },
      //   表单验证规则
      rules: {
        content: [
          {
            required: true,
            message: "请输入内容！",
            trigger: "blur"
          }
        ]
      }
      // type: "ServiceAgreement"
    };
  },
  created() {
    this.getContentReq();
  },
  computed: {
    typeObj() {
      return this.typeArr.filter(item => item.type === this.type)[0];
    }
  },
  methods: {
    update() {
      // console.log("ininin update");
      this.$refs.form.validate(async valid => {
        if (!valid) return false;
        this.confirmBtnLoading = true;
        await this.updateContentReq();
        setTimeout(() => {
          this.confirmBtnLoading = false;
        }, 1000);
      });
    },

    //富文本编辑
    editorChange(e) {
      // if(e)
      this.form.content = e;
    },

    async getContentReq() {
      try {
        const res = await this.$api.AboutUs["get" + this.typeObj.name]({});
        if (res.code === "200") {
          this.form = res.data;
          this.readLoadEditor = true;
        } else {
          this.$message.error("获取失败!" + res.message);
        }
      } catch (error) {
        this.$message.error("请求失败!" + error);
      }
    },

    async updateContentReq() {
      this.$message.loading({
        content: "正在修改",
        key: "update"
      });

      try {
        const res = await this.$api.AboutUs["update" + this.typeObj.name](
          this.form
        );
        if (res.code === "200") {
          this.$message.success({
            content: "修改成功",
            key: "update"
          });
          this.getContentReq();
        } else {
          this.$message.error({
            content: "修改失败！" + res.message,
            key: "update"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "update"
        });
      }
    }
  }
};
</script>
<style lang="less" >
.service-agreement {
  width: 100%;
  // width: 1100px;
  padding-right: 70px;
  .content-box {
    height: 100%;
    display: flex;
  }
  .editor {
    overflow-y: auto;
    height: calc(100vh - 300px);
    // height: 500px;
  }
  .button-box {
    width: 100%;
    // margin-left: 78px;
    padding-left: 108px;
    margin-top: 20px;
    & > * {
      margin-right: 20px;
    }
  }

.placeholder{
  width: 100%;
  height: 700px;
  border: 1px solid #ccc;
}

.ant-form-item,.ant-form-inline{
  width: 100%;
  height: 100%;
}
  .ant-form-item-label {
    margin-left: 30px;
  }
  .ant-form-item-control-wrapper {
    width: calc(100% - 120px);
    // width: 840px;
  }
  .ant-form-inline .ant-form-item-with-help {
    margin-bottom: 0;
  }
}
</style>