# 产品需求文档（PRD）：SuperIM v2.0 Dynamic 钱包集成

**产品名称：** SuperIM
**版本：** V2.0
**文档状态：** 需求已确认，研发实施约束已明确；后端接口和 Dynamic Dashboard 配置待接入
**最后更新：** 2026-09-01
**范围：** SuperIM 用户端、聊天场景与 Dynamic SDK 集成

---

## 1. 产品定位

v2.0 不再实现 SuperIM 自有的钱包、余额、签名和交易系统。SuperIM 继续负责账号注册、登录和应用会话；用户进入「我的 → Wallet」后，SuperIM 作为 Dynamic 的钱包入口和聊天编排层，由 Dynamic 负责钱包认证、Embedded Wallet、外部钱包连接、充值、转账和用户签名。

### 1.1 领域边界

| 领域对象/能力 | SuperIM 的职责 | Dynamic / 区块链的职责 |
| --- | --- | --- |
| SuperIM 用户 | 注册、登录、`superimUserId`、会话 | 不创建、不替代 SuperIM 用户 |
| Dynamic 用户 | 保存关联关系 | 创建/识别 `dynamicUserId`，提供认证令牌 |
| 聊天钱包 | 保存唯一的 Embedded Wallet 绑定、状态和可用性 | 创建/恢复 Embedded Wallet |
| 外部钱包 | 允许连接并作为充值资金来源 | 连接、授权和外部钱包操作 |
| 聊天转账 | 提供入口、收款人校验、消息和业务关联 | 提供 Send UI、签名和交易执行 |
| 余额与链上交易 | 展示同步结果，不维护账本 | 提供余额、交易结果和链上确认 |
| 运营后台 | 只读观察、同步和审计 | 不授予管理员钱包控制权 |

### 1.2 核心术语

- **钱包开通：** SuperIM 用户在已有登录态下，于「我的 → Wallet」完成 Dynamic 认证并创建/恢复 Embedded Wallet；Dynamic 认证成功不等于钱包已开通。
- **聊天钱包：** 当前 SuperIM 用户唯一用于聊天收款和聊天转账的 Dynamic Embedded Wallet。外部钱包不属于聊天钱包。
- **外部钱包：** MetaMask 等用户连接的钱包，只用于连接或为 Embedded Wallet 充值，不进入聊天钱包绑定记录。
- **钱包绑定：** SuperIM 后端将已验证的 `dynamicUserId`、当前会话对应的 `superimUserId` 和 Embedded Wallet 地址建立关联。
- **转账消息：** SuperIM 的聊天业务对象；它只关联 Dynamic/链上交易，不代表 SuperIM 自己执行或托管资金。

### 1.3 SuperIM 负责

- 从「我的 → Wallet」提供钱包入口。
- 在当前 SuperIM 登录态下，将 Dynamic 用户与 SuperIM 用户建立绑定。
- 获取并绑定用户的 Dynamic 钱包地址。
- 聊天收款地址只允许绑定 Dynamic Embedded Wallet 地址。
- 外部钱包只用于连接或为 Embedded Wallet 充值，不作为聊天默认收款地址或聊天转账钱包。
- 查询聊天对象是否存在已绑定钱包地址。
- 在单聊和群聊中提供快捷转账入口。
- 调用 Dynamic Send，并预填收款地址。
- 展示钱包不可用、对方未开通钱包、Dynamic 取消或失败等业务反馈。
- 在转账提交后保存聊天消息与 Dynamic/链上交易结果的关联。

### 1.4 Dynamic 负责

- 钱包开通所需的身份认证和签名。
- 创建或恢复 Embedded Wallet。
- 连接外部钱包。
- 展示钱包地址和资产余额。
- 提供 Funding / Deposit UI。
- 提供 Send UI。
- 发起交易并请求用户签名。
- 返回交易结果及成功、取消、失败状态；最终链上哈希以 Dynamic webhook 或链上查询为准。

SuperIM 不保存私钥、助记词、支付密码、签名材料或自行维护链上余额。

### 1.5 v2.0 范围

**必须交付：**

- 在 SuperIM 注册/登录后，从「我的 → Wallet」开通 Dynamic Embedded Wallet。
- 绑定 `dynamicUserId ↔ superimUserId ↔ embeddedWalletAddress`。
- 查看 Embedded Wallet 地址和钱包开通状态。
- 单聊、群聊内查询收款人的钱包状态并发起快捷转账。
- 连接外部钱包，并使用外部钱包为当前用户的 Embedded Wallet 充值。
- Dynamic Send 取消、失败、提交和确认状态在聊天中正确反馈。

**可选交付：**

- Dynamic 支持的法币 Onramp。

**明确不做：**

- SuperIM 自建钱包、余额账本、提现、兑换、红包、多人分账或 Gas 代付。
- 多链、NFT、任意消息签名、管理员代签和 SuperIM 内部支付密码。

---

## 2. Dynamic 配置

- 应用使用 `@dynamic-labs/sdk-react-core` 和 `@dynamic-labs/ethereum`。
- 所有 Dynamic 包必须保持同一版本；当前仓库锁定 `5.3.1`。
- `DynamicContextProvider` 位于应用根部。
- 仅钱包入口使用 `DynamicEmbeddedWidget`；SuperIM 登录/注册继续使用 SuperIM 自有账号流程。
- Dynamic Dashboard 开启 EVM 和 Embedded Wallet。
- 是否开启 `Create on Sign up` 由钱包开通策略决定；v2.0 必须支持用户在钱包入口按需创建或恢复 Embedded Wallet。
- 前端只配置 `VITE_DYNAMIC_ENVIRONMENT_ID` 等公开环境标识，不存放 Dynamic API Secret；开发、测试、生产环境必须使用各自的 Environment。
- 产品主网固定为 Base；开发和验收环境应使用 Base Sepolia，生产环境再切换 Base Mainnet。
- v2.0 不开放网络切换、跨链、兑换、质押、NFT 或多资产账户。
- 是否允许 MetaMask 等外部钱包连接由 Dynamic Dashboard 配置决定；外部钱包只能用于连接或充值，不作为聊天钱包或聊天转账钱包。
- 生产配置必须补充 Base 网络、USDC 合约地址、decimals、Gas 资产和 Funding 能力，否则只能展示不可用提示。

---

## 3. SuperIM 账号与钱包开通

```text
用户注册 / 登录 SuperIM
    ↓
进入「我的 → Wallet」
    ↓
Dynamic 内嵌钱包认证
    ↓
创建或恢复 Embedded Wallet
    ↓
读取 Embedded Wallet 地址和 Dynamic userId
    ↓
SuperIM 后端同时验证 SuperIM 会话和 Dynamic JWT
    ↓
绑定 dynamicUserId ↔ superimUserId ↔ walletAddress
```

SuperIM 用户在注册/登录完成后才会进入应用。Dynamic 不创建 SuperIM 账号，也不替代 SuperIM 的登录态；Dynamic 用户和钱包只在钱包开通时与当前 SuperIM 用户绑定。

### 3.1 身份来源与创建时机

1. 用户在 SuperIM 注册成功时，由 SuperIM 后端创建 `superimUserId`，并建立 SuperIM 登录会话。
2. 用户使用已有 SuperIM 账号登录后，才可以进入「我的 → Wallet」开通钱包。
3. 用户在钱包入口完成 Dynamic 认证/创建钱包后，Dynamic 返回已认证用户上下文和钱包信息；Dynamic 用户 ID 取自已验证 Dynamic JWT 的 `sub`，不能信任客户端自行提交的 ID。
4. SuperIM 后端使用当前 SuperIM 会话取得 `superimUserId`，以 `dynamicUserId ↔ superimUserId` 为关联键幂等创建或更新钱包绑定记录。
5. 如果当前没有 SuperIM 登录会话，钱包绑定必须拒绝；如果 Dynamic 认证失败或钱包地址不可用，不能创建绑定记录。

v2.0 绑定约束：

- 一个 SuperIM 用户最多有一个有效的聊天钱包。
- 一个 Dynamic 用户最多绑定一个 SuperIM 用户；同一 Dynamic 用户尝试绑定其他 SuperIM 用户时拒绝。
- 一个 Dynamic 用户在 Base 网络最多绑定一个有效 Embedded Wallet。
- 外部钱包可以出现在 Dynamic 钱包列表中，但不得写入聊天钱包绑定记录。
- 钱包解绑、换绑、SuperIM 注销和 Dynamic 钱包删除必须使原绑定失效，并保留审计记录；历史转账消息不被删除。
- 绑定接口必须幂等；重复提交同一绑定返回成功，不得重复创建记录。

### 3.2 钱包状态

- `not_opened`：当前 SuperIM 用户尚未开通钱包。
- `opening`：钱包入口中的 Dynamic 认证或 Embedded Wallet 创建/恢复进行中。
- `binding`：已获得 Embedded Wallet 地址，等待后端绑定。
- `active`：Embedded Wallet 已创建且绑定成功，可以使用聊天钱包功能。
- `failed`：创建或绑定失败，可重试。
- `unbound`：原绑定已解除，不能继续用于聊天转账。
- 只有 `active` 状态允许从聊天发起转账。

### 3.3 地址绑定

前端从 Dynamic 获取 Embedded Wallet 的公开地址，后端使用当前 SuperIM 会话确定 `superimUserId`，使用 Dynamic JWT 的 `sub` 确定 `dynamicUserId`，并校验指定钱包属于该 Dynamic 用户且确实为 Embedded Wallet 后完成绑定。客户端传入的地址和钱包类型不得作为唯一信任依据。

建议接口：

```text
POST /api/wallet/bind
Authorization: Bearer <Dynamic JWT>
Cookie: <SuperIM session>
```

请求字段：

```ts
{
  dynamicWalletId: string;
  walletAddress: string;
  walletType: 'embedded';
  network: 'Base';
}
```

查询聊天对象地址：

```text
GET /api/users/:userId/wallet
Cookie: <SuperIM session>
```

- 返回地址：允许进入 Dynamic Send。
- 返回 `404`：提示“对方暂未开通钱包”。
- 服务不可用：提示“暂时无法获取钱包地址”，不得误报为未开通。

接口约束：

- `POST /api/wallet/bind` 的 `superimUserId` 必须从当前 SuperIM 会话取得，`dynamicUserId` 必须从 Dynamic Access Token 的 `sub` 取得；请求体中的同名字段如存在也必须忽略。
- 后端必须验证 Dynamic Token 的签发方、受众、有效期和签名，并确认 `dynamicWalletId` 属于该 Dynamic 用户且是 Embedded Wallet。
- `GET /api/users/:userId/wallet` 只允许当前用户查询其单聊对象或当前群成员；查询结果只返回聊天所需的地址和状态，不返回 Dynamic Token 或钱包敏感信息。
- `404` 仅表示对方没有有效聊天钱包；`401/403` 表示会话或访问权限问题；`409` 表示绑定冲突；`503` 表示服务不可用，前端不得将其显示为“未开通”。
- 地址必须校验为 Base EVM 地址；网络、链和资产不匹配时拒绝绑定或转账。

---

## 4. 页面与入口

| 页面 | 路径 | 责任 |
| --- | --- | --- |
| SuperIM 登录 | `/login` | 使用 SuperIM 自有账号流程登录，不创建 Dynamic 钱包 |
| SuperIM 注册 | `/register` | 使用 SuperIM 自有账号流程注册，不创建 Dynamic 钱包 |
| 钱包入口 | `/wallet` | 在已有 SuperIM 登录态下展示 Dynamic Embedded Wallet 开通页面 |
| 钱包兼容入口 | `/wallet/deposit`、`/wallet/transactions` 等 | 保留旧链接，展示或跳转 Dynamic 钱包页 |
| 单聊快捷转账 | `/wallet/chat-transfer` | 查询收款人地址并打开 Dynamic Send |
| 群聊快捷转账 | `/wallet/transfer` | 选择一名群成员并打开 Dynamic Send |

钱包页面不再自行实现余额卡、充值二维码、交易列表、提现表单或交易详情。

页面前置条件：

- `/login`、`/register` 只处理 SuperIM 账号，不触发 Dynamic 钱包创建。
- `/wallet` 必须要求已有 SuperIM 登录会话；未登录时跳转 `/login`。
- 已登录但钱包状态不是 `active` 时，允许进入钱包页完成开通，但禁止聊天转账。
- 已连接外部钱包但没有 `active` Embedded Wallet 时，仍视为未开通聊天钱包。

---

## 5. 充值

充值由 Dynamic Funding 能力提供：

- 钱包收款地址由 Dynamic 提供。
- 外部钱包只能作为资金来源，为当前用户的 Embedded Wallet 充值；充值目标不得是外部钱包。
- 法币充值仅在 Dynamic Dashboard 配置对应 Onramp 后开放，默认不作为 v2.0 必须项。
- SuperIM 不直接修改余额。
- 余额和交易状态以 Dynamic 或链上结果为准。
- 充值成功不改变 SuperIM 钱包绑定关系；充值到账以 Dynamic/链上确认结果为准。

充值相关功能是否可用取决于 Dynamic Dashboard 的 Funding 配置。未配置时，SuperIM 必须展示明确的配置/不可用提示。

---

## 6. 转账和签名

SuperIM 使用 Dynamic `useSendBalance` 打开 Send UI，并在有地址时预填 `recipientAddress`。发送方必须是当前用户的 Embedded Wallet；金额、资产、网络确认和签名均由 Dynamic 处理。

```text
聊天对象选择
    ↓
SuperIM 查询钱包地址
    ↓
Dynamic Send UI（预填 recipientAddress）
    ↓
用户在 Dynamic 内确认并签名
    ↓
返回交易结果 / 提交 / 取消 / 失败
    ↓
SuperIM 更新聊天消息关联状态
```

要求：

- 收款地址必须来自 SuperIM 后端绑定记录，且绑定记录的来源类型必须为 Dynamic Embedded Wallet。
- 聊天转账打开 Dynamic Send 前，默认使用当前用户的 Embedded Wallet；外部钱包不得作为聊天转账钱包。
- 不能使用固定 Demo 地址。
- 不在 SuperIM 内实现 Passkey、支付密码或签名弹窗。
- Dynamic 取消或失败时，不创建成功转账消息。
- Dynamic 返回结果不得被直接假设为最终链上哈希；由后端通过 Dynamic 交易结果、webhook 或链上查询确定 `txHash`。
- 用户完成签名并提交后，先创建 `pending` 或 `submitted` 消息；链上确认后更新为 `confirmed`。
- 钱包切换、余额不足、Gas 不足、网络错误和风控拦截必须分别反馈，不得统一显示为“转账失败”。
- 群聊只允许选择一名 SuperIM 用户，不允许转给群组或多人分发。

### 6.1 签名边界

本期只支持 Dynamic 钱包认证所需的签名和转账交易签名。`connect-and-sign` 是 Dynamic 的钱包身份认证流程，不代表 SuperIM 自己实现通用签名能力。本期不支持任意消息签名、NFT 签名、SuperIM 登录签名、支付密码或管理员代签。

### 6.2 资产和费用

- v2.0 只支持 Base 网络的 USDC 转账；Base Sepolia 用于开发/验收，Base Mainnet 用于生产。
- 研发上线前必须在环境配置中确认 USDC 合约地址、decimals、Gas 资产和余额读取方式。
- 金额最小值、最大值、小数位、Gas 不足和余额不足提示必须由产品和后端在技术方案中固化；Dynamic 页面不得允许 SuperIM 无法解释的资产或网络。

---

## 7. 聊天转账

### 7.1 单聊

- 输入栏更多操作提供 Transfer。
- 收款人默认为当前会话对象。
- 只有当前用户存在 `active` 聊天钱包，且对方存在有效聊天钱包时，才允许发起转账。
- 收款地址只从 SuperIM 后端绑定记录获取，不允许用户在聊天转账流程中手工替换地址。
- 被拉黑、被封禁或不再属于有效会话关系的用户，不允许发起聊天转账。
- 有绑定地址时打开 Dynamic Send。
- 无绑定地址时提示“对方暂未开通钱包”。

### 7.2 群聊

- 输入栏更多操作提供 Transfer。
- 必须明确选择一名群成员。
- 只能选择当前群成员，不允许转给群组或多人分发。
- 发送方必须拥有 `active` 聊天钱包，收款成员必须拥有有效聊天钱包。
- 查询该成员的钱包绑定状态。
- 无绑定地址时阻止打开 Send。

### 7.3 消息关联模型

```ts
interface WalletTransferMessage {
  id: string;
  type: 'wallet-transfer';
  conversationId: string;
  senderUserId: string;
  recipientUserId: string;
  dynamicTransactionId?: string;
  txHash?: string;
  amount?: string;
  assetSymbol: 'USDC';
  network: 'Base';
  status: 'pending' | 'submitted' | 'confirmed' | 'failed' | 'canceled';
  failureCode?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

消息规则：

- Dynamic 流程被取消、未完成签名或未提交交易时，不创建对双方可见的成功转账消息；可以保留客户端本地失败提示。
- Dynamic 已提交交易后，SuperIM 创建 `submitted` 或 `pending` 消息；链上确认后更新为 `confirmed`。
- 交易最终失败时更新为 `failed`，允许用户重新发起新转账，不复用原消息作为成功交易。
- 每次转账必须有客户端生成的关联 ID；服务端以关联 ID、Dynamic 交易标识或交易哈希幂等处理，避免重复消息。
- SuperIM 只保存消息和交易的业务关联，链上交易真实性由 Dynamic / 链上查询确认。

---

## 8. 安全边界

- Dynamic 使用 `connect-and-sign` 认证模式；该认证只用于钱包开通和外部钱包身份确认，不替代 SuperIM 登录。
- SuperIM 后端同时校验 SuperIM 会话和 Dynamic JWT，再绑定用户和钱包地址。
- 后端使用 Dynamic Access Token 做服务端身份校验，不接受 ID Token 作为钱包绑定授权；校验签名、`iss`、`aud`、`sub` 和 `exp`。
- 前端不保存私钥、助记词、支付密码或签名结果以外的敏感材料。
- 不在日志中记录 Dynamic JWT。
- 钱包绑定和转账接口必须具备 CSRF 防护、权限校验、频率限制和审计日志。
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

后台原型与生产接口分开：

- 当前后台原型只使用 Mock 数据，不请求真实 API，不执行真实钱包操作；验收目标是信息架构和页面效果。
- 下列接口仅代表未来生产后台的接口合同，不是当前原型的接入要求。

后台接口：

```text
GET /api/admin/wallet/overview
GET /api/admin/wallet/transactions
GET /api/admin/wallet/users
GET /api/admin/wallet/audit
```

后台接口必须校验管理员身份和权限；交易状态以 Dynamic webhook 和链上确认结果为准，并对 webhook 做签名校验、幂等处理和重放保护。

同步事件至少覆盖 `wallet.created`、`wallet.linked`、`wallet.unlinked` 和 `wallet.activity`。服务端必须记录事件环境、事件 ID、消息 ID、处理结果和失败原因；重复 webhook 不得重复创建绑定或转账消息。

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

### 10.1 账号与钱包开通

- SuperIM 注册成功后由后端创建 `superimUserId`；SuperIM 登录成功后建立登录会话。
- `/login` 和 `/register` 不触发 Dynamic 钱包创建。
- 未登录访问 `/wallet` 时跳转 `/login`。
- 用户进入 `/wallet` 后，Dynamic 能够创建或恢复 Embedded Wallet。
- 能从 Dynamic 获取当前用户 Embedded Wallet 公开地址，并且只绑定该地址。
- 已连接外部钱包但没有 Embedded Wallet 时，钱包状态仍不是 `active`。
- 后端能够同时验证 SuperIM 会话和 Dynamic Access Token，并绑定地址。
- 同一绑定重复提交不会创建重复记录；外部钱包绑定、跨用户绑定返回明确错误。

### 10.2 充值与转账

- 外部钱包可以通过 Dynamic Funding 为当前用户的 Embedded Wallet 充值，充值目标不能是外部钱包。
- 聊天转账的发送方和收款方都必须具备有效聊天钱包，发送方不能使用外部钱包。
- 单聊只能向当前会话对象转账；群聊只能向当前群成员中的一名用户转账。
- 收款地址来自 SuperIM 后端绑定记录，不允许在聊天转账流程中手工替换。
- 对方没有有效聊天钱包时提示“对方暂未开通钱包”；接口异常不得误报为未开通。
- 用户在 Dynamic 内完成交易确认和签名后，消息能够经历提交/待确认/确认成功或失败状态。
- Dynamic 取消、未签名或未提交时，不产生对双方可见的成功转账消息。
- 重复 webhook 不会重复创建钱包绑定或聊天转账消息。

### 10.3 边界与后台原型

- SuperIM 不使用静态余额、Demo 地址、自建签名面板或 Mock 交易记录冒充真实交易。
- 当前钱包后台只使用 Mock 数据，不请求真实 API，不执行真实钱包操作。
- 生产后台只能观察绑定、充值、转账同步和审计状态，不能代替用户签名或发起交易。
