# SuperIM v2.0 Dynamic 钱包运营后台规格

## 原型目标

后台只负责 Dynamic 钱包业务的运营观察、用户绑定关系、链上事件同步和审计，不实现钱包、余额、私钥、助记词或用户签名。本原型使用 Mock 数据展示页面效果，不请求真实 API。

## 页面入口

- `/admin/wallet`：Dynamic 钱包绑定、交易同步、基础设施和待同步事件概览。
- `/admin/wallet/transactions`：Dynamic Send、Funding、链上收款和用户签名事件。
- `/admin/wallet/users`：SuperIM 用户与 Dynamic 用户、钱包地址的绑定关系。
- `/admin/wallet/settings`：Dynamic Environment、后台 API 和 Dynamic 能力接入状态。
- `/admin/wallet/audit`：钱包绑定、交易同步和管理员配置审计记录。

## 业务边界

- Dynamic 负责登录、钱包创建、外部钱包连接、Funding、Send 和签名。
- SuperIM 服务端负责校验 Dynamic JWT、绑定用户关系、接收交易/webhook 事件并提供后台查询接口。
- 后台只读展示链上/Dynamic 同步结果，不代替用户发起或签名交易。
- 后台不再维护提现手续费、最低提现金额、平台余额或 Gas 代付规则；相关能力由 Dynamic Dashboard、链上基础设施或服务端策略决定。

## 原型数据

页面使用本地 Mock 数据覆盖概览、交易、用户绑定和审计状态，包含正常、同步中、待绑定和降级等关键展示状态。正式系统再由服务端同步 Dynamic Webhook 和链上确认结果。

正式系统建议提供以下后台接口，并使用管理员会话凭证：

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/admin/wallet/overview` | 钱包用户、绑定数、交易量、同步队列和基础设施状态 |
| GET | `/api/admin/wallet/transactions` | Dynamic/链上交易同步记录 |
| GET | `/api/admin/wallet/users` | Dynamic 用户与 SuperIM 用户的钱包绑定关系 |
| GET | `/api/admin/wallet/audit` | 钱包生命周期、同步和配置审计记录 |

正式接口实现要求：

- 所有接口必须校验管理员身份和权限。
- 钱包地址、Dynamic 用户 ID 和交易哈希只能来自已验证的服务端数据。
- 交易状态以 Dynamic webhook 和链上确认结果为准，不能以浏览器回调直接判定成功。
- 服务端应对 webhook 做签名校验、幂等处理和重放保护。

## 状态

- 默认：使用 Mock 数据展示页面。
- 正式接入：读取服务端同步的 Dynamic/链上数据。
- 原型状态：通过 Mock 数据展示正常、同步中、降级和空数据状态。
- 交易状态：已提交、已确认、失败、已取消、同步中。
- 绑定状态：已绑定、待同步、绑定失败、未绑定。

## 视觉规范

- UI 层：后台内容层。
- 主题来源：`src/themes/antd-new/DESIGN.md` 与 `theme.ts`。
- 参考页面：`/admin/users`。
- 复用组件：`AdminShell`、`AdminHeader`、`AdminSidebar`、Ant Design `Card`、`Table`、`List`、`Alert`、`Tag`、`Progress`、`Empty`。
- 新增 token：无。
- 响应式：移动端使用单列布局；表格在窄屏保留横向滚动，页面本身不产生无意义横向滚动。
