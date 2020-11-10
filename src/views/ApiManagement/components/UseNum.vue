/*
 * @Page:查询API调用量详情组件
 * @Author: mikey.WuQiao
 * @Date: 2020-07-30 15:38:34
 * @Last Modified by: mikey.WuQiao
 * @Last Modified time: 2020-09-22 12:57:53
 */
<template>
  <div>
    <a-modal
      v-model="visible"
      title="调用量详情"
      :destroyOnClose="true"
      :footer="null"
      :centered="true"
      class="use-num-modal"
    >
      <table border="1">
        <tbody>
          <tr>
            <td class="odd">调用总次数</td>
            <td class="odd">正常调用次数</td>
            <td class="odd">异常调用次数</td>
          </tr>
          <tr>
            <td class="even">{{data.useTotalNum || '--'}}</td>
            <td class="even">{{data.useNormalNum || '--'}}</td>
            <td class="even">{{data.useErrorNum || '--'}}</td>
          </tr>
          <tr>
            <td class="odd">最大访问时间</td>
            <td class="odd">最小访问时间</td>
            <td class="odd">平均访问时间</td>
          </tr>
          <tr>
            <td class="even">{{data.maxTime || '--'}}</td>
            <td class="even">{{data.minTime || '--'}}</td>
            <td class="even">{{data.meanTime || '--'}}</td>
          </tr>
        </tbody>
      </table>
      <a-spin class="spinxxx" v-show="loading" />
    </a-modal>
  </div>
</template>

<script>
import { Spin } from "ant-design-vue";
import vue from "vue";
vue.use(Spin);
export default {
  data() {
    return {
      visible: false,
      loading: false,
      data: []
    };
  },
  mounted() {},
  methods: {
    showModal(id) {
      this.visible = true;
      this.fetchApiManageUseNum(id);
    },
    // 获取当条数据调用量详情
    async fetchApiManageUseNum(id) {
      let timer;
      if (timer) clearTimeout(timer);
      this.loading = true;
      try {
        const res = await this.$api.ApiManagement.getApiManageUseNum({
          apiId: id
        });
        if (res.code === "200" && res.result) {
          timer = setTimeout(() => {
            this.loading = false;
            if (res.data) {
              this.data = res.data;
            }
          }, 200);
        } else {
          timer = setTimeout(() => {
            this.$message.error("请求失败！" + res.msg);
            this.loading = false;
          }, 500);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
        this.loading = false;
      }
    }
  }
};
</script>    
<style lang="less">
@border: #dcdee6;
@tableBg: #f5f5f7;
.use-num-modal {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    padding: 24px 40px;
  }
  .spinxxx {
    min-width: 520px;
    min-height: 249px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 56px;
    left: 0;
    background: #fdfdfd;
    border-radius: 2px;
  }
  table {
    width: 100%;
    tr {
      border: 1px solid @border;
      td {
        height: 50px;
        vertical-align: middle;
      }
      .odd {
        background-color: @tableBg;
        text-align: center;
      }
      .even {
        text-indent: 1em;
        text-align: center;
      }
    }
  }
}
</style>
