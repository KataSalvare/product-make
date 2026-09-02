# SuperIM v1.2 云盘操作审计规格

## 页面信息
- 页面名称：操作审计
- 页面路径：`/admin/cloud-drive/audit`
- 所属模块：云盘管理

## 页面目标
提供云盘变更行为的可追溯记录，页面只读，不提供日志删除或修改能力。

## 字段与交互
- 字段：时间、操作管理员、操作类型、目标文件/用户、原因、修改前值、修改后值、结果、关联对象 ID。
- 支持按管理员、目标名称或对象 ID 搜索；按操作类型和结果筛选；支持分页。
- 详情弹窗展示完整 before/after、原因和结果。
- 必须记录全局配额、单用户配额、冻结、解冻、永久删除和批量操作；批量操作按目标对象分别留痕。

## 实现映射
- 使用用户列表同款 `AdminHeader`、`AdminSidebar` 与 Ant Design `Input`、`Select`、`Table`、`Modal`、`Descriptions`，审计页面保持只读并支持窄屏横向查看数据列。

## 视觉规范
- UI 层级：后台内容层；主题来源：`src/themes/antd-new/DESIGN.md` 与 `theme.ts`。
- 参考原型：`/admin/users`；直接复用 `src/components/AdminHeader.tsx`、`src/components/AdminSidebar.tsx` 的菜单和顶栏。
- 沿用后台紧凑表格、白色容器和状态标签，不新增页面级视觉 token；图标使用 `@ant-design/icons`。
- 状态覆盖只读、筛选、空结果、详情展开和窄屏横向滚动，审计结果同时使用文字和语义色表达。
