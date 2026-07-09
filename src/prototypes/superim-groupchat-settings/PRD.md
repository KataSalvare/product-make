# GroupChatSettings 产品需求文档

## 1. 功能概述

群聊设置页面，用于管理群组信息、成员和权限。参考 Telegram 的群组信息界面设计。

## 2. 页面结构

### 2.1 头部
- 返回按钮（左箭头图标）
- 页面标题："Group Info"
- 粘性定位，始终可见

### 2.2 群组信息区域
- 大圆形头像（96px）
  - 悬停显示相机图标遮罩
  - 点击可编辑头像
- 群组名称（可编辑，编辑图标始终可见）
- 成员数量副标题
- 居中布局

### 2.3 描述卡片
- 全宽卡片设计
- 标签："Description"
- 当前描述文本
- 编辑图标始终可见
- 点击打开编辑对话框

### 2.4 群公告卡片
- 使用 primary-container 背景色（醒目）
- 头部区域：
  - 喇叭图标 + "Announcement" 标签
  - 编辑按钮（仅管理员可见，右上角）
- 内容区域：
  - 显示公告文本（如果存在）
  - 显示发布日期
  - "Clear Announcement" 按钮（仅管理员，红色文字）
  - 空状态显示 "No announcement"
  - "Add Announcement" 按钮（仅管理员，空状态时）
- 仅管理员可编辑

### 2.5 成员区域
- 区域标题 + 添加成员按钮
- **群主子区域**
  - 使用 tertiary 颜色区分
  - "Owner" 标识
  - 在线状态指示器
  - 固定显示 "You"
- **管理员子区域**
  - 管理员标识
  - 在线状态指示器
  - 点击进入成员操作（仅群主可操作）
- **普通成员子区域**
  - 在线/离线状态
  - 点击进入成员操作（管理员可操作）

### 2.5 设置区域
- **发送消息权限**
  - 选项：All members / Only admins
  - 点击打开底部弹窗
  - 仅管理员可修改
- **群组类型**
  - 选项：Public / Private
  - 点击打开底部弹窗
  - 仅群主可修改
- 右侧显示当前值

### 2.6 危险操作区域
- 退出群组按钮（红色文字）
- 删除群组按钮（红色文字，仅群主可见）
- 需要二次确认

## 3. 交互设计

### 3.1 编辑群组名称
- 点击群组名称触发
- 弹出模态对话框
- 文本输入框，自动聚焦
- 保存/取消按钮
- 即时更新显示

### 3.2 编辑描述
- 点击描述卡片触发
- 弹出模态对话框
- 多行文本输入框
- 保存/取消按钮
- 即时更新显示

### 3.3 编辑群公告
- 点击公告卡片头部的编辑图标触发
- 弹出模态对话框
- 标题根据状态显示 "Edit Announcement" 或 "Add Announcement"
- 多行文本输入框
- 保存按钮在内容为空时禁用
- 保存时自动更新日期
- 取消/保存按钮

### 3.4 清除群公告
- 点击 "Clear Announcement" 按钮触发
- 确认对话框
- 警告信息："This action cannot be undone"
- 取消/清除按钮
- 清除后显示空状态

### 3.5 成员操作
- 点击成员打开操作面板
- 底部弹出样式（移动端）
- 操作选项根据权限动态显示：

**普通成员操作（仅群主）：**
- 设为管理员
- 转让群主
- 从群组移除

**管理员操作（仅群主）：**
- 取消管理员
- 转让群主
- 从群组移除

### 3.4 转让群主
- 点击"Transfer Ownership"按钮
- 确认对话框
- 警告信息："You will become an admin"
- 取消/转让按钮
- 即时更新角色

### 3.5 发送消息权限设置
- 点击设置行打开对话框
- 底部弹窗样式
- 两个选项：
  - All members: Everyone can send messages
  - Only admins: Only admins can send messages
- 当前选中项显示勾选标记
- 仅管理员可修改

### 3.6 群组类型设置
- 点击设置行打开对话框
- 底部弹窗样式
- 两个选项：
  - Public: Anyone can find and join this group
  - Private: Only invited members can join
- 当前选中项显示勾选标记
- 仅群主可修改

### 3.7 添加成员
- 点击"Add"按钮
- 打开联系人选择界面（预留）

### 3.8 退出群组
- 点击退出按钮
- 确认对话框
- 显示群组名称
- 取消/退出按钮
- 退出后返回聊天列表

### 3.9 删除群组
- 点击删除按钮
- 警告确认对话框
- 显示群组名称和警告信息
- 取消/删除按钮
- 删除后返回聊天列表
- 仅群主可操作

## 4. 数据结构

```typescript
interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  isOnline?: boolean;
}

interface GroupInfo {
  name: string;
  description: string;
  avatar: string;
  createdAt: string;
  memberCount: number;
  announcement?: string;
  announcementDate?: string;
}

type SendMessagePermission = 'all' | 'admin';
type GroupType = 'public' | 'private';
```

## 5. 权限矩阵

| 操作 | 群主 | 管理员 | 普通成员 |
|------|------|--------|----------|
| 编辑群组名称 | ✓ | ✓ | ✗ |
| 编辑描述 | ✓ | ✓ | ✗ |
| 添加成员 | ✓ | ✓ | ✗ |
| 移除成员 | ✓ | ✓（非管理员） | ✗ |
| 设为管理员 | ✓ | ✗ | ✗ |
| 取消管理员 | ✓ | ✗ | ✗ |
| 转让群主 | ✓ | ✗ | ✗ |
| 修改发送权限 | ✓ | ✓ | ✗ |
| 修改群组类型 | ✓ | ✗ | ✗ |
| 删除群组 | ✓ | ✗ | ✗ |
| 退出群组 | ✓ | ✓ | ✓ |

## 6. 视觉规范

### 6.1 颜色
- 背景：surface-container-low
- 卡片背景：surface-container
- 主要文字：on-surface
- 次要文字：on-surface-variant
- 强调色：primary（管理员）
- 第三色：tertiary（群主）
- 错误色：error
- 在线状态：绿色

### 6.2 字体
- 群组名称：headline-sm
- 成员名称：body-md
- 标签文字：label-sm
- 描述文字：body-md

### 6.3 间距
- 页面内边距：16px (px-4)
- 卡片内边距：16px (p-4)
- 元素间距：12-16px
- 圆角：16px (rounded-2xl)

## 7. 响应式设计

- 移动端优先设计
- 最大宽度限制：420px（底部弹窗）
- 对话框最大宽度：320px
