 <!-- 意见反馈 -->
<template>
  <div id="feedback">
    <div class="top">
      <div class="topLift">
        <a-button
          type="danger"
          class="danger"
          v-auth="['Feedback_delete']"
          @click="showDeleteConfirmBatch()"
        >
          <svg-icon icon-class="shanchu" :scale="0.8" style="margin-right:5px;"></svg-icon>批量删除
        </a-button>
      </div>

      <!-- 搜索功能 -->
      <div class="topRight" v-auth="['Feedback_list']">
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
          <svgIcon slot="suffixIcon" icon-class="riqi" :scale="(0.8)" style="margin-right:-1px" />
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
          <svgIcon slot="suffixIcon" icon-class="riqi" :scale="(0.8)" style="margin-right:-1px" />
        </a-date-picker>
        <!-- 来源 -->
        <a-select
          style="width: 120px;margin-left:14px;"
          placeholder="来源"
          allowClear
          v-model="search.source"
          @change="changeSource"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option value="1">移动端(APP)</a-select-option>
          <a-select-option value="2">门户端(WEB)</a-select-option>
        </a-select>
        <!-- 类型 -->
        <a-select
          style="width: 120px;margin-left:14px;"
          placeholder="类型"
          allowClear
          v-model="search.type"
          @change="changeType"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option
            :value="item.codeTableValue"
            v-for="item of typeSelectOption"
            :key="item.codeTableKey"
          >{{item.codeTableKey}}</a-select-option>
        </a-select>
        <!-- 状态 -->
        <a-select
          style="width: 120px;margin-left:14px;"
          placeholder="状态"
          allowClear
          v-model="search.state"
          @change="changeState"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option value="1">未处理</a-select-option>
          <a-select-option value="2">已处理</a-select-option>
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
        v-if="permit('Feedback_list')"
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="dataList"
        :rowKey="row=>row.feedId"
        bordered
        :pagination="pagination"
        :loading="loading"
        @change="sortChange"
      >
        <span slot="type" slot-scope="text">{{changeTypeSelect(text)}}</span>
        <span slot="source" slot-scope="text">{{text==='1'?'移动端(APP)':text==='2'?'门户端(WEB)':'--'}}</span>
        <span slot="state" slot-scope="text">{{text==='1'?'未处理':text==='2'?'已处理':'--'}}</span>
        <span slot="createTime" slot-scope="text">{{text | fliterTimestamp(0)}}</span>
        <span slot="operation" slot-scope="text,record" class="handle-button">
          <a-button type="link" v-auth="['Feedback_edit']" @click="showModal(record)">
            <svg-icon icon-class="bianji" :scale="0.8"></svg-icon>编辑
          </a-button>
          <!-- <a-divider type="vertical"/> -->
          <a-button type="link" v-auth="['Feedback_delete']" @click="showDeleteConfirm(record)">
            <svg-icon icon-class="shanchu" :scale="0.8"></svg-icon>删除
          </a-button>
        </span>
      </a-table>

      <!-- <a-spin v-else tip="无权限..."> -->
      <a-table
        class="no-promission"
        v-else
        bordered
        :columns="columns"
        :data-source="[]"
        :locale="{emptyText: '无权限，请联系管理员'}"
      />
      <!-- </a-spin> -->
    </div>

    <!-- 编辑modal -->
    <a-modal
      class="feedbackModal"
      v-model="visible"
      title="编辑意见"
      :maskClosable="false"
      :footer="null"
      :destroyOnClose="true"
      width="800px"
    >
      <div class="info">
        <div class="row">
          <div class="left">
            <div class="title">用户名：</div>
            <div class="text userName">{{redact.userName}}</div>
          </div>
          <div class="right">
            <div class="title">手机号：</div>
            <div class="text phone">{{redact.phone}}</div>
          </div>
        </div>

        <div class="row">
          <div class="left">
            <div class="title">来源：</div>
            <div class="text source">{{ redact.source==='1'?'移动端(APP)':'门户端(WEB)'}}</div>
          </div>
          <div class="right">
            <div class="title">类型：</div>
            <div class="text type">{{changeTypeSelect(redact.type)}}</div>
          </div>
        </div>

        <div class="row1 content">
          <div class="left">问题内容：</div>
          <div class="right">{{redact.question}}</div>
        </div>
        <div class="row1 img">
          <div class="left">图片：</div>
          <div class="right">
            <img 
              :src="picBaseUrl + item"
              alt="图片"
              v-for="(item,index) in redact.image" 
              :key="index"
              @click="handlePreview(item)"
            />
          </div>
        </div>
      </div>

      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <!-- 处理回复 -->
        <a-form-model-item label="处理回复" prop="reply">
          <Editor @change="editorChange" v-model="form.reply" style="height:300px" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :disabled="btnDisabled" @click="onSubmit">
            <a-icon type="loading" v-if="confirmLoading" />保存
          </a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 列表图片预览 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      wrapClassName="previewImgModal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
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
    return {
      loading: true, //列表加载
      confirmLoading: false, //保存按钮
      btnDisabled: false, //提交按钮禁用

      typeSelectOption: [], //类型下拉框
      // 搜索
      search: {
        startDate: "", //开始时间
        endDate: "", //结束时间
        source: undefined, //来源选择
        type: undefined, //类型选择
        state: undefined, //状态选择
        keyword: "", //输入框内容
        pageIndex: 1, //当前页
        pageSize: 10, //每页条数
        sort: 1
      },

      visible: false, //modal状态
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      form: {
        //表单数据
        feedId: "", //意见id
        reply: "" //处理回复
      },

      id: [], //被删除id数组(单个删除)
      ids: [], //被删除id数组(批量删除)
      columns: [
        {
          title: "意见反馈内容",
          dataIndex: "content",
          key: "content",
          align: "center",
          width: "40%",
          ellipsis: true
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "type" }
        },
        {
          title: "来源",
          dataIndex: "source",
          key: "source",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "source" }
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          align: "center",
          width: "12%",
          scopedSlots: { customRender: "state" }
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

      // 图片预览
      previewVisible: false, //是否展示modal框
      previewImage: "", //预览图片地址

      // 编辑modal内的内容
      redact: {
        userName: "", //用户名
        phone: "", //手机号
        source: "", //来源
        type: "", //类型
        question: "", // 问题内容
        image: [] //图片
      },

      rules: {
        reply: [
          //回复内容
          { required: true, message: "请填写回复内容" }
        ]
      },

      pagination: {
        //分页器
        size: "middle",
        current: 1,
        showQuickJumper: true,
        total: 0,
        showSizeChanger: true,
        defaultPageSize: 10,
        pageSizeOptions: ["10", "25", "50"],
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条` // 显示总数
        /* onChange: (pageIndex, pageSize) => {
          console.log(pageIndex, pageSize);
          this.pagination.current = pageIndex;
          this.search.pageIndex = pageIndex;
          this.getList();
        },
        onShowSizeChange: (pageIndex, pageSize) => {
          console.log(pageIndex, pageSize);
          this.pagination.current = 1;
          this.search.pageIndex = 1;
          this.search.pageSize = pageSize;
          this.getList();
        } */
      }
    };
  },

  created() {
    this.search.startDate = moment().subtract("weeks", 1);
    this.search.endDate = moment();
    this.getList();
    this.typeSelect();
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

    //获取来源机构
    typeSelect() {
      this.$store.dispatch("queryCodeTable", "FEEDBACK").then(res => {
        this.typeSelectOption = res;
      });
    },
    //转换来源机构
    changeTypeSelect(e) {
      let typeName;
      for (let i = 0; i < this.typeSelectOption.length; i++) {
        if (e === this.typeSelectOption[i].codeTableValue) {
          typeName = this.typeSelectOption[i].codeTableKey;
        }
      }
      return typeName;
    },

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
        // console.log(666);
        const { sortOrder } = this.columns[4];
        if (sortOrder === "ascend") {
          this.columns[4].sortOrder = "descend";
          this.search.sort = 1;
          this.getList();
        } else {
          this.columns[4].sortOrder = "ascend";
          this.search.sort = 0;
          this.getList();
        }
      }
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
    //来源选择
    changeSource(value) {
      console.log(`selected ${value}`);
    },
    //类型选择
    changeType(value) {
      console.log(`selected ${value}`);
    },
    //状态选择
    changeState(value) {
      console.log(`selected ${value}`);
    },

    // 图片预览
    handlePreview(e) {
      this.previewVisible = true;
      this.previewImage = this.picBaseUrl + e;
    },
    handleCancel() {
      this.previewVisible = false;
    },

    //点击单个删除
    showDeleteConfirm(e) {
      this.id.push(e.feedId);
      console.log(this.id);

      this.$confirm({
        title: "你确定要删除这条数据吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          try {
            const res = await this.$api.Feedback.deleteFeedback({ ids: this.id });
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
                  [...this.ids].filter(
                    item => this.id.indexOf(item) === -1
                  )
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
        return false;
      } else {
        this.$confirm({
          title: `确认删除选中的${ids.length}条数据吗?`,
          content: "",
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          onOk: async() => {
            try {
              const res = await this.$api.Feedback.deleteFeedback({
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
                this.ids = []
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

    // modal
    //打开modal框
    showModal(record) {
      this.visible = true;
      this.btnDisabled = false;
      console.log("当前意见信息", record);
      this.form.feedId = record.feedId; //编辑时赋id
      this.form.reply = record.reply; //编辑时赋回复内容

      //复制当前意见信息
      this.redact.userName = record.userName; //用户名
      this.redact.phone = record.phone; //手机号
      this.redact.source = record.source; //来源
      this.redact.type = record.type; //类型
      this.redact.question = record.content; //问题内容
      this.redact.image = record.image; //图片
    },
    //保存
    onSubmit() {
      this.btnDisabled = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          setTimeout(async() => {
            try {
              const res = await this.$api.Feedback.updateFeedback({
                ...this.form
              });
              console.log(res);
              if (res.code === "200") {
                this.visible = false;
                this.confirmLoading = false;
                this.$message.success("编辑成功！");
                this.getList();
              } else {
                this.confirmLoading = false;
                this.btnDisabled = false;
                this.$message.error("编辑失败！" + res.message);
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
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },

    //富文本编辑
    editorChange(e) {
      this.form.reply = e;
    },

    //获取列表
    async getList() {
      this.loading = true;
      let { startDate, endDate, source, type, state } = this.search;
      if (startDate) startDate = moment(startDate).format("YYYY-MM-DD");
      if (endDate) endDate = moment(endDate).format("YYYY-MM-DD");
      if (source === undefined) source = "";
      if (type === undefined) type = "";
      if (state === undefined) state = "";
      try {
        const res = await this.$api.Feedback.getFeedbackList({
          ...this.search,
          startDate,
          endDate,
          source,
          type,
          state
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
#feedback {
  background-color: #fff;
  .top {
    padding: 18px 14px;
    display: flex;
    justify-content: space-between;
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
      margin-right: 12px;
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
    }
  }
}

.feedbackModal {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    padding: 24px 36px;
    .ant-form-item-label {
      text-align: right;
      width: 10%;
    }
    .ant-form-item-control-wrapper {
      width: 90%;
    }
    .info {
      .row {
        display: flex;
        margin-bottom: 10px;
        .left {
          width: 50%;
          display: flex;
          align-items: center;
        }
        .right {
          width: 50%;
          display: flex;
          align-items: center;
        }
        .title {
          width: 20%;
          text-align: right;
          color: #000;
        }
        .text {
          width: 80%;
          min-height: 42px;
          padding: 10px;
          line-height: 1.6;
          background-color: #f4f4f4;
          border-radius: 8px;
        }
      }
      .row1 {
        display: flex;
        margin-bottom: 10px;
        .left {
          justify-content: flex-end;
          display: flex;
          align-items: center;
          width: 10%;
          color: #000;
        }
        .right {
          width: 90%;
          min-height: 42px;
        }
      }
      .content {
        .right {
          padding: 10px;
          line-height: 1.6;
          background-color: #f4f4f4;
          border-radius: 8px;
        }
      }
      .img {
        .right {
          img {
            cursor: pointer;
            width: 100px;
            height: 100px;
            margin-right: 10px;
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

//日期弹出框的宽度
.authData {
  .ant-calendar {
    width: 250px;
  }
}
</style>