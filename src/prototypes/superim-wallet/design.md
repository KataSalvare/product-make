# SuperIM 用户端二级页面顶部导航设计方案

## 1. 文档目的

本文档基于现有 SuperIM 用户端原型，归纳已经落地的二级页面顶部导航方案，并定义钱包页面应遵循的页头规则。

本方案的目标是让用户在「我的 → 钱包」以及其他二级页面之间获得一致的返回位置、标题层级、操作入口和触控反馈。

范围包含用户端二级页面、文件页面和会话场景页头；后台控制台使用独立的桌面端导航方案，不纳入本方案。

## 2. 现有页面盘点

### 2.1 基础二级页头

以下页面使用同一类基础结构：

- 编辑资料：`src/prototypes/superim-editprofile/index.tsx`
- 安全设置：`src/prototypes/superim-security/index.tsx`
- 隐私设置：`src/prototypes/superim-privacy-settings/index.tsx`
- 设置：`src/prototypes/superim-settings/index.tsx`
- 账号切换：`src/prototypes/superim-account-switcher/index.tsx`
- 添加联系人、选择联系人：`src/prototypes/superim-addcontact/index.tsx`、`src/prototypes/superim-contact-selection/index.tsx`
- 收藏详情、我的动态、转发消息：`src/prototypes/superim-favorite-detail/index.tsx`、`src/prototypes/superim-myposts/index.tsx`、`src/prototypes/superim-forwardmessage/index.tsx`
- 用户资料、动态详情：`src/prototypes/superim-userprofile/index.tsx`、`src/prototypes/superim-postdetail/index.tsx`

共同结构为：

```text
header
└── flex row / justify-between
    ├── flex row / gap-3
    │   ├── 返回按钮
    │   └── 页面标题
    └── 可选的页面操作
```

### 2.2 顶层页面的同源变体

聊天列表、通讯录、动态、通话和「我的」属于一级入口页面。它们保留相同的主题表面、分隔线、标题字号和左右布局，但通常不显示返回按钮，而是直接显示标题和右侧操作。

### 2.3 文件页面变体

云盘首页、文件夹和文件详情页沿用相同的视觉语言，但在页头中允许增加副标题或多个文件操作按钮：

- 页头内边距使用 `px-3 py-3`，为文件操作留出更灵活的横向空间。
- 内容区使用 `min-h-[44px]` 保持一行操作的稳定高度。
- 标题可以使用 `text-base` / `text-lg` / `text-xl`，副标题使用 `text-xs`。
- 返回按钮和右侧操作均保持至少 44px 的可触控区域。

### 2.4 会话和多选态变体

聊天室、群聊和临时会话的页头仍使用主题表面和分隔线，但它们是持续会话场景：

- 默认态优先展示会话身份、在线状态和会话操作。
- 多选态将返回图标替换为关闭图标，并展示已选数量。
- 群聊、聊天室内的转账入口属于会话内容操作，不放入钱包首页页头。

## 3. 基础二级页头规范

### 3.1 视觉令牌

| 项目 | 规范 | 设计依据 |
|---|---|---|
| 页头背景 | `var(--surface-container-low)` | 与编辑资料、安全设置一致 |
| 底部分隔线 | `1px solid var(--outline-variant)` | 分离页头与滚动内容 |
| 水平内边距 | `16px`（`px-4`） | 与编辑资料、安全设置等基础二级页保持一致；宽屏只扩大内容区，不改变页头起点 |
| 页头垂直布局 | `10px` 上下 + 44px 触控行 | 总高度仍为 `65px`；44px 触控区域内的 24px 图标保持与既有页视觉对齐 |
| 页头高度 | `65px` | `10px` 上下内边距 + 44px 触控行 + 1px 底部边框，视觉标题位置与编辑资料、安全设置一致 |
| 内容行高 | `44px` 触控行 | 图标按钮满足最小触控尺寸；钱包内部滚动区负责长内容滚动 |
| 页面标题 | `text-headline-md`，主题主色 | 20px / 600 / 28px |
| 返回图标 | Lucide `ArrowLeft`，24px，主题 on-surface | 与现有 SVG 返回图标保持同一视觉重量 |
| 交互悬停 | `var(--surface-container)` 圆形背景 | 与现有页面一致 |
| 层级 | `sticky; top: 0; z-index: 20` | 长内容滚动时保持导航可见 |

### 3.2 结构与对齐

- 页头内部采用 `display: flex; align-items: center; justify-content: space-between`。
- 左侧区域采用返回按钮与标题的 `10px` 盒子间距，视觉图标与标题保持原有 12px 规范的对齐效果。
- 返回按钮视觉图标为 24px；使用 44px 触控盒子并通过负边距保持图标视觉起点和编辑资料、安全设置一致。
- 标题单行显示，过长时截断，不允许挤压右侧操作。
- 右侧操作只承载当前页面动作，例如保存、筛选、更多、安全设置；不放置跨页面或促销内容。
- 没有右侧操作时不增加空白占位，标题仍然按左侧自然对齐。

### 3.3 行为与可访问性

- 返回按钮使用原生 `button`，可通过键盘和屏幕阅读器访问。
- 图标按钮必须有描述性 `aria-label`，装饰性 SVG 使用 `aria-hidden="true"`。
- 返回行为优先返回上一级页面；从固定入口直接打开时，使用明确的页面兜底路径。
- 悬停、按下和聚焦状态只改变背景或轮廓，不改变布局尺寸。
- 页头固定时，滚动内容必须位于页头之后，不能被遮挡；页面外层不应因内容高度被撑开，滚动只发生在内容区。
- 支持深色主题变量和 `prefers-reduced-motion`，不使用 Emoji 作为结构图标。

## 4. 钱包页头落地方案

钱包是「我的」下的二级页面，因此使用基础二级页头，不使用钱包品牌卡片式页头，也不增加欢迎文案。

### 4.1 钱包首页

```text
┌────────────────────────────────────┐
│  ←  Wallet                         ⚙ │
├────────────────────────────────────┤
│                                    │
│  钱包余额、充值/转账/提现、交易记录     │
└────────────────────────────────────┘
```

- 返回按钮返回 `/me`。
- 标题为 `Wallet`，使用 `text-headline-md` 视觉层级。
- 右侧保留钱包安全入口，进入 `/wallet/security`。
- 不显示 `FROM MY ACCOUNT`、欢迎语或钱包首页聊天转账快捷卡片。
- 充值、转账、提现仍作为页面内容区的业务操作，不放入顶部导航。

### 4.2 钱包子页面

- `Deposit USDC`、`Transfer USDC`、`Withdraw USDC`、`Transactions`、`Transaction details`、`Wallet security` 均使用相同页头组件。
- 子页面返回钱包首页或交易列表，保持返回层级可预测。
- 只有存在页面级操作时才显示右侧操作；表单提交和授权动作保留在内容区。
- Base Mainnet 和 USDC 属于业务内容，不作为页头副标题重复展示。

## 5. 钱包实现映射

- 组件入口：`src/prototypes/superim-wallet/index.tsx` 的 `PageHeader`。
- 样式入口：`src/prototypes/superim-wallet/style.css` 的 `.wallet-page-header*` 规则。
- 主题来源：`src/themes/equatorial-minimalism/globals.css`。
- 规格文档：`src/prototypes/superim-wallet/spec.md`。

钱包页头使用独立的语义类名承载既有二级页头规范，避免直接改写编辑资料、安全设置等已经稳定的页面；视觉令牌和交互尺寸保持一致，后续如需全局抽取组件，可基于本方案统一迁移。

## 6. 验收清单

- [ ] 钱包首页从「我的」进入，返回按钮返回「我的」。
- [ ] 页头背景、分隔线、标题字号和左右间距与编辑资料、安全设置一致。
- [ ] 返回按钮和右侧安全入口均有可访问名称，钱包页头几何与编辑资料、安全设置一致。
- [ ] 钱包首页没有欢迎模块和聊天转账快捷卡片。
- [ ] 钱包子页面复用相同的基础页头结构。
- [ ] 400px 移动端画布内容左右边距为 16px；宽屏内容区可扩展到 32px。
- [ ] 主要间距使用 8px 节奏，卡片/按钮圆角使用主题 radius token。
- [ ] 小屏、宽屏、深色主题和 reduced motion 下无布局破坏。
