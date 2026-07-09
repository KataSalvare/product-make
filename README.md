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
- **快捷键配置**: 可自定义快捷键，支持复制到 Figma、查看文档等操作
- **复制到 Figma**: 一键将当前页面复制到 Figma（HTML to Design）
- **主题管理**: 动态读取 `src/themes` 中的设计系统主题，支持预览主题组件和查看设计规范
- **文档管理**: 动态读取 `src/docs` 中的 Markdown 文档

### 快捷键

| 功能 | 默认快捷键 (Mac) | 默认快捷键 (Windows) |
|------|-----------------|---------------------|
| 复制到 Figma | Ctrl+Cmd+C | Ctrl+Alt+C |
| 查看文档 | Ctrl+Cmd+E | Ctrl+Alt+E |

## 项目结构

```
src/
├── App.tsx                 # 主应用组件，包含路由和全局状态
├── main.tsx               # 应用入口
├── index.css              # 全局样式
├── prototypes/            # 页面原型组件
├── themes/                # 主题设计系统
├── docs/                  # 项目文档
│   └── *.md               # Markdown 文档
└──  components/            # 公共组件
```

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
