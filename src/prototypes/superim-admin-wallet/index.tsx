/**
 * @name 钱包运营后台
 * @description Dynamic 钱包集成的运营、同步和审计后台原型。
 */

import { useMemo, useState, type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudSyncOutlined,
  DatabaseOutlined,
  DollarOutlined,
  EyeOutlined,
  FilterOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Input, List, Progress, Row, Space, Statistic, Table, Tag, Typography, type TableColumnsType } from 'antd'
import AdminShell from '../../components/AdminShell'
import { dynamicEnvironmentId } from '../../integrations/dynamic/config'
import './style.css'

type AdminView = 'dashboard' | 'transactions' | 'users' | 'settings' | 'audit'
type TransactionAction = 'send' | 'fund' | 'receive' | 'signature'
type TransactionStatus = 'submitted' | 'confirmed' | 'failed' | 'cancelled' | 'syncing'
type BindingStatus = 'bound' | 'pending' | 'failed' | 'unbound'

type WalletOverview = {
  walletUserCount: number
  boundWalletCount: number
  transactionCount30d: number
  pendingSyncCount: number
  volume30d: string
  successRate30d: number
  infrastructure: Array<{ name: string; status: 'healthy' | 'degraded' | 'not-configured' }>
  pendingItems: Array<{ id: string; summary: string; createdAt: string }>
}

type WalletTransaction = {
  id: string
  dynamicTransactionId?: string
  txHash?: string
  userName: string
  walletAddress?: string
  action: TransactionAction
  amount?: string
  asset?: string
  network: string
  status: TransactionStatus
  createdAt: string
}

type WalletUser = {
  userId: string
  displayName: string
  handle: string
  dynamicUserId: string
  walletAddress?: string
  walletCount: number
  bindingStatus: BindingStatus
  lastSyncedAt?: string
}

type AuditRecord = { id: string; actor: string; action: string; detail: string; createdAt: string }

const mockOverview: WalletOverview = {
  walletUserCount: 18492,
  boundWalletCount: 18441,
  transactionCount30d: 18492,
  pendingSyncCount: 27,
  volume30d: '2.84M USDC',
  successRate30d: 99.2,
  infrastructure: [
    { name: 'Dynamic Embedded Wallet', status: 'healthy' },
    { name: 'Base 链上同步', status: 'healthy' },
    { name: 'Funding / Send 事件', status: 'degraded' },
  ],
  pendingItems: [
    { id: 'evt_1042', summary: 'Dynamic Send 等待链上确认', createdAt: '今天 10:42' },
    { id: 'evt_1039', summary: '用户钱包地址绑定待同步', createdAt: '今天 09:25' },
  ],
}

const mockTransactions: WalletTransaction[] = [
  { id: 'tx-1042', dynamicTransactionId: 'dyn_tx_1042', txHash: '0x91f0...8b2a', userName: 'Amina Yusuf', walletAddress: '0x7A2D...9C4D', action: 'send', amount: '84.00', asset: 'USDC', network: 'Base', status: 'confirmed', createdAt: '今天 10:42' },
  { id: 'tx-1041', dynamicTransactionId: 'dyn_tx_1041', txHash: '0xb19e...51a0', userName: 'Amina Yusuf', walletAddress: '0x7A2D...9C4D', action: 'signature', amount: '120.00', asset: 'USDC', network: 'Base', status: 'submitted', createdAt: '今天 09:18' },
  { id: 'tx-1039', dynamicTransactionId: 'dyn_tx_1039', userName: 'Kwame Boateng', walletAddress: '0x91C2...1A7F', action: 'fund', amount: '250.80', asset: 'USDC', network: 'Base', status: 'syncing', createdAt: '昨天 18:05' },
  { id: 'tx-1036', dynamicTransactionId: 'dyn_tx_1036', txHash: '0xa90d...32b1', userName: 'Elena Rossi', walletAddress: '0xA90D...32B1', action: 'receive', amount: '500.00', asset: 'USDC', network: 'Base', status: 'confirmed', createdAt: '8月29日' },
]

const mockUsers: WalletUser[] = [
  { userId: '10001', displayName: 'Amina Yusuf', handle: '@amina', dynamicUserId: 'dyn_usr_01', walletAddress: '0x7A2D...9C4D', walletCount: 1, bindingStatus: 'bound', lastSyncedAt: '今天 10:42' },
  { userId: '10002', displayName: 'Kwame Boateng', handle: '@kwame', dynamicUserId: 'dyn_usr_02', walletAddress: '0x91C2...1A7F', walletCount: 1, bindingStatus: 'bound', lastSyncedAt: '今天 09:25' },
  { userId: '10003', displayName: 'Elena Rossi', handle: '@elena', dynamicUserId: 'dyn_usr_03', walletAddress: '0xA90D...32B1', walletCount: 2, bindingStatus: 'bound', lastSyncedAt: '昨天 18:05' },
  { userId: '10004', displayName: 'Noah Williams', handle: '@noah', dynamicUserId: 'dyn_usr_04', walletCount: 0, bindingStatus: 'pending', lastSyncedAt: '今天 09:22' },
]

const mockAudit: AuditRecord[] = [
  { id: 'audit-1042', actor: '系统', action: 'Dynamic Send 交易同步', detail: 'tx-1042 · Base 已确认', createdAt: '今天 10:44' },
  { id: 'audit-1039', actor: '系统', action: '钱包绑定等待重试', detail: 'Noah Williams · wallet_pending', createdAt: '今天 09:25' },
  { id: 'audit-1036', actor: '系统', action: 'Funding 事件同步', detail: 'tx-1036 · USDC 充值已确认', createdAt: '昨天 18:06' },
  { id: 'audit-1030', actor: 'Maya Chen', action: '查看钱包集成状态', detail: '后台只读访问', createdAt: '昨天 16:20' },
]

const actionLabels: Record<TransactionAction, string> = { send: 'Dynamic Send', fund: '充值 / Funding', receive: '链上收款', signature: '用户签名' }
const transactionStatusLabels: Record<TransactionStatus, string> = { submitted: '已提交', confirmed: '已确认', failed: '失败', cancelled: '已取消', syncing: '同步中' }
const bindingStatusLabels: Record<BindingStatus, string> = { bound: '已绑定', pending: '待同步', failed: '绑定失败', unbound: '未绑定' }
const statusTag = (status: string, label: string) => <Tag color={['confirmed', 'bound', 'healthy'].includes(status) ? 'success' : ['submitted', 'syncing', 'pending', 'degraded'].includes(status) ? 'warning' : ['failed', 'cancelled', 'unbound'].includes(status) ? 'error' : 'default'}>{label}</Tag>
const initials = (value: string) => value.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()
const shortAddress = (value?: string) => value ? `${value.slice(0, 6)}...${value.slice(-4)}` : '未绑定'
const viewPath = (view: AdminView) => view === 'dashboard' ? '/admin/wallet' : `/admin/wallet/${view}`

const MockDataBanner: FC = () => <Alert type="info" showIcon icon={<CloudSyncOutlined />} message="原型演示数据" description="当前页面使用 Mock 数据展示 Dynamic 钱包运营效果，真实项目由服务端同步 Dynamic Webhook 和链上确认结果。" />

const OverviewPage: FC<{ onNavigate: (view: AdminView) => void }> = ({ onNavigate }) => <Space direction="vertical" size={16} style={{ width: '100%' }}><MockDataBanner /><Row gutter={[16, 16]}><Col xs={12} xl={6}><Card><Statistic title="钱包绑定用户" value={mockOverview.walletUserCount} prefix={<TeamOutlined />} /></Card></Col><Col xs={12} xl={6}><Card><Statistic title="已绑定钱包" value={mockOverview.boundWalletCount} prefix={<WalletOutlined />} /></Card></Col><Col xs={12} xl={6}><Card><Statistic title="近30日链上交易" value={mockOverview.transactionCount30d} prefix={<DatabaseOutlined />} /></Card></Col><Col xs={12} xl={6}><Card><Statistic title="待同步事件" value={mockOverview.pendingSyncCount} prefix={<ClockCircleOutlined />} /></Card></Col></Row><Row gutter={[16, 16]}><Col xs={24} xl={16}><Card title="Dynamic 钱包活动" extra={<Typography.Text type="secondary">近30日</Typography.Text>}><Typography.Title level={3} style={{ marginTop: 0 }}>{mockOverview.volume30d} <Typography.Text type="secondary" style={{ fontSize: 13 }}>链上交易量</Typography.Text></Typography.Title><Progress percent={mockOverview.successRate30d} status="success" format={value => `成功率 ${value}%`} /><Space style={{ marginTop: 16 }}><Tag color="blue">Dynamic</Tag><Tag color="gold">USDC</Tag><Typography.Text type="secondary">Base 主网</Typography.Text></Space></Card></Col><Col xs={24} xl={8}><Card title="基础设施状态" extra={<SafetyCertificateOutlined />}><List size="small" dataSource={mockOverview.infrastructure} renderItem={item => <List.Item><Typography.Text>{item.name}</Typography.Text>{statusTag(item.status, item.status === 'healthy' ? '正常' : item.status === 'degraded' ? '降级' : '未配置')}</List.Item>} /><Button type="link" icon={<ArrowRightOutlined />} onClick={() => onNavigate('audit')}>查看同步事件</Button></Card></Col></Row><Card title="待处理同步事件" extra={<Button type="link" onClick={() => onNavigate('transactions')}>查看交易</Button>}><List dataSource={mockOverview.pendingItems} renderItem={item => <List.Item><List.Item.Meta avatar={<CloudSyncOutlined />} title={item.summary} description={`${item.id} · ${item.createdAt}`} />{statusTag('syncing', '同步中')}</List.Item>} /></Card></Space>

const TransactionsPage: FC = () => {
  const [search, setSearch] = useState('')
  const transactions = useMemo(() => { const query = search.trim().toLowerCase(); return mockTransactions.filter(item => !query || [item.id, item.dynamicTransactionId, item.txHash, item.userName, item.walletAddress].some(value => value?.toLowerCase().includes(query))) }, [search])
  const columns: TableColumnsType<WalletTransaction> = [{ title: '交易 ID', dataIndex: 'id', key: 'id' }, { title: '用户', key: 'user', render: (_, item) => <Space><span className="wallet-avatar">{initials(item.userName)}</span>{item.userName}</Space> }, { title: '动作', key: 'action', render: (_, item) => <Space>{item.action === 'receive' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}{actionLabels[item.action]}</Space> }, { title: '金额', key: 'amount', render: (_, item) => item.amount ? `${item.amount} ${item.asset ?? 'USDC'}` : '—' }, { title: '网络', dataIndex: 'network', key: 'network' }, { title: '状态', key: 'status', render: (_, item) => statusTag(item.status, transactionStatusLabels[item.status]) }, { title: '时间', dataIndex: 'createdAt', key: 'createdAt' }, { title: '', key: 'action-link', render: (_, item) => <Button type="text" icon={<ArrowRightOutlined />} aria-label={`打开交易 ${item.id}`} /> }]
  return <Space direction="vertical" size={16} style={{ width: '100%' }}><MockDataBanner /><Card title={<span>Dynamic 交易同步 <Typography.Text type="secondary">共 {transactions.length} 笔</Typography.Text></span>} extra={<Space><Button icon={<FilterOutlined />}>筛选</Button><Button type="primary" icon={<DollarOutlined />}>导出 CSV</Button></Space>}><Space wrap style={{ marginBottom: 16 }}><Tag color="blue">全部动作</Tag><Tag>同步中</Tag><Tag>失败</Tag><Input value={search} onChange={event => setSearch(event.target.value)} prefix={<SearchOutlined />} placeholder="按交易 ID、用户或地址搜索" style={{ width: 260 }} /></Space><Table rowKey="id" columns={columns} dataSource={transactions} scroll={{ x: 900 }} pagination={{ pageSize: 20 }} /></Card></Space>
}

const UsersPage: FC = () => {
  const columns: TableColumnsType<WalletUser> = [{ title: '用户', key: 'user', render: (_, user) => <Space><span className="wallet-avatar wallet-avatar--sand">{initials(user.displayName)}</span><div><Typography.Text strong>{user.displayName}</Typography.Text><br /><Typography.Text type="secondary">{user.handle}</Typography.Text></div></Space> }, { title: 'Dynamic 用户 ID', dataIndex: 'dynamicUserId', key: 'dynamicUserId' }, { title: '钱包地址', key: 'walletAddress', render: (_, user) => shortAddress(user.walletAddress) }, { title: '钱包数', dataIndex: 'walletCount', key: 'walletCount' }, { title: '绑定状态', key: 'bindingStatus', render: (_, user) => statusTag(user.bindingStatus, bindingStatusLabels[user.bindingStatus]) }, { title: '最近同步', dataIndex: 'lastSyncedAt', key: 'lastSyncedAt', render: value => value ?? '—' }, { title: '', key: 'action', render: (_, user) => <Button type="text" icon={<ArrowRightOutlined />} aria-label={`打开用户 ${user.displayName}`} /> }]
  return <Space direction="vertical" size={16} style={{ width: '100%' }}><MockDataBanner /><Card title="Dynamic 用户与钱包绑定" extra={<Button icon={<SearchOutlined />}>搜索用户</Button>}><Table rowKey="userId" columns={columns} dataSource={mockUsers} scroll={{ x: 980 }} pagination={{ pageSize: 20 }} /></Card></Space>
}

const SettingsPage: FC = () => {
  const environmentId = dynamicEnvironmentId ? `${dynamicEnvironmentId.slice(0, 8)}…` : '未配置'
  const integrationItems = [{ label: 'Dynamic Environment', value: environmentId, status: dynamicEnvironmentId ? 'healthy' : 'not-configured' }, { label: '后台数据源', value: 'Mock 原型数据', status: 'healthy' }, { label: '钱包创建', value: '由 Dynamic Dashboard 控制', status: 'healthy' }, { label: '充值 / Funding', value: '由 Dynamic Dashboard 控制', status: 'healthy' }, { label: '转账 / Send', value: '由 Dynamic SDK 发起', status: 'healthy' }, { label: '用户签名', value: '由 Dynamic Wallet 请求', status: 'healthy' }]
  return <Row gutter={[16, 16]}><Col xs={24} xl={16}><Card title="Dynamic 集成状态" extra={<SettingOutlined />}><Typography.Paragraph type="secondary">后台原型使用 Mock 数据展示运营效果。正式系统中，Dynamic 能力由 Dynamic Dashboard 配置，SuperIM 只维护业务绑定、同步和审计。</Typography.Paragraph><List dataSource={integrationItems} renderItem={item => <List.Item><Typography.Text>{item.label}</Typography.Text><Space>{statusTag(item.status, item.status === 'healthy' ? '正常' : '未配置')}<Typography.Text type="secondary">{item.value}</Typography.Text></Space></List.Item>} /></Card></Col><Col xs={24} xl={8}><Card title="安全边界" extra={<EyeOutlined />}><Space direction="vertical"><Alert type="success" showIcon icon={<CheckCircleOutlined />} message="不保存私钥" /><Alert type="success" showIcon icon={<CheckCircleOutlined />} message="不代替用户签名" /><Alert type="info" showIcon message="链上结果只读同步" /></Space></Card></Col></Row>
}

const AuditPage: FC = () => <Space direction="vertical" size={16} style={{ width: '100%' }}><MockDataBanner /><Card title="Dynamic 钱包审计日志" extra={<Button icon={<AuditOutlined />}>导出日志</Button>}><List dataSource={mockAudit} renderItem={item => <List.Item><List.Item.Meta avatar={<AuditOutlined />} title={item.action} description={`${item.detail} · ${item.id}`} /><Typography.Text type="secondary">{item.actor} · {item.createdAt}</Typography.Text></List.Item>} /></Card></Space>

const AdminWalletPage: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const view: AdminView = (location.pathname.split('/')[3] as AdminView) || 'dashboard'
  const titleMap: Record<AdminView, [string, string]> = { dashboard: ['钱包总览', '查看 Dynamic 钱包绑定、链上同步和基础设施状态。'], transactions: ['交易记录', '查看 Dynamic Send、Funding 和链上交易同步结果。'], users: ['用户钱包', '查看 SuperIM 用户与 Dynamic 钱包地址的绑定关系。'], settings: ['集成配置', '查看 Dynamic 能力和 SuperIM 钱包服务的配置状态。'], audit: ['审计日志', '追踪钱包绑定、交易同步和后台配置事件。'] }
  const activeView = titleMap[view] ? view : 'dashboard'
  const onNavigate = (next: AdminView) => navigate(viewPath(next))
  return <AdminShell title={titleMap[activeView][0]} description={titleMap[activeView][1]}>{activeView === 'dashboard' && <OverviewPage onNavigate={onNavigate} />}{activeView === 'transactions' && <TransactionsPage />}{activeView === 'users' && <UsersPage />}{activeView === 'settings' && <SettingsPage />}{activeView === 'audit' && <AuditPage />}</AdminShell>
}

export default AdminWalletPage
