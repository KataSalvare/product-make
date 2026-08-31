# 产品需求文档（PRD）：SuperIM v2.0 虚拟货币钱包

**产品名称：** SuperIM  
**版本：** V2.0  主要能力：虚拟货币钱包  
**文档状态：** 核心产品需求已确认，运营默认值待确认  
**最后更新：** 2026-08-31  
**范围：** SuperIM 用户端、聊天场景与管理端前端原型（Mock-only）

---

## 1. 背景与目标

### 1.1 背景

SuperIM v1.x 已完成即时通讯、社交动态、Saved Messages 和 Cloud Drive 等能力。v2.0 增加虚拟货币钱包，使用户可以在应用内管理余额，并在聊天中直接向其他用户转账。

### 1.2 产品目标

1. 用户注册账号时自动获得 Base Mainnet 默认钱包地址，确保账号创建完成后即可接收和发起 USDC 转账。
2. 用户可在钱包中完成充值、转账、提现，并查看交易记录和状态。
3. 用户可在单聊或群聊中直接发起转账，聊天消息中能清晰呈现转账金额、状态和操作结果。
4. 所有转账操作必须经过支付密码或 Passkey 校验。
5. 正式开发阶段接入 [Dynamic](https://www.dynamic.xyz/) 的 Embedded Wallet 能力；本期原型不接真实链、真实资产或真实交易。
6. v2.0 固定使用 Base Mainnet 和 USDC；暂不开放新增其他 EVM 网络钱包，网络扩展作为后续版本规划。
7. 钱包页面、聊天转账消息和交互反馈必须遵循 `src/themes/equatorial-minimalism` 主题规范。

### 1.3 成功标准

- 注册流程完成后，用户资料中存在默认钱包地址状态，并可在钱包页查看。
- 用户能在原型中完整演示充值、转账、提现、交易记录和交易详情的主要状态。
- 用户能从单聊/群聊进入转账流程，选择或确认收款人，提交支付校验后生成聊天转账消息。
- 转账失败、余额不足、支付校验失败、处理中和完成等状态均有明确的页面或消息反馈。
- 钱包相关页面沿用现有移动端 400 × 852 预览、主题 Token、返回行为和底部导航约定。

### 1.4 非目标

本期不包含：

- 真实区块链交易、真实充值、真实提现或真实余额同步。
- 真实 Dynamic 环境变量、API Key、链上 RPC、代币合约和生产鉴权配置。
- 其他 EVM 网络钱包、真实多链交易链路、跨链桥、跨链转账、兑换、质押、NFT 或公开收款链接。
- 其他资产、USDT 和多资产余额；v2.0 只展示 USDC。
- 复杂 KYC/AML、风控策略、客服仲裁和法务合规流程实现；原型只展示必要的状态入口。
- 将钱包私钥、助记词或支付密码写入前端 Mock 数据、LocalStorage 或聊天消息。

---

## 2. 接入与安全约束

### 2.1 Dynamic 接入要求

正式开发需要接入 Dynamic，建议使用其 Embedded Wallet 方案：

- 在 Dynamic Dashboard 开启 Base Mainnet 与 Embedded Wallet，并配置 `Create on Sign up`，使用户注册时自动创建 Base Mainnet 默认钱包。
- v2.0 只启用 Base Mainnet，不提供新增其他 EVM 网络钱包的入口；网络扩展能力保留给后续版本。
- 钱包首页、充值、转账、提现和交易详情均明确展示 Base Mainnet。
- v2.0 只支持 Base 原生 USDC，资产精度为 6 位；正式开发时服务端固定并校验 USDC 合约地址，不接受同名或非官方代币。
- Base Mainnet 原生 USDC 合约地址记录为 `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`，正式开发前仍需由服务端配置和链上数据再次校验。[官方地址](https://developers.circle.com/stablecoins/usdc-contract-addresses)
- 注册完成后读取 Dynamic 返回的钱包对象和公开地址，并将地址与 SuperIM 用户账号建立服务端关联。
- 钱包地址是公开信息，可以展示、复制和用于收款；私钥、助记词、签名材料不进入 SuperIM 前端业务数据。
- 充值使用目标钱包地址作为收款地址；转账/提现由钱包签名流程完成，交易状态以服务端或链上查询结果为准。
- 正式接入必须在服务端验证 Dynamic 身份凭证，并由服务端负责用户账号与钱包地址的绑定校验。
- Dynamic SDK、Embedded Wallet 版本和具体 API 以正式开发时官方文档为准；原型阶段只模拟调用结果。

参考官方资料：

- [Creating Embedded Wallets](https://www.dynamic.xyz/docs/react/wallets/embedded-wallets/mpc/creating-wallets)
- [Enabling EVM Chains](https://www.dynamic.xyz/docs/react/chains/enabling-chains)
- [Sending an EVM Transaction](https://www.dynamic.xyz/docs/react/wallets/using-wallets/evm/send-a-transaction)
- [Architecture & Security](https://docs.dynamic.xyz/wallets/embedded-wallets/architecture-security)
- [Adding Smart Wallets and Gas Sponsorship](https://www.dynamic.xyz/docs/react/smart-wallets/add-smart-wallets)

### 2.2 注册时创建默认钱包

注册成功后的业务顺序：

```text
创建 SuperIM 账号
    ↓
Dynamic 创建或确认 Base Mainnet 默认 Embedded Wallet
    ↓
读取公开钱包地址
    ↓
服务端绑定 userId ↔ networkId ↔ walletAddress
    ↓
进入 SuperIM 主应用
```

状态要求：

- `wallet_pending`：账号已创建，钱包仍在创建或同步。
- `wallet_ready`：已获得默认钱包地址，可接收资产和进入钱包页。
- `wallet_failed`：创建失败，允许重试，不允许进入需要钱包的转账操作。
- 用户注册完成后，即使钱包创建暂时失败，也必须明确告知用户并提供重试入口；不得静默生成不可用的假地址。
- Base Mainnet 是 v2.0 唯一可用网络和产品主网络；其他网络暂不创建、不展示。

### 2.3 转账支付校验

转账、聊天转账和提现提交前必须完成支付校验：

- 优先使用 `Passkey`；Passkey 不可用、未设置或验证失败时，才允许使用 `Payment password` 兜底。
- 用户未设置任何支付校验方式时，首次发起转账应先进入安全设置，引导完成支付密码或 Passkey 设置。
- 支付密码只允许提交校验结果，不在原型状态和生产日志中保存明文。
- Passkey 使用系统 WebAuthn/Dynamic 支持的流程；原型阶段展示系统验证中的 Loading、成功、取消和失败状态。
- 校验失败不得创建成功交易或聊天转账消息；可展示剩余尝试次数或重试入口，但具体锁定策略待确认。

---

## 3. 用户端页面与入口

### 3.1 页面清单

钱包不作为一级底部导航入口，用户从「我的」页面进入「Wallet」二级页面；钱包首页不提供独立的聊天转账快捷卡片。聊天室和群聊的输入栏更多操作中均提供 `Transfer` 入口。

| 页面 | 建议路径 | 说明 |
| --- | --- | --- |
| Wallet 首页 | `/wallet` | 余额、钱包地址、充值/转账/提现快捷入口、最近交易；聊天转账仅从聊天窗口发起 |
| 充值 | `/wallet/deposit` | 展示收款地址、复制/二维码入口、充值处理中状态 |
| 转账 | `/wallet/transfer` | 选择收款人、输入金额、备注、费用摘要、支付校验 |
| 提现 | `/wallet/withdraw` | 输入提现地址/目标、金额、费用摘要、支付校验 |
| 交易记录 | `/wallet/transactions` | 全部/充值/转账/提现筛选、搜索和状态过滤 |
| 交易详情 | `/wallet/transactions/:id` | 金额、方向、对手方、地址、网络、手续费、状态和交易 ID |
| 钱包安全设置 | `/wallet/security` | 支付密码、Passkey、钱包地址和安全提示 |
| 聊天转账面板 | 集成 `/chatroom`、`/group-chat` | 从聊天直接选择转账对象并发送转账消息 |

### 3.2 Wallet 首页

首屏信息层级：

1. 当前网络、`Primary` 标识、USDC 余额和资产单位；默认网络为 Base Mainnet。
2. 钱包地址的截断展示、复制和查看完整地址。
3. 当前网络固定展示为 Base Mainnet，并显示 `Primary` 标识。
4. 三个核心动作：`Deposit`、`Transfer`、`Withdraw`。
5. 最近交易列表，展示方向、对手方、网络、金额、时间和状态。
6. 安全提示：转账前需要 Passkey，无法使用时以 Payment password 兜底。

### 3.3 充值

- 展示 Base Mainnet 默认钱包地址、USDC 资产信息和充值提示。
- 固定展示 Base Mainnet；v2.0 不提供网络切换。
- 支持复制地址；若最终确认使用二维码，再增加二维码展示入口。
- 模拟状态：`Waiting for deposit`、`Confirming`、`Completed`、`Failed`。
- 充值金额以链上到账为准，原型不允许用户直接修改余额。

### 3.4 转账

- 收款人可从联系人/聊天对象中选择；是否支持直接输入钱包地址，待确认。
- 转账固定使用 Base Mainnet 和 USDC。
- 内部转账为 Base Mainnet 内的 USDC 链上转账，只允许 SuperIM 用户之间转账，不支持跨链转账。
- 展示收款人名称、钱包地址、目标网络、USDC 金额、备注和预计手续费。
- 收款人必须拥有所选网络的钱包；否则阻止提交并提示对方先开通该网络钱包。
- 内部转账由平台通过 Smart Wallet/Paymaster 代付 Gas；界面展示“Gas 由 SuperIM 承担”。
- 提交前展示二次确认摘要。
- 二次确认后优先进入 Passkey 校验，无法使用时再进入支付密码校验。
- 模拟状态：`Review` → `Verifying` → `Processing` → `Completed` / `Failed`。
- 余额不足时阻止提交，并说明可用余额与缺口。
- 成功后写入交易记录；若来源是聊天，则同时向目标会话追加转账消息。

### 3.5 提现

- 输入或选择提现目标地址，目标网络固定为 Base Mainnet，展示金额、手续费和到账金额。
- 提现目标支持 Base Mainnet 外部地址；不提供地址簿或白名单。
- 提现目标地址必须二次确认；默认不把地址识别为联系人，避免误转。
- 提交前执行支付密码或 Passkey 校验。
- 模拟状态：`Review` → `Verifying` → `Processing` → `Completed` / `Failed`。
- 地址格式校验、最小提现额、每日限额和手续费规则由后台配置；具体默认值与配置权限待确认后补充。

---

## 4. 聊天内转账

### 4.1 入口

- 单聊输入栏附件/更多操作中增加 `Transfer`。
- 群聊输入栏附件/更多操作中增加 `Transfer`；群聊中需要明确收款人，默认不允许“转给群组”。
- 聊天转账入口只对已完成钱包绑定的 SuperIM 用户可用。

### 4.2 转账面板

```text
Transfer to
├── 收款人头像、姓名、@username
├── 钱包地址摘要（可展开）
├── Network（固定 Base Mainnet）
├── 金额输入 + 资产单位
├── Optional note
├── Available balance / Network fee
└── Continue → Payment password / Passkey → Send
```

聊天转账必须是 Base Mainnet 内的链上转账；群聊只允许选择一名 SuperIM 用户作为收款人，不支持转给群组、多人分发或跨链转账。

### 4.3 聊天转账消息样式

发送方和接收方看到同一笔交易的不同状态视图：

- **Pending**：浅色强调卡片，显示 `Transfer pending` 和时间。
- **Completed**：Terracotta 强调金额，显示 `Received` 或 `Sent`、金额和对手方。
- **Failed**：使用主题 `--error`，显示 `Transfer failed` 和 `Try again`。
- **Canceled/Expired**：使用低强调度灰色状态，不伪装成成功交易。

消息卡片至少包含：

- 转账图标和 `Transfer` 标签。
- 金额、资产单位和方向。
- 对手方名称或地址摘要。
- 状态、时间和可选备注。
- 点击后进入交易详情；失败状态允许重新发起，但必须重新进行支付校验。

### 4.4 聊天消息数据约定

```ts
interface WalletTransferMessage {
  id: string;
  type: 'wallet-transfer';
  transactionId: string;
  senderUserId: string;
  recipientUserId: string;
  amount: string;
  assetSymbol: string;
  status: 'pending' | 'confirming' | 'completed' | 'failed' | 'canceled';
  note?: string;
  createdAt: string;
}
```

---

## 5. 数据模型与 Mock 约定

### 5.1 钱包

```ts
interface WalletAccount {
  id: string;
  userId: string;
  address: string | null;
  networkId: string;
  networkName: string;
  isPrimary: boolean;
  assetSymbol: string;
  status: 'pending' | 'ready' | 'failed';
  createdAt: string;
  updatedAt: string;
}
```

### 5.2 交易

```ts
type WalletTransactionType = 'deposit' | 'transfer' | 'withdraw';
type WalletTransactionStatus = 'pending' | 'confirming' | 'completed' | 'failed' | 'canceled';

interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  amount: string;
  fee: string;
  assetSymbol: string;
  networkId: string;
  networkName: string;
  gasSponsored: boolean;
  senderUserId?: string;
  recipientUserId?: string;
  counterpartyAddress?: string;
  network?: string;
  txHash?: string;
  note?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 5.3 原型 Mock 边界

- 可使用 `superim-wallet-state-v1` LocalStorage 保存钱包与交易 Mock 状态，使用 CustomEvent 实现页面间同步。
- Mock 余额从交易记录派生，或由明确的初始种子值和交易流计算；不能让多个页面各自维护互相矛盾的余额。
- Mock 钱包地址只能使用不可发送的示例地址，并明确标注为 Demo；不得让用户误以为是真实地址。
- 不保存支付密码、Passkey 私密凭据、Dynamic token 或真实私钥。

---

## 6. 后台管理范围

| 页面 | 建议路径 | 核心能力 |
| --- | --- | --- |
| 钱包运营总览 | `/admin/wallet` | 钱包开通率、交易量、交易额、失败率、处理中交易 |
| 交易管理 | `/admin/wallet/transactions` | 搜索、筛选、查看交易元数据和状态 |
| 用户钱包 | `/admin/wallet/users` | 用户、钱包地址、绑定状态、余额摘要 |
| 钱包规则配置 | `/admin/wallet/settings` | 提现手续费、最低提现金额、每日/周期额度限制 |
| 钱包审计 | `/admin/wallet/audit` | 钱包绑定、交易状态变更、人工处理记录 |

后台只展示交易元数据和运营状态，不展示私钥、助记词、支付密码或 Passkey 内容，不提供管理员代替用户签名转账的能力。

---

## 7. 主题与交互规范

- 设计规范来源：`src/themes/equatorial-minimalism/DESIGN.md` 与 `globals.css`。
- 钱包主色使用 Deep Indigo，关键动作和成功转账金额使用 Terracotta；错误状态只使用 `--error`。
- 余额卡使用主题层级和 ambient shadow，不引入独立的紫色或加密货币交易所视觉风格。
- 资产、金额、地址和交易状态必须同时使用文字表达，不能只依赖颜色或图标。
- 复制、二维码、更多等图标按钮提供可识别的 `aria-label`，触控区域不小于 44 × 44px。
- 支付校验、交易处理中和失败状态必须提供 Loading、成功、取消和错误反馈。
- 聊天转账卡片遵循现有消息气泡和圆角规范，确保在单聊、群聊和深色模式下可读。

---

## 8. 待确认事项

以下事项会影响页面字段、数据模型和交易流程，不能由当前需求安全推断：

1. 提现手续费、最低提现额、每日/周期额度由后台配置；具体默认值和修改权限仍需定义。
2. 钱包转账页是否允许输入外部地址？当前聊天转账仅限 SuperIM 用户，外部地址提现统一走提现流程。
3. 用户注册时如果 Dynamic 钱包创建失败，是否允许账号进入主应用后重试？本 PRD 默认允许进入但限制钱包操作。
4. 后台钱包规则配置和交易处理分别需要哪些角色权限、审批和审计记录？

---

## 9. v2.0 原型验收清单

- [ ] 注册完成后可演示 `wallet_pending`、`wallet_ready`、`wallet_failed` 三种状态。
- [ ] `/wallet` 展示余额、Demo 钱包地址、充值/转账/提现入口和最近交易。
- [ ] `/wallet` 固定展示 Base Mainnet，不提供新增其他 EVM 网络钱包入口。
- [ ] 充值流程支持地址复制和充值状态展示。
- [ ] 转账流程支持收款人、金额、手续费摘要、支付密码/Passkey 模拟校验和交易状态。
- [ ] 转账固定使用 Base Mainnet；仅支持 Base Mainnet 内链上转账，不支持跨链。
- [ ] SuperIM 用户之间的内部转账展示平台代付 Gas。
- [ ] 后台可配置提现手续费、最低提现金额和额度限制，并在用户提现确认页展示生效规则。
- [ ] 提现流程支持目标地址、金额、手续费摘要、支付校验和状态反馈。
- [ ] `/chatroom` 与 `/group-chat` 可打开转账面板，并生成符合主题的转账消息卡片。
- [ ] 聊天转账消息可进入交易详情；失败状态不能伪装为成功。
- [ ] 交易记录支持类型和状态筛选，交易详情展示关键元数据。
- [ ] 不在 Mock 数据、LocalStorage 或页面日志中保存支付密码、Passkey 私密信息、Dynamic token 或私钥。
- [ ] 所有新增钱包原型通过 `node scripts/check-app-ready.mjs /prototypes/[目录]` 验收。
