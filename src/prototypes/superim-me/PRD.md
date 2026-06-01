# Me Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | Me Page |
| **页面路径** | /me |
| **页面类型** | 个人页 |
| **目标用户** | 已登录用户 |
| **页面目的** | 展示个人信息，提供账号管理、偏好设置和账户操作入口 |

### 1.2 页面描述
个人中心页面，融合个人资料展示与设置功能。顶部展示用户头像、姓名、手机号和签名，下方按分组展示账号管理、偏好设置（含开关）、帮助支持及账户操作。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│ Me                                  │ ← Header
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │  ┌────┐                        │ │
│ │  │ JD │  John Doe          ✏️  │ │ ← 个人卡片
│ │  └────┘  @john999               │ │
│ │          "Living life..."      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ACCOUNT                             │
│ ┌─────────────────────────────────┐ │
│ │ � Edit Profile            →   │ │
│ │ � Privacy Settings        →   │ │
│ │ � Security                →   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ PREFERENCES                         │
│ ┌─────────────────────────────────┐ │
│ │ 🔔 Notifications         [ON]  │ │ ← 开关
│ │ 🔊 Sound & Vibration    [ON]  │ │
│ │ � Language        English →  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ SUPPORT                             │
│ ┌─────────────────────────────────┐ │
│ │ ❓ Help Center            →   │ │
│ │ ℹ️ About            v2.1.0 →  │ │
│ │ 📄 Terms of Service       →   │ │
│ │ 🔒 Privacy Policy         →   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ACCOUNT ACTIONS                     │
│ ┌─────────────────────────────────┐ │
│ │ 🚪 Log Out                🔴  │ │
│ │ 🗑 Delete Account         🔴  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ SuperIM v2.1.0                      │
│ Made with ❤️ for Africa             │
│                                     │
│         ┌─────────────┐             │
│         │ 💬 👤 📝 📞 👤 │         │ ← 悬浮导航
│         └─────────────┘             │
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | Header | 页面标题 |
| 2 | 个人卡片 | 头像、姓名、@username、签名、编辑按钮 |
| 3 | 分组标题 | 大写分组标签 |
| 4 | 设置项 | 图标 + 文字 + 箭头 or Toggle 开关 |
| 5 | 账户操作 | 红色危险操作按钮（带确认弹窗） |
| 6 | 页脚 | 版本信息 |
| 7 | 悬浮导航 | 底部 Telegram 风格导航 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 变量名 | 用途 |
|------|--------|------|
| 页面背景 | --surface | 主背景 |
| Header 背景 | --surface-container-low | 头部 |
| 卡片/列表背景 | --surface-container-lowest | 卡片和菜单 |
| 图标 | --secondary | 菜单图标 |
| Toggle 开启 | --secondary | 开关激活色 |
| Toggle 关闭 | --surface-container | 开关关闭色 |
| 危险操作 | --error | Log Out / Delete Account |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 |
|------|------|------|------|
| 页面标题 | Montserrat | 24px | 600 |
| 用户名称 | Inter | 18px | 700 |
| @username | Inter | 16px | 400 |
| 签名 | Inter | 14px | 500 |
| 分组标题 | Inter | 14px | 600，大写 |
| 设置项 | Inter | 16px | 400 |
| 描述文字 | Inter | 12px | 400 |
| 版本信息 | Inter | 12px | 400 |

---

## 3. 交互逻辑

### 3.1 编辑资料
- 点击卡片右上角 ✏️ 按钮跳转 EditProfile 页面

### 3.2 设置项导航

| 菜单项 | 类型 | 行为 |
|------|------|------|
| Edit Profile | link → | 跳转编辑资料 |
| Privacy Settings | link → | 跳转隐私设置 |
| Security | link → | 跳转安全设置 |
| Notifications | toggle | 开关通知 |
| Sound & Vibration | toggle | 开关声音 |
| Language | link → | English |
| Help Center | link → | 帮助中心 |
| About | link → | v2.1.0 |
| Terms of Service | link → | 服务条款 |
| Privacy Policy | link → | 隐私协议 |

### 3.3 Toggle 开关
- 点击切换 on/off
- color 跟随 secondary token
- 白色滑块滑动动画

### 3.4 账户操作
| 操作 | 颜色 | 行为 |
|------|------|------|
| Log Out | error 红 | 弹出确认弹窗 "Are you sure you want to log out?" → 确认后退出登录 |
| Delete Account | error 红 | 弹出确认弹窗 "This action is irreversible..." → 确认后删除账户 |

### 3.5 底部导航
- Telegram 玻璃质感悬浮导航
- Chats / Contacts / Feed / Calls / Me

---

## 4. 主题适配

使用 Equatorial Minimalism 主题变量，与 Chats 等页面保持一致。
