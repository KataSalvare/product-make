# 原型开发指南

本文档约束原型（prototypes）开发的专项规范，聚焦页面级原型的特殊要求。

## 📁 目录结构

```
src/prototypes/<name>/
├── index.tsx          # 必需：入口组件
├── spec.md            # 必需：规格文档
├── style.css          # 可选：样式文件
├── hack.css           # 可选：人工修复样式（AI 不应修改）
├── PRD.md             # 可选：需求文档
└── components/        # 可选：内部子组件
    └── SubComponent.tsx
```

- `<name>` 使用 `kebab-case`，如 `user-profile`、`admin-dashboard`
- 目录名建议加 `demo-` 前缀用于示例原型，如 `demo-register`

## 📝 规格文档（spec.md）

### 生成时机

设计方案确认后立即产出，使用模板：`src/docs/templates/spec-template.md`

### 必需内容

```markdown
# [页面名称]

## 业务与功能
- 页面定位与核心目标
- 功能清单
- 交互要点

## 内容规划
- 信息架构与模块划分
- 数据来源与关键字段
- 示例内容

## 布局与结构
- 整体布局模式
- 关键尺寸与模块比例
- 响应式适配策略

## 视觉规范
- 设计规范来源
- 自定义设计要点
- 组件状态定义
```

## 🧩 入口组件（index.tsx）

### 文件头注释

```typescript
/**
 * @name [中文显示名]
 *
 * [可选：简短描述]
 */
```

- `@name` 必须存在，且为中文显示名

### 路由注册

页面需在 `src/App.tsx` 中注册路由，或遵循自动路由约定。

当前项目使用自动路由：按目录名自动映射路径。

- 前端页面：路径不含 `admin`
- 后台页面：路径包含 `admin`

### 依赖规范

- React 与 Hooks 从 `react` 导入
- 第三方库按需导入，新增依赖需同步安装
- 使用 Tailwind 时必须导入 `style.css`

## 🎨 样式文件（style.css）

### 必需内容

```css
@import "tailwindcss";
```

### 可选内容

- 页面级自定义样式
- 动画定义
- 覆盖主题变量

## 🔗 PRD 关联

如存在 `PRD.md`，`spec.md` 应引用 PRD 中的需求编号或章节。

## ✅ 验收清单

- [ ] `index.tsx` 与 `spec.md` 完整存在
- [ ] 顶部包含 `@name` 注释
- [ ] 样式文件包含 `@import "tailwindcss";`
- [ ] `check-app-ready.mjs` 验收通过
- [ ] 文档与代码同步更新
