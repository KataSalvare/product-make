# 产品原型预览系统

基于 React + TypeScript + Vite 构建的产品原型预览脚手架，用于产品经理和 UI 设计师快速预览和展示页面原型。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: React Router
- **样式**: Tailwind CSS
- **图标**: Lucide React

## 功能特性

### 全局功能

- **主题切换**: 支持白天/黑夜模式切换，默认黑夜模式，设置自动保存到 localStorage
- **自定义项目名称**: 点击左上角项目名称即可编辑，支持 Enter 确认、Escape 取消
- **设备预览切换**: 支持移动端/PC端预览模式切换
- **快捷键配置**: 可自定义快捷键，支持复制到 Figma、查看文档、批注选择元素等操作
- **复制到 Figma**: 一键将当前页面复制到 Figma（HTML to Design）
- **主题管理**: 动态读取 `src/themes` 中的设计系统主题，支持预览主题组件和查看设计规范
- **文档管理**: 动态读取 `src/docs` 中的 Markdown 文档
- **侧边栏折叠**: 顶部操作栏可一键折叠/展开左侧菜单栏，折叠后完全隐藏

### 页面批注

- **批注编辑模式**: 点击顶部「批注」按钮进入编辑模式，可对当前页面添加、编辑、删除批注
- **元素选择**: 进入编辑模式后点击「选择元素」，再点击页面元素即可添加批注；支持快捷键触发
- **分类管理**: 默认分类为「交互说明」、「业务逻辑」、「状态说明」，支持新增自定义分类（默认分类不可删除）
- **批注展示**: 支持显示/隐藏页面上的批注标记，可点击标记或右侧文档面板查看详情
- **草稿机制**: 新建、编辑、删除批注后先保存到本地草稿，点击「保存」后才会写入本地文件
- **多分类批注**: 同一元素可添加多个分类的批注，批注弹窗以标签页形式切换查看

### 快捷键

| 功能 | 默认快捷键 (Mac) | 默认快捷键 (Windows) |
|------|-----------------|---------------------|
| 复制到 Figma | Ctrl+Cmd+C | Ctrl+Alt+C |
| 查看文档 | Ctrl+Cmd+E | Ctrl+Alt+E |
| 批注选择元素 | Ctrl+Cmd+S | Ctrl+Alt+S |

## 项目结构

```
src/                        # 内容层：只放业务/原型相关内容
├── main.tsx                # 应用入口
├── index.css               # 全局样式
├── prototypes/             # 页面原型组件（前端原型 + 后台原型）
├── themes/                 # 主题设计系统
├── docs/                   # 项目文档（Markdown）
├── workspace/              # 4 个 Tab 内容页面
│   ├── HomePage.tsx        # 默认首页/引导页
│   ├── ThemeDetailPage.tsx # 主题详情
│   ├── ThemesListPage.tsx  # 主题列表
│   ├── DocDetailPage.tsx   # 文档详情
│   └── DocsListPage.tsx    # 文档列表
├── content/                # 项目内容配置
│   └── annotations/        # 批注默认分类与示例数据
│       ├── categories.ts
│       └── defaults.ts
├── common/                 # 内容层共享组件（如 DesignMdBatchShowcase）
├── components/ui/          # 通用 UI 组件（Button、Input 等）
└── lib/                    # 通用工具函数
    └── utils.ts            # cn 等 UI 工具函数

tools/                      # 工具层：原型预览工具实现
├── App.tsx                 # 主应用组件，负责路由、全局状态和布局编排
├── shell/                  # 界面外壳
│   ├── Sidebar.tsx         # 左侧边栏（4 个 Tab 导航）
│   ├── Topbar.tsx          # 顶部工具栏
│   └── TooltipButton.tsx   # 工具提示按钮
├── tools/                  # 工具功能实现
│   ├── AnnotationController.tsx   # 批注状态、渲染与交互
│   └── ShortcutsDialog.tsx        # 快捷键设置弹窗
├── components/             # 工具组件
│   ├── DocDrawer.tsx
│   ├── AnnotationLayer.tsx
│   ├── AnnotationModal.tsx
│   └── AnnotationPanel.tsx
├── hooks/                  # 工具层 Hooks
│   └── useAnnotations.ts
├── config/                 # 工具层配置与动态导入
│   ├── pages.ts
│   ├── themes.ts
│   └── docs.ts
└── lib/                    # 工具函数
    ├── shortcuts.ts        # 主题、快捷键、项目名称 localStorage 读写
    └── annotations.ts      # 批注类型与工具函数
```

> **架构说明**：
> - `src/` 只放**内容层**（原型、主题、文档、页面、内容配置、通用 UI）
> - `tools/` 只放**工具层**（预览外壳、批注、快捷键、复制到 Figma、配置读取等）
> - 两层通过 alias 隔离：`@/...` 指向 `src/`，`@tools/...` 指向 `tools/`
> - 迭代功能时，一看 import 路径就知道改动发生在内容层还是工具层

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 配置说明

### 本地存储键名

- `prototype-theme`: 主题设置（light/dark）
- `prototype-project-name`: 自定义项目名称
- `prototype-shortcuts`: 快捷键配置

## License

MIT
