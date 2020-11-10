<template>
  <div class="APPUserManage">
    <div class="filter">
      <a-button
        class="add"
        type="primary"
        @click="addAPPUser"
        v-auth="['appUser_create']"
      >
        <svg-icon
          icon-class="add"
          :scale="0.8"
          style="margin-right:5px"
        ></svg-icon
        >添加用户
      </a-button>
      <!-- 开始日期 -->
      <div class="filter-right" v-auth="['appUser_list']">
        <a-date-picker
          style="width:140px"
          dropdownClassName="filterAppUserDate"
          v-model="filter.startTime"
          :disabled-date="disabledStartDate"
          :showToday="false"
          format="YYYY-MM-DD"
          placeholder="开始日期"
        >
          <svgIcon
            slot="suffixIcon"
            icon-class="riqi"
            :scale="0.8"
            style="margin-right:-1px"
          /> </a-date-picker
        >至
        <!-- 结束日期 -->
        <a-date-picker
          style="width:140px"
          dropdownClassName="filterAppUserDate"
          v-model="filter.endTime"
          :disabled-date="disabledEndDate"
          :showToday="false"
          format="YYYY-MM-DD"
          placeholder="结束日期"
        >
          <svgIcon
            slot="suffixIcon"
            icon-class="riqi"
            :scale="0.8"
            style="margin-right:-1px"
          />
        </a-date-picker>

        <!-- 审核状态选择 -->
        <!-- <a-select style="width: 120px" placeholder="审核状态" allowClear>
          <a-select-option value="jack">Jack</a-select-option>
        </a-select>-->
        <!-- 搜索 -->
        <a-input
          v-model="filter.keyword"
          placeholder="请输入手机号"
          style="width:180px"
        >
          <svg-icon
            slot="prefix"
            icon-class="sousuo"
            :scale="0.8"
            style="margin-right:0px"
          ></svg-icon>
        </a-input>
        <a-button type="primary" @click="search">搜索</a-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table">
      <a-table
        v-if="permit('appUser_list')"
        bordered
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowKey="row => row.uid"
        :rowClassName="
          (record, index) => {
            return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
          }
        "
        @change="sortChange"
      >
        <!-- 最近登录时间 -->
        <template slot="latelyTime" slot-scope="text, row">
          <a v-if="permit('appUser_logList')" @click="showLog(row)">{{
            text | fliterTimestamp(0)
          }}</a>
          <span v-else>{{ text | fliterTimestamp(0) }}</span>
        </template>

        <!-- 认证状态 -->
        <template slot="authState" slot-scope="text">
          <span :style="{ color: returnAuthState(text).color }">{{
            returnAuthState(text).text
          }}</span>
        </template>

        <!-- 头像 -->
        <template slot="avatar" slot-scope="text, row">
          <img
            v-if="text"
            class="appUser-table-pic"
            :src="picBaseUrl + text"
            :alt="row.name"
            @click="handlePreviewAvatar(picBaseUrl + text)"
          />
          <span v-else>--</span>
        </template>

        <!-- 创建时间 -->
        <span slot="createTime" slot-scope="text">{{
          text | fliterTimestamp(0)
        }}</span>

        <!-- <span slot="createTime" slot-scope="text">{{text?timestampToTime(text,0):"--"}}</span> -->
        <div slot="handle" slot-scope="text, row" class="handle-button">
          <a-button
            type="link"
            @click="editAPPUser(row)"
            v-auth="['appUser_edit']"
          >
            <svg-icon
              icon-class="bianji"
              :scale="0.8"
              style="margin-right:5px"
            ></svg-icon
            >编辑
          </a-button>
          <a-button
            type="link"
            @click="AppUserAuth(row.uid)"
            v-auth="['appUser_authList']"
          >
            <svg-icon
              icon-class="denglushouquan"
              :scale="0.9"
              style="margin-right:5px"
            ></svg-icon
            >授权
          </a-button>
          <a-button
            type="link"
            @click="deleteAppUser(row.uid)"
            v-auth="['appUser_delete']"
          >
            <svg-icon
              icon-class="shanchu"
              :scale="0.8"
              style="margin-right:5px"
            ></svg-icon
            >删除
          </a-button>
        </div>
      </a-table>
      <a-table
        class="no-promission"
        v-else
        bordered
        :columns="columns"
        :data-source="[]"
        :locale="{ emptyText: '无权限，请联系管理员' }"
      />
    </div>

    <!-- 新增编辑对话框 -->
    <a-modal
      v-model="visible"
      :title="isAdd ? '添加用户' : '编辑'"
      wrapClassName="add-appuser-add-modal"
      :footer="null"
      :maskClosable="false"
      width="700px"
      :destroyOnClose="true"
    >
      <a-form-model layout="inline" :model="form" :rules="rules" ref="form">
        <!-- 手机号 -->
        <a-form-model-item ref="tel" label="手机号" prop="tel">
          <a-input
            v-model="form.tel"
            :maxLength="11"
            @blur="
              () => {
                $refs.tel.onFieldBlur();
              }
            "
            style="width:200px"
            :disabled="!isAdd"
          />
        </a-form-model-item>
        <!-- 昵称 -->
        <a-form-model-item ref="nickName" label=" 昵 称 " prop="nickName">
          <a-input
            :maxLength="20"
            v-model="form.nickName"
            @blur="
              () => {
                $refs.nickName.onFieldBlur();
              }
            "
            style="width:200px"
          />
        </a-form-model-item>
        <!-- 密码 -->
        <a-form-model-item
          ref="password"
          has-feedback
          label=" 密 码 "
          prop="password"
        >
          <a-input-password
            :maxLength="20"
            v-model="form.password"
            @blur="
              () => {
                $refs.password.onFieldBlur();
              }
            "
            style="width:200px"
          />
        </a-form-model-item>
        <!-- 确认密码 -->
        <a-form-model-item
          ref="rePassword"
          has-feedback
          label="确认密码"
          prop="rePassword"
        >
          <a-input-password
            :maxLength="20"
            v-model="form.rePassword"
            @blur="
              () => {
                $refs.rePassword.onFieldBlur();
              }
            "
            style="width:200px"
          />
        </a-form-model-item>
        <!-- 性别 -->
        <a-form-model-item ref="gender" label=" 性 别 " prop="gender">
          <a-select
            v-model="form.gender"
            @blur="
              () => {
                $refs.gender.onFieldBlur();
              }
            "
            style="width:200px"
          >
            <a-select-option :key="1" value="1">男</a-select-option>
            <a-select-option :key="0" value="0">女</a-select-option>
            <a-select-option :key="2" value="2" >保密</a-select-option>
            <!-- <a-select-option :key="2" value="2" v-if="!isAdd" >保密</a-select-option> -->
          </a-select>
        </a-form-model-item>
        <!-- 出生年月 -->
        <a-form-model-item ref="born" label="出生年月" prop="born">
          <a-date-picker
            dropdownClassName="bornDate"
            placeholder="选择出生日期"
            format="YYYY-MM-DD"
            v-model="form.born"
            :showToday="false"
            style="width:200px"
          >
            <svgIcon
              slot="suffixIcon"
              icon-class="riqi"
              :scale="0.8"
              style="margin-right:-1px"
            />
          </a-date-picker>
        </a-form-model-item>
        <!-- 个性签名 -->
        <a-form-model-item ref="signature" label="个性签名" prop="signature">
          <a-textarea
            :maxLength="100"
            v-model="form.signature"
            style="width:520px"
            :autoSize="{ minRows: 1, maxRows: 3 }"
          ></a-textarea>
        </a-form-model-item>
        <!-- 头像 -->
        <a-form-model-item
          ref="avatar"
          label="头像"
          prop="avatar"
          style="width:100%"
        >
          <uploadImg
            ref="uploadImg"
            @changeFormImage="changeFormImage"
            @resetFormImage="resetFormImage"
          />
        </a-form-model-item>
        <template v-if="!isAdd">
          <!-- 用户ID -->
          <a-form-model-item
            ref="userID"
            label="用户ID"
            prop="userID"
            style="width:100%"
          >
            <a-input v-model="form.userID" disabled style="width:200px" />
          </a-form-model-item>

          <!-- 认证状态 -->
          <a-form-model-item ref="authState" label="认证状态" prop="authState">
            <a-select v-model="form.authState" style="width:200px" disabled>
              <a-select-option key value="1">未认证</a-select-option>
              <a-select-option key value="2">认证中</a-select-option>
              <a-select-option key value="3">认证成功</a-select-option>
              <a-select-option key value="4">认证失败</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-button
            type="link"
            @click="showLog()"
            style="margin-top:10px"
            v-auth="['appUser_logList']"
            >查看登录信息</a-button
          >
        </template>

        <!-- 页脚按钮 -->
        <div class="modal-button-box">
          <a-form-model-item ref="authState" prop="authState">
            <!-- <Debounce :time="1000" isDebounce>
              <button
                class="ant-btn ant-btn-primary"
                @click="addAndEditAppUser"
                style="margin-right:30px"
              >确认</button>
            </Debounce>-->
            <a-button
              type="primary"
              :loading="confirmBtnLoading"
              @click="addAndEditAppUser()"
              style="margin-right:30px"
              >确认</a-button
            >

            <a-button @click="calcelAdd()" style="margin-top:10px"
              >取消</a-button
            >
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>

    <!-- 图片预览 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      wrapClassName="preview-appuser-modal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
    </a-modal>

    <!-- 查看登录记录对话框 -->
    <LogList ref="logList" v-if="form.userID" :userID="form.userID" />
    <AuthList ref="authList" :uid="authId" />
  </div>
</template>

<script>
import moment from "moment";
import LogList from "./children/LogList";
import AuthList from "./children/AuthList";
import { timestampToTime } from "@/Utils/util.js";
import { generalReg, passwordReg } from "@/Utils/reg.js";
import { permit } from "../../directives/authIf.js";

export default {
  components: { LogList, AuthList },
  data() {
    //表单验证---密码
    let validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空！"));
      } else {
        if (!passwordReg.test(value)) {
          callback(new Error("格式有误，字母数字符号组合"));
        } else if (this.form.rePassword !== null) {
          // console.log("ininin", this.form.rePassword);
          this.$refs.form.validateField("rePassword");
        }
        callback();
      }
    };
    //表单验证---确认密码
    let validateRePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请确认密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };
    //表单验证---手机号格式
    let validatePhoneFormat = (rule, value, callback) => {
      let reg = /^[1][356789][0-9]{9}$/;
      if (!value) {
        callback(new Error("请输入手机号！"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    //表单验证---昵称
    let validateNickName = (rule, value, callback) => {
      if (value) {
        if (!generalReg.test(value)) {
          callback(new Error("格式有误"));
        }
        callback();
      } else {
        callback();
      }
    };

    const columns = [
      {
        align: "center",
        title: "用户ID",
        dataIndex: "userID"
      },
      {
        align: "center",
        title: "电话",
        dataIndex: "tel"
      },
      {
        align: "center",
        title: "昵称",
        dataIndex: "nickName"
      },
      {
        align: "center",
        title: "认证状态",
        dataIndex: "authState",
        scopedSlots: { customRender: "authState" }
      },
      {
        align: "center",
        title: "头像",
        dataIndex: "avatar",
        scopedSlots: { customRender: "avatar" }
      },
      {
        align: "center",
        title: "最近登录时间",
        dataIndex: "latelyTime",
        sorter: true,
        scopedSlots: { customRender: "latelyTime" }
      },
      {
        align: "center",
        title: "创建时间",
        dataIndex: "createTime",
        scopedSlots: { customRender: "createTime" },
        sortOrder: "descend",
        sorter: true
        // sorter: (a, b) => moment(a.createTime) - moment(b.createTime)
      },
      {
        align: "center",
        title: "操作",
        scopedSlots: { customRender: "handle" }
      }
    ];

    return {
      data: [],
      columns,
      filter: {
        startTime: null,
        endTime: null,
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
        sortField: "create_time",
        sort: 1
      },
      pagination: {
        size: "middle",
        current: 1,
        showQuickJumper: true,
        total: 0,
        showSizeChanger: true,
        defaultPageSize: 10,
        pageSizeOptions: ["10", "25", "50"],
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条` // 显示总数
        // onChange: pageIndex => {
        //   // console.log(11111111)
        //   this.pagination.current = pageIndex;
        //   this.filter.pageIndex = pageIndex;
        //   this.getList();
        // },
        // onShowSizeChange: (pageIndex, pageSize) => {
        //   // console.log(2222222)
        //   // console.log(pageIndex, pageSize)
        //   this.pagination.current = 1;
        //   this.filter.pageIndex = 1;
        //   this.filter.pageSize = pageSize;
        //   this.getList();
        // }
      },
      //表单
      form: {
        uid: "",
        tel: null,
        nickName: null,
        password: null,
        rePassword: null,
        gender: null,
        signature: "",
        avatar: null,
        userID: null,
        authState: null,
        born: null
      },
      // defaultStartTime:moment().format("YYYY-MM-DD"),
      // defaultEndTime:"",
      //   表单验证规则
      rules: {
        tel: [
          {
            validator: validatePhoneFormat,
            trigger: ["change", "blur"],
            required: true
          }
        ],
        nickName: [
          {
            validator: validateNickName,
            trigger: "change"
          }
        ],
        password: [
          {
            validator: validatePassword,
            trigger: ["change", "blur"],
            required: true
          }
        ],
        rePassword: [
          {
            validator: validateRePassword,
            trigger: ["change", "blur"],
            required: true
          }
        ],
        gender: [
          {
            required: true,
            message: "请选择性别！",
            trigger: "blur"
          }
        ]
      },

      tableLoading: false, //表格加载状态
      visible: false, //新增编辑对话框显隐
      isAdd: true, //新增编辑对话框标题
      confirmBtnLoading: false, //确定按钮加载状态

      // imageUrl: "",
      isAvatarLoading: false,
      logListVisible: true, //登录记录对话框显隐
      authId: "", //授权应用的用户id

      //图片预览
      previewImage: "", //图片预览地址
      previewVisible: false, //图片预览modal显隐

      //认证状态码表
      authStateSheet: {
        0: "全部",
        1: {
          text: "未认证",
          color: "#d2d2d2"
        },
        2: {
          text: "认证中",
          color: "#62abf9"
        },
        3: {
          text: "认证成功",
          color: "#5bce81"
        },
        4: {
          text: "认证失败",
          color: "#ff7070"
        }
      }
    };
  },
  created() {
    this.filter.startTime = moment().subtract(1, "weeks");
    // .format("YYYY-MM-DD");
    this.filter.endTime = moment();
    // .format("YYYY-MM-DD");
    // console.log(this.filter.startTime)
    this.getList();
  },
  computed: {

    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    },
    returnAuthState() {
      return num => {
        return this.authStateSheet[num];
      };
    }
  },
  methods: {
    timestampToTime,
    permit,
    //禁选开始日期
    disabledStartDate(startValue) {
      const endValue = this.filter.endTime;
      if (!startValue || !endValue) {
        return startValue >= moment();
      }
      return startValue.valueOf() > endValue.valueOf();
    },

    //禁选结束日期
    disabledEndDate(endValue) {
      const startValue = this.filter.startTime;
      if (!endValue || !startValue) {
        return endValue >= moment();
      }
      return (
        startValue.valueOf() >= endValue.valueOf() ||
        endValue.valueOf() >= moment()
      );
    },

    //翻页，排序事件
    sortChange(pagination, filters, sorter) {
      // console.log(pagination, sorter);
      
      if (pagination.pageSize !== this.filter.pageSize) {
        //改变pageSize
        // console.log("change pageSize", pagination.pageSize);
        this.pagination.current = 1;
        this.filter.pageIndex = 1;
        this.filter.pageSize = pagination.pageSize;
        this.getList();
      } else if (pagination.current !== this.filter.pageIndex) { //翻页
        // console.log("change current");
        const { current } = pagination;
        this.pagination.current = current;
        this.filter.pageIndex = current;
        this.getList();
      } else if (
        pagination.pageSize === this.filter.pageSize &&
        pagination.current === this.filter.pageIndex
      ) {
        //排序功能
        //按照 latelyTime 排序
        if (sorter.field === "latelyTime") {
          this.filter.sortField = "lately_time";
          const { sortOrder } = this.columns[5];
          delete this.columns[6].sortOrder;
          if (sortOrder === "descend") {
            this.columns[5].sortOrder = "ascend";
            this.filter.sort = 0;
            this.getList();
          } else {
            this.columns[5].sortOrder = "descend";
            this.filter.sort = 1;
            this.getList();
          }
        } else if (sorter.field === "createTime") {
          //按照 createTime 排序
          this.filter.sortField = "create_time";
          const { sortOrder } = this.columns[6];
          delete this.columns[5].sortOrder;
          if (sortOrder === "descend") {
            this.columns[6].sortOrder = "ascend";
            this.filter.sort = 0;
            this.getList();
          } else {
            this.columns[6].sortOrder = "descend";
            this.filter.sort = 1;
            this.getList();
          }
        }
      }
    },

    //新增用户
    addAPPUser() {
      this.visible = true;
      this.isAdd = true;
      this.form = {
        // uid: "",
        tel: null,
        nickName: null,
        password: null,
        rePassword: null,
        gender: null,
        signature: "",
        avatar: null,
        // userID: null,
        // authState: null,
        born: null
      };
    },

    //搜索
    search() {
      this.pagination.current = 1;
      this.filter.pageIndex = 1;
      this.getList();
    },

    //获取用户授权列表
    AppUserAuth(id) {
      // console.log("id", id);
      this.authId = id + "";
      // console.log(this.authId);
      this.$refs.authList.authListVisible = false;
      this.$refs.authList.authListVisible = true;
      this.$nextTick(() => {
        this.$refs.authList.getAuthList();
      });
    },

    //删除用户
    deleteAppUser(id) {
      this.$confirm({
        title: "确认删除这条数据吗?",
        content: "",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          await this.deleteReq(id);
        }
      });
    },

    //传给 上传图片组件的方法
    changeFormImage(data) {
      this.form = { ...this.form, avatar: data };
      // this.$nextTick(() => {
      //   this.$refs.form.validateField("avatar");
      // });
    },
    resetFormImage() {
      this.form.avatar = null;
      // this.$refs.form.validateField("avatar");
    },

    //展示登录列表
    showLog(row) {
      // console.log("row", row);
      if (row) this.form = { ...this.form, userID: row.userID };
      // if (row) this.form = { ...this.form, uid: row.uid };
      // if(row) this.$refs.logList.uid=row.uid
      this.visible = false;
      this.$nextTick(() => {
        this.$refs.logList.logListVisible = true;
        this.$refs.logList.getList();
      });
    },

    //取消添加或修改
    calcelAdd() {
      this.visible = false;
    },

    //图片预览
    handlePreviewAvatar(url) {
      // this.visible=false
      this.previewVisible = true;
      this.previewImage = url;
    },
    //图片预览--取消
    handleCancel() {
      this.previewVisible = false;
    },

    //请求方法
    //获取实名认证列表
    async getList() {
      this.tableLoading = true;
      let { startTime, endTime } = this.filter;
      if (startTime) startTime = moment(startTime).format("YYYY-MM-DD");
      if (endTime) endTime = moment(endTime).format("YYYY-MM-DD");

      try {
        const res = await this.$api.MobileUser.getAPPUserList({
          ...this.filter,
          startTime,
          endTime
        });
        // console.log("res", res);
        if (res.code === "200") {
          this.data = res.data.list || res.data;
          this.pagination.total = res.data.total || res.total;
          // console.log(res);
        }
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
        this.$message.error("请求失败" + error);
      }
    },

    //添加或修改请求
    async APPUserCreateAndUpdateReq() {
      this.$message.loading({
        content: "正在" + (this.isAdd ? "新增" : "修改"),
        key: "add"
      });
      // this.$message.loading("正在" + (this.isAdd ? "新增" : "修改"));
      const data = { ...this.form };
      if (data.born) data.born = data.born.valueOf();
      try {
        let res = await this.$api.MobileUser.APPUserCreateAndUpdate(data);
        if (res.code === "200") {
          this.$message.success({
            content: (this.isAdd ? "新增" : "修改") + "成功！",
            key: "add"
          });
          this.getList();
          return true;
        } else {
          this.$message.error({
            content: (this.isAdd ? "新增" : "修改") + "失败！" + res.message,
            key: "add"
          });
          return false;
        }
      } catch (error) {
        this.$message.error({ content: "请求失败" + error, key: "add" });
      }
    },

    //确认添加或修改
    addAndEditAppUser() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false;
        this.confirmBtnLoading = true;
        const result = await this.APPUserCreateAndUpdateReq();
        this.visible = !result;
        setTimeout(() => {
          this.confirmBtnLoading = false;
        }, 500);
      });
    },

    //编辑用户
    async editAPPUser(row) {
      // console.log(row)
      this.visible = true;
      this.isAdd = false;
      this.form = {
        ...row,
        born: row.born ? moment(row.born) : null,
        rePassword: row.password
      };
      if (row.avatar) {
        await this.$nextTick();
        this.$refs.uploadImg.fileList = [
          {
            uid: row.uid,
            name: "头像",
            status: "done",
            url: this.picBaseUrl + row.avatar
          }
        ];
      }
    },

    //删除用户请求
    async deleteReq(id) {
      this.$message.loading({
        content: "正在删除",
        key: "delete"
      });
      try {
        let res = await this.$api.MobileUser.APPUserDelete({ uid: id });
        // console.log(res);
        if (res.code === "200") {
          this.$message.success({
            content: "删除成功！",
            key: "delete"
          });
          if (this.data.length === 1 && this.filter.pageIndex > 1) {
            this.pagination.current -= 1;
            this.filter.pageIndex -= 1;
          }
          this.getList();
        } else {
          this.$message.error({
            content: "删除失败！" + res.message,
            key: "delete"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "delete"
        });
      }
    }
  }
};
</script>

<style lang="less">
.APPUserManage {
  height: 100%;
  overflow-y: auto;
  padding: 15px;
  background-color: #fff;
  .filter {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    .filter-right > * {
      margin: 0 8px;
    }
    .add-button {
      background-color: #efb95c;
      border-color: #efb95c;
      color: #fff;
    }
    .delete-button {
      background-color: #f47171;
      border-color: #f47171;
      color: #fff;
    }
  }

  //表格
  .table {
    .handle-button .ant-btn-link {
      color: #b2b2b2;
      padding: 0;
      margin: 0 5px;
      // span{
      //   padding-left: 2px;
      // }
    }
    .every-row {
      &:hover {
        .ant-btn-link {
          color: #489ff8;
        }
      }
    }
    .even-row {
      background-color: #fafafa;
    }

    //表格中的banner图片样式
    .appUser-table-pic {
      height: 40px;
      cursor: pointer;
      &:hover {
        opacity: 0.5;
      }
    }
    .ant-table-tbody {
      .ant-table-row {
        td:nth-child(5) {
          padding: 0px;
        }
      }
    }
  }
}

//日期组件宽度
.filterAppUserDate {
  .ant-calendar {
    width: 250px;
  }
}
.bornDate {
  .ant-calendar {
    width: 250px;
  }
}

//新增编辑对话框
.add-appuser-add-modal {
  //   .ant-modal {
  // width: 500px !important;
  // width: 700px !important;
  //   }

  .ant-form-item {
    padding: 5px;
    .ant-form-item-label {
      width: 95px;
    }
  }
  //红字样式
  .ant-form-item-with-help {
    margin-bottom: 0;
  }
  //上传图片样式
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .modal-button-box {
    text-align: center;
    padding: 20px;
  }
}

.preview-appuser-modal {
  .ant-modal-body {
    padding: 40px;
  }
}
</style>