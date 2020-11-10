/*
 * @Page: api调用记录
 * @Author: mikey.WuQiao
 * @Date: 2020-07-31 11:24:42
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-10-19 10:19:23
 */
<template>
  <div class="api-useNum">
    <!-- 搜索功能区 -->
    <div class="head">
      <div class="head-left">
        <a-button
          type="primary"
          v-auth="['ApiCallRecords_list']"
          class="primary"
          @click="handleRefresh()"
        >
          <a-icon type="sync" />刷新数据
        </a-button>
      </div>
      <div class="head-right" v-auth="['ApiCallRecords_list']">
        <!-- 开始日期 -->
        <a-date-picker
          dropdownClassName="filterNameAuthData"
          v-model="fetchData.startTime"
          :disabled-date="disabledStartDate"
          :showToday="false"
          format="YYYY-MM-DD"
          placeholder="开始日期"
        >
          <svg-icon
            slot="suffixIcon"
            icon-class="riqi"
            :scale="0.8"
            style="margin-right:-2px;"
          />
        </a-date-picker>
        <span style="margin:0 10px;">至</span>
        <!-- 结束日期 -->
        <a-date-picker
          dropdownClassName="filterNameAuthData"
          v-model="fetchData.endTime"
          :disabled-date="disabledEndDate"
          :showToday="false"
          format="YYYY-MM-DD"
          placeholder="结束日期"
        >
          <svg-icon
            slot="suffixIcon"
            icon-class="riqi"
            :scale="0.8"
            style="margin-right:-2px;"
          />
        </a-date-picker>
        <a-input
          class="input"
          ref="userNameInput"
          :allowClear="true"
          v-model.trim="fetchData.keyword"
          placeholder="请输入搜索内容"
          @keyup.enter="query()"
          style="width:180px;margin:0 10px;"
        >
          <svg-icon
            slot="prefix"
            icon-class="sousuo"
            :scale="0.8"
            style="margin-right:5px;"
          />
        </a-input>
        <a-button type="primary" class="primary" @click="query()"
          >搜索</a-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="content">
      <!-- 后台数据没有id 故只能用随机数作为key -->
      <a-table
        v-if="permit('ApiCallRecords_list')"
        :pagination="pagination"
        :columns="columns"
        :data-source="data"
        :rowKey="row => Math.floor(Math.random() * 1000000)"
        :loading="loading"
        bordered
        @change="tableChange"
      >
        <!-- 接口类型 -->
        <span slot="apiType" slot-scope="text">{{ calcSelection(text) }}</span>
        <!-- 接口类型 -->
        <span slot="useApp" slot-scope="text">{{ text }}</span>
        <!-- 调用时间 -->
        <span slot="useTime" slot-scope="text">{{ text }}</span>
        <!-- 调用时长 -->
        <span slot="usedTime" slot-scope="text">{{ text }}s</span>
        <!-- 状态 -->
        <span slot="status" slot-scope="text">{{
          text === "0" ? "失败" : text === "1" ? "成功" : "--"
        }}</span>
        <span slot="action" slot-scope="text, record">
          <a
            class="a-btn"
            v-auth="['ApiCallRecords_info']"
            @click="showDetailModal(record)"
            >详情</a
          >
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
      <a-modal
        class="apiCallRecords-modal"
        width="520px"
        v-model="visible"
        title="API调用详情"
        @ok="handleOk()"
        :footer="null"
      >
        <ul class="ul-list">
          <li>
            <div>
              API名称：
              <span>{{ record.apiTitle || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              API地址：
              <span>{{ record.apiAddress || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              接口类型：
              <span>{{ calcSelection(record.apiType) || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              API版本：
              <span>{{ record.apiVersions || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              调用应用：
              <span>{{ record.useApp || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              请求时间：
              <span>{{ record.useTime || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              调用时长：
              <span>{{ record.usedTime + 's' || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              返回时间：
              <span>{{ record.responseTime || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              调用状态：
              <span>{{ record.status === "0" ? "失败" : record.status === "1" ? "成功" : "--" || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              请求参数：
              <span>{{ record.requestParmas || "--" }}</span>
            </div>
          </li>
          <li>
            <div>
              返回参数：
              <span>{{ record.responseParmas || "--" }}</span>
            </div>
          </li>
        </ul>
        <div class="btn">
          <a-button type="primary" class="primary" @click="handleOk()"
            >确定</a-button
          >
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { permit } from "../../directives/authIf.js";
import moment from "moment";
export default {
  name: "apiCallRecords",
  data() {
    const columns = [
      {
        title: "API名称",
        dataIndex: "apiTitle",
        align: "center"
      },
      {
        title: "API地址",
        dataIndex: "apiAddress",
        align: "center"
      },
      {
        title: "接口类型",
        dataIndex: "apiType",
        align: "center",
        scopedSlots: { customRender: "apiType" }
      },
      {
        title: "调用应用",
        dataIndex: "useApp",
        align: "center",
        scopedSlots: { customRender: "useApp" }
      },
      {
        title: "调用时间",
        dataIndex: "useTime",
        align: "center",
        sortOrder: "descend",
        sorter: true,
        scopedSlots: { customRender: "useTime" }
        // sorter: (a, b) => moment(a.useTime) - moment(b.useTime)
      },
      {
        title: "调用时长",
        dataIndex: "usedTime",
        align: "center",
        sorter: true,
        scopedSlots: { customRender: "usedTime" }
        // sorter: (a, b) => a.usedTime - b.usedTime
      },
      {
        title: "状态",
        dataIndex: "status",
        align: "center",
        scopedSlots: { customRender: "status" }
      },
      {
        title: "操作",
        dataIndex: "action",
        align: "center",
        scopedSlots: { customRender: "action" }
      }
    ];
    return {
      data: [],
      columns,
      dateFormat: "YYYY/MM/DD",
      monthFormat: "YYYY/MM",
      userName: "",
      visible: false,
      loading: false,
      codeTableList: [],
      fetchData: {
        startTime: "",
        endTime: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
        sort: 1,
        sortField: "useTime" //当前以调用时间来排序
      },
      record: {},
      paginationPageSize: "",
      pagination: {
        current: 1,
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        // onChange: this.onPageChange.bind(this), //点击页码事件
        total: 0, //总条数
        size: "middle",
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["10", "25", "50"] // 每页数量选项
        // onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      } // table的分页器
    };
  },
  mounted() {
    //将时间选择默认选择最近一周
    this.fetchData.startTime = moment().subtract("weeks", 1);
    this.fetchData.endTime = moment();
    this.fetchApiManageUseList();
    this.fetchCodeTable();
  },
  methods: {
    permit,
    //过滤下拉框的键值
    calcSelection(text) {
      let selectName;
      for (let i = 0; i < this.codeTableList.length; i++) {
        if (text === this.codeTableList[i].codeTableValue) {
          selectName = this.codeTableList[i].codeTableKey;
        }
      }
      return selectName;
    },
    //刷新数据
    handleRefresh() {
      // 刷新数据之前将初始化
      this.fetchData = {
        startTime: moment()
          .subtract("weeks", 1)
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        keyword: "",
        pageIndex: 1,
        sort: 1,
        sortField: "useTime", //当前以调用时间来排序
        pageSize: this.paginationPageSize || 10
      };
      this.pagination.current = 1;
      this.fetchApiManageUseList();
    },
    //翻页，排序事件
    tableChange(pagination, filters, sorter) {
      this.paginationPageSize = pagination.pageSize;
      //翻页
      if (pagination.pageSize !== this.fetchData.pageSize) {
        //改变每页显示条数
        this.pagination.current = 1;
        this.fetchData.pageIndex = 1;
        this.fetchData.pageSize = pagination.pageSize;
        this.fetchApiManageUseList();
      } else if (pagination.current !== this.fetchData.pageIndex) {
        const { current } = pagination;
        this.pagination.current = current;
        this.fetchData.pageIndex = current;
        this.fetchApiManageUseList();
      } else if (
        pagination.pageSize === this.fetchData.pageSize &&
        pagination.current === this.fetchData.pageIndex
      ) {
        //排序功能
        //按照 CTIDTime 排序
        if (sorter.field === "useTime") {
          this.fetchData.sortField = "useTime";
          const { sortOrder } = this.columns[4];
          delete this.columns[5].sortOrder;
          if (sortOrder === "descend") {
            this.columns[4].sortOrder = "ascend";
            this.fetchData.sort = 0;
            this.fetchApiManageUseList();
          } else {
            this.columns[4].sortOrder = "descend";
            this.fetchData.sort = 1;
            this.fetchApiManageUseList();
          }
        } else if (sorter.field === "usedTime") {
          //按照xx排序
          this.fetchData.sortField = "usedTime";
          const { sortOrder } = this.columns[5];
          delete this.columns[4].sortOrder;
          if (sortOrder === "descend") {
            this.columns[5].sortOrder = "ascend";
            this.fetchData.sort = 0;
            this.fetchApiManageUseList();
          } else {
            this.columns[5].sortOrder = "descend";
            this.fetchData.sort = 1;
            this.fetchApiManageUseList();
          }
        }
      }
    },
    //禁选开始日期
    disabledStartDate(startValue) {
      const endValue = this.fetchData.endTime;
      if (!startValue || !endValue) {
        return startValue >= moment();
      }
      return startValue.valueOf() > endValue.valueOf();
    },

    //禁选结束日期
    disabledEndDate(endValue) {
      const startValue = this.fetchData.startTime;
      if (!endValue || !startValue) {
        return endValue >= moment();
      }
      return (
        startValue.valueOf() >= endValue.valueOf() ||
        endValue.valueOf() >= moment()
      );
    },
    showDetailModal(record) {
      this.record = record;
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.pageIndex = page;
      this.fetchApiManageUseList();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.pageIndex = 1;
      this.fetchApiManageUseList();
    },
    // query and search
    query() {
      this.fetchApiManageUseList();
    },
    async fetchApiManageUseList() {
      let filterData = this.fetchData;
      let { startTime, endTime } = filterData;
      /*
       * 将选择的时间转化为时间格式 2020-07-07
       */
      if (startTime) startTime = moment(startTime).format("YYYY-MM-DD");
      if (endTime) endTime = moment(endTime).format("YYYY-MM-DD");
      filterData = Object.assign(filterData, { startTime, endTime });
      this.loading = true;
      try {
        const res = await this.$api.ApiManagement.getApiManageUseList(
          filterData
        );
        if (res.code === "200" && res.result) {
          setTimeout(() => {
            this.loading = false;
            this.data = res.data;
            this.pagination.total = res.total * 1;
          }, 100);
        } else {
          this.loading = false;
          this.$message.error("获取失败！");
        }
      } catch (error) {
        setTimeout(() => {
          this.loading = false;
          this.$message.error("获取失败！" + error);
        }, 1000);
      }
    },
    //获取接口类型下拉框数据
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
.api-useNum {
  padding: 15px;
  width: 100%;
  background: white;
  .head {
    width: 100%;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .head-right {
      /deep/ .ant-calendar-picker {
        width: 140px;
      }
      /deep/ .ant-calendar-picker {
        min-width: 140px !important;
      }
      display: flex;
      align-items: center;
      justify-content: space-around;
      .input {
        width: 120px;
      }
    }
  }
  .content {
    .ant-table-row:hover a {
      color: #0080ff;
    }
    .a-btn {
      color: #b0b0b0;
    }
  }
}
.apiCallRecords-modal {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    padding: 24px 48px;
  }
  .ant-col-offset-4 {
    margin-left: 35%;
  }
  .ul-list {
    font-size: 14px;
    list-style: none;
    width: 420px;
    text-align: left;
    li {
      min-height: 36px;
      line-height: 36px;
      div {
        color: #000;
        span {
          color: #ff7070;
        }
      }
    }
  }
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    .primary {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
