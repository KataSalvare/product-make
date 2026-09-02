# Ant Design 后台设计系统

SuperIM 后台内容层使用 `antd@6`。该主题服务运营、审核、权限、日志和配置等数据密集型工作，不与前端 `Equatorial Minimalism` 共用视觉 token。

## Source of truth

- 组件库：`antd@6`
- 图标：`@ant-design/icons`
- 主题 token：`src/themes/antd-new/theme.ts`
- 项目级边界：`src/docs/UI_GUIDELINES.md`
- 主题演示：`src/themes/antd-new/index.tsx`

## 视觉基线

| 类别 | 基线 |
|---|---|
| 主色 | `#1677ff`，用于主要操作、链接和当前导航 |
| 页面背景 | `#f5f7fa` |
| 容器 | 白色，使用 antd `Card`、`Layout`、`Table` 等组件 |
| 正文 | 14px 起，正文 `#1f1f1f`，辅助文字 `#595959` |
| 圆角 | 默认 6px；仅在产品组件确有需要时通过组件 token 调整 |
| 密度 | 数据表格和后台表单使用紧凑、可扫描的间距 |
| 状态 | 使用 antd 的 success / warning / error / processing 语义，不用颜色单独传递信息 |

## 后台共用导航

后台内容页直接复用用户列表原型 `/admin/users` 的 `AdminHeader` 和 `AdminSidebar`，云盘、钱包不得各自实现另一套顶部导航或侧栏。`AdminShell` 只负责组合这两个现有组件和内容区，不改变它们的结构、间距、图标或激活样式。

菜单数据的唯一入口是 `src/components/AdminSidebar.tsx`。钱包分组包含：钱包总览、交易记录、用户钱包、规则配置、审计日志；云盘分组包含：云盘总览、文件管理、用户配额、操作审计。路由变化时沿用 `AdminSidebar` 的父级展开和子项激活逻辑。

## 使用约束

- 根部只建立一个 `ConfigProvider`，使用 `adminTheme` 作为基线。
- 优先使用公开 antd API、token、`classNames` 和 `styles`；不依赖 `.ant-*` 内部 DOM 结构。
- 不把后台的蓝色、灰色、表格或卡片样式复制到前端页面。
- 数据表格必须有稳定 `rowKey`，表单必须有 label、校验和错误反馈。
- 侧边导航、顶部栏和页面内容保持稳定 shell；新页面只替换内容区，不重新发明后台框架。
- 共用导航的唯一实现是 `AdminHeader` + `AdminSidebar`；新增后台页面先补充 `AdminSidebar` 菜单数据，再复用 `AdminShell`。
