# SuperIM 登录页规格

## 页面信息

- 页面路径：`/login`
- UI 层：前端内容层
- 主题来源：`src/themes/equatorial-minimalism/`
- 参考页面：`src/prototypes/superim-register/`

## 功能

- 支持手机号和邮箱两种登录方式切换。
- 手机号登录支持国家码选择，默认国家码为 `+234`。
- 支持密码输入、忘记密码入口、Google 和 Apple 登录入口。
- 提交后显示加载状态；当前原型使用 Mock 登录反馈，不请求真实登录 API。

## 状态

- 默认：手机号登录 Tab。
- 切换：手机号/邮箱表单切换。
- 国家码选择：展示 Nigeria、South Africa、Kenya、Tanzania、Ghana。
- 加载中：按钮禁用并显示 `Signing in...`。
- 空状态：输入框为空时保留原型展示，不伪造登录成功。

## 视觉规范

- 使用 Equatorial Minimalism 主题和现有登录页样式。
- 保持品牌 Logo、欢迎标题、登录卡片、社交登录和注册入口结构。
- 交互控件保留 hover、focus 和 disabled 状态。
