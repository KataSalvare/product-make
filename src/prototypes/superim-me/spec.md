# Me Page 规格文档

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | Me Page |
| **页面路径** | /me |
| **页面类型** | 个人中心 |
| **目标用户** | 已登录用户 |
| **页面目的** | 参考 Telegram Settings 风格，平铺展示个人信息、快捷切换账号入口与核心功能入口 |

### 1.2 页面描述
个人中心页面采用 Telegram Settings 的扁平列表风格。顶部为可点击的个人信息卡片，多账号场景下展示快捷切换账号入口，下方按分组平铺 My Posts、Saved Messages、Chat Folders、Settings、Help Center、About、Terms of Service 等功能入口。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│ Me                                  │ ← Header
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │  ┌────┐  John Doe          >   │ │ ← 个人信息卡片（点击进入 Edit Profile）
│ │  │ JD │  @john.doe               │ │
│ │  └────┘  "Living life..."      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ACCOUNTS（仅多账号时展示）            │
│ ┌─────────────────────────────────┐ │ ← 平铺其他已绑定账号
│ │ Work Account        @john.work 5│ │   未读消息显示红色数字角标
│ │ Family            @john.family 12│ │   点击直接切换账号
│ │ + Manage Accounts               │ │   点击进入账号管理页
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📷 My Posts                >    │ │
│ │ 🔖 Saved Messages          >    │ │
│ │ 📁 Chat Folders            >    │ │
│ │ ⚙️ Settings                >    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ❓ Help Center             >    │ │
│ │ ℹ️ About            v2.1.0 >    │ │
│ │ 📄 Terms of Service        >    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ SuperIM v2.1.0                      │
│                                     │
│         ┌─────────────┐             │
│         │ 💬 👤 📝 📞 👤 │         │ ← 底部悬浮导航
│         └─────────────┘             │
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | Header | 页面标题 "Me" |
| 2 | 个人信息卡片 | 头像、姓名、@username、签名、右箭头；点击进入编辑资料 |
| 3 | Accounts | 多账号时平铺展示其他已绑定账号，显示名称、handle、未读红点；底部提供 Manage Accounts 入口 |
| 4 | 功能列表 | 图标 + 文字 + 右箭头，圆角卡片分组 |
| 5 | 页脚 | 版本号 |
| 6 | 底部悬浮导航 | Telegram 风格玻璃质感导航 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 变量名 | 用途 |
|------|--------|------|
| 页面背景 | --surface | 主背景 |
| Header 背景 | --surface-container-low | 头部 |
| 卡片/列表背景 | --surface-container-lowest | 卡片和列表 |
| 图标 | --secondary | 菜单图标 |
| 右箭头 | --outline | 箭头颜色 |
| 未读红点 | --error | 账号未读消息提示 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 |
|------|------|------|------|
| 页面标题 | Montserrat | 24px | 600 |
| 用户名称 | Inter | 18px | 700 |
| @username | Inter | 16px | 400 |
| 签名 | Inter | 14px | 500 |
| 列表项文字 | Inter | 16px | 400 |
| 描述/版本 | Inter | 12px | 400 |
| 分组标题 | Inter | 12px | 600，大写 |

---

## 3. 交互逻辑

### 3.1 个人信息卡片
- 点击整张卡片跳转 `/edit-profile`
- 显示当前账号头像、姓名、handle、签名

### 3.2 Accounts
- 仅当 `accounts` 中存在非当前账号时展示
- 平铺展示其他已绑定账号（当前账号已通过顶部个人信息卡片展示），不使用头像
- 账号行显示名称、handle，未读消息数量红色角标
- 点击任意账号行：直接切换为当前账号，未读数清零，显示 Toast "Switched to {name}"
- 列表底部固定显示 "Manage Accounts" 入口，点击跳转 `/account-switcher`

### 3.3 功能列表导航
| 菜单项 | 跳转路径 |
|--------|----------|
| My Posts | /my-posts |
| Saved Messages | /favorites |
| Cloud Drive | /cloud-drive |
| Chat Folders | /chat-folders |
| Settings | /settings |
| Help Center | /help-center |
| About | /about |
| Terms of Service | /terms-of-service |

### 3.4 底部导航
- Chats / Contacts / Feed / Calls / Me
- 当前页面高亮 Me 并显示文字标签
- 点击对应图标跳转至对应页面

---

## 4. 主题适配

使用 Equatorial Minimalism 主题变量，与 Chats、UserProfile 等页面保持一致。

## 5. v1.2 云盘入口

- Cloud Drive 位于 Saved Messages 之后，显示模拟容量摘要 `3.2 GB of 10 GB used`。
- 点击进入 `/cloud-drive`；底部五栏导航保持不变。
- About 版本更新为 `v1.2.0`。
