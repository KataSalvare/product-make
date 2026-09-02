# UserProfile Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | UserProfile Page |
| **页面路径** | /user-profile |
| **页面类型** | 信息页 |
| **目标用户** | 已登录用户 |
| **页面目的** | 查看联系人详细信息 |

### 1.2 页面描述
用户资料页面，参考 Telegram 设计风格，展示联系人的详细信息。页面布局更清爽：顶部操作入口精简为图标形式，分享/屏蔽/举报收纳在右上角更多菜单中；Media、Files、Links、Groups 通过 Tab 切换；非联系人展示「Add to Contacts」按钮。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│ ← Profile                    ⠇     │ ← Header
├─────────────────────────────────────┤
│                                     │
│           ┌─────────┐               │
│           │  👤     │               │
│           │  头像   │               │
│           │  🟢     │               │
│           └─────────┘               │
│                                     │
│         Amara Okafor                │
│              online                 │
│                                     │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│   │ 💬 │ │🔔 │ │ 📞 │ │ 📹 │      │ ← Quick Actions
│   │ Msg│ │Mute│ │Call│ │ Vid│      │
│   └────┘ └────┘ └────┘ └────┘      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   +  Add to Contacts        │   │
│  └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ @amara.okafor     Username      ││
│ │ +234...           Mobile        ││
│ │ Bio content       Bio           ││
│ └─────────────────────────────────┘│
│                                     │
│  ┌────────┬───────┬───────┬──────┐ │
│  │ Media  │ Files │ Links │Groups│ │ ← Tab 切换
│  └────────┴───────┴───────┴──────┘ │
│                                     │
│  [当前 Tab 内容]                     │
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 头像区 | 大尺寸头像、在线状态指示 |
| 2 | 基本信息 | 姓名、在线状态 |
| 3 | Quick Actions | Message / Mute / Call / Video，图标在上文字在下 |
| 4 | Add to Contacts | 非联系人展示，主色强调 |
| 5 | 信息卡片 | Username、Mobile、Bio 等关键信息 |
| 6 | Tab 栏 | Media / Files / Links / Groups 切换 |
| 7 | Tab 内容 | 媒体网格 / 文件列表 / 链接列表 / 共同群聊 |

---

## 3. 交互逻辑

### 3.1 入口与头像点击
- 进入方式：
  - 单聊页点击顶部用户头像/名称
  - 群聊页点击消息发送者头像/名称
  - 临时会话页点击顶部用户头像/名称
  - 添加联系人页点击搜索结果头像/名称
- 跳转地址：`/user-profile?isContact={true|false}&name={encodedName}`
- 头像操作：点击可查看大图，长按可保存图片

### 3.2 Quick Actions
四个图标按钮横向排列，图标在上、文字在下：

| 按钮 | 行为 |
|------|------|
| Message | 跳转到 ChatRoom |
| Mute | 切换消息通知静音状态 |
| Call | 发起语音通话 |
| Video | 发起视频通话 |

### 3.3 右上角更多菜单
- 点击右上角 ⠇ 弹出下拉菜单，点击菜单外部或选择后关闭
- 选项与点击效果：
  - **Share Contact**：跳转 `/forward-message?shareContact=xxx`，将联系人卡片作为消息转发给聊天/群聊
  - **Block / Unblock**：切换屏蔽状态，页面底部弹出 Toast「Contact blocked」或「Contact unblocked」
  - **Report**：页面底部弹出 Toast「Report submitted」

### 3.4 添加联系人
- 当 `isContact === false` 时，在 Quick Actions 下方展示「Add to Contacts」按钮
- 点击后弹出确认或直接添加（根据业务需要）
- `isContact` 状态由进入页面时的 URL 参数 `?isContact=true|false` 决定

### 3.5 信息项操作
- 点击 Phone：复制号码
- 点击 Username：复制用户名

### 3.6 Tab 切换与数据来源
- Tab 项：Media / Files / Links / Groups，默认选中 Media
- 数据来源：
  - **Media / Files / Links**：来自当前用户与资料页用户的历史聊天记录（图片、视频、文件、链接）
  - **Groups**：来自当前用户与资料页用户共同加入的群组
- 切换时更新下方内容区，无需整页刷新

### 3.7 共同群聊
- 在 Groups Tab 下展示与该用户的共同群组
- 每个群聊展示群头像、群名称、成员数
- 点击群聊项跳转到 GroupChat 页面

---

## 4. 内容规范

### 4.1 信息显示
| 字段 | 格式 |
|------|------|
| 姓名 | 首字母大写 |
| 用户名 | @username 小写 |
| 电话 | +XXX XXX XXX XXXX |
| 位置 | 城市, 国家 |
| 加入时间 | Month YYYY |

---

## 5. 主题适配

使用 Equatorial Minimalism 主题，操作按钮使用主色和强调色。
