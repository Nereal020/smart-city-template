<!-- 短信推送 -->
<template>
  <div id="notePush">
    <div class="top">
      <div class="topLift">
        <a-button
          type="primary"
          class="add"
          v-auth="['SMSPush_add']"
          @click="showModal"
          style="margin-right:10px;"
        >
          <svg-icon icon-class="add" :scale="0.8" style="margin-right:5px;"></svg-icon>添加短信
        </a-button>
        <a-button
          type="danger"
          class="danger"
          v-auth="['SMSPush_delete']"
          @click="showDeleteConfirmBatch()"
        >
          <svg-icon icon-class="shanchu" :scale="0.8" style="margin-right:5px;"></svg-icon>批量删除
        </a-button>
      </div>

      <!-- 搜索功能 -->
      <div class="topRight" v-auth="['SMSPush_list']">
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
        <!-- 接收群组 -->
        <a-select
          style="width: 120px;margin-left:14px;"
          placeholder="接收群组"
          allowClear
          v-model="search.receiveGroup"
          @change="changeReceiveGroup"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option
            :value="item.codeTableValue"
            v-for="item of receiveGroupSelectOption"
            :key="item.codeTableKey"
          >{{item.codeTableKey}}</a-select-option>
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
        v-if="permit('SMSPush_list')"
        :row-selection="rowSelection"

        :columns="columns"
        :data-source="dataList"
        :rowKey="row=>row.noteId"
        bordered
        :pagination="pagination"
        :loading="loading"
        @change="sortChange"
      >
        <span slot="receiveGroup" slot-scope="text">{{changeReceiveGroupSelect(text)}}</span>
        <span slot="successNum" slot-scope="text,record">
          <span style="color:#00B707">{{record.successNum}}</span>
          <a-divider type="vertical" />
          <span>{{record.total}}</span>
        </span>
        <span slot="sendTime" slot-scope="text">{{text | fliterTimestamp(0)}}</span>
        <span slot="createTime" slot-scope="text">{{text | fliterTimestamp(0)}}</span>
        <span slot="operation" slot-scope="text,record" class="handle-button">
          <a-button type="link" v-auth="['SMSPush_info']" @click="showModal2(record)">
            <svg-icon icon-class="chakan" :scale="0.8"></svg-icon>查看
          </a-button>
          <!-- <a-divider type="vertical" /> -->
          <a-button type="link" v-auth="['SMSPush_delete']" @click="showDeleteConfirm(record)">
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

    <!-- 添加信息modal -->
    <a-modal
      class="notePushModal1"
      v-model="visible"
      title="添加短信"
      :maskClosable="false"
      :footer="null"
      :destroyOnClose="true"
      width="800px"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <!-- 短信内容 -->
        <a-form-model-item ref="content" label="短信内容" prop="content">
          <a-input
            v-model="form.content"
            :maxLength="75"
            placeholder="请输入短信内容 , 不超过75个字符"
            @blur="() => {$refs.content.onFieldBlur();}"
          />
        </a-form-model-item>
        <!-- 接收群组 -->
        <a-form-model-item label="接收群组" prop="receiveGroup">
          <a-radio-group v-model="form.receiveGroup">
            <a-radio
              :value="item.codeTableValue"
              v-for="item of receiveGroupSelectOption"
              :key="item.codeTableKey"
            >{{item.codeTableKey}}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 自定义手机号 -->
        <a-form-model-item label="自定义手机号" prop="phoneNum" v-if="form.receiveGroup === '0'">
          <a-input
            v-model="form.phoneNum"
            type="textarea"
            style="height:150px;"
            placeholder="输入真实手机号码，多个手机号码用“ ，”隔开"
          />
        </a-form-model-item>
        <!-- 发送时间 -->
        <a-form-model-item label="发送时间" prop="sendTime">
          <a-date-picker
            format="YYYY-MM-DD HH:mm:ss"
            v-model="form.sendTime"
            :disabled-date="disabledDate"
            :disabled-time="disabledDateTime"
            :showToday="false"
            placeholder="选择定时发送日期时间"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :disabled="btnDisabled" @click="onSubmit">
            <a-icon type="loading" v-if="confirmLoading" />立即创建
          </a-button>
          <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 详细信息modal -->
    <a-modal
      class="notePushModal2"
      v-model="visible2"
      title="详细信息"
      :maskClosable="false"
      :footer="null"
      width="800px"
    >
      <div class="infoTitle">短信内容</div>
      <div class="infoContent content">{{info.content}}</div>

      <div class="infoTitle">
        接收群组
        <span
          class="group"
          style="color: #7FBE89;"
        >【{{changeReceiveGroupSelect(info.receiveGroup)}}】</span>
      </div>
      <div class="infoContent phone">{{info.phoneNum}}</div>

      <div class="infoTitle">发送成功条数</div>
      <div class="infoContent sendNum">
        总条数：
        <span class="total">{{info.total}}</span>条，
        成功：
        <span class="successNum" style="color: #7FBE89;">{{info.successNum}}</span>条，
        失败：
        <span class="failNum" style="color: #FB8484;">{{info.failNum}}</span>条。
      </div>

      <div class="infoTitle">发送时间</div>
      <div class="infoContent sendTime">{{info.sendTime | fliterTimestamp(0)}}</div>

      <div class="infoTitle">创建状态</div>
      <div
        class="infoContent createState"
      >{{info.createState==="0"?'失败':info.createState==="1"?'成功':'--'}}</div>

      <div style="text-align: center;">
        <a-button type="primary" @click="ensure()">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import { permit } from "../../directives/authIf.js";


export default {
  data() {
    /* 标题正则规则 */
    const validateContent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入短信内容 , 不超过75个字符"));
      } else {
        const pwdRegex = /^[a-zA-Z0-9\_\@\+\-\?\/\\\,\.\，\。\、\：\:\;\；\"\'\“\”\？\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(
            new Error(
              "格式有误，请输入中文、英文、数字、常用符号,不允许特殊符号"
            )
          );
        }
        callback();
      }
    };

    return {
      loading: true, //列表加载
      confirmLoading: false, //提交按钮
      btnDisabled: false, //提交按钮禁用
      receiveGroupSelectOption: [], //接收群组
      //  搜索
      search: {
        startDate: "", //开始时间
        endDate: "", //结束时间
        receiveGroup: undefined, //接收群组
        keyword: "", //输入框内容
        pageIndex: 1, //当前页
        pageSize: 10, //每页条数
        sortField: "create_time",
        sort: 1
      },

      //添加信息modal
      visible: false, //添加信息modal状态
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        //表单数据
        content: "", //短信内容
        receiveGroup: "", //接收群组
        phoneNum: "", //自定义手机号
        sendTime: null //发送时间
      },
      rules: {
        content: [
          //短信内容
          { validator: validateContent, required: true, trigger: "blur" }
        ],
        receiveGroup: [
          //接收群组
          { required: true, message: "请选择接收群组", trigger: "change" }
        ],
        phoneNum: [
          //自定义手机号
          { required: true, message: "请填写自定义手机号", trigger: "blur" }
        ],
        //推送时间
        sendTime: [{ required: true, message: "请选择推送时间" }]
      },

      //详细信息modal
      visible2: false, //详细信息modal状态

      id: [], //被删除id数组(单个删除)
      ids: [], //被删除id数组(批量删除)
      columns: [
        {
          title: "短信内容",
          dataIndex: "content",
          key: "content",
          align: "center",
          width: "30%",
          ellipsis: true
        },
        {
          title: "接收群组",
          dataIndex: "receiveGroup",
          key: "receiveGroup",
          align: "center",
          width: "14%",
          scopedSlots: { customRender: "receiveGroup" }
        },
        {
          title: "成功条数",
          dataIndex: "successNum",
          key: "successNum",
          align: "center",
          width: "14%",
          scopedSlots: { customRender: "successNum" }
        },
        {
          title: "发送时间",
          dataIndex: "sendTime",
          key: "sendTime",
          align: "center",
          width: "14%",
          scopedSlots: { customRender: "sendTime" },
          sorter: true
          // sorter: (a, b) => moment(a.sendTime) - moment(b.sendTime)
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
          width: "14%",
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
          width: "14%",
          scopedSlots: { customRender: "operation" }
        }
      ], //列表结构
      dataList: [], //列表数据

      hasDeleteArr: [], //被删除数据的id

      //  详细信息查看
      info: {
        content: "", //短信内容
        receiveGroup: "", //接收群组
        phoneNum: "", //手机号
        total: "", //总条数
        successNum: "", //成功条数
        failNum: "", //失败条数
        sendTime: null, //发送时间
        createState: "" //创建状态
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
    this.receiveGroupSelect();
  },

  computed: {
    //选择框
    rowSelection() {
      return {
        selectedRowKeys: this.ids,
        onChange: (selectedRowKeys, selectedRows) => {
          /* console.log("!!!!!!!!!!!!!", selectedRowKeys, selectedRows)
          const arr = selectedRows.map(item => item.noteId)
          this.ids = this.ids.concat([...arr]);
          this.ids = [...new Set(this.ids)]
          console.log(this.ids) */
          // this.ids = selectedRows.map(item => item.noteId);
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

    //翻页，排序事件
    sortChange(pagination, filters, sorter) {
      console.log(sorter);
      if (pagination.pageSize !== this.search.pageSize) {
        //改变每页显示条数
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
        //排序功能
        //按照 sendTime 排序
        if (sorter.field === "sendTime") {
          this.search.sortField = "push_time";
          const { sortOrder } = this.columns[3];
          delete this.columns[4].sortOrder;
          if (sortOrder === "descend") {
            this.columns[3].sortOrder = "ascend";
            this.search.sort = 0;
            this.getList();
          } else {
            this.columns[3].sortOrder = "descend";
            this.search.sort = 1;
            this.getList();
          }
        } else if (sorter.field === "createTime") {
          //按照 createTime 排序
          this.search.sortField = "create_time";
          const { sortOrder } = this.columns[4];
          delete this.columns[3].sortOrder;
          if (sortOrder === "descend") {
            this.columns[4].sortOrder = "ascend";
            this.search.sort = 0;
            this.getList();
          } else {
            this.columns[4].sortOrder = "descend";
            this.search.sort = 1;
            this.getList();
          }
        }
      }
    },

    //获取接收群组
    receiveGroupSelect() {
      this.$store.dispatch("queryCodeTable", "RECEIVE_GROUP").then(res => {
        this.receiveGroupSelectOption = res;
      });
    },
    //转换接收群组
    changeReceiveGroupSelect(e) {
      let receiveGroupName;
      for (let i = 0; i < this.receiveGroupSelectOption.length; i++) {
        if (e === this.receiveGroupSelectOption[i].codeTableValue) {
          receiveGroupName = this.receiveGroupSelectOption[i].codeTableKey;
        }
      }
      return receiveGroupName;
    },

    moment,
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
    //接收群组选择
    changeReceiveGroup(value) {
      console.log(`selected ${value}`);
    },
    //点击单个删除
    showDeleteConfirm(e) {
      this.id.push(e.noteId);
      console.log(this.id);

      this.$confirm({
        title: "你确定要删除这条数据吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          try {
            const res = await this.$api.SMSPush.deleteNotePush({ ids: this.id });
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
              const res = await this.$api.SMSPush.deleteNotePush({
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

    // 添加信息modal
    showModal() {
      this.visible = true;
      this.btnDisabled = false;
      this.form = {
        content: "", //短信内容
        receiveGroup: "", //接收群组
        phoneNum: "", //自定义手机号
        sendTime: null //发送时间
      };
    },
    //添加信息-选择时间
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate(current) {
      if (current.format("YY-MM-DD") < moment().format("YY-MM-DD")) {
        return true;
      } else {
        return false;
      }
    },
    disabledDateTime(time) {
      const day = moment().date();
      const hours = moment().hours();
      const minutes = moment().minutes();
      const seconds = moment().seconds();
      return {
        disabledHours: () => {
          if (!time || time.date() === day) {
            return this.range(0, 24).splice(0, hours);
          } else {
            return this.range(0, 24).splice(0, 0);
          }
        },

        disabledMinutes: h => {
          if ((!time || time.date() === day) && h <= hours) {
            return this.range(0, 60).splice(0, minutes);
          } else {
            return this.range(0, 60).splice(0, 0);
          }
        },

        disabledSeconds: (h, m) => {
          if ((!time || time.date() === day) && h <= hours && m <= minutes) {
            return this.range(0, 60).splice(0, seconds);
          } else {
            return this.range(0, 60).splice(0, 0);
          }
        }
      };
    },

    //创建
    onSubmit() {
      this.btnDisabled = true;

      console.log("当前表单数据", this.form);
      //将form数据拷贝
      var sendForm = { ...this.form };
      //将发送时间转化成时间戳
      if (sendForm.sendTime) {
        sendForm.sendTime = sendForm.sendTime.valueOf();
      }

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          setTimeout(async() => {
            try {
              const res = await this.$api.SMSPush.addNotePush({ ...sendForm });
              console.log(res);
              if (res.code === "200") {
                this.visible = false;
                this.confirmLoading = false;
                this.$message.success("创建成功！");
                this.getList();
              } else {
                this.confirmLoading = false;
                this.btnDisabled = false;
                this.$message.error("创建失败！" + res.message);
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
      // this.$refs.ruleForm.resetFields();
      this.visible = false;
    },

    // 详细信息modal
    async showModal2(record) {
      this.visible2 = true;
      console.log(record.noteId);
      try {
        const res = await this.$api.SMSPush.detailsNotePush({
          noteId: record.noteId
        });
        if (res.code === "200") {
          console.log(res);
          this.info = res.data;
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
      }
    },
    ensure() {
      this.visible2 = false;
    },

    //获取列表
    async getList() {
      this.loading = true;
      let { startDate, endDate, receiveGroup } = this.search;
      if (startDate) startDate = moment(startDate).format("YYYY-MM-DD");
      if (endDate) endDate = moment(endDate).format("YYYY-MM-DD");
      if (receiveGroup === undefined) receiveGroup = "";
      try {
        const res = await this.$api.SMSPush.getNotePushList({
          ...this.search,
          startDate,
          endDate,
          receiveGroup
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
#notePush {
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

.notePushModal1 {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    .ant-form-item-label {
      text-align: right;
      width: 15%;
    }
    .ant-form-item-control-wrapper {
      width: 82%;
    }
  }
}

.notePushModal2 {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    padding: 24px 36px;
    .infoTitle {
      margin-bottom: 10px;
      color: #000;
    }
    .infoContent {
      padding: 10px;
      min-height: 47px;
      line-height: 2;
      background-color: #f4f4f4;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .phone {
      height: 150px;
      overflow-y: auto;
      /* 滚动条 */
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #eff3f5;
      }
      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background-color: #eff3f5;
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #d9e1e5;
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