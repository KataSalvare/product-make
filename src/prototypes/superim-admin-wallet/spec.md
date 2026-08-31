# SuperIM v2.0 钱包运营后台原型规格

## 原型目标

验证钱包运营后台的信息架构、提现规则配置和交易/钱包状态管理。原型仅使用 Mock 数据，不接入真实链路。

## 页面入口

统一入口为 `/admin/wallet`，内部可点击进入：

- `/admin/wallet`：钱包运营总览、交易量、钱包健康度、待处理提现。
- `/admin/wallet/transactions`：Base Mainnet USDC 交易列表。
- `/admin/wallet/users`：用户与钱包地址绑定状态、余额摘要。
- `/admin/wallet/settings`：提现手续费、最低提现金额、每日额度、人工审核阈值。
- `/admin/wallet/audit`：规则修改、钱包生命周期、交易和基础设施审计记录。

## 已确认规则

- v2.0 只支持 Base Mainnet + USDC。
- 提现手续费、最低金额和额度限制均由后台配置，并在用户确认页展示。
- 后台不展示私钥、助记词、支付密码或 Passkey 私密信息。
- 后台不能代替用户签名转账。

## 交互状态

- 左侧导航可切换总览、交易、用户钱包、规则配置、审计日志。
- Wallet rules 页面支持修改 Mock 数值并保存为草稿，显示保存 Toast。
- 总览页展示 Gas sponsorship degraded 的基础设施提醒和待处理提现队列。
- 交易、用户表格提供筛选/搜索视觉入口，非真实查询。
