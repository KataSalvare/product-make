/**
 * @name 云盘文件管理
 * @description Metadata-only cloud file administration
 */

import { useMemo, useState } from 'react'
import { EyeOutlined, FileOutlined, LockOutlined, SearchOutlined, UnlockOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Card, Drawer, Empty, Input, Modal, Select, Space, Table, Typography, message, type TableColumnsType } from 'antd'
import { AdminCloudDriveShell, categoryLabels, formatBytes, formatDateTime, sourceLabels, StatusBadge, useAdminCloudDrive, type AdminCloudFileRecord } from '../superim-admin-cloud-drive/shared'
import './style.css'

type DateFilter = 'all' | 'today' | '7d' | '30d'
type SortMode = 'updated' | 'size' | 'name'

const CloudDriveFilesPage = () => {
  const { fileRecords, freezeFile, unfreezeFile, deleteFiles } = useAdminCloudDrive()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('updated')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailId, setDetailId] = useState<string | null>(null)
  const [freezeIds, setFreezeIds] = useState<string[]>([])
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [freezeReason, setFreezeReason] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const [referenceNow] = useState(() => Date.now())
  const pageSize = 6

  const filteredFiles = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const dateStart = dateFilter === 'today' ? new Date(referenceNow).setHours(0, 0, 0, 0) : dateFilter === '7d' ? referenceNow - 7 * 86400000 : dateFilter === '30d' ? referenceNow - 30 * 86400000 : 0
    return [...fileRecords].filter(file => {
      const queryMatches = !normalized || file.name.toLowerCase().includes(normalized) || file.ownerUserId.includes(normalized)
      return queryMatches && (category === 'all' || file.category === category) && (source === 'all' || file.source === source) && (status === 'all' || file.status === status) && (!dateStart || new Date(file.updatedAt).getTime() >= dateStart)
    }).sort((a, b) => sortMode === 'name' ? a.name.localeCompare(b.name) : sortMode === 'size' ? b.sizeBytes - a.sizeBytes : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [category, dateFilter, fileRecords, query, referenceNow, sortMode, source, status])
  const detailFile = fileRecords.find(file => file.fileId === detailId)
  const freezeTargets = fileRecords.filter(file => freezeIds.includes(file.fileId))
  const deleteTargets = fileRecords.filter(file => deleteIds.includes(file.fileId))

  const submitFreeze = () => {
    if (!freezeReason.trim()) return
    freezeTargets.forEach(file => freezeFile(file.fileId, freezeReason))
    setFreezeIds([]); setFreezeReason(''); setSelectedIds(current => current.filter(id => !freezeIds.includes(id)))
    messageApi.success(`${freezeTargets.length} 个文件已冻结`)
  }
  const submitDelete = () => {
    const result = deleteFiles(deleteIds)
    if (!result.ok) return messageApi.error(result.error)
    setDeleteIds([]); setSelectedIds(current => current.filter(id => !deleteIds.includes(id)))
    messageApi.success(`${deleteTargets.length} 个文件已永久删除`)
  }
  const handleUnfreeze = (ids: string[]) => {
    ids.forEach(id => unfreezeFile(id))
    setSelectedIds([])
    messageApi.success('已解冻选中文件')
  }

  const columns: TableColumnsType<AdminCloudFileRecord> = [
    { title: '文件', dataIndex: 'name', key: 'name', render: (_, file) => <Space><span className="cloud-drive-file-icon"><FileOutlined /></span><div><Typography.Text strong ellipsis style={{ maxWidth: 220, display: 'block' }}>{file.name}</Typography.Text><Typography.Text type="secondary" style={{ fontSize: 12 }}>ID: {file.fileId}</Typography.Text></div></Space> },
    { title: '所属用户', key: 'owner', render: (_, file) => <div><Typography.Text>{file.ownerName}</Typography.Text><br /><Typography.Text type="secondary" style={{ fontSize: 12 }}>UID {file.ownerUserId}</Typography.Text></div> },
    { title: '来源 / 文件夹', key: 'source', render: (_, file) => <div><Typography.Text>{sourceLabels[file.source]}</Typography.Text><br /><Typography.Text type="secondary" style={{ fontSize: 12 }}>{file.folderName || '根目录'}</Typography.Text></div> },
    { title: '大小', dataIndex: 'sizeBytes', key: 'size', render: value => formatBytes(value) },
    { title: '状态', dataIndex: 'status', key: 'status', render: value => <StatusBadge status={value} /> },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', render: value => formatDateTime(value) },
    { title: '操作', key: 'actions', align: 'right', render: (_, file) => <Space><Button type="text" icon={<EyeOutlined />} aria-label={`查看 ${file.name}`} onClick={() => setDetailId(file.fileId)} /><Button type="text" icon={file.status === 'frozen' ? <UnlockOutlined /> : <LockOutlined />} aria-label={file.status === 'frozen' ? `解冻 ${file.name}` : `冻结 ${file.name}`} onClick={() => file.status === 'frozen' ? handleUnfreeze([file.fileId]) : (setFreezeIds([file.fileId]), setFreezeReason(''))} /></Space> },
  ]

  return <>
    {contextHolder}
    <AdminCloudDriveShell title="文件管理" description="仅查看文件元数据，管理文件状态与生命周期">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card size="small"><Space wrap style={{ width: '100%' }}><Input allowClear prefix={<SearchOutlined />} value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="搜索文件名或用户 ID" style={{ minWidth: 240, flex: 1 }} /><Select value={category} onChange={value => { setCategory(value); setPage(1) }} options={[{ value: 'all', label: '全部类型' }, ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))]} /><Select value={source} onChange={value => { setSource(value); setPage(1) }} options={[{ value: 'all', label: '全部来源' }, { value: 'upload', label: '直接上传' }, { value: 'chat', label: '聊天收存' }]} /><Select value={status} onChange={value => { setStatus(value); setPage(1) }} options={[{ value: 'all', label: '全部状态' }, { value: 'active', label: '正常' }, { value: 'frozen', label: '冻结' }]} /><Select value={dateFilter} onChange={value => { setDateFilter(value); setPage(1) }} options={[{ value: 'all', label: '全部时间' }, { value: 'today', label: '今天' }, { value: '7d', label: '近 7 天' }, { value: '30d', label: '近 30 天' }]} /><Select value={sortMode} onChange={setSortMode} options={[{ value: 'updated', label: '最近更新' }, { value: 'size', label: '文件大小' }, { value: 'name', label: '文件名称' }]} /></Space></Card>
        {selectedIds.length > 0 && <Card size="small" className="cloud-drive-selection"><Space wrap><Typography.Text strong>已选择 {selectedIds.length} 个文件</Typography.Text><Button icon={<LockOutlined />} disabled={fileRecords.filter(file => selectedIds.includes(file.fileId)).every(file => file.status === 'frozen')} onClick={() => { setFreezeIds(selectedIds); setFreezeReason('') }}>冻结</Button><Button icon={<UnlockOutlined />} disabled={fileRecords.filter(file => selectedIds.includes(file.fileId)).every(file => file.status !== 'frozen')} onClick={() => handleUnfreeze(selectedIds.filter(id => fileRecords.find(file => file.fileId === id)?.status === 'frozen'))}>解冻</Button><Button danger icon={<DeleteOutlined />} onClick={() => setDeleteIds(selectedIds)}>永久删除</Button><Button type="link" onClick={() => setSelectedIds([])}>取消选择</Button></Space></Card>}
        <Card title="文件元数据" extra={<Typography.Text type="secondary">共 {filteredFiles.length} 条记录</Typography.Text>} styles={{ body: { padding: 0 } }}><Table rowKey="fileId" columns={columns} dataSource={filteredFiles} rowSelection={{ selectedRowKeys: selectedIds, onChange: keys => setSelectedIds(keys as string[]) }} scroll={{ x: 980 }} pagination={{ current: page, pageSize, total: filteredFiles.length, showSizeChanger: false, onChange: setPage, showTotal: total => `共 ${total} 条` }} locale={{ emptyText: <Empty description="没有匹配的文件" /> }} /></Card>
      </Space>
      <Drawer title="文件元数据" open={Boolean(detailFile)} onClose={() => setDetailId(null)} width={440} footer={detailFile && <Button block type={detailFile.status === 'frozen' ? 'default' : 'primary'} danger={detailFile.status === 'frozen'} onClick={() => detailFile.status === 'frozen' ? (handleUnfreeze([detailFile.fileId]), setDetailId(null)) : (setFreezeIds([detailFile.fileId]), setFreezeReason(''), setDetailId(null))}>{detailFile.status === 'frozen' ? '解冻文件' : '冻结文件'}</Button>}>
        {detailFile && <Space direction="vertical" size={20} style={{ width: '100%' }}><Card size="small" type="inner" title="后台仅处理元数据">不提供正文预览、下载或对象存储访问。</Card><dl className="cloud-drive-meta-list">{[['文件 ID', detailFile.fileId], ['文件类型', categoryLabels[detailFile.category]], ['文件大小', formatBytes(detailFile.sizeBytes)], ['所属用户', `${detailFile.ownerName}（${detailFile.ownerUserId}）`], ['来源', sourceLabels[detailFile.source]], ['所属文件夹', detailFile.folderName || '根目录'], ['更新时间', formatDateTime(detailFile.updatedAt)], ['当前状态', detailFile.status === 'frozen' ? `冻结 · ${detailFile.frozenReason || '未填写'}` : '正常']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></Space>}
      </Drawer>
      <Modal title="冻结文件" open={freezeIds.length > 0} onCancel={() => setFreezeIds([])} onOk={submitFreeze} okText="确认冻结" cancelText="取消" okButtonProps={{ disabled: !freezeReason.trim() }}><Typography.Paragraph>冻结后用户端和 Picker 不再显示，容量仍会计入。</Typography.Paragraph><Input.TextArea value={freezeReason} onChange={event => setFreezeReason(event.target.value)} rows={4} placeholder="请填写审核、合规或运营原因" aria-label="冻结原因" /></Modal>
      <Modal title="永久删除文件？" open={deleteIds.length > 0} onCancel={() => setDeleteIds([])} onOk={submitDelete} okText="永久删除" cancelText="取消" okButtonProps={{ danger: true }}><Typography.Paragraph>将立即硬删除 {deleteIds.length} 个文件并释放 {formatBytes(deleteTargets.reduce((sum, file) => sum + file.sizeBytes, 0))}。此操作不可恢复。</Typography.Paragraph></Modal>
    </AdminCloudDriveShell>
  </>
}

export default CloudDriveFilesPage
