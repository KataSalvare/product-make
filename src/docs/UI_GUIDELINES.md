# SuperIM UI 一致性规范

> 本文档是 SuperIM 内容层 UI 的长期 source of truth。工具层、前端页面和后台页面必须先确定所属层，再选择对应主题与组件；不能把一个层的视觉规则带到另一个层。

## 1. 架构边界

| 层级 | 责任 | 主要目录 | 主题与组件来源 |
|---|---|---|---|
| 工具层 | 预览外壳、路由、内容列表、顶部工具栏、快捷键、Figma 复制、文档查看 | `src/App.tsx`、`src/App.css`、`src/index.css`、`src/main.tsx` | 工具层自身的中性深浅色样式；不得引入内容层主题 |
| 内容层 / 前端 | 用户端 IM、设置、云盘、钱包等产品页面 | `src/prototypes/superim-*`（不含 `admin`） | `src/themes/equatorial-minimalism/`；优先复用该主题的组件与 tokens |
| 内容层 / 后台 | 运营、审核、权限、日志、后台配置等管理页面 | `src/prototypes/superim-admin-*` | `antd@6` + `src/themes/antd-new/`；优先使用 Ant Design 组件 |

页面目录命名是边界契约：后台原型必须使用 `superim-admin-` 前缀，前端原型不得使用该前缀。不要通过“看起来像后台”临时决定主题。

## 2. 规范优先级

发生冲突时按以下顺序处理：

1. 用户提供的设计稿、PRD 或明确视觉要求；
2. 当前原型的 `spec.md`；
3. 本文档；
4. 对应主题的 `DESIGN.md`、tokens 和主题组件；
5. 同层级的参考原型。

如果需求没有指定参考页面，先找同一业务域、同一层级中已经稳定的原型，再开始编码。不得以“新页面”为理由重新发明颜色、间距、圆角或布局体系。

## 3. 工具层规范

- 工具层只负责预览体验，不负责定义业务页面的视觉语言。
- 工具层可以使用自己的深色/浅色切换、侧边栏和顶部工具栏；这些样式不应被内容层页面复用。
- 工具层不得导入 `src/themes/equatorial-minimalism/globals.css` 或后台主题文件。
- 工具层的路由、快捷键、设备预览和 Figma 复制行为不能因内容层页面的主题改动而改变。
- 修改工具层时，至少验证一个前端页面和一个后台页面仍能打开，且内容层页面不继承工具层的主题状态。

## 4. 前端页面：Equatorial Minimalism

### 4.1 必须使用

- 页面入口导入 `../../themes/equatorial-minimalism/globals.css`。
- 颜色、字体、圆角、间距、阴影和状态色优先引用主题变量或主题 utility。
- 复用 `src/themes/equatorial-minimalism/components/` 中的 `Button`、`Card`、`Input`、`Avatar` 等组件；页面专属组合组件放在当前原型目录。
- 聊天气泡、头像、输入栏、二级页头和底部导航遵循 `DESIGN.md` 中的 IM-specific 约束。

### 4.2 禁止新增

- `bg-blue-*`、`text-gray-*`、`#ffffff` 等脱离主题语义的页面级颜色；例外必须写入当前 `spec.md` 的设计决策。
- 页面内重复实现已有的 Button、Card、Input、Avatar、Dialog、Tabs 或 Toast。
- 直接把 `src/index.css` 中的 shadcn 默认中性色当成 Equatorial Minimalism token。
- 为单个页面随意增加新的字体大小、圆角值、阴影值或断点。

现有历史页面可能仍有局部旧样式。修改历史页面时，新增区域必须遵守本节；如果触及旧区域的视觉结构，应在同一任务中迁移该区域，不能继续扩大混用范围。

## 5. 后台页面：Ant Design

### 5.1 必须使用

- 后台页面使用 `antd@6`，主题配置来自 `src/themes/antd-new/theme.ts`。
- 页面根部使用一个 `ConfigProvider`；优先由后台页面壳或共享入口提供，页面内部不要重复嵌套。
- 表格、表单、弹窗、抽屉、分页、筛选、标签、反馈等优先使用 antd 对应组件，不要手写同类基础控件。
- 图标优先使用 `@ant-design/icons`；若主题已有 Lucide 实现，迁移时保持同一套图标风格，不要混用 emoji 作为图标。
- 使用 antd token、组件 token、`classNames` 或 `styles` 定制，避免依赖 `.ant-*` 内部 DOM 选择器和大范围全局覆盖。
- 表格必须有稳定 `rowKey`；异步操作必须有 loading、成功、失败和可重试反馈。

### 5.2 后台布局基线

- 布局：侧边导航 + 顶部栏 + 主内容区；当前页必须有明确 active 状态。
- 页面层级：面包屑（有三层及以上时）→ 页面标题 → 描述/操作 → 筛选或内容区。
- 主内容区优先使用 antd `Layout`、`Card`、`Space`、`Flex`、`Grid` 等结构能力；不要让每个页面自行发明一套 shell。
- 数据密集型页面优先保持紧凑密度；详情和配置页面保持清晰分组，不使用前端页面的“极端留白”作为后台默认。
- 桌面、平板和移动端都要处理；表格在窄屏允许横向滚动，但页面本身不得产生无意义的横向滚动。

### 5.3 迁移边界

`src/prototypes/superim-admin-*` 中仍存在一部分历史 Tailwind/手写后台样式，它们属于待迁移内容，不是新需求的参考实现。新需求不得复制这些旧写法；修改旧页面时，优先将本次触及的控件迁移到 antd 和 `antd-new` token。

## 6. 跨层通用规则

- 图标使用 SVG 图标库或主题已有图标；不使用 emoji 充当功能图标。
- 可操作控件必须有 hover、focus-visible、disabled；异步操作还要有 loading。
- 键盘顺序应与视觉顺序一致，焦点不可被 sticky/fixed 工具栏遮挡；图标按钮必须有 `aria-label` 或可读文本。
- 正文基准不小于 14px；长文本行高建议不低于 1.5。颜色对比度达到 WCAG 2.1 AA。
- 触控目标至少 44×44px；相邻控件保留足够间距。
- 断点统一使用：移动端 `<768px`、平板 `768–1199px`、桌面 `>=1200px`；除非参考页面已有明确例外。
- 动画只表达状态变化，支持 `prefers-reduced-motion`；不要为静态页面添加无意义动效。

## 7. 页面需求的最小设计记录

每个新页面或重大改版的 `spec.md` 必须明确：

```md
## 视觉规范
- UI 层：前端 / 后台
- 主题来源：`src/themes/equatorial-minimalism` 或 `src/themes/antd-new`
- 参考页面：至少一个同层级原型路径
- 复用组件：列出实际使用的公共组件或 antd 组件
- 新增 token：无；如有，说明原因与影响范围
- 状态：默认、hover、focus、disabled、loading、empty、error
- 响应式：移动端、平板、桌面行为
```

## 8. 提交前检查

- [ ] 已判断页面属于工具层、前端内容层或后台内容层。
- [ ] 已读取对应主题的 `DESIGN.md` 和 tokens。
- [ ] 已搜索同层级参考页面与已有公共组件。
- [ ] 图标库、glyph 尺寸、导航结构和控件尺寸符合 `COMPONENT_GUIDELINES.md`。
- [ ] 未引入跨层主题或未登记的颜色、字体、间距、圆角、阴影。
- [ ] `spec.md` 与实现保持同步。
- [ ] 已运行 `npm run build`、`npm run lint`，并对目标原型运行 `check-app-ready.mjs`。
- [ ] 已在至少一个窄屏宽度和一个桌面宽度检查布局、键盘焦点和主要交互。
