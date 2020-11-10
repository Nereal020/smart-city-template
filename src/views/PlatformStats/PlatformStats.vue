<style lang="less">
#homePage {
  width: 100%;
  // height: 2000px;
  padding: 16px 16px 20px 16px;
  background-color: #eff3f5;
  // margin-bottom: 20px;
  .title {
    width: 100%;
    height: 45px;
    border-bottom: 1px solid #eaeaea;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    color: #777777;
  }
  .sum {
    width: 100%;
    height: 260px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // margin-bottom: 20px;
    .sum_item {
      width: 15.5%;
      height: 115px;
      padding: 0 10px;
      background-color: #fff;
      .sum_title {
        width: 100%;
        height: 50px;
        font-size: 14px;
        color: #595959;
        display: flex;
        align-items: center;

        .icon_item {
          font-size: 16px;
          margin-right: 6px;
        }
      }
      .sum_number {
        width: 100%;
        height: 60px;
        display: flex;
        // align-items: center;
      }
    }
  }
  .register {
    width: 100%;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .reg {
      width: 46%;
      height: 100%;
      background-color: #fff;
      #reg {
        width: 100%;
        height: 260px;
        margin-top: -25px;
        // background-color: chartreuse;
      }
      #appLoad {
        width: 100%;
        height: 260px;
        // background-color: coral;
        margin-top: -25px;
      }
    }
    .authen {
      width: 25%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      #authen {
        width: 100%;
        height: 260px;
        // margin-top: -25px;
        // background-color: cornflowerblue;
      }
    }
    .phone {
      width: 25%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      #phone {
        width: 100%;
        height: 260px;
      }
    }
  }
  .apiRank {
    width: 100%;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .openApi {
      width: 25%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      #openApi {
        width: 100%;
        height: 260px;
      }
    }
    .errRank {
      width: 25%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .errContainei {
        width: 100%;
        height: 275px;
        padding: 8px 10px 0 10px;

        .errTit {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #efefef;
          font-size: 16px;
          text-align: center;
        }
        .errItem {
          width: 100%;
          height: 228px;
          overflow-y: auto;
          /* 滚动条 */
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: #eff3f5;
          }
          /*定义滚动条轨道 内阴影+圆角*/
          &::-webkit-scrollbar-track {
            border-radius: 3px;
            background-color: #eff3f5;
          }
          /*定义滑块 内阴影+圆角*/
          &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: #36b4f3;
          }
          .errItem1 {
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            text-align: center;
          }
        }
      }
    }
    .apiPic {
      width: 46%;
      height: 100%;
      background-color: #fff;
      #APITrend {
        width: 100%;
        height: 260px;
      }
    }
  }
  .hotApp {
    width: 100%;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .hotAppRank {
      width: 32%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .hotContainer {
        width: 100%;
        height: 275px;
        padding: 8px 10px 0 10px;

        .hotTit {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #efefef;
          font-size: 16px;
        }
        .hotItem {
          width: 100%;
          height: 228px;
          overflow-y: auto;

          /* 滚动条 */
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: #eff3f5;
          }
          /*定义滚动条轨道 内阴影+圆角*/
          &::-webkit-scrollbar-track {
            border-radius: 3px;
            background-color: #eff3f5;
          }
          /*定义滑块 内阴影+圆角*/
          &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: #36b4f3;
          }
          .hotItem1 {
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-left: 15px;
          }
        }
      }
    }
    .fifteenRank {
      width: 32%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .fifContainer {
        width: 100%;
        height: 275px;
        padding: 8px 10px 0 10px;

        .fifTit {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #efefef;
          font-size: 16px;
        }
        .fifItem {
          width: 100%;
          height: 228px;
          overflow-y: auto;

          /* 滚动条 */
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: #eff3f5;
          }
          /*定义滚动条轨道 内阴影+圆角*/
          &::-webkit-scrollbar-track {
            border-radius: 3px;
            background-color: #eff3f5;
          }
          /*定义滑块 内阴影+圆角*/
          &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: #36b4f3;
          }
          .fifItem1 {
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-left: 15px;
          }
        }
      }
    }
    .info {
      width: 32%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .infoContainer {
        width: 100%;
        height: 275px;
        padding: 8px 10px 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .infoItem {
          width: 100%;
          height: 60px;
          // background-color: chartreuse;
          // margin-bottom: 10px;
          display: flex;
          align-items: center;
          text-align: center;

        }
      }
    }
  }
}
</style>
<template>
  <div id="homePage">
    <div class="sum" v-auth="['platformStats01']">
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="huiyuan" class="icon_item" ></svg-icon>
          </span> 会员用户
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.regUser" class="demo-class">
            <template #suffix>
              <span>个</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="shiming" class="icon_item" ></svg-icon>
          </span> 实名认证
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.certification" class="demo-class">
            <template #suffix>
              <span>人</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="renzheng" class="icon_item" ></svg-icon>
          </span> 认证企业
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.aeo" class="demo-class">
            <template #suffix>
              <span>个</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="xiazai" class="icon_item" ></svg-icon>
          </span> APP下载量
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.appDownloads" class="demo-class">
            <template #suffix>
              <span>次</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="fabu" class="icon_item" ></svg-icon>
          </span> 信息发布
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.infoPub" class="demo-class">
            <template #suffix>
              <span>条</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="yuedu" class="icon_item" ></svg-icon>
          </span> 阅读总量
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.readTotal" class="demo-class">
            <template #suffix>
              <span>次</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="AgencyApplication" style="color:#5999ee;" class="icon_item" ></svg-icon>
          </span> 加入机构
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.joinOrg" class="demo-class">
            <template #suffix>
              <span>家</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="yingyong" class="icon_item" ></svg-icon>
          </span> 接入应用
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.ttyApp" class="demo-class">
            <template #suffix>
              <span>个</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="shouquan" class="icon_item" ></svg-icon>
          </span> 授权登录
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.authorLogin" class="demo-class">
            <template #suffix>
              <span>个</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="shiming" class="icon_item" ></svg-icon>
          </span> 实名授权
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.nameAuthorization" class="demo-class">
            <template #suffix>
              <span>次</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="zhifu" class="icon_item" ></svg-icon>
          </span> 支付调用
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.payCount" class="demo-class">
            <template #suffix>
              <span>次</span>
            </template>
          </a-statistic>
        </div>
      </div>
      <div class="sum_item">
        <div class="sum_title">
          <span>
            <svg-icon icon-class="api" class="icon_item" ></svg-icon>
          </span> 开放API调用
        </div>
        <div class="sum_number">
          <a-statistic :value="sumObj.openApi" class="demo-class">
            <template #suffix>
              <span>次</span>
            </template>
          </a-statistic>
        </div>
      </div>
    </div>
    <div class="register" >
      <div class="reg" v-auth="['platformStats02']">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="注册用户与认证用户">
            <div id="reg"></div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="APP下载量" force-render>
            <div id="appLoad"></div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="authen" v-auth="['platformStats03']">
        <div class="title">认证与未认证用户</div>
        <div id="authen" ></div>
      </div>
      <div class="phone" v-auth="['platformStats04']">
        <div class="title">用户手机品牌</div>
        <div id="phone"></div>
      </div>
    </div>
    <div class="apiRank">
      <div class="openApi" v-auth="['platformStats05']">
        <div class="title">开放API调用占比</div>
        <div id="openApi"></div>
      </div>
      <div class="errRank" v-auth="['platformStats06']">
        <div class="title">异常调用排行</div>
        <div class="errContainei">
          <div class="errTit">
            <div style="width:40%;text-align: start;padding-left: 15px;">API标题</div>
            <div style="width:20%;">调用量</div>
            <div style="width:20%;">成功量</div>
            <div style="width:20%;">成功率</div>
          </div>
          <div class="errItem">
            <div class="errItem1" v-for="item in errRank" :key="item.index">
              <div style="width:40%;text-align: start;padding-left: 15px;">{{item.title}}</div>
              <div style="width:20%;">{{item.count}}</div>
              <div style="width:20%;">{{item.successCount}}</div>
              <div style="width:20%;">{{item.scale*100+'%'}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="apiPic" v-auth="['platformStats07']">
        <div class="title">API调用趋势图</div>
        <div id="APITrend"></div>
      </div>
    </div>
    <div class="hotApp">
      <div class="hotAppRank" v-auth="['platformStats08']">
        <div class="title">热门应用排行</div>
        <div class="hotContainer">
          <div class="hotTit">
            <div style="width:80%;padding-left: 15px;">应用名称</div>
            <div style="width:20%;padding-left: 15px;">访问次数</div>
          </div>
          <div class="hotItem">
            <div class="hotItem1" v-for="item in hotApp" :key="item.index">
              <div style="width:80%;">{{item.name}}</div>
              <div style="width:20%;text-align: center;">{{item.count}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fifteenRank" v-auth="['platformStats09']">
        <div class="title">前15热门搜索词</div>
        <div class="fifContainer">
          <div class="fifTit">
            <div style="width:80%;padding-left: 15px;">热门搜索词</div>
            <div style="width:20%;padding-left: 15px;">搜索次数</div>
          </div>
          <div class="fifItem">
            <div class="fifItem1" v-for="item in hotKey" :key="item.index">
              <div style="width:80%;">{{item.name}}</div>
              <div style="width:20%;text-align: center;">{{item.count}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="info" v-auth="['platformStats10']">
        <div class="title">消息发布占比</div>
        <div class="infoContainer">

          <div class="infoItem" v-for="item in msg" :key='item.index'>
            <div style="width:30%">{{item.name}}</div>
            <a-progress :percent="item.scale*100" />
            <div style="width:30%">{{item.number}}条</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import echarts from "echarts";
import { addListener } from "resize-detector";
import {
  Descriptions,
  message,
  Statistic,
  Icon,
  Tabs,
  Progress
} from "ant-design-vue";

Vue.prototype.$echarts = echarts;
Vue.use(Descriptions)
  .use(Statistic)
  .use(Tabs)
  .use(Progress)
  .use(Icon);
Vue.prototype.$message = message;
export default {
  name: "",
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 8) {
        return value.slice(0, 8) + "...";
      }
      return value;
    }
  },
  data() {
    return {
      sumObj: {
        regUser: "0", //  注册用户
        certification: "0", //  实名认证
        aeo: "0", //  认证企业
        appDownloads: "0", //  APP下载量
        infoPub: "0", //  信息发布
        readTotal: "0", //  阅读总量
        joinOrg: "0", //  加入机构
        ttyApp: "0", //  接入应用
        authorLogin: "0", //  授权登录
        nameAuthorization: "0", //  实名授权
        payCount: "0", //  支付调用
        openApi: "0" //  开放API调用
      },
      errRank: [],
      hotApp: [],
      hotKey: [],
      msg: []
    };
  },
  mounted() {
    // 统计
    this.getStaSum();
    // 注册与认证用户
    this.getregAndCer();
    // app下载量
    this.getappDownloads();
    // 认证与未认证用户
    this.getauthenAndUnver();
    // 用户手机品牌
    this.getphoneBrandr();
    // 开放api调用占比
    this.getapiProportion();
    // 异常调用排行
    this.geterrRank();
    // api调用趋势图
    this.getapiTrend();
    // 热门应用排行
    this.gethotAppRank();
    // 前15热门搜索词
    this.gethotKeyword();
    // 消息发布占比
    this.getmsgScale();
  },

  methods: {
    resize() {
      if (this.authen1) {
        this.authen1.resize();
      }
    },
    // 注册用户与认证用户
    reg(time, register, realname) {
      const reg1 = this.$echarts.init(document.getElementById("reg"));
      reg1.setOption({
        title: {},
        tooltip: {
          trigger: "axis",
          transitionDuration: 0 // echart防止tooltip的抖动
        },
        legend: {
          data: ["注册用户", "认证用户"],
          textStyle: {
            color: "#000"
          },
          x: "center",
          y: "bottom",
          padding: [20, 0, 0, 0]
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: time,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#000", // X轴文字颜色
                fontSize: 12
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#595959"
              }
            },
            axisLabel: {
              color: "#595959",
              margin: 20,
              formatter: function(value) {
                if (value >= 10000 && value < 10000000) {
                  value = value / 10000 + "万";
                } else if (value >= 10000000) {
                  value = value / 10000000 + "千万";
                }
                return value;
              }
            }
          }
        ],
        series: [
          {
            name: "注册用户",
            type: "line",
            data: register,
            lineStyle: {
              normal: {
                width: 2,
                color: {
                  type: "linear",
                  colorStops: [
                    {
                      offset: 0,
                      color: "#52c41a" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#52c41a" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "#52c41a",
                shadowBlur: 2,
                shadowOffsetY: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#52c41a",
                borderWidth: 1,
                borderColor: "#52c41a"
              }
            }
          },
          {
            name: "认证用户",
            type: "line",
            data: realname,
            lineStyle: {
              normal: {
                width: 2,
                color: {
                  type: "linear",
                  colorStops: [
                    {
                      offset: 0,
                      color: "#5eb1fd" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#5eb1fd" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "#5eb1fd",
                shadowBlur: 2,
                shadowOffsetY: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#5eb1fd",
                borderWidth: 1,
                borderColor: "#5eb1fd"
              }
            }
          }
        ]
      });
    },
    // app下载量
    appLoad(time, android, ios) {
      const appLoad1 = this.$echarts.init(document.getElementById("appLoad"));
      appLoad1.setOption({
        tooltip: {
          transitionDuration: 0 // echart防止tooltip的抖动
        },
        // backgroundColor: "#ff0",//背景色
        color: ["#5eb1fd", "#52c41a"],
        legend: {
          data: ["Android", "IOS"],
          textStyle: {
            color: "#000"
          },
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          x: "center",
          y: "bottom",
          padding: [20, 0, 0, 0]
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: "#d9d9d9"
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#595959",
              fontSize: 12
            }
          },
          data: time
        },
        yAxis: [
          {
            type: "value",
             minInterval: 1,
            // axisLabel: {
            //   formatter: "{value} ",
            //   color: "#ffffff",
            //   textStyle: {
            //     fontSize: 14
            //   }
            // },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#595959"
              }
            },
            axisLabel: {
              margin: 20,
              formatter: function(value) {
                if (value >= 10000 && value < 10000000) {
                  value = value / 10000 + "万";
                } else if (value >= 10000000) {
                  value = value / 10000000 + "千万";
                }
                return value;
              }
            }
          }
        ],
        series: [
          {
            name: "Android",
            barWidth: "35%",
            type: "bar",
            stack: "1", // 如果stack一樣就會堆疊
            data: android
          },
          {
            name: "IOS",
            barWidth: "35%",
            type: "bar",
            stack: "1", // 如果stack一樣就會堆疊
            data: ios
          }
        ]
      });
    },
    // 认证用户与未认证用户
    authen(authen, unAuthen) {
      this.authen1 = this.$echarts.init(document.getElementById("authen"));
      var colorList = ["#6ccd3c", "#f2637b"];
      var arr = [
        { value: authen, name: "认证用户" },
        { value: unAuthen, name: "未认证用户" }
      ];
      addListener(document.querySelector("#authen"), this.resize);

      this.authen1.setOption({
        color: colorList,
        legend: {
          data: ["认证用户", "未认证用户"],
          textStyle: {
            color: "#000"
          },
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          x: "center",
          y: "bottom"
          // padding: [20, 0, 25, 0]
        },
        tooltip: {
          trigger: "item",
          transitionDuration: 0 // echart防止tooltip的抖动
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["38%", "47%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 10,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                },
                borderColor: "#FFFFFF",
                borderWidth: 1
              }
            },
            label: {
              show: true,
              position: "outside",
              formatter: function(params) {
                // console.log(params);
                return params.name + "\n" + "\n" + params.percent + "%";
              },
              rich: {
                // hr: {
                //   backgroundColor: "t",
                //   borderRadius: 3,
                //   width: 3,
                //   height: 3,
                //   padding: [3, 3, 0, 0]
                // },
                a: {
                  padding: [0, -20, 0, -20]
                }
              }
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 20,
                lineStyle: {
                  width: 1
                }
              }
            },
            data: arr
          }
        ]
      });
    },
    // 用户手机品牌
    phone(arr1, name) {
      // console.log(arr1,name);
      const phone1 = this.$echarts.init(document.getElementById("phone"));
      var colorList = [
        "#3ba0ff",
        "#36cbcb",
        "#4dcb73",
        "#fad337",
        "#f2637b",
        "#975fe4"
      ];
      var arr = arr1
      phone1.setOption({
        color: colorList,
        legend: {
          data: name,
          textStyle: {
            color: "#000"
          },
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          x: "center",
          y: "bottom"
          // padding: [20, 0, 25, 0]
        },
        tooltip: {
          trigger: "item",
          transitionDuration: 0 // echart防止tooltip的抖动
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["38%", "47%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 10,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                },
                borderColor: "#FFFFFF",
                borderWidth: 1
              }
            },
            label: {
              show: true,
              position: "outside",
              formatter: function(params) {
                // console.log(params);
                return params.name + "\n" + params.percent + "%";
              },
              rich: {
                // hr: {
                //   backgroundColor: "t",
                //   borderRadius: 3,
                //   width: 3,
                //   height: 3,
                //   padding: [3, 3, 0, 0]
                // },
                a: {
                  padding: [0, -20, 0, -20]
                }
              }
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 20,
                lineStyle: {
                  width: 1
                }
              }
            },
            data: arr
          }
        ]
      });
    },
    // 开放api
    openApi(arr1, name) {
      const openApi1 = this.$echarts.init(document.getElementById("openApi"));
      var colorList = [
        "#3ba0ff",
        "#36cbcb",
        "#4dcb73",
        "#fad337",
        "#f2637b",
        "#975fe4"
      ];
      // var arr = arr1;
      openApi1.setOption({
        color: colorList,
        legend: {
          data: name,
          textStyle: {
            color: "#000"
          },
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          x: "center",
          y: "bottom"
          // padding: [20, 0, 25, 0]
        },
        tooltip: {
          trigger: "item",
          transitionDuration: 0 // echart防止tooltip的抖动
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["38%", "47%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 10,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                },
                borderColor: "#FFFFFF",
                borderWidth: 1
              }
            },
            label: {
              show: true,
              position: "outside",
              formatter: function(params) {
                // console.log(params);
                return params.name + "\n" + params.percent + "%";
              },
              rich: {
                // hr: {
                //   backgroundColor: "t",
                //   borderRadius: 3,
                //   width: 3,
                //   height: 3,
                //   padding: [3, 3, 0, 0]
                // },
                a: {
                  padding: [0, -20, 0, -20]
                }
              }
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 20,
                lineStyle: {
                  width: 1
                }
              }
            },
            data: arr1
          }
        ]
      });
    },
    apiTrend(arr1, name) {
      const APITrend1 = this.$echarts.init(document.getElementById("APITrend"));
      APITrend1.setOption({
        title: {},
        tooltip: {
          trigger: "axis",
          transitionDuration: 0 // echart防止tooltip的抖动
        },
        // legend: {
        //   data: ["注册用户", "认证用户"],
        //   textStyle: {
        //     color: "#000"
        //   },
        //   x: "center",
        //   y: "bottom",
        //   padding: [20, 0, 0, 0]
        // },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: name,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#000", // X轴文字颜色
                fontSize: 12
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",

            axisLine: {
              show: false,
              lineStyle: {
                color: "#595959"
              }
            },
            axisLabel: {
              color: "#595959",
              margin: 20,
              formatter: function(value) {
                if (value >= 10000 && value < 10000000) {
                  value = value / 10000 + "万";
                } else if (value >= 10000000) {
                  value = value / 10000000 + "千万";
                }
                return value;
              }
            }
          }
        ],
        series: [
          {
            name: "api调用趋势",
            type: "line",
            data: arr1,
            lineStyle: {
              normal: {
                width: 2,
                color: {
                  type: "linear",
                  colorStops: [
                    {
                      offset: 0,
                      color: "#5eb1fd" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#5eb1fd" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "#5eb1fd",
                shadowBlur: 2,
                shadowOffsetY: 1
              }
            },
            itemStyle: {
              normal: {
                color: "#5eb1fd",
                borderWidth: 1,
                borderColor: "#5eb1fd"
              }
            }
          }
        ]
      });
    },

    // 请求
    // 统计
    getStaSum() {
      const data = {}
      this.$api.PlatformStats.staSum(data).then(res => {
        if (res.result) {
         this.sumObj = res.data
        } else {

        }
      })
    },
    // 注册与认证用户
    getregAndCer() {
       const data = {}
      this.$api.PlatformStats.regAndCer(data).then(res => {
        if (res.result) {
          const time = []; const register = []; const realname = []
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            time.push(element.time)
            register.push(element.register)
            realname.push(element.realname)
          }
           this.reg(time, register, realname);
        } else {

        }
      })
    },
    // app下载量
    getappDownloads() {
      const data = {}
      this.$api.PlatformStats.appDownloads(data).then(res => {
        if (res.result) {
          // console.log(res);
          const time = []; const android = []; const ios = []
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            time.push(element.time)
            android.push(element.android)
            ios.push(element.ios)
          }
           this.appLoad(time, android, ios);
        } else {

        }
      })
    },
    // 认证与未认证用户
    getauthenAndUnver() {
      const data = {}
      this.$api.PlatformStats.authenAndUnver(data).then(res => {
        // console.log(res);
        if (res.result) {
          this.authen(res.data.authenticated, res.data.unAuthenticated);
        } else {

        }
      })
    },
    // 用户手机品牌
    getphoneBrandr() {
      const data = {}
      this.$api.PlatformStats.phoneBrand(data).then(res => {
        // console.log(res);
        if (res.result) {
         const arr = []; const name1 = []
         for (let i = 0; i < res.data.length; i++) {
           const element = res.data[i];
           const item = {
             value: element.scale,
             name: element.brand
           }
           arr.push(item)
           name1.push(element.brand)
         }
        //  console.log(arr,name1);
         this.phone(arr, name1)
        } else {

        }
      })
    },
    // 开放api调用占比
    getapiProportion() {
      const data = {}
      this.$api.PlatformStats.apiProportion(data).then(res => {
        // console.log(res);
        if (res.result) {
         const arr = []; const name1 = []
         for (let i = 0; i < res.data.length; i++) {
           const element = res.data[i];
           const item = {
             value: element.scale,
             name: element.openApiName
           }
           arr.push(item)
           name1.push(element.openApiName)
         }
        //  console.log(arr,name1);
         this.openApi(arr, name1)
        } else {

        }
      })
    },
    // 异常调用排行
    geterrRank() {
      const data = {}
      this.$api.PlatformStats.errRank(data).then(res => {
        // console.log(res);
        if (res.result) {
         this.errRank = res.data
        } else {

        }
      })
    },
    // api调用趋势图
    getapiTrend() {
       const data = {}
      this.$api.PlatformStats.apiTrend(data).then(res => {
        // console.log(res);
        if (res.result) {
         const arr = []; const name1 = []
         for (let i = 0; i < res.data.length; i++) {
           const element = res.data[i];

           arr.push(element.count)
           name1.push(element.time)
         }
        //  console.log(arr,name1);
          this.apiTrend(arr, name1);
        } else {

        }
      })
    },
    // 热门应用排行
    gethotAppRank() {
      const data = {}
      this.$api.PlatformStats.hotAppRank(data).then(res => {
        // console.log(res);
        if (res.result) {
         this.hotApp = res.data
        } else {

        }
      })
    },
    // 前15热门搜索词
    gethotKeyword() {
      const data = {}
      this.$api.PlatformStats.hotKeyword(data).then(res => {
        // console.log(res);
        if (res.result) {
         this.hotKey = res.data
        } else {

        }
      })
    },
    // 消息发布占比
    getmsgScale() {
      const data = {}
      this.$api.PlatformStats.msgScale(data).then(res => {
        // console.log(res.data);
        if (res.result) {
         this.msg = res.data
        } else {

        }
      })
    }
  }
};
</script>
