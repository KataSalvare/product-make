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

## 使用约束

- 根部只建立一个 `ConfigProvider`，使用 `adminTheme` 作为基线。
- 优先使用公开 antd API、token、`classNames` 和 `styles`；不依赖 `.ant-*` 内部 DOM 结构。
- 不把后台的蓝色、灰色、表格或卡片样式复制到前端页面。
- 数据表格必须有稳定 `rowKey`，表单必须有 label、校验和错误反馈。
- 侧边导航、顶部栏和页面内容保持稳定 shell；新页面只替换内容区，不重新发明后台框架。
