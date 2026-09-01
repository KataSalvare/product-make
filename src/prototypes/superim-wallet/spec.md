# SuperIM v2.0 钱包原型规格

## 原型目标

验证 Base Mainnet + USDC 钱包的核心信息层级、链上同链转账流程、聊天窗口内转账卡片和 Passkey/支付密码授权关系。原型默认使用内存 Mock 数据；当配置 Dynamic Environment ID 时，钱包首页额外展示 Dynamic Sandbox 连接 Demo，不连接真实 RPC、不发起真实 USDC 交易。

## Dynamic Demo 接入

- SDK：`@dynamic-labs/sdk-react-core@5.3.1`、`@dynamic-labs/ethereum@5.3.1`。
- 应用根部使用 `DynamicContextProvider`，EVM 连接器使用 `EthereumWalletConnectors`。
- 通过 `.env.local` 配置 `VITE_DYNAMIC_ENVIRONMENT_ID`；可参考仓库根目录 `.env.example`。
- Dynamic Sandbox 环境需在 Dashboard 中仅启用 Base Mainnet；本 Demo 不提供新增网络或跨链入口。
- 配置成功后，钱包首页的 `DYNAMIC DEMO` 卡片可以打开 Dynamic Widget，展示 SDK 加载状态、登录状态、钱包地址和钱包数量。
- 未配置 Environment ID 时不初始化 Dynamic，页面继续使用原有 Mock 钱包地址和交易数据。
- Demo 只验证 Dynamic 连接和钱包信息读取；转账、提现、充值、Passkey 和后台规则仍由原型 Mock 展示。

## 页面入口

钱包作为「我的 → Wallet」二级页面进入，统一入口为 `/wallet`，内部可点击进入：

- `/wallet/deposit`：Base Mainnet USDC 充值地址、二维码、充值状态。
- `/wallet/transfer`：SuperIM 用户间同链 USDC 转账，默认 Amara Okafor。
- `/wallet/withdraw`：Base Mainnet 外部地址提现，展示后台配置的手续费示例。
- `/wallet/transactions`：交易筛选与记录列表。
- `/wallet/transactions/:id`：提现处理中详情。
- `/wallet/security`：Passkey 优先、支付密码兜底和钱包安全说明。
- `/wallet/chat-transfer`：聊天内 USDC 转账卡片与授权状态。

单聊从聊天室更多操作进入 `/wallet/chat-transfer`；群聊从更多操作进入 `/wallet/transfer?source=group-chat`，并在转账页标识“群聊 · 单收款人”。

## 已确认规则

- 唯一网络：Base Mainnet；v2.0 不允许新增其他 EVM 网络。
- 唯一资产：USDC，精度 6 位；不展示 USDT 或其他资产。
- 内部转账为 Base Mainnet 内链上转账，仅限 SuperIM 用户，不支持跨链。
- 群聊转账在后续聊天接入时只允许单收款人。
- 内部转账由 SuperIM 代付 Gas；提现展示服务手续费，网络 Gas 由平台承担。
- 转账/提现需用户授权，Passkey 优先，支付密码兜底；不能绕过用户签名。
- 提现支持 Base Mainnet 外部地址，不提供地址簿和白名单。
- 充值只展示链上地址/二维码，不包含法币购买。

## 交互状态

- 点击 Deposit / Transfer / Withdraw 进入对应流程。
- Transfer 与 Withdraw 在 Review 后打开底部授权面板；Passkey 是主操作，Payment password 是 fallback。
- 授权完成只模拟成功，Transfer 显示完成反馈，Withdraw 显示处理中反馈。
- 首页交易列表可进入详情；聊天卡片可完成授权并切换为已完成。
- 地址复制与保存草稿提供 Toast 反馈。
- 钱包首页不展示欢迎文案或聊天转账快捷卡片；聊天转账只从聊天室/群聊窗口内发起。
- `/wallet/chat-transfer` 复用原聊天室的会话页头、消息滚动区、消息气泡、输入栏和滚动层级，仅在原消息流末尾追加一张 USDC 转账卡片。

## 视觉规范

- 复用 `src/themes/equatorial-minimalism/globals.css` 的主题变量。
- Soft Sand 页面底色、Deep Indigo 结构色、Terracotta 关键操作与金额强调。
- 用户端按 400 × 852 移动端预览设计，内容左右边距为 16px，触控目标不小于 44px。
- 使用 Lucide SVG 图标，不使用 Emoji 作为结构图标；支持深色模式变量与 reduced motion。
- 间距遵循 8px 节奏；主要卡片、输入框和按钮使用主题 `--radius-*` token；状态色使用主题语义变量。
- 顶部导航复用 SuperIM 二级页面规范：`surface-container-low` 背景、底部边框、左侧返回按钮、单行页面标题，右侧仅放置当前页面操作。
- 钱包页头的返回按钮、标题字号、内边距与 `编辑资料`、`安全设置` 保持一致；钱包安全入口作为右侧页面操作保留。
- 详细的用户端二级页头盘点、变体边界和钱包落地方案见同目录 `design.md`。
