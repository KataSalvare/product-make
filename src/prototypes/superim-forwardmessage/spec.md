# ForwardMessage Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | ForwardMessage |
| **页面路径** | /forwardmessage |
| **页面类型** | 功能页 |
| **目标用户** | 所有用户 |
| **页面目的** | 转发消息给联系人或群组 |

### 1.2 页面描述
消息转发页面，允许用户选择联系人或群组，将消息同时转发给多个接收者，支持搜索和批量选择。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
|  ← Forward to...             (1)   |
|  ─────────────────────────────────  |
|  ┌────────────────────────────────┐ |
|  │ 🔍 Search contacts or groups   │ |
|  └────────────────────────────────┘ |
|                                     |
|  ┌────────────────────────────────┐ |
|  │ 💬 Beautiful sunset at the...  │ |
|  └────────────────────────────────┘ |
|                                     |
|  RECENT                             |
|  ┌──┐ Amara Okafor            ☐    |
|  │AO│ 10 min ago                   |
|  └──┘                               |
|  ┌──┐ Design Team (12)        ☐    |
|  │DT│ Group                      ☑  |
|  └──┘                               |
|                                     |
|  ALL CONTACTS                       |
|  ┌──┐ Amina Ibrahim           ☐    |
|  │AI│ Online                       |
|  └──┘                               |
|  ┌──┐ Project Alpha (25)      ☐    |
|  │PA│ Group                      ☑  |
|  └──┘                               |
|                                     |
|  ┌────────────────────────────────┐ |
|  │        Send (2)                │ |
|  └────────────────────────────────┘ |
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 页面头部 | 返回、标题、已选数量 |
| 2 | 搜索栏 | 快速查找联系人 |
| 3 | 消息预览 | 显示要转发的消息内容 |
| 4 | 联系人列表 | 最近联系人和全部联系人 |
| 5 | 发送按钮 | 底部固定，显示已选数量 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #fbf9f8 | --surface | 主背景 |
| 搜索栏背景 | #fbf9f8 | --surface-container-lowest | 搜索区域 |
| 消息预览背景 | #f7ebe7 | --secondary-container/30 | 预览卡片 |
| 选中行背景 | #d6e3ff | --primary-fixed | 选中状态 |
| 复选框选中 | #031631 | --primary | 选中标记 |
| 复选框未选 | #c8c6c6 | --outline | 未选中边框 |
| 发送按钮 | #031631 | --primary | 可发送状态 |
| 已选 chips | #d6e3ff | --primary-fixed | chips 背景 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 页面标题 | Inter | 18px | 600 | 1.2 |
| 分组标题 | Inter | 12px | 500 | 1 | 大写 |
| 联系人名 | Inter | 16px | 500 | 1.3 |
| 状态文字 | Inter | 14px | 400 | 1.3 |
| 消息预览 | Inter | 14px | 400 | 1.4 |
| 发送按钮 | Inter | 16px | 600 | 1 |

#### 尺寸与间距
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 头像 | 48×48px | 圆形 |
| 复选框 | 20×20px | 方形圆角 |
| 列表项高度 | 64px | 固定高度 |
| 分组间距 | 24px | 组间间距 |
| 发送按钮高度 | 48px | 固定高度 |

---

## 3. 交互逻辑

### 3.1 选择流程
```
点击复选框 → 添加到选中列表 → 更新已选计数 → 启用发送按钮
```

### 3.2 搜索过滤
- 实时搜索联系人
- 支持拼音/首字母搜索
- 高亮匹配文字

### 3.3 消息预览
| 消息类型 | 预览显示 |
|----------|----------|
| text | 文字内容(截断60字符) |
| image | 📷 Photo |
| video | 🎥 Video |
| file | 📎 File |
| voice | 🎤 Voice Message |
| location | 📍 Location |

### 3.4 发送流程
```
点击Send → 显示sending状态 → 逐个发送 → 显示成功提示 → 返回
```

### 3.5 多选限制
- 最多选择50个接收者
- 超过时提示"Maximum 50 recipients"
- 群组按成员数计算

### 3.6 快捷操作
- 最近联系人优先显示
- 已选联系人置顶
- 点击头像查看详情

---

## 4. 数据结构

### 4.1 联系人数据
```typescript
interface Contact {
  id: string;
  name: string;
  avatar: string;
  type: 'contact' | 'group';
  lastActive?: string;
  memberCount?: number;
}
```

### 4.2 转发消息
```typescript
interface ForwardMessage {
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'location';
  content: string;
  preview?: string;
}
```

### 4.3 页面状态
```typescript
interface ForwardState {
  searchQuery: string;
  selectedIds: string[];
  recent: Contact[];
  contacts: Contact[];
  isSending: boolean;
  showSuccess: boolean;
}
```

---

## 5. 异常处理

### 5.1 发送失败
- 显示失败提示
- 保留选中状态
- 允许重试

### 5.2 部分成功
- 显示"Sent to X of Y recipients"
- 列出失败的接收者
- 可选择重发或跳过

### 5.3 无接收者
- 发送按钮禁用
- 提示"Select at least one recipient"
