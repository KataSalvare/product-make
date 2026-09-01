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

- 左侧导航直接复用用户列表的 `AdminSidebar`，可切换总览、交易、用户钱包、规则配置、审计日志。
- 提现规则页面支持修改 Mock 数值并保存为草稿，显示保存 Toast。
- 总览页展示 Gas 赞助降级的基础设施提醒和待处理提现队列。
- 交易、用户表格提供筛选/搜索视觉入口，非真实查询。

## 实现映射
- 使用 `src/components/AdminShell.tsx` 直接组合用户列表的 `AdminHeader`、`AdminSidebar`；钱包 5 个子视图共享同一菜单、顶栏和页面间距。
- 交易/用户使用 Ant Design `Table`，规则配置使用 `Form`/`Input`，运营反馈使用 `Alert`、`Tag`、`message`。

## 视觉规范
- UI 层级：后台内容层；主题来源：`src/themes/antd-new/DESIGN.md` 与 `theme.ts`。
- 参考原型：`/admin/users`；直接复用 `src/components/AdminHeader.tsx`、`src/components/AdminSidebar.tsx` 的统一菜单和顶栏。
- 钱包 5 个菜单路由为 `/admin/wallet`、`/admin/wallet/transactions`、`/admin/wallet/users`、`/admin/wallet/settings`、`/admin/wallet/audit`；菜单激活态和尺寸遵循主题共用导航规范。
- 可见业务文案使用中文，仅保留 USDC、Base、Gas、交易 ID 和用户姓名等技术标识/专有名词；状态使用文字加 antd 语义色表达。
- 状态覆盖健康、降级、待处理、已完成、失败、草稿保存成功和规则校验；窄屏页面单列排列，表格保留横向滚动。
