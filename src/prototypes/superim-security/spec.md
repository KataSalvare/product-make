# Security Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | Security Page |
| **页面路径** | /security |
| **页面类型** | 设置页 |
| **目标用户** | 已登录用户 |
| **页面目的** | 管理账户安全、联系方式、登录设备和数据策略 |

### 1.2 页面描述
安全设置页面，提供修改密码、生物识别开关、手机号和邮箱修改（验证码流程）、快捷登录绑定/解绑、登录设备管理（含远程登出）、登录历史查看、消息自动删除策略配置。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│ ← Security                          │
├─────────────────────────────────────┤
│ ACCOUNT                             │
│ ┌─────────────────────────────────┐ │
│ │ 🔑 Change Password          →  │ │
│ │ 👆 Biometric Lock      [OFF]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ CONTACT METHODS                     │
│ ┌─────────────────────────────────┐ │
│ │ 📞 Phone    +234 801 234 5678→ │ │
│ │ ✉️ Email   john@example.com→   │ │
│ │  Google       Connected  Unbind│ │
│ │  Apple        Connected  Unbind│ │
│ └─────────────────────────────────┘ │
│                                     │
│ SESSIONS                            │
│ ┌─────────────────────────────────┐ │
│ │ 💻 Active Sessions   3 active→ │ │
│ │ 🕐 Login History    4 records→  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ DATA                                │
│ ┌─────────────────────────────────┐ │
│ │ ⏱️ Auto-Delete       Never →   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2.2 交互面板

#### Active Sessions（底部面板）
```
┌─────────────────────────────────────┐
│ Active Sessions                 ✕   │
├─────────────────────────────────────┤
│ ┌──┐ iPhone 15 [Current]           │
│ │IP│ Lagos · iOS 18.1 · Now        │
│ └──┘                                 │
│ ┌──┐ MacBook Pro      [Log Out]    │
│ │MB│ Lagos · macOS 15 · 2h ago     │
│ └──┘                                 │
│ ┌──┐ iPad Air         [Log Out]    │
│ │IA│ Abuja · iPadOS 18 · 3d ago    │
│ └──┘                                 │
└─────────────────────────────────────┘
```

#### Auto-Delete（底部选项面板）
```
┌─────────────────────────────────────┐
│ Auto-Delete Messages                │
├─────────────────────────────────────┤
│ Never                           ✓  │
│ Messages are kept permanently      │
│                                     │
│ 24 Hours                           │
│ Messages deleted after 24 hours    │
│                                     │
│ 7 Days / 30 Days / 90 Days         │
├─────────────────────────────────────┤
│            [ Cancel ]               │
└─────────────────────────────────────┘
```

---

## 3. 交互逻辑

| 菜单项 | 类型 | 行为 |
|------|------|------|
| Change Password | link → | 打开修改密码弹窗（当前+新+确认，≥6位校验） |
| Biometric Lock | toggle | 开关 Face ID / Touch ID |
| Phone Number | link → | 弹窗：输入新号码 → 验证码 → 确认 |
| Email Address | link → | 弹窗：输入新邮箱 → 验证码 → 确认 |
| Google / Apple | 行内按钮 | Connected→Unbind(弹确认)，Not→Connect |
| Active Sessions | link → | 底部面板：3 台设备列表，非当前设备可 Log Out（弹确认） |
| Login History | link → | 底部面板：4 条登录记录（设备+位置+时间+IP） |
| Auto-Delete Messages | link → | 底部选项面板：5 档（Never/24h/7d/30d/90d） |

### 3.1 修改手机号/邮箱流程
```
输入新号码/邮箱 → Send Code → 60s倒计时
    │
    ▼
输入6位验证码 → Verify → 更新显示
```

### 3.2 设备登出流程
```
Log Out 按钮 → 确认弹窗 "Log Out Device" → 确认
```

### 3.3 快捷登录解绑
```
Unbind 按钮 → 确认弹窗 "Unbind Google/Apple" → 确认 → 状态变 Connect
```

---

## 4. 数据结构

```typescript
activeSessions = [
  { device, location, os, lastActive, isCurrent }
]

loginHistory = [
  { device, location, time, ip, icon }
]

autoDeleteOptions = [
  { value: 'never' | '24h' | '7d' | '30d' | '90d', label, hint }
]
```

---

## 5. 主题适配

使用 Equatorial Minimalism 主题变量，与 Settings/Me/Privacy 页面保持一致。底部面板采用 rounded-t-3xl 模式。
