# 原型开发与验收指南

用于 `src/prototypes/<name>/` 下的原型实现、局部修改、多页面组织和预览验收。主题创建、派生和主题页验收优先看 `rules/theme-guide.md`。

开发流程：

```text
读取已确认需求和设计决策 -> 修改原型目录内代码 -> 运行验收脚本 -> 按错误信息修复 -> 重新验收
```

## 实现边界

- 一个原型目录就是主要隔离边界，页面组件、样式和素材优先留在对应原型目录内。
- 不为单个原型随意修改 `src/common/`、全局主题或共享工具。
- 多步骤或高风险修改先拆成短任务，逐项处理并维护当前状态。
- 一次只处理一个明确问题；遇到构建、运行或验收失败，先定位原因再继续。
- 完成后必须通过预览验收；纯视觉、文案、布局和素材调整不要求测试驱动。

## 文件结构与命名

```text
src/prototypes/<name>/
├── index.tsx      # 必需
├── style.css      # 可选
├── components/    # 可选：原型内部共享组件
├── pages/         # 可选：多页面原型页面组件
├── docs/          # 可选：目录 Markdown 文档
└── assets/        # 可选：原型专属素材
```

- 原型入口文件必须是 `index.tsx`。
- 原型目录名使用小写字母、数字、连字符，如 `order-review`。
- 当目录名为 `untitled`、`untitled-*` 或显示名为「未命名」时，开始生成实际内容前应更新为有意义的目录名和 `@name`。
- 本项目当前不产出独立 `components` 资源；原型内部组件放在对应原型目录下的 `components/`。
- 原型目录文档放在当前原型的 `docs/` 下，例如 `src/prototypes/order-review/docs/prd-03-status.md`。

每个原型的 `index.tsx` 顶部建议包含面向用户的中文 `@name`，用于预览列表展示名：

```typescript
/**
 * @name 评审工作台
 */
```

## 多页面原型

单个原型可以包含多个页面，通过 URL hash 参数 `#page=<pageId>` 定位：

```text
/prototypes/express-app/#page=home
/prototypes/express-app/#page=detail
```

多页面仍属于同一个原型目录；页面组件放在原型内部的 `pages/`，跨页面共享组件放在原型内部的 `components/`。

使用公共 hook `src/common/useHashPage.ts`：

```typescript
import { useHashPage } from '../../common/useHashPage';

export default function MyApp() {
    const { page, setPage } = useHashPage('home');
    // page === 'home' | 'detail' | ...
}
```

- `pageId` 命名使用小写字母、数字、连字符。
- 不带 `#page=` 时自动使用 `defaultPage`。
- 此路由完全在原型内部，不影响构建。

参考实现：`src/prototypes/ref-app-home/index.tsx`。

## 弹窗（Modal/Overlay）开发规范

原型页面中的弹窗（含遮罩）必须使用**手写 `div` overlay 方式**，禁止使用 `@/components/ui/dialog` 等基于 Portal 的弹窗组件。原因如下：

- 弹窗作为页面 DOM 的子节点，元素选择器（`.selector` 或 `#id`）才能正确选中弹窗内的元素进行批注
- `data-overlay` 属性让批注层正确识别 overlay，控制弹窗内外元素的标注可见性
- `absolute` 定位相对于页面容器，不会因 Portal 导致层级或定位参考系错乱

统一模板：

```tsx
const [showModal, setShowModal] = useState(false)

return (
  <div className="relative w-full min-h-full ...">
    {/* 页面内容 */}

    {/* 弹窗 */}
    {showModal && (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
        data-overlay="<唯一标识>"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowModal(false)
        }}
      >
        <div className="w-full max-w-[xxxpx] bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{/* 弹窗标题 */}</h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
          {/* 弹窗内容 */}
        </div>
      </div>
    )}
  </div>
)
```

关键规则：

1. 页面外层容器必须有 `relative` 类名，确保 `absolute inset-0` 的弹窗遮罩覆盖整个页面。
2. 遮罩 `div` 必须包含 `data-overlay="<唯一标识>"` 属性，值在整个项目内唯一（如 `feature-detail`、`profile-edit`、`notice-detail`、`order-detail`）。
3. 点击遮罩关闭弹窗通过 `onClick` 判断 `e.target === e.currentTarget` 实现。
4. 弹窗卡片容器使用 `rounded-2xl shadow-2xl`、`max-w-[xxxpx]` 统一外观。
5. 顶部关闭按钮使用 `lucide-react` 的 `X` 图标。
6. 多个弹窗（如列表中的多个条目）使用单个 `useState` 跟踪当前打开项，而非为每个条目创建独立的 Dialog 组件。

参考实现：`src/prototypes/demo-login 20-22-24-906/index.tsx`、`src/prototypes/demo-home/index.tsx`、`src/prototypes/demo-admin-orders/index.tsx`。

## 依赖与样式

- React 与 Hooks 直接从 `react` 导入。
- 第三方库按需导入，新增依赖必须同步更新 `package.json`。
- 使用 Tailwind CSS V4 时，入口样式文件需包含：

```css
@import "tailwindcss";
```

- 使用主题 CSS Variables 时，按所选 `DESIGN.md` 和主题规则引入，不复制另一套 token。

## 验收流程

运行原型验收脚本：

```bash
node scripts/check-app-ready.mjs /prototypes/[原型目录]
```

关键返回字段：

- `status`: `READY` / `ERROR` / `TIMEOUT`。
- `targetUrl`: 本次验收目标地址。
- `errors`: 构建、运行时或页面加载错误列表。

错误处理：

- `ERROR`：按 `errors` 修复后重新执行验收脚本，直到通过。
- `TIMEOUT`：优先排查 dev server 启动、端口、长任务和运行时阻塞。
- 修复时先处理构建、启动和运行时报错，再处理交互与视觉问题；一次只修一个明确问题，修完重新验收。

## 最小清单

- [ ] `index.tsx` 完整存在。
- [ ] `index.tsx` 顶部有清晰的 `@name`。
- [ ] 占位原型已更新为有意义的目录名和显示名。
- [ ] 新增依赖已写入 `package.json`。
- [ ] `check-app-ready.mjs` 原型验收通过。
