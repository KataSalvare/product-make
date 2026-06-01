# Login Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | Login Page |
| **页面路径** | /login |
| **页面类型** | 认证页 |
| **目标用户** | 未登录用户 |
| **页面目的** | 提供手机号密码和邮箱密码登录方式，完成用户认证 |

### 1.2 页面描述
用户登录页面，支持手机号+密码和邮箱+密码两种登录方式，提供清晰的表单验证、错误提示和社交登录选项。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│         [背景渐变装饰]               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │        ┌─────────┐          │    │
│  │        │   Logo   │          │    │
│  │        │    S     │          │    │
│  │        └─────────┘          │    │
│  │                             │    │
│  │      Welcome Back           │    │
│  │  Sign in to continue        │    │
│  │       your conversation     │    │
│  │                             │    │
│  │  ┌─────────────────────────┐│    │
│  │  │ [Phone]    [Email]      ││    │ ← Tab切换
│  │  ├─────────────────────────┤│    │
│  │  │                         ││    │
│  │  │ Phone Number            ││    │
│  │  │ ┌────┬────────────────┐ ││    │
│  │  │ │+234│ 800 000 0000   │ ││    │ ← 手机号输入
│  │  │ └────┴────────────────┘ ││    │
│  │  │                         ││    │
│  │  │ Password                ││    │
│  │  │ ┌────────────────────┐  ││    │
│  │  │ │ ••••••••••••••    │  ││    │ ← 密码输入
│  │  │ └────────────────────┘  ││    │
│  │  │              Forgot? →  ││    │ ← 忘记密码
│  │  │                         ││    │
│  │  │ ┌────────────────────┐  ││    │
│  │  │ │     Sign In        │  ││    │ ← 登录按钮
│  │  │ └────────────────────┘  ││    │
│  │  │                         ││    │
│  │  │ ──── Or continue with ───│    │
│  │  │                         ││    │
│  │  │  ┌────────┐ ┌────────┐  ││    │
│  │  │  │ Google │ │ Apple  │  ││    │ ← 社交登录
│  │  │  └────────┘ └────────┘  ││    │
│  │  │                         ││    │
│  │  │ Don't have account? Sign up│ ← 注册链接
│  │  └─────────────────────────┘│    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 背景装饰 | 渐变和模糊圆形 |
| 2 | Logo | 品牌标识 (56×56px) |
| 3 | 欢迎标题 | Welcome Back |
| 4 | 副标题 | 说明文字 |
| 5 | 登录卡片 | 包含所有表单元素 |
| 6 | Tab 切换 | Phone/Email |
| 7 | 输入区域 | 手机号/邮箱 + 密码 |
| 8 | 忘记密码 | 右对齐链接 |
| 9 | 登录按钮 | Sign In |
| 10 | 社交登录 | Google/Apple |
| 11 | 注册链接 | 卡片底部 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #fbf9f8 | --surface | 主背景 |
| 卡片背景 | #f5f3f3 | --surface-container-low | 登录卡片 |
| 登录按钮 | #944931 | --secondary | Sign In 按钮 |
| 按钮文字 | #ffffff | --on-secondary | 按钮内文字 |
| 选中 Tab | #031631 | --primary | 激活状态 |
| 未选中 Tab | 透明 | - | 默认状态 |
| 输入框边框 | #e0e0e0 | --outline-variant | 默认边框 |
| 输入框聚焦 | #944931 | --secondary | 聚焦状态 |
| 链接文字 | #944931 | --secondary | 忘记密码/注册 |
| 错误提示 | #dc2626 | --error | 错误状态 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 欢迎标题 | Inter | 20px | 600 | 1.3 |
| 副标题 | Inter | 14px | 400 | 1.5 |
| Tab 文字 | Inter | 12px | 500 | 1 |
| 输入标签 | Inter | 12px | 500 | 1 |
| 输入文字 | Inter | 14px | 400 | 1.5 |
| 按钮文字 | Inter | 14px | 600 | 1 |
| 链接文字 | Inter | 12px | 500 | 1 |

#### 尺寸与间距（与注册页对齐）
| 元素 | 尺寸 | 说明 |
|------|------|------|
| Logo | 56×56px | 圆角 12px |
| 卡片内边距 | 20px (p-5) | 统一紧凑 |
| 卡片圆角 | 16px | rounded-2xl |
| 输入框高度 | 40px | py-2.5 |
| 区号选择器 | 80px | w-20 |
| 按钮高度 | 44px | py-3 |
| Tab按钮 | py-2 px-3 | 紧凑 |
| 元素间距 | 16px | space-y-4 |

---

## 3. 交互逻辑

### 3.1 Tab 切换

#### Phone Tab
```
显示内容：
- Phone Number 标签
- 国家码选择器 (+234) + 手机号输入框
- Password 输入框
- Forgot password? 链接
```

#### Email Tab
```
显示内容：
- Email Address 输入框
- Password 输入框
- Forgot password? 链接
```

#### 切换动画
- 过渡时长：200ms
- 效果：背景色渐变 + 文字颜色变化
- 选中 Tab：主色背景 + 白色文字
- 未选中 Tab：透明背景 + 默认文字色

### 3.2 输入验证

#### 手机号验证
| 规则 | 错误提示 |
|------|----------|
| 必填 | Please enter your phone number |
| 格式 | Please enter a valid phone number |
| 长度 | Phone number should be 10-11 digits |

#### 邮箱验证
| 规则 | 错误提示 |
|------|----------|
| 必填 | Please enter your email |
| 格式 | Please enter a valid email address |

#### 密码验证
| 规则 | 错误提示 |
|------|----------|
| 必填 | Please enter your password |
| 长度 | Password must be at least 6 characters |

### 3.3 登录流程
```
输入手机号/邮箱 + 密码
        │
        ▼
   点击 Sign In
        │
        ▼
   表单验证
        │
    ┌───┴───┐
    │       │
  通过     失败
    │       │
    ▼       ▼
  显示加载  显示错误提示
    │
    ▼
  调用登录API
    │
    ▼
  登录成功
    │
    ▼
  跳转到 Chats 页面
```

### 3.4 按钮状态
| 状态 | 样式 | 说明 |
|------|------|------|
| 默认 | bg-[var(--secondary)] text-[var(--on-secondary)] | 表单验证通过 |
| 禁用 | bg-[var(--surface-container)] text-[var(--on-surface-variant)] | 表单未完成 |
| 加载中 | 显示loading spinner + "Signing in..." | 提交中 |

### 3.5 社交登录
| 平台 | 行为 |
|------|------|
| Google | 调用 Google OAuth |
| Apple | 调用 Apple Sign In |

### 3.6 忘记密码
- 点击 "Forgot password?" 链接
- 跳转至密码重置页面
- 或弹出密码重置弹窗

---

## 4. 内容规范

### 4.1 表单字段
| 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|----------|
| Phone | tel | 条件 | 10-11位数字 |
| Email | email | 条件 | 标准邮箱格式 |
| Password | password | 是 | 最少6位 |

### 4.2 国家码选项
| 代码 | 国家 |
|------|------|
| +234 | Nigeria |
| +27 | South Africa |
| +254 | Kenya |
| +255 | Tanzania |
| +233 | Ghana |

---

## 5. 异常处理

### 5.1 登录失败
- 显示错误提示："Invalid phone number or password" 或 "Invalid email or password"
- 保留已输入的账号信息
- 密码字段清空

### 5.2 网络错误
- 显示错误提示："Network error. Please try again."
- 提供重试按钮

### 5.3 账号锁定
- 多次失败登录后显示："Account temporarily locked. Please try again later."

---

## 6. 主题适配

使用 Equatorial Minimalism 主题：

| 元素 | 颜色变量 |
|------|----------|
| 页面背景 | --surface |
| 卡片背景 | --surface-container-low |
| 登录按钮 | --secondary |
| 登录按钮文字 | --on-secondary |
| Tab选中 | --primary |
| Tab选中文字 | --on-primary |
| 输入框边框 | --outline-variant |
| 输入框聚焦 | --secondary |
| 链接文字 | --secondary |
| 错误提示 | --error |

---

## 7. 状态管理

```typescript
interface LoginState {
  activeTab: 'phone' | 'email';
  phoneNumber: string;
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage: string | null;
}
```

### 7.1 按钮状态逻辑
- **启用状态**：表单验证通过且不在加载中
- **禁用状态**：表单未完成或正在加载
- **加载状态**：显示spinner和"Signing in..."文字
