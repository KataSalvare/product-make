import { Button, Card, ConfigProvider, Flex, Input, Space, Table, Tag, Typography, theme } from 'antd'
import { adminTheme } from './theme'

const columns = [
  { title: '用户', dataIndex: 'name', key: 'name' },
  { title: '角色', dataIndex: 'role', key: 'role' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '正常' ? 'success' : 'warning'}>{status}</Tag>,
  },
]

const data = [
  { key: '1', name: 'Amina Yusuf', role: '运营管理员', status: '正常' },
  { key: '2', name: 'Chen Wei', role: '审核员', status: '待复核' },
]

function ThemePreview() {
  const { token } = theme.useToken()

  return (
    <main style={{ minHeight: '100vh', padding: 32, background: token.colorBgLayout }}>
      <Flex vertical gap={24} style={{ maxWidth: 960, margin: '0 auto' }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>Ant Design</Typography.Title>
          <Typography.Text type="secondary">SuperIM 后台内容层设计系统</Typography.Text>
        </div>
        <Card title="基础操作">
          <Space wrap>
            <Button type="primary">主要操作</Button>
            <Button>次要操作</Button>
            <Input placeholder="搜索用户" style={{ width: 220 }} aria-label="搜索用户" />
          </Space>
        </Card>
        <Card title="数据列表">
          <Table columns={columns} dataSource={data} pagination={false} rowKey="key" />
        </Card>
      </Flex>
    </main>
  )
}

export default function AntDesignTheme() {
  return (
    <ConfigProvider theme={adminTheme}>
      <ThemePreview />
    </ConfigProvider>
  )
}
