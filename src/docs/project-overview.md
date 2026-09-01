# SuperIM 项目说明清单

> 项目文档总入口，保持轻量；详细规则放在专题文档和页面级规格中。

## 1. 项目简介

- 项目定位：SuperIM 控制台和用户端即时通讯原型。
- 当前阶段：用户端 SuperIM 原型持续迭代，已包含 v2.0 钱包功能原型。
- 默认主题：Equatorial Minimalism。

## 2. 阅读顺序

1. 先阅读本文件，确认项目范围与文档索引。
2. 再按任务阅读专题记忆和主题规范。
3. 最后进入对应原型目录的 `spec.md`、`design.md` 和实现代码。

## 3. 文档索引

| 文档 | 用途 |
|---|---|
| `src/docs/superIM prd v2.0.md` | 钱包功能范围、业务规则和后台配置 |
| `src/docs/secondary-page-navigation.md` | 用户端二级页面顶部导航项目记忆 |
| `src/prototypes/superim-wallet/design.md` | 二级页头盘点及钱包页头落地设计 |
| `src/themes/equatorial-minimalism/DESIGN.md` | 默认主题视觉规范 |
| `src/themes/equatorial-minimalism/globals.css` | 主题 tokens 和公共 utility |
| `src/docs/memory-log.md` | 项目记忆维护日志 |

## 4. 原型索引

- 用户端钱包：`src/prototypes/superim-wallet/`
- 钱包后台：`src/prototypes/superim-admin-wallet/`
- 聊天室和群聊转账入口：`src/prototypes/superim-chatroom/`、`src/prototypes/superim-groupchat/`

## 5. 当前待补事项

- Dynamic Embedded Wallet 正式接入仍待开发阶段实现。
- 钱包真实链路、RPC 和多链能力不属于当前 Mock 原型范围。
