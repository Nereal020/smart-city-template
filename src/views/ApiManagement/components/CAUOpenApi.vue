/*
 * @Page:添加删除API组件
 * @Author: mikey.WuQiao
 * @Date: 2020-07-30 15:38:34
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-10-19 10:22:57
 */
<template>
  <div class="add-api">
    <a-modal
      width="620px"
      :title="info.title"
      :visible="visible"
      @cancel="handleCancel()"
      :footer="null"
      :centered="true"
      :maskClosable="false"
      :destroyOnClose="true"
      class="create-update-api-modal"
    >
      <a-form-model
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="接口类型" prop="apiType">
          <a-select v-model="ruleForm.apiType" allowClear placeholder="请选择接口分类">
            <a-select-option
              v-for="item of codeTableList"
              :key="item.codeTableKey"
              :value="item.codeTableValue"
            >{{item.codeTableKey}}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref="apiName" has-feedback label="API名称" prop="apiName">
          <a-input
            placeholder="请输入API名称"
            v-model.trim="ruleForm.apiName"
            :maxLength="26"
            :allowClear="true"
            @blur="() => {$refs.apiName.onFieldBlur();}"
          />
        </a-form-model-item>

        <a-form-model-item ref="apiAddress" has-feedback label="API地址" prop="apiAddress">
          <a-input
            placeholder="请输入API的URL"
            :allowClear="true"
            v-model.trim="ruleForm.apiAddress"
            @blur="() => { $refs.apiAddress.onFieldBlur();} "
          />
        </a-form-model-item>

        <a-form-model-item label="API版本" prop="apiVersions">
          <a-select v-model="ruleForm.apiVersions" placeholder="请选择API版本号">
            <a-select-option value="1">V 1.0</a-select-option>
            <a-select-option value="2">V 1.1</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="备注" prop="apiRemark">
          <a-input
            v-model="ruleForm.apiRemark"
            type="textarea"
            style="height:120px;"
            placeholder="请输入内容"
          />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :disabled="btnDisabled" @click="onSubmit()">
            <a-icon type="loading" v-if="confirmLoading" />
            {{info.addBtn}}
          </a-button>
          <a-button style="margin-left: 10px;" @click="handleCancel()">{{info.cancleBtn}}</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "addAndUpdateApi",
  data() {
    let checkPending;
    clearTimeout(checkPending);
    /* API名称正则匹配 */
    const validateAPIName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入API名称"));
      }
      checkPending = setTimeout(() => {
        //匹配中文，英文字母和数字及_:
        const pwdRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(new Error("API名称格式有误"));
        }
        callback();
      }, 300);
    };
    /* API地址正则匹配 */
    const validateAPIAddress = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入API地址"));
      }
      checkPending = setTimeout(() => {
        //网站URL正则
        const strRegex =
          "^((https|http|ftp|rtsp|mms)?://)" +
          "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
          "(([0-9]{1,3}.){3}[0-9]{1,3}" + // IP形式的URL- 199.194.52.184
          "|" + // 允许IP和DOMAIN（域名）
          "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
          "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + // 二级域名
          "[a-z]{2,6})" + // first level domain- .com or .museum
          "(:[0-9]{1,4})?" + // 端口- :80
          "((/?)|" + // a slash isn't required if there is no file name
          "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        const pwdRegex = new RegExp(strRegex);
        if (!pwdRegex.test(value)) {
          callback(new Error("API地址格式有误"));
        }
        callback();
      }, 300);
    };
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      btnDisabled: false,
      codeTableList: [],
      ruleForm: {
        apiType: undefined,
        apiName: "",
        apiAddress: "",
        apiVersions: undefined,
        apiRemark: ""
      },
      info: {
        title: "",
        addBtn: "",
        cancleBtn: ""
      },
      rules: {
        apiName: [
          {
            required: true,
            trigger: "change",
            validator: validateAPIName
          },
          {
            min: 2,
            message: "长度不少于2位",
            trigger: "change"
          }
        ],
        apiType: [
          {
            required: true,
            message: "请选择接口分类",
            trigger: "change"
          }
        ],

        apiAddress: [
          {
            required: true,
            trigger: "change",
            validator: validateAPIAddress
          }
        ],
        apiVersions: [
          {
            required: true,
            message: "请选择API版本号",
            trigger: "change"
          }
        ],
        apiRemark: [
          {
            required: false
          }
        ]
      }
    };
  },
  mounted() {
    this.fetchCodeTable();
  },
  methods: {
    showModal(type, record) {
      this.btnDisabled = false;
      if (type === "add") {
        this.info = {
          title: "添加API",
          addBtn: "立即创建",
          cancleBtn: "取消"
        };
        this.ruleForm = {};
      } else if (type === "edit") {
        this.info = {
          title: "编辑API",
          addBtn: "保存",
          cancleBtn: "取消"
        };
        this.ruleForm = { ...record };
        delete this.ruleForm.useNum;
        delete this.ruleForm.maintenanceTime;
        delete this.ruleForm.apiState;
      }
      this.visible = true;
    },
    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
    },
    onSubmit() {
      this.btnDisabled = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          const data = { ...this.ruleForm };
          setTimeout(async() => {
            let fetchData;
            if (data) fetchData = data;
            fetchData = this.ruleForm;
            try {
              const res = await this.$api.ApiManagement.createAndUpdateApiManage(
                fetchData
              );
              if (res.code === "200" && res.result) {
                this.visible = false;
                this.confirmLoading = false;
                this.$message.success("创建成功！");
                this.btnDisabled = false;
                // TO DO
                // if(this.dataList.length === this.fetchData.pageSize){
                //     this.fetchData.pageIndex++
                // }
                this.$parent.fetchApiManageList();
              } else {
                this.confirmLoading = false;
                this.btnDisabled = false;
                this.$message.error("请求失败！" + res.message);
              }
            } catch (error) {
              this.confirmLoading = false;
              this.btnDisabled = false;
              this.$message.error("请求失败！" + error);
            }
          }, 100);
        } else {
          this.btnDisabled = false;
          return false;
        }
      });
    },
    //获取人员类型下拉框数据
    async fetchCodeTable() {
      this.codeTableList = await this.$store.dispatch(
        "queryCodeTable",
        "API_TYPE"
      );
    }
  }
};
</script>

<style lang="less">
.create-update-api-modal {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    padding: 24px 28px;
    .ant-form-item-label {
      text-align: right;
      width: 20%;
    }
    .ant-form-item-control-wrapper {
      width: 80%;
    }
    .ant-select {
      width: 200px; //选择框的长度
    }
    .ant-form-item-control-wrapper {
      width: 400px; //输入框的长度
    }
  }
  .ant-col-offset-4 {
    margin-left: 35%;
  }
}
</style>
