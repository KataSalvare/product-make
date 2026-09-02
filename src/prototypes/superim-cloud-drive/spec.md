# Cloud Drive 首页规格文档

## 📋 业务与功能

### 1.1 页面定位

| 项目 | 内容 |
| --- | --- |
| 页面名称 | Cloud Drive |
| 页面路径 | `/cloud-drive` |
| 页面类型 | 用户端二级页面 / 文件选择器 |
| 目标用户 | 已登录用户 |
| 核心目标 | 集中展示容量、分类、一级文件夹和最近文件，并承载上传、新建文件夹或聊天选文件入口 |

页面包含两种模式：

- **管理模式（默认）**：从 Me 进入，允许上传、新建文件夹和文件管理。
- **Picker 模式**：通过 `/cloud-drive?mode=picker&target=chatroom|group-chat` 进入，只允许浏览、搜索、分类、多选和发送。

### 1.2 功能清单

- **容量概览（Must）**：显示 `3.2 GB of 10 GB used`、进度条和剩余容量。
- **全局搜索（Must）**：按文件名和文件夹名实时搜索，忽略大小写。
- **分类浏览（Must）**：Images、Videos、Audio、Documents、Other，作为紧凑筛选控件展示。
- **文件夹浏览（Must）**：以根目录快捷栏展示一级文件夹和派生文件数量，位于容量摘要之后、文件列表之前。
- **最近文件（Must）**：按 `updatedAt` 倒序展示最近更新文件，并作为首页首屏的主要内容。
- **上传（Must，仅管理模式）**：浏览器多文件选择、批次模拟进度、取消、容量校验。
- **新建文件夹（Must，仅管理模式）**：在根目录创建一级文件夹。
- **更多操作（Must，仅管理模式）**：Header 的 More 打开操作面板，提供 Upload files、New folder、Select files。
- **多选发送（Must，仅 Picker）**：在当前文件列表多选，发送回正式单聊或群聊。

### 1.3 入口与退出

- Me：点击位于 Saved Messages 后的 `Cloud Drive` 进入管理模式。
- 单聊附件：`/cloud-drive?mode=picker&target=chatroom`。
- 群聊附件：`/cloud-drive?mode=picker&target=group-chat`。
- 管理模式 Header 提供返回按钮：有页面历史时执行 `navigate(-1)`，无历史记录时回 `/me`。
- Picker 点击 `Cancel`：返回目标聊天且不传文件；点击 `Send`：按 target 返回并传递所选文件。
- 文件夹卡片点击进入 `/cloud-drive/folder/:folderId`；文件行点击进入 `/cloud-drive/file/:fileId`。
- 预览工具左侧菜单只保留 `云盘首页`；文件夹与文件详情通过首页卡片/文件行进入，避免展示无具体参数的子页面入口。

### 1.4 核心交互

#### 搜索与分类

- 搜索输入框 placeholder：`Search files and folders`。
- 输入后以一个结果区同时展示匹配的 `Folders` 与 `Files`；没有匹配项时显示 `No matching files or folders`。
- 点击分类卡片后显示该类型在所有目录中的文件，Header 标题变为分类名并提供返回首页动作。
- `Documents` 包含 `pdf` 与 `document`；`Other` 包含 `archive` 与 `other`。
- Folders 快捷栏与分类筛选栏保持紧凑分组，避免辅助浏览区块制造大段空白。

#### 上传

- 点击 `Upload` 打开隐藏的 `<input type="file" multiple>`。
- 选择文件的总大小超过剩余容量时阻止整个批次，并 Toast `Not enough storage available`。
- 上传浮层显示单个文件名或批次文件数、进度和 `Cancel`；模拟进度从 0% 到 100%。
- 完成后创建 `CloudFile`，`parentFolderId: null`、`source: 'upload'`，写入 `superim-cloud-drive-state-v1` 并更新容量。
- 取消后不创建文件、不改变已用容量；真实二进制不持久化。

#### 新建文件夹

- 点击 `New Folder` 打开对话框，字段 label 为 `Folder name`，操作为 `Cancel` / `Create`。
- 名称 trim 后需为 1–40 字符；根目录内不区分大小写且不可重复。
- 成功后插入 Folders 区首位并显示 `Folder created`。

#### Picker 多选

- Picker Header 显示 `Cancel`、标题 `Select files` 和 `{count} selected`。
- 文件行显示圆形复选框；点击行切换选择。
- 管理模式可点击 Header `Select` 或 More 面板进入多选；长按或鼠标右键文件行进入多选并立即选中该文件。
- 多选态 Header 标题变为 `Select files` 并显示当前数量；未选择时底部只展示引导文案，不展示不可用的快捷按钮。
- 首页和文件夹页分别维护当前列表的选择集合。
- 底部固定主按钮：未选择时 `Send` 禁用；选择后显示 `Send {count} file(s)`。
- `target=chatroom` 返回 `/chatroom`，`target=group-chat` 返回 `/group-chat`，route state 为 `{ cloudDriveSelection: CloudFile[] }`。
- 缺失 target 时默认返回单聊；`Cancel` 使用浏览历史返回。

---

## 📊 内容规划

### 2.1 信息架构

```text
Cloud Drive
├── Header
│   ├── Back / Cancel
│   ├── Title / selected count
│   └── Upload（管理模式）
├── Search
├── Storage summary
│   ├── Used / total
│   ├── Progress bar
│   └── Remaining storage
├── Folders（root shortcuts）
│   ├── Compact horizontal folder rail
│   └── New Folder（管理模式）
├── Categories（compact filters）
│   └── Images / Videos / Audio / Documents / Other
├── Recent files / Search results / Category results
├── Upload queue（管理模式，有任务时）
└── Picker send bar（Picker 模式）
```

### 2.2 数据来源与状态

- 数据源：PRD 定义的前端 Mock 数据和 LocalStorage `superim-cloud-drive-state-v1`。
- 初始容量：种子文件合计约 3.2 GiB，`totalBytes = 10_737_418_240`。
- 关键实体：`CloudDriveState`、`CloudFile`、`CloudFolder`。
- 视图状态：`mode`、`target`、`query`、`activeCategory`、`selectedIds`、`uploadQueue`、`toast`、`isCreateFolderOpen`。
- 文件夹 `fileCount` 和分类数量从 files 派生，不在 LocalStorage 单独保存。

### 2.3 初始示例内容

| 类型 | 英文示例 |
| --- | --- |
| 文件夹 | `Work`, `Personal`, `Receipts` |
| 图片 | `Launch poster.png` |
| 视频 | `Product demo.mp4`, `Team offsite.mov` |
| 音频 | `Voice note.m4a` |
| 文档 | `Q3 roadmap.pdf` |
| 其他 | `Design assets.zip` |

界面文案使用简洁英文；容量统一显示一位小数，文件列表使用易读单位（KB / MB / GB）。

### 2.4 页面状态与文案

| 状态 | 文案 / 行为 |
| --- | --- |
| 初始化 | 容量卡、分类和列表使用骨架屏 |
| 云盘为空 | `Your Cloud Drive is empty` + 管理模式 `Upload your first file` |
| 无文件夹 | 隐藏空的 Folders 列表；管理模式保留 `New Folder` |
| 搜索无结果 | `No matching files or folders` + `Clear search` |
| 分类为空 | `No {category} files yet` |
| 容量不足 | Toast `Not enough storage available` |
| 上传完成 | Toast `{fileName} uploaded` |
| 上传取消 | 队列项移除，不展示成功 Toast |

---

## 🎨 布局与结构

### 3.1 整体布局

- **布局模式**：移动端单栏；容量为紧凑摘要，Folders 为根目录横向快捷栏，Categories 为紧凑横向筛选，Recent Files 为首屏主列表。
- **基准画布**：`400 × 852`，页面最小高度覆盖视口。
- **Header**：`sticky top-0 z-20`，与现有二级页规范一致；标题 `Cloud Drive` 左对齐。
- **内容边距**：移动端 20px；区块间距遵循 8px 线性比例。
- **Folders 结构**：Folders 使用横向快捷栏，单项保持至少 44px 触控高度，并与分类筛选、文件列表保持连续节奏。
- **底部安全区**：Picker send bar 固定底部，列表预留其高度及设备 safe area。

### 3.2 响应式适配

- **桌面端（≥1200px）**：内容居中，最大宽度 960px；Recent Files 保持可扫描列表。
- **平板端（768–1199px）**：内容最大宽度 720px。
- **移动端（<768px）**：Folders 与 Categories 均使用横向紧凑栏，Recent Files 使用纵向列表，搜索和容量摘要满宽。

---

## 🎨 视觉规范

### 4.1 设计规范来源

**设计规范来源**：主题 `src/themes/equatorial-minimalism`

### 4.2 自定义设计要点

- 容量卡使用 `--primary-container` 作为强调层，进度使用 `--secondary`，但保持文字对比度。
- 文件夹和文件卡使用 `--surface-container-lowest`、`rounded-lg` 与 ambient shadow。
- 分类图标统一使用现有 Lucide 线性图标风格，不使用 emoji 作为正式图标。
- 破坏性动作仅使用 `--error`；Picker 已选状态使用 `--secondary` 描边/勾选。

### 4.3 组件状态

- **默认态**：卡片边框透明，主要信息为 `--on-surface`。
- **悬停态**：桌面端提升 tonal surface 并显示轻微 ambient shadow。
- **聚焦态**：使用清晰的 `--secondary` focus ring。
- **选中态**：文件行显示勾选与强调边框，不能只依赖颜色表达。
- **禁用态**：Picker Send 降低透明度且不可点击。
- **加载态**：骨架和进度动画尊重 `prefers-reduced-motion`。

### 4.4 UI 评审结论

- **信息层级**：文件列表是云盘首页的首要内容；容量降级为摘要，文件夹作为根目录快捷入口紧随其后，分类降级为筛选控件，避免辅助模块遮挡核心文件内容。
- **可发现性**：文件夹卡片和文件行保持完整可点击区域，并通过悬停、聚焦和选中态表达可操作性。
- **文件夹层级**：文件夹不使用大面积卡片；使用 64px 触控高度的列表项展示图标、名称、数量和进入箭头，避免喧宾夺主。
- **交互一致性**：触控长按、桌面右键统一进入同一选择状态，避免出现仅特定设备可用的隐藏操作。
- **操作栏一致性**：Move、Share、Delete 均采用图标在上、文字在下的纵向布局；Share 仅用填充色表达主操作，不改变内部排版。
- **来源信息**：首页不展示 `CHAT` 来源标签；来源仅作为文件详情页的辅助信息，避免在文件列表中引入未经解释的业务标签。
- **移动端栅格**：分类卡按 4 列移动栅格计算宽度，首屏完整展示四张卡，剩余类型通过横向滚动进入。
- **底部安全区**：固定操作栏为内容预留安全区高度，并使用 `env(safe-area-inset-bottom)` 避免遮挡文件列表。
- **可访问性**：图标按钮维持至少 44px 触控区域，文件行提供键盘可点击、焦点环和非颜色选中反馈。
- **视觉约束**：沿用 Equatorial Minimalism 的 Soft Sand、Deep Indigo、Terracotta 令牌，不引入独立的深色或紫色视觉体系。

---

## ♿ 可访问性与验收

- 所有图标按钮提供英文 `aria-label`；文件选择复选框可由键盘操作。
- 搜索框、Create Folder 输入框均有可见 label 或等价辅助文本。
- Toast 使用 `aria-live="polite"`；容量不足使用 `role="alert"`。
- [ ] 管理模式可搜索、分类、进入文件夹、上传和新建文件夹。
- [ ] Picker 只保留浏览/选择/发送，且可正确返回单聊和群聊。
- [ ] 容量、空状态、无结果、上传中、取消和容量不足均可演示。
