/*
 * @Page: APP更新页面
 * @Author: mikey.WuQiao
 * @Date: 2020-08-03 09:54:13
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-10-14 17:29:53
 */
<template>
  <div class="app-update">
    <!-- 搜索功能区 -->
    <div class="head">
      <div class="head-left">
        <a-button
          v-auth="['APP_add']"
          type="primary"
          class="add"
          style="margin-right:10px;"
          @click="showComponentsModal('add')"
        >
          <svg-icon
            icon-class="add"
            :scale="0.8"
            style="margin-right:3px;"
          />发布新版本
        </a-button>
        <a-button
          type="danger"
          class="danger"
          v-auth="['APP_delete']"
          @click="showDeleteAllConfirm()"
        >
          <svg-icon
            icon-class="shanchu"
            :scale="0.8"
            style="margin-right:3px;"
          />批量删除
        </a-button>
      </div>

      <div class="head-right" v-auth="['APP_list']">
        <a-select
          style="width: 120px"
          v-model="fetchData.platform"
          allowClear
          placeholder="应用平台"
        >
          <a-select-option value="0">Android</a-select-option>
          <a-select-option value="1">iOS</a-select-option>
        </a-select>
        <a-select
          style="width: 120px;margin:0 10px;"
          v-model="fetchData.updateLevel"
          placeholder="更新等级"
          allowClear
        >
          <a-select-option value="1">强制更新</a-select-option>
          <a-select-option value="2">非强制提示更新</a-select-option>
          <a-select-option value="3">非强制不提示更新</a-select-option>
        </a-select>
        <a-select
          style="width: 120px"
          v-model="fetchData.appState"
          allowClear
          placeholder="状态"
        >
          <a-select-option value="1">上架</a-select-option>
          <a-select-option value="0">下架</a-select-option>
        </a-select>

        <div class="components-input-demo-presuffix">
          <a-input
            :allowClear="true"
            v-model.trim="fetchData.keyword"
            @keyup.enter="query"
            placeholder="请输入搜索内容"
            style="margin:0 10px;width:180px;"
          >
            <svg-icon
              slot="prefix"
              icon-class="sousuo"
              :scale="0.8"
              style="margin-right:5px;"
            />
          </a-input>
        </div>
        <a-button type="primary" class="primary" @click="query">搜索</a-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="content">
      <a-table
        v-if="permit('APP_list')"
        bordered
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :pagination="pagination"
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :rowKey="row => row.appUId"
        @change="tableChange"
      >
        <span slot="number" slot-scope="text, record">{{ record.appUId }}</span>
        <span slot="versionsCode" slot-scope="text">{{ text || "--" }}</span>
        <span slot="platform" slot-scope="text">{{
          text === "0" ? "Android" : text === "1" ? "iOS" : ""
        }}</span>
        <span slot="updateLevel" slot-scope="text">{{
          text === "1"
            ? "强制更新"
            : text === "2"
            ? "非强制提示更新"
            : text === "3"
            ? "非强制不提示更新"
            : ""
        }}</span>
        <span slot="uploadTime" slot-scope="text">
          <template v-if="text">{{ text }}</template>
          <template v-else>--</template>
        </span>
        <span slot="appState" slot-scope="text, record">
          <!-- :style="record.appState === '0' ? 'color:rgb(1, 223, 1)' : record.appState === '1' ? 'color:rgb(247, 129, 243)' : '--'" -->
          <!-- checked-children="上架" un-checked-children="下架" -->
          <a-switch
            v-auth="['APP_startAndStop']"
            :checked="record.appState === '0' ? false : true"
            style="margin-bottom:5px"
            @click="showAppStateConfirm(null, null, record)"
          />
          <!-- {{record.appState === '0' ? '下架' : record.appState === '1' ? '上架' : '--'}} -->
        </span>
        <span slot="action" slot-scope="text, record">
          <a
            class="a-btn"
            v-auth="['APP_edit']"
            @click="showComponentsModal('edit', record)"
            style="margin-right:12px;"
          >
            <svg-icon
              icon-class="bianji"
              :scale="0.8"
              style="margin-right:2px;"
            />编辑
          </a>
          <!-- <a-divider type="vertical" /> -->
          <a
            class="a-btn"
            v-auth="['APP_delete']"
            @click="showDeleteConfirm(record.appUId)"
          >
            <svg-icon
              icon-class="shanchu"
              :scale="0.8"
              style="margin-right:2px;"
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
      <CreateAndUpdateAppUpdate ref="createAndUpdateAppUpdate" />
    </div>
  </div>
</template>

<script>
import CreateAndUpdateAppUpdate from "./components/CAUAppUpdate";
import { permit } from "../../directives/authIf.js";

export default {
  name: "appUpdate",
  components: { CreateAndUpdateAppUpdate },
  data() {
    const columns = [
      {
        title: "编号",
        dataIndex: "number",
        align: "center",
        scopedSlots: { customRender: "number" }
      },
      {
        title: "版本名称",
        dataIndex: "versionsName",
        align: "center"
      },
      {
        title: "版本Code",
        dataIndex: "versionsCode",
        align: "center",
        scopedSlots: { customRender: "versionsCode" }
      },
      {
        title: "平台",
        dataIndex: "platform",
        align: "center",
        scopedSlots: { customRender: "platform" }
      },
      {
        title: "更新等级",
        dataIndex: "updateLevel",
        align: "center",
        scopedSlots: { customRender: "updateLevel" }
      },
      {
        title: "上架状态",
        dataIndex: "appState",
        align: "center",
        scopedSlots: { customRender: "appState" }
      },
      {
        title: "创建时间",
        dataIndex: "uploadTime",
        align: "center",
        scopedSlots: { customRender: "uploadTime" },
        sortOrder: "descend",
        sorter: true
        // sorter: (a, b) => moment(a.uploadTime) - moment(b.uploadTime)
      },
      {
        title: "操作",
        dataIndex: "action",
        align: "center",
        scopedSlots: { customRender: "action" }
      }
    ];
    return {
      fetchData: {
        platform: undefined,
        updateLevel: undefined,
        appState: undefined,
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
        sort: 1 // 0 :升序  1：倒序
      },
      data: [],
      columns,
      btnDisabled: true,
      loading: false,
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
      }, // table的分页器
      selectedRowKeys: [], // Check here to configure the default column
      hasDeleteArr: [] // 待删除的id
    };
  },
  computed: {
  },
  mounted() {
    this.fetchAppUpdateList();
  },
  methods: {
    permit,
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
    //添加模态框
    showComponentsModal(type, record) {
      this.$refs.createAndUpdateAppUpdate.showModal(type, record);
    },
    // 翻页、排序事件
    tableChange(pagination, filters, sorter) {
      //翻页
      if (pagination.pageSize !== this.fetchData.pageSize) {
        this.pagination.current = 1;
        this.fetchData.pageIndex = 1;
        this.fetchData.pageSize = pagination.pageSize;
        this.fetchAppUpdateList();
      } else if (pagination.current !== this.fetchData.pageIndex) {
        const { current } = pagination;
        this.pagination.current = current;
        this.fetchData.pageIndex = current;
        this.fetchAppUpdateList();
      } else if (
        pagination.pageSize === this.fetchData.pageSize &&
        pagination.current === this.fetchData.pageIndex
      ) {
        const { sortOrder } = this.columns[6];
        if (sortOrder === "ascend") {
          this.columns[6].sortOrder = "descend";
          this.fetchData.sort = 1;
          this.fetchAppUpdateList();
        } else {
          this.columns[6].sortOrder = "ascend";
          this.fetchData.sort = 0;
          this.fetchAppUpdateList();
        }
      }
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.pageIndex = page;
      this.fetchAppUpdateList();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.pageIndex = 1;
      this.fetchAppUpdateList();
    },
    //表格启停弹框
    showAppStateConfirm(state, id, record) {
      // 修改了正在上架的版本信息之后，会将该版本下架，需要重新手动上架、。
      if (state && id) {
        if (state === "1") {
          state = "0";
          this.changeAppState(state, id).then(res => {
            if (res.code === "200" && res.result) {
              // this.$message.warn("修改上架状态的版本之后默认是下架状态！")
              this.$notification.warning({
                message: "操作提示：",
                description:
                  "你修改了正在上架的版本信息，修改之后默认是下架状态，需要你手动更改上架！"
              });
              //  重新请求数据
              this.fetchAppUpdateList();
            }
          });
        }
      }
      const key = "updatable2"; //当前提示的唯一标志
      if (record) {
        let { appState, appUId } = record;
        /*
         * 根据这一行的数据 里面的appState 来判断，
         * 从而实现动态的文字提示，上架或者下架
         */
        const appStateInfo = appState === "1" ? "下架" : "上架";
        this.$confirm({
          title: `你确定要${appStateInfo}当前版本？`,
          okText: "确定",
          cancelText: "取消",
          onOk: async() => {
            this.$message.loading({
              content: `正在${appStateInfo}...`,
              key
            });
            try {
              appState = appState === "1" ? "0" : appState === "0" ? "1" : "";
              const changeRes = await this.changeAppState(appState, appUId);
              if (changeRes.code === "200" && changeRes.result) {
                setTimeout(() => {
                  this.$message.success({
                    content: `${appStateInfo}成功！`,
                    key,
                    duration: 2
                  });
                  //  重新请求数据
                  this.fetchAppUpdateList();
                }, 100);
              } else {
                setTimeout(() => {
                  this.$message.error({
                    content: `${appStateInfo}失败！`,
                    key,
                    duration: 3
                  });
                }, 200);
              }
            } catch (error) {
              setTimeout(() => {
                this.$message.error({
                  content: `${appStateInfo}失败！` + error,
                  key,
                  duration: 3
                });
              }, 200);
            }
          }
        });
      }
    },
    //表格单删除弹框
    showDeleteConfirm(id) {
      const key = "updatable01"; //当前提示的唯一标志
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
            const res = await this.deleteAppUpdate([id]);
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
                this.fetchAppUpdateList();
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
    //表格全选删除弹框
    showDeleteAllConfirm() {
      // deleteArr 已经确定要删除的项
      const deleteArr = this.selectedRowKeys;
      if (!deleteArr.length) {
        this.$message.warning("请选择要删除的项!");
        return;
      }
      const key = "updatable312"; //当前提示的唯一标志
      let timer;
      clearTimeout(timer);
      this.$confirm({
        title: `确认删除选中的${deleteArr.length}条数据吗？`,
        content: "此操作可能误删，请谨慎操作！",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          this.$message.loading({ content: "正在删除...", key });
          try {
            const res = await this.deleteAppUpdate(deleteArr);
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
                this.fetchAppUpdateList();
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
      this.fetchAppUpdateList();
    },
    // 获取APP更新版本列表
    async fetchAppUpdateList() {
      const filterData = { ...this.fetchData };
      let timer;
      clearTimeout(timer);
      /*
       * select只有设置了undefined的时候才会显示placeholder
       * 但是设置了undefined的时候发请求字段不存在
       * 所以过滤一下
       */
      if (filterData.platform === undefined) {
        filterData.platform = "";
      }
      if (filterData.updateLevel === undefined) {
        filterData.updateLevel = "";
      }
      if (filterData.appState === undefined) {
        filterData.appState = "";
      }
      this.loading = true;
      try {
        const res = await this.$api.AppUpdate.getAppUpdateList(filterData);
        if (res.code === "200" && res.result) {
          timer = setTimeout(() => {
            this.loading = false;
            // 将res赋值给data
            this.data = res.data;
            // 赋值total
            this.pagination.total = res.total;
          }, 100);
        } else {
          timer = setTimeout(() => {
            this.loading = false;
            this.$message.error("获取失败！" + res.message);
          }, 200);
        }
      } catch (error) {
        this.loading = false;
        this.$message.error("获取失败！" + error);
      } finally {
        timer = setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    },
    // 删除/批量删除APP更新版本
    async deleteAppUpdate(data) {
      return await this.$api.AppUpdate.deleteAppUpdate({ appUId: data });
    },
    // 更改版本上架状态
    async changeAppState(appState, appUId) {
      return await this.$api.AppUpdate.changeAppState({
        appState,
        appUId
      });
    }
  }
};
</script>

<style lang="less">
.ant-notification-close-icon {
  transition: transform 0.4s ease-out;
}
.ant-notification-close-x:hover .ant-notification-close-icon {
  transform: rotateZ(180deg);
}
.app-update {
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
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .head-right {
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
    .a-btn {
      color: #b0b0b0;
    }
  }
}
</style>
