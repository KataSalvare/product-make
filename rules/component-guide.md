# 组件开发指南

本文档约束公共组件（components）开发的专项规范，聚焦可复用 UI 组件的特殊要求。

## 📁 目录结构

```
src/components/<name>/
├── index.tsx          # 必需：入口组件
├── spec.md            # 必需：规格文档
├── style.css          # 可选：样式文件
└── components/        # 可选：内部子组件
    └── SubComponent.tsx
```

- `<name>` 使用 `PascalCase`，如 `AdminSidebar`、`DataTable`
- 与原型目录区分：组件目录使用大驼峰命名

## 📝 规格文档（spec.md）

### 生成时机

组件设计确认后立即产出。

### 必需内容

```markdown
# [组件名称]

## 功能定义
- 组件职责与使用场景
- 支持的功能特性

## Props 接口
| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| ...  | ...  | ...  | ...    | ...  |

## 使用示例
```tsx
<ComponentName prop1="value" />
```

## 视觉规范
- 尺寸与间距
- 状态样式（默认/悬停/聚焦/禁用）
- 主题适配
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

### Props 设计原则

- 优先使用可选属性，提供合理的默认值
- 支持 `className` 透传，便于外部扩展样式
- 事件回调使用标准命名：`onClick`、`onChange`、`onSubmit` 等
- 复杂配置使用对象类型，避免过多独立属性

### forwardedRef 支持

需要获取 DOM 引用的组件，应使用 `React.forwardRef`：

```tsx
import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn('base-class', className)} {...props} />
  }
)
Input.displayName = 'Input'
```

## 🎨 样式规范

### Tailwind 使用

- 优先使用 Tailwind 工具类
- 复杂样式抽取到 `style.css`
- 支持主题变量：`var(--background)`、`var(--foreground)`

### 状态样式

必须处理以下状态：

| 状态 | 说明 |
|------|------|
| 默认 | 正常显示 |
| 悬停（hover） | 鼠标悬停 |
| 聚焦（focus） | 键盘聚焦 |
| 禁用（disabled） | 不可用状态 |
| 加载（loading） | 异步操作中 |

## ♻️ 复用原则

- 优先使用现有主题组件：`src/themes/<theme>/components/`
- 优先使用 shadcn/ui 组件：`src/components/ui/`
- 避免重复造轮子

## ✅ 验收清单

- [ ] `index.tsx` 与 `spec.md` 完整存在
- [ ] 顶部包含 `@name` 注释
- [ ] Props 接口完整，有使用示例
- [ ] 支持 `className` 透传
- [ ] 处理了必要的状态样式
- [ ] `check-app-ready.mjs` 验收通过
