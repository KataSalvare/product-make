import type { Annotation, AnnotationsData } from '@tools/lib/annotations'
import { DEFAULT_ANNOTATION_CATEGORIES } from './categories'

export { DEFAULT_ANNOTATION_CATEGORIES }

export const DEFAULT_ANNOTATIONS: Annotation[] = [
  {
    id: 'anno-logo',
    pagePath: '/login',
    number: 1,
    title: '品牌展示区',
    content: 'Logo + 欢迎语，可根据品牌自定义配色。点击 Logo 可跳转首页。',
    category: 'interaction',
    selector: '.demo-login-card > div:first-child > div',
    createdAt: 1,
  },
  {
    id: 'anno-username',
    pagePath: '/login',
    number: 2,
    title: '用户名输入框',
    content: '支持邮箱或用户名登录。输入后失焦触发格式校验。无输入时显示红色错误提示。',
    category: 'interaction',
    selector: '.demo-login-form > div:nth-child(1)',
    createdAt: 2,
  },
  {
    id: 'anno-password',
    pagePath: '/login',
    number: 3,
    title: '密码输入框',
    content: '密码支持明文/密文切换（后续迭代）。输入时边框变色。',
    category: 'interaction',
    selector: '.demo-login-form > div:nth-child(2)',
    createdAt: 3,
  },
  {
    id: 'anno-remember',
    pagePath: '/login',
    number: 4,
    title: '记住我功能',
    content: '勾选后 7 天内免登录（Token 存 localStorage）。未勾选 Session 过期即退出。敏感操作仍需二次验证。',
    category: 'business',
    selector: '.demo-login-options > label',
    createdAt: 4,
  },
  {
    id: 'anno-forgot',
    pagePath: '/login',
    number: 5,
    title: '忘记密码流程',
    content: '点击跳转找回密码页。流程：输入邮箱 → 获取验证码 → 重置密码 → 完成。验证码有效期 5 分钟。',
    category: 'business',
    selector: '.demo-login-options > button',
    createdAt: 5,
  },
  {
    id: 'anno-login-btn',
    pagePath: '/login',
    number: 6,
    title: '登录按钮交互',
    content: '点击后全表单校验。通过 → "登录中..." → 1.5s 模拟成功。失败 → 对应字段标红并提示错误信息。',
    category: 'interaction',
    selector: '.demo-login-submit',
    createdAt: 6,
  },
  {
    id: 'anno-social',
    pagePath: '/login',
    number: 7,
    title: '第三方登录',
    content: '微信：唤起扫码授权。GitHub：OAuth 跳转。企业微信：企业内应用授权。',
    category: 'interaction',
    selector: '.demo-login-social',
    createdAt: 7,
  },
  {
    id: 'anno-register',
    pagePath: '/login',
    number: 8,
    title: '注册入口',
    content: '无账号用户跳转注册页。注册成功自动登录并跳转首页。',
    category: 'business',
    selector: '.demo-login-register',
    createdAt: 8,
  },
]

export const DEFAULT_ANNOTATIONS_DATA: AnnotationsData = {
  annotations: DEFAULT_ANNOTATIONS,
  categories: DEFAULT_ANNOTATION_CATEGORIES,
}
