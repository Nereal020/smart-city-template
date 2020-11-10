/* 
 * 接口统一集成模块
 */
import * as init from './modules/init'

/* 
 * 平台统计
 */
import * as PlatformStats from './modules/PlatformStats/PlatformStats'

/* 
* 机构应用
*/
//机构和账户
import * as AgencyAccount from './modules/AgencyApplication/AgencyAccount'
//应用管理
import * as ApplicationManagement from './modules/AgencyApplication/ApplicationManagement'
//应用通知公告
import * as ApplicationAnnouncements from './modules/AgencyApplication/ApplicationAnnouncements'
//三方应用消息
import * as ApplicationMessage from './modules/AgencyApplication/ApplicationMessage'

/* 
* 系统管理
*/
import * as SystemManagement from './modules/SystemManagement/SystemManagement'

import * as user from './modules/user/user'
// 默认全部导出
export default {
    init,

    // 平台统计
    PlatformStats,

    // 机构应用
    AgencyAccount,
    ApplicationManagement,
    ApplicationAnnouncements,
    ApplicationMessage,

    // 系统管理
    SystemManagement,
    user
}