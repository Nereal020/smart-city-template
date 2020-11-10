/*
 * @Page: 发布新版本组件
 * @Author: mikey.WuQiao
 * @Date: 2020-08-03 10:48:15
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-10-13 15:18:23
 */
<template>
  <div class="add-appupdate">
    <a-modal
      width="800px"
      :title="info.title"
      :visible="visible"
      @cancel="handleCancel"
      :footer="null"
      :centered="true"
      :keyboard="false"
      :maskClosable="false"
      :destroyOnClose="true"
      class="app-update-modal"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="更新平台" prop="platform">
          <!-- 编辑的时候 状态是上架的不能改平台 状态不是上架的 可以改平台-->
          <a-radio-group v-model="form.platform" :disabled="appState==='1'">
            <a-radio value="0">Android（安卓）</a-radio>
            <a-radio value="1">iOS（苹果）</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item ref="versionsName" label="更新版本名称" prop="versionsName">
          <a-input
            placeholder="请输入版本名称"
            v-model.trim="form.versionsName"
            @blur="() => {$refs.versionsName.onFieldBlur();}"
            style="width:600px;"
          />
        </a-form-model-item>

        <a-form-model-item label="更新等级" prop="updateLevel">
          <a-select v-model="form.updateLevel" placeholder="请选择更新等级">
            <a-select-option value="1">强制更新</a-select-option>
            <a-select-option value="2">非强制提示更新</a-select-option>
            <a-select-option value="3">非强制不提示更新</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.platform =='1'"
          :key="11"
          ref="IOSAppStoreURL"
          label="IOSAppStoreURL:"
          prop="IOSAppStoreURL"
        >
          <a-input
            placeholder="请输入应用AppStore的URL"
            v-model.trim="IOSAppStoreURL"
            @blur="() => {$refs.IOSAppStoreURL.onFieldBlur();}"
            style="width:600px;"
          />
        </a-form-model-item>

        <a-form-model-item
          v-if="form.platform =='0'"
          :key="22"
          label="安装包"
          prop="apk"
          class="redstarl"
        >
          <a-upload-dragger
            accept=".apk"
            name="file"
            :data="{token}"
            :headers="{token}"
            :beforeUpload="beforeUpload"
            :action="baseUrl + '/uploadFile'"
            @change="handleChange"
            :fileList="fileList"
          >
            <!-- <p class="ant-upload-drag-icon">
                                <a-icon type="android" />
            </p>-->
            <p class="ant-upload-text">请单击此处上传文件或将文件拖拽至此处</p>
            <p class="ant-upload-hint">请上传后缀为.apk的文件</p>
          </a-upload-dragger>
        </a-form-model-item>
        <a-form-model-item ref="versionsCode" label="版本Code" prop="versionsCode">
          <a-input
            placeholder="请输入版本Code"
            v-model.trim="form.versionsCode"
            @blur="() => { $refs.versionsCode.onFieldBlur();} "
            style="width:600px;"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="updateRemark"
          class="editor-item redstarl"
          label="更新说明"
          prop="updateRemark"
        >
          <Editor
            ref="editor"
            v-model="form.updateRemark"
            @change="editorChange"
            style="width:600px;"
          />
        </a-form-model-item>
        <div style="color: #3698F7;margin-left: 130px;margin-bottom:20px;font-size:12px;">
          <span>提示：</span>提交创建之后，该版本都是默认为下架状态，需手动开关上架
        </div>
        <a-form-model-item class="footer-item" :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit($event)">
            <a-icon type="loading" v-show="confirmLoading" />
            {{info.addBtn}}
          </a-button>
          <a-button style="margin-left: 10px;" @click="handleCancel">{{info.cancleBtn}}</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import Editor from "../../../components/Editor";
import { baseUrl } from "../../../Utils/global";

export default {
  name: "createAndUpdateAppUpdate",
  components: { Editor },
  data() {
    const validateApp = (rule, value, callback) => {
      if (!this.appUploadUrl) {
        return callback(new Error("请上传安装包"));
      } else {
        callback();
      }
    };
    const updateRemark = (rule, value, callback) => {
      if (!this.form.updateRemark) {
        return callback(new Error("请输入更新说明"));
      } else {
        callback();
      }
    };
    const IOSAppStoreURL = (rule, value, callback) => {
      if (!this.IOSAppStoreURL) {
        return callback(new Error("请输入应用AppStore的URL"));
      } else {
        callback();
      }
    };
    return {
      token: "",
      baseUrl,
      fileList: [],
      isClear: false, // editor is clear
      editorValue: "", // editor value
      appState: "", // app上架状态
      fileSize: "", //文件size
      fileName: "", //文件的name
      IOSAppStoreURL: "", // ios store 地址
      appUploadUrl: "", // 上传文件的路径（Android）;
      appUId: "", //当前的id
      form: {
        platform: "0",
        versionsName: "",
        updateLevel: undefined,
        versionsCode: "",
        updateRemark: "",
        appPath: "" // 二合一的path(Android 和 iOS的地址)
      },
      info: {
        title: "",
        addBtn: "",
        cancleBtn: ""
      },
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      other: "",
      rules: {
        versionsName: [
          {
            required: true,
            message: "请输入更新版本名称",
            trigger: "blur"
          }
        ],
        platform: [
          {
            required: true,
            message: "请选择平台类型",
            trigger: "change"
          }
        ],
        updateLevel: [
          {
            required: true,
            message: "请选择更新等级",
            trigger: "change"
          }
        ],
        apk: [
          {
            required: true,
            trigger: "change",
            validator: validateApp
          }
        ],

        versionsCode: [
          {
            required: false,
            message: "请输入版本Code",
            trigger: "blur"
          }
        ],
        IOSAppStoreURL: [
          {
            required: true,
            validator: IOSAppStoreURL,
            trigger: "blur"
          }
        ],
        updateRemark: [
          {
            required: true,
            validator: updateRemark
          }
        ]
      }
    };
  },
  mounted() {
    this.token = window.sessionStorage.getItem("token");
  },
  computed: {
    apkBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },
  methods: {
    // editor is change
    editorChange(val) {
      if (
        val === "<p><br></p>" ||
        val === "<div><br></div>" ||
        val === "<span><br></span>"
      ) {
        val = "";
      }
      this.form = { ...this.form, updateRemark: val };
    },
    // show modal
    showModal(type, record) {
      // 点击之前先把form清空
      this.IOSAppStoreURL = "";
      this.appPath = "";
      this.fileList = [];
      this.form = {
        platform: "0",
        versionsName: "",
        updateLevel: undefined,
        versionsCode: "",
        updateRemark: "",
        appPath: "" // 二合一的path(Android 和 iOS的地址)
      };
      // 发布新版本
      if (type === "add") {
        this.info = {
          title: "发布新版本",
          addBtn: "立即提交",
          cancleBtn: "取消"
        };
        // 新发布的版本上架状态默认关闭
        this.appState = "0";
        // 编辑版本
      } else if (type === "edit") {
        this.fileList = [];
        this.info = {
          title: "编辑此版本",
          addBtn: "保存",
          cancleBtn: "取消"
        };
        this.form = { ...record };
        // 编辑时，安装包回显
        // Android
        if (record.platform === "0" && !this.IOSAppStoreURL) {
          const appPath = JSON.parse(record.appPath);
          this.fileSize = appPath.fileSize;
          this.fileName = appPath.fileName;
          // 回显
          this.fileList = [
            {
              name: appPath.fileName,
              uid: appPath.appUploadUrl,
              status: "done"
            }
          ];
          // 如果编辑时，没有重新上传安装包，那么保存的时候就用以前的安装包的路径
          if (!this.appUploadUrl) {
            this.appUploadUrl = appPath.appUploadUrl;
          }
          // iOS
        } else if (record.platform === "1") {
          this.IOSAppStoreURL = { ...record }.appPath;
        }
        // appState 为上架状态的不可修改平台
        this.appState = record.appState;
        this.appUId = record.appUId;
      }
      this.visible = true;
    },
    // click cancel btn
    handleCancel() {
      this.visible = false;
      setTimeout(() => {
        this.resetForm();
      }, 200);
    },
    // 模态框点击确定事件
    onSubmit(event) {
      // 通过当前点击的节点判断是新增还是编辑
      const targetInnerText = event.target.innerText;
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            // delete this.form.apk;
            // Android
            if (this.form.platform === "0") {
              this.IOSAppStoreURL = "";
              // 后端只用一个字段appPath来接收Android安装包和iOS store地址，故判断一下
              const fileSize = this.fileSize;
              const fileName = this.fileName;
              const appUploadUrl = this.appUploadUrl;
              //将这个对象转为string传给后台
              this.form.appPath = JSON.stringify(
                Object.assign({}, { fileSize }, { fileName }, { appUploadUrl })
              );
            } else if (this.form.platform === "1") { // IOS
              // this.form.appPath = "";
              this.fileList = [];
              this.appUploadUrl = "";
              this.form.appPath = this.IOSAppStoreURL;
            }            
            const res = await this.$api.AppUpdate.createAndUpdateApp(this.form);
            if (res.code === "200" && res.result) {
              setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
                if (targetInnerText) {
                  targetInnerText === "立即提交"
                    ? this.$message.success("发布成功！")
                    : targetInnerText === "保存"
                    ? this.$message.success("保存成功！")
                    : this.$message.success("操作成功！");
                } else {
                  this.$message.success("操作成功！");
                }
                this.$parent.showAppStateConfirm(this.appState, this.appUId);
                // 重新请求数据。
                this.$parent.fetchAppUpdateList();
                // 成功之后清空表单
                this.form = {
                  platform: "0",
                  versionsName: "",
                  updateLevel: undefined,
                  versionsCode: "",
                  appPath: "",
                  updateRemark: ""
                };
              }, 200);
            } else {
              setTimeout(() => {
                // this.visible = false;
                this.confirmLoading = false;
                if (targetInnerText) {
                  targetInnerText === "立即提交"
                    ? this.$message.error("发布失败！" + res.msg)
                    : targetInnerText === "保存"
                    ? this.$message.error("保存失败！" + res.msg)
                    : this.$message.error("操作失败！" + res.msg);
                } else {
                  this.$message.error("操作失败！");
                }
              }, 500);
            }
          } catch (error) {
            this.$message.error("操作失败！" + error);
          }
          this.confirmLoading = true;
        } else {
          return false;
        }
      });
    },
    // reset form
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 上传之前的函数
    beforeUpload(file, fileList) {
      if (!file.type.includes("android")) {
        this.$message.warning("请选择Android安装包！");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(new Error('出错了'));
        });
      }
      this.fileList = [file];
    },
    // upload change
    handleChange(info) {
      this.fileList = info.fileList;
      // this.form.apk = null;
      const status = info.file.status;
      if (status === "done") {
        const res = info.file.response;
        if (res.code === "200" && res.result) {
          //上传完成之后的路径
          this.appUploadUrl = this.apkBaseUrl + res.data.path;
          //上传的文件的size
          this.fileSize = info.file.size;
          this.fileName = info.file.name;
        }
      }
      if (status === "removed") {
        this.appUploadUrl = "";
      } else if (status === "error") {
        this.$message.error(`${info.file.name} 上传失败！`);
      }
    }
  }
};
</script>

<style lang="less">
// .ant-upload-list-item-name{
//     margin-bottom: 10px;
// }
.ant-upload-list-text {
  margin-bottom: 10px;
}
.app-update-modal {
  max-height: 900px;
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    transition: 0.5s;
    padding: 24px 12px;
    .ant-form-item-label {
      text-align: right;
      width: 17%;
    }
    .ant-form-item-control-wrapper {
      width: 83%;
    }
    .ant-select {
      width: 300px; //选择框的长度
    }
  }
  .ant-col-offset-4 {
    margin-left: 40%;
  }
  .ant-form-item-control {
    width: 600px;
  }
}

.redstarl .ant-form-item-label label::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: "*";
}
</style>
