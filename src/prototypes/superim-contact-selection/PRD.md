# Contact Selection Page PRD

## 1. 功能概述

联系人选择页面用于从通讯录中选择成员添加到群聊。支持搜索、多选、批量添加功能。

## 2. 页面结构

### 2.1 顶部导航栏
- 返回按钮（左侧）
- 页面标题："Add Members"
- 添加按钮（右侧，仅当有选中联系人时显示），primary 背景色
- 格式："Add (N)"，N 为选中数量

### 2.2 搜索栏
- 全宽搜索框，relative 布局
- 左侧搜索图标（on-surface-variant 色）
- 占位文字："Search contacts..."
- 右侧清除按钮（输入内容时显示）
- 圆角设计（rounded-xl），surface-container-lowest 背景
- focus: 2px primary/20 色 ring

### 2.3 已选联系人标签栏
- 水平滚动区域
- 每个标签显示联系人姓名 + 关闭图标
- 点击标签可取消选择
- 使用 primary-fixed 背景，on-primary-fixed 文字，hover 变为 primary-fixed-dim
- rounded-full pills

### 2.4 联系人列表
- 按首字母分组（A-Z）
- 粘性分组标题，primary 色文字
- 联系人行使用 surface-container-lowest 背景
- 每个联系人项包含：
  - 24px 圆形复选框（primary 填充当选中，outline 边框当未选中）
  - 48px 头像（primary-container 背景），带在线指示器（12px secondary 色圆点 + 白色边框）
  - 姓名（body-md, font-semibold）
  - 在线状态文字（label-xs）
- 选中行使用 primary-fixed 高亮背景

### 2.5 空状态
- 当搜索无结果时显示
- 居中图标 + "No contacts found" 文字

### 2.6 确认对话框
- 半屏遮罩 + 居中弹窗
- Title: "Add X Member(s)"
- 内容描述
- Cancel / Add 按钮

## 3. 交互流程

### 3.1 搜索联系人
- 实时过滤，不区分大小写
- 按姓名匹配
- 点击清除按钮重置搜索

### 3.2 选择联系人
- 点击行切换选择状态
- 复选框视觉即时反馈
- 选中项添加到标签栏
- 顶部按钮显示选中数量

### 3.3 取消选择
- 点击标签栏中的标签
- 或再次点击已选中的行

### 3.4 确认添加
- 点击顶部 "Add" 按钮
- 弹出确认对话框
- 显示选中人数
- Cancel 关闭，Add 执行添加

## 4. 数据结构

```typescript
interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  isSelected?: boolean;
}
```

## 5. 视觉规范

### 5.1 颜色
- 页面背景：--surface
- 搜索栏背景：--surface-container-lowest
- 选中行：--primary-fixed（浅蓝调）
- 复选框选中填充：--primary
- 复选框未选中边框：--outline
- 在线指示器：--secondary（terracotta）
- 头像背景：--primary-container
- 标签栏 chips：--primary-fixed / --on-primary-fixed
- 添加按钮：--primary / --on-primary

### 5.2 字体
- 标题：headline-md
- 联系人姓名：body-md font-semibold
- 状态文字：label-xs
- 分组标题：label-sm font-semibold primary color

### 5.3 尺寸
- 头像：48px 圆形
- 复选框：24px 圆形
- 在线指示器：12px，带2px白色边框

## 6. 边界情况

- 无联系人：显示空状态
- 搜索无结果：显示空状态图标 + "No contacts found"
- 大量联系人：虚拟滚动（未来）

## 7. 权限控制

- 仅群管理员可进入此页面
