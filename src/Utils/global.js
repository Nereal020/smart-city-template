/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
    //  baseUrl = '/api';
    baseUrl = 'http://10.4.3.147:8080';
    // baseUrl = 'http://10.10.0.136:8080';
} else if (process.env.NODE_ENV === 'debug') {
    baseUrl = 'http://10.4.3.241:8080';
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = 'http://10.4.3.147:8080';
}
export {
    baseUrl
}   