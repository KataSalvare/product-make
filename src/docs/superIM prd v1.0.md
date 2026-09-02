# 前端产品需求文档 (PRD)：SuperIM v1.0

**产品名称：** SuperIM
**版本：** V1.0 (基础版)
**文档状态：** 已定稿
**最后更新：** 2025-07
**范围：** 前端页面需求

---

## 1. 文档概述

### 1.1 产品目标

打造一款稳定、安全、具备核心通讯与社交功能的即时通讯软件，为用户提供流畅的沟通体验。

### 1.2 产品范围

本 PRD 涵盖 SuperIM v1.0 完整前端页面体系（共 24 个页面原型），包括用户认证系统、IM 通讯系统、音视频通话、朋友圈（Feed）、个人中心与设置管理。

### 1.3 目标用户

- 个人用户：需要日常沟通交流的普通用户
- 小型团队：需要简单协作的团队用户
- 社交爱好者：喜欢分享生活动态的用户

---

## 2. 应用启动与导航流程

### 2.1 应用启动流程

```
Splash (品牌展示, 2.5s)
    ↓
Login / Register（登录/注册）
    ↓
主应用首页（底部5Tab导航）
```

### 2.2 底部 Tab 导航（Telegram 玻璃质感悬浮导航）

| Tab | 页面 | 路径 | 说明 |
|------|------|------|------|
| Chats | 会话列表 | /chats | 最近聊天列表，主通讯入口 |
| Contacts | 联系人 | /contacts | 好友列表，按字母分组 |
| Feed | 朋友圈 | /feed | 社交动态流 |
| Calls | 通话记录 | /calls | 语音/视频通话历史 |
| Me | 我的 | /me | 个人资料 + 设置枢纽 |

---

## 3. 用户认证系统（4 页）

### 3.1 Splash 启动页

| 项目 | 内容 |
|------|------|
| **路径** | /splash |
| **目的** | 品牌展示，应用加载过渡 |

- Logo（56px Deep Indigo 背景）+ 品牌名 "SuperIM"
- 标语：Connect. Share. Belong.
- 背景装饰（模糊渐变圆 + 点状加载动画）
- 2.5 秒后自动过渡到登录页

### 3.2 Login 登录页

| 项目 | 内容 |
|------|------|
| **路径** | /login |
| **目的** | 用户登录认证 |

**登录方式：**
- **Phone Tab**：国家码选择器（自定义下拉，🇳🇬 +234 等）+ 手机号 + 密码 + "Forgot password?" 链接
- **Email Tab**：邮箱 + 密码 + "Forgot password?" 链接
- **社交登录**：Google 按钮 + Apple 按钮
- "Don't have an account? Sign up" 链接到注册页
- 背景渐变装饰 + 卡片式布局 (surface-container-low, rounded-2xl)

### 3.3 Register 注册页

| 项目 | 内容 |
|------|------|
| **路径** | /register |
| **目的** | 新用户注册 |

**注册流程（Phone）：**
- 国家码选择器 + 手机号输入
- 验证码输入 + Send Code 按钮（60s 倒计时）
- 密码创建 + 三档强度指示器（Weak/Medium/Strong）
- 条款勾选（24px 圆形 primary 填充 checkbox）
- "Create Account" 按钮（secondary Terracotta 背景）
- "Already have an account? Sign In" 链接

**注册流程（Email）：**
- 同上，手机号替换为邮箱

### 3.4 Forgot Password 忘记密码

| 项目 | 内容 |
|------|------|
| **路径** | /forgotpassword |
| **目的** | 密码重置 |

**四步流程：**
1. **Step 1 — 输入账号**：Phone/Email Tab 切换，输入后点 Send Reset Code
2. **Step 2 — 输入验证码**：6 位验证码输入，Resend（60s 倒计时），Verify & Next
3. **Step 3 — 设置新密码**：新密码 + 确认密码，密码强度指示器，密码匹配校验
4. **Step 4 — 成功**：绿色 ✓ 图标，"Password Reset Successful!" → Back to Login

- 步骤指示器：①②③ 圆形节点 + 连线，完成步显示 ✓

---

## 4. 会话与联系人（5 页）

### 4.1 Chats 会话列表

| 项目 | 内容 |
|------|------|
| **路径** | /chats |
| **目的** | 展示聊天列表，快速访问最近对话 |

**列表项内容：**
- 头像（56px、primary-container 背景、在线指示器 14px secondary 圆点）
- 联系人名称 + 时间戳
- 消息预览（草稿 "Draft:" 前缀 yellow、@提及 "[@You]" error 红色前缀）
- 未读徽章（@mention error 红底、普通 secondary 底）
- 置顶图标 + 静音图标

**交互：**
- **点击** → 跳转 ChatRoom / GroupChat
- **右键 / 长按** → 上下文菜单：Pin/Unpin、Mute/Unmute、Mark as Read、Delete
- **左滑**（支持触摸 + 鼠标拖拽）→ 露出快捷按钮：Pin、Mark as Read、Delete（红色）
- **搜索**：Header 展开搜索栏，实时过滤，无结果空状态
- **+ 菜单**：New Chat、New Group、Add Contact、Scan QR Code
- **Delete** → 弹出二次确认弹窗

**空状态**：聊天气泡图标 + "Start a conversation"

### 4.2 Contacts 联系人

| 项目 | 内容 |
|------|------|
| **路径** | /contacts |
| **目的** | 好友列表管理 |

- 搜索栏 + 头像 + 按字母分组（A-Z）+ 粘性分区标题
- "+" 按钮跳转 AddContact
- 点击跳转 UserProfile

### 4.3 Contact Selection 联系人选择

| 项目 | 内容 |
|------|------|
| **路径** | /contact-selection |
| **目的** | 多选联系人添加至群聊 |

- 返回按钮 + "Add Members" + 已选数量按钮 "Add (N)"
- 搜索栏（实时过滤）
- 选中联系人标签栏（水平滚动、primary-fixed 背景、点击取消）
- 联系人列表（按字母分组、24px 圆形复选框、48px primary-container 头像 + 在线指示器）
- 选中行 primary-fixed 高亮
- 空状态："No contacts found"
- 确认添加弹窗

### 4.4 ForwardMessage 转发消息

| 项目 | 内容 |
|------|------|
| **路径** | /forwardmessage |
| **目的** | 转发消息给联系人或群组 |

- Header："Forward to..." + 已选计数 + 发送按钮（禁用直到有选择）
- 消息预览卡片（secondary-container/30 背景）
- 联系人列表（Recent + All Contacts，支持群组，显示成员数）
- 24px 圆形复选框选择、选中行 primary-fixed 高亮
- 已选 chips：primary-fixed 背景

### 4.5 AddContact 添加联系人

| 项目 | 内容 |
|------|------|
| **路径** | /addcontact |
| **目的** | 添加好友 |

- 搜索栏："Search by username or phone"
- 添加方式 2×2 网格：Search Username / Phone Search / Scan QR Code / Contacts Import
- 搜索结果列表（头像 + 姓名 + @username + Add/Added/Pending 状态）

---

## 5. 聊天系统（4 页）

### 5.1 ChatRoom 单聊

| 项目 | 内容 |
|------|------|
| **路径** | /chatroom |
| **目的** | 一对一实时对话 |

**Header：** 返回按钮 + 头像 + 姓名 + 在线状态 + 三点菜单

**三点菜单（聊天设置）：**
- Voice Call / Video Call
- Mute Notifications（Toggle）
- Clear History（确认弹窗）
- Delete Chat（确认弹窗，删除后返回聊天列表）

**消息交互：**
- 发送消息（文字 + Emoji + 图片 + 文件 + 语音）
- 消息长按 → 上下文菜单：Copy、Reply、Pin/Unpin、Delete
- 删除消息 → 确认弹窗（"Delete for everyone" 仅自己消息可选）
- Reply 预览条
- Emoji 选择器 + 附件菜单（WeChat 风格底部面板）
- 语音录制

**视觉：** 接收/发送气泡区分、已读回执（secondary 色双勾）、时间分隔线

### 5.2 GroupChat 群聊

| 项目 | 内容 |
|------|------|
| **路径** | /groupchat |
| **目的** | 多人实时群组聊天 |

- **群公告横幅**（可关闭）
- **发送者头像 + 姓名** 显示在消息左侧
- 系统消息（入群通知等）
- 输入栏：@ 提及、Emoji、附件、语音
- 点击群名 → 跳转 GroupChat Settings

### 5.3 GroupChat Settings 群聊设置

| 项目 | 内容 |
|------|------|
| **路径** | /groupchat-settings |
| **目的** | 管理群组信息和成员 |

**群信息区：** 群头像（96px）+ 群名编辑 + 成员数 + 描述编辑

**群公告卡片：** primary-fixed 浅蓝背景，喇叭图标 + Announcement 标签，编辑/清空按钮（仅管理员）

**成员管理：**
- Owner（tertiary 色）、Admins、Members 分组
- 头像 40px + 姓名 + 角色标签 + 在线指示器
- Add 按钮 → 跳转 Contact Selection
- 点击成员 → 底部角色管理面板（Transfer Ownership / Make Admin / Remove from Group）

**危险操作：** Leave Group / Delete Group（仅 Owner，各自确认弹窗）

### 5.4 UserProfile 用户资料

| 项目 | 内容 |
|------|------|
| **路径** | /userprofile |
| **目的** | 查看联系人详细信息 |

- 大头像（100px）+ 在线状态
- 姓名 + @username + 个人简介
- 操作按钮：Message（跳转 ChatRoom）、Voice Call、Video Call
- 详情卡片：Phone、Location（🇳🇬 + 国旗）、Joined Date
- Header 三点菜单：Block/Report

---

## 6. 朋友圈 Feed（4 页）

### 6.1 Feed 朋友圈

| 项目 | 内容 |
|------|------|
| **路径** | /feed |
| **目的** | 浏览好友社交动态 |

- Header：标题 "Feed" + 相机图标
- 发帖入口：当前用户头像 + "What's on your mind?" 按钮
- 帖子卡片：作者头像（primary-container）+ 姓名 + 时间 + 文字内容 + 图片网格（1/2/3/4 自适应）
- 互动：Like（secondary 激活色） + Comment 按钮 + 统计数据
- 点赞切换 + 评论跳转 PostDetail

### 6.2 PostDetail 帖子详情

| 项目 | 内容 |
|------|------|
| **路径** | /postdetail |
| **目的** | 查看帖子全文和评论 |

- Header："Post" + 分享按钮
- 帖子内容：作者信息 + 文字 + 图片网格 + 点赞/评论数
- **操作栏**：Like + Share + Save（三按钮）
- 评论区：X Comments 标题 + 评论列表（头像 32px + 姓名 + 时间 + 内容 + Like + Reply）
- 嵌套回复（1 级）
- 评论输入栏（底部固定）+ Reply 提示条
- Share 底部面板
- 图片点击 → 图片查看器（占位）

### 6.3 NewPost 发布动态

| 项目 | 内容 |
|------|------|
| **路径** | /newpost |
| **目的** | 发布新朋友圈动态 |

- Header："New Post" + Post 按钮（500 字以内启用）
- 用户头像 + 姓名 + 隐私下拉（Public）
- 文本输入区 + 实时字数统计
- 图片预览网格（可删除单张）
- 工具栏：Gallery / Camera / Location（支持搜索） / Emoji
- Emoji 面板 + 位置搜索面板
- Post 后跳转 Feed

### 6.4 My Posts 我的帖子

| 项目 | 内容 |
|------|------|
| **路径** | /myposts |
| **目的** | 查看和管理自己发布的全部动态 |

- Header：返回按钮 + "My Posts"
- 仅展示当前用户（John Doe）的动态（primary 深色头像）
- 按发布时间倒序排列（5 条 mock 数据）
- 每条帖子右上角 ✕ 删除按钮 → 确认弹窗 "Delete Post" → 确认删除
- Like / Comment 互动按钮
- 底部 Tab 导航

---

## 7. 个人中心与设置（6 页）

### 7.1 Me 我的

| 项目 | 内容 |
|------|------|
| **路径** | /me |
| **目的** | 个人资料展示 + 设置枢纽 |

**页面结构：**

**个人卡片：**
- 头像（80px primary）+ 姓名 + @username + 签名 + 编辑按钮 → EditProfile

**My Posts 展示区：**
- "My Posts" 标题 + "View All →" → MyPosts 页面
- 3 张 1:1 方形近期图片网格

**设置分组：**

| 分组 | 条目 | 类型 |
|------|------|------|
| Account | Edit Profile, Privacy Settings, Security | 导航链接 |
| Preferences | Notifications, Sound & Vibration | Toggle 开关 |
| | Language | 导航链接 (English) |
| Support | Help Center, About (v2.1.0), Terms of Service, Privacy Policy | 导航链接 |
| Account Actions | Log Out, Delete Account | 确认弹窗（Delete 需输入 "DELETE"） |

- 页脚：SuperIM v2.1.0 / Made with ❤️ for Africa

### 7.2 EditProfile 编辑资料

| 项目 | 内容 |
|------|------|
| **路径** | /editprofile |
| **目的** | 编辑个人资料信息 |

**字段：**
| 字段 | 类型 | 验证 |
|------|------|------|
| 头像 | 可点击更换 | 照片/相机选择 |
| Display Name | 可编辑 | 2-50 字符 |
| Username | 可编辑 | 3-20 字符，字母数字下划线，实时唯一性校验（输入 "kata" = ✗ Taken） |
| Bio | 可编辑 | 最大 150 字符，实时计数 |
| Phone | 禁用 | 灰色只读 |
| Email | 禁用 | 灰色只读 |
| Location | 可编辑 | — |

- Save 按钮（底部固定，secondary 色）
- 保存成功 → 绿色 Toast
- 未保存退出 → 确认弹窗

### 7.3 Privacy Settings 隐私设置

| 项目 | 内容 |
|------|------|
| **路径** | /privacy-settings |
| **目的** | 控制个人资料可见性和隐私选项 |

**分组：**

| 分组 | 条目 | 交互 |
|------|------|------|
| **Visibility** | Last Seen, Profile Photo, About | 底部选项面板：Everyone / My Contacts / Nobody（带说明副文本） |
| **Status** | Read Receipts, Show Online Status, Typing Indicator | Toggle 开关 |
| **Contact** | Who Can Add Me | 底部选项面板 |
| | Find Me by Phone, Find Me by Email | Toggle 开关 |
| **Blocked** | Blocked Users (N users) | 底部面板：用户列表 + Unblock 按钮 + 解封确认弹窗 |

### 7.4 Security 安全设置

| 项目 | 内容 |
|------|------|
| **路径** | /security |
| **目的** | 管理账户安全设置 |

**分组：**

| 分组 | 条目 | 交互 |
|------|------|------|
| **Account** | Change Password | 弹窗：当前密码 + 新密码 + 确认（≥6 位校验） |
| | Biometric Lock | Toggle（Face ID / Touch ID） |
| **Contact Methods** | Phone Number | 弹窗：国家码选择器 → 验证码 → 确认 |
| | Email Address | 弹窗：输入邮箱 → 验证码 → 确认 |
| | Google / Apple | Connected → Unbind（确认弹窗） |
| **Sessions** | Active Sessions | 底部面板：3 台设备列表（Current 标签 secondary 色、Log Out → 确认弹窗） |
| | Login History | 底部面板：4 条记录（设备 + 位置 + 时间 + IP） |
| **Data** | Auto-Delete Messages | 底部选项面板：Never / 24h / 7d / 30d / 90d |

### 7.5 Forgot Password 忘记密码

参见 3.4 节。

### 7.6 UserProfile 用户资料

参见 5.4 节。

---

## 8. 音视频通话（2 页）

### 8.1 Calls 通话记录

| 项目 | 内容 |
|------|------|
| **路径** | /calls |
| **目的** | 查看通话历史 |

- 通话记录列表：头像 + 姓名 + 通话类型图标（📞/📹）+ Incoming/Outgoing/Missed + 时长 + 时间
- 点击回拨
- 底部 Tab 导航

### 8.2 CallScreen 通话界面

| 项目 | 内容 |
|------|------|
| **路径** | /callscreen |
| **目的** | 语音/视频通话中界面 |

- 通话时长显示 + 网络质量指示条
- 视频通话：双方画面（大窗 + PIP 小窗）
- 控制按钮：静音、视频开关、扬声器、翻转摄像头
- 挂断按钮（红色，居中）
- 下拉手势最小化

---

## 9. 设计系统与通用组件

### 9.1 主题

使用 **Equatorial Minimalism** 主题，非洲当代极简风格，暖沙色调 + Terracotta 色点缀。

**核心颜色 Tokens：**

| Token | 色值 | 用途 |
|------|------|------|
| --primary | #031631 | 深蓝，标题/主操作/头像背景 |
| --on-primary | #ffffff | 主色上方文字 |
| --primary-container | #1a2b47 | 头像/容器背景 |
| --primary-fixed | #d6e3ff | 选中行高亮/chips 背景（浅蓝） |
| --on-primary-fixed | #081b37 | primary-fixed 上方文字 |
| --secondary | #944931 | Terracotta，强调色/按钮/在线指示器 |
| --on-secondary | #ffffff | secondary 上方文字 |
| --surface | #fbf9f8 | 页面主背景 |
| --surface-container-low | #f5f3f3 | Header/卡片背景 |
| --surface-container-lowest | #ffffff | 列表项/输入框背景 |
| --error | #c62828 | 错误/危险操作/删除 |
| --outline | #c8c6c6 | 边框 |
| --outline-variant | #e0e0e0 | 浅边框 |

**字体：** Montserrat（标题）+ Inter（正文）

### 9.2 通用组件规范

| 组件 | 规格 | 使用页面 |
|------|------|----------|
| **头像** | 40-80px 圆形，primary-container 或 primary 背景，on-primary-container/on-primary 文字首字母 | 全部 |
| **在线指示器** | 12px secondary 圆点 + 2px white 边框，头像右下角 | Chats, Contacts, Contact Selection, UserProfile |
| **搜索栏** | rounded-xl, surface-container-lowest 背景，左搜索图标，focus: ring primary/20 | Chats, Contacts, Contact Selection, ForwardMessage, AddContact |
| **联系人行** | py-3 px-4, surface-container-lowest 背景，分隔线 outline-variant/50，hover surface-container-low | Contacts, Contact Selection, ForwardMessage |
| **Toggle 开关** | 48×24px 胶囊，secondary 色激活，white 滑块滑动动画 | Me, Privacy Settings, Security |
| **圆形复选框** | 24px 圆形，primary 填充选中 + white ✓，outline 边框未选中 | Contact Selection, ForwardMessage |
| **选中 chips** | primary-fixed 背景 + on-primary-fixed 文字 + ✕ 关闭，rounded-full | Contact Selection, ForwardMessage |
| **确认弹窗** | 遮罩 + rounded-2xl 居中弹窗，[Cancel(灰色)] + [Confirm(操作色)] | 通用 |
| **底部面板** | 遮罩 + rounded-t-3xl 底部弹入，Close/Cancel 按钮 | Privacy Settings, Security |
| **Toast** | 居中 fixed top-20, green-500/red 背景，rounded-full | EditProfile |
| **底部悬浮导航** | Telegram 玻璃态（rgba 白色 + backdrop-blur 20px + saturate 180%），rounded-full，primary 当前标签 | 所有 Tab 页面 |

---

## 10. 页面索引（共 24 页）

| # | 页面 | 路径 | 类型 |
|---|------|------|------|
| 1 | Splash | /splash | 启动 |
| 2 | Login | /login | 认证 |
| 3 | Register | /register | 认证 |
| 4 | ForgotPassword | /forgotpassword | 认证 |
| 5 | Chats | /chats | Tab 主页 |
| 6 | Contacts | /contacts | Tab 主页 |
| 7 | Feed | /feed | Tab 主页 |
| 8 | Calls | /calls | Tab 主页 |
| 9 | Me | /me | Tab 主页 |
| 10 | ChatRoom | /chatroom | 聊天 |
| 11 | GroupChat | /groupchat | 聊天 |
| 12 | GroupChatSettings | /groupchat-settings | 设置 |
| 13 | ContactSelection | /contact-selection | 功能 |
| 14 | ForwardMessage | /forwardmessage | 功能 |
| 15 | AddContact | /addcontact | 功能 |
| 16 | PostDetail | /postdetail | 社交 |
| 17 | NewPost | /newpost | 社交 |
| 18 | MyPosts | /myposts | 社交 |
| 19 | EditProfile | /editprofile | 设置 |
| 20 | PrivacySettings | /privacy-settings | 设置 |
| 21 | Security | /security | 设置 |
| 22 | UserProfile | /userprofile | 信息 |
| 23 | CallScreen | /callscreen | 通话 |
| 24 | Settings | /settings | ⚠ 已删除，功能合并至 Me 页面 |

---

## 11. 非功能性需求

### 11.1 性能要求

- 消息发送延迟：≤ 1 秒
- 图片加载时间：≤ 2 秒（普通网络环境）
- 应用启动时间：≤ 3 秒

### 11.2 安全要求

- 用户数据加密存储
- 通讯内容端到端加密
- 敏感操作二次验证
- 删除账号需输入 "DELETE" 确认

### 11.3 兼容性要求

- **iOS：** iOS 12.0 及以上
- **Android：** Android 6.0 及以上

---

## 12. 附录

### 12.1 术语解释

| 术语 | 全称 | 说明 |
|------|------|------|
| IM | Instant Messaging | 即时通讯 |
| Feed | — | 信息流，朋友圈动态 |
| 2FA | Two-Factor Authentication | 双因素认证（v1.0 已移除） |
| PRD | Product Requirement Document | 产品需求文档 |

### 12.2 变更记录

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| V1.0 | 2025-07 | 基于全部 24 个原型页面 PRD，重新编写完整前端需求，对齐所有已实现页面的实际交互、颜色令牌和组件规范 |

---

**文档结束**
