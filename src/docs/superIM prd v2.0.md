# 产品需求文档（PRD）：SuperIM v2.0 Dynamic 钱包集成

**产品名称：** SuperIM
**版本：** V2.0
**文档状态：** 需求已确认，后端绑定接口和 Dynamic Dashboard 配置待接入
**最后更新：** 2026-09-01
**范围：** SuperIM 用户端、聊天场景与 Dynamic SDK 集成

---

## 1. 产品定位

v2.0 不再实现 SuperIM 自有的钱包、余额、签名和交易系统。SuperIM 作为 Dynamic 的业务入口和聊天编排层，Dynamic 负责身份认证、Embedded Wallet、外部钱包连接、充值、转账和用户签名。

### 1.1 SuperIM 负责

- 从「我的 → Wallet」提供钱包入口。
- 将 Dynamic 用户与 SuperIM 用户建立绑定。
- 获取并绑定用户的 Dynamic 钱包地址。
- 查询聊天对象是否存在已绑定钱包地址。
- 在单聊和群聊中提供快捷转账入口。
- 调用 Dynamic Send，并预填收款地址。
- 展示钱包不可用、对方未开通钱包、Dynamic 取消或失败等业务反馈。
- 在转账完成后保存聊天消息与 Dynamic 交易哈希的关联。

### 1.2 Dynamic 负责

- 登录、注册和认证。
- 创建或恢复 Embedded Wallet。
- 连接外部钱包。
- 展示钱包地址和资产余额。
- 提供 Funding / Deposit UI。
- 提供 Send UI。
- 发起交易并请求用户签名。
- 返回交易哈希及成功、取消、失败状态。

SuperIM 不保存私钥、助记词、支付密码、签名材料或自行维护链上余额。

---

## 2. Dynamic 配置

- 应用使用 `@dynamic-labs/sdk-react-core` 和 `@dynamic-labs/ethereum`。
- 所有 Dynamic 包必须保持同一版本；当前仓库锁定 `5.3.1`。
- `DynamicContextProvider` 位于应用根部。
- 钱包入口和登录/注册页面使用 `DynamicEmbeddedWidget`，不再使用自建登录表单或 Mock 授权面板。
- Dynamic Dashboard 开启 EVM 和 Embedded Wallet。
- 开启 `Create on Sign up`，使用户完成 Dynamic 登录后自动创建 Embedded Wallet。
- 产品主网固定为 Base；开发和验收环境应使用 Base Sepolia，生产环境再切换 Base Mainnet。
- v2.0 不开放网络切换、跨链、兑换、质押、NFT 或多资产账户。
- 是否允许 MetaMask 等外部钱包连接由 Dynamic Dashboard 配置决定；除 Embedded Wallet 外不作为 v2.0 必须验收项。

---

## 3. 登录和钱包创建

```text
进入 SuperIM
    ↓
Dynamic 内嵌登录 / 注册
    ↓
Dynamic 创建或恢复 Embedded Wallet
    ↓
读取 primaryWallet.address
    ↓
SuperIM 后端验证 Dynamic JWT
    ↓
绑定 dynamicUserId ↔ superimUserId ↔ walletAddress
    ↓
进入 SuperIM
```

### 3.1 钱包状态

- `pending`：Dynamic 登录完成，钱包仍在创建或同步。
- `ready`：已获取有效钱包地址，可使用钱包功能。
- `failed`：创建或绑定失败，可重试。
- 未完成钱包绑定时，不允许从聊天发起转账。

### 3.2 地址绑定

前端从 Dynamic 获取公开地址，后端使用 Dynamic JWT 验证身份后完成绑定。客户端传入的地址不得作为唯一信任依据。

建议接口：

```text
POST /api/wallet/bind
Authorization: Bearer <Dynamic JWT>
```

请求字段：

```ts
{
  dynamicUserId: string;
  dynamicWalletId: string;
  walletAddress: string;
  network: 'Base';
}
```

查询聊天对象地址：

```text
GET /api/users/:userId/wallet
Authorization: Bearer <Dynamic JWT>
```

- 返回地址：允许进入 Dynamic Send。
- 返回 `404`：提示“对方暂未开通钱包”。
- 服务不可用：提示“暂时无法获取钱包地址”，不得误报为未开通。

---

## 4. 页面与入口

| 页面 | 路径 | 责任 |
| --- | --- | --- |
| Dynamic 登录 | `/login` | 展示 Dynamic 内嵌认证页 |
| Dynamic 注册 | `/register` | 展示 Dynamic 内嵌认证页 |
| 钱包入口 | `/wallet` | 展示 Dynamic Embedded Wallet 页面 |
| 钱包兼容入口 | `/wallet/deposit`、`/wallet/transactions` 等 | 保留旧链接，展示或跳转 Dynamic 钱包页 |
| 单聊快捷转账 | `/wallet/chat-transfer` | 查询收款人地址并打开 Dynamic Send |
| 群聊快捷转账 | `/wallet/transfer` | 选择一名群成员并打开 Dynamic Send |

钱包页面不再自行实现余额卡、充值二维码、交易列表、提现表单或交易详情。

---

## 5. 充值

充值由 Dynamic Funding 能力提供：

- 钱包收款地址由 Dynamic 提供。
- 外部钱包充值使用 Dynamic Funding / Fund from External Wallet。
- 法币充值仅在 Dynamic Dashboard 配置对应 Onramp 后开放。
- SuperIM 不直接修改余额。
- 余额和交易状态以 Dynamic 或链上结果为准。

充值相关功能是否可用取决于 Dynamic Dashboard 的 Funding 配置。未配置时，SuperIM 必须展示明确的配置/不可用提示。

---

## 6. 转账和签名

SuperIM 使用 Dynamic `useSendBalance` 打开 Send UI，并在有地址时预填 `recipientAddress`。金额、资产、网络确认和签名均由 Dynamic 处理。

```text
聊天对象选择
    ↓
SuperIM 查询钱包地址
    ↓
Dynamic Send UI（预填 recipientAddress）
    ↓
用户在 Dynamic 内确认并签名
    ↓
返回交易哈希 / 成功 / 取消 / 失败
    ↓
SuperIM 更新聊天消息关联状态
```

要求：

- 收款地址必须来自 SuperIM 后端绑定记录或经过校验的 Dynamic 数据。
- 不能使用固定 Demo 地址。
- 不在 SuperIM 内实现 Passkey、支付密码或签名弹窗。
- Dynamic 取消或失败时，不创建成功转账消息。
- 交易哈希用于消息关联和后续状态查询。
- 群聊只允许选择一名 SuperIM 用户，不允许转给群组或多人分发。

---

## 7. 聊天转账

### 7.1 单聊

- 输入栏更多操作提供 Transfer。
- 收款人默认为当前会话对象。
- 有绑定地址时打开 Dynamic Send。
- 无绑定地址时提示“对方暂未开通钱包”。

### 7.2 群聊

- 输入栏更多操作提供 Transfer。
- 必须明确选择一名群成员。
- 查询该成员的钱包绑定状态。
- 无绑定地址时阻止打开 Send。

### 7.3 消息关联模型

```ts
interface WalletTransferMessage {
  id: string;
  type: 'wallet-transfer';
  transactionHash?: string;
  senderUserId: string;
  recipientUserId: string;
  amount?: string;
  assetSymbol: 'USDC';
  network: 'Base';
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  note?: string;
  createdAt: string;
}
```

SuperIM 只保存消息和交易的业务关联，链上交易真实性由 Dynamic / 链上查询确认。

---

## 8. 安全边界

- Dynamic 使用 `connect-and-sign` 认证模式。
- SuperIM 后端验证 Dynamic JWT 后再绑定用户和钱包地址。
- 前端不保存私钥、助记词、支付密码或签名结果以外的敏感材料。
- 不在日志中记录 Dynamic JWT。
- 不允许管理员代替用户签名或发起转账。
- 钱包地址可以展示和复制，但必须明确网络和资产。
- 生产环境使用 Base Mainnet 前，必须完成 Base USDC 合约和 Dynamic 环境配置复核。

### 8.1 钱包运营后台

后台只负责观察和管理业务同步状态，不拥有用户钱包控制权：

- 查看 Dynamic 用户、SuperIM 用户与钱包地址的绑定关系。
- 查看 Dynamic Send、Funding、链上收款和用户签名事件的同步结果。
- 查看 Dynamic/链上基础设施健康状态和待同步事件。
- 查看钱包绑定、交易同步和管理员配置审计日志。
- 不展示私钥、助记词、支付密码，不代替用户发起或签名交易。

后台接口：

```text
GET /api/admin/wallet/overview
GET /api/admin/wallet/transactions
GET /api/admin/wallet/users
GET /api/admin/wallet/audit
```

后台接口必须校验管理员身份和权限；交易状态以 Dynamic webhook 和链上确认结果为准，并对 webhook 做签名校验、幂等处理和重放保护。

---

## 9. 明确非目标

- SuperIM 自建钱包和密钥管理。
- SuperIM 自建余额系统。
- SuperIM 自建支付密码和 Passkey。
- SuperIM 自建充值二维码和链上监听。
- SuperIM 自建提现审批、额度、服务费和 Gas 赞助系统。
- 自建多链、跨链、兑换、质押、NFT。
- 未接入后端前伪造用户钱包绑定、余额和交易数据。

---

## 10. 验收标准

- `/login` 和 `/register` 展示 Dynamic 内嵌认证页。
- Dynamic 登录后能够创建或恢复 Embedded Wallet。
- `/wallet` 展示 Dynamic Embedded Wallet 页面。
- 能从 Dynamic 获取当前用户公开钱包地址。
- 后端能够验证 Dynamic JWT 并绑定地址。
- Dynamic Funding 配置完成后可以打开充值流程。
- 聊天/群聊可以查询对方钱包地址并预填 Dynamic Send。
- 对方没有绑定地址时提示“对方暂未开通钱包”。
- 用户在 Dynamic 内完成交易确认和签名。
- Dynamic 取消、失败和成功结果均能正确反馈。
- SuperIM 不再使用静态余额、Demo 地址、自建签名面板或 Mock 交易记录。
