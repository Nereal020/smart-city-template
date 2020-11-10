
<template>
  <div class="APPAd">
    <!-- 表格上方按钮栏 -->
    <div class="filter">
      <div class="fliter-left">
        <a-button class="add-button" @click="addAd" v-auth="['AD_create']">
          <svg-icon
            icon-class="add"
            :scale="0.8"
            style="margin-right:5px"
          ></svg-icon
          >添加广告
        </a-button>
        <a-button
          class="delete-button"
          @click="deleteMany"
          v-auth="['AD_delete']"
        >
          <svg-icon
            icon-class="shanchu"
            :scale="0.8"
            style="margin-right:5px"
          ></svg-icon
          >批量删除
        </a-button>
      </div>
      <div class="fliter-right" v-auth="['AD_list']">
        <a-input
          v-model="filter.keyword"
          placeholder="请输入搜索内容"
          :maxLength="20"
          style="width:180px"
        >
          <svg-icon
            slot="prefix"
            icon-class="sousuo"
            :scale="0.8"
            style="margin-right:0px"
          ></svg-icon>
        </a-input>
        <a-button type="primary" @click="search" class="search-button"
          >搜索</a-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <a-table
        v-if="permit('AD_list')"
        bordered
        :loading="tableLoading"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowKey="row => row.id"
        :rowClassName="
          (record, index) => {
            return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
          }
        "
      >
        <!-- 表格内图片 -->
        <template slot="image" slot-scope="text, row">
          <!-- {{text}} -->
          <img
            v-if="text"
            class="ADTablePic"
            :src="picBaseUrl + text"
            :alt="row.name"
            @click="handlePreviewAD(picBaseUrl + text)"
          />
        </template>
        <!-- 表格内开关 -->
        <a-switch
          v-auth="['AD_changeState']"
          slot="showState"
          slot-scope="text, row"
          :checked="text ? false : true"
          @change="checked => changeShowState(checked, row.id)"
        />
        <!-- 表格内按钮 -->
        <div slot="handle" slot-scope="text, row" class="handle-button">
          <a-button type="link" @click="editAd(row)" v-auth="['AD_edit']">
            <svg-icon
              icon-class="bianji"
              :scale="0.8"
              style="margin-right:5px"
            ></svg-icon
            >编辑
          </a-button>
          <a-button
            type="link"
            @click="deleteAd(row.id)"
            v-auth="['AD_delete']"
          >
            <svg-icon
              icon-class="shanchu"
              :scale="0.8"
              style="margin-right:5px"
            ></svg-icon
            >删除
          </a-button>
        </div>
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

    <!-- 新增编辑对话框 -->
    <a-modal
      v-model="visible"
      :footer="null"
      :title="isAdd ? '新增' : '编辑'"
      :maskClosable="false"
      wrapClassName="add-Ad-modal"
      :destroyOnClose="true"
    >
      <a-form-model
        :model="form"
        ref="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <!-- Ad名称 -->
        <a-form-model-item ref="name" label="广告名称" prop="name">
          <a-input
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
            :maxLength="20"
          />
        </a-form-model-item>
        <!-- Ad图片 -->
        <a-form-model-item ref="image" label="广告图片" prop="image">
          <uploadImg
            ref="uploadImg"
            @changeFormImage="changeFormImage"
            @resetFormImage="resetFormImage"
          />
        </a-form-model-item>
        <!-- 路径 -->
        <a-form-model-item ref="url" label="路径" prop="url">
          <a-input
            v-model="form.url"
            @blur="
              () => {
                $refs.url.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <div class="modal-button-box">
          <!-- <a-form-model-item> -->
          <a-button
            type="primary"
            :loading="confirmBtnLoading"
            @click="confirmAdd()"
            style="margin-right:30px"
            >确定</a-button
          >
          <a-button @click="cancelAdd()" style="margin-top:10px">取消</a-button>
          <!-- </a-form-model-item> -->
        </div>
      </a-form-model>
    </a-modal>

    <!-- 图片预览 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      wrapClassName="preview-AD-modal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { permit } from "../../directives/authIf.js";

const columns = [
  {
    align: "center",
    title: "广告名称",
    dataIndex: "name"
  },
  {
    align: "center",
    title: "图片",
    dataIndex: "image",
    scopedSlots: { customRender: "image" }
  },
  {
    align: "center",
    ellipsis: true,
    title: "路径",
    dataIndex: "url"
  },
  {
    align: "center",
    title: "是否展现",
    dataIndex: "showState",
    scopedSlots: { customRender: "showState" }
  },
  {
    align: "center",
    title: "操作",
    scopedSlots: { customRender: "handle" }
  }
];

message.config({
  top: `60px`,
  duration: 2,
  maxCount: 1
});

export default {
  data() {
    return {
      tableLoading: false,
      confirmBtnLoading: false, //确定按钮加载状态
      filter: {
        keyword: "",
        pageIndex: 1,
        pageSize: 10
      },
      data: [],
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false, //新增编辑对话框的显示
      isAdd: true, //新增或编辑状态

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
          this.pagination.current = 1;
          this.filter.pageIndex = 1;
          this.filter.pageSize = pageSize;
          this.getList();
        }
      },

      form: {
        id: null,
        name: "",
        image: "",
        url: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入广告名称！",
            trigger: "blur"
          }
        ],
        image: [
          {
            required: true,
            message: "请上传广告图片！",
            trigger: "blur"
          }
        ]
      },
      //图片预览
      previewImage: "", //图片预览地址
      previewVisible: false, //图片预览modal显隐
      hasDeleteArr: []
    };
  },

  created() {
    this.getList();
  },

  computed: {
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },

  methods: {
    permit,
    //添加
    addAd() {
      this.form = {
        name: "",
        image: "",
        url: ""
      };
      this.visible = true;
      this.isAdd = true;
    },

    //确认新增，确认修改
    confirmAdd() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false;
        this.confirmBtnLoading = true;
        const result = await this.createAndUpdateADReq();
        this.visible = !result;
        // setTimeout(() => {
        this.confirmBtnLoading = false;
        // }, 500);
      });
    },
    //cancelAdd
    cancelAdd() {
      this.visible = false;
    },

    handleCancel() {
      this.previewVisible = false;
    },
    handlePreviewAD(url) {
      // this.visible=false
      this.previewVisible = true;
      this.previewImage = url;
    },

    //批量删除
    deleteMany() {
      const { selectedRowKeys } = this;
      if (!selectedRowKeys.length) return message.warn("请至少选中一条数据！");
      this.$confirm({
        title: `确认删除选中的 ${selectedRowKeys.length} 条数据吗?`,
        content: "",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          this.deleteList = selectedRowKeys;
          await this.deleteADReq({ type: 0, deleteList: this.deleteList });
        }
      });
    },
    //搜索
    search() {
      this.pagination.current = 1;
      this.filter.pageIndex = 1;
      this.getList();
    },

    //点击左侧复选框
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys);
      this.selectedRowKeys = [
        ...new Set(
          [...selectedRowKeys].filter(
            item => this.hasDeleteArr.indexOf(item) === -1
          )
        )
      ];
    },
    //编辑Ad
    async editAd(row) {
      this.isAdd = false;
      this.visible = true;
      this.form = { ...row };
      await this.$nextTick();
      this.$refs.uploadImg.fileList = [
        {
          uid: row.id,
          name: row.name,
          status: "done",
          url: this.picBaseUrl + row.image
        }
      ];
    },

    //删除 Ad
    deleteAd(id) {
      this.$confirm({
        title: "确认删除这条数据吗?",
        content: "",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          this.deleteList = [id];
          await this.deleteADReq({ type: 0, deleteList: this.deleteList });
        }
      });
    },

    //改变开关
    changeShowState(checked, id) {
      this.deleteADReq({ type: 1, id, showState: checked });
    },

    //传给 上传图片组件的方法
    changeFormImage(data) {
      this.form = { ...this.form, image: data };
      this.$nextTick(() => {
        this.$refs.form.validateField("image");
      });
    },

    resetFormImage() {
      this.form.image = null;
      this.$refs.form.validateField("image");
    },

    //请求方法
    //获取列表
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.MobileAdvertising.getADList(this.filter);
        if (res.code === "200") {
          let closeArr = res.data.filter(item => item.showState);
          let openArr = res.data.filter(item => !item.showState);
          this.data = openArr.concat(closeArr);
          // this.data = res.data;
          this.pagination.total = res.total;
        } else {
          this.$message.error("获取失败" + res.message);
        }
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
        this.$message.error("请求失败" + error);
      }
    },

    //新增，编辑
    async createAndUpdateADReq() {
      this.$message.loading({
        content: "正在" + (this.isAdd ? "新增" : "修改"),
        key: "add"
      });
      const { id, name, url, image } = this.form;
      try {
        const res = await this.$api.MobileAdvertising.createAndUpdateAD({
          id,
          name,
          url,
          image
        });
        if (res.code === "200") {
          this.$message.success({
            content: (this.isAdd ? "新增" : "修改") + "成功！",
            key: "add"
          });
          this.getList();
          return true;
        } else {
          this.$message.error({
            content: (this.isAdd ? "新增" : "修改") + "失败！" + res.message,
            key: "add"
          });
          return false;
        }
      } catch (error) {
        this.$message.error({ content: "请求失败" + error, key: "add" });
      }
    },

    // 删除 或 更改状态
    async deleteADReq(data) {
      this.$message.loading({
        content: "正在" + data.type ? "删除" : "修改",
        key: "delete"
      });
      if (data.type === 1) {
        this.tableLoading = true;
      }
      try {
        const res = await this.$api.MobileAdvertising.deleteAD(data);
        if (res.code === "200") {
          if (data.type === 0) {
            // 把删除成功的数据id存下来
            this.hasDeleteArr = this.hasDeleteArr.concat(this.deleteList);

            const { total } = this.pagination;
            const { pageSize, pageIndex } = this.filter;
            let currentTotal = total - this.deleteList.length;
            let currentTotalPage = Math.ceil(currentTotal / pageSize);
            // console.log("currentTotalPage", currentTotalPage);
            if (currentTotalPage <= pageIndex) {
              this.pagination.current = currentTotalPage;
              this.filter.pageIndex = currentTotalPage;
            }
            // this.selectedRowKeys = [];
            this.selectedRowKeys = [
              ...new Set(
                [...this.selectedRowKeys].filter(
                  item => this.deleteList.indexOf(item) === -1
                )
              )
            ];
            this.deleteList = [];
            this.$message.success({
              content: "删除成功",
              key: "delete"
            });
            // this.pagination.current = 1;
            // this.filter.pageIndex = 1;
          } else {
            this.$message.success({
              content: "修改成功",
              key: "delete"
            });
          }
          this.getList();
        } else {
          this.tableLoading = false;
          if (data.type === 0) {
            this.$message.error({
              content: "删除失败！" + res.message,
              key: "delete"
            });
          } else {
            this.$message.error({
              content: "修改失败！" + res.message,
              key: "delete"
            });
          }
        }
      } catch (error) {
        this.tableLoading = false;
        this.$message.error({
          content: "请求失败！" + error,
          key: "delete"
        });
      }
    },

    // 修改展现状态请求 ----废弃
    async changeStateReq(data) {
      try {
        const res = await this.$api.MobileAdvertising.changeBannerState(data);
        if (res.code === "200") {
        }
      } catch (error) {
        this.$message.error("请求失败" + error);
      }
    }
  }
};
</script>

<style lang="less">
.APPAd {
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  padding: 15px;
  .filter {
    // padding: 20px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    .add-button {
      margin-right: 15px;
      background-color: #efb95c;
      border-color: #efb95c;
      color: #fff;
    }
    .delete-button {
      background-color: #f47171;
      border-color: #f47171;
      color: #fff;
    }
    .search-button {
      margin-left: 15px;
    }
  }
  .table {
    .handle-button .ant-btn-link {
      color: #b2b2b2;
      padding: 0;
      margin: 0 5px;
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
    .ADTablePic {
      height: 40px;
      cursor: pointer;
      &:hover {
        opacity: 0.5;
      }
    }
    .ant-table-tbody {
      .ant-table-row {
        td:nth-child(3) {
          padding: 0px;
        }
      }
    }
  }
}

.add-Ad-modal {
  .ant-modal-header {
    text-align: center;
  }
  .ant-modal-close-x:hover {
    color: #3b98f7;
  }

  .modal-button-box {
    text-align: center;
  }
}

.preview-AD-modal {
  .ant-modal-body {
    padding: 40px;
  }
}
</style>