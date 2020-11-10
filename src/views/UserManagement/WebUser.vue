/* @Page: WEB端用户管理
 * @Author: mikey.WuQiao
 * @Date: 2020-07-31 16:30:48
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-10-15 15:18:45
 */
<template>
  <div class="web-user">
    <!-- 搜索功能区 -->
    <div class="head">
      <div class="head-left">
        <a-button
          v-auth="['WebUser_add']"
          type="primary"
          style="margin-right:10px;"
          class="add"
          @click="showCreateAndUpdateModal('add')"
        >
          <svg-icon
            icon-class="add"
            :scale="0.8"
            style="margin-right:3px;"
          />添加用户
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
            style="margin-right:3px;"
          />批量删除
        </a-button>
        <a-button
          v-auth="['WebUser_list']"
          type="primary"
          class="primary"
          @click="handleRefresh()"
        >
          <a-icon type="sync" />刷新数据
        </a-button>
      </div>
      <div class="head-right" v-auth="['WebUser_list']">
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
        <!-- 选择账号类型 -->
        <a-select
          v-model="fetchData.type"
          style="width: 120px;margin:0 10px;"
          placeholder="类型"
          allowClear
        >
          <a-select-option
            :value="item.roleId"
            v-for="item of listRoles"
            :key="item.roleId"
            >{{ item.roleName }}</a-select-option
          >
        </a-select>
        <!-- 搜索关键字 -->
        <div class="components-input-demo-presuffix">
          <a-input
            ref="userNameInput"
            :allowClear="true"
            @keyup.enter="query()"
            v-model.trim="fetchData.keyword"
            placeholder="请输入搜索内容"
            style="width:180px;"
          >
            <svg-icon
              slot="prefix"
              icon-class="sousuo"
              :scale="0.8"
              style="margin-right:3px;"
            />
          </a-input>
        </div>
        <a-button
          type="primary"
          class="primary"
          style="margin-left:10px;"
          @click="query()"
          >搜索</a-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="content">
      <a-table
        v-if="permit('WebUser_list')"
        bordered
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :pagination="pagination"
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :rowKey="row => row.webUId"
        @change="tableChange"
      >
        <span slot="contact" slot-scope="text">{{ text ? text : "--" }}</span>
        <span slot="roleId" slot-scope="text">{{
          changeAccountType(text)
        }}</span>
        <span slot="time" slot-scope="text">{{ text ? text : "--" }}</span>
        <span slot="action" slot-scope="text, record">
          <a
            class="a-btn"
            style="margin-right:12px;"
            v-auth="['WebUser_edit']"
            @click="showCreateAndUpdateModal('edit', record)"
          >
            <svg-icon
              icon-class="bianji"
              :scale="0.8"
              style="margin-right:5px;"
            />编辑
          </a>
          <!-- <a-divider type="vertical" /> -->
          <a
            class="a-btn"
            v-auth="['WebUser_delete']"
            @click="showDeleteConfirm(record.webUId)"
          >
            <svg-icon
              icon-class="shanchu"
              :scale="0.8"
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
      <CreateAndUpdateWebUser ref="createAndUpdateWebUser" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { permit } from "../../directives/authIf";
import CreateAndUpdateWebUser from "./components/CAUWebUser";

export default {
  name: 'WebUser',
  components: { CreateAndUpdateWebUser },
  data() {
    const columns = [
      {
        title: "账号",
        dataIndex: "account",
        align: "center"
      },
      {
        title: "用户名称",
        dataIndex: "userName",
        align: "center"
      },
      {
        title: "联系人",
        dataIndex: "contact",
        align: "center",
        scopedSlots: { customRender: "contact" }
      },
      {
        title: "电话",
        dataIndex: "phone",
        align: "center"
      },
      {
        title: "账号类型",
        dataIndex: "roleId",
        align: "center",
        scopedSlots: { customRender: "roleId" }
      },
      {
        title: "创建时间",
        dataIndex: "time",
        align: "center",
        scopedSlots: { customRender: "time" },
        sortOrder: "descend",
        sorter: true
        // sorter: (a, b) => moment(a.time) - moment(b.time),
      },
      {
        title: "操作",
        dataIndex: "action",
        align: "center",
        scopedSlots: { customRender: "action" }
      }
    ];
    return {
      data: [], // 存放后台数据
      columns,
      loading: false,
      listRoles: [], // 账号类型
      paginationPageSize: "", // 记录当前选中的每页展示条数
      selectedRowKeys: [], // Check here to configure the default column
      hasDeleteArr: [], // 待删除的id
      fetchData: {
        startTime: "",
        endTime: "",
        type: undefined,
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
    this.fetchWebUserList();
    this.$refs.createAndUpdateWebUser.fetchListRoles().then(res => {
      if (res.code === "200" && res.result) {
        this.listRoles = res.data;
      }
    });
  },
  computed: {
  },
  methods: {
    permit,
    // 表格内账号类型转换
    changeAccountType(e) {
      let typeName;
      for (let i = 0; i < this.listRoles.length; i++) {
        if (Number(e) === this.listRoles[i].roleId) {
          typeName = this.listRoles[i].roleName;
        }
      }
      return typeName;
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
    showCreateAndUpdateModal(type, record) {
      this.$refs.createAndUpdateWebUser.showModal(type, record);
    },
    //查看调用量详情模态框
    showUseNumDetailModal() {
      this.$refs.useNum.showModal();
    },
    //刷新数据
    handleRefresh() {
      // 刷新数据之前先将搜索条件重置
      this.fetchData = {
        startTime: moment()
          .subtract("weeks", 1)
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        type: undefined,
        keyword: "",
        pageIndex: 1,
        pageSize: this.paginationPageSize || 10,
        sort: 1
      };
      this.pagination.current = 1;
      this.fetchWebUserList();
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
        this.fetchWebUserList();
      } else if (pagination.current !== this.fetchData.pageIndex) {
        const { current } = pagination;
        this.pagination.current = current;
        this.fetchData.pageIndex = current;
        this.fetchWebUserList();
      } else if (
        pagination.pageSize === this.fetchData.pageSize &&
        pagination.current === this.fetchData.pageIndex
      ) {
        const { sortOrder } = this.columns[5];
        if (sortOrder === "ascend") {
          this.columns[5].sortOrder = "descend";
          this.fetchData.sort = 1;
          this.fetchWebUserList();
        } else {
          this.columns[5].sortOrder = "ascend";
          this.fetchData.sort = 0;
          this.fetchWebUserList();
        }
      }
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.pageIndex = page;
      this.fetchWebUserList();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.pageIndex = 1;
      this.fetchWebUserList();
    },
    //表格单删除弹框
    showDeleteConfirm(id) {
      const key = "webuser1"; //当前提示的唯一标志
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
            const res = await this.deleteWebUser([id]);
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
                this.fetchWebUserList();
              }, 100);
            } else {
              timer = setTimeout(() => {
                this.$message.error({
                  content: "删除失败！" + res.msg,
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
      const deleteArr = this.selectedRowKeys;
      if (!deleteArr.length) {
        this.$message.warning("请选择要删除的项");
        return;
      }
      const key = "webuser11"; //当前提示的唯一标志
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
            const res = await this.deleteWebUser(deleteArr);
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
                // 清空数组
                this.selectedRowKeys = [];
                //  重新请求数据
                this.fetchWebUserList();
              }, 200);
            } else {
              timer = setTimeout(() => {
                this.$message.error({
                  content: "删除失败！" + res.msg,
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
    // 搜索
    query() {
      this.fetchWebUserList();
    },
    // 获取web端用户列表
    async fetchWebUserList() {
      let timer;
      clearTimeout(timer);
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
      this.loading = true;
      if (filterData.type === undefined) filterData.type = "";
      try {
        const res = await this.$api.WebUser.getWebUserList(filterData);
        if (res.code === "200" && res.result) {
          timer = setTimeout(() => {
            this.loading = false;
            this.data = res.data;
            this.pagination.total = res.total;
          }, 100);
        } else {
          timer = setTimeout(() => {
            this.loading = false;
            this.$message.error("请求失败！" + res.msg);
          }, 200);
        }
      } catch (error) {
        timer = setTimeout(() => {
          this.loading = false;
          this.$message.error("请求失败！" + error);
        }, 200);
      }
    },
    //删除/批量删除web端用户
    async deleteWebUser(data) {
      return await this.$api.WebUser.deleteWebUser({ webUId: data });
    }
  }
};
</script>

<style lang="less">
.web-user {
  padding: 15px;
  width: 100%;
  background: white;
  border-radius: 2px;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 76px;
    .head-right {
      /deep/ .ant-calendar-picker-input {
        width: 140px;
      }
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
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
