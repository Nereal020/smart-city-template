<!-- 通知公告 -->
<template>
  <div id="notice">
      <div class="top">

        <div class="topLift">
          <!-- <a-button type="primary" class="add" @click="showModal(null,'add')"  style="margin-right:10px;"> -->
          <a-button type="primary" class="add" v-auth="['Announcements_add']" @click="showModal()"  style="margin-right:10px;">
            <svg-icon icon-class="add" :scale="0.8" style="margin-right:5px;"></svg-icon>
            添加通知
          </a-button>
          <a-button type="danger" class="danger" v-auth="['Announcements_delete']" @click="showDeleteConfirmBatch()">
            <svg-icon icon-class="shanchu" :scale="0.8" style="margin-right:5px;"></svg-icon>
            批量删除
          </a-button>
        </div>

        <!-- 搜索功能 -->
        <div class="topRight" v-auth="['Announcements_list']">
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
            <svgIcon slot="suffixIcon" icon-class="riqi" :scale="(0.8)" style="margin-right:-1px"/>
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
            <svgIcon slot="suffixIcon" icon-class="riqi" :scale="(0.8)" style="margin-right:-1px"/>
          </a-date-picker>
          <!-- 接收端 -->
          <a-select
           style="width: 120px;margin-left:14px;" 
           placeholder="接收端"
           allowClear
           v-model="search.receive"
           @change="changeReceive">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option value="1">
              移动端(APP)
            </a-select-option>
            <a-select-option value="2">
              门户端(WEB)
            </a-select-option>
          </a-select>
          <!-- 搜索 -->
          <a-input v-model="search.keyword" placeholder="请输入搜索内容" style="width:180px;margin-left:14px;margin-right:14px;">
              <svg-icon  slot="prefix" icon-class="sousuo" :scale="0.8"></svg-icon>
          </a-input>

          <a-button type="primary" @click="searchList">搜索</a-button>
        </div>
      </div>

      <div class="list">
        <a-table 
          v-if="permit('Announcements_list')"
          :row-selection="rowSelection" 
          :columns="columns" 
          :data-source="dataList" 
          :rowKey="row=>row.noticeId"
          bordered
          :pagination="pagination"
          :loading="loading"
          @change="sortChange"
          >
          <span slot="receive" slot-scope="text">{{text==='1'?'移动端（APP）':text==='2'?'门户端（WEB）':'--'}}</span>
          <span slot="createTime" slot-scope="text">{{text | fliterTimestamp(0)}}</span>
          <span slot="operation" slot-scope="text,record"  class="handle-button">
            <!-- <a-button type="link" @click="showModal(record,'edit')">
              <svg-icon icon-class="bianji" :scale="0.8"></svg-icon>
              编辑
            </a-button>
            <a-divider type="vertical" /> -->
            <a-button type="link" v-if="permit('Announcements_delete')" @click="showDeleteConfirm(record)">
              <svg-icon icon-class="shanchu" :scale="0.8"></svg-icon>
              删除
            </a-button>
            <span v-else>--</span>
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

  <!-- 添加/编辑modal -->
    <!-- <a-modal class="noticeModal" v-model="visible" :title="modalTitle.title" :maskClosable = "false" :footer="null" :destroyOnClose="true" width = "800px"> -->
    <a-modal class="noticeModal" v-model="visible" title="添加通知" :maskClosable = "false" :footer="null" :destroyOnClose="true" width = "800px">
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
            <a-radio value="1">
              移动端（APP）
            </a-radio>
            <a-radio value="2">
              门户端（WEB）
            </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <!-- 标题 -->
        <a-form-model-item ref="title" label="标题" prop="title">
          <a-input 
            v-model="form.title" 
            placeholder="请输入标题 , 不超过20个字符"
            :maxLength='20'
            @blur="() => {$refs.title.onFieldBlur();}"
          />
        </a-form-model-item>

        <!-- 内容 -->
        <a-form-model-item label="内容" prop="content">
          <Editor @change="editorChange" v-model="form.content" style="height:300px"></editor>
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <!-- <a-button type="primary" :disabled="btnDisabled" @click="onSubmit(modalTitle.type)"> -->
          <a-button type="primary" :disabled="btnDisabled" @click="onSubmit()">
            <a-icon type="loading" v-if="confirmLoading" />
            <!-- {{modalTitle.buttonText}} -->
            立即创建
          </a-button>
          <a-button style="margin-left: 10px;" @click="cancel">
            取消
          </a-button>
        </a-form-model-item>
      </a-form-model>
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
          return callback(new Error("请输入标题 , 不超过20个字符"));
      } else {
        const pwdRegex = /^[a-zA-Z0-9\_\@\+\-\?\/\\\,\.\，\。\、\：\:\;\；\"\'\“\”\？\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
            callback(new Error("格式有误，请输入中文、英文、数字、常用符号,不允许特殊符号"));
        }
        callback();
      }
    };

    return {
      loading: true, //列表加载
      confirmLoading: false, //提交按钮
      btnDisabled: false, //提交按钮禁用
      search: { //搜索
        startDate: '', //开始时间
        endDate: '', //结束时间
        receive: undefined, //接收端选择
        keyword: '', //输入框内容
        pageIndex: 1, //当前页
        pageSize: 10, //每页条数
        sort: 1
      },

      visible: false, //modal状态
      // modalTitle:{}, //更改modal添加和编辑不同状态

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: { //表单数据
        noticeId: '', //通知id
        receive: '', //接收端
        title: '', //标题
        content: '' //内容
      },
      rules: {
        receive: [ //接收端
          { required: true, message: '请选择接收端', trigger: 'change' }
        ],
        title: [ //标题
          { validator: validateTitle, required: true, trigger: "blur" }
        ],
        content: [
          //内容
          { required: true, message: '请填写通知内容' }
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
          width: '40%'
        },
        {
          title: "接收端",
          dataIndex: "receive",
          key: "receive",
          align: "center",
          width: '20%',
          scopedSlots: { customRender: "receive" }
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
          width: '20%',
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
          width: '20%',
          scopedSlots: { customRender: "operation" }
        }
      ], //列表结构
      dataList: [], //列表数据

      hasDeleteArr: [], //被删除数据的id
      
      pagination: { //分页器
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
  },

  computed: {
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
        // console.log(666);
        const { sortOrder } = this.columns[2];
        if (sortOrder === "ascend") {
          this.columns[2].sortOrder = "descend";
          this.search.sort = 1;
          this.getList();
        } else {
          this.columns[2].sortOrder = "ascend";
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
    //接收端选择
    changeReceive(value) {
      console.log(`selected ${value}`);
    },
    //点击单个删除
    showDeleteConfirm(e) {
      this.id.push(e.noticeId)
      console.log(this.id)

      this.$confirm({
        title: '你确定要删除这条数据吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async() => {
          try {
            const res = await this.$api.Announcements.deleteNotice({ ids: this.id });
             this.$message.loading({ content: "正在删除中...", key: "updatable" });
            if (res.code === "200") {
              setTimeout(() => {
                this.$message.success({ content: "删除成功！", key: "updatable", duration: 2 });
              }, 500);

              this.hasDeleteArr = this.hasDeleteArr.concat(this.id);

              if (this.dataList.length === this.id.length && this.search.pageIndex > 1) {
                  this.search.pageIndex--
                  this.pagination.current--
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
                this.$message.error({ content: "删除失败！", key: "updatable", duration: 2 });
              }, 1000);
            }
          } catch (error) {
            this.$message.error("请求失败！" + error);
          }
        },
        onCancel: () => {
          this.id = [] //清空id数组
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
              const res = await this.$api.Announcements.deleteNotice({ ids: this.ids });
              this.$message.loading({ content: "正在删除中...", key: "updatable" });
              if (res.code === "200") {
                setTimeout(() => {
                  this.$message.success({ content: "删除成功！", key: "updatable", duration: 2 });
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
                  this.$message.error({ content: "删除失败！", key: "updatable", duration: 2 });
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
    // showModal(record,type) {
    showModal() {
      this.visible = true;
      this.btnDisabled = false;
      this.form = {
        noticeId: '', //通知id
        receive: '', //接收端
        title: '', //标题
        content: '' //内容
      }

      /* if(type === 'add'){
        this.modalTitle = {
          title:'添加通知',
          buttonText:'立即创建',
          type:'创建'
        }
      }else if(type === 'edit'){
        this.modalTitle = {
          title:'编辑通知',
          buttonText:'保存',
          type:'保存'
        }
        console.log('当前通告信息',record)
        this.form = { ...record }
        delete this.form.createTime
      } */
    },
      //创建或保存
    // onSubmit(type) {
    onSubmit() {
      this.btnDisabled = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          setTimeout(async() => {
            try {
              const res = await this.$api.Announcements.createAndUpdateNotice({ ...this.form });
              console.log(res)
              if (res.code === "200") {
                this.visible = false;
                this.confirmLoading = false;
                // this.$message.success(`${type}成功`)
                this.$message.success('添加成功！')
                this.getList()
              } else {
                this.confirmLoading = false;
                this.btnDisabled = false;
                // this.$message.error(`${type}失败`+res.message)
                this.$message.error('添加失败！' + res.message)
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

    //富文本编辑
    editorChange(e) {
      this.form.content = e
    },

    //获取列表
    async getList() {
      this.loading = true
      let { startDate, endDate, receive } = this.search;
      if (startDate) startDate = moment(startDate).format("YYYY-MM-DD")
      if (endDate) endDate = moment(endDate).format("YYYY-MM-DD")
      if (receive === undefined) receive = ''
      try {
        const res = await this.$api.Announcements.getNoticeList({
          ...this.search,
          startDate,
          endDate,
          receive
        });
        if (res.code === "200") {
          console.log(res);
          this.dataList = res.data
          this.pagination.total = res.total;
          this.loading = false
        } else {
          setTimeout(() => {
            this.loading = false   
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
        this.loading = false  
      }
    },

    //指定条件搜索
    searchList() {
      console.log('当前搜索条件', this.search)
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
#notice{
    background-color: #fff;
  .top {
    padding: 18px 14px;
    display: flex;
    justify-content: space-between;
    .topLift{
      display: flex;
      align-items: center;
    }
    .topRight {
      display: flex;
      align-items: center;
    }
  }
  .list {
    padding:0px 14px 14px 14px;
    .handle-button .ant-btn-link {
      color: #b2b2b2;
      padding: 0;
      span{
        padding-left: 5px;
      }
    }
    .ant-table-row{
      &:hover {
        .ant-btn-link {
          color: #489ff8;
        }
      }
    }
  }
}

.noticeModal{
  .ant-modal-header{
    background-color: #F4F4F4;
    text-align: center;
  }
  .ant-modal-body {
    .ant-form-item-label{
      width: 12%;
    }
    .ant-form-item-control-wrapper{
      width: 85%;
    }
    .ant-radio-wrapper{
        width: 150px;
    }
  }
}

//日期弹出框的宽度
.authData{
  .ant-calendar {
    width: 250px;
  }
}
</style>