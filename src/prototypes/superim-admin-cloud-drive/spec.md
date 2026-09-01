# SuperIM v1.2 云盘运营总览规格

## 页面信息
- 页面名称：云盘运营总览
- 页面路径：`/admin/cloud-drive`
- 所属模块：云盘管理

## 页面目标
为管理员提供容量、用户、文件状态和近期异常的单屏运营判断入口。数据来自云盘 Mock 状态与操作审计记录，不接触文件正文。

## 布局与交互
- 直接复用用户列表的 `AdminHeader`、`AdminSidebar`；云盘管理分组保持高亮并展开。
- 顶部展示总容量、已用容量、云盘用户数、文件总数四个指标卡。
- 使用率达到 80% 显示橙色预警，达到 90% 显示红色预警。
- 下方展示近 7 天上传/冻结/删除趋势、类型占用、高占用用户和最近异常变更。
- 最近异常区域可进入操作审计；高占用用户可进入用户配额；类型占用可进入文件管理。

## 数据契约
使用 `AdminCloudDriveSummary`、`AdminCloudFileRecord`、`AdminCloudUserQuota` 和 `AdminCloudDriveAuditRecord`。总容量按用户数乘全局默认配额计算，冻结文件仍计入已用容量。

## 视觉规范
- UI 层级：后台内容层；主题来源：`src/themes/antd-new/DESIGN.md` 与 `theme.ts`。
- 参考原型：`/admin/users`；导航直接复用 `src/components/AdminHeader.tsx`、`src/components/AdminSidebar.tsx`，不单独实现云盘菜单。
- 背景 `#f5f7fa`，卡片白底、`1px` 边框、默认 6px 圆角；共用菜单使用 220px 侧栏、40px 菜单行高和 8px 激活圆角。
- 正常使用率使用蓝色，80% 以上使用橙色，90% 以上使用红色。
- 指标和图表均提供文字数值，不依赖颜色单独传递状态。
- 状态覆盖正常、预警、超限、空数据、异常和操作反馈；窄屏沿用用户列表侧栏行为，内容卡片按现有页面栅格自适应排列。

## 实现映射
- 后台壳使用 `src/components/AdminShell.tsx` 组合用户列表的 `AdminHeader`、`AdminSidebar`，内容区使用 `antd-new` token 和 Ant Design `Card`。
- 指标、容量进度、告警、审计列表使用 Ant Design `Card`、`Statistic`、`Progress`、`Alert`、`List`。
