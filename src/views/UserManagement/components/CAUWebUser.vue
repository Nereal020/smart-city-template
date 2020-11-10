/*
 * @Page:添加删除WEB用户组件
 * @Author: mikey.WuQiao
 * @Date: 2020-07-30 15:38:34
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-10-19 11:07:54
 */
<template>
  <div class="create-update-web-user">
    <a-modal
      class="web-user-modal"
      width="620px"
      :title="info.title"
      :visible="visible"
      :destroyOnClose="true"
      @cancel="handleCancel()"
      :footer="null"
      :centered="true"
      :maskClosable="false"
    >
      <a-form-model
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="账号类型" prop="roleId">
          <a-select v-model="ruleForm.roleId" placeholder="请选择账号类型">
            <a-select-option
              v-for="listRole of listRoles"
              :key="listRole.roleId"
              :value="listRole.roleId.toString()"
            >{{listRole.roleName}}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item ref="userName" has-feedback label="用户名称" prop="userName">
          <a-input
            :allowClear="true"
            placeholder="请输入用户名称"
            v-model.trim="ruleForm.userName"
            @blur="() => {$refs.userName.onFieldBlur();}"
          />
        </a-form-model-item>

        <a-form-model-item ref="account" has-feedback label="账号" prop="account">
          <a-input
            :allowClear="true"
            placeholder="请输入账号"
            v-model.trim="ruleForm.account"
            @blur="() => { $refs.account.onFieldBlur();} "
          />
        </a-form-model-item>

        <a-form-model-item ref="password" has-feedback label="密码" prop="password">
          <a-input-password
            :allowClear="true"
            placeholder="请输入密码"
            v-model.trim="ruleForm.password"
            type="password"
            autocomplete="off"
            @blur="() => { $refs.password.onFieldBlur();} "
          />
        </a-form-model-item>

        <a-form-model-item
          ref="passwordagain"
          has-feedback
          label="确认密码"
          prop="passwordagain"
          v-if="isShowPasswordInputAgain"
        >
          <a-input-password
            :allowClear="true"
            placeholder="请输入确认密码"
            v-model.trim="ruleForm.passwordagain"
            type="password"
            autocomplete="off"
            @blur="() => { $refs.passwordagain.onFieldBlur();} "
          />
        </a-form-model-item>

        <a-form-model-item ref="contact" has-feedback label="联系人" prop="contact">
          <a-input
            :allowClear="true"
            placeholder="请输入联系人"
            v-model.trim="ruleForm.contact"
            @blur="() => { $refs.contact.onFieldBlur();} "
          />
        </a-form-model-item>
        <a-form-model-item ref="phone" has-feedback label="电话" prop="phone">
          <a-input
            placeholder="请输入电话号码"
            :allowClear="true"
            :maxLength="11"
            v-model.trim="ruleForm.phone"
            @blur="() => { $refs.phone.onFieldBlur();} "
          />
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-input
            v-model="ruleForm.remark"
            type="textarea"
            style="height:120px;"
            placeholder="请输入内容"
          />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button :disabled="confirmLoading" type="primary" @click="onSubmit($event)">
            <a-icon type="loading" v-if="confirmLoading" />
            {{info.addBtn}}
          </a-button>
          <a-button style="margin-left: 20px;" @click="handleCancel()">{{info.cancleBtn}}</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "createAndUpdateWebUser",
  data() {
    let checkPending;
    clearTimeout(checkPending);
    /* 用户名称正则匹配 */
    const validateUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名称"));
      }
      checkPending = setTimeout(() => {
        //用户名正则，4到16位（字母，数字，下划线，减号）
        // const pwdRegex = /^[a-zA-Z0-9_-]{4,16}$/;
        const pwdRegex = /^[a-zA-Z0-9_@+-?\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(
            new Error("格式有误，请输入中文、英文、数字、不允许特殊符号")
          );
        }
        callback();
      }, 300);
    };
    /* 账号正则匹配 */
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入账号"));
      }
      checkPending = setTimeout(() => {
        //账号正则，4到16位（字母，数字，下划线，减号）
        // const pwdRegex = /^[a-zA-Z0-9_-]{4,16}$/;
        const pwdRegex = /^[a-zA-Z0-9_@+-?\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(
            new Error("格式有误，请输入中文、英文、数字、不允许特殊符号")
          );
        }
        callback();
      }, 300);
    };
    /* 密码正则匹配 */
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        checkPending = setTimeout(() => {
          /*
           * 强：字母+数字+特殊字符
           * /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
           * 中：字母+数字，字母+特殊字符，数字+特殊字符
           * /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
           * 弱：纯数字，纯字母，纯特殊字符
           * /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/
           */
          const pwdRegex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*._]+$)[a-zA-Z\d!@#$%^&*._]+$/;
          if (!pwdRegex.test(value)) {
            callback(new Error("格式有误，字母、数字、常用符号组合"));
          } else {
            if (this.ruleForm.passwordagain) {
              this.$refs.ruleForm.validateField("passwordagain");
            }
          }
          callback();
        }, 300);
      }
    };
    /* 密码二次验证 */
    const validatePasswordAgain = (rule, value, callback) => {
      checkPending = setTimeout(() => {
        if (!value) {
          callback(new Error("请重复输入密码"));
        } else if (value !== this.ruleForm.password) {
          callback(new Error("两次密码输入要一致!"));
        } else {
          callback();
        }
      }, 300);
    };
    /* 联系人正则匹配 */
    const validateContact = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入联系人"));
      }
      checkPending = setTimeout(() => {
        //汉字正则
        // const pwdRegex = /^[\u4e00-\u9fa5]{0,}$/;
        const pwdRegex = /^[a-zA-Z\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(new Error("格式有误，请输入中文或英文"));
        }
        callback();
      }, 300);
    };
    /* 电话正则匹配 */
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入电话号码"));
      }
      checkPending = setTimeout(() => {
        //电话号码正则 ，(由于工信部放号段不定时，所以建议使用泛解析 ^([1][3,4,5,6,7,8,9])\d{9}$)  what?
        const pwdRegex = /^1[3|4|5|6|7|8|9]\d{9}$/;
        if (!pwdRegex.test(value)) {
          callback(new Error("电话号码输入格式有误"));
        }
        callback();
      }, 300);
    };

    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      isShowPasswordInputAgain: true, // 编辑时不显示重复密码
      listRoles: [],
      ruleForm: {
        roleId: undefined,
        userName: "",
        account: "",
        password: "",
        passwordagain: "",
        contact: "",
        phone: "",
        remark: ""
      },
      //信息
      info: {
        title: "",
        addBtn: "",
        cancleBtn: ""
      },
      rules: {
        userName: [
          {
            validator: validateUserName,
            required: true,
            trigger: "blur"
          },
          {
            max: 26,
            min: 2,
            message: "长度2-26位"
          }
        ],
        roleId: [
          {
            required: true,
            message: "请选择账号类型",
            trigger: "blur"
          }
        ],

        account: [
          {
            validator: validateAccount,
            required: true,
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: validatePassword,
            required: true,
            trigger: "blur"
          }
        ],
        passwordagain: [
          {
            validator: validatePasswordAgain,
            required: true,
            trigger: "blur"
          }
        ],
        contact: [
          {
            validator: validateContact,
            required: true,
            trigger: "blur"
          }
        ],
        phone: [
          {
            validator: validatePhone,
            required: true,
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: false,
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.fetchWebUserListRoles();
  },
  beforeDestroy() {
    clearTimeout(this.checkPending);
  },
  methods: {
    showModal(type, record) {
      if (type === "add") {
        this.ruleForm = {};
        this.info = {
          title: "添加WEB端用户",
          addBtn: "立即创建",
          cancleBtn: "取消"
        };
        // 展示确认密码框
        this.isShowPasswordInputAgain = true;
      } else if (type === "edit") {
        this.info = {
          title: "编辑WEB端用户",
          addBtn: "保存",
          cancleBtn: "取消"
        };
        this.ruleForm = { ...record };
        // 不展示确认密码框
        this.isShowPasswordInputAgain = false;
      }
      this.visible = true;
    },
    // 模态框取消
    handleCancel() {
      this.visible = false;
      this.resetForm();
    },
    // 模态框提交
    onSubmit(event) {
      // 通过当前点击的节点判断是新增还是编辑
      const targetInnerText = event.target.innerText;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const fetchData = { ...this.ruleForm };
          this.confirmLoading = true;
          setTimeout(async() => {
            try {
              const res = await this.$api.WebUser.createAndUpdateWebUser(
                fetchData
              );
              if (res.code === "200" && res.result) {
                console.log(res);
                this.visible = false;
                this.confirmLoading = false;
                if (targetInnerText) {
                  targetInnerText.includes("创建")
                    ? this.$message.success("创建成功！")
                    : targetInnerText.includes("保存")
                    ? this.$message.success("保存成功！")
                    : this.$message.success("操作成功！");
                } else {
                  this.$message.success("操作成功！");
                }
                this.$parent.fetchWebUserList();
              } else {
                if (targetInnerText) {
                  targetInnerText.includes("创建")
                    ? this.$message.error("创建失败！" + res.msg)
                    : targetInnerText.includes("保存")
                    ? this.$message.error("保存失败！" + res.msg)
                    : this.$message.error("操作失败！" + res.msg);
                } else {
                  this.$message.error("操作失败！" + res.msg);
                }
                this.confirmLoading = false;
              }
            } catch (error) {
              this.$message.error("操作失败！" + error);
              this.confirmLoading = false;
            }
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 获取角色账号类型
    async fetchWebUserListRoles() {
      try {
        const res = await this.fetchListRoles();
        if (res.code === "200" && res.result) {
          this.listRoles = res.data;
        } else {
          this.$message.error("获取失败！");
        }
      } catch (error) {
        this.$message.error("获取失败！" + error);
      }
    },
    //请求账号类型下拉列表
    async fetchListRoles() {
      return await this.$api.WebUser.getWebUserListRoles({
        roleId: "",
        roleName: ""
      });
    }
  }
};
</script>

<style lang="less">
.web-user-modal {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    padding: 24px 40px;
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
