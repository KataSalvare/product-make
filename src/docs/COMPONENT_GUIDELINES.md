# SuperIM 组件复用规范

本文档约束内容层组件的归属、复用和扩展方式，配合 [`UI_GUIDELINES.md`](./UI_GUIDELINES.md) 使用。

## 1. 组件归属

| 组件类型 | 首选位置 | 使用范围 |
|---|---|---|
| 工具层组件 | `src/App.tsx` 或工具层内部 | 只服务预览外壳、路由、快捷键、Figma 复制 |
| 前端主题基础组件 | `src/themes/equatorial-minimalism/components/` | 前端内容层 |
| 前端原型组合组件 | 当前原型的 `components/` | 当前原型或同一原型的多页面 |
| 后台基础组件 | `antd@6` 与 `src/themes/antd-new/theme.ts` | 后台内容层 |
| 后台业务组合组件 | `src/components/` 或后台原型的 `components/` | 跨后台复用前先确认 props、状态和主题边界 |
| shadcn 基础组件 | `src/components/ui/` | 仅在已确认其 token 与当前层一致时使用；不得默认用于前端或后台 |

`src/components/ui/` 是通用 shadcn 原语，不是 SuperIM 前端主题，也不是后台 Ant Design 替代品。

## 2. 新建组件前的决策顺序

1. 在当前原型、同一业务域和对应主题目录中搜索相同或相近能力。
2. 如果已有组件只有视觉或交互差异，优先增加有限的 variant、size 或状态，而不是复制一份新组件。
3. 只有当职责、状态模型或可访问性要求确实不同，才创建新组件。
4. 新组件必须有清晰的 `@name`、Props、使用示例和 `spec.md`；组件目录使用大驼峰，原型目录使用 kebab-case。
5. 跨层组件默认不成立：前端主题组件不能直接用于后台，后台 antd 组件也不能反向定义前端视觉。

禁止出现按业务动作无限命名的组件，例如 `BlueButton`、`SaveButton`、`UserCard`、`SpecialModal`。业务语义应通过 props 表达，视觉语义应通过主题或 variant 表达。

## 3. Props 与状态

- 公共组件支持 `className` 或等价的样式扩展入口，但不能让调用方覆盖核心 token。
- DOM 事件使用标准命名：`onClick`、`onChange`、`onSubmit`；复杂配置收敛到对象类型。
- 必须明确默认、hover、focus-visible、disabled、loading；输入和数据组件还要定义 empty、error、success。
- 图标按钮必须接受可读的 `aria-label`；纯装饰图标使用 `aria-hidden="true"`。
- 列表、表格和异步组件需明确稳定 key、加载态、失败态和重试入口。

## 4. 视觉扩展规则

- 颜色、圆角、间距、阴影和字体只能来自当前层主题；不要在组件中散落新的原始值。
- 需要新增 token 时，先更新对应主题文档和 token，再更新组件；不要只在页面里临时补一个值。
- 组件 CSS 优先使用局部 class 或主题 API；不要使用全局标签选择器污染其他原型。
- 组件组合优先通过布局组件和语义 props 完成，不要把页面级 margin 强塞进基础组件。

## 5. 组件验收

- [ ] 组件归属层级明确，没有跨层主题依赖。
- [ ] 没有重复已有组件，或重复理由已记录在 `spec.md`。
- [ ] Props、使用示例、状态和主题来源完整。
- [ ] 键盘操作、焦点、禁用和错误反馈可用。
- [ ] 至少在一个真实原型中验证，而不是只验证孤立静态示例。
- [ ] 运行 `npm run build`、`npm run lint` 和目标原型验收脚本。

## 6. 图标契约

图标是共用规范的一部分，但图标库按层隔离：

| 层级 | 首选图标库 | 规则 |
|---|---|---|
| 工具层 | `lucide-react` | 预览工具栏、设备切换、快捷键和文档操作使用统一线性图标 |
| 前端内容层 | `lucide-react` | 新增图标优先使用 Lucide；已有主题内联 SVG 只有在没有等价图标或需要产品专属图形时保留 |
| 后台内容层 | `@ant-design/icons` | 与 antd 组件配套使用；不要为了复用前端图标而引入前端主题图标 |

### 6.1 图标尺寸

只允许使用以下视觉尺寸，尺寸指 SVG glyph，不等于可点击区域：

| 语义 | glyph | 使用场景 |
|---|---:|---|
| `compact` | 12px | 状态标记、表格辅助信息、趋势标识 |
| `default` | 16px | 列表行、表格操作、按钮内图标、后台菜单 |
| `nav` | 20px | 前端底部导航、工具栏主要操作 |
| `header` | 24px | 前端二级页头返回和页面级操作 |
| `display` | 32px 及以上 | 空状态、引导和主题演示，不用于常规操作 |

- 功能图标不得临时使用 13px、15px、18px、21px 等新尺寸；历史尺寸只在迁移时保留。
- 图标按钮的可操作区域至少为 44×44px；如果视觉 glyph 是 16/20/24px，必须通过 padding 或外层盒子满足触控尺寸。
- 图标按钮必须有 `aria-label`；装饰性图标必须有 `aria-hidden="true"`。
- 不使用 Emoji 代替功能图标，不混用实心、双色和线性图标来表达同一类操作。

## 7. 导航契约

### 7.1 工具层导航

- 只使用 `src/App.tsx` 中的预览 `Sidebar`、`TopBar` 和相关样式；内容层不得复用其视觉 class。
- 工具层导航负责原型分类、主题/文档入口、设备模式和工具操作，不承载业务页面的产品导航。
- 路由状态必须与当前选中项同步；快捷键和 Figma 复制入口不能依赖 hover 才可发现。

### 7.2 前端内容层导航

前端二级页头以 `src/docs/secondary-page-navigation.md` 和 `src/prototypes/superim-wallet/design.md` 为来源，统一基线如下：

| 项目 | 规范 |
|---|---|
| 页头高度 | 65px，包含底部 1px 分隔线 |
| 内容行 | 44px |
| 左右内边距 | 移动端 16px；宽屏按页面内容区扩展 |
| 返回/操作 glyph | 24px |
| 返回与标题间距 | 12px |
| 页头背景/边框 | 主题 `surface-container-low` / `outline-variant` |
| 标题 | `text-headline-md`，20px / 600 / 28px |
| 定位 | `sticky; top: 0; z-index: 20` |

一级入口页不显示返回按钮；二级页必须有可预测的返回行为；右侧只放当前页面动作。底部导航最多 5 个一级入口，图标使用 20px glyph，选中态使用主题 secondary，不因选中而改变布局尺寸。

### 7.3 后台内容层导航

后台新页面使用 antd `Layout` + `Menu` + 页面级 `Header` 组合，不再创建新的手写 Sidebar。目标尺寸：

| 项目 | 规范 |
|---|---:|
| Sider 宽度 | 240px（桌面）；窄屏转为抽屉或横向菜单 |
| Header 高度 | 64px |
| Menu glyph | 16px |
| Menu 行高 | 40px，保持连续可扫描；图标按钮单独满足 44px 点击区域 |
| 内容区内边距 | 24px，窄屏 16px |
| 内容区模块间距 | 16px 或 24px，使用 antd `Space`/`Flex`/`Grid` |
| 当前态 | 使用 antd selected/active 状态，必须同时有文字或结构上的位置反馈 |

当前仓库存在 `src/components/AdminSidebar.tsx` 和 `src/components/AdminSidebar/index.tsx` 两份同名实现。新代码不得继续新增第三份；后续迁移时应保留一个后台导航 source of truth，并将菜单数据、路由 active 状态和图标映射集中维护。

## 8. 尺寸与间距契约

### 8.1 前端主题

- 间距以 8px 为主节奏，允许 4px 作为图标/标签等微间距；常用区间为 8、12、16、24、32、48、64、80px。
- 圆角使用 Equatorial Minimalism 现有语义：4px（sm）、8px（默认）、12px（md）、16px（lg）、24px（xl）、9999px（full）。
- 文字层级使用主题现有 utility：标题 40/28/24/20px，正文 16/14/13px，标签 12/11/10px；不新增同义字号。
- 表单控件、页头操作、列表操作优先使用 44px 触控行；紧凑信息可使用 32px 视觉高度，但不能牺牲可访问点击区域。

### 8.2 后台主题

- 尺寸优先由 antd token 控制：`controlHeight: 32`，需要强调时使用 40px 尺寸。
- 页面布局使用 4px/8px 间距节奏；卡片、表单组和表格区域优先使用 16px/24px 内外间距。
- 后台新代码不得复制 Equatorial Minimalism 的字体、圆角、阴影或大留白方案；视觉差异由 `antd-new/theme.ts` 和 antd 组件 token 负责。

## 9. 状态命名与验收

基础组件至少支持 `default`、`hover`、`focus-visible`、`disabled`；异步控件增加 `loading`，数据组件增加 `empty`、`error`、`success`。

- 状态变化不能改变按钮、导航项或表格行的几何尺寸。
- active 状态必须能被颜色以外的结构、文字、图标或位置识别。
- compact badge/tag 使用 `nowrap`；发生截断时必须提供可访问的完整内容。
- 导航和弹窗必须可用键盘完成，焦点顺序与视觉顺序一致。
