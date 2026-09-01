# SuperIM Dynamic 注册规格

## 页面信息

- 页面路径：`/register`
- UI 层：前端内容层
- 主题来源：`src/themes/equatorial-minimalism/`
- 参考页面：`src/prototypes/superim-login/`

## 功能

- 使用 `DynamicEmbeddedWidget` 展示 Dynamic 注册流程。
- Dynamic 负责账号认证和 Embedded Wallet 创建。
- Dynamic Dashboard 开启 `Create on Sign up` 后，注册完成自动创建或恢复钱包。
- SuperIM 读取公开钱包地址，并通过后端验证 Dynamic JWT 后完成地址绑定。
- 未配置 `VITE_DYNAMIC_ENVIRONMENT_ID` 时展示明确配置提示。

## 状态

- Dynamic 加载中
- 登录/注册中
- 钱包创建或同步中
- 钱包地址已获取
- SuperIM 地址绑定失败，可重试

## 非目标

- 不实现手机号/邮箱 Mock 注册表单。
- 不保存 Dynamic JWT、私钥、助记词、支付密码或签名材料。
