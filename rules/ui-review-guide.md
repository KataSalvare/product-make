# SuperIM UI 审核规范

本文档定义原型和组件交付前的 UI 审核门禁，补充 [`src/docs/UI_GUIDELINES.md`](../src/docs/UI_GUIDELINES.md)、[`src/docs/COMPONENT_GUIDELINES.md`](../src/docs/COMPONENT_GUIDELINES.md) 和对应主题 `DESIGN.md`。

## 1. 审核原则

- 先确认审核层级：工具层、前端内容层或后台内容层；禁止跨层套用审核标准。
- 先对照 source of truth，再看实现是否“看起来像”；视觉相似不能替代 token、组件和交互证据。
- 每个问题必须有文件、行号、实际值、期望值和复现/检查证据。
- 增量审核优先；历史页面只在本次变更触及的区域内审核。
- Review 只产出报告和日志，不直接修改原型、组件或主题。

## 2. 审核证据

每个页面至少检查：

1. `spec.md` 中的 UI 层级、主题来源、参考页面、组件清单、状态和响应式说明；
2. `index.tsx`、`style.css` 及导入的主题/组件文件；
3. `check-app-ready.mjs` 返回的 `targetUrl`、构建、lint、typecheck 和 Console 状态；
4. 390px、768px、1440px 左右的移动端、平板端和桌面端布局；
5. 核心交互以及 loading、empty、error、success 等关键状态。

已有批准的基准截图可以用于对比；没有基准截图时，不得伪造像素级结论，只记录可观察的布局、样式和交互事实。

## 3. Part A：规范合规审核

### 3.1 分层检查

| 层级 | 必查项 | Critical 条件 |
|---|---|---|
| 工具层 | 预览路由、分类、TopBar、快捷键、Figma 复制；不继承内容主题 | 引入内容主题，或导致内容页面/预览功能不可用 |
| 前端内容层 | `equatorial-minimalism`、主题 tokens、主题组件、IM 页面模式 | 使用后台 antd 或工具层主题作为页面基线 |
| 后台内容层 | `antd@6`、`antd-new/theme.ts`、`ConfigProvider`、antd 组件 | 导入 Equatorial Minimalism，或新页面用手写控件替代 antd 基础能力 |

### 3.2 组件、图标和尺寸

- 是否复用同层已有 Button、Card、Input、Dialog、页头、导航等组件。
- 工具层/前端是否优先使用 `lucide-react`，后台是否优先使用 `@ant-design/icons`。
- glyph 是否使用 12/16/20/24px；图标按钮是否有至少 44×44px 操作区域。
- icon-only 控件是否有 `aria-label`，装饰图标是否有 `aria-hidden="true"`，是否使用 Emoji 代替功能图标。
- 是否出现同名重复组件或重复导航实现；当前两份 `AdminSidebar` 只能记录为架构风险，新需求不得新增第三份。

### 3.3 导航与布局

前端内容层检查：65px 二级页头、44px 内容行、24px glyph、16px 左右边距、1px 分隔线；返回行为、active 状态和右侧页面动作；底部导航不超过 5 个一级入口。

后台内容层检查：新页面是否沿用 antd `Layout`/`Menu`/Header；目标尺寸为 240px Sider、64px Header、24px 内容区内边距；菜单 active、面包屑、标题、筛选区和内容区顺序是否稳定。

工具层检查：预览 Sidebar、TopBar 与内容层样式隔离；路由选中项、设备预览和快捷键可通过键盘完成。

### 3.4 Token、状态和可访问性

- 颜色、字体、圆角、阴影和间距是否来自当前层主题；主题源文件中的原始值不作为页面硬编码问题。
- active、hover、focus-visible、disabled、loading、empty、error、success 是否有反馈，且不改变控件几何尺寸。
- 标题层级是否连续；输入是否有可见 label；错误是否靠近字段；对比度是否达到 WCAG 2.1 AA。
- 表格是否有稳定 `rowKey`；异步操作是否有 loading、成功、失败和重试。

## 4. Part B：交互与响应式审核

- 核心任务能否从入口走到结果；返回、弹层关闭和深链接是否可预测。
- 删除、冻结、保存、提交等高风险操作是否有确认或清晰反馈。
- `<768px` 不裁切、不重叠；`768–1199px` 有合理折叠或滚动；`>=1200px` 与同层参考页面的网格和外边距一致。
- sticky/fixed 元素不遮挡内容和焦点；tab 顺序与视觉顺序一致；禁止通过固定宽度、负 margin 或隐藏溢出掩盖问题。

## 5. 严重度与交付门槛

| 严重度 | 定义 | 示例 | 处理 |
|---|---|---|---|
| 🔴 Critical | 违反强制分层/主题规则、核心路径不可用或关键操作不可访问 | 白屏、主题混用、核心按钮键盘不可达 | 必须修复，不能带问题交付 |
| 🟡 Warning | 可见的 token、尺寸、布局、状态或响应式偏差 | 页头高度不一致、使用新 18px glyph、缺少 loading | 原则上修复；否则在 `spec.md` 记录接受原因 |
| 🔵 Info | 不阻塞交付的复用或演进建议 | 两个原型重复实现相似空状态 | 记录到主题扩展建议或 backlog |

审核通过条件：Critical 为 0；Warning 已修复或有书面接受记录；Info 已记录后续去向。

## 6. 主题扩展建议

同一模式在两个及以上同层级原型中出现，且包含稳定布局、状态和可访问性行为时，才建议提取为主题组件或模板。建议记录来源、重复次数、适用层级、候选名称、归属目录和新增 token。

## 7. 报告与日志

报告必须包含审核时间、范围、依据、分层统计、Part A 问题、Part B 建议、文件与行号、严重度、证据和建议修改。审核完成后按 `skills/design-review/references/review-report-template.md` 生成报告，并按 `src/docs/templates/review-log-template.md` 追加 `src/docs/review-log.md`。

未获得用户确认的范围不得执行全量审核。

## 8. 交付清单

- [ ] 审核范围和依据已确认，且与页面所属层级匹配。
- [ ] 图标、导航、尺寸、间距、状态和 token 检查完成。
- [ ] 核心交互、键盘操作、空/加载/错误态检查完成。
- [ ] 移动端、平板端、桌面端检查完成。
- [ ] Critical 为 0；Warning 已修复或记录接受原因。
- [ ] Review 报告已生成，Review 日志已追加。
