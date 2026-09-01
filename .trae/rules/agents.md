# 工作流程指南

本文档整合原型/组件开发的全流程，作为各阶段规则的总入口与导航。

## 🧭 总览

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  ① 阅读规范  │ → │  ② 需求对齐  │ → │  ③ 原型设计  │ → │  ④ 开发验收  │
│  与资料准备  │    │   (可选)    │    │  产出 spec   │    │  完成原型    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

## ① 阅读规范与资料

按优先级阅读以下资料：

| 优先级 | 资料 | 说明 |
|--------|------|------|
| 1 | 用户提供的资料 | 设计稿、PRD、数据表、参考链接等 |
| 2 | `.trae/rules/agents.md` | 项目简介、默认主题、总文档入口 |
| 3 | 关联原型/组件 | `src/prototypes/` 或 `src/components/` 中相关实现 |
| 4 | 主题设计系统 | `src/themes/<theme>/DESIGN.md`、`globals.css` |
| 5 | 项目文档 | `src/docs/` 中的业务文档 |

### UI 一致性强制入口

- 先读 [`src/docs/UI_GUIDELINES.md`](../../src/docs/UI_GUIDELINES.md)，确定工具层、前端内容层或后台内容层。
- 前端页面使用 `equatorial-minimalism`；后台页面使用 `antd-new` / `antd@6`；工具层不引入内容主题。
- 组件复用和新建规则见 [`src/docs/COMPONENT_GUIDELINES.md`](../../src/docs/COMPONENT_GUIDELINES.md)。
- UI 审核规则见 [`rules/ui-review-guide.md`](../../rules/ui-review-guide.md)；审核必须记录证据、严重度和处理结论。
- 新页面必须指定同层级参考原型，并在 `spec.md` 记录主题来源、复用组件、状态和响应式行为。
- 不允许仅凭“做得像一点”实现 UI；必须先搜索现有页面和组件，再编码。

## ② 需求对齐（可选）

用户要求时启动，澄清以下事项：

- 页面/组件的核心目标与使用场景
- 内容范围与数据来源
- 视觉风格偏好（或指定主题）
- 交互复杂度与特殊需求
- 交付时间与优先级

> 确认需求后再进入设计阶段，避免返工。

## ③ 原型/组件设计

产出 `spec.md` 规格文档，详见 `rules/design-guide.md`。

**设计阶段核心产出**：
- `spec.md`：功能、内容、布局、视觉规范
- 如需新主题：参考 `rules/theme-guide.md`

## ④ 开发与验收

按 `spec.md` 实现代码，详见 `rules/prototype-development-guide.md`。

**开发阶段核心产出**：
- `index.tsx`：入口组件
- `style.css`：样式文件（如需要）
- 可选子组件目录 `components/`

**验收流程**：
```bash
node scripts/check-app-ready.mjs /prototypes/[原型目录]
# 或
node scripts/check-app-ready.mjs /components/[组件目录]
```

## 📚 规则文档索引

### 阶段规则

| 阶段 | 参考文档 |
|------|----------|
| 设计 | [`rules/design-guide.md`](../../rules/design-guide.md) |
| 开发 | [`rules/prototype-development-guide.md`](../../rules/prototype-development-guide.md) |
| 调试 | [`rules/debugging-guide.md`](../../rules/debugging-guide.md) |
| 主题 | [`rules/theme-guide.md`](../../rules/theme-guide.md) |
| 文档 | [`rules/documentation-guide.md`](../../rules/documentation-guide.md) |
| 记忆沉淀 | [`rules/memory-system-guide.md`](../../rules/memory-system-guide.md) |

### 专项规范

| 规范 | 参考文档 |
|------|----------|
| 原型开发 | [`rules/prototype-guide.md`](../../rules/prototype-guide.md) |
| 组件开发 | [`rules/component-guide.md`](../../rules/component-guide.md) |

### 技能包

| 技能 | 路径 |
|------|------|
| 默认资源推荐 | `skills/default-resource-recommendations/` |
| 第三方技能 | `skills/third-party/` |

## ⚠️ 重要原则

1. **文档与代码同步**
   - 修改代码时，同步更新 `spec.md`
   - 修改 `spec.md` 时，同步更新代码实现

2. **完整阅读资料**
   - 必须仔细阅读用户提供的所有文档
   - 必须查看上下文中提供的相关规则和参考文件

3. **自主完成操作**
   - 不得省略验收流程
   - 批量任务使用子代理并行执行

4. **每次回复结尾带上** `🐱喵`
