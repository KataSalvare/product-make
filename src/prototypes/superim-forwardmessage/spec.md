# ForwardMessage Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | ForwardMessage |
| **页面路径** | /forward-message |
| **页面类型** | 功能页 |
| **目标用户** | 所有用户 |
| **页面目的** | 参考 Telegram 转发交互，将消息快速转发给聊天或联系人 |

### 1.2 页面描述
消息转发页面，顶部仅保留标题与发送按钮，不展示待转发消息内容。支持通过页面底部悬浮胶囊切换「Chats / Contacts」目标类型；Chats Tab 下支持对话文件夹（All / Work / Family）筛选，文件夹标签位于搜索框下方。聊天列表平铺展示，不做分组。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
|  ← Forward to...            [Send]  |
|  ─────────────────────────────────  |
|  ┌────────────────────────────────┐ |
|  │ 🔍 Search chats / contacts     │ |
|  └────────────────────────────────┘ |
|  ┌────┐ ┌────┐ ┌────┐               |
|  │All │ │Work│ │Family│              │ ← 文件夹筛选（Chats Tab）
|  └────┘ └────┘ └────┘               |
|  ┌────┐ Saved Messages         ☐   │
|  │🔖 │                              │
|  └────┘                               │
|  ┌──┐ Amara Okafor             ☐   │
|  │AO│                              │
|  └──┘                               │
|  ┌──┐ Design Team  Group        ☐   │ ← 名称右侧 Group 标签
|  │DT│                              │
|  └──┘                               │
|  ┌──┐ Chioma Nnamdi            ☐   │
|  │CN│                              │
|  └──┘                               │
|                                     │
|         ┌─────────┬─────────┐       │ ← 底部悬浮胶囊
|         │  Chats  │ Contacts│       │
|         └─────────┴─────────┘       │
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 页面头部 | 返回、标题、右上角发送按钮 |
| 2 | 搜索栏 | 按名称搜索聊天或联系人 |
| 3 | 文件夹筛选 | All / Work / Family，仅在 Chats Tab 显示 |
| 4 | 已选 chips | 横向滚动展示已选对象，可移除 |
| 5 | 目标列表 | 平铺展示所有聊天或联系人 |
| 6 | 底部悬浮胶囊 | Chats / Contacts 切换 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #fbf9f8 | --surface | 主背景 |
| 搜索栏背景 | #fbf9f8 | --surface-container-lowest | 搜索区域 |
| 选中行背景 | #d6e3ff | --primary-fixed | 选中状态 |
| 复选框选中 | #031631 | --primary | 选中标记 |
| 复选框未选 | #c8c6c6 | --outline | 未选中边框 |
| 文件夹激活 | #944931 | --secondary | 文件夹选中背景 |
| 发送按钮 | #031631 | --primary | 可发送状态 |
| 已选 chips | #d6e3ff | --primary-fixed | chips 背景 |
| 底部胶囊背景 | rgba(255,255,255,0.72) | - | 玻璃质感悬浮胶囊 |
| 底部胶囊激活 | #031631 | --primary | 当前 Tab 按钮 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 页面标题 | Inter | 18px | 600 | 1.2 |
| 文件夹标签 | Inter | 12px | 500 | 1 |
| 联系人名 | Inter | 14px | 500 | 1.3 |
| 群聊标签 | Inter | 12px | 400 | 1.3 |
| 联系人状态 | Inter | 12px | 400 | 1.3 |
| 发送按钮 | Inter | 14px | 600 | 1 |
| 底部胶囊 | Inter | 14px | 500 | 1 |

#### 尺寸与间距
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 头像 | 40×40px | 圆形 |
| 复选框 | 20×20px | 圆形 |
| 列表项高度 | 56px | 固定高度 |
| 列表项内边距 | 10px 16px | 上下 左右 |
| 底部胶囊 | 圆角 full | 居中悬浮，距底部 24px |
| 列表底部留白 | 96px | 避免被底部胶囊遮挡 |

---

## 3. 交互逻辑

### 3.1 选择流程
```
点击列表项 → 切换选中状态 → 更新已选计数 → 启用 Send 按钮
```

### 3.2 底部悬浮胶囊切换
- 页面底部居中悬浮一个圆角胶囊，包含「Chats」和「Contacts」两个按钮
- 当前激活项使用 --primary 背景高亮
- 切换 Tab 时保留已选对象，搜索词保留

### 3.3 文件夹筛选
- 仅在 **Chats** Tab 下显示文件夹标签
- 文件夹标签位于搜索框正下方
- 默认选中「All」
- 切换文件夹时实时过滤列表
- Saved Messages 在所有文件夹下均显示

### 3.4 搜索过滤
- 实时搜索当前 Tab 下的目标名称
- 搜索无结果时显示空状态

### 3.5 列表展示规则
- **Chats Tab**：平铺展示 Saved Messages + 所有聊天，不区分分组
- **Contacts Tab**：平铺展示所有联系人
- 聊天项不展示最近活跃时间
- 群聊在名称右侧展示「Group」标签，不展示成员数
- 联系人在名称下方展示在线/最近活跃时间

### 3.6 发送流程
```
点击右上角 Send → 显示 sending 状态 → 发送完成 → 成功提示 → 返回上一页
```

### 3.7 已选对象
- 已选对象以 chips 形式横向展示在文件夹筛选下方
- 点击 chip 上的 × 可取消选择
- 标题实时显示已选数量

### 3.8 多选限制
- 最多选择 50 个接收者
- 超过时提示"Maximum 50 recipients"

---

## 4. 数据结构

### 4.1 联系人/聊天数据
```typescript
interface Contact {
  id: string;
  name: string;
  avatar: string;
  type: 'contact' | 'group';
  lastActive?: string;
}
```

### 4.2 对话文件夹
```typescript
interface ChatFolder {
  id: string;
  name: string;
  chatIds: string[];
}
```

### 4.3 转发消息
```typescript
interface ForwardMessage {
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'location';
  content: string;
  preview?: string;
}
```

### 4.4 页面状态
```typescript
interface ForwardState {
  activeTab: 'chats' | 'contacts';
  activeFolderId: string;
  searchQuery: string;
  selectedIds: string[];
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
- 右上角 Send 按钮禁用
- 提示"Select at least one recipient"

### 5.4 搜索无结果
- 显示空状态插图
- 提示"No chats/contacts found for \"{query}\""
