/*
 * @Page:开放api管理页面
 * @Author: mikey.WuQiao
 * @Date: 2020-07-30 10:28:20
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-10-15 15:15:37
 */
<template>
  <div class="api-manage">
    <!-- 搜索功能区 -->
    <div class="head">
      <div class="head-left">
        <a-button
          type="primary"
          v-auth="['API_add']"
          style="margin-right:10px;"
          class="add"
          @click="showConponentsModal('add')"
        >
          <svg-icon
            icon-class="add"
            :scale="0.8"
            style="margin-right:5px;"
          />添加API
        </a-button>
        <a-button
          v-auth="['WebUser_delete']"
          type="danger"
          class="danger"
          @click="showDeleteAllConfirm()"
          style="margin-right:10px;"
        >
          <svg-icon
            icon-class="shanchu"
            :scale="0.8"
            style="margin-right:5px;"
          />批量删除
        </a-button>
        <a-button
          type="primary"
          v-auth="['API_list']"
          class="primary"
          @click="handleRefresh()"
        >
          <a-icon type="sync" />刷新数据
        </a-button>
      </div>
      <div class="head-right" v-auth="['API_list']">
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
          style="margin-right:10px;"
        >
          <svg-icon
            slot="suffixIcon"
            icon-class="riqi"
            :scale="0.8"
            style="margin-right:-2px;"
          />
        </a-date-picker>
        <a-select
          style="width: 120px"
          v-model="fetchData.apiType"
          placeholder="接口类型"
          allowClear
        >
          <a-select-option
            v-for="item of codeTableList"
            :key="item.codeTableKey"
            :value="item.codeTableValue"
            >{{ item.codeTableKey }}</a-select-option
          >
        </a-select>
        <div class="components-input-demo-presuffix">
          <a-input
            ref="userNameInput"
            :allowClear="true"
            v-model.trim="fetchData.keyword"
            @keyup.enter="query()"
            placeholder="请输入搜索内容"
            style="width:180px;margin:0 10px;"
          >
            <svg-icon
              slot="prefix"
              icon-class="sousuo"
              :scale="0.8"
              style="margin-right:5px;"
            />
          </a-input>
        </div>
        <a-button type="primary" class="primary" @click="query()"
          >搜索</a-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="content">
      <a-table
        v-if="permit('API_list')"
        bordered
        :loading="loading"
        :rowKey="row => row.apiId"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :pagination="pagination"
        :columns="columns"
        :data-source="data"
        @change="tableChange"
      >
        <span slot="useNum" slot-scope="text, record">
          <a
            @click="showUseNumDetailModal(record.apiId)"
            style="color:#0080ff;text-decoration:underline;"
            >{{ text }}</a
          >
        </span>
        <span slot="apiType" slot-scope="text">{{ calcSelection(text) }}</span>

        <span slot="maintenanceTime" slot-scope="text">
          <template v-if="text">{{ text }}</template>
          <template v-else>--</template>
        </span>
        <span slot="apiState" slot-scope="text, record">
          <!-- {{record.apiState === '0' ? '停止' : '启用'}} -->
          <!-- checked-children="启用" un-checked-children="停止" -->
          <a-switch
            v-auth="['API_edit']"
            :checked="record.apiState === '0' ? false : true"
            style="margin-bottom:5px"
            @click="showConfirm(record)"
          />
        </span>
        <span slot="action" slot-scope="text, record">
          <a
            class="a-btn"
            style="margin:0 10px;"
            v-auth="['API_edit']"
            @click="showConponentsModal('edit', record)"
          >
            <svg-icon
              icon-class="bianji"
              :scale="0.9"
              style="margin-right:5px;"
            />编辑
          </a>
          <!-- <a-divider type="vertical" /> -->
          <a
            class="a-btn"
            v-auth="['API_delete']"
            @click="showDeleteConfirm(record.apiId)"
          >
            <svg-icon
              icon-class="shanchu"
              :scale="0.9"
              style="margin-right:5px;"
            />删除
          </a>
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
      <CreateAndUpdateApi ref="createAndUpdateApi" />
      <UseNum ref="useNum" />
    </div>
  </div>
</template>

<script>
import CreateAndUpdateApi from "./components/CAUOpenApi";
import UseNum from "./components/UseNum";
import moment from "moment";
import { permit } from "../../directives/authIf.js";

export default {
  name: "openApi",
  components: {
    CreateAndUpdateApi,
    UseNum
  },
  data() {
    const columns = [
      {
        title: "API名称",
        dataIndex: "apiName",
        align: "center"
      },
      {
        title: "API地址",
        dataIndex: "apiAddress",
        align: "center"
      },
      {
        title: "版本",
        dataIndex: "apiVersions",
        align: "center"
      },
      {
        title: "接口类型",
        dataIndex: "apiType",
        align: "center",
        scopedSlots: { customRender: "apiType" }
      },
      {
        title: "调用量",
        dataIndex: "useNum",
        align: "center",
        scopedSlots: { customRender: "useNum" }
      },
      {
        title: "操作时间",
        dataIndex: "maintenanceTime",
        align: "center",
        scopedSlots: { customRender: "maintenanceTime" },
        sortOrder: "descend",
        sorter: true
        // sorter: (a, b) => moment(a.maintenanceTime) - moment(b.maintenanceTime),
      },
      {
        title: "当前状态",
        dataIndex: "apiState",
        align: "center",
        scopedSlots: { customRender: "apiState" }
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
      selectedRowKeys: [], // Check here to configure the default column
      hasDeleteArr: [], // 待删除的id
      loading: false,
      codeTableList: [],
      paginationPageSize: "",
      fetchData: {
        apiType: undefined,
        startTime: "",
        endTime: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
        sort: 1 // 0 :升序  1：倒序
      },
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
    this.fetchApiManageList();
    this.fetchCodeTable();
  },
  computed: {
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
    //点击左侧复选框
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = [
        ...new Set(
          [...selectedRowKeys].filter(
            item => this.hasDeleteArr.indexOf(item) === -1
          )
        )
      ];
    },
    //禁选开始日期
    /*
     * new Date()  ==> Wed Aug 12 2020 10:01:34 GMT+0800 (中国标准时间)
     * new Date().valueOf() ==> 1597197690554
     */
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
    //添加模态框
    showConponentsModal(type, record) {
      // 调用子组件方法并传值给子组件
      this.$refs.createAndUpdateApi.showModal(type, record);
    },
    //查看调用量详情模态框
    showUseNumDetailModal(id) {
      this.$refs.useNum.showModal(id);
    },
    // 翻页、排序事件
    tableChange(pagination, filters, sorter) {
      // 记录当前选中的每页展示条数
      this.paginationPageSize = pagination.pageSize;
      //翻页
      if (pagination.pageSize !== this.fetchData.pageSize) {
        this.pagination.current = 1;
        this.fetchData.pageIndex = 1;
        this.fetchData.pageSize = pagination.pageSize;
        this.fetchApiManageList();
      } else if (pagination.current !== this.fetchData.pageIndex) {
        const { current } = pagination;
        this.pagination.current = current;
        this.fetchData.pageIndex = current;
        this.fetchApiManageList();
      } else if (
        pagination.pageSize === this.fetchData.pageSize &&
        pagination.current === this.fetchData.pageIndex
      ) {
        const { sortOrder } = this.columns[5];
        if (sortOrder === "ascend") {
          this.columns[5].sortOrder = "descend";
          this.fetchData.sort = 1;
          this.fetchApiManageList();
        } else {
          this.columns[5].sortOrder = "ascend";
          this.fetchData.sort = 0;
          this.fetchApiManageList();
        }
      }
    },
    //刷新数据
    handleRefresh() {
      //刷新数据之前先把请求条件设为默认值
      this.fetchData = {
        apiType: undefined,
        startTime: moment()
          .subtract("weeks", 1)
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        keyword: "",
        pageIndex: 1,
        pageSize: this.paginationPageSize || 10,
        sort: 1
      };
      this.pagination.current = 1;
      this.fetchApiManageList();
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.pageIndex = page;
      this.fetchApiManageList();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.pageIndex = 1;
      this.fetchApiManageList();
    },
    //表格启停弹框
    showConfirm(record) {
      const key = "openapi021"; //当前提示的唯一标志
      let { apiId, apiState } = record;
      /*
       * 根据这一行的数据 里面的apiState 来判断，
       * 从而实现动态的文字提示，启用或者停止
       * 0 === 停止（关）
       * 1 === 开启（开）
       */
      const apiStateInfo = apiState === "0" ? "启用" : "停止";
      this.$confirm({
        title: `你确定要${apiStateInfo}该API吗？`,
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: async() => {
          this.$message.loading({
            content: `正在${apiStateInfo}...`,
            key
          });
          try {
            apiState = apiState === "1" ? "0" : apiState === "0" ? "1" : "";
            const changeRes = await this.changeApiState(apiState, apiId);
            if (changeRes.code === "200" && changeRes.result) {
              setTimeout(() => {
                this.$message.success({
                  content: `${apiStateInfo}成功！`,
                  key,
                  duration: 2
                });
                this.fetchApiManageList();
                //  重新请求数据
              }, 100);
            } else {
              setTimeout(() => {
                this.$message.error({
                  content: `${apiStateInfo}失败！`,
                  key,
                  duration: 3
                });
              }, 200);
            }
          } catch (error) {
            setTimeout(() => {
              this.$message.error({
                content: `${apiStateInfo}失败！` + error,
                key,
                duration: 3
              });
            }, 200);
          }
        }
      });
    },
    //表格单删除弹框
    showDeleteConfirm(id) {
      const key = "openapi01"; //当前提示的唯一标志
      let timer;
      clearTimeout(timer);
      this.$confirm({
        title: "你确定要删除这条数据吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          this.$message.loading({ content: "正在删除...", key });
          try {
            const res = await this.deleteApiManage([id]);
            if (res.code === "200" && res.result) {
              timer = setTimeout(() => {
                this.$message.success({
                  content: "删除成功！",
                  key,
                  duration: 2
                });
                // 把删除成功的数据id存下来
                this.hasDeleteArr = this.hasDeleteArr.concat([id]);
                /*
                 * 如果当前页只有一条数据并且删除了这条数据，就让请求的pageIndex 减 1
                 * 回到上一页
                 */
                if (
                  this.data.length === [id].length &&
                  this.fetchData.pageIndex > 1
                ) {
                  this.fetchData.pageIndex--;
                  this.pagination.current--;
                }
                // 在多选的情况下使用单个删除，保证选中的数组正确
                this.selectedRowKeys = [
                  ...new Set(
                    [...this.selectedRowKeys].filter(
                      item => [id].indexOf(item) === -1
                    )
                  )
                ];
                //  重新请求数据
                this.fetchApiManageList();
              }, 200);
            } else {
              timer = setTimeout(() => {
                this.$message.error({
                  content: "删除失败！",
                  key,
                  duration: 3
                });
              }, 200);
            }
          } catch (error) {
            timer = setTimeout(() => {
              this.$message.error({
                content: "删除失败！" + error,
                key,
                duration: 3
              });
            }, 200);
          }
        }
      });
    },
    //表格全选删除弹框
    showDeleteAllConfirm() {
      // deleteArr 已经确定要删除的项
      const deleteArr = this.selectedRowKeys;
      if (!deleteArr.length) {
        this.$message.warning("请选择要删除的项");
        return;
      }
      const key = "openapi012"; //当前提示的唯一标志
      let timer;
      clearTimeout(timer);
      this.$confirm({
        title: `确认删除选中的${deleteArr.length}条数据吗？`,
        content: "此操作可能误删，请你谨慎操作！",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          this.$message.loading({ content: "正在删除...", key });
          try {
            const res = await this.deleteApiManage(deleteArr);
            if (res.code === "200" && res.result) {
              timer = setTimeout(() => {
                this.$message.success({
                  content: "删除成功！",
                  key,
                  duration: 2
                });
                // 删除之后让pageIndex正常显示
                const { total } = this.pagination; //删除之前的总条数
                const { pageSize, pageIndex } = this.fetchData;
                let currentTotal = total - deleteArr.length; //删除之后的总条数
                let currentTotalPage = Math.ceil(currentTotal / pageSize); //删除之后的总页数
                //假如删除之后的总页数 <= 当前页码，就赋值给当前页码
                if (currentTotalPage <= pageIndex) {
                  this.pagination.current = currentTotalPage;
                  this.fetchData.pageIndex = currentTotalPage;
                }
                // 清空多选数组
                this.selectedRowKeys = [];
                //  重新请求数据
                this.fetchApiManageList();
              }, 100);
            } else {
              timer = setTimeout(() => {
                this.$message.error({
                  content: "删除失败！",
                  key,
                  duration: 3
                });
              }, 200);
            }
          } catch (error) {
            timer = setTimeout(() => {
              this.$message.error({
                content: "删除失败！" + error,
                key,
                duration: 3
              });
            }, 200);
          }
        }
      });
    },
    // query and search
    query() {
      this.fetchApiManageList();
    },
    /*
     * 数据请求函数
     */
    //获取API列表
    async fetchApiManageList() {
      let filterData = { ...this.fetchData };
      let { startTime, endTime } = filterData;
      /*
       * 将选择的时间转化为时间格式 2020-07-07
       */
      if (startTime) startTime = moment(startTime).format("YYYY-MM-DD");
      if (endTime) endTime = moment(endTime).format("YYYY-MM-DD");
      filterData = Object.assign(filterData, { startTime, endTime });
      /*
       * select只有设置了undefined的时候才会显示placeholder
       * 但是设置了undefined的时候发请求字段不存在
       * 所以过滤一下
       */
      if (filterData.apiType === undefined) filterData.apiType = "";
      this.loading = true;
      try {
        const res = await this.$api.ApiManagement.getApiManageList(filterData);
        if (res.code === "200" && res.result) {
          setTimeout(() => {
            this.data = res.data;
            this.pagination.total = res.total * 1;
            this.loading = false;
          }, 100);
        } else {
          setTimeout(() => {
            this.loading = false;
            this.$message.error("请求失败！");
          }, 200);
        }
      } catch (error) {
        setTimeout(() => {
          this.loading = false;
          this.$message.error("请求失败！" + error);
        }, 1000);
      }
    },
    //删除/批量删除
    async deleteApiManage(data) {
      return await this.$api.ApiManagement.deleteApiManage({
        apiId: data
      });
    },
    // 启停该API（更改状态）
    async changeApiState(apiState, apiId) {
      return await this.$api.ApiManagement.changeApiState({
        apiState,
        apiId
      });
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

<style lang="less" scoped>
.api-manage {
  padding: 15px;
  width: 100%;
  background: white;
  border-radius: 2px;
  .head {
    width: 100%;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .head-left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .head-right {
      /deep/ .ant-calendar-picker {
        width: 140px;
      }
      // /deep/ .ant-calendar-picker-input{
      //     width: 130px;;
      // }
      /deep/ .ant-calendar-picker {
        min-width: 140px !important;
      }
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
  .content {
    .ant-table-row:hover a {
      color: #0080ff;
    }
    a {
      color: #b0b0b0;
    }
  }
}
.filterNameAuthData {
  .ant-calendar {
    width: 250px;
  }
}
</style>
