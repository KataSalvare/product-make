# SuperIM 角色管理页规格文档

## 页面信息
- **页面名称**: 角色管理
- **页面路径**: /admin/roles
- **所属模块**: 权限管理模块

## 功能描述
管理后台角色和权限，包括创建角色、编辑角色、分配权限、删除角色等功能，实现基于角色的访问控制（RBAC）。

## 页面布局

### 整体结构
```
┌─────────────────────────────────────────────────────────────────┐
│ Header (固定顶部)                                                │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Sidebar  │  Main Content                                        │
│ (左侧    │  ┌────────────────────────────────────────────────┐ │
│  固定)   │  │ 页面标题 + 新建角色按钮                          │ │
│          │  └────────────────────────────────────────────────┘ │
│          │  ┌────────────────────────────────────────────────┐ │
│          │  │ 角色列表表格                                     │ │
│          │  │ 名称 | 描述 | 管理员数 | 创建时间 | 操作         │ │
│          │  └────────────────────────────────────────────────┘ │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

## 组件清单

### 1. 角色列表表格
- **组件类型**: 数据表格
- **列定义**:
  | 列名 | 宽度 | 说明 |
  |------|------|------|
  | 角色名称 | 150px | 角色唯一标识名称 |
  | 描述 | 250px | 角色功能描述 |
  | 管理员数 | 100px | 拥有该角色的管理员数量 |
  | 创建时间 | 150px | YYYY-MM-DD HH:mm |
  | 操作 | 200px | 编辑/权限/删除 |

### 2. 新建/编辑角色对话框
- **组件类型**: 对话框
- **内容**:
  - 角色名称输入框（必填，唯一）
  - 角色描述输入框
  - 确认按钮
  - 取消按钮

### 3. 权限配置抽屉
- **组件类型**: 抽屉
- **内容**:
  - 权限树形结构
  - 菜单权限（页面访问权限）
  - 操作权限（按钮/接口权限）
  - 全选/取消全选功能
  - 保存按钮

### 4. 删除确认对话框
- **组件类型**: 确认对话框
- **内容**:
  - 删除确认提示
  - 确认按钮（危险操作）
  - 取消按钮

## Mock 数据

### 角色列表
```json
{
  "total": 4,
  "data": [
    {
      "id": 1,
      "name": "超级管理员",
      "description": "拥有所有权限，可管理所有功能和用户",
      "adminCount": 2,
      "createTime": "2025-01-01 00:00:00",
      "isSystem": true
    },
    {
      "id": 2,
      "name": "运营专员",
      "description": "负责用户管理、内容审核、数据统计",
      "adminCount": 5,
      "createTime": "2025-01-05 10:30:00",
      "isSystem": false
    },
    {
      "id": 3,
      "name": "客服专员",
      "description": "处理用户反馈、举报处理、用户咨询",
      "adminCount": 8,
      "createTime": "2025-01-10 14:20:00",
      "isSystem": false
    },
    {
      "id": 4,
      "name": "审计员",
      "description": "查看日志、审计操作记录，无修改权限",
      "adminCount": 3,
      "createTime": "2025-01-15 09:15:00",
      "isSystem": false
    }
  ]
}
```

### 权限树数据
```json
{
  "permissions": [
    {
      "id": "dashboard",
      "name": "数据概览",
      "type": "menu",
      "children": [
        { "id": "dashboard.view", "name": "查看数据", "type": "action" }
      ]
    },
    {
      "id": "users",
      "name": "用户管理",
      "type": "menu",
      "children": [
        { "id": "users.view", "name": "查看用户", "type": "action" },
        { "id": "users.edit", "name": "编辑用户", "type": "action" },
        { "id": "users.ban", "name": "封禁用户", "type": "action" },
        { "id": "users.delete", "name": "删除用户", "type": "action" }
      ]
    },
    {
      "id": "messages",
      "name": "消息管理",
      "type": "menu",
      "children": [
        { "id": "messages.view", "name": "查看消息", "type": "action" },
        { "id": "messages.reports", "name": "举报处理", "type": "action" },
        { "id": "messages.sensitive", "name": "敏感词管理", "type": "action" }
      ]
    },
    {
      "id": "feed",
      "name": "动态管理",
      "type": "menu",
      "children": [
        { "id": "feed.view", "name": "查看动态", "type": "action" },
        { "id": "feed.audit", "name": "审核动态", "type": "action" },
        { "id": "feed.reports", "name": "举报处理", "type": "action" }
      ]
    },
    {
      "id": "calls",
      "name": "通话管理",
      "type": "menu",
      "children": [
        { "id": "calls.view", "name": "查看通话", "type": "action" }
      ]
    },
    {
      "id": "settings",
      "name": "系统设置",
      "type": "menu",
      "children": [
        { "id": "settings.view", "name": "查看配置", "type": "action" },
        { "id": "settings.edit", "name": "修改配置", "type": "action" },
        { "id": "settings.versions", "name": "版本管理", "type": "action" }
      ]
    },
    {
      "id": "logs",
      "name": "日志管理",
      "type": "menu",
      "children": [
        { "id": "logs.view", "name": "查看日志", "type": "action" }
      ]
    },
    {
      "id": "admins",
      "name": "权限管理",
      "type": "menu",
      "children": [
        { "id": "admins.view", "name": "查看管理员", "type": "action" },
        { "id": "admins.edit", "name": "编辑管理员", "type": "action" },
        { "id": "roles.view", "name": "查看角色", "type": "action" },
        { "id": "roles.edit", "name": "编辑角色", "type": "action" }
      ]
    }
  ]
}
```

## 交互行为

### 新建角色
1. 点击"新建角色"按钮
2. 弹出新建对话框
3. 输入角色名称和描述
4. 点击确认创建角色

### 编辑角色
1. 点击操作列的"编辑"按钮
2. 弹出编辑对话框，预填充当前数据
3. 修改角色名称或描述
4. 点击确认保存修改

### 配置权限
1. 点击操作列的"权限"按钮
2. 打开权限配置抽屉
3. 勾选/取消勾选权限项
4. 点击保存应用权限配置

### 删除角色
1. 点击操作列的"删除"按钮
2. 弹出确认对话框
3. 确认后删除角色（系统角色不可删除）

## 响应式设计
- **桌面端**: 完整表格展示
- **平板端**: 部分列隐藏（创建时间）
- **移动端**: 卡片式列表展示

## 主题规范
- 主色: #1E40AF
- 成功: #10B981
- 警告: #F59E0B
- 错误: #EF4444
- 表格行高: 64px
- 卡片间距: 16px
