<template>
  <div>
    <a-modal
      v-model="authListVisible"
      title="登录授权应用"
      wrapClassName="appuser-authList-modal"
      :footer="null"
      :maskClosable="false"
      width="800px"
    >
      <!-- 表格 -->
      <div class="table">
        <a-table
          :loading="tableLoading"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :rowKey="(row=>row.id)"
          :scroll="{ y: 600 }"
          :rowClassName="(record, index)=>{return (index%2===1?'even-row':'') +' every-row'}"
        >
          <span slot="date" slot-scope="text">{{text | fliterTimestamp(0)}}</span>

          <template slot="name" slot-scope="text,row">
            <img :src="picBaseUrl+row.logo" alt="logo" @click="handlePreviewLogo(picBaseUrl+row.logo)"/>
            <span>{{text}}</span>
          </template>
          <a-button
            v-auth="['appUser_authDelete']"
            slot="handle"
            slot-scope="text,row"
            type="link"
            class="danger-link-button"
            @click="authDelete(row.id)"
          >解除</a-button>
        </a-table>
      </div>
    </a-modal>

    <!-- 图片预览 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      wrapClassName="preview-logo-modal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { timestampToTime } from "@/Utils/util.js";
const columns = [
  {
    align: "center",
    title: "应用名称",
    dataIndex: "name",
    scopedSlots: { customRender: "name" }
  },
  {
    align: "center",
    title: " 应用机构",
    dataIndex: "org"
  },
  {
    align: "center",
    title: "授权时间",
    dataIndex: "date",
    scopedSlots: { customRender: "date" }
  },
  {
    align: "center",
    title: "操作",
    scopedSlots: { customRender: "handle" }
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
    uid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      columns,
      data: [],
      authListVisible: false,
      tableLoading: false,

      //图片预览
      previewImage: "", //图片预览地址
      previewVisible: false //图片预览modal显隐
    };
  },
  computed: {
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    }
  },
  created() {},

  methods: {
    timestampToTime,
    authDelete(id) {
      this.$confirm({
        title: `确认解除本应用授权吗?`,
        content: "",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          await this.authDeleteReq(id);
        }
      });
    },

    //点击预览表格内图片
    handlePreviewLogo(url) {
      // this.visible=false
      this.previewVisible = true;
      this.previewImage = url;
    },
    handleCancel() {
      this.previewVisible = false;
    },

    //获取 移动端用户授权应用 列表
    async getAuthList() {
      this.tableLoading = true;
      try {
        let res = await this.$api.MobileUser.getAPPUserAuthList({
          uid: this.uid
        });
        // console.log(res);
        if (res.code === "200") {
          this.data = res.data;
        }
        this.tableLoading = false;
      } catch (error) {
        this.$message.error("请求失败" + error);
      }
    },

    //解除 移动端用户授权应用
    async authDeleteReq(id) {
      this.$message.loading({
        content: "正在解除！",
        key: "remove"
      });
      try {
        let res = await this.$api.MobileUser.APPUserAuthDelete({
          uid: this.uid,
          id
        });
        // console.log(res);
        if (res.code === "200") {
          this.$message.success("解除成功！");
          this.$message.success({
            content: "解除成功！",
            key: "remove"
          });
          this.getAuthList();
        } else {
          this.$message.error("解除失败！");
          this.$message.error({
            content: "解除失败" + res.message,
            key: "remove"
          });
        }
      } catch (error) {
        this.$message.error({
          content: "请求失败！" + error,
          key: "remove"
        });
      }
    }
  }
};
</script>

<style lang="less" >
//登录记录对话框
.appuser-authList-modal {
  .danger-link-button {
    color: #ff7070;
  }
  .table {
    img {
      width: 35px;
      height: 35px;
      margin-right: 10px;
      border-radius: 5px;
      &:hover {
        cursor: pointer;
        opacity: 0.5;
      }
    }
  }
}

.preview-logo-modal {
  .ant-modal-body {
    padding: 40px;
  }
}
</style>