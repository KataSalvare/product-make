import type { ThemeConfig } from 'antd'

/**
 * 后台内容层的唯一 Ant Design token 入口。
 * 页面级样式优先通过 ConfigProvider 的 token / components 配置扩展。
 */
export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorBgLayout: '#f5f7fa',
    colorBgContainer: '#ffffff',
    colorText: '#1f1f1f',
    colorTextSecondary: '#595959',
    colorBorder: '#d9d9d9',
    borderRadius: 6,
    fontSize: 14,
    controlHeight: 32,
  },
  components: {
    Layout: {
      bodyBg: '#f5f7fa',
      headerBg: '#ffffff',
      siderBg: '#001529',
    },
    Menu: {
      darkItemBg: '#001529',
      darkItemSelectedBg: '#1677ff',
      darkItemHoverBg: '#112a45',
    },
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#f5faff',
    },
  },
}
