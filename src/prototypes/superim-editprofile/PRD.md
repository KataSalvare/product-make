# EditProfile Page PRD

## 1. 页面概述

### 1.1 页面信息
| 项目 | 内容 |
|------|------|
| **页面名称** | EditProfile |
| **页面路径** | /editprofile |
| **页面类型** | 设置页 |
| **目标用户** | 当前用户 |
| **页面目的** | 编辑个人资料信息 |

### 1.2 页面描述
个人资料编辑页面，允许用户修改头像、昵称、用户名、简介、联系方式等个人信息，包含表单验证和保存功能。

---

## 2. 展示逻辑

### 2.1 布局结构
```
┌─────────────────────────────────────┐
|  ← Edit Profile              Save   |
|  ─────────────────────────────────  |
|                                     |
|           ┌─────────┐               |
|           │  📷 JD  │               |
|           │ Change  │               |
|           └─────────┘               |
|                                     |
|  Display Name *                     |
|  ┌────────────────────────────────┐ |
|  │ John Doe                       │ |
|  └────────────────────────────────┘ |
|  0/50                               |
|                                     |
|  Username *                         |
|  ┌────────────────────────────────┐ |
|  │ johndoe                 ✓ Avail│ |
|  └────────────────────────────────┘ |
|  3-20 characters, letters, numbers  |
|                                     |
|  Bio                                |
|  ┌────────────────────────────────┐ |
|  │ Living life one day at a time..│ |
|  └────────────────────────────────┘ |
|  0/150                              |
|                                     |
|  Phone *                            |
|  ┌────────────────────────────────┐ |
|  │ +234 801 234 5678         🔒   │ |
|  └────────────────────────────────┘ |
|  Cannot be changed                  |
|                                     |
|  Email *                            |
|  ┌────────────────────────────────┐ |
|  │ john@example.com          🔒   │ |
|  └────────────────────────────────┘ |
|  Cannot be changed                  |
|                                     |
|  Location                           |
|  ┌────────────────────────────────┐ |
|  │ Lagos, Nigeria                 │ |
|  └────────────────────────────────┘ |
|                                     |
└─────────────────────────────────────┘
```

### 2.2 视觉层级
| 层级 | 元素 | 说明 |
|------|------|------|
| 1 | 页面头部 | 返回、标题、保存按钮 |
| 2 | 头像区域 | 可点击更换头像 |
| 3 | 表单区域 | 各编辑字段 |
| 4 | 字符计数 | 实时显示字数 |

### 2.3 视觉设计

#### 颜色规范
| 元素 | 颜色值 | 变量名 | 用途 |
|------|--------|--------|------|
| 页面背景 | #fbf9f8 | --surface | 主背景 |
| 输入框背景 | #ffffff | --surface-container-lowest | 输入区域 |
| 边框 | #c8c6c6 | --outline-variant | 输入框边框 |
| 焦点边框 | #031631 | --primary | 聚焦状态 |
| 错误边框 | #dc2626 | --error | 验证错误 |
| 可用标识 | #16a34a | success | 用户名可用 |
| 禁用背景 | #efeded | --surface-container | 不可编辑字段 |

#### 字体规范
| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 页面标题 | Inter | 20px | 600 | 1.2 |
| 字段标签 | Inter | 14px | 500 | 1.4 |
| 输入文字 | Inter | 16px | 400 | 1.5 |
| 提示文字 | Inter | 12px | 400 | 1.4 |
| 字符计数 | Inter | 12px | 400 | 1 |

#### 尺寸与间距
| 元素 | 尺寸 | 说明 |
|------|------|------|
| 头像 | 96×96px | 圆形 |
| 输入框高度 | 48px | 标准高度 |
| 字段间距 | 20px | 垂直间距 |
| 表单边距 | 16px | 左右边距 |
| 圆角 | 12px | 输入框圆角 |

---

## 3. 交互逻辑

### 3.1 头像更换
```
点击头像 → 弹出选项(拍照/相册) → 选择图片 → 裁剪 → 预览 → 确认更换
```

### 3.2 表单验证
| 字段 | 规则 | 错误提示 |
|------|------|----------|
| Display Name | 必填, 2-50字符 | "Name must be 2-50 characters" |
| Username | 必填, 3-20字符, 字母数字下划线 | "Invalid username format" |
| Bio | 可选, 最多150字符 | "Bio too long" |
| Email | 邮箱格式 | "Invalid email format" |
| Phone | 非空 | "Phone is required" |

### 3.3 用户名检查
- 实时检查：输入时即时判断（无 debounce）
- 输入 "kata" 显示 ✗ Taken，其余显示 ✓ Available
- 保存时再次校验可用性，不可用则阻止提交

### 3.4 保存流程
```
点击Save → 验证所有字段 → 显示loading → 保存成功 → Toast提示 → 返回
```

### 3.5 未保存提示
- 有修改时点击返回
- 弹出确认对话框
- "Discard changes?"

### 3.6 字段状态
| 状态 | 样式 |
|------|------|
| 默认 | 灰色边框 |
| 聚焦 | 主色边框 |
| 错误 | 红色边框 + 错误文字 |
| 禁用 | 灰色背景 + 锁图标 |

---

## 4. 数据结构

### 4.1 表单数据
```typescript
interface ProfileForm {
  displayName: string;
  username: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
  avatar: string;
}
```

### 4.2 表单字段配置
```typescript
interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  maxLength?: number;
  required?: boolean;
  editable?: boolean;
}
```

### 4.3 验证状态
```typescript
interface ValidationState {
  errors: Record<string, string>;
  usernameAvailable: boolean;
  isChecking: boolean;
  hasChanges: boolean;
}
```

---

## 5. 异常处理

### 5.1 保存失败
- 显示Toast错误提示
- 保留表单数据
- 允许重试

### 5.2 用户名被占用
- 输入框下方提示
- "Username already taken"
- 保存按钮禁用

### 5.3 图片上传失败
- 提示"Upload failed"
- 保留原头像
- 允许重新选择
