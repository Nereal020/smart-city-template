<template>
  <div class="introduce">
    <a-spin tip="加载中..." :spinning="!readLoadEditor">
      <a-form-model
        ref="form"
        :model="formIntro"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{span:16}"
        layout="inline"
      >
        <!-- 官网 -->
        <a-form-model-item ref="officialWebsite" label="官网" prop="officialWebsite">
          <a-input
            v-model="formIntro.officialWebsite"
            @blur="() => { $refs.officialWebsite.onFieldBlur()}"
          />
        </a-form-model-item>
        <!-- 邮箱 -->
        <a-form-model-item ref="mailbox" label="邮箱" prop="mailbox">
          <a-input v-model="formIntro.mailbox" @blur="() => { $refs.mailbox.onFieldBlur()}" />
        </a-form-model-item>
        <!-- 座机 -->
        <a-form-model-item ref="phoneNumber" label="座机" prop="phoneNumber">
          <a-input
            v-model="formIntro.phoneNumber"
            @blur="() => { $refs.phoneNumber.onFieldBlur()}"
          />
        </a-form-model-item>
        <!-- 商务 -->
        <a-form-model-item ref="hotLine" label="商务热线" prop="hotLine">
          <a-input v-model="formIntro.hotLine" @blur="() => { $refs.hotLine.onFieldBlur()}" />
        </a-form-model-item>

        <!-- 地址 -->
        <a-form-model-item ref="address" label="地址" prop="address">
          <a-input v-model="formIntro.address" @blur="() => { $refs.address.onFieldBlur()}" />
        </a-form-model-item>
        <!-- 公众号 -->
        <a-form-model-item ref="officialAccount" label="公众号" prop="officialAccount">
          <a-input
            v-model="formIntro.officialAccount"
            @blur="() => { $refs.officialAccount.onFieldBlur()}"
          />
        </a-form-model-item>

        <!-- 微信公众号二维码 -->
        <a-form-model-item ref="WXQRCode" prop="WXQRCode">
          <template slot="label">
            <!-- <span>微信公众号二维码</span> -->
            <span style="padding-right:10px">微信公众号</span>
            <br />
            <span>二维码</span>
          </template>

          <uploadImg
            ref="uploadImgWX"
            @changeFormImage="changeFormWXQRCode"
            @resetFormImage="resetFormWXQRCode"
          />
        </a-form-model-item>

        <!-- APP二维码 -->
        <a-form-model-item ref="APPQRCode" label="APP二维码" prop="APPQRCode">
          <uploadImg
            ref="uploadImgApp"
            @changeFormImage="changeFormAPPQRCode"
            @resetFormImage="resetFormAPPQRCode"
          />
        </a-form-model-item>

        <!-- 富文本 -->
        <div class="rich-text">
          <a-form-model-item label="简介" prop="content">
            <Editor
              v-if="readLoadEditor"
              v-model="formIntro.content"
              ref="editor"
              @change="changeContent"
              class="editor"
            />
          </a-form-model-item>
        </div>

        <!-- 按钮 -->
        <a-form-model-item>
          <div class="button-box">
            <!-- <Debounce :time="1000" isDebounce>
            <button
              class="submit ant-btn ant-btn-primary"
              type="primary"
              @click="onSubmit"
              v-auth="['updateIntroduce']"
            >立即修改</button>
            </Debounce>-->
            <a-button
              :loading="confirmBtnLoading"
              class="submit ant-btn ant-btn-primary"
              type="primary"
              @click="onSubmit"
              v-auth="['updateIntroduce']"
            >立即修改</a-button>
            <!-- <a-button style="margin-left: 10px;" @click="resetForm">取消</a-button> -->
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </div>
</template>

<script>
import Editor from "@/components/Editor01";
import uploadImg from "@/components/common/uploadImg";
import { emailReg, websiteReg, landlineReg } from "@/Utils/reg.js";
export default {
  components: { Editor, uploadImg },
  data() {
    //表单验证---官网
    let validateWebsite = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("官网不能为空！"));
      } else {
        if (!websiteReg.test(value)) {
          callback(new Error("网址格式不正确！"));
        }
        callback();
      }
    };
    //表单验证---邮箱
    let validateMail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("邮箱不能为空！"));
      } else {
        if (!emailReg.test(value)) {
          callback(new Error("邮箱格式不正确！"));
        }
        callback();
      }
    };
    //表单验证---座机
    let validateHotLine = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("号码不能为空！"));
      } else {
        if (!landlineReg.test(value)) {
          callback(new Error("号码格式不正确！"));
        }
        callback();
      }
    };
    return {
      readLoadEditor: false,
      confirmBtnLoading: false, //确定按钮加载状态
      formIntro: {
        officialWebsite: "",
        mailbox: "",
        phoneNumber: "",
        hotLine: "",
        address: "",
        officialAccount: "",
        WXQRCode: "",
        APPQRCode: "",
        content: ""
      },
      rules: {
        officialWebsite: [
          {
            required: true,
            message: "请输入官网网址！",
            trigger: "blur"
          },
          {
            validator: validateWebsite,
            required: true,
            trigger: ["change", "blur"]
          }
        ],
        mailbox: [
          // {
          //   required: true,
          //   message: "请输入邮箱！",
          //   trigger: "blur"
          // },
          { validator: validateMail, required: true, trigger: "change" }
        ],
        phoneNumber: [
          { validator: validateHotLine, required: true, trigger: "blur" }
          // {
          //   required: true,
          //   message: "请输入座机！",
          //   trigger: "blur"
          // }
        ],
        hotLine: [
          // {
          //   required: true,
          //   message: "请输入商务热线！",
          //   trigger: "blur"
          // },
          { validator: validateHotLine, required: true, trigger: "blur" }
        ],
        address: [
          {
            required: true,
            message: "请输入地址！",
            trigger: "blur"
          }
        ],
        officialAccount: [
          {
            required: true,
            message: "请输入公众号名称！",
            trigger: "blur"
          }
        ],
        WXQRCode: [
          {
            required: true,
            message: "请上传微信公众号二维码",
            trigger: "blur"
          }
        ],
        APPQRCode: [
          {
            required: true,
            message: "请上传APP二维码！"
            // trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "请填写简介！"
            // trigger: "change"
          }
        ]
      }
      //图片上传
    };
  },
  created() {
    // console.log("created");

    this.getAppIntroduceReq();
  },
  mounted() {
    // console.log("mounted");
  },
  computed: {
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },

  methods: {
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false;
        // this.formIntro.content=this.$refs.editor.editor
        this.confirmBtnLoading = true;
        await this.updateIntroduceReq();
        setTimeout(() => {
          this.confirmBtnLoading = false;
        }, 1000);
      });
    },

    //changeContent
    changeContent(val) {
      this.formIntro.content = val;
    },

    //传给 上传图片组件的方法
    changeFormWXQRCode(data) {
      this.formIntro = { ...this.formIntro, WXQRCode: data };
      this.$nextTick(() => {
        this.$refs.form.validateField("WXQRCode");
      });
    },

    resetFormWXQRCode() {
      this.formIntro.WXQRCode = null;
      this.$refs.form.validateField("WXQRCode");
    },

    changeFormAPPQRCode(data) {
      this.formIntro = { ...this.formIntro, APPQRCode: data };
      this.$nextTick(() => {
        this.$refs.form.validateField("APPQRCode");
      });
    },

    resetFormAPPQRCode() {
      this.formIntro.APPQRCode = null;
      this.$refs.form.validateField("APPQRCode");
    },

    //修改
    async updateIntroduceReq() {
      this.$message.loading({
        content: "正在修改",
        key: "update"
      });
      try {
        const res = await this.$api.AboutUs.updateIntroduce(this.formIntro);
        // console.log("res", res);
        if (res.code === "200") {
          this.$message.success({
            content: "修改成功",
            key: "update"
          });
          this.getAppIntroduceReq({});
        } else {
          this.$message.error({
            content: "修改失败！" + res.message,
            key: "update"
          });
        }
        // console.log(res);
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "update"
        });
      }
    },

    //获取
    async getAppIntroduceReq() {
      try {
        const res = await this.$api.AboutUs.getAppIntroduce({});
        // console.log("res", res);
        if (res.code === "200") {
          this.formIntro = { ...res.data };
          this.readLoadEditor = true;

          // console.log(1, this.$refs.uploadImgApp);
          // console.log(2, this.$refs.uploadImgWX);
          if (this.$refs.uploadImgApp) {
            this.$refs.uploadImgApp.fileList = [
              {
                uid: "APPQRCode",
                name: "APP二维码",
                status: "done",
                url: this.picBaseUrl + res.data.APPQRCode
              }
            ];
          }
          if (this.$refs.uploadImgApp) {
            this.$refs.uploadImgWX.fileList = [
              {
                uid: "WXQRCode",
                name: "微信公众号二维码",
                status: "done",
                url: this.picBaseUrl + res.data.WXQRCode
              }
            ];
          }
          // console.log(this.$refs.uploadImgApp.fileList);
        } else {
          this.$message.error("获取失败！" + res.message);
        }
      } catch (error) {
        this.$message.error("请求失败");
      }
    }
  }
};
</script>

<style lang="less" >
.introduce {
  // width: 900px;
  .ant-form-item {
    width: 500px;
    margin-bottom: 24px;
    margin-right: 2px;
  }
  .ant-upload {
    img {
      width: 86px;
      height: 86px;
    }
  }

  .rich-text {
    .ant-form-item-label {
      width: 120px;
    }
    .ant-form-item {
      width: 100%;
      // width: 1000px;
    }
    .ant-form-item-control-wrapper {
      width: 840px;
      // min-width: 666px;
      // max-width: 1100px;
    }
    .editor {
      // overflow-y: auto;
      // height: 330px;
      height: calc(100vh - 550px);
    }
  }

  .button-box {
    width: 500px;
    padding-left: 120px;
    .submit {
      display: flex;
      align-items: center;
    }
  }
}
</style>
