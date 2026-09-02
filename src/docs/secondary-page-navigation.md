# 用户端二级页面顶部导航规范

> 项目记忆：SuperIM 用户端二级页面统一采用的顶部导航方案。后台控制台使用独立的桌面端导航，不适用本规范。

## 适用范围

基础二级页包括编辑资料、安全设置、隐私设置、设置、账号切换、添加联系人、选择联系人、收藏详情、我的动态、转发消息、用户资料和动态详情等页面。

聊天列表、通讯录、动态、通话和「我的」是同源的一级入口变体：保留相同视觉语言，但通常不显示返回按钮。云盘文件、文件夹和会话页是场景变体，可增加副标题、多操作或多选态。

## 基础页头规范

- 结构：`header` → 横向 flex 行 → 左侧返回按钮和页面标题 → 右侧可选页面操作。
- 背景：`var(--surface-container-low)`。
- 分隔：底部 `1px solid var(--outline-variant)`。
- 内边距：上下 `10px`、左右 `16px`；宽屏只扩大内容区，不改变页头起点。
- 高度：`65px`，由 `10px + 44px 内容行 + 1px 边框` 组成。
- 返回按钮：44×44px 触控盒子，使用 24px `ArrowLeft`，颜色为 `var(--on-surface)`。
- 标题：`text-headline-md`，主题主色；20px、600、28px；单行，过长截断。
- 左侧间距：返回按钮和标题之间 `12px`，对应 `gap-3`。
- 右侧操作：只放置当前页面动作，如保存、筛选、更多或安全设置；没有操作时不添加空白占位。
- 层级：`sticky; top: 0; z-index: 20`；页头不能被内容滚动带走。

## 交互与可访问性

- 返回按钮使用原生 `button`，返回上一级；从固定入口打开时提供明确兜底路径。
- 图标按钮必须有 `aria-label`；装饰性 SVG 使用 `aria-hidden="true"`。
- 悬停、按下和聚焦只改变背景或轮廓，不改变布局尺寸。
- 页面外层不得因内容高度被撑开；滚动应发生在页头下方的内容区。
- 使用主题变量，支持深色主题和 `prefers-reduced-motion`，不使用 Emoji 作为结构图标。

## 场景变体

- 一级入口页：标题左对齐，右侧可放入口操作，不显示返回按钮。
- 云盘页：可使用 `px-3 py-3`，标题下增加 `text-xs` 副标题；文件操作按钮保持至少 44px 触控区域。
- 会话页：页头展示会话身份、在线状态和会话操作；多选态使用关闭图标和已选数量。
- 聊天转账入口属于聊天室/群聊内容操作，不放进钱包首页页头；转账表单直接以聊天容器内弹窗呈现，不新增二级页面。

## 钱包落地

- 钱包是「我的」下的二级页面，必须使用基础页头，不使用品牌卡片式页头、欢迎语或 `FROM MY ACCOUNT` 文案。
- 钱包首页：返回 `/me`，标题 `Wallet`，右侧保留钱包安全入口 `/wallet/security`。
- 钱包子页面：`Deposit USDC`、`Transfer USDC`、`Withdraw USDC`、`Transactions`、`Transaction details`、`Wallet security` 复用同一页头组件。
- Base Mainnet 和 USDC 属于内容区业务信息，不作为页头副标题重复展示。

## 代码索引

- 钱包实现：`src/prototypes/superim-wallet/index.tsx` 的 `PageHeader`。
- 钱包样式：`src/prototypes/superim-wallet/style.css` 的 `.wallet-page-header*`。
- 页面详细设计：`src/prototypes/superim-wallet/design.md`。
- 主题来源：`src/themes/equatorial-minimalism/globals.css`。
