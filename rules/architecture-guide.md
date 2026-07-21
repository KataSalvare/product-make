# 架构分层指南

本文档约束项目 `src/`（内容层）与 `tools/`（工具层）的职责边界、引用规范与动态导入路径，确保两层在持续迭代中不会重新混在一起。

## 1. 分层目标

- **内容层 `src/`**：只放业务/原型相关内容。修改内容层时，不应关心预览工具如何实现。
- **工具层 `tools/`**：只放原型预览工具。修改工具层时，不应替内容层做业务决策。
- 两层通过明确的 alias 和接口隔离，降低单文件复杂度，方便多人协作和后续扩展。

## 2. 目录职责

### 内容层 `src/`

| 目录 | 职责 | 示例 |
|------|------|------|
| `src/prototypes/` | 页面原型组件 | `demo-login/index.tsx` |
| `src/themes/` | 主题设计系统 | `linear/DESIGN.md`、`linear/index.tsx` |
| `src/docs/` | 项目 Markdown 文档 | `demo.md` |
| `src/workspace/` | 4 个 Tab 内容页面 | `HomePage.tsx`、`ThemesListPage.tsx` |
| `src/content/` | 项目内容配置 | `annotations/categories.ts`、`annotations/defaults.ts` |
| `src/components/ui/` | 通用 UI 组件 | `button.tsx`、`input.tsx`、`dialog.tsx` |
| `src/common/` | 内容层共享组件 | `DesignMdBatchShowcase.tsx` |
| `src/lib/` | 通用工具函数 | `utils.ts`（`cn` 等） |
| `src/assets/` | 静态资源 | `hero.png` |
| `src/resources/` | 项目资料与运行时数据 | `annotations.json` |

### 工具层 `tools/`

| 目录 | 职责 | 示例 |
|------|------|------|
| `tools/App.tsx` | 路由编排与全局状态组合 | 主应用组件 |
| `tools/shell/` | 界面外壳 | `Sidebar.tsx`、`Topbar.tsx` |
| `tools/tools/` | 工具功能实现 | `AnnotationController.tsx`、`ShortcutsDialog.tsx` |
| `tools/components/` | 工具专属组件 | `DocDrawer.tsx`、`AnnotationLayer.tsx` |
| `tools/hooks/` | 工具层 Hooks | `useAnnotations.ts` |
| `tools/config/` | 动态导入与工具配置 | `pages.ts`、`themes.ts`、`docs.ts` |
| `tools/lib/` | 工具函数 | `annotations.ts`、`shortcuts.ts` |

## 3. import 规范

### 绝对 alias

- `@/...` 始终指向 `src/`
- `@tools/...` 始终指向 `tools/`

### 跨层引用规则

| 场景 | 正确写法 | 说明 |
|------|----------|------|
| 工具层引用内容层 | `import { HomePage } from '@/workspace/HomePage'` | 工具层可以依赖内容层 |
| 内容层引用工具层 | 尽量避免 | 内容层应保持独立，不依赖预览工具 |
| 内容层引用通用 UI | `import { Button } from '@/components/ui/button'` | UI 组件属于共享基础层 |
| 工具层引用通用 UI | `import { Button } from '@/components/ui/button'` | 工具层允许使用通用 UI |
| 工具层内部互相引用 | `import { ... } from '../config/pages'` 或 `@tools/config/pages` | 均可，优先保持清晰 |

### 禁止事项

- 禁止在 `src/` 中使用相对路径 `../tools/...` 引用工具层
- 禁止在 `tools/` 中使用 `../src/...` 引用内容层，统一用 `@/...`
- 禁止把批注、快捷键、复制到 Figma 等工具实现放到 `src/`
- 禁止把原型页面、主题、文档放到 `tools/`

## 4. 动态导入路径

`import.meta.glob` 不支持 alias，必须使用相对路径。文件在 `tools/config/` 下，目标内容在 `src/` 下，因此路径统一写成：

```ts
// tools/config/pages.ts
const allModules = import.meta.glob('../../src/prototypes/*/index.tsx', { eager: true })

// tools/config/themes.ts
export const themeModules = import.meta.glob('../../src/themes/*/index.tsx')
export const themeDesignDocs = import.meta.glob('../../src/themes/*/DESIGN.md', { query: '?raw', import: 'default' })

// tools/config/docs.ts
export const docModules = import.meta.glob('../../src/docs/*.md', { query: '?raw', import: 'default' })
```

### key 匹配规则

glob 返回的 key 包含 `../../src/` 前缀，后续正则或字符串匹配必须同步更新：

```ts
// 错误：path.match(/\.\.\/themes\/([^/]+)\//)
// 正确：
path.match(/\.\.\/\.\.\/src\/themes\/([^/]+)\//)
```

## 5. 新增功能决策树

新增功能或文件时，按以下顺序判断归属：

```text
是否是用户可见的原型页面？
  ├─ 是 → 放入 src/prototypes/<name>/
  ├─ 否 → 是否是主题设计系统？
    ├─ 是 → 放入 src/themes/<theme-key>/
    ├─ 否 → 是否是项目文档？
      ├─ 是 → 放入 src/docs/
      ├─ 否 → 是否是内容配置（如批注数据、默认分类）？
        ├─ 是 → 放入 src/content/
        ├─ 否 → 是否是通用 UI 组件？
          ├─ 是 → 放入 src/components/ui/
          ├─ 否 → 是否服务于预览工具（路由、外壳、批注、快捷键、Figma 复制）？
            ├─ 是 → 放入 tools/ 对应子目录
            └─ 否 → 重新评估是否必要，或与用户确认
```

## 6. 常见错误

| 错误 | 后果 | 修正 |
|------|------|------|
| `tools/config/*.ts` 中 glob 路径仍为 `../prototypes/` | 页面/主题/文档列表为空 | 改为 `../../src/prototypes/` |
| 正则匹配未同步 `../../src/` 前缀 | 导航或详情页找不到对应资源 | 正则同步更新 |
| 工具组件放到 `src/components/` | 内容层依赖工具层，破坏隔离 | 移到 `tools/components/` |
| 原型页面引用 `tools/lib/annotations` | 内容层反向依赖工具层 | 改为引用 `src/content/annotations/` 或保持独立 |
| UI 组件放在 `tools/components/ui/` | 内容层无法使用通用 UI | 移到 `src/components/ui/` |

## 7. 重构或迁移时的检查点

- [ ] 文件目录是否符合「内容层 vs 工具层」定义
- [ ] `import.meta.glob` 路径是否正确指向 `src/`
- [ ] key 匹配正则是否包含 `../../src/` 前缀
- [ ] 跨层 import 是否使用 `@/` 或 `@tools/`
- [ ] 是否有 `src/` 文件直接 import `tools/` 的反向依赖
- [ ] `vite.config.ts` 和 `tsconfig.app.json` 的 alias 是否同步
- [ ] 运行 `npm run lint`、`npx tsc --noEmit`、`npx vite build` 是否全部通过
