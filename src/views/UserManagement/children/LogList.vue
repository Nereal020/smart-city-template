<template>
  <div>
    <a-modal
      v-model="logListVisible"
      title="登录记录"
      wrapClassName="appuser-logList-modal"
      :footer="null"
      :maskClosable="false"
      width="950px"
    >
      <div class="appuser-logList-modal-header">
        <div>
          <a-icon type="warning" class="appuser-logList-modal-header-icon" />
          <span>只能查看最近3个月的登录记录</span>
        </div>
        <div class="timeBox">
          <!-- 开始日期 -->
          <a-date-picker
          style="width:140px"
            dropdownClassName="filterAppUserData"
            v-model="filter.startTime"
            :disabled-date="disabledStartDate"
            :showToday="false"
            @change="changeDate()"
            format="YYYY-MM-DD"
            placeholder="开始日期"
          >
            <svgIcon slot="suffixIcon" icon-class="riqi" :scale="(0.8)" style="margin-right:-1px" />
          </a-date-picker>&nbsp;&nbsp;&nbsp;&nbsp; 至 &nbsp;&nbsp;
          <!-- 结束日期 -->
          <a-date-picker
          style="width:140px"
            dropdownClassName="filterAppUserData"
            v-model="filter.endTime"
            :disabled-date="disabledEndDate"
            :showToday="false"
            @change="changeDate()"
            format="YYYY-MM-DD"
            placeholder="结束日期"
          >
            <svgIcon slot="suffixIcon" icon-class="riqi" :scale="(0.8)" style="margin-right:-1px" />
          </a-date-picker>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table">
        <a-table
        :loading="tableLoading"
          :pagination="pagination"
          :columns="columns"
          :data-source="data"
          :rowKey="(row=>row.logTime)"
          :rowClassName="(record, index)=>{return (index%2===1?'even-row':'')+' every-row'}"
          :scroll="{y : 540}"
        >
          <span slot="logTime" slot-scope="text">{{text | fliterTimestamp(0)}}</span>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { timestampToTime } from "@/Utils/util.js";
import moment from "moment";
const columns = [
  {
    align: "center",
    title: "登录时间",
    dataIndex: "logTime",
    scopedSlots: { customRender: "logTime" }
  },
  {
    align: "center",
    title: "登录设备",
    dataIndex: "logEquipment"
  },
  {
    align: "center",
    title: "登录系统",
    dataIndex: "logSystem"
  },
  {
    align: "center",
    title: "登录端	",
    dataIndex: "logPort"
  },
  {
    align: "center",
    title: "登录IP",
    dataIndex: "logIP"
  }
];

// const data = [
//   {
//     id: 11
//   },
//   {
//     id: 22
//   }
// ];

export default {
  props: {
    userID: {
      type: String,
      required: true,
      default: ""
    }
  },
  data() {
    return {
      columns,
      data: [],
      logListVisible: false,
      filter: {
        startTime: null,
        endTime: null,
        pageIndex: 1,
        pageSize: 10
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
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: pageIndex => {
          this.pagination.current = pageIndex;
          this.filter.pageIndex = pageIndex;
          this.getList();
        },
        onShowSizeChange: (pageIndex, pageSize) => {
          // console.log(pageIndex, pageSize)
          this.pagination.current = 1;
          this.filter.pageIndex = 1;
          this.filter.pageSize = pageSize;
          this.getList();
        }
      },

      tableLoading: false

    };
  },
  created() {
    this.filter.startTime = moment()
      .subtract(2, "months")
      // .format("YYYY-MM-DD");
    this.filter.endTime = moment()
    // .format("YYYY-MM-DD");
  },
  methods: {
    timestampToTime,
    //禁选开始日期
    disabledStartDate(startValue) {
      const endValue = this.filter.endTime;
      if (!startValue || !endValue) {
        return (
          startValue >= moment() ||
          startValue.valueOf() <= moment().add(-3, "month")
        );
      }
      return (
        startValue.valueOf() > endValue.valueOf() ||
        startValue.valueOf() <= moment().add(-3, "month")
      );
    },

    //禁选结束日期
    disabledEndDate(endValue) {
      const startValue = this.filter.startTime;
      if (!endValue || !startValue) {
        return (
          endValue >= moment() ||
          endValue.valueOf() <= moment().add(-3, "month")
        );
      }
      return (
        startValue.valueOf() >= endValue.valueOf() ||
        endValue.valueOf() >= moment()
      );
    },

    //改变查询日期
    changeDate() {
      this.pagination.current = 1;
          this.filter.pageIndex = 1;
      this.getList();
    },

    //获取登录记录列表
    async getList() {
        this.tableLoading = true;
      let { startTime, endTime } = this.filter;
      // if (startTime) startTime = startTime.valueOf();
      // if (endTime) endTime = endTime.valueOf();
      if (startTime) startTime = moment(startTime).format("YYYY-MM-DD");
      if (endTime) endTime = moment(endTime).format("YYYY-MM-DD");
      try {
        const res = await this.$api.MobileUser.getAPPUserLogList({
          ...this.filter,
          startTime,
          endTime,
          uid: this.userID
        });
        // console.log("res", res);
        if (res.code === "200") {
          this.data = res.data;
          this.pagination.total = res.total;
        }
        this.tableLoading = false;
      } catch (error) {
        this.$message.error("请求失败");
      }
    }
  }
};
</script>

<style lang="less" >
//登录记录对话框
.appuser-logList-modal {
  .appuser-logList-modal-header {
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
    .appuser-logList-modal-header-icon {
      color: #ffb930;
      margin-right: 10px;
    }
    .timeBox{
      &>*{
        margin: 0 5px;
      }
    }
  }

  .ant-modal-body {
    padding-top: 5px;
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

  .ant-table-pagination {
    width: 100%;
    padding: 16px 20px;
    text-align: right;
    margin: 0;
    .ant-pagination-total-text {
      float: left;
    }
    .ant-pagination-item-active {
      background-color: #3698f7;
      border-color: #3698f7;
      a {
        color: #fff;
      }
    }
  }
}
</style>