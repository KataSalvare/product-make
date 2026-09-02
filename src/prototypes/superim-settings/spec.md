# Settings Page 规格文档

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | Settings Page |
| **页面路径** | /settings |
| **页面类型** | 设置二级页 |
| **目标用户** | 已登录用户 |
| **页面目的** | 聚合账号设置、偏好设置与账号操作入口 |

### 1.2 页面描述
作为 `/me` 的二级设置页，参考 Telegram Settings 的列表风格，将 Edit Profile / Security / Privacy、Notifications / Sound & Vibration / Language、Log Out、Delete Account 分组平铺展示。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│ ← Settings                          │ ← Header（返回 /me）
├─────────────────────────────────────┤
│ ACCOUNT                             │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Edit Profile            >    │ │
│ │ 🔒 Security                >    │ │
│ │ 🛡️ Privacy                 >    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ PREFERENCES                         │
│ ┌─────────────────────────────────┐ │
│ │ 🔔 Notifications        [ON]    │ │
│ │ 🔊 Sound & Vibration    [ON]    │ │
│ │ 🌐 Language      English   >    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ACCOUNT ACTIONS                     │
│ ┌─────────────────────────────────┐ │
│ │ 🚪 Log Out                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | Header | 返回按钮 + 页面标题 "Settings" |
| 2 | 分组标题 | 大写标签：Account / Preferences / Account Actions |
| 3 | 列表项 | 图标 + 文字 + 箭头或 Toggle |
| 4 | 危险操作 | Log Out / Delete Account 使用 error 红色 |
| 5 | 确认弹窗 | 点击 Log Out / Delete Account 后弹出 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 变量名 | 用途 |
|------|--------|------|
| 页面背景 | --surface | 主背景 |
| 卡片/列表背景 | --surface-container-lowest | 列表卡片 |
| 图标 | --secondary | 常规图标 |
| Toggle 开启 | --secondary | 开关激活色 |
| Toggle 关闭 | --surface-container | 开关关闭色 |
| 危险操作 | --error | Log Out / Delete Account 文字与图标 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 |
|------|------|------|------|
| 页面标题 | Montserrat | 24px | 600 |
| 分组标题 | Inter | 12px | 600，大写 |
| 列表项文字 | Inter | 16px | 400 |
| 描述文字 | Inter | 14px | 400 |
| 弹窗标题 | Inter | 18px | 700 |

---

## 3. 交互逻辑

### 3.1 Account 分组
| 菜单项 | 行为 |
|--------|------|
| Edit Profile | 跳转 `/edit-profile` |
| Security | 跳转 `/security` |
| Privacy | 跳转 `/privacy-settings` |

### 3.2 Preferences 分组
| 菜单项 | 类型 | 行为 |
|--------|------|------|
| Notifications | Toggle | 点击切换开关，显示 Toast "Notifications on/off" |
| Sound & Vibration | Toggle | 点击切换开关，显示 Toast "Sound & Vibration on/off" |
| Language | Link | 当前显示 "English"，点击显示 Toast "Language selector coming soon" |

### 3.3 Account Actions 分组
| 操作 | 行为 |
|------|------|
| Log Out | 弹出确认弹窗，确认后显示 Toast "Logged out" |

### 3.4 确认弹窗
- Log Out 弹窗：标题 "Log Out"，文案 "Are you sure you want to log out of your account?"，Cancel / Log Out 按钮

---

## 4. 主题适配

使用 Equatorial Minimalism 主题变量，与 Me 页面保持一致。
