/**
 * @name 用户存储配额
 * @description Global and per-user cloud storage quota controls
 */

import { useMemo, useState } from 'react'
import { CheckOutlined, CloudServerOutlined, ReloadOutlined, SearchOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Col, Input, InputNumber, Modal, Row, Space, Statistic, Table, Typography, message, type TableColumnsType } from 'antd'
import { AdminCloudDriveShell, formatBytes, useAdminCloudDrive, UsageBar, type AdminCloudUserQuota } from '../superim-admin-cloud-drive/shared'
import './style.css'

const bytesToGb = (bytes: number) => Number((bytes / (1024 ** 3)).toFixed(1))
const gbToBytes = (gb: number) => Math.round(gb * 1024 ** 3)

const CloudDriveQuotasPage = () => {
  const { defaultQuotaBytes, userQuotas, updateDefaultQuota, updateUserQuota } = useAdminCloudDrive()
  const [globalGb, setGlobalGb] = useState<number>(bytesToGb(defaultQuotaBytes))
  const [query, setQuery] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [overrideGb, setOverrideGb] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [messageApi, contextHolder] = message.useMessage()
  const selectedUser = userQuotas.find(user => user.userId === userId)
  const filteredUsers = useMemo(() => { const normalized = query.trim().toLowerCase(); return userQuotas.filter(user => !normalized || user.userName.toLowerCase().includes(normalized) || user.userId.includes(normalized)) }, [query, userQuotas])

  const saveGlobal = () => { const result = updateDefaultQuota(gbToBytes(globalGb)); if (!result.ok) return messageApi.error(result.error); messageApi.success('全局默认配额已更新') }
  const openUser = (user: AdminCloudUserQuota) => { setUserId(user.userId); setOverrideGb(user.overrideQuotaBytes === undefined ? null : bytesToGb(user.overrideQuotaBytes)); setError(null) }
  const saveUser = () => { if (!selectedUser) return; const result = updateUserQuota(selectedUser.userId, overrideGb === null ? null : gbToBytes(overrideGb)); if (!result.ok) return setError(result.error || '配额保存失败'); setError(null); setUserId(null); messageApi.success('用户配额已更新') }
  const clearUser = () => { if (!selectedUser) return; const result = updateUserQuota(selectedUser.userId, null); if (!result.ok) return setError(result.error || '覆盖清除失败'); setUserId(null); messageApi.success('已恢复使用全局默认配额') }

  const columns: TableColumnsType<AdminCloudUserQuota> = [
    { title: '用户', key: 'user', render: (_, user) => <Space><span className="cloud-drive-avatar">{user.userName.slice(0, 1)}</span><div><Typography.Text strong>{user.userName}</Typography.Text><br /><Typography.Text type="secondary" style={{ fontSize: 12 }}>UID {user.userId}</Typography.Text></div></Space> },
    { title: '有效配额', key: 'quota', render: (_, user) => <div><Typography.Text>{formatBytes(user.overrideQuotaBytes ?? user.defaultQuotaBytes)}</Typography.Text>{user.overrideQuotaBytes !== undefined && <Typography.Text type="success" style={{ display: 'block', fontSize: 12 }}><CheckOutlined /> 单用户覆盖</Typography.Text>}</div> },
    { title: '已用空间', key: 'usage', width: 250, render: (_, user) => <UsageBar used={user.usedBytes} total={user.overrideQuotaBytes ?? user.defaultQuotaBytes} compact /> },
    { title: '文件数', dataIndex: 'fileCount', key: 'fileCount' },
    { title: '最近上传', key: 'lastUploadedAt', render: (_, user) => user.lastUploadedAt ? new Date(user.lastUploadedAt).toLocaleDateString('zh-CN') : '—' },
    { title: '操作', key: 'actions', align: 'right', render: (_, user) => <Button icon={<SettingOutlined />} onClick={() => openUser(user)}>调整配额</Button> },
  ]

  return <>
    {contextHolder}
    <AdminCloudDriveShell title="用户存储配额" description="管理全局默认配额和单用户覆盖值">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Row gutter={[16, 16]}><Col xs={24} lg={16}><Card title={<Space><CloudServerOutlined />全局默认配额</Space>}><Typography.Paragraph type="secondary">没有单用户覆盖时，用户使用此容量。</Typography.Paragraph><Space wrap align="end"><label>默认容量<InputNumber min={0.1} step={0.1} addonAfter="GB" value={globalGb} onChange={value => setGlobalGb(value ?? 0)} style={{ display: 'block', marginTop: 8, width: 220 }} /></label><Button type="primary" onClick={saveGlobal}>保存默认配额</Button></Space><Typography.Paragraph type="secondary" style={{ margin: '16px 0 0' }}>规则：默认值初始为 10 GB；不能低于当前无覆盖用户的已用空间。</Typography.Paragraph></Card></Col><Col xs={24} lg={8}><Card className="cloud-drive-quota-summary"><Statistic title="当前默认配额" value={formatBytes(defaultQuotaBytes)} prefix={<CloudServerOutlined />} /><Row gutter={12} style={{ marginTop: 20 }}><Col span={12}><Statistic title="用户数量" value={userQuotas.length} /></Col><Col span={12}><Statistic title="覆盖用户" value={userQuotas.filter(user => user.overrideQuotaBytes !== undefined).length} /></Col></Row></Card></Col></Row>
        <Card title="用户配额明细" extra={<Input allowClear prefix={<SearchOutlined />} value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索用户或 ID" style={{ width: 220 }} />} styles={{ body: { padding: 0 } }}><Table rowKey="userId" columns={columns} dataSource={filteredUsers} scroll={{ x: 900 }} pagination={{ pageSize: 8, showSizeChanger: false, showTotal: total => `共 ${total} 位用户` }} locale={{ emptyText: <Space direction="vertical"><TeamOutlined style={{ fontSize: 28, color: '#bfbfbf' }} /><span>没有匹配用户</span></Space> }} /></Card>
      </Space>
      <Modal title="调整单用户配额" open={Boolean(selectedUser)} onCancel={() => setUserId(null)} onOk={saveUser} okText="保存" cancelText="取消" footer={(_, { OkBtn, CancelBtn }) => <Space style={{ width: '100%', justifyContent: 'space-between' }}><Button icon={<ReloadOutlined />} onClick={clearUser}>清除覆盖</Button><Space><CancelBtn /><OkBtn /></Space></Space>}>
        {selectedUser && <Space direction="vertical" size={16} style={{ width: '100%' }}><Typography.Title level={4} style={{ margin: 0 }}>{selectedUser.userName}</Typography.Title><Typography.Text type="secondary">UID {selectedUser.userId} · 当前已用 {formatBytes(selectedUser.usedBytes)}</Typography.Text><label>覆盖配额<InputNumber min={bytesToGb(selectedUser.usedBytes)} step={0.1} addonAfter="GB" value={overrideGb} onChange={value => setOverrideGb(value)} placeholder={`${bytesToGb(selectedUser.defaultQuotaBytes)}`} style={{ display: 'block', marginTop: 8, width: '100%' }} /></label><Typography.Text type="secondary">留空则恢复全局默认。最小可设置为 {formatBytes(selectedUser.usedBytes)}，修改结果会写入操作审计。</Typography.Text>{error && <Typography.Text type="danger">{error}</Typography.Text>}</Space>}
      </Modal>
    </AdminCloudDriveShell>
  </>
}

export default CloudDriveQuotasPage
