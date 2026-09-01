# SuperIM 项目说明清单

> 项目文档总入口，保持轻量；详细规则放在专题文档和页面级规格中。

## 1. 项目简介

- 项目定位：SuperIM 控制台和用户端即时通讯原型。
- 当前阶段：用户端 SuperIM 原型持续迭代，已包含 v2.0 钱包功能原型。
- 默认前端主题：Equatorial Minimalism；后台主题：Ant Design。

## 2. 阅读顺序

1. 先阅读本文件，确认项目范围与文档索引。
2. 先阅读 `src/docs/UI_GUIDELINES.md`，判断工具层、前端内容层或后台内容层。
3. 再按任务阅读对应主题规范和专题记忆。
4. 最后进入对应原型目录的 `spec.md`、`design.md` 和实现代码。

## 3. 文档索引

| 文档 | 用途 |
|---|---|
| `src/docs/superIM prd v2.0.md` | 钱包功能范围、业务规则和后台配置 |
| `src/docs/secondary-page-navigation.md` | 用户端二级页面顶部导航项目记忆 |
| `src/prototypes/superim-wallet/design.md` | 二级页头盘点及钱包页头落地设计 |
| `src/themes/equatorial-minimalism/DESIGN.md` | 默认主题视觉规范 |
| `src/themes/equatorial-minimalism/globals.css` | 主题 tokens 和公共 utility |
| `src/themes/antd-new/DESIGN.md` | 后台 Ant Design 视觉规范 |
| `src/themes/antd-new/theme.ts` | 后台 Ant Design token 入口 |
| `src/docs/UI_GUIDELINES.md` | 三层 UI 边界与页面一致性规则 |
| `src/docs/COMPONENT_GUIDELINES.md` | 组件归属、复用和验收规则 |
| `rules/ui-review-guide.md` | UI 审核维度、证据、严重度和交付门槛 |
| `src/docs/memory-log.md` | 项目记忆维护日志 |

## 4. 原型索引

- 用户端钱包：`src/prototypes/superim-wallet/`
- 钱包后台：`src/prototypes/superim-admin-wallet/`
- 聊天室和群聊转账入口：`src/prototypes/superim-chatroom/`、`src/prototypes/superim-groupchat/`

## 5. 当前待补事项

- SuperIM 登录、注册保持现有 SuperIM 账号体系；用户进入「我的 → 钱包」后才通过 Dynamic Embedded Widget 开通钱包。需要配置 `VITE_DYNAMIC_ENVIRONMENT_ID` 才会启用。
- 钱包绑定使用 SuperIM 当前会话与 Dynamic JWT 双重校验；聊天对象地址查询只依赖 SuperIM 后端会话。交易、充值和签名由 Dynamic SDK 负责。
- 钱包后台原型使用 Mock 数据展示绑定、交易同步、基础设施和审计效果；正式系统再通过 `VITE_SUPERIM_API_BASE_URL` 对接服务端数据。
- Base 网络、Funding 配置和生产环境安全校验仍需在 Dynamic Dashboard 与后端部署阶段完成。
