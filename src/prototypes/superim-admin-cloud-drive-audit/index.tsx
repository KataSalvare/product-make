/**
 * @name 云盘操作审计
 * @description Read-only audit trail for cloud drive mutations
 */

import { useMemo, useState } from 'react'
import { AuditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Empty, Input, Modal, Select, Space, Table, Typography, type TableColumnsType } from 'antd'
import { actionLabels, AdminCloudDriveShell, formatDateTime, StatusBadge, useAdminCloudDrive, type AdminCloudDriveAuditRecord } from '../superim-admin-cloud-drive/shared'
import './style.css'

const CloudDriveAuditPage = () => {
  const { auditRecords } = useAdminCloudDrive()
  const [query, setQuery] = useState('')
  const [action, setAction] = useState('all')
  const [result, setResult] = useState('all')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)
  const filteredRecords = useMemo(() => { const normalized = query.trim().toLowerCase(); return auditRecords.filter(record => (!normalized || record.operatorName.toLowerCase().includes(normalized) || record.targetName.toLowerCase().includes(normalized) || record.targetId.toLowerCase().includes(normalized)) && (action === 'all' || record.action === action) && (result === 'all' || record.result === result)) }, [action, auditRecords, query, result])
  const detailRecord = auditRecords.find(record => record.id === detailId)
  const columns: TableColumnsType<AdminCloudDriveAuditRecord> = [
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', render: value => formatDateTime(value) },
    { title: '操作', key: 'action', render: (_, record) => <div><Typography.Text strong>{actionLabels[record.action]}</Typography.Text><br /><Typography.Text type="secondary" style={{ fontSize: 12 }}>{record.action}</Typography.Text></div> },
    { title: '管理员', dataIndex: 'operatorName', key: 'operatorName' },
    { title: '目标', key: 'target', render: (_, record) => <div><Typography.Text ellipsis style={{ maxWidth: 220, display: 'block' }}>{record.targetName}</Typography.Text><Typography.Text type="secondary" style={{ fontSize: 12 }}>{record.targetId}</Typography.Text></div> },
    { title: '原因', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { title: '结果', dataIndex: 'result', key: 'result', render: value => <StatusBadge status={value} /> },
    { title: '详情', key: 'detail', align: 'right', render: (_, record) => <Button type="text" icon={<EyeOutlined />} aria-label={`查看 ${actionLabels[record.action]}详情`} onClick={() => setDetailId(record.id)} /> },
  ]

  return <AdminCloudDriveShell title="操作审计" description="只读查看所有云盘配额和文件变更记录">
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card size="small"><Space wrap style={{ width: '100%' }}><Input allowClear prefix={<SearchOutlined />} value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="搜索管理员、目标名称或对象 ID" style={{ minWidth: 260, flex: 1 }} /><Select value={action} onChange={value => { setAction(value); setPage(1) }} options={[{ value: 'all', label: '全部操作' }, ...Object.entries(actionLabels).map(([value, label]) => ({ value, label }))]} /><Select value={result} onChange={value => { setResult(value); setPage(1) }} options={[{ value: 'all', label: '全部结果' }, { value: 'success', label: '成功' }, { value: 'failed', label: '失败' }]} /></Space></Card>
      <Card title="变更记录" extra={<Typography.Text type="secondary"><AuditOutlined /> 只读模式 · 共 {filteredRecords.length} 条</Typography.Text>} styles={{ body: { padding: 0 } }}><Table rowKey="id" columns={columns} dataSource={filteredRecords} scroll={{ x: 900 }} pagination={{ current: page, pageSize: 8, total: filteredRecords.length, showSizeChanger: false, onChange: setPage, showTotal: total => `共 ${total} 条` }} locale={{ emptyText: <Empty description="没有匹配的审计记录" /> }} /></Card>
    </Space>
    <Modal title="审计详情" open={Boolean(detailRecord)} onCancel={() => setDetailId(null)} footer={<Button onClick={() => setDetailId(null)}>关闭</Button>} width={560}>
      {detailRecord && <Descriptions column={1} bordered size="small" items={[{ label: '日志 ID', children: detailRecord.id }, { label: '发生时间', children: new Date(detailRecord.createdAt).toLocaleString('zh-CN') }, { label: '操作管理员', children: detailRecord.operatorName }, { label: '目标对象', children: `${detailRecord.targetName}（${detailRecord.targetId}）` }, { label: '操作原因', children: detailRecord.reason }, { label: '修改前', children: detailRecord.before || '—' }, { label: '修改后', children: detailRecord.after || '—' }, { label: '操作结果', children: <StatusBadge status={detailRecord.result} /> }]} />}
    </Modal>
  </AdminCloudDriveShell>
}

export default CloudDriveAuditPage
