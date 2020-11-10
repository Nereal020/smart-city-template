<template>
  <div class="APPBanner">
    <!-- 表格上方按钮栏 -->
    <div class="filter">
      <div>
        <a-button
          class="add-button"
          @click="addBanner"
          v-auth="['banner_create']"
        >
          <svg-icon
            icon-class="add"
            :scale="0.8"
            style="margin-right:5px"
          ></svg-icon
          >添加banner
        </a-button>
        <a-button
          class="delete-button"
          @click="deleteMany"
          v-auth="['banner_delete']"
        >
          <svg-icon
            icon-class="shanchu"
            :scale="0.8"
            style="margin-right:5px"
          ></svg-icon
          >批量删除
        </a-button>
      </div>
      <div v-auth="['banner_list']">
        <a-input
          v-model="filter.keyword"
          placeholder="请输入搜索内容"
          style="width:180px"
        >
          <svg-icon
            slot="prefix"
            icon-class="sousuo"
            :scale="0.8"
            style="margin-right:0px"
            :maxLength="20"
          ></svg-icon>
        </a-input>
        <!-- <Debounce :time="500" isDebounce>
          <button class="ant-btn ant-btn-primary search-button" type="primary" @click="search">搜索</button>
        </Debounce> -->
        <a-button class="search-button" type="primary" @click="search()"
          >搜索</a-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <!-- v-auth="['banner_list']" -->
      <a-table
        v-if="permit('banner_list')"
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
        <!-- 表格内按钮 -->
        <div slot="handle" slot-scope="text, row" class="handle-button">
          <a-button
            type="link"
            @click="editBanner(row)"
            v-auth="['banner_edit']"
          >
            <svg-icon
              icon-class="bianji"
              :scale="0.8"
              style="margin-right:5px"
            ></svg-icon
            >编辑
          </a-button>
          <a-button
            type="link"
            @click="deleteBanner(row.id)"
            v-auth="['banner_delete']"
          >
            <svg-icon
              icon-class="shanchu"
              :scale="0.8"
              style="margin-right:5px"
            ></svg-icon
            >删除
          </a-button>
        </div>

        <!-- 表格内开关 true:0  false:1-->
        <a-switch
          v-auth="['banner_changeState']"
          slot="showState"
          slot-scope="text, row"
          :checked="text ? false : true"
          @change="checked => changeShowState(checked, row.id)"
        />

        <!-- 表格内order -->
        <div
          class="order"
          slot="order"
          slot-scope="text, row, index"
          v-auth="['banner_changeOrder']"
        >
          <a-popover
            v-model="popoverTagVisible[index]"
            v-if="!row.showState"
            overlayClassName="popover-tag"
            trigger="click"
            placement="right"
            :key="row.id + text"
          >
            <template slot="content">
              <div class="select-order">
                <a-tag
                  v-for="item in 5"
                  :dsiabled="item === text"
                  :key="item"
                  :color="tagColor(item)"
                  @click="changeOrder(row, item, index)"
                  >{{ item }}</a-tag
                >
              </div>
            </template>
            <a-tag :color="tagColor(text)" v-if="!row.showState">{{
              text
            }}</a-tag>
          </a-popover>
        </div>

        <!-- 表格内图片 -->
        <template slot="image" slot-scope="text, row">
          <!-- {{text}} -->
          <img
            v-if="text"
            class="bannerTablePic"
            :src="picBaseUrl + text"
            :alt="row.name"
            @click="handlePreviewBanner(picBaseUrl + text)"
          />
        </template>
      </a-table>

      <!-- <a-spin tip="无权限"> -->
      <a-table
        class="no-promission"
        v-else
        bordered
        :columns="columns"
        :data-source="[]"
        :locale="{ emptyText: '无权限，请联系管理员' }"
      />
      <!-- </a-spin> -->
    </div>

    <!-- 新增编辑对话框 -->
    <a-modal
      v-model="visible"
      :title="isAdd ? '新增' : '编辑'"
      :footer="null"
      :maskClosable="false"
      wrapClassName="add-banner-modal"
      :destroyOnClose="true"
    >
      <a-form-model
        :model="form"
        ref="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <!-- Banner名称 -->
        <a-form-model-item ref="name" label="Banner名称" prop="name">
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
        <!-- Banner图片 -->
        <a-form-model-item ref="image" label="Banner图片" prop="image">
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
      wrapClassName="preview-banner-modal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import uploadImg from "@/components/common/uploadImg";
import { permit } from "../../directives/authIf.js";

const columns = [
  {
    align: "center",
    title: "Banner名称",
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
    title: "路径",
    ellipsis: true,
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
    title: "展现顺序",
    dataIndex: "order",
    scopedSlots: { customRender: "order" }
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
  components: { uploadImg },

  data() {
    return {
      data: [],
      columns,
      tableLoading: false, //表格加载状态
      confirmBtnLoading: false, //确定按钮加载状态
      filter: {
        keyword: "",
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
          this.pagination.current = 1;
          this.filter.pageIndex = 1;
          this.filter.pageSize = pageSize;
          this.getList();
        }
      },

      selectedRowKeys: [], // Check here to configure the default column
      visible: false, //新增编辑对话框的显示

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
            message: "请输入Banner名称！",
            trigger: "blur"
          }
        ],
        image: [
          {
            required: true,
            message: "请上传Banner图片！",
            trigger: "change"
          }
        ]
      },
      isAdd: true, //新增或编辑状态
      activeOrder: -1,
      deleteList: [], //待删除的列表
      popoverTagVisible: {
        // "1": false,
        // "2": false,
        // "3": false,
        // "4": false,
        // "5": false
      }, //popover弹出的显隐

      //图片预览
      previewImage: "", //图片预览地址
      previewVisible: false, //图片预览modal显隐
      hasDeleteArr: []
    };
  },

  computed: {
    tagColor() {
      return num => {
        switch (num) {
          case 1:
            return "red";
          case 2:
            return "orange";
          case 3:
            return "green";
          case 4:
            return "blue";
          case 5:
            return "purple";
          default:
            return "";
        }
      };
    },
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    permit,
    //添加
    addBanner() {
      this.form = {
        id: null,
        name: "",
        image: "",
        url: "",
        showState: 1
      };
      this.visible = true;
      this.isAdd = true;
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
          await this.deleteBannerReq();
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
      this.selectedRowKeys = [
        ...new Set(
          [...selectedRowKeys].filter(
            item => this.hasDeleteArr.indexOf(item) === -1
          )
        )
      ];
    },
    //点击预览表格内图片
    handlePreviewBanner(url) {
      // this.visible=false
      this.previewVisible = true;
      this.previewImage = url;
    },
    handleCancel() {
      this.previewVisible = false;
    },

    //编辑banner
    async editBanner(row) {
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

    //删除 banner
    deleteBanner(id) {
      this.$confirm({
        title: "确认删除这条数据吗?",
        content: "",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          this.deleteList = [id];
          await this.deleteBannerReq();
        }
      });
    },

    //确认新增，确认修改
    confirmAdd() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false;
        this.confirmBtnLoading = true;
        const result = await this.createAndUpdateBannerReq();
        this.visible = !result;
        // setTimeout(() => {
        this.confirmBtnLoading = false;
        // }, 500);
      });
    },

    //取消新增，取消修改
    cancelAdd() {
      this.visible = false;
    },

    //改变开关
    changeShowState(checked, id) {
      checked = checked ? 1 : 0;
      const data = { showState: checked, id };
      if (!checked) {
        data.order = null;
      }
      this.changeStateReq(data);
    },
    //展示改变顺序
    showOrder(text, index) {
      if (this.activeOrder >= 0) {
        this.activeOrder = -1;
      } else {
        this.activeOrder = index;
      }
    },

    //改变顺序
    changeOrder(row, order, index) {
      this.popoverTagVisible[index] = false;
      this.activeOrder = -1;
      this.changeOrderReq({ id: row.id, order });
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
      try {
        this.tableLoading = true;
        const res = await this.$api.MobileBanner.getBannerList(this.filter);
        if (res.code === "200") {
          // this.data = res.data.list || res.data;
          // this.pagination.total = res.data.total || res.total;
          let closeArr = res.data.filter(item => item.showState);
          let openArr = res.data.filter(item => !item.showState);
          openArr = openArr.sort((a, b) => a.order - b.order);
          this.data = openArr.concat(closeArr);
          // this.data = res.data;
          this.pagination.total = res.total;
        } else {
          this.$message.error("获取失败！" + res.message);
        }
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
        this.$message.error("请求失败！" + error);
      }
    },

    //新增，编辑
    async createAndUpdateBannerReq() {
      this.$message.loading({
        content: "正在" + (this.isAdd ? "新增" : "修改"),
        key: "add"
      });
      const { id, name, url, image } = this.form;
      try {
        const res = await this.$api.MobileBanner.createAndUpdateBanner({
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
        this.$message.error({ content: "请求失败！" + error, key: "add" });
      }
    },

    // 删除
    async deleteBannerReq() {
      this.$message.loading({
        content: "正在删除",
        key: "delete"
      });
      try {
        const res = await this.$api.MobileBanner.deleteBanner({
          ids: this.deleteList
        });
        if (res.code === "200") {
          this.$message.success({
            content: "删除成功！",
            key: "delete"
          });
          // 把删除成功的数据id存下来
          this.hasDeleteArr = this.hasDeleteArr.concat(this.deleteList);

          const { total } = this.pagination; //删除之前的总条数
          const { pageSize, pageIndex } = this.filter;
          let currentTotal = total - this.deleteList.length; //删除之后的总条数
          let currentTotalPage = Math.ceil(currentTotal / pageSize); //删除之后的总页数
          // console.log("currentTotalPage", currentTotalPage);
          //假如删除之后的总页数 <= 当前页码，就赋值给当前页码
          if (currentTotalPage <= pageIndex) {
            this.pagination.current = currentTotalPage;
            this.filter.pageIndex = currentTotalPage;
          }
          // this.pagination.current = 1;
          // this.filter.pageIndex = 1;
          this.selectedRowKeys = [
            ...new Set(
              [...this.selectedRowKeys].filter(
                item => this.deleteList.indexOf(item) === -1
              )
            )
          ];
          this.deleteList = [];
          this.getList();
        } else {
          this.$message.error({
            content: "删除失败！" + res.message,
            key: "delete"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "delete"
        });
      }
    },

    // 修改展现状态请求
    async changeStateReq(data) {
      this.$message.loading({
        content: "正在修改",
        key: "update"
      });
      this.tableLoading = true;
      try {
        const res = await this.$api.MobileBanner.changeBannerState(data);
        if (res.code === "200") {
          this.$message.success({
            content: "修改成功！",
            key: "update"
          });
          this.getList();
        } else {
          this.tableLoading = false;
          this.$message.error({
            content: "修改失败！" + res.message,
            key: "update"
          });
        }
      } catch (error) {
        this.tableLoading = false;
        this.$message.error({
          content: "请求失败！" + error,
          key: "update"
        });
      }
    },

    //修改顺序
    async changeOrderReq(data) {
      this.$message.loading({
        content: "正在修改",
        key: "update"
      });
      this.tableLoading = true;
      try {
        const res = await this.$api.MobileBanner.changeBannerOrder(data);
        if (res.code === "200") {
          this.$message.success({
            content: "修改成功！",
            key: "update"
          });
          this.getList();
        } else {
          this.tableLoading = false;
          this.$message.error({
            content: "修改失败！" + res.message,
            key: "update"
          });
        }
      } catch (error) {
        this.tableLoading = false;
        this.$message.error({
          content: "请求失败！" + error,
          key: "update"
        });
      }
    },

    validateImage(pathImg) {
      var ImgObj = new Image();
      ImgObj.src = pathImg;
      if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="less">
.APPBanner {
  height: 100%;
  overflow-y: auto;
  padding: 15px;
  background-color: #fff;
  .filter {
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

    .order {
      position: relative;
      // z-index: 99;
      .ant-tag {
        width: 22px;
        height: 22px;
      }
      & > span {
        cursor: pointer;
      }
    }
    //表格中的banner图片样式
    .bannerTablePic {
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

.add-banner-modal {
  .ant-modal-header {
    text-align: center;
  }
  .ant-modal-close-x:hover {
    color: #3b98f7;
  }

  .modal-button-box {
    text-align: center;
    // padding: 20px;
  }

  .ant-upload-select-picture-card {
    margin-bottom: -6px;
  }
}

.preview-banner-modal {
  .ant-modal-body {
    padding: 40px;
  }
}

//popover框样式
.popover-tag {
  // position: relative;
  .ant-popover-inner-content {
    height: 160px;
  }
  .select-order {
    position: absolute;
    left: 15px;
    top: 0px;
    display: flex;
    flex-direction: column;
    span {
      margin: 5px 0;
      cursor: pointer;
    }
  }
}

.preview-banner-modal {
  .ant-modal-body {
    padding: 40px;
  }
}
</style>