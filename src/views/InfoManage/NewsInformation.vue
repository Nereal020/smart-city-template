 <!-- 新闻资讯 -->
<template>
  <div id="news">
    <div class="top">
      <div class="topLift">
        <a-button
          type="primary"
          class="add"
          v-auth="['NewsInformation_add']"
          @click="showModal()"
          style="margin-right:10px;"
        >
          <svg-icon
            icon-class="add"
            :scale="0.8"
            style="margin-right:5px;"
          ></svg-icon
          >添加新闻
        </a-button>
        <a-button
          type="danger"
          class="danger"
          v-auth="['NewsInformation_delete']"
          @click="showDeleteConfirmBatch()"
        >
          <svg-icon
            icon-class="shanchu"
            :scale="0.8"
            style="margin-right:5px;"
          ></svg-icon
          >批量删除
        </a-button>
      </div>

      <!-- 搜索功能 -->
      <div class="topRight" v-auth="['NewsInformation_list']">
        <!-- 开始日期 -->
        <a-date-picker
          style="width:140px"
          dropdownClassName="authData"
          v-model="search.startDate"
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
          />
        </a-date-picker>
        <span style="margin:0 14px;">至</span>
        <!-- 结束日期 -->
        <a-date-picker
          style="width:140px"
          dropdownClassName="authData"
          v-model="search.endDate"
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

        <!-- 接收端 -->
        <a-select
          style="width: 120px;margin-left:14px;"
          placeholder="接收端"
          allowClear
          v-model="search.receive"
          @change="changeReceive"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option value="0">移动端(APP)</a-select-option>
          <a-select-option value="1">门户端(WEB)</a-select-option>
        </a-select>

        <!-- 新闻分类 -->
        <a-select
          style="width: 120px;margin-left:14px;"
          placeholder="新闻分类"
          allowClear
          v-model="search.classify"
          @change="changeClassify"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option
            :value="item.codeTableValue"
            v-for="item of classifySelectOption"
            :key="item.codeTableKey"
            >{{ item.codeTableKey }}</a-select-option
          >
        </a-select>

        <!-- 来源方式 -->
        <a-select
          style="width: 120px;margin-left:14px;"
          placeholder="来源方式"
          allowClear
          v-model="search.source"
          @change="changeSource"
          :disabled="sourceDisabled"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option value="0">本地编辑</a-select-option>
          <a-select-option value="1">URL接入</a-select-option>
        </a-select>

        <!-- 搜索 -->
        <a-input
          v-model="search.keyword"
          placeholder="请输入搜索内容"
          style="width:180px;margin-left:14px;margin-right:14px;"
        >
          <svg-icon slot="prefix" icon-class="sousuo" :scale="0.8"></svg-icon>
        </a-input>

        <a-button type="primary" @click="searchList">搜索</a-button>
      </div>
    </div>

    <div class="list">
      <a-table
        v-if="permit('NewsInformation_list')"
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="dataList"
        :rowKey="row => row.newsId"
        bordered
        :pagination="pagination"
        :loading="loading"
        @change="sortChange"
      >
        <!-- receive   source -->
        <span slot="image" slot-scope="text, record">
          <img
            :src="picBaseUrl + item"
            alt
            v-for="(item, index) in record.image"
            :key="index"
            @click="handlePreview2(item)"
          />
        </span>
        <span slot="receive" slot-scope="text">{{
          text == "0" ? "移动端（APP）" : text == "1" ? "门户端（WEB）" : "--"
        }}</span>
        <span slot="classify" slot-scope="text">{{
          changeClassifySelect(text)
        }}</span>
        <span slot="source" slot-scope="text, record">{{
          record.receive == "1"
            ? ""
            : record.source == "0"
            ? "本地编辑"
            : record.source == "1"
            ? "URL接入"
            : "--"
        }}</span>
        <span slot="createTime" slot-scope="text">{{
          text | fliterTimestamp(0)
        }}</span>
        <span slot="operation" slot-scope="text, record" class="handle-button">
          <a-button
            type="link"
            v-if="permit('NewsInformation_delete')"
            @click="showDeleteConfirm(record)"
          >
            <svg-icon icon-class="shanchu" :scale="0.8"></svg-icon>删除
          </a-button>
          <span v-else>--</span>
        </span>
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

    <!-- 添加/编辑modal -->
    <a-modal
      class="newsModal"
      v-model="visible"
      title="添加新闻"
      :destroyOnClose="true"
      :maskClosable="false"
      :footer="null"
      width="800px"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <!-- 接收端 -->
        <a-form-model-item label="接收端" prop="receive">
          <a-radio-group v-model="form.receive">
            <a-radio value="0">移动端（APP）</a-radio>
            <a-radio value="1">门户端（WEB）</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <!-- 来源方式 -->
        <a-form-model-item
          label="来源方式"
          prop="source"
          v-if="form.receive === '0'"
          :key="1"
        >
          <a-radio-group v-model="form.source">
            <a-radio value="0">本地编辑</a-radio>
            <a-radio value="1">URL接入</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <!-- 新闻分类 -->
        <a-form-model-item label="新闻分类" prop="classify">
          <a-select
            v-model="form.classify"
            allowClear
            placeholder="请选择新闻分类"
          >
            <a-select-option
              :value="item.codeTableValue"
              v-for="item of classifySelectOption"
              :key="item.codeTableKey"
              >{{ item.codeTableKey }}</a-select-option
            >
          </a-select>
        </a-form-model-item>

        <!-- 新闻标题 -->
        <a-form-model-item ref="title" label="新闻标题" prop="title">
          <a-input
            v-model="form.title"
            placeholder="请输入新闻标题 , 不超过20个字符"
            :maxLength="20"
            @blur="
              () => {
                $refs.title.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <!-- 新闻图片 -->
        <a-form-model-item label="新闻缩略图" prop="image">
          <div class="clearfix">
            <a-upload
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
              :before-upload="beforeUploadImage"
            >
              <div v-if="fileList.length < 3">
                <a-icon type="plus" />
                <div class="ant-upload-text">添加图片</div>
              </div>
            </a-upload>
            <a-modal
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
              wrapClassName="previewImgModal"
            >
              <img alt="pic" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-model-item>

        <!-- 来源机构 -->
        <a-form-model-item
          label="来源机构"
          prop="organization"
          v-if="form.receive === '0' && form.source === '1'"
          :key="2"
        >
          <a-select
            v-model="form.organization"
            allowClear
            placeholder="请选择来源机构"
          >
            <a-select-option
              :value="item.codeTableValue"
              v-for="item of organizationSelectOption"
              :key="item.codeTableKey"
              >{{ item.codeTableKey }}</a-select-option
            >
          </a-select>
        </a-form-model-item>

        <!-- 新闻URL -->
        <a-form-model-item
          ref="url"
          label="新闻URL"
          prop="url"
          v-if="form.receive === '0' && form.source === '1'"
          :key="3"
        >
          <a-input v-model="form.url" placeholder="请输入新闻的URL链接" />
        </a-form-model-item>

        <!-- 新闻摘要 -->
        <a-form-model-item
          label="摘要"
          ref="abstract"
          prop="abstract"
          v-if="form.receive === '1'"
          :key="4"
        >
          <a-input
            v-model="form.abstract"
            :maxLength="20"
            placeholder="请填写新闻摘要 , 不超过20个字符"
            type="textarea"
            style="height:60px;"
            @blur="
              () => {
                $refs.abstract.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <!-- 新闻内容 -->
        <a-form-model-item
          label="内容"
          prop="content"
          v-if="
            (form.receive === '0' && form.source === '0') ||
              form.receive === '1'
          "
          :key="5"
        >
          <Editor
            @change="editorChange"
            v-model="form.content"
            style="height:300px"
          />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :disabled="btnDisabled" @click="onSubmit()">
            <a-icon type="loading" v-if="confirmLoading" />
            添加新闻
          </a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 列表图片预览 -->
    <a-modal
      :visible="previewVisible2"
      :footer="null"
      @cancel="handleCancel2"
      wrapClassName="previewImgModal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage2" />
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import Editor from "../../components/Editor";
import { permit } from "../../directives/authIf.js";

export default {
  components: {
    Editor
  },
  data() {
    /* 标题正则规则 */
    const validateTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入新闻标题 , 不超过20个字符"));
      } else {
        const pwdRegex = /^[a-zA-Z0-9\_\@\+\-\?\/\\\,\.\，\。\、\：\:\;\；\"\'\“\”\？\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(
            new Error(
              "格式有误，请输入中文、英文、数字、常用符号，不允许特殊符号"
            )
          );
        }
        callback();
      }
    };
    /* 新闻摘要规则 */
    const validateAbstract = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写新闻摘要 , 不超过20个字符"));
      } else {
        const pwdRegex = /^[a-zA-Z0-9\_\@\+\-\?\/\\\,\.\，\。\、\：\:\;\；\"\'\“\”\？\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(
            new Error(
              "格式有误，请输入中文、英文、数字、常用符号，不允许特殊符号"
            )
          );
        }
        callback();
      }
    };

    return {
      sourceDisabled: false, //搜索来源方式 选择门户端时下拉框的禁用
      loading: true, //列表加载
      confirmLoading: false, //提交按钮
      btnDisabled: false, //提交按钮禁用

      classifySelectOption: [], //新闻分类下拉框
      organizationSelectOption: [], //来源机构下拉框

      search: {
        //搜索
        startDate: "", //开始时间
        endDate: "", //结束时间
        receive: undefined, //接收端选择
        classify: undefined, //新闻分类选择
        source: undefined, //来源方式选择
        keyword: "", //输入框内容
        pageIndex: 1, //当前页
        pageSize: 10, //每页条数
        sort: 1
      },

      // 图片预览
      previewVisible2: false, //是否展示modal框
      previewImage2: "", //预览图片地址

      visible: false, //modal状态
      // modalTitle: {}, //更改modal添加和编辑不同状态

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        //表单数据
        newsId: "", //新闻id
        receive: "0", //接收端
        source: "0", //来源方式
        classify: undefined, //新闻分类
        title: "", //新闻标题
        image: [], //新闻图片
        organization: undefined, //来源机构
        url: "", //新闻URL
        abstract: "", //新闻摘要
        content: "" //新闻内容
      },

      //图片上传
      previewVisible: false,
      previewImage: "",
      fileList: [],

      rules: {
        receive: [
          //接收端
          { required: true, message: "请选择接收端", trigger: "change" }
        ],
        source: [
          //来源方式
          { required: true, message: "请选择来源方式", trigger: "change" }
        ],
        classify: [
          //新闻分类
          { required: true, message: "请选择新闻分类", trigger: "change" }
        ],
        title: [
          //新闻标题
          { validator: validateTitle, required: true, trigger: "blur" }
        ],
        organization: [
          //来源机构
          { required: true, message: "请选择来源机构", trigger: "change" }
        ],
        url: [
          //新闻url
          { required: true, message: "请填写新闻URL", trigger: "blur" }
        ],
        abstract: [
          //新闻摘要
          { validator: validateAbstract, required: true, trigger: "blur" }
        ],
        content: [
          //新闻内容
          { required: true, message: "请填写新闻内容" }
        ]
      },

      id: [], //被删除id数组(单个删除)
      ids: [], //被删除id数组(批量删除)
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          key: "title",
          align: "center",
          width: "24%"
        },
        {
          title: "缩略图",
          dataIndex: "image",
          key: "image",
          align: "center",
          width: "16%",
          scopedSlots: { customRender: "image" }
        },
        {
          title: "接收端",
          dataIndex: "receive",
          key: "receive",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "receive" }
        },
        {
          title: "新闻分类",
          dataIndex: "classify",
          key: "classify",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "classify" }
        },
        {
          title: "来源方式",
          dataIndex: "source",
          key: "source",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "source" }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "createTime" },
          sortOrder: "descend",
          sorter: true
          // sorter: (a, b) => moment(a.createTime) - moment(b.createTime)
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "operation" }
        }
      ], //列表结构
      dataList: [], //列表数据

      hasDeleteArr: [], //被删除数据的id

      //分页器
      pagination: {
        size: "middle",
        current: 1,
        showQuickJumper: true,
        total: 0,
        showSizeChanger: true,
        defaultPageSize: 10,
        pageSizeOptions: ["10", "25", "50"],
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`
      }
    };
  },

  created() {
    this.search.startDate = moment().subtract("weeks", 1);
    this.search.endDate = moment();
    this.getList();
    this.classifySelect(); //获取新闻分类
    this.organizationSelect(); //获取来源机构
  },

  computed: {
    //获取图片基础地址
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    },

    //选择框
    rowSelection() {
      return {
        selectedRowKeys: this.ids,
        onChange: (selectedRowKeys, selectedRows) => {
          this.ids = [
            ...new Set(
              [...selectedRowKeys].filter(
                item => this.hasDeleteArr.indexOf(item) === -1
              )
            )
          ];
        }
      };
    }
  },

  methods: {
    permit,
    moment,

    //翻页，排序事件
    sortChange(pagination, filters, sorter) {
      if (pagination.pageSize !== this.search.pageSize) {
        this.pagination.current = 1;
        this.search.pageIndex = 1;
        this.search.pageSize = pagination.pageSize;
        this.getList();
      } else if (pagination.current !== this.search.pageIndex) {
        const { current } = pagination;
        this.pagination.current = current;
        this.search.pageIndex = current;
        this.getList();
      } else if (
        pagination.pageSize === this.search.pageSize &&
        pagination.current === this.search.pageIndex
      ) {
        const { sortOrder } = this.columns[5];
        if (sortOrder === "ascend") {
          this.columns[5].sortOrder = "descend";
          this.search.sort = 1;
          this.getList();
        } else {
          this.columns[5].sortOrder = "ascend";
          this.search.sort = 0;
          this.getList();
        }
      }
    },

    //获取新闻分类下拉框
    classifySelect() {
      this.$store.dispatch("queryCodeTable", "NEWS_CLASSIFY").then(res => {
        this.classifySelectOption = res;
      });
    },
    //转换新闻分类
    changeClassifySelect(e) {
      let classifyName;
      for (let i = 0; i < this.classifySelectOption.length; i++) {
        if (e === this.classifySelectOption[i].codeTableValue) {
          classifyName = this.classifySelectOption[i].codeTableKey;
        }
      }
      return classifyName;
    },

    //获取来源机构
    organizationSelect() {
      this.$store.dispatch("queryCodeTable", "NEWS_SOURCE_ORG").then(res => {
        this.organizationSelectOption = res;
      });
    },

    //选择日期
    //禁选开始日期
    disabledStartDate(startValue) {
      const endValue = this.search.endDate;
      if (!startValue || !endValue) {
        return startValue >= moment();
      }
      return startValue.valueOf() > endValue.valueOf();
    },

    //禁选结束日期
    disabledEndDate(endValue) {
      const startValue = this.search.startDate;
      if (!endValue || !startValue) {
        return endValue >= moment();
      }
      return (
        startValue.valueOf() >= endValue.valueOf() ||
        endValue.valueOf() >= moment()
      );
    },
    //接收端选择
    changeReceive(value) {
      if (value === "1") {
        this.search.source = undefined;
        this.sourceDisabled = true;
      } else {
        this.sourceDisabled = false;
      }
    },
    //新闻分类选择
    changeClassify(value) {
      console.log(`selected ${value}`);
    },
    //来源方式选择
    changeSource(value) {
      console.log(`selected ${value}`);
    },

    //点击单个删除
    showDeleteConfirm(e) {
      this.id.push(e.newsId);
      console.log(e, this.id);

      this.$confirm({
        title: "你确定要删除这条数据吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          console.log(this);
          try {
            const res = await this.$api.NewsInformation.deleteNews({
              ids: this.id
            });
            this.$message.loading({
              content: "正在删除中...",
              key: "updatable"
            });
            if (res.code === "200") {
              setTimeout(() => {
                this.$message.success({
                  content: "删除成功！",
                  key: "updatable",
                  duration: 2
                });
              }, 500);

              this.hasDeleteArr = this.hasDeleteArr.concat(this.id);

              if (
                this.dataList.length === this.id.length &&
                this.search.pageIndex > 1
              ) {
                this.search.pageIndex--;
                this.pagination.current--;
              }
              this.getList();
              //勾选后 但单个删除导致的勾选项个数问题解决
              this.ids = [
                ...new Set(
                  [...this.ids].filter(item => this.id.indexOf(item) === -1)
                )
              ];
              this.id = []; //清空id数组
            } else {
              setTimeout(() => {
                this.$message.error({
                  content: "删除失败！",
                  key: "updatable",
                  duration: 2
                });
              }, 1000);
            }
          } catch (error) {
            this.$message.error("请求失败！" + error);
          }
        },
        onCancel: () => {
          this.id = []; //清空id数组
        }
      });
    },

    //点击批量删除
    showDeleteConfirmBatch() {
      const { ids } = this;
      if (!this.ids.length) {
        this.$message.warning("请选择要删除的项！");
      } else {
        this.$confirm({
          title: `确认删除选中的${ids.length}条数据吗?`,
          content: "",
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          onOk: async() => {
            try {
              const res = await this.$api.NewsInformation.deleteNews({
                ids: this.ids
              });
              this.$message.loading({
                content: "正在删除中...",
                key: "updatable"
              });
              if (res.code === "200") {
                setTimeout(() => {
                  this.$message.success({
                    content: "删除成功！",
                    key: "updatable",
                    duration: 2
                  });
                }, 500);

                this.hasDeleteArr = this.hasDeleteArr.concat(this.ids);

                const { total } = this.pagination;
                const { pageSize, pageIndex } = this.search;
                let currentTotal = total - this.ids.length;
                let currentTotalPage = Math.ceil(currentTotal / pageSize);
                if (currentTotalPage <= pageIndex) {
                  this.pagination.current = currentTotalPage;
                  this.search.pageIndex = currentTotalPage;
                }
                this.ids = [];
                this.getList();
              } else {
                setTimeout(() => {
                  this.$message.error({
                    content: "删除失败！",
                    key: "updatable",
                    duration: 2
                  });
                }, 1000);
              }
            } catch (error) {
              this.$message.error("请求失败！" + error);
            }
          }
        });
      }
    },

    // 列表图片预览
    handlePreview2(e) {
      this.previewVisible2 = true;
      this.previewImage2 = this.picBaseUrl + e;
    },
    handleCancel2() {
      this.previewVisible2 = false;
    },

    // modal
    //打开modal框
    // showModal(record, type) {
    showModal() {
      this.visible = true;
      this.btnDisabled = false;
      this.form = {
        newsId: "", //新闻id
        receive: "0", //接收端
        source: "0", //来源方式
        classify: undefined, //新闻分类
        title: "", //新闻标题
        image: [], //新闻图片
        organization: undefined, //来源机构
        url: "", //新闻URL
        abstract: "", //新闻摘要
        content: "" //新闻内容
      };
      this.fileList = [];

      /* if (type === "add") {
        this.modalTitle = {
          title: "添加新闻",
          buttonText: "立即创建",
          type:'创建'
        };
      } else if (type === "edit") {
        this.modalTitle = {
          title: "编辑新闻",
          buttonText: "保存",
          type:'保存'
        };
        this.form = { ...record }
        delete this.form.createTime

        let arry = []
        let image = record.image
        for(let i=0;i<image.length;i++){
          arry.push({
            uid: `id${i}`,
            name: `name${i}`,
            status: "done",
            url: this.picBaseUrl + image[i],
            pUrl:image[i]
          })
        }
        this.fileList = arry
      } */
    },
    //创建或保存
    // onSubmit(type) {
    onSubmit() {
      this.btnDisabled = true;

      let { classify, organization } = this.form;
      if (classify === undefined) classify = "";
      if (organization === undefined) organization = "";
      console.log(this.form);
      if (this.form.image.length === 2) {
        this.$message.warning("请上传一张或三张图片！");
        this.confirmLoading = false;
        this.btnDisabled = false;
        return;
      }

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          setTimeout(async() => {
            try {
              const res = await this.$api.NewsInformation.createAndUpdateNews({
                ...this.form,
                classify,
                organization
              });
              console.log(res);
              if (res.code === "200") {
                this.visible = false;
                this.confirmLoading = false;
                // this.$message.success(`${type}成功！`)
                this.$message.success("添加成功！");
                this.getList();
              } else {
                this.confirmLoading = false;
                this.btnDisabled = false;
                // this.$message.error(`${type}失败！`+res.message)
                this.$message.error("添加失败！" + res.message);
              }
            } catch (error) {
              this.confirmLoading = false;
              this.btnDisabled = false;
              this.$message.error("请求失败！" + error);
            }
          }, 500);
        } else {
          this.btnDisabled = false;
          return false;
        }
      });
    },
    //取消
    cancel() {
      this.visible = false;
    },

    //图片上传
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    //图片上传
    handleCancel() {
      this.previewVisible = false;
    },
    //预览图片的回调
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    //改变上传框时
    handleChange({ fileList }) {
      this.fileList = fileList;
      var imgArr = [];
      for (let i = 0; i < this.fileList.length; i++) {
        imgArr.push(this.fileList[i].pUrl);
      }
      this.form.image = imgArr;
    },
    //上传图片之前
    async beforeUploadImage(file, fileList) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      if (!isJPG) {
        this.$message.error("请上传图片");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(false);
        });
      }

      const imgBase64 = await this.getBase64(file);
      const res = await this.uploadPicReq(imgBase64);
      console.log(res);
      this.fileList.push({
        uid: file.uid,
        name: file.name,
        status: "done",
        url: res.url,
        pUrl: res.path
      });
      this.form.image.push(res.path);
      return new Promise((resolve, reject) => {
        return reject(false);
      });
    },
    //上传图片请求
    async uploadPicReq(imgBase64) {
      this.btnDisabled = true;
      try {
        const res = await this.$api.init.uploadPic({ imgBase64 });
        if (res.code === "200") {
          this.btnDisabled = false;
          return res.data;
        }
        console.log(res);
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    //富文本编辑
    editorChange(e) {
      this.form.content = e;
    },

    //获取列表
    async getList() {
      this.loading = true;
      let { startDate, endDate, receive, classify, source } = this.search;
      if (startDate) startDate = moment(startDate).format("YYYY-MM-DD");
      if (endDate) endDate = moment(endDate).format("YYYY-MM-DD");
      if (receive === undefined) receive = "";
      if (classify === undefined) classify = "";
      if (source === undefined) source = "";
      try {
        const res = await this.$api.NewsInformation.getNewsList({
          ...this.search,
          startDate,
          endDate,
          receive,
          classify,
          source
        });
        if (res.code === "200") {
          console.log(res);
          this.dataList = res.data;
          this.pagination.total = res.total;
          this.loading = false;
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
        this.loading = false;
      }
    },

    //指定条件搜索
    searchList() {
      console.log("当前搜索条件", this.search);
      if (this.search.startDate && !this.search.endDate) {
        this.$message.warning("请选择结束日期！");
      } else if (!this.search.startDate && this.search.endDate) {
        this.$message.warning("请选择开始日期！");
      } else {
        this.getList();
      }
    }
  }
};
</script>

<style lang="less">
#news {
  background-color: #fff;
  .top {
    padding: 18px 14px;
    display: flex;
    justify-content: space-between;
    .topLift {
      display: flex;
      align-items: center;
    }
    .topRight {
      display: flex;
      align-items: center;
    }
  }
  .list {
    padding: 0px 14px 14px 14px;
    .handle-button .ant-btn-link {
      color: #b2b2b2;
      padding: 0;
      span {
        padding-left: 5px;
      }
    }
    .ant-table-row {
      &:hover {
        .ant-btn-link {
          color: #489ff8;
        }
      }
      .ant-table-row-cell-break-word:nth-child(3) {
        padding: 0 !important;
        img {
          width: 56px;
          height: 56px;
          margin: 0 4px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}

//图片预览框
.previewImgModal {
  .ant-modal-body {
    padding: 40px;
  }
}

//新增编辑框
.newsModal {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    .ant-form-item {
      margin-bottom: 10px;
      .ant-form-item-label {
        width: 12%;
      }
      .ant-form-item-control-wrapper {
        width: 85%;
      }
      .ant-radio-wrapper {
        width: 150px;
      }
      .ant-select {
        width: 300px;
      }
    }
  }
}

//日期弹出框的宽度
.authData {
  .ant-calendar {
    width: 250px;
  }
}
</style>