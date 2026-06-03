# Register Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | Register |
| **页面路径** | /register |
| **页面类型** | 认证页 |
| **目标用户** | 新用户 |
| **页面目的** | 用户注册账号，加入SuperIM社区 |

### 1.2 页面描述
用户注册页面，支持手机号和邮箱两种注册方式，包含验证码验证、密码设置、密码强度检测、服务条款同意等功能，引导新用户完成账号创建。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│      Create Account                 │
│   Join SuperIM today                │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  [Phone]      [Email]       │    │ ← Tab切换
│  │  ─────────────────────────  │    │
│  │                             │    │
│  │  Phone Number               │    │
│  │  ┌────┬──────────────────┐  │    │
│  │  │+234│ 800 000 0000     │  │    │ ← 手机号
│  │  └────┴──────────────────┘  │    │
│  │                             │    │
│  │  Verification Code          │    │
│  │  ┌────────────────┐ ┌────┐ │    │
│  │  │ Enter code     │ │Send│ │    │ ← 验证码
│  │  └────────────────┘ └────┘ │    │
│  │                             │    │
│  │  Password                   │    │
│  │  ┌──────────────────────┐   │    │
│  │  │ Create a password    │   │    │ ← 密码
│  │  └──────────────────────┘   │    │
│  │  [═══     ] Medium          │    │ ← 强度指示
│  │                             │    │
│  │  ☐ I agree to Terms of      │    │
│  │     Service and Privacy     │    │ ← 条款勾选
│  │     Policy                  │    │
│  │                             │    │
│  │  ┌──────────────────────┐   │    │
│  │  │    Create Account    │   │    │ ← 注册按钮
│  │  └──────────────────────┘   │    │
│  │                             │    │
│  │  Already have an account?   │    │
│  │  Sign In                    │    │ ← 登录链接
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 返回按钮 | 左上角，便于返回 |
| 2 | 页面标题 | "Create Account" 主标题 |
| 3 | 副标题 | "Join SuperIM today" 说明文字 |
| 4 | 注册卡片 | 包含所有表单元素 |
| 5 | Tab切换 | Phone/Email |
| 6 | 手机号/邮箱输入 | 根据Tab显示 |
| 7 | 验证码输入 | 带发送按钮 |
| 8 | 密码输入 | 带强度检测 |
| 9 | 条款勾选 | 必须同意才能注册 |
| 10 | 注册按钮 | Create Account |
| 11 | 登录链接 | 底部引导已有用户 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #fbf9f8 | --surface | 主背景色 |
| 卡片背景 | #f5f3f3 | --surface-container-low | 卡片背景 |
| 注册按钮 | #944931 | --secondary | 主要操作 |
| 按钮文字 | #ffffff | --on-secondary | 按钮文字 |
| 选中Tab | #031631 | --primary | 激活状态 |
| 输入框边框 | #c8c6c6 | --outline-variant | 表单边框 |
| 标签文字 | #6b6b6b | --on-surface-variant | 提示文字 |
| 密码强度-弱 | #dc2626 | --error | 弱密码(1格红) |
| 密码强度-中 | #ca8a04 | warning | 中等密码(2格黄) |
| 密码强度-强 | #16a34a | success | 强密码(3格绿) |
| 链接文字 | #944931 | --secondary | 条款/登录链接 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 页面标题 | Inter | 20px | 600 | 1.3 |
| 副标题 | Inter | 14px | 400 | 1.4 |
| Tab文字 | Inter | 12px | 500 | 1 |
| 输入标签 | Inter | 12px | 500 | 1 |
| 输入文字 | Inter | 14px | 400 | 1.5 |
| 按钮文字 | Inter | 14px | 600 | 1 |
| 辅助文字 | Inter | 12px | 400 | 1.4 |

#### 尺寸与间距（移动端优化）
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 卡片内边距 | 20px (p-5) | 紧凑设计 |
| 卡片圆角 | 16px | rounded-2xl |
| 输入框高度 | 40px | py-2.5 |
| 区号选择器 | 80px | w-20 |
| 发送按钮 | 紧凑 | px-3 py-2.5 |
| 注册按钮 | 44px | py-3 |
| Tab按钮 | py-2 px-3 | 紧凑 |
| 表单项间距 | 16px | space-y-4 |
| 复选框 | 16px | w-4 h-4 |

---

## 3. 交互逻辑

### 3.1 注册流程
```
选择注册方式(Phone/Email) → 填写账号 → 获取验证码 → 设置密码 → 同意条款 → 创建账号
```

### 3.2 Tab切换
| 状态 | 样式 |
|------|------|
| 选中 | bg-[var(--primary)] text-[var(--on-primary)] |
| 未选中 | text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] |
| 切换动画 | 200ms ease-in-out |

### 3.3 验证码发送流程
```
点击"Send"按钮
        │
        ▼
   验证手机号/邮箱格式
        │
    ┌───┴───┐
    │       │
  有效     无效
    │       │
    ▼       ▼
  按钮禁用  显示错误提示
  显示倒计时
        │
        ▼
   60秒倒计时
        │
        ▼
   倒计时结束
        │
        ▼
   恢复"Send"按钮
```

**倒计时状态：**
- 按钮禁用，显示 "60s", "59s", "58s"...
- 背景色变为 --surface-container
- 文字色变为 --on-surface-variant

### 3.4 密码强度检测
| 强度 | 条件 | 显示 |
|------|------|------|
| 无 | 空密码 | 不显示指示器 |
| 弱 | 长度<6 | 1格红色 + "Weak" |
| 中 | 长度6-9 或 缺少大小写/数字 | 2格黄色 + "Medium" |
| 强 | 长度≥10 且 包含大小写和数字 | 3格绿色 + "Strong" |

**密码要求提示：**
- 至少6个字符
- 建议包含大小写字母和数字

### 3.5 表单验证
| 字段 | 验证规则 | 错误提示 |
|------|----------|----------|
| Phone | 非空，10-11位数字 | "Please enter a valid phone number" |
| Email | 非空，标准邮箱格式 | "Please enter a valid email address" |
| Verification Code | 非空，6位数字 | "Please enter the 6-digit code" |
| Password | 长度≥6 | "Password must be at least 6 characters" |
| Terms | 必须勾选 | "Please agree to the terms" |

### 3.6 按钮状态
| 状态 | 样式 | 说明 |
|------|------|------|
| 默认 | bg-[var(--secondary)] text-[var(--on-secondary)] shadow-ambient | 表单验证通过且已同意条款 |
| 禁用 | bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed | 表单未完成或未同意条款 |
| 加载中 | 显示loading spinner + "Creating..." | 提交中 |

### 3.7 注册成功流程
```
表单验证通过
        │
        ▼
   点击 Create Account
        │
        ▼
   显示加载状态
        │
        ▼
   调用注册API
        │
        ▼
   注册成功
        │
        ▼
   自动登录
        │
        ▼
   跳转至 Chats 页面
```

---

## 4. 内容规范

### 4.1 表单字段
| 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|----------|
| Phone | tel | 条件 | 10-11位数字 |
| Email | email | 条件 | 标准邮箱格式 |
| Verification Code | text | 是 | 6位数字 |
| Password | password | 是 | 最少6位 |
| Terms Agreement | checkbox | 是 | 必须勾选 |

### 4.2 国家码选项
| 代码 | 国家 |
|------|------|
| +234 | Nigeria |
| +27 | South Africa |
| +254 | Kenya |
| +255 | Tanzania |
| +233 | Ghana |

### 4.3 条款链接
- "Terms of Service" - 链接到服务条款页面
- "Privacy Policy" - 链接到隐私政策页面

---

## 5. 异常处理

### 5.1 注册失败
| 错误类型 | 提示信息 |
|----------|----------|
| 手机号已存在 | "This phone number is already registered" |
| 邮箱已存在 | "This email is already registered" |
| 验证码错误 | "Invalid verification code" |
| 验证码过期 | "Verification code expired. Please request a new one" |
| 网络错误 | "Network error. Please try again" |

### 5.2 表单错误
- 在对应字段下方显示红色错误提示
- 输入框边框变红
- 滚动到第一个错误字段

### 5.3 重试机制
- 验证码发送失败可重试
- 注册失败保留表单数据（密码除外）

---

## 6. 主题适配

使用 Equatorial Minimalism 主题：

| 元素 | 颜色变量 |
|------|----------|
| 页面背景 | --surface |
| 卡片背景 | --surface-container-low |
| 注册按钮 | --secondary |
| 注册按钮文字 | --on-secondary |
| Tab选中 | --primary |
| Tab选中文字 | --on-primary |
| 输入框边框 | --outline-variant |
| 输入框聚焦 | --secondary |
| 发送按钮(可用) | --secondary |
| 发送按钮(禁用) | --surface-container |
| 链接文字 | --secondary |
| 错误提示 | --error |

---

## 7. 状态管理

```typescript
interface RegisterState {
  activeTab: 'phone' | 'email';
  phoneNumber: string;
  email: string;
  password: string;
  verificationCode: string;
  agreeTerms: boolean;
  isLoading: boolean;
  isSendingCode: boolean;
  countdown: number;
  errorMessage: string | null;
}

interface PasswordStrength {
  strength: 0 | 1 | 2 | 3;
  label: '' | 'Weak' | 'Medium' | 'Strong';
  color: '' | 'bg-red-500' | 'bg-yellow-500' | 'bg-green-500';
}
```

### 7.1 按钮状态逻辑
- **启用状态**：所有必填字段有效、已同意条款、不在加载中
- **禁用状态**：任一条件不满足
- **加载状态**：显示spinner和"Creating..."文字

### 7.2 验证码按钮逻辑
- **可用状态**：未在倒计时、未在发送中
- **禁用状态**：倒计时中或正在发送
- **倒计时状态**：显示剩余秒数
