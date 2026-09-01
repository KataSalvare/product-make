# SuperIM v2.0 Dynamic 钱包原型规格

## 原型目标

验证 SuperIM 作为 Dynamic 钱包入口和聊天转账编排层的核心路径。SuperIM 先完成账号注册/登录，用户进入「我的 → 钱包」后再由 Dynamic SDK 提供钱包开通、连接、充值、转账、交易确认和签名；SuperIM 只负责钱包入口、身份绑定、钱包地址查询和聊天场景衔接。

## Dynamic 接入

- 应用根部使用 `DynamicContextProvider`。
- SuperIM 登录和注册继续使用现有 SuperIM 账号表单；仅钱包入口使用 `DynamicEmbeddedWidget`。
- Dynamic SDK 使用 `connect-and-sign`。
- Dashboard 配置 EVM 和 Embedded Wallet；是否开启 `Create on Sign up` 按钱包开通策略决定。
- Base 是产品网络；开发/验收使用 Base Sepolia，生产再使用 Base Mainnet。
- 仅将 `connector.isEmbeddedWallet === true` 的钱包地址作为当前用户聊天收款地址；外部钱包不写入绑定记录。
- `onEmbeddedWalletCreated` 和钱包状态变化用于触发地址绑定。
- 绑定 API 使用 `VITE_SUPERIM_API_BASE_URL` 配置。

## 页面与入口

- `/wallet`：Dynamic Embedded Wallet 页面。
- `/wallet/deposit`：兼容旧链接，展示 Dynamic Wallet/Funding 页面。
- `/wallet/transactions`：兼容旧链接，展示 Dynamic Wallet 页面。
- `/wallet/chat-transfer`：单聊查询地址后打开 Dynamic Send。
- `/wallet/transfer`：群聊查询指定成员地址后打开 Dynamic Send。

钱包原型不再实现自有余额卡、充值二维码、交易列表、提现表单、交易详情或支付授权面板。

## 地址绑定

用户必须已有 SuperIM 登录态。进入「我的 → 钱包」并在 Dynamic 完成钱包认证/创建、获得 Embedded Wallet 地址后，前端携带 Dynamic JWT 和 SuperIM 会话请求：

```text
POST /api/wallet/bind
```

聊天转账通过当前 SuperIM 会话按收款人用户 ID 请求：

```text
GET /api/users/:userId/wallet
```

查询结果：

- 有效地址：允许继续打开 Dynamic Send。
- `404`：提示“对方暂未开通钱包”。
- 服务不可用：提示无法获取钱包地址，不得误报为未开通。

## Dynamic Send

- SuperIM 通过 `useSendBalance().open({ recipientAddress })` 打开 Dynamic Send UI。
- 打开前确保当前 `primaryWallet` 已切换为 Dynamic Embedded Wallet；外部钱包仅用于连接或充值。
- 收款地址来自 SuperIM 后端绑定记录。
- 金额、资产、网络、费用提示和签名由 Dynamic 处理。
- Dynamic 返回交易哈希后，SuperIM 展示提交成功并关联聊天消息。
- Dynamic 取消或失败时，不生成成功转账消息。

## 聊天场景

- 单聊 Transfer 默认使用当前会话对象。
- 群聊 Transfer 必须明确一名收款人。
- 没有钱包地址时阻止打开 Dynamic Send。
- 不支持转给群组、多人分发、跨链或 SuperIM 自行签名。

## 状态

- Dynamic 未配置：展示配置提示。
- 未有 SuperIM 登录态：不能进入钱包业务页。
- 已登录但未开通钱包：引导用户从「我的 → 钱包」完成 Dynamic 钱包开通。
- 钱包创建/同步中：展示等待状态。
- 地址绑定中：展示绑定状态。
- 地址绑定失败：展示失败提示并允许重试。
- 对方无钱包：展示“对方暂未开通钱包”。
- Dynamic Send 中：展示 Opening Dynamic / 等待结果。
- Dynamic 成功：展示交易哈希。
- Dynamic 取消或失败：展示可重试的错误反馈。

## 非目标

- 不保存私钥、助记词、支付密码或 Dynamic JWT。
- 不维护本地 Mock 余额或 Mock 交易数组。
- 不模拟 Passkey、Payment password 或链上交易状态。
- 不实现后台提现规则、人工审核和管理员代签。

## 视觉规范

- UI 层：前端内容层。
- 主题来源：`src/themes/equatorial-minimalism/`。
- 参考页面：`src/prototypes/superim-me/`、`src/prototypes/superim-chatroom/`。
- 复用组件：Dynamic Embedded Widget、钱包二级页头、聊天更多操作入口。
- 状态：默认、加载、绑定中、成功、取消、失败、未开通钱包、未配置。
- 响应式：移动端保持 400 × 852 预览；宽屏内容区扩展但不改变钱包页头层级。
