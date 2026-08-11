# Cloud Drive File 详情规格文档

## 📋 业务与功能

### 1.1 页面定位

| 项目 | 内容 |
| --- | --- |
| 页面名称 | Cloud Drive File |
| 页面路径 | `/cloud-drive/file/:fileId` |
| 页面类型 | 用户端文件预览与详情页 |
| 目标用户 | 已登录用户 |
| 核心目标 | 根据文件类型提供可信的模拟预览和元数据，并承载下载、重命名、移动、发送和永久删除 |

### 1.2 功能清单

- **类型预览（Must）**：图片、视频、音频、PDF 使用模拟预览；文档、压缩包、其他类型显示图标详情。
- **元数据（Must）**：名称、类型、大小、位置、来源、添加时间、最近更新时间。
- **下载（Must）**：生成同名占位文件，模拟下载反馈。
- **重命名（Must）**：编辑文件名。
- **移动（Must）**：移动到根目录或其他一级文件夹。
- **发送（Must）**：进入转发选择器。
- **永久删除（Must）**：二次确认、立即释放容量、返回云盘首页。

### 1.3 路由与模式

- 管理模式：`/cloud-drive/file/:fileId`。
- Back 使用浏览历史；删除后返回 `/cloud-drive`。
- fileId 不存在时显示 `File not found` 和 `Back to Cloud Drive`，不展示操作按钮。

### 1.4 预览规则

| `CloudFileCategory` | 预览表现 | 交互 |
| --- | --- | --- |
| `image` | 大图容器；无可用资源时回退到文件图标 | 静态模拟预览 |
| `video` | 16:9 封面、播放按钮和时长 | 播放按钮仅作原型展示，不请求真实媒体 |
| `audio` | 文件图标、播放按钮和进度 | 播放按钮仅作原型展示 |
| `document` + PDF MIME | 模拟 PDF 首页面板 | 静态模拟预览 |
| `document` | 大型文档类型图标和 `Preview unavailable` | 不伪造正文内容 |
| `archive` | 压缩包图标和 `Archive preview unavailable` | 不展示文件列表 |
| `other` | 通用文件图标和 `Preview unavailable` | 仅可查看详情/下载/发送 |

预览均为前端 Mock。刷新后若上传文件的临时 Object URL 不可用，必须回退到类型占位，不显示损坏媒体控件。

### 1.5 操作行为

#### Download

- 所有类型均显示 `Download`。
- 点击后使用空 Blob 或静态占位内容创建同名下载，随后释放临时 URL。
- Toast：`Download started`；不得暗示下载的是原始文件内容。

#### Rename

- 点击 `Rename` 打开对话框，输入框默认选中主文件名且保留扩展名。
- trim 后名称不可为空。
- 保存后更新 `name` 与 `updatedAt`，Toast `File renamed`；容量不变。

#### Move

- 点击 `Move` 打开目标 sheet：`Cloud Drive`（根目录）+ 所有一级文件夹。
- 当前所在位置显示勾选且不可再次提交。
- 选择新目标后更新 `parentFolderId` 和 `updatedAt`，Toast `File moved`；容量不变。

#### Send

- 点击 `Send` 跳转 `/forward-message?source=cloud-drive&fileIds=:fileId`。
- `/forward-message` 保留 Saved Messages、Chats、Contacts 等既有目标；发送完成不修改云盘文件。

#### Delete permanently

- 管理模式点击 `Delete` 后显示：`Delete “{fileName}” permanently? This action cannot be undone.`
- 确认按钮为 `Delete permanently`，取消按钮为 `Cancel`。
- 确认后从 files 移除，`usedBytes` 减少该文件 `sizeBytes`，Toast `File deleted permanently`，随后返回原文件夹或云盘首页。

---

## 📊 内容规划

### 2.1 信息架构

```text
Cloud Drive File
├── Header
│   ├── Back
│   ├── File name
│   └── More（管理模式）
├── Preview area
│   └── Type-specific mock preview / fallback icon
├── Primary actions
│   ├── Download
│   ├── Send
│   └── More actions
├── File details
│   ├── Type + MIME
│   ├── Size
│   ├── Location
│   ├── Source
│   ├── Added
│   └── Last modified
├── Rename / Move sheets
├── Permanent delete dialog
└── Not-found state
```

### 2.2 数据来源

- 从 `superim-cloud-drive-state-v1` 的 `files` 按 fileId 读取。
- 文件夹名称通过 `parentFolderId` 关联 `CloudFolder`；`parentFolderId: null` 显示 `Cloud Drive root`。
- `source` 展示映射：`upload → Uploaded`、`chat → Saved from {sourceChat}`。
- 关键页面状态：`isRenameOpen`、`isMoveOpen`、`isDeleteOpen`、`toast`。

### 2.3 元数据文案

| Label | 示例 |
| --- | --- |
| Type | `PDF document` |
| Size | `19.1 MB` |
| Location | `Work` / `Cloud Drive` |
| Source | `Group chat` |
| Added | `Aug 8, 2026 at 10:24 AM` |
| Last modified | `Aug 10, 2026 at 9:15 AM` |

### 2.4 页面状态

| 状态 | 英文文案 / 行为 |
| --- | --- |
| 加载 | 预览区和详情列表显示骨架 |
| 预览不可用 | 按类型显示 `Preview unavailable` 或专用提示 |
| 文件不存在 | `File not found` / `Back to Cloud Drive` |
| 下载 | `Download started` |
| 重名 | `A file with this name already exists here` |
| 删除完成 | `File deleted permanently` 并返回 |
| 操作中资源被删除 | 关闭弹层并进入 File not found 状态 |

---

## 🎨 布局与结构

### 3.1 整体布局

- **布局模式**：移动端单栏；预览区优先，占首屏约 40%–50%，操作区和详情区顺序下排。
- **Header**：`sticky top-0 z-20`，文件名过长时单行截断，完整名称在详情中展示。
- **预览区**：移动端宽度占满内容区；图片/PDF 最大高度受视口约束，音视频控件保证触控尺寸。
- **操作区**：Download 与 Send 为主要动作；Rename、Move、Delete 收入 More 或详情底部。

### 3.2 响应式适配

- **桌面端（≥1200px）**：最大宽度 960px，预览与详情可采用 2:1 双栏；操作区位于详情上方。
- **平板端（768–1199px）**：最大宽度 720px，可维持单栏或窄双栏。
- **移动端（<768px）**：严格单栏；底部动作遵守 safe area，弹层使用 bottom sheet。

---

## 🎨 视觉规范

### 4.1 设计规范来源

**设计规范来源**：主题 `src/themes/equatorial-minimalism`

### 4.2 自定义设计要点

- 预览画布使用 `--surface-container-low`，内容承载卡使用 `--surface-container-lowest`。
- 文件类型图标使用 `--primary`，播放/发送等主操作使用 `--secondary`。
- 详情项以低对比分割线组织，避免每行独立重卡片。
- Delete 始终使用 `--error` 且与普通操作分组，防止误触。

### 4.3 组件状态

- **默认态**：预览控件、主操作和元数据层级清晰。
- **悬停态**：桌面端按钮使用 tonal surface，不移动布局。
- **聚焦态**：播放、翻页、下载和菜单按钮均有可见 focus ring。
- **激活态**：播放按钮切换图标并同步 `aria-pressed`。
- **禁用态**：PDF 首/末页对应翻页按钮禁用；当前位置不可移动。
- **加载态**：避免布局跳动，预览区保留固定最小高度。

---

## ♿ 可访问性与验收

- 媒体模拟控件具备可读 label；播放状态和 PDF 页码通过辅助文本同步。
- 图片预览使用文件名作为 alt；纯装饰缩略图使用空 alt。
- Dialog / Sheet 打开后管理焦点，Escape 可关闭非破坏性弹层。
- [ ] 七类文件均有明确预览或 fallback 表现。
- [ ] Download、Rename、Move、Send、Delete 的成功/异常反馈完整。
- [ ] 删除准确释放容量并返回来源目录，重命名/移动/发送不影响容量。
