# SuperIM Dynamic 登录规格

## 页面信息

- 页面路径：`/login`
- UI 层：前端内容层
- 主题来源：`src/themes/equatorial-minimalism/`
- 参考页面：`src/prototypes/superim-register/`

## 功能

- 使用 `DynamicEmbeddedWidget` 展示 Dynamic 登录流程。
- Dynamic 负责登录、认证和钱包访问。
- 使用 `connect-and-sign`，不在 SuperIM 内实现密码、短信、社交登录或签名表单。
- 登录成功后由钱包入口读取 `primaryWallet`，并将地址交给 SuperIM 后端绑定。
- 未配置 `VITE_DYNAMIC_ENVIRONMENT_ID` 时展示明确配置提示。

## 非目标

- 不实现 SuperIM 自有登录 API。
- 不保存 Dynamic JWT、私钥、助记词或签名材料。
