# PostDetail Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | PostDetail |
| **页面路径** | /postdetail |
| **页面类型** | 内容页 |
| **目标用户** | 所有用户 |
| **页面目的** | 查看动态详情和评论 |

### 1.2 页面描述
动态详情页面，展示单条动态的完整内容，包括作者信息、文字内容、图片、互动数据，以及评论列表和评论输入功能。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
|  ← Post Detail              ⋮       |
|  ─────────────────────────────────  |
|  ┌──┐ Amara Okafor         •••     |
|  │AO│ 2 hours ago                   |
|  └──┘                               |
|                                     |
|  Beautiful sunset at the beach      |
|  today! 🌅 Nothing beats the view   |
|  from Lagos coast...                |
|                                     |
|  ┌─────────┐ ┌─────────┐           |
|  │         │ │         │           |
|  │  Image  │ │  Image  │           |
|  │    1    │ │    2    │           |
|  │         │ │         │           |
|  └─────────┘ └─────────┘           |
|                                     |
|  ❤️ 24    💬 5    ↗️    🔖          |
|  ─────────────────────────────────  |
|                                     |
|  COMMENTS (5)                       |
|  ┌──┐ Kwame Asante                  |
|  │KN│ Absolutely stunning! 🌅       |
|  └──┘ 1 hour ago  ❤️ 8              |
|                                     |
|  ┌──┐ Chioma Nnamdi                 |
|  │CN│ The colors are incredible!    |
|  └──┘ 45 min ago  ❤️ 5              |
|       ┌──┐ Amara Okafor             |
|       │AO│ Thank you Chioma!        |
|       └──┘ 30 min ago               |
|                                     |
|  ─────────────────────────────────  |
|  ┌────────────────────────────────┐ |
|  │ 💬 Add a comment...        😊  │ |
|  └────────────────────────────────┘ |
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 动态头部 | 作者头像、名字、时间、菜单 |
| 2 | 动态内容 | 文字、图片网格 |
| 3 | 互动栏 | 点赞、评论、分享、收藏 |
| 4 | 评论列表 | 评论和回复 |
| 5 | 评论输入 | 底部输入框 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #fbf9f8 | --surface | 主背景 |
| 动态卡片 | #ffffff | --surface-container-lowest | 动态背景 |
| 评论背景 | #f5f3f3 | --surface-container-low | 评论背景 |
| 点赞激活 | #dc2626 | --error | 已点赞 |
| 收藏激活 | #944931 | --secondary | 已收藏 |
| 回复缩进 | #efeded | --surface-container | 回复背景 |
| 输入框背景 | #f5f3f3 | --surface-container-low | 输入区域 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 作者名 | Inter | 16px | 600 | 1.3 |
| 时间 | Inter | 14px | 400 | 1.3 |
| 动态内容 | Inter | 16px | 400 | 1.5 |
| 评论内容 | Inter | 15px | 400 | 1.4 |
| 互动数字 | Inter | 14px | 500 | 1 |
| 评论数 | Inter | 14px | 600 | 1 |

#### 尺寸与间距
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 作者头像 | 48×48px | 圆形 |
| 图片网格 | 自适应 | 2列或3列 |
| 评论头像 | 40×40px | 圆形 |
| 回复头像 | 32×32px | 圆形 |
| 评论间距 | 16px | 垂直间距 |
| 回复缩进 | 48px | 左侧缩进 |

---

## 3. 交互逻辑

### 3.1 图片浏览
```
点击图片 → 全屏预览 → 左右滑动切换 → 捏合缩放 → 点击关闭
```

### 3.2 互动操作
| 操作 | 行为 |
|------|------|
| 点击❤️ | 点赞/取消点赞，数字变化 |
| 点击💬 | 聚焦评论输入框 |
| 点击↗️ | 打开分享菜单 |
| 点击🔖 | 收藏/取消收藏 |

### 3.3 评论功能
| 操作 | 行为 |
|------|------|
| 点击输入框 | 展开键盘，输入评论 |
| 点击评论 | 回复该评论 |
| 长按评论 | 显示操作菜单(复制/删除/举报) |
| 点击❤️(评论) | 点赞评论 |

### 3.4 分享菜单
- 转发给联系人
- 复制链接
- 分享到其他应用
- 生成分享图片

### 3.5 更多操作
- 编辑动态(作者)
- 删除动态(作者)
- 举报动态
- 屏蔽用户
- 复制内容

### 3.6 加载更多
- 评论分页加载
- 下拉刷新动态
- 显示loading spinner

---

## 4. 数据结构

### 4.1 动态数据
```typescript
interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}
```

### 4.2 评论数据
```typescript
interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}
```

### 4.3 页面状态
```typescript
interface PostDetailState {
  post: Post;
  comments: Comment[];
  newComment: string;
  replyingTo: string | null;
  showImageGallery: boolean;
  currentImageIndex: number;
  showShareMenu: boolean;
}
```

---

## 5. 异常处理

### 5.1 动态删除
- 显示"This post has been deleted"
- 返回上一页

### 5.2 评论发送失败
- 显示红色感叹号
- 点击重试

### 5.3 图片加载失败
- 显示占位图
- 点击重试加载
