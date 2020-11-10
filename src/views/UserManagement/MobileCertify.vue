<template>
  <div class="name-auth">
    <div class="filter">
      <a-button
        class="add-button"
        type="primary"
        @click="addNameAuthEvent()"
        v-auth="['nameAuth_create']"
      >
        <svg-icon
          icon-class="add"
          :scale="0.8"
          style="margin-right:5px"
        ></svg-icon
        >添加认证
      </a-button>
      <div class="filter-right" v-auth="['nameAuth_list']">
        <!-- 开始日期 -->
        <a-date-picker
          style="width:140px"
          dropdownClassName="filterNameAuthData"
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
          dropdownClassName="filterNameAuthData"
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
        <a-select
          style="width: 120px"
          placeholder="认证状态"
          allowClear
          v-model="filter.authState"
        >
          <a-select-option key value>全部</a-select-option>
          <a-select-option key value="1">未认证</a-select-option>
          <a-select-option key value="2">认证中</a-select-option>
          <a-select-option key value="3">认证成功</a-select-option>
          <a-select-option key value="4">认证失败</a-select-option>
        </a-select>
        <!-- 搜索 -->

        <a-input
          v-model="filter.keyword"
          placeholder="请输入电话号码或身份证号"
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
        v-if="permit('nameAuth_list')"
        bordered
        :columns="columns"
        :loading="tableLoading"
        :data-source="data"
        :rowKey="row => row.id"
        :pagination="pagination"
        :rowClassName="
          (record, index) => {
            return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
          }
        "
        @change="sortChange"
      >
        <!-- CTIDTime时间 -->
        <span slot="CTIDTime" slot-scope="text">{{
          text | fliterTimestamp(0)
        }}</span>

        <!-- 照片 -->
        <template slot="image" slot-scope="text">
          <img
            class="nameAuth-table-pic"
            :src="picBaseUrl + text"
            alt="照片"
            @click="handlePreviewAvatar(picBaseUrl + text)"
          />
        </template>

        <!-- 认证状态 -->
        <template slot="authState" slot-scope="text">
          <span :style="{ color: returnAuthState(text).color }">{{
            returnAuthState(text).text
          }}</span>
        </template>

        <!-- 提交时间 -->
        <span slot="submitTime" slot-scope="text">{{
          text | fliterTimestamp(0)
        }}</span>

        <!-- 操作按钮 -->
        <div slot="handle" slot-scope="text, row" class="handle-button">
          <a-button
            type="link"
            @click="editNameAuth(row)"
            v-auth="['nameAuth_edit']"
          >
            <svg-icon
              :icon-class="
                row.authState === '1' || row.authState === '2'
                  ? 'shenhe'
                  : 'bianji'
              "
              :scale="0.8"
              style="margin-right:5px"
            ></svg-icon>
            {{
              row.authState === "1" || row.authState === "2" ? "审核" : "编辑"
            }}
          </a-button>
          <!-- <a-button type="link" @click="deleteNameAuth(row.id)">
            <svg-icon icon-class="shanchu" :scale="0.8" style="margin-right:5px"></svg-icon>删除
          </a-button>-->
        </div>
      </a-table>
      <a-table
        v-else
        class="no-promission"
        bordered
        :columns="columns"
        :data-source="[]"
        :locale="{ emptyText: '无权限，请联系管理员' }"
      />
    </div>

    <!-- 编辑对话框 -->
    <a-modal
      v-model="editVisible"
      title="认证审核"
      wrapClassName="nameAuth-edit-modal"
      :footer="null"
      :maskClosable="false"
      width="710px"
      :zIndex="900"
    >
      <a-form-model
        layout="inline"
        :model="form"
        :rules="rules"
        ref="form"
        disabled
      >
        <!-- 姓名 -->
        <a-form-model-item ref="name" label=" 姓 名 " prop="name">
          <a-input v-model="form.name" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 性别 -->
        <a-form-model-item ref="gender" label=" 性 别 " prop="gender">
          <!-- <a-input v-model="form.gender" style="width:200px" disabled /> -->
          <a-select disabled v-model="form.gender" style="width:200px">
            <a-select-option :key="1" value="1">男</a-select-option>
            <a-select-option :key="0" value="0">女</a-select-option>
            <a-select-option :key="0" value="2">未知</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 出生年月 -->
        <a-form-model-item ref="born" label=" 出生年月 " prop="born">
          <a-input v-model="form.born" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 年 龄 -->

        <a-form-model-item ref="age" label=" 年 龄 " prop="age">
          <a-input v-model="form.age" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 身份证号码 -->
        <a-form-model-item ref="IDNumber" label=" 身份证号码 " prop="IDNumber">
          <a-input v-model="form.IDNumber" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 身份证地址 -->
        <a-form-model-item ref="address" label="身份证地址" prop="address">
          <a-input v-model="form.address" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 认证编号 -->
        <a-form-model-item ref="authCode" label="认证编号" prop="authCode">
          <a-input v-model="form.authCode" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 电话 -->
        <a-form-model-item ref="tel" label="电 话" prop="tel">
          <a-input v-model="form.tel" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 用户ID -->
        <a-form-model-item ref="uid" label="用户ID " prop="uid">
          <a-input v-model="form.uid" style="width:200px" disabled />
        </a-form-model-item>
        <!-- 提交时间 -->
        <a-form-model-item ref="submitTime" label="提交时间 " prop="submitTime">
          <a-input v-model="form.submitTime" style="width:200px" disabled />
        </a-form-model-item>

        <!-- 图片 -->
        <ul class="image-list">
          <li>
            <template>
              <!-- <template v-if="isEdit"> -->
              <p>近期照片</p>
              <img
                class="add-modal-pic"
                :src="picBaseUrl + form.image"
                alt="近期照片"
                @click="handlePreviewAvatar(picBaseUrl + form.image)"
              />
            </template>
            <!-- <template v-else>
              <p>近期照片</p>
              <uploadImg
                ref="uploadImg"
                @changeFormImage="changeFormImage"
                @resetFormImage="resetFormImage"
              />
            </template> -->
          </li>
          <li>
            <template>
              <!-- <template v-if="isEdit"> -->
              <p>身份证正面</p>
              <img
                class="add-modal-pic"
                :src="picBaseUrl + form.IDCardFront"
                alt="身份证正面"
                @click="handlePreviewAvatar(picBaseUrl + form.IDCardFront)"
              />
            </template>
            <!-- <template v-else>
              <p>身份证正面</p>
              <uploadImg
                ref="uploadImgIDCardFront"
                @changeFormImage="changeFormIDCardFront"
                @resetFormImage="resetFormIDCardFront"
              />
            </template> -->
          </li>
          <li>
            <template>
              <!-- <template v-if="isEdit"> -->
              <p>身份证反面</p>
              <img
                class="add-modal-pic"
                :src="picBaseUrl + form.IDCardContrary"
                alt="身份证反面"
                @click="handlePreviewAvatar(picBaseUrl + form.IDCardContrary)"
              />
            </template>
            <!-- <template v-else>
              <p>身份证反面</p>
              <uploadImg
                ref="uploadImgIDCardContrary"
                @changeFormImage="changeFormIDCardContrary"
                @resetFormImage="resetFormIDCardContrary"
              />
            </template> -->
          </li>
        </ul>

        <div class="modal-button-box">
          <a-form-model-item>
            <a-button
              class="green-button orange-button"
              :loading="OCRLoading"
              @click="OCR()"
              style="margin-right:30px"
              >OCR提取</a-button
            >
            <a-button
              class="green-button"
              @click="CDITAuth()"
              style="margin-right:30px"
              >CTID实名认证检测</a-button
            >
            <a-button
              type="primary"
              @click="nopass()"
              style="margin-right:30px"
              v-auth="['nameAuth_edit']"
              >不通过</a-button
            >
            <a-button @click="cancelEdit()" style="margin-top:10px"
              >取消</a-button
            >
          </a-form-model-item>
        </div>
      </a-form-model>

      <!-- OCR信息-盒子 -->
      <div v-if="isOCR">
        <a-form-model
          layout="inline"
          :model="OCRform"
          :rules="null"
          ref="OCRform"
          :disabled="true"
        >
          <!-- 姓名 -->
          <a-form-model-item ref="name" label=" 姓 名 " prop="name">
            <a-input v-model="OCRform.name" />
          </a-form-model-item>
          <!-- 身份证号码 -->
          <a-form-model-item
            ref="IDNumber"
            label=" 身份证号码 "
            prop="IDNumber"
          >
            <a-input v-model="OCRform.IDNumber" :maxLength="18" />
          </a-form-model-item>
          <!-- 身份证地址 -->
          <a-form-model-item ref="address" label="身份证地址" prop="address">
            <a-input v-model="OCRform.address" />
          </a-form-model-item>
          <!-- 性别 -->
          <a-form-model-item ref="gender" label=" 性 别 " prop="gender">
            <a-input v-model="OCRform.gender" />
          </a-form-model-item>
          <!-- 民族 -->
          <a-form-model-item ref="nation" label=" 民 族 " prop="nation">
            <a-input v-model="OCRform.nation" />
          </a-form-model-item>
          <!-- 出生年月 -->
          <a-form-model-item ref="born" label="出生年月" prop="born">
            <a-input v-model="OCRform.born" />
          </a-form-model-item>
          <!-- 签发机关 -->
          <a-form-model-item ref="org" label="签发机关" prop="org">
            <a-input v-model="OCRform.org" />
          </a-form-model-item>
          <!-- 有效期限 -->
          <a-form-model-item
            ref="limitedPeriod"
            label="有效期限"
            prop="limitedPeriod"
          >
            <a-input v-model="OCRform.limitedPeriod" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>

    <!-- //CTID实名认证检测对话框 -->
    <a-modal
      v-model="CTIDModalVisible"
      title="CTID实名认证检测"
      wrapClassName="nameAuth-CDIT-modal"
      :footer="null"
      :maskClosable="false"
      width="420px"
    >
      <a-spin :spinning="verifying" tip="认证中...">
        <div class="nameAuth-CDIT-modal-content">
          <!-- <div>
            <span class="lebel">CDIT评分：</span>
            <span>{{CDITAuthResult.score||"--"}}</span>
          </div>-->
          <div>
            <span class="lebel">CDIT结果：</span>
            <span>{{ CDITAuthResult.score || "--" }}</span>
          </div>
          <div>
            <span class="lebel">审核结果：</span>
            <a-radio-group name="authState" v-model="CDITAuthResult.authResult">
              <a-radio value="3">通过</a-radio>
              <a-radio value="4">不通过</a-radio>
            </a-radio-group>
          </div>
          <div v-if="CDITAuthResult.authResult === '4'">
            <span class="lebel">不通过的原因：</span>
            <a-select
              style="width: 270px"
              placeholder="请选择不通过的原因"
              v-model="CDITAuthResult.reason"
            >
              <a-select-option key="1" value="1"
                >姓名或身份证号输入有误</a-select-option
              >
              <a-select-option key="2" value="2"
                >身份证照片不清晰或正反面照片缺失</a-select-option
              >
              <a-select-option key="3" value="3"
                >照片需是大头贴或与身份证照片不符</a-select-option
              >
              <!-- <a-select-option key :value="4">身份证照片不达标，需包含四角且清晰</a-select-option> -->
            </a-select>
          </div>
          <div class="modal-button-box">
            <a-button
              :disabled="!CDITAuthResult.authResult"
              :loading="comfirmEditLoading"
              type="primary"
              @click="comfirmEdit()"
              style="margin-right:30px"
              >确定</a-button
            >
            <a-button @click="cancelCTIDEdit()" style="margin-top:10px"
              >取消</a-button
            >
          </div>
        </div>
      </a-spin>
    </a-modal>

    <!-- 不通过原因 对话框 -->
    <a-modal
      v-model="nopassModalVisible"
      title="不通过的原因"
      wrapClassName="nameAuth-nopass-modal"
      :footer="null"
      :maskClosable="false"
      width="330px"
    >
      <div>
        <a-select
          style="width: 280px"
          placeholder="请选择不通过的原因"
          v-model="nopassResult.reason"
        >
          <a-select-option key="1" value="1"
            >姓名或身份证号输入有误</a-select-option
          >
          <a-select-option key="2" value="2"
            >身份证照片不清晰或正反面照片缺失</a-select-option
          >
          <a-select-option key="3" value="3"
            >照片需是大头贴或与身份证照片不符</a-select-option
          >
        </a-select>
      </div>
      <div class="modal-button-box">
        <a-button
          :loading="confirmNoPassLoading"
          type="primary"
          @click="comfirmNopass()"
          style="margin-right:30px"
          >确定</a-button
        >
        <a-button @click="cancelNopass()" style="margin-top:10px"
          >取消</a-button
        >
      </div>
    </a-modal>

    <!-- 图片预览 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      wrapClassName="preview-nameauth-modal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
    </a-modal>

    <AddNameAuth ref="addNameAuth" :uid="uid" @getList="getList" />
  </div>
</template>

<script>
import moment from "moment";
import AddNameAuth from "./children/AddNameAuth";
import { permit } from "../../directives/authIf.js";

export default {
  components: { AddNameAuth },
  data() {
    const columns = [
      {
        align: "center",
        title: "照片",
        dataIndex: "image",
        scopedSlots: { customRender: "image" }
      },
      {
        align: "center",
        title: "姓名",
        dataIndex: "name"
      },
      {
        align: "center",
        title: "身份证号",
        dataIndex: "IDNumber"
      },
      {
        align: "center",
        title: "用户ID",
        dataIndex: "userID"
      },
      {
        align: "center",
        title: "CTID检测时间",
        dataIndex: "CTIDTime",
        scopedSlots: { customRender: "CTIDTime" },
        sorter: true
        // sorter: (a, b) => moment(a.CTIDTime) - moment(b.CTIDTime)
      },
      {
        align: "center",
        title: "认证状态",
        dataIndex: "authState",
        scopedSlots: { customRender: "authState" }
      },
      {
        align: "center",
        title: "提交时间",
        dataIndex: "submitTime",
        scopedSlots: { customRender: "submitTime" },
        // sorter: (a, b) => moment(a.submitTime) - moment(b.submitTime)
        sortOrder: "descend",
        sorter: true
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
        authState: undefined,
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
        sortField: "apply_time",
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
        //   this.pagination.current = pageIndex;
        //   this.filter.pageIndex = pageIndex;
        //   this.getList();
        // },
        // onShowSizeChange: (pageIndex, pageSize) => {
        //   // console.log(pageIndex, pageSize)
        //   this.pagination.current = 1;
        //   this.filter.pageIndex = 1;
        //   this.filter.pageSize = pageSize;
        //   this.getList();
        // }
      },
      form: {
        uid: "",
        name: "",
        gender: 1,
        age: 0,
        IDNumber: "",
        address: "",
        authCode: "",
        tel: "",
        userID: "",
        submitTime: ""
      },
      OCRform: {
        name: null,
        IDNumber: null,
        address: null,
        gender: null,
        nation: null,
        born: null,
        org: null,
        limitedPeriod: null
      },
      rules: {},
      editVisible: false, //编辑对话框显隐
      editData: {},
      imageUrl: "",
      isAvatarLoading: false,
      authId: "", //授权应用的用户id,
      uid: "",
      isOCR: false, // 是否ocr
      tableLoading: false, //表格加载状态
      editId: "", //审核的实名认证id
      CTIDModalVisible: false, //CTID对话框显隐
      verifying: false,
      CDITAuthResult: {
        reason: "1"
      }, //CDIT验证结果
      comfirmEditLoading: false,

      OCRLoading: false,

      nopassModalVisible: false, //不通过对话框显隐
      confirmNoPassLoading: false,
      nopassResult: {
        id: "",
        authResult: "4",
        // authState: "4",
        reason: "1"
      },
      isEdit: false, //编辑中 true，审核中false
      updateData: {
        //想要更新的数据
        id: null,
        image: null
      },

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
  created() {
    this.filter.startTime = moment().subtract(7, "days");
    // .format("YYYY-MM-DD");
    this.filter.endTime = moment();
    // .format("YYYY-MM-DD");
    this.getList();
  },
  methods: {
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

    //新增用户
    addNameAuthEvent() {
      this.$refs.addNameAuth.openThisModal();
    },

    //翻页，排序事件
    sortChange(pagination, filters, sorter) {
      // console.log(sorter);
      //翻页
      if (pagination.pageSize !== this.filter.pageSize) {
        //改变每页显示条数
        this.pagination.current = 1;
        this.filter.pageIndex = 1;
        this.filter.pageSize = pagination.pageSize;
        this.getList();
      } else if (pagination.current !== this.filter.pageIndex) {
        const { current } = pagination;
        this.pagination.current = current;
        this.filter.pageIndex = current;
        this.getList();
      } else if (
        pagination.pageSize === this.filter.pageSize &&
        pagination.current === this.filter.pageIndex
      ) {
        //排序功能
        //按照 CTIDTime 排序
        if (sorter.field === "CTIDTime") {
          this.filter.sortField = "ctid_time";
          const { sortOrder } = this.columns[4];
          delete this.columns[6].sortOrder;
          if (sortOrder === "descend") {
            this.columns[4].sortOrder = "ascend";
            this.filter.sort = 0;
            this.getList();
          } else {
            this.columns[4].sortOrder = "descend";
            this.filter.sort = 1;
            this.getList();
          }
        } else if (sorter.field === "submitTime") {
          //按照 CTIDTime 排序
          this.filter.sortField = "apply_time";
          const { sortOrder } = this.columns[6];
          delete this.columns[4].sortOrder;
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

    //搜索
    search() {
      this.pagination.current = 1;
      this.filter.pageIndex = 1;
      this.getList();
    },

    //不通过
    nopass() {
      this.nopassModalVisible = true;
      this.editVisible = false;
    },

    //取消审核
    cancelEdit() {
      this.editVisible = false;
    },

    //CTID 对话框 取消
    cancelCTIDEdit() {
      this.CTIDModalVisible = false;
      this.editVisible = true;
    },

    //不通过对话框 取消
    cancelNopass() {
      this.nopassModalVisible = false;
      this.editVisible = true;
    },

    //传给 上传图片组件的方法
    //近期照片
    changeFormImage(data) {
      this.form = { ...this.form, image: data };
    },
    resetFormImage() {
      this.form.image = null;
    },
    changeFormIDCardFront(data) {
      this.form = { ...this.form, IDCardFront: data };
    },
    resetFormIDCardFront() {
      this.form.IDCardFront = null;
    },
    changeFormIDCardContrary(data) {
      this.form = { ...this.form, IDCardContrary: data };
    },
    resetFormIDCardContrary() {
      this.form.IDCardContrary = null;
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

    //编辑审核时，CDIT弹框的确定按钮的禁用
    isDisabled() {},

    //审核用户
    async editNameAuth(row) {
      // console.log("row", row);
      this.form = { ...row };
      this.editVisible = true;
      this.isOCR = false;
      this.OCRform = {};
      this.editId = row.id;
      if (row.authState === "1" || row.authState === "2") {
        this.isEdit = true;
      } else if (row.authState === "3" || row.authState === "4") {
        this.isEdit = false;
        await this.$nextTick();
        // this.$refs.uploadImg.fileList = [
        //   {
        //     uid: row.uid,
        //     name: row.name,
        //     status: "done",
        //     url: this.picBaseUrl + row.image
        //   }
        // ];
        // this.$refs.uploadImgIDCardFront.fileList = [
        //   {
        //     uid: row.uid,
        //     name: row.name,
        //     status: "done",
        //     url: this.picBaseUrl + row.IDCardFront
        //   }
        // ];
        // this.$refs.uploadImgIDCardContrary.fileList = [
        //   {
        //     uid: row.uid,
        //     name: row.name,
        //     status: "done",
        //     url: this.picBaseUrl + row.IDCardContrary
        //   }
        // ];
      }
    },

    //CTID 对话框 确认按钮
    async comfirmEdit() {
      // console.log("this.CDITAuthResult",this.CDITAuthResult)
      // if(!this.CDITAuthResult.authState) return
      this.editVisible = false;
      this.comfirmEditLoading = true;
      const result = await this.comfirmEditReq();
      this.CTIDModalVisible = !result;
      setTimeout(() => {
        this.comfirmEditLoading = false;
      }, 500);
    },

    // OCR提取
    OCR() {
      this.OCRReq();
    },

    //CTID实名认证检测
    async CDITAuth() {
      this.editVisible = false;
      this.CTIDModalVisible = true;
      this.verifying = true;
      await this.CDITAuthReq();
      this.verifying = false;
    },

    /*  -------------请求方法------------------------- */
    //获取实名认证列表
    async getList() {
      this.tableLoading = true;
      let { startTime, endTime } = this.filter;
      if (startTime) startTime = moment(startTime).format("YYYY-MM-DD");
      if (endTime) endTime = moment(endTime).format("YYYY-MM-DD");
      try {
        const res = await this.$api.MobileCertify.getNameAuthList({
          ...this.filter,
          startTime,
          endTime
        });
        // console.log("res", res);
        if (res.code === "200") {
          this.data = res.data;
          this.pagination.total = res.total;
          // this.data = res.data.list;
          // this.pagination.total = res.data.total;
          // console.log(res);
        } else {
          this.$message.error("获取失败!" + res.message);
        }
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
        this.$message.error("请求失败" + error);
      }
    },

    //不通过对话框 确认
    async comfirmNopass() {
      this.confirmNoPassLoading = true;
      this.$message.loading({
        content: "正在审核",
        key: "audit"
      });
      try {
        let res = await this.$api.MobileCertify.updateNameAuth({
          ...this.nopassResult,
          id: this.editId
        });
        setTimeout(() => {
          this.confirmNoPassLoading = false;
        }, 500);
        if (res.code === "200") {
          this.nopassModalVisible = false;
          this.getList();
          this.$message.success({
            content: "审核成功",
            key: "audit"
          });
          // return true;
        } else {
          this.$message.error({
            content: "审核失败!" + res.message,
            key: "audit"
          });
          // return false;
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败!" + error,
          key: "audit"
        });
      }
    },

    // 请求
    //CTID 对话框 确认请求
    async comfirmEditReq() {
      this.$message.loading({
        content: "正在审核",
        key: "audit"
      });
      const { authResult, reason } = this.CDITAuthResult;
      try {
        let res = await this.$api.MobileCertify.updateNameAuth({
          authResult,
          reason,
          id: this.editId
        });
        // console.log(res);
        if (res.code === "200") {
          this.getList();
          this.$message.success({
            content: "审核成功",
            key: "audit"
          });
          return true;
        } else {
          this.$message.error({
            content: "审核失败!" + res.message,
            key: "audit"
          });
          return false;
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败!" + error,
          key: "audit"
        });
      }
    },

    //CTID实名认证检测 请求
    async CDITAuthReq() {
      // this.$message.loading({
      //   content: "验证中",
      //   key: "verify"
      // });
      // this.CDITAuthResult = {};
      try {
        let res = await this.$api.MobileCertify.CTIDNameAuth(this.form);
        // console.log("res", res);
        if (res.code === "200") {
          // this.$message.success({
          //   content: "验证成功",
          //   key: "verify"
          // });
          res.data.reason = "1";
          this.CDITAuthResult = { ...res.data };
          return true;
        } else {
          // this.$message.error({
          //   content: "验证失败!" + res.message,
          //   key: "verify"
          // });
          return true;
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败!" + error,
          key: "verify"
        });
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
        this.isOCR = true;
        if (res.code === "200") {
          // const { gender } = res.data;
          // res.data.gender = gender === "男" ? "1" : gender === "女" ? "0" : "2";
          this.OCRform = res.data;
          this.$message.success({
            content: "OCR提取成功",
            key: "OCR"
          });
        } else {
          this.$message.error({
            content: "OCR提取失败！",
            key: "OCR"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "OCR"
        });
      } finally {
        this.OCRLoading = false;
      }
    }
  }
};
</script>

<style lang="less">
.name-auth {
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
      // margin: 0 5px;
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
    .nameAuth-table-pic {
      height: 40px;
      cursor: pointer;
      &:hover {
        opacity: 0.5;
      }
    }
    .ant-table-tbody {
      .ant-table-row {
        td:nth-child(1) {
          padding: 0px;
        }
      }
    }
  }
}

.filterNameAuthData {
  .ant-calendar {
    width: 250px;
  }
}

//编辑对话框
.nameAuth-edit-modal {
  .ant-form-item {
    padding: 5px;
    .ant-form-item-label {
      width: 105px;
    }
  }

  .image-list {
    margin: 0;
    padding: 20px 0;
    list-style: none;
    display: flex;
    justify-content: space-around;
    li {
      width: 180px;
      height: 150px;
      // background-color: chartreuse;
      text-align: center;
      p {
        margin: 0;
        padding: 10px 0;
      }
      img {
        width: 170px;
        height: 110px;
        // border: 1px solid sienna;
        cursor: pointer;
        &:hover {
          opacity: 0.5;
        }
      }

      .ant-upload-picture-card-wrapper {
        // width: auto;
        text-align: left;
        .ant-upload.ant-upload-select-picture-card {
          width: 100%;
        }
      }
      .ant-upload-list-picture-card .ant-upload-list-item {
        width: 170px;
        height: 110px;
        padding: 0px;
        border-width: 0px;
      }
    }
  }

  .modal-button-box {
    text-align: center;
    padding: 10px;

    .green-button {
      background-color: #54ba75;
      border-color: #54ba75;
      color: #fff;
    }
    .orange-button {
      background-color: #efb95c;
      border-color: #efb95c;
      color: #fff;
    }
  }

  .ant-input-disabled {
    background-color: #fafafa;
    color: #999;
  }
}

.nameAuth-CDIT-modal {
  .nameAuth-CDIT-modal-content {
    & > div {
      padding: 5px 0;
    }
    .lebel {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }
  .modal-button-box {
    text-align: center;
    padding: 10px;
  }
}

.nameAuth-nopass-modal {
  .modal-button-box {
    text-align: center;
    padding: 10px;
  }
}

.preview-nameauth-modal {
  .ant-modal-body {
    padding: 40px;
  }
}
</style>