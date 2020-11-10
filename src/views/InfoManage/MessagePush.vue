<!-- 消息推送 -->
<template>
  <div id="informationPush">
    <div class="top">
      <div class="topLift">
        <a-button
          type="primary"
          class="add"
          v-auth="['MessagePush_add']"
          @click="showModal"
          style="margin-right:10px;"
        >
          <svg-icon icon-class="add" :scale="0.8" style="margin-right:5px;"></svg-icon>添加消息
        </a-button>
        <a-button
          type="danger"
          class="danger"
          v-auth="['MessagePush_delete']"
          @click="showDeleteConfirmBatch()"
        >
          <svg-icon icon-class="shanchu" :scale="0.8" style="margin-right:5px;"></svg-icon>批量删除
        </a-button>
      </div>

      <!-- 搜索功能 -->
      <div class="topRight" v-auth="['MessagePush_list']">
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
        v-if="permit('MessagePush_list')"
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="dataList"
        :rowKey="row=>row.infoId"
        bordered
        :pagination="pagination"
        :loading="loading"
        @change="sortChange"
      >
        <span
          slot="offlineTime"
          slot-scope="text,record"
          :style="record.offlineTime !== '1' ? {'color':'#009B40'} : ''"
        >{{record.offlineTime == '0' ? '不离线' : record.offlineTime + '天'}}</span>
        <span slot="sendTime" slot-scope="text">{{text | fliterTimestamp(0)}}</span>
        <span slot="createTime" slot-scope="text">{{text | fliterTimestamp(0)}}</span>
        <span slot="operation" slot-scope="text,record" class="handle-button">
          <a-button type="link" v-auth="['MessagePush_info']" @click="showModal2(record)">
            <svg-icon icon-class="chakan" :scale="0.8"></svg-icon>查看
          </a-button>
          <!-- <a-divider type="vertical" /> -->
          <a-button type="link" v-auth="['MessagePush_delete']" @click="showDeleteConfirm(record)">
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
      class="informationPushModal1"
      v-model="visible"
      title="添加消息"
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
        <!-- 推送标题 -->
        <a-form-model-item ref="title" label="推送标题" prop="title">
          <a-input
            v-model="form.title"
            placeholder="请填写标题 , 不超过20个字符（不填写时，默认为App名称）"
            :maxLength="20"
            @blur="() => {$refs.title.onFieldBlur();}"
          />
        </a-form-model-item>

        <!-- 推送内容 -->
        <a-form-model-item ref="content" label="推送内容" prop="content">
          <a-input
            v-model="form.content"
            type="textarea"
            :maxLength="120"
            placeholder="请填写要推送的内容，中文不可超过120个汉字"
            style="height:100px;"
            @blur="() => {$refs.content.onFieldBlur();}"
          />
        </a-form-model-item>

        <!-- 图片 -->
        <a-form-model-item label="图片" prop="image">
          <div class="clearfix">
            <a-upload
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
              :before-upload="beforeUploadImage"
            >
              <div v-if="fileList.length < 3">
                <a-icon type="plus" />
                <div class="ant-upload-text">添加图片</div>
              </div>
            </a-upload>
            <a-modal
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
              wrapClassName="previewImgModal"
            >
              <img alt="pic" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-model-item>

        <!-- 应用内跳转链接 -->
        <a-form-model-item ref="url" label="应用内跳转链接" prop="url">
          <a-input v-model="form.url" placeholder="请以http://或http://开头" />
        </a-form-model-item>

        <!-- 推送时间 -->
        <a-form-model-item label="推送时间" prop="sendTime">
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

        <!-- 离线时间 -->
        <a-form-model-item label="离线时间" prop="offlineTime">
          <a-radio-group v-model="form.offlineTime">
            <a-radio value="0">0天</a-radio>
            <a-radio value="3">3天</a-radio>
            <a-radio value="5">5天</a-radio>
            <a-radio value="10">10天</a-radio>
            <a-radio value="20">自定</a-radio>
          </a-radio-group>

          <a-input
            v-if="form.offlineTime === '20'"
            style="width:60px;height:26px;"
            v-model="offline"
            :maxLength="4"
          />
          <span v-if="form.offlineTime === '20'" style="margin-left:10px;">天</span>
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
      class="informationPushModal2"
      v-model="visible2"
      title="详细信息"
      :maskClosable="false"
      :footer="null"
      width="800px"
    >
      <div class="info">
        <div class="infoTitle">推送标题：</div>
        <div class="infoContent title">{{info.title}}</div>
      </div>

      <div class="info">
        <div class="infoTitle">推送内容：</div>
        <div class="infoContent content">{{info.content}}</div>
      </div>

      <div class="info">
        <div class="infoTitle">跳转链接：</div>
        <div class="infoContent url">{{info.url}}</div>
      </div>

      <div class="info">
        <div class="infoTitle">推送图片：</div>
        <div class="infoContent image">
          <img 
            :src="picBaseUrl + item"
            alt="推送图片"
            v-for="(item,index) in info.image"
            :key="index"
            @click="handlePreview2(item)"
          />
        </div>
      </div>

      <div class="info">
        <div class="infoLeft">
          <div class="infoLeftTitle">发送时间：</div>
          <div class="infoLeftContent sendTime">{{info.sendTime | fliterTimestamp(0)}}</div>
        </div>
        <div class="infoRight">
          <div class="infoRightTitle">离线时间：</div>
          <div class="infoRightContent offlineTime">{{info.offlineTime}}天</div>
        </div>
      </div>

      <div class="info">
        <div class="infoLeft">
          <div class="infoLeftTitle">创建时间：</div>
          <div class="infoLeftContent createTime">{{info.createTime | fliterTimestamp(0)}}</div>
        </div>
        <div class="infoRight">
          <div class="infoRightTitle">创建状态：</div>
          <div
            class="infoRightContent createState"
          >{{info.createState==="0"?'失败':info.createState==="1"?'成功':'--'}}</div>
        </div>
      </div>

      <div class="info">
        <div class="infoTitle">三方推送ID:</div>
        <div class="infoContent tripartiteID">{{info.tripartiteID}}</div>
      </div>

      <div class="info">
        <div class="infoTitle"></div>
        <div
          class="infoContent remark"
        >备注：需详细查看信息推送统计数据，请登录三方推送平台（https://www.jiguang.cn），输入此条推送的“三方推送ID”进行查看</div>
      </div>

      <div style="text-align: center;">
        <a-button type="primary" @click="ensure()">确定</a-button>
      </div>
    </a-modal>

    <!-- 列表图片预览 -->
    <a-modal
      :visible="previewVisible2"
      :footer="null"
      @cancel="handleCancel2"
      wrapClassName="previewImgModal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage2" />
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import { permit } from "../../directives/authIf.js";


export default {
  data() {
    /* 标题正则规则 */
    const validateTitle = (rule, value, callback) => {
      if (value) {
        const pwdRegex = /^[a-zA-Z0-9\_\@\+\-\?\/\\\,\.\，\。\、\：\:\;\；\"\'\“\”\？\u4e00-\u9fa5]+$/;
        if (!pwdRegex.test(value)) {
          callback(
            new Error(
              "格式有误，请输入中文、英文、数字、常用符号,不允许特殊符号"
            )
          );
        }
        callback();
      } else {
        callback();
      }
    };
    /* 内容正则规则 */
    const validateContent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写推送内容 , 不超过120个字符"));
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
      search: {
        //搜索
        startDate: "", //开始时间
        endDate: "", //结束时间
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
        title: "", //推送标题
        content: "", //推送内容
        image: [], //图片
        url: "", //应用内跳转链接
        sendTime: null, //推送时间
        offlineTime: "" //离线时间
      },
      offline: "", //手动输入的离线时间
      //图片上传
      previewVisible: false,
      previewImage: "",
      fileList: [],

      // 图片预览
      previewVisible2: false, //是否展示modal框
      previewImage2: "", //预览图片地址

      rules: {
        //标题
        title: [{ validator: validateTitle, trigger: "blur" }],
        //推送内容
        content: [
          { validator: validateContent, required: true, trigger: "blur" }
        ],
        //推送时间
        sendTime: [{ required: true, message: "请选择推送时间" }],
        //离线时间
        offlineTime: [
          { required: true, message: "请选择离线时间", trigger: "change" }
        ]
      },

      //详细信息modal
      visible2: false, //详细信息modal状态

      id: [], //被删除id数组(单个删除)
      ids: [], //被删除id数组(批量删除)
      columns: [
        {
          title: "推送内容",
          dataIndex: "content",
          key: "content",
          align: "center",
          width: "40%",
          ellipsis: true
        },
        {
          title: "离线时间",
          dataIndex: "offlineTime",
          key: "offlineTime",
          align: "center",
          width: "15%",
          scopedSlots: { customRender: "offlineTime" }
        },
        {
          title: "推送时间",
          dataIndex: "sendTime",
          key: "sendTime",
          align: "center",
          width: "15%",
          scopedSlots: { customRender: "sendTime" },
          sorter: true
          // sorter: (a, b) => moment(a.sendTime) - moment(b.sendTime)
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          align: "center",
          width: "15%",
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
          width: "15%",
          scopedSlots: { customRender: "operation" }
        }
      ], //列表结构
      dataList: [], //列表数据

      hasDeleteArr: [], //被删除数据的id

      //  详细信息查看
      info: {
        title: "", //推送标题
        content: "", //推送内容
        url: "", //跳转地址
        image: [], //推送图片
        sendTime: null, //发送时间
        offlineTime: "", //离线时间
        createTime: null, //创建时间
        createState: "", //创建状态
        tripartiteID: "" //三方推送ID
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
  },

  computed: {
    //获取图片基础地址
    picBaseUrl() {
      return this.$store.state.app.picBaseUrl;
    },

    //选择框
    rowSelection() {
      return {
        selectedRowKeys: this.ids,
        onChange: (selectedRowKeys, selectedRows) => {
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
    moment,

    //翻页，排序事件
    sortChange(pagination, filters, sorter) {
      console.log(sorter);
      //翻页
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
          const { sortOrder } = this.columns[2];
          delete this.columns[3].sortOrder;
          if (sortOrder === "descend") {
            this.columns[2].sortOrder = "ascend";
            this.search.sort = 0;
            this.getList();
          } else {
            this.columns[2].sortOrder = "descend";
            this.search.sort = 1;
            this.getList();
          }
        } else if (sorter.field === "createTime") {
          //按照 createTime 排序
          this.search.sortField = "create_time";
          const { sortOrder } = this.columns[3];
          delete this.columns[2].sortOrder;
          if (sortOrder === "descend") {
            this.columns[3].sortOrder = "ascend";
            this.search.sort = 0;
            this.getList();
          } else {
            this.columns[3].sortOrder = "descend";
            this.search.sort = 1;
            this.getList();
          }
        }
      }
    },

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
    //点击单个删除
    showDeleteConfirm(e) {
      this.id.push(e.infoId);
      console.log(this.id);

      this.$confirm({
        title: "你确定要删除这条数据吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async() => {
          try {
            const res = await this.$api.MessagePush.deleteInformationPush({
              ids: this.id
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
              const res = await this.$api.MessagePush.deleteInformationPush({
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
        //表单数据
        title: "", //推送标题
        content: "", //推送内容
        image: [], //图片
        url: "", //应用内跳转链接
        sendTime: null, //推送时间
        offlineTime: "" //离线时间
      };
      this.fileList = [];
      this.offline = "";
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
    //添加
    onSubmit() {
      this.btnDisabled = true;
      // debugger
      console.log("当前表单数据", this.form);
      if (this.form.image.length === 2) {
        this.$message.warning("请上传一张或三张图片");
        this.confirmLoading = false;
        this.btnDisabled = false;
        return;
      }

      //将form数据拷贝
      var sendForm = { ...this.form };
      if (sendForm.offlineTime === "20") {
        sendForm.offlineTime = this.offline;
      }
      //将发送时间转化成时间戳
      if (sendForm.sendTime) {
        sendForm.sendTime = sendForm.sendTime.valueOf();
      }

      this.$refs.ruleForm.validate(valid => {
        console.log("valid", valid);

        if (valid) {
          this.confirmLoading = true;
          if (this.form.offlineTime === "20") {
            if (!this.offline) {
              this.$message.warning("请输入自定义离线时间！");
              this.confirmLoading = false;
              this.btnDisabled = false;
              return;
            } else {
              const numRegex = new RegExp("^\\d+$");
              if (!numRegex.test(this.offline)) {
                this.$message.warning("请输入合理的自定义离线时间！");
                this.confirmLoading = false;
                this.btnDisabled = false;
                return;
              }
            }
          }

          setTimeout(async() => {
            try {
              const res = await this.$api.MessagePush.addInformationPush({
                ...sendForm
              }); //使用拷贝后的数据发送请求
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
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },

    //图片上传
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },
    //图片上传
    handleCancel() {
      this.previewVisible = false;
    },
    //预览图片的回调
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    //改变上传框时
    handleChange({ fileList }) {
      this.fileList = fileList;
      var imgArr = [];
      for (let i = 0; i < this.fileList.length; i++) {
        imgArr.push(this.fileList[i].pUrl);
      }
      this.form.image = imgArr;
    },
    //上传图片之前
    async beforeUploadImage(file, fileList) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      if (!isJPG) {
        this.$message.error("请上传图片");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(false);
        });
      }

      const imgBase64 = await this.getBase64(file);
      const res = await this.uploadPicReq(imgBase64);
      console.log(res);
      this.fileList.push({
        uid: file.uid,
        name: file.name,
        status: "done",
        url: res.url,
        pUrl: res.path
      });
      this.form.image.push(res.path);
      console.log(this.form.image);
      return new Promise((resolve, reject) => {
        return reject(false);
      });
    },
    //上传图片请求
    async uploadPicReq(imgBase64) {
      this.btnDisabled = true;
      try {
        const res = await this.$api.init.uploadPic({ imgBase64 });
        if (res.code === "200") {
          this.btnDisabled = false;
          return res.data;
        }
        console.log(res);
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    // 详细信息modal
    async showModal2(record) {
      this.visible2 = true;
      console.log(record.infoId);
      try {
        const res = await this.$api.MessagePush.detailsInformationPush({
          infoId: record.infoId
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

    // 列表图片预览
    handlePreview2(e) {
      this.previewVisible2 = true;
      this.previewImage2 = this.picBaseUrl + e;
    },
    handleCancel2() {
      this.previewVisible2 = false;
    },

    //获取列表
    async getList() {
      this.loading = true;
      let { startDate, endDate } = this.search;
      if (startDate) startDate = moment(startDate).format("YYYY-MM-DD");
      if (endDate) endDate = moment(endDate).format("YYYY-MM-DD");
      try {
        const res = await this.$api.MessagePush.getInformationPushList({
          ...this.search,
          startDate,
          endDate
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
#informationPush {
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
.informationPushModal1 {
  // modal框
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

  // 图片上传
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
}

.informationPushModal2 {
  .ant-modal-header {
    background-color: #f4f4f4;
    text-align: center;
  }
  .ant-modal-body {
    // padding: 24px 48px;
    .info {
      display: flex;
      margin-bottom: 10px;
      .infoTitle {
        width: 10%;
        display: flex;
        align-items: center;
        text-align: center;
        color: #000;
      }
      .infoContent {
        width: 90%;
        min-height: 42px;
        padding: 10px;
        line-height: 1.6;
        background-color: #f4f4f4;
        border-radius: 8px;
      }
      .image {
        background-color: #fff;
        cursor: pointer;
        img {
          width: 100px;
          margin-right: 10px;
        }
      }
      .remark {
        background-color: #fff;
        color: #fe1c1c;
      }
      .infoLeft {
        display: flex;
        width: 50%;
        .infoLeftTitle {
          width: 20%;
          display: flex;
          align-items: center;
          text-align: center;
          color: #000;
        }
        .infoLeftContent {
          width: 70%;
          padding: 10px;
          min-height: 42px;
          line-height: 1.6;
          background-color: #f4f4f4;
          border-radius: 8px;
        }
      }
      .infoRight {
        display: flex;
        width: 50%;
        .infoRightTitle {
          width: 20%;
          display: flex;
          align-items: center;
          text-align: center;
          color: #000;
        }
        .infoRightContent {
          width: 70%;
          min-height: 42px;
          padding: 10px;
          line-height: 1.6;
          background-color: #f4f4f4;
          border-radius: 8px;
        }
      }
    }
  }
}

//图片预览框
.previewImgModal {
  .ant-modal-body {
    padding: 40px;
  }
}

//日期弹出框的宽度
.authData {
  .ant-calendar {
    width: 250px;
  }
}
</style>