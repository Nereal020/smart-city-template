<template>
  <div>
    <!-- 新增编辑对话框 -->
    <a-modal
      v-model="addVisible"
      title="新增"
      wrapClassName="nameAuth-add-modal"
      :footer="null"
      :maskClosable="false"
      width="610px"
      :destroyOnClose="true"
      :zIndex="900"
    >
      <a-form-model layout="inline" :model="form" :rules="rules" ref="form">
        <!-- 手机号/用户ID -->
        <a-form-model-item ref="uid" label="手机号/用户ID " prop="uid" has-feedback>
          <!-- <a-input v-model="form.uid" @blur="() => { $refs.uid.onFieldBlur()}" style="width:380px" /> -->
          <a-select
            v-model="form.uid"
            @blur="() => { $refs.uid.onFieldBlur()}"
            style="width:380px"
            show-search
            allowClear
            placeholder="请输入完整手机号或用户ID关联用户"
            @search="searchUser"
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in searchUserList"
              :key="item.uid"
              :value="item.uid"
            >手机号:{{item.tel}}/用户ID:{{item.userID}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 近期照片 -->
        <div class="upload-item-box">
          <a-form-model-item ref="image" label="近期照片" prop="image" class="uplode-item">
            <uploadImg
              ref="uploadImg"
              @changeFormImage="changeFormImage"
              @resetFormImage="resetFormImage"
            />
          </a-form-model-item>

          <!-- 身份证正面 -->
          <a-form-model-item ref="IDCardFront" label="身份证正面" prop="IDCardFront" class="uplode-item">
            <uploadImg
              ref="uploadIDCardFront"
              @changeFormImage="changeFormIDCardFront"
              @resetFormImage="resetFormIDCardFront"
            />
          </a-form-model-item>

          <!-- 身份证背面 -->
          <a-form-model-item
            ref="IDCardContrary"
            label="身份证背面"
            prop="IDCardContrary"
            class="uplode-item"
          >
            <uploadImg
              ref="uploadIDCardFront"
              @changeFormImage="changeFormIDCardContrary"
              @resetFormImage="resetFormIDCardContrary"
            />
          </a-form-model-item>
        </div>

        <!-- OCR -->
        <div class="modal-button-box OCR-button">
          <a-button
            class="orange-button"
            :loading="OCRLoading"
            @click="OCR()"
            style="margin-right:30px"
          >OCR提取</a-button>
          <!-- <a-button @click="cancelAdd()" style="margin-top:10px">取消</a-button> -->
        </div>

        <a-spin :spinning="OCRLoading" tip="提取中...">
          <!-- 姓名 -->
          <a-form-model-item ref="name" label=" 姓 名 " prop="name" style="width:100%" has-feedback>
            <a-input v-model="form.name" style="width:380px" />
          </a-form-model-item>
          <!-- 身份证号码 -->
          <a-form-model-item
            ref="IDNumber"
            has-feedback
            label=" 身份证号码 "
            prop="IDNumber"
            style="width:100%"
          >
            <a-input v-model="form.IDNumber" :maxLength="18" style="width:380px" />
          </a-form-model-item>
          <!-- 身份证地址 -->
          <a-form-model-item
            ref="address"
            has-feedback
            label="身份证地址"
            prop="address"
            style="width:100%"
          >
            <a-input v-model="form.address" style="width:380px" />
          </a-form-model-item>
          <!-- 性别 -->
          <a-form-model-item
            ref="gender"
            has-feedback
            label=" 性 别 "
            prop="gender"
            style="width:100%"
          >
            <!-- <a-input v-model="form.gender" style="width:380px" /> -->
            <a-select v-model="form.gender" style="width:380px">
              <a-select-option :key="1" value="1">男</a-select-option>
              <a-select-option :key="0" value="0">女</a-select-option>
              <a-select-option :key="0" value="2">未知</a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- 民族 -->
          <a-form-model-item
            ref="nation"
            has-feedback
            label=" 民 族 "
            prop="nation"
            style="width:100%"
          >
            <a-input v-model="form.nation" style="width:380px" />
          </a-form-model-item>
          <!-- 出生年月 -->
          <a-form-model-item ref="born" has-feedback label="出生年月" prop="born" style="width:100%">
            <a-input v-model="form.born" style="width:380px" />
          </a-form-model-item>
          <!-- 签发机关 -->
          <a-form-model-item ref="org" has-feedback label="签发机关" prop="org" style="width:100%">
            <a-input v-model="form.org" style="width:380px" />
          </a-form-model-item>
          <!-- 有效期限 -->
          <a-form-model-item
            ref="limitedPeriod"
            has-feedback
            label="有效期限"
            prop="limitedPeriod"
            style="width:100%"
          >
            <a-input v-model="form.limitedPeriod" style="width:380px" />
          </a-form-model-item>
        </a-spin>
        <!-- CDIT -->
        <div class="CDIT">
          <a-button
            class="green-button"
            :loading="CDITLoading"
            @click="CDITAuth()"
            style="margin-right:30px"
          >CTID实名认证检测</a-button>
          <div class="CDIT-text" v-if="CDITAuthResult.authResult==='3'">
            <span>检测结果：</span>
            <span class="CDIT-text-text">{{CDITAuthResult.score}}</span>
            <!-- <span>评分：</span>
            <span>{{CDITAuthResult.score}}</span>-->
          </div>
        </div>

        <div class="modal-button-box">
          <a-form-model-item ref="authState" prop="authState">
            <a-button
              :loading="confirmBtnLoading"
              :disabled="CDITAuthResult.authResult!=='3'"
              type="primary"
              @click="addAppUser()"
              style="margin-right:30px"
            >通过认证</a-button>
            <!-- <Debounce :time="1000" isDebounce>
              <button
                class="submit ant-btn ant-btn-primary"
                :disabled="CDITAuthResult.authResult!=='3'"
                @click="addAppUser"
                style="margin-right:30px"
              >通过认证</button>
            </Debounce>-->
            <a-button @click="cancelAdd()" style="margin-top:10px">取消</a-button>
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { IDNumberReg, nameReg } from "@/Utils/reg.js";
export default {
  //  props: {
  //    uid: {
  //      type: String,
  //      required: true,
  //      default: ""
  //    }
  //  },
  data() {
    // 表单验证---身份证号格式
    let validateIDNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入身份证号！"));
      } else {
        if (!IDNumberReg.test(value)) {
          return callback(new Error("请输入正确的身份证号"));
        }
        callback();
      }
    };

    // 表单验证---姓名
    let validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入姓名！"));
      } else {
        if (value.length < 2) {
          callback(new Error("请至少输入两个字"));
        }
        if (!nameReg.test(value)) {
          callback(new Error("格式不正确，仅支持中文"));
        }
        callback();
      }
    };

    return {
      confirmBtnLoading: false, // 确定按钮加载状态
      addVisible: false, // 新增对话框显隐
      searchUserList: [], // 搜索的用户列表
      // 表单
      form: {
        //  uid: "",
        uid: undefined,
        name: null,
        IDNumber: null,
        address: null,
        image: null,
        IDCardFront: null,
        IDCardContrary: null,
        gender: null,
        nation: null,
        born: null,
        org: null,
        limitedPeriod: null
      },
      //    表单验证规则
      rules: {
        uid: [
          {
            required: true,
            message: "请选择用户！",
            trigger: "blur"
          }
        ],
        name: [
          {
            validator: validateName,
            trigger: ["change", "blur"],
            required: true
          }
        ],

        IDNumber: [
          {
            validator: validateIDNumber,
            trigger: ["change", "blur"],
            required: true
          }
        ],
        address: [
          {
            required: true,
            message: "请输入地址！",
            trigger: "blur"
          }
        ],
        image: [
          {
            required: true,
            message: "请上传照片！"
          }
        ],
        IDCardFront: [
          {
            required: true,
            message: "请上传照片！"
          }
        ],
        IDCardContrary: [
          {
            required: true,
            message: "请上传照片！"
          }
        ]
      },

      CDITAuthResult: {},
      OCRLoading: false,
      CDITLoading: false
    };
  },
  created() {},
  computed: {
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },
  watch: {
    form: {
      handler() {
        this.CDITAuthResult.authResult = null;
      },
      deep: true
    }
  },
  methods: {
    openThisModal() {
      this.form = {};
      this.CDITAuthResult = {};
      this.addVisible = true;
    },
    CDITAuth() {
      // console.log(this.form)
      this.$refs.form.validate(valid => {
        if (!valid) return false;
        this.CDITAuthReq();
      });
    },

    // 传给 上传图片组件的方法
    // 近期照片
    changeFormImage(data) {
      this.form = { ...this.form, image: data };
      this.$nextTick(() => {
        this.$refs.form.validateField("image");
      });
    },
    resetFormImage() {
      this.form.image = null;
      this.$refs.form.validateField("image");
    },

    // 身份证正面
    changeFormIDCardFront(data) {
      this.form = { ...this.form, IDCardFront: data };
      this.$nextTick(() => {
        this.$refs.form.validateField("IDCardFront");
      });
    },
    resetFormIDCardFront() {
      this.form.IDCardFront = null;
      this.$refs.form.validateField("IDCardFront");
    },

    // 身份证反面
    changeFormIDCardContrary(data) {
      this.form = { ...this.form, IDCardContrary: data };
      this.$nextTick(() => {
        this.$refs.form.validateField("IDCardContrary");
      });
    },
    resetFormIDCardContrary() {
      this.form.IDCardContrary = null;
      this.$refs.form.validateField("IDCardContrary");
    },

    // 确认 新增
    async addAppUser() {
      this.$message.loading({
        content: "正在新增",
        key: "add"
      });
      this.confirmBtnLoading = true;
      try {
        let res = await this.$api.MobileCertify.createNameAuth(this.form);
        setTimeout(() => {
          this.confirmBtnLoading = false;
        }, 500);
        if (res.code === "200") {
          this.$message.success({
            content: "新增成功",
            key: "add"
          });
          this.addVisible = false;
          this.$parent.getList();
        } else {
          this.$message.error({
            content: "新增失败！" + res.message,
            key: "add"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败" + error,
          key: "add"
        });
      }
    },

    // OCR提取
    OCR() {
      const { IDCardFront, IDCardContrary } = this.form;
      this.$refs.form.validateField("IDCardFront");
      this.$refs.form.validateField("IDCardContrary");
      if (IDCardContrary || IDCardFront) {
        this.OCRReq();
      }
    },

    // 取消 新增
    cancelAdd() {
      this.addVisible = false;
    },

    // CDITAuth
    async CDITAuthReq() {
      this.$message.loading({
        content: "验证中",
        key: "verify"
      });
      this.CDITLoading = true;
      try {
        let res = await this.$api.MobileCertify.CTIDNameAuth(this.form);
        //  console.log("res", res);
        if (res.code === "200") {
          //  this.$message.success({
          //    content: "验证成功",
          //    key: "verify"
          //  });
          this.CDITAuthResult = res.data;
          //  let message = res.data.score.match(/(\S*)，/)[1];
          //  let score = res.data.score.match(/：(\S*)/)[1];
          //  this.CDITAuthResult.message = message;
          //  this.CDITAuthResult.score = score;
          this.CDITAuthResult.authResult = "3";
          //  this.addVisible = true;
          //  this.$emit.getList();
        } else {
          this.$message.error({
            content: "验证失败" + res.message,
            key: "verify"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "verify"
        });
      } finally {
        this.CDITLoading = false;
      }
    },

    // 搜索用户
    async searchUser(value) {
      if (value.length >= 10) {
        //  console.log(value);
        try {
          let res = await this.$api.MobileCertify.searchAPPUser({
            keyword: value
          });
          //  console.log("res", res);
          if (res.code === "200") {
            this.searchUserList = res.data;
          } else {
            this.$message.error("搜索失败" + res.message);
          }
        } catch (error) {
          //  console.log(error);
          this.$message.error("请求失败" + error);
        }
      } else {
        this.searchUserList = [];
      }
    },

    // OCR提取接口
    async OCRReq() {
      this.$message.loading({
        content: "OCR提取中...",
        key: "OCR"
      });
      this.OCRLoading = true;
      const { image, IDCardFront, IDCardContrary } = this.form;
      try {
        let res = await this.$api.MobileCertify.OCR({
          image,
          IDCardFront,
          IDCardContrary
        });
        if (res.code === "200") {
          // res.data.nation="汉族"
          const { gender } = res.data;
          res.data.gender = gender === "男" ? "1" : gender === "女" ? "0" : "2";

          this.form = Object.assign({ ...this.form }, { ...res.data });
          
          // Object.assign(this.form, res.data);
          this.$message.destroy({ key: "OCR" });
        } else {
          this.$message.error({
            content: "提取失败！",
            key: "verify"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "verify"
        });
      } finally {
        this.OCRLoading = false;
      }
    },

    filterOption(input, option) {
      //  console.log("input, option", input, option);
      return option.componentOptions.children[0].text;
    }
  }
};
</script>

<style lang="less" >
// 新增对话框
.nameAuth-add-modal {
  .ant-modal-body {
    padding: 12px 24px;
  }
  .ant-form-item {
    padding: 5px;
    .ant-form-item-label {
      width: 130px;
    }
  }
  // 红字样式
  .ant-form-item-with-help {
    margin-bottom: 0;
  }

  .orange-button {
    background-color: #efb95c;
    color: #fff;
    border-color: #efb95c;
  }

  // 上传图片样式
  .upload-item-box {
    // height: 176px;
    display: flex;
    justify-content: space-evenly;
    // margin-bottom: 10px;
    .ant-form-item-label {
      width: 130px;
      text-align: center;
    }
    .ant-form-item {
      margin-right: 0;
    }
    .ant-form-explain {
      text-align: center;
      margin-top: -10px;
    }
    .upload-img {
      height: 100px;
    }
  }
  .uplode-item {
    width: 150px;
    display: flex;
    flex-direction: column;
  }
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 20px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-upload.ant-upload-select-picture-card {
    width: 130px;
    height: 85px;
    margin: 0;
  }
  .ant-upload-list-picture-card .ant-upload-list-item {
    width: 130px;
    height: 85px;
  }

  .CDIT {
    padding: 10px;
    padding-left: 30px;
    text-align: center;
    .green-button {
      background-color: #54ba75;
      border-color: #54ba75;
      color: #fff;
    }

    .CDIT-text {
      margin-top: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      .CDIT-text-text {
        margin-right: 20px;
      }
    }
  }

  .modal-button-box {
    text-align: center;
    padding: 10px;
  }
  .OCR-button {
    padding-bottom: 10px;
  }
}
</style>