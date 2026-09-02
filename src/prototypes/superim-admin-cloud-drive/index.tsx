/**
 * @name 云盘运营总览
 * @description Cloud Drive operations overview for administrators
 */

import { useMemo } from 'react'
import { ArrowRightOutlined, CloudServerOutlined, DeleteOutlined, FileOutlined, LineChartOutlined, SafetyOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, List, Row, Space, Statistic, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { actionLabels, AdminCloudDriveShell, categoryLabels, formatBytes, formatDateTime, MetricCard, StatusBadge, UsageBar, useAdminCloudDrive, WarningBanner } from '../superim-admin-cloud-drive/shared'
import './style.css'

const chartData = [
  { label: '周一', upload: 18, delete: 2, freeze: 1 }, { label: '周二', upload: 24, delete: 1, freeze: 0 },
  { label: '周三', upload: 16, delete: 3, freeze: 2 }, { label: '周四', upload: 32, delete: 4, freeze: 1 },
  { label: '周五', upload: 26, delete: 2, freeze: 3 }, { label: '周六', upload: 20, delete: 1, freeze: 0 },
  { label: '周日', upload: 28, delete: 2, freeze: 1 },
]

const CloudDriveOverviewPage = () => {
  const { summary, fileRecords, userQuotas, auditRecords } = useAdminCloudDrive()
  const usagePercent = summary.totalStorageBytes > 0 ? (summary.usedStorageBytes / summary.totalStorageBytes) * 100 : 0
  const typeDistribution = useMemo(() => Object.entries(categoryLabels).map(([category, label]) => ({ category, label, value: fileRecords.filter(file => file.category === category).reduce((sum, file) => sum + file.sizeBytes, 0) })).filter(item => item.value > 0).sort((a, b) => b.value - a.value), [fileRecords])
  const maxTypeValue = Math.max(...typeDistribution.map(item => item.value), 1)
  const maxUserUsage = Math.max(...userQuotas.map(user => user.usedBytes), 1)

  return (
    <AdminCloudDriveShell title="云盘运营总览" description="查看容量、文件健康度与近期运营动作">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {usagePercent >= 90 && <WarningBanner tone="red" message={`存储使用率已达到 ${usagePercent.toFixed(1)}%，超过 90% 预警线。建议立即检查高占用用户或提升默认配额。`} />}
        {usagePercent >= 80 && usagePercent < 90 && <WarningBanner message={`存储使用率已达到 ${usagePercent.toFixed(1)}%，进入 80% 容量预警区间。`} />}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}><MetricCard label="总容量" value={formatBytes(summary.totalStorageBytes)} helper="按用户默认配额汇总" icon={<CloudServerOutlined />} /></Col>
          <Col xs={24} sm={12} xl={6}><MetricCard label="已用容量" value={formatBytes(summary.usedStorageBytes)} helper={`${usagePercent.toFixed(1)}% 使用率`} icon={<LineChartOutlined />} tone={usagePercent >= 80 ? 'orange' : 'blue'} /></Col>
          <Col xs={24} sm={12} xl={6}><MetricCard label="云盘用户" value={`${summary.userCount}`} helper="有文件记录的用户" icon={<UserOutlined />} tone="green" /></Col>
          <Col xs={24} sm={12} xl={6}><MetricCard label="文件总数" value={`${summary.fileCount}`} helper={`${summary.frozenFileCount} 个文件被冻结`} icon={<FileOutlined />} tone={summary.frozenFileCount > 0 ? 'orange' : 'blue'} /></Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}><Card title="操作趋势" extra={<Space size={16}><Typography.Text type="secondary">近 7 天</Typography.Text><Tag color="blue">上传</Tag><Tag color="orange">冻结</Tag><Tag color="red">删除</Tag></Space>}>
            <div className="cloud-drive-chart" aria-label="近七天上传、冻结和删除数量趋势">{chartData.map(day => <div className="cloud-drive-chart__day" key={day.label}><div className="cloud-drive-chart__bars"><i className="is-upload" style={{ height: `${(day.upload / 32) * 100}%` }} /><i className="is-freeze" style={{ height: `${Math.max(5, (day.freeze / 3) * 100)}%` }} /><i className="is-delete" style={{ height: `${Math.max(5, (day.delete / 4) * 100)}%` }} /></div><Typography.Text type="secondary">{day.label}</Typography.Text></div>)}</div>
            <Space split={<span>·</span>} style={{ marginTop: 16 }}><Statistic title="当前上传文件" value={summary.uploadCount} valueStyle={{ fontSize: 18 }} /><Statistic title="已删除记录" value={summary.deleteCount} valueStyle={{ fontSize: 18 }} /><Link to="/admin/cloud-drive/audit"><Button type="link" icon={<ArrowRightOutlined />}>查看审计</Button></Link></Space>
          </Card></Col>
          <Col xs={24} xl={8}><Card title="容量健康度" extra={<CloudServerOutlined />}><Typography.Title level={2} style={{ marginTop: 0 }}>{usagePercent.toFixed(1)}<Typography.Text type="secondary" style={{ fontSize: 14 }}>% 已使用</Typography.Text></Typography.Title><UsageBar used={summary.usedStorageBytes} total={summary.totalStorageBytes} /><Row gutter={12} style={{ marginTop: 20 }}><Col span={12}><Card size="small"><Statistic title="可用容量" value={formatBytes(Math.max(0, summary.totalStorageBytes - summary.usedStorageBytes))} valueStyle={{ fontSize: 18 }} /></Card></Col><Col span={12}><Card size="small"><Statistic title="冻结文件" value={summary.frozenFileCount} suffix="个" valueStyle={{ fontSize: 18 }} /></Card></Col></Row></Card></Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}><Card title="文件类型占用" extra={<Link to="/admin/cloud-drive/files">文件管理</Link>}><Space direction="vertical" size={16} style={{ width: '100%' }}>{typeDistribution.map(item => <div key={item.category}><Space style={{ width: '100%', justifyContent: 'space-between' }}><Typography.Text strong>{item.label}</Typography.Text><Typography.Text type="secondary">{formatBytes(item.value)}</Typography.Text></Space><div className="cloud-drive-meter"><i style={{ width: `${(item.value / maxTypeValue) * 100}%` }} /></div></div>)}</Space></Card></Col>
          <Col xs={24} lg={12}><Card title="高占用用户" extra={<Link to="/admin/cloud-drive/quotas">管理配额</Link>}><List dataSource={userQuotas.slice(0, 4)} renderItem={user => <List.Item><Space style={{ width: '100%' }}><span className="cloud-drive-avatar">{user.userName.slice(0, 1)}</span><div style={{ flex: 1, minWidth: 0 }}><Space style={{ width: '100%', justifyContent: 'space-between' }}><Typography.Text ellipsis>{user.userName}</Typography.Text><Typography.Text type="secondary">{formatBytes(user.usedBytes)}</Typography.Text></Space><div className="cloud-drive-meter"><i style={{ width: `${(user.usedBytes / maxUserUsage) * 100}%` }} /></div></div></Space></List.Item>} /></Card></Col>
        </Row>
        <Card title="最近异常与变更" extra={<Link to="/admin/cloud-drive/audit">全部审计 <ArrowRightOutlined /></Link>}><List dataSource={auditRecords.slice(0, 4)} renderItem={record => <List.Item actions={[<StatusBadge key="status" status={record.result} />]}><List.Item.Meta avatar={<span className="cloud-drive-event-icon">{record.action === 'file.delete' ? <DeleteOutlined /> : record.action === 'file.freeze' ? <SafetyOutlined /> : <UploadOutlined />}</span>} title={<Space><Typography.Text strong>{actionLabels[record.action]}</Typography.Text><Typography.Text type="secondary">{record.targetName}</Typography.Text></Space>} description={<Space><Typography.Text type="secondary">{record.reason}</Typography.Text><Typography.Text type="secondary">{formatDateTime(record.createdAt)}</Typography.Text></Space>} /></List.Item>} /></Card>
      </Space>
    </AdminCloudDriveShell>
  )
}

export default CloudDriveOverviewPage
