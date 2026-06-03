# Privacy Settings Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | Privacy Settings Page |
| **页面路径** | /privacy-settings |
| **页面类型** | 设置页 |
| **目标用户** | 已登录用户 |
| **页面目的** | 控制个人资料可见性、状态显示和隐私选项 |

### 1.2 页面描述
隐私设置页面，管理最后上线时间、头像、个人简介可见性（通过底部选项面板选择 Everyone / My Contacts / Nobody），已读回执、在线状态、输入状态提示（Toggle 开关），以及好友添加和黑名单管理（含解封确认弹窗）。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│ ← Privacy Settings                  │
├─────────────────────────────────────┤
│                                     │
│ VISIBILITY                          │
│ ┌─────────────────────────────────┐ │
│ │ 🕐 Last Seen       Everyone >  │ │
│ │ 🖼️ Profile Photo   Everyone >  │ │
│ │ ℹ️ About          Everyone >  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ STATUS                              │
│ ┌─────────────────────────────────┐ │
│ │ ✓✓ Read Receipts       [ON]   │ │
│ │ 🟢 Online Status        [ON]   │ │
│ │ 💬 Typing Indicator     [ON]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ CONTACT                             │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Who Can Add Me   Everyone > │ │
│ │ 📞 Find by Phone       [ON]   │ │
│ │ ✉️ Find by Email       [OFF]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ BLOCKED                             │
│ ┌─────────────────────────────────┐ │
│ │ 🚫 Blocked Users   2 users  > │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2.2 底部选项面板（Select 类型触发）
```
┌─────────────────────────────────────┐
│         (半透明遮罩)                 │
│                                     │
├─────────────────────────────────────┤
│  Last Seen                          │ ← 当前设置项标题
├─────────────────────────────────────┤
│  Everyone                           │
│  All SuperIM users can see this   ✓ │ ← 选中标记
│                                     │
│  My Contacts                        │
│  Only your contacts can see this    │
│                                     │
│  Nobody                             │
│  No one can see this                │
├─────────────────────────────────────┤
│            [ Cancel ]               │
└─────────────────────────────────────┘
```

### 2.3 黑名单面板（Action 类型触发）
```
┌─────────────────────────────────────┐
│  Blocked Users                  ✕   │
├─────────────────────────────────────┤
│  ┌──┐ Spam Bot 01     [Unblock]    │
│  │SB│                              │
│  └──┘                               │
│  ┌──┐ Marcus Johnson   [Unblock]    │
│  │MJ│                              │
│  └──┘                               │
└─────────────────────────────────────┘
```

---

## 3. 交互逻辑

### 3.1 Select 类型项（Visibility / Who Can Add Me）
- 点击行 → 底部弹出选项面板
- 三个选项：Everyone、My Contacts、Nobody
- 每个选项带说明副文本
- 当前选中项右侧显示 ✓
- 点击选项即时切换
- 点击遮罩层或 Cancel 关闭

### 3.2 Toggle 类型项（Status / Contact）
- 点击开关切换 on/off
- 红色 Terracotta 激活色
- 白色滑块滑动动画

### 3.3 黑名单
- 点击 Blocked Users → 底部弹出黑名单面板
- 每个用户：头像 + 用户名 + 红色边框 Unblock 按钮
- 解封：点击 Unblock → 弹出确认弹窗
- 确认 → 从列表中移除，首页计数更新
- 全部解封后 → 显示空状态图标 + "No blocked users"
- 点击遮罩层或 ✕ 关闭面板

### 3.4 解封确认弹窗
```
┌──────────────────────┐
│   Unblock User       │
│                      │
│ Are you sure you     │
│ want to unblock      │
│ Marcus Johnson?      │
│                      │
│ [Cancel]  [Unblock]  │
└──────────────────────┘
```

---

## 4. 数据结构

```typescript
visibilityOptions = ['Everyone', 'My Contacts', 'Nobody']

blockedUsers = [
  { id, name, avatar }
]
```

---

## 5. 主题适配

使用 Equatorial Minimalism 主题变量，与 Settings/Me 页面保持一致。选项面板采用底部弹出（rounded-t-3xl）模式。
