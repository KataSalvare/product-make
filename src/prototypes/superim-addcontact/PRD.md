# AddContact Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | AddContact |
| **页面路径** | /addcontact |
| **页面类型** | 功能页 |
| **目标用户** | 所有用户 |
| **页面目的** | 添加好友，扩展社交网络 |

### 1.2 页面描述
添加联系人页面，提供多种添加好友的方式，包括用户名搜索、手机号搜索、二维码扫描、通讯录导入等。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
|  ← Add Contact                      |
|  ─────────────────────────────────  |
|  ┌────────────────────────────────┐ |
|  │ 🔍 Search by username or phone │ |
|  └────────────────────────────────┘ |
|                                     |
|  ADD METHODS                        |
|  ┌────────────┐  ┌────────────┐     |
|  │     🔍     │  │     📱     │     |
|  │  Search    │  │   Phone    │     |
|  │  Username  │  │   Search   │     |
|  └────────────┘  └────────────┘     |
|  ┌────────────┐  ┌────────────┐     |
|  │     📷     │  │     👥     │     |
|  │  Scan QR   │  │  Contacts  │     |
|  │   Code     │  │   Import   │     |
|  └────────────┘  └────────────┘     |
|                                     |
|  SEARCH RESULTS                     |
|  ┌────────────────────────────────┐ |
|  │ ┌──┐ Amara Okafor        [+]  │ |
|  │ │AO│ @amara.okafor             │ |
|  │ └──┘                          │ |
|  ├────────────────────────────────┤ |
|  │ ┌──┐ Kwame Nkrumah      [✓]  │ |
|  │ │KN│ @kwame.nkrumah      Friend│ |
|  │ └──┘                          │ |
|  ├────────────────────────────────┤ |
|  │ ┌──┐ Amina Ibrahim    [⏳]  │ |
|  │ │AI│ @amina.ibrahim   Pending│ |
|  │ └──┘                          │ |
|  └────────────────────────────────┘ |
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 搜索栏 | 顶部，最突出的输入区域 |
| 2 | 添加方式 | 2×2网格，四种添加方式 |
| 3 | 搜索结果 | 列表展示匹配的用户 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #fbf9f8 | --surface | 主背景 |
| 搜索栏背景 | #f5f3f3 | --surface-container-low | 搜索区域 |
| 方式图标背景 | 多种 | primary/secondary/tertiary | 区分不同方式 |
| 结果项背景 | #ffffff | --surface-container-lowest | 结果卡片 |
| 添加按钮 | #031631 | --primary | 可添加状态 |
| 已好友 | #6b6b6b | --on-surface-variant | 禁用状态 |
| 等待中 | #944931 | --secondary | 待确认状态 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 页面标题 | Inter | 20px | 600 | 1.2 |
| 分组标题 | Inter | 12px | 500 | 1 | 大写 |
| 方式标签 | Inter | 14px | 500 | 1.2 |
| 用户名 | Inter | 16px | 600 | 1.3 |
| 用户ID | Inter | 14px | 400 | 1.3 |
| 状态文字 | Inter | 12px | 400 | 1 |

#### 尺寸与间距
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 搜索栏高度 | 56px | 标准高度 |
| 方式卡片 | 自适应 | 2列网格 |
| 图标容器 | 48×48px | 圆角12px |
| 结果项高度 | 72px | 固定高度 |
| 头像 | 48×48px | 圆形 |
| 间距 | 16px | 统一间距 |

---

## 3. 交互逻辑

### 3.1 搜索流程
```
输入关键词 → 实时搜索 → 显示结果 → 点击添加/查看
```

### 3.2 添加方式
| 方式 | 点击行为 |
|------|----------|
| Search Username | 聚焦搜索栏，提示输入用户名 |
| Phone Search | 聚焦搜索栏，提示输入手机号 |
| Scan QR Code | 打开相机扫描二维码 |
| Invite Contacts | 请求通讯录权限，显示联系人列表 |

### 3.3 用户状态
| 状态 | 按钮 | 说明 |
|------|------|------|
| none | [+] 添加 | 可添加好友 |
| friend | [✓] Friend | 已是好友，不可点击 |
| pending | [⏳] Pending | 请求已发送，可取消 |

### 3.4 添加好友流程
```
点击[+] → 发送好友请求 → 按钮变为Pending → 对方接受后变为Friend
```

### 3.5 搜索结果
- 实时搜索（防抖300ms）
- 显示头像、姓名、用户名
- 根据状态显示不同按钮
- 点击非按钮区域进入用户详情

### 3.6 清空搜索
- 输入时显示✕按钮
- 点击清空输入框
- 隐藏搜索结果，显示添加方式

---

## 4. 数据结构

### 4.1 搜索结果
```typescript
interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'none' | 'pending' | 'friend';
}
```

### 4.2 添加方式
```typescript
interface AddMethod {
  id: string;
  icon: string;
  label: string;
  color: string;
}
```

### 4.3 页面状态
```typescript
interface AddContactState {
  searchQuery: string;
  results: SearchResult[];
  activeMethod: string | null;
  isSearching: boolean;
}
```

---

## 5. 异常处理

### 5.1 搜索无结果
- 显示"No users found"
- 提示"Try different keywords"

### 5.2 网络错误
- Toast提示"Search failed, please try again"
- 保留上次搜索结果

### 5.3 权限拒绝
- 通讯录权限被拒绝时显示提示
- 提供"Open Settings"按钮
