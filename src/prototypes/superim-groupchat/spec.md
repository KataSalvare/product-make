# GroupChat Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | GroupChat |
| **页面路径** | /groupchat |
| **页面类型** | 聊天页 |
| **目标用户** | 群组成员 |
| **页面目的** | 群组聊天，多人实时交流 |

### 1.2 页面描述
群组聊天页面，支持多人实时消息交流，包含群公告、消息气泡、输入栏、表情选择、附件发送、语音消息等功能。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
|  ←  Design Team              ⋮      |
|      12 members                     |
|  ─────────────────────────────────  |
|  📢 Welcome to Design Team!    ✕    |
|  ─────────────────────────────────  |
|                                     |
|     🎉 John joined the group        |
|                                     |
|  ┌──┐                               |
|  │AO│ Amara                         |
|  └──┘ ┌──────────────────────┐      |
|       │ Hey team! How is...  │      |
|       └──────────────────────┘      |
|       10:30 AM                      |
|                                     |
|              ┌──────────────────────┐
|              │ Great! Working on... │
|              └──────────────────────┘
|                          10:32 AM   |
|                                     |
|  ┌──┐                               |
|  │KN│ Kwame                         |
|  └──┘ ┌──────────────────────┐      |
|       │ Can't wait to see... │      |
|       └──────────────────────┘      |
|       10:33 AM                      |
|                                     |
|  ─────────────────────────────────  |
|  🎤 │ Message...           😊 │＋│  |
|  ─────────────────────────────────  |
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 群聊头部 | 返回、群名称、成员数、菜单 |
| 2 | 群公告 | 可关闭的公告横幅 |
| 3 | 消息列表 | 按时间倒序排列 |
| 4 | 输入栏 | 固定底部，消息输入和发送 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #f5f3f3 | --surface-container-low | 聊天背景 |
| 我的消息 | #ffffff | --surface-container-lowest | 发送的消息气泡 |
| 对方消息 | #ffffff | --surface-container-lowest | 接收的消息气泡 |
| 系统消息 | #efeded | --surface-container | 系统提示背景 |
| 公告背景 | #f7ebe7 | --secondary-container | 群公告背景 |
| 输入栏背景 | #efeded | --surface-container | 输入区域背景 |
| 附件菜单图标 | #efeded | --surface-container | 图标容器背景 |
| 时间文字 | #6b6b6b | --on-surface-variant | 时间戳 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 群名称 | Inter | 18px | 600 | 1.2 |
| 成员数 | Inter | 14px | 400 | 1.4 |
| 消息内容 | Inter | 16px | 400 | 1.5 |
| 发送者名 | Inter | 12px | 500 | 1.2 |
| 时间戳 | Inter | 12px | 400 | 1 |
| 公告文字 | Inter | 14px | 400 | 1.4 |

#### 尺寸与间距
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 头像 | 32×32px | 圆形 |
| 消息气泡最大宽度 | 70% | 防止过长 |
| 消息间距 | 16px | 垂直间距 |
| 气泡内边距 | 16px 16px | 上下 左右 |
| 气泡圆角 | 16px | 统一圆角 |
| 输入栏高度 | 48px | 紧凑高度 |

---

## 3. 交互逻辑

### 3.1 消息输入栏（微信风格）
固定于屏幕底部。布局：语音切换 | 文本输入框（内嵌表情按钮） | 加号/发送按钮

**组件行为：**
- **语音按钮**（左侧）：麦克风图标，点击进入语音录制模式
- **文本输入框**（中间）：白色圆角输入框（rounded-2xl），placeholder "Message..."，表情按钮位于输入框内右侧
- **加号/发送**（右侧）：
  - 无文字时：显示"+"图标，点击打开附件菜单底部弹窗，激活时旋转45°
  - 有文字时：显示发送箭头（primary 颜色，无圆形背景）

### 3.2 表情选择器
| 交互 | 行为 |
|------|------|
| 点击表情按钮 | 展开/收起表情面板 |
| 点击表情 | 插入到输入框光标位置 |
| 表情面板 | 8列网格，16个常用emoji |

### 3.3 附件菜单（微信风格底部弹窗）
点击"+"按钮触发全屏底部弹窗：

**弹窗结构：**
- 半透明黑色遮罩（点击关闭）
- 底部白色面板（rounded-t-3xl，从底部滑入）
- 标题："Share" + 关闭按钮
- 4列网格菜单

**菜单项（统一样式，无多色背景）：**
| 选项 | 图标 | 功能 |
|------|------|------|
| Photos | 图片图标 | 选择图片发送 |
| Camera | 相机图标 | 拍照发送 |
| Files | 文档图标 | 选择文件发送 |
| Location | 定位图标 | 发送当前位置 |

**样式规范：**
- 图标容器：56×56px，surface-container 背景色，rounded-2xl
- 图标：28×28px，on-surface 颜色，1.5px 线宽
- 标签：label-xs，on-surface 颜色
- 所有菜单项背景统一，不区分颜色

### 3.4 语音录制
| 状态 | 交互 |
|------|------|
| 点击麦克风 | 开始录制，显示录制面板 |
| 录制中 | 显示计时器和红色脉冲点 |
| 点击取消 | 停止录制，不发送 |
| 点击发送 | 停止录制，发送语音消息 |

### 3.5 消息显示规则
| 消息类型 | 显示方式 |
|----------|----------|
| 我的消息 | 右侧，白色背景（与对方一致），深色文字 |
| 对方消息 | 左侧，白色背景；头像位于发送者姓名左侧并与姓名顶部对齐，气泡位于姓名下方 |
| 系统消息 | 居中，灰色背景，无头像 |

### 3.6 消息操作（长按菜单）
长按任意非系统消息气泡（500ms以上）触发操作菜单：

| 操作项 | 图标 | 功能描述 | 视觉样式 |
|--------|------|----------|----------|
| Reply | 弯曲箭头 | 进入回复模式，引用该消息 | 默认文字色 |
| Copy | 两个方块 | 复制消息文本到剪贴板 | 默认文字色 |
| Forward | 双箭头 | 转发消息到其他聊天（待实现） | 默认文字色 |
| Pin | 书签 | 置顶/取消置顶消息 | 默认文字色 |
| Select | 方框勾选 | 进入消息多选模式 | 默认文字色 |
| Delete | 垃圾桶 | 删除该消息 | 红色警示色 |

**菜单行为：**
- 菜单宽度：180px
- 菜单项高度：44px
- 圆角：12px
- 背景：白色 + 阴影
- 点击外部区域关闭菜单
- 菜单自动调整位置避免超出屏幕
- **系统消息不支持长按操作**

#### 回复模式
- 长按消息选择"Reply"进入回复模式
- 输入栏上方显示回复预览条：
  - 左侧显示被回复消息的发送者和内容（截断显示）
  - 右侧显示取消按钮（X）
  - 预览条左侧有主题色边框装饰
- 发送的消息显示回复引用：
  - 消息气泡顶部显示灰色引用条
  - 格式："Replying to [Sender]: [Message text]"
- 在群聊中，回复引用清晰标识原消息发送者名称
- 点击取消按钮或发送消息后退出回复模式

#### 消息置顶
- 长按消息选择"Pin"置顶消息
- 置顶消息右上角显示 📌 图标
- 已置顶消息菜单显示"Unpin"选项，点击取消置顶
- 置顶状态持久化（当前会话）

#### 消息多选
- 长按非系统消息选择"Select"进入多选模式
- 进入多选模式后：
  - 头部变为"X Selected"标题，左侧显示关闭按钮，右侧显示 Delete 按钮
  - 所有消息的多选框统一对齐到屏幕最左侧，形成一列垂直参考线；我的消息气泡仍保持右对齐，他人消息气泡保持左对齐
  - 底部固定显示 Forward 按钮，显示已选数量
- 点击 Forward 跳转至 /forward-message 转发已选消息
- 点击 Delete 打开二次确认对话框，确认后批量移除已选消息
- 点击关闭按钮或删除完成后退出多选模式

#### 消息删除
- 长按消息选择"Delete"打开删除确认对话框
- 对话框包含：
  - 标题："Delete Message"
  - 提示文字："Are you sure you want to delete this message?"
  - "Delete for everyone"复选框（仅对自己发送的消息显示）
  - Cancel按钮：取消删除，关闭对话框
  - Delete按钮：确认删除，从列表移除消息
- 删除后消息从列表中移除

### 3.7 群聊设置菜单（头部菜单）
点击右上角三点菜单按钮展开：

#### 免打扰
- 点击切换免打扰状态
- 图标变化：静音时显示带斜线的铃铛
- 文字变化："Mute Notifications" / "Unmute Notifications"

#### Auto Delete
- 点击打开模态对话框
- 移动端：底部弹窗样式（rounded-t-3xl, max-width 420px）
- 底部滑入动画（slide-in from bottom）
- 对话框内容：
  - 标题："Auto Delete"
  - 关闭按钮（右上角X）
  - 选项列表：
    - Off（关闭）
    - 24 Hours（24小时）
    - 1 Week（1周）
    - 1 Month（1个月）
  - 当前选中项显示勾选标记
  - 底部说明文字："Messages will be automatically deleted for everyone after the selected time period."
- 选择后自动关闭对话框
- 主菜单显示当前设置值

#### 退出群聊
- 点击打开确认对话框
- 对话框内容：
  - 标题："Leave Group"
  - 提示："Are you sure you want to leave [Group Name]? You won't receive any new messages from this group."
  - Cancel按钮：取消操作
  - Leave按钮：确认退出
- 退出后返回聊天列表

### 3.8 @提及功能
输入框输入"@"字符时触发成员选择：

**提及弹窗：**
- 位置：输入栏上方
- 样式：圆角卡片，最大高度280px
- 头部："Mention someone"提示文字
- 成员列表：
  - 头像（40px）
  - 姓名（body-md）
  - 在线状态（label-xs）
  - 在线指示器（绿色圆点）
- 实时过滤：根据@后输入的文字过滤成员
- 空状态："No members found"

**选择交互：**
- 点击成员项插入提及
- 格式：@Member Name（带空格）
- 插入后弹窗关闭，输入框保持焦点
- 输入空格后弹窗关闭

**提及显示（Telegram 风格）：**
- 无背景块，纯文本样式
- 统一样式：primary 颜色文字 + primary 下划线（40%透明度）
- 下划线偏移：2px
- 字重：medium
- 格式：@Member Name
- 简洁、极简的外观
- 双方消息样式统一

### 3.9 滚动行为
- 新消息自动滚动到底部
- 用户手动滚动时暂停自动滚动
- 显示"新消息"提示按钮



---

## 4. 数据结构

### 4.1 消息数据
```typescript
type MessageType = 'text' | 'image' | 'video' | 'location';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  senderAvatar: string;
  isMe: boolean;
  isSystem?: boolean;
  type?: MessageType;
  mediaUrl?: string;
  location?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
}
```

### 4.1.1 消息类型说明
| 类型 | type值 | 额外字段 | 说明 |
|------|--------|----------|------|
| 文本 | text（默认） | - | 普通文字消息 |
| 图片 | image | mediaUrl | 图片URL |
| 视频 | video | mediaUrl | 视频缩略图URL |
| 定位 | location | location对象 | 位置名称、地址、坐标 |

### 4.2 群组信息
```typescript
interface GroupInfo {
  name: string;
  memberCount: number;
  announcement: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}
```

### 4.3 组件状态
```typescript
interface GroupChatState {
  messages: Message[];
  inputText: string;
  showAnnouncement: boolean;
  showEmojiPicker: boolean;
  showAttachMenu: boolean;
  isRecording: boolean;
  recordingTime: number;
}
```

---

## 5. 异常处理

### 5.1 发送失败
- 消息显示红色感叹号
- 点击重试
- 长按删除

### 5.2 网络断开
- 顶部显示"Connecting..."提示
- 消息暂存本地，恢复后发送

### 5.3 加载历史
- 下拉刷新手势
- 显示loading spinner
- 加载完成后平滑插入消息

---

## 6. v1.2 云盘集成

- Share 附件面板新增 Cloud Drive，进入 `/cloud-drive?mode=picker&target=group-chat`。
- Picker 返回 `cloudDriveSelection` 后，将所选文件追加为当前用户发送的群文件消息。
- 文件消息长按菜单新增 Save to Cloud Drive；保存来源记录为群名称。
- 临时会话不继承本页云盘能力。
