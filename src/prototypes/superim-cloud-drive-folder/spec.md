# Cloud Drive Folder 规格文档

## 📋 业务与功能

### 1.1 页面定位

| 项目 | 内容 |
| --- | --- |
| 页面名称 | Cloud Drive Folder |
| 页面路径 | `/cloud-drive/folder/:folderId` |
| 页面类型 | 用户端二级文件列表页 / Picker 子页面 |
| 目标用户 | 已登录用户 |
| 核心目标 | 浏览一个一级文件夹中的文件，并完成排序、单选/多选、移动、发送和永久删除 |

文件夹仅允许一级结构。本页不展示文件夹子节点，也不提供 `New Folder`；文件只能在当前文件夹、其他一级文件夹和根目录之间移动。

### 1.2 功能清单

- **文件列表（Must）**：展示当前 folderId 对应文件夹中的全部文件。
- **排序（Must）**：支持 Newest first、File name、Largest first。
- **文件预览（Must）**：点击文件进入 `/cloud-drive/file/:fileId`。
- **单文件操作（Must，管理模式）**：点击文件进入详情页后执行 Rename、Move、Send、Delete permanently。
- **多选模式（Must，管理模式）**：Select All、Move、Send、Delete permanently。
- **Picker 多选（Must）**：在当前文件夹多选，确认后返回目标聊天。

### 1.3 模式与路由约定

- 管理模式路由：`/cloud-drive/folder/:folderId`。
- Picker 路由：`/cloud-drive/folder/:folderId?mode=picker&target=chatroom|group-chat`。
- 管理模式点击文件进入详情页；Picker 模式点击文件行切换选择。
- folderId 不存在时显示 `Folder not found` 与 `Back to Cloud Drive`，不自动创建数据。

### 1.4 交互要点

#### 浏览与排序

- Header 显示返回按钮和文件夹名称；右侧为 Sort 与 Select（Picker 下不显示 Select 按钮，因为列表始终可选）。
- 默认排序：`Date · Newest first`，使用 `updatedAt` 降序。
- Sort sheet 选项：`Newest first`, `File name`, `Largest first`。
- 排序只改变视图，不修改文件 `updatedAt` 或持久化顺序。

#### 单文件操作

- 管理模式点击文件主体进入 `/cloud-drive/file/:fileId`，由详情页提供 Rename、Move、Send、Download 和 Delete。

#### 管理模式多选

- 点击 Header `Select` 或文件菜单 `Select` 进入多选。
- 管理模式长按或鼠标右键文件行也会进入多选，并立即选中被触发文件。
- Header 变为关闭按钮；每行左侧显示复选框，底部显示 `{count} selected`。
- 底部固定操作栏：`Move`、`Send`、`Delete`；未选择文件时均禁用。
- `Move` 对全部已选文件执行同一目标移动，成功后 Toast `Moved {count} files` 并退出多选。
- `Send` 将所选文件一并传给 `/forward-message`；不改变文件位置或容量。
- `Delete` 显示 `Delete {count} files permanently? This action cannot be undone.`；确认后一次性删除并按 sizeBytes 总和释放容量。
- 点击关闭按钮退出多选并清空 selectedIds。

#### Picker 模式

- 不展示 Rename、Move、Delete 或管理模式 Select 按钮。
- 文件行直接显示选择框，点击主体切换选择。
- 底部 Send 使用当前文件夹的 selectedIds。
- 点击 Send 后按 target 返回 `/chatroom` 或 `/group-chat`，传递 `{ cloudDriveSelection: CloudFile[] }`。

---

## 📊 内容规划

### 2.1 信息架构

```text
Cloud Drive Folder
├── Header
│   ├── Back / Close selection
│   ├── Folder name / selected count
│   └── Sort + Select / Select all
├── Sort summary
├── File list
│   ├── Selection control（多选/Picker）
│   ├── Type thumbnail
│   ├── Name + size + updated time
│   └── File metadata
├── Empty / not-found state
└── Batch action bar / Picker send bar
```

### 2.2 数据来源与派生规则

- 从 LocalStorage `superim-cloud-drive-state-v1` 读取 `CloudDriveState`。
- 当前文件夹：`folders.find(folder => folder.id === folderId)`。
- 当前文件：`files.filter(file => file.parentFolderId === folderId)`。
- 关键页面状态：`sortMode`、`isSelecting`、`selectedIds`、`dialogState`、`toast`。
- 文件移动、重命名和删除后立即持久化；排序偏好仅保留在当前页面内。

### 2.3 文件行内容

| 字段 | 展示规则 |
| --- | --- |
| name | 单行截断，完整名称通过 title/辅助文本可读 |
| type | 对应图片缩略图或类型图标 |
| sizeBytes | 格式化为 KB / MB / GB |
| updatedAt | 最近 7 天显示相对日期，其余显示 `MMM D, YYYY` |
| source | 列表不突出展示，详情页展示 |

### 2.4 空状态与反馈

| 状态 | 英文文案 |
| --- | --- |
| 空文件夹（管理） | `This folder is empty` / `Move files here from Cloud Drive` |
| 空文件夹（Picker） | `No files to select in this folder` |
| 文件夹不存在 | `Folder not found` / `Back to Cloud Drive` |
| 移动完成 | `Moved to {destination}` 或 `Moved {count} files` |
| 删除完成 | `File deleted permanently` 或 `{count} files deleted permanently` |
| 操作目标已不存在 | `This file is no longer available`，关闭菜单并刷新列表 |

---

## 🎨 布局与结构

### 3.1 整体布局

- **布局模式**：移动端单栏文件列表；每行最小高度 64px。
- **Header**：`sticky top-0 z-20`；管理模式右侧操作不超过两个，次要选项收入 sheet。
- **列表边距**：移动端左右 20px；行间使用低对比分割线而非重卡片堆叠。
- **底部栏**：多选/Picker 时固定底部，预留 safe area 和列表 padding。

### 3.2 响应式适配

- **桌面端（≥1200px）**：最大宽度 960px；文件列表保持单列，操作按钮可直接展示文字标签。
- **平板端（768–1199px）**：最大宽度 720px，单列列表。
- **移动端（<768px）**：文件信息优先，次要元数据截断；批量动作使用图标 + 短标签。

---

## 🎨 视觉规范

### 4.1 设计规范来源

**设计规范来源**：主题 `src/themes/equatorial-minimalism`

### 4.2 自定义设计要点

- Header 标题使用 `text-headline-md` 和 `--primary`。
- 文件行使用 `--surface-container-lowest`；分割线使用 `--outline-variant`。
- 选中控制使用 `--secondary`；永久删除按钮使用 `--error`。
- Bottom sheet 使用 `rounded-t-xl`、ambient shadow 和清晰的遮罩层。

### 4.3 组件状态

- **默认态**：文件行可点击区域和更多按钮互不重叠。
- **悬停态**：桌面端使用 `--surface-container-low`。
- **聚焦态**：行、复选框和菜单项均有可见 focus ring。
- **选中态**：复选框勾选，同时文件行有轻量 tonal background。
- **禁用态**：无选择时批量按钮禁用；移动目标为当前位置时禁用。
- **加载态**：Header 和 5 条文件行骨架。

---

## ♿ 可访问性与验收

- More、Preview、Sort、Select all 均提供英文 `aria-label`。
- 对话框打开后锁定焦点，关闭后焦点返回触发元素。
- 删除确认必须明确数量和不可恢复，不允许仅用图标表达危险操作。
- [ ] Newest/File name/Largest 三种排序正确。
- [ ] 单文件和批量 Move/Send/Delete 行为与容量变化正确。
- [ ] Picker 不暴露管理动作，多选与返回 state 正确。
- [ ] 空文件夹、资源不存在和文件被移除状态可演示。
