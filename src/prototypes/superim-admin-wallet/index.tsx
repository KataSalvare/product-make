/**
 * @name 钱包运营后台
 * @description SuperIM 钱包运营、交易和提现规则配置原型
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useState, type FC } from 'react'
import { AlertOutlined, ArrowDownOutlined, ArrowRightOutlined, ArrowUpOutlined, AuditOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, EyeOutlined, FilterOutlined, SafetyCertificateOutlined, SearchOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Form, Input, List, Progress, Row, Select, Space, Statistic, Table, Tag, Typography, message, type TableColumnsType } from 'antd'
import AdminShell from '../../components/AdminShell'
import './style.css'

type AdminView = 'dashboard' | 'transactions' | 'users' | 'settings' | 'audit'
type Transaction = { id: string; user: string; type: string; amount: string; status: string; time: string }
type WalletUser = { name: string; handle: string; wallet: string; balance: string; status: string; joined: string }

const adminTransactions: Transaction[] = [
  { id: 'tx-1042', user: 'Amina Yusuf', type: 'Internal transfer', amount: '84.00 USDC', status: 'Completed', time: '10:42' },
  { id: 'tx-1041', user: 'Amina Yusuf', type: 'Internal transfer', amount: '120.00 USDC', status: 'Completed', time: '09:18' },
  { id: 'tx-1039', user: 'Kwame Boateng', type: 'Withdrawal', amount: '250.80 USDC', status: 'Processing', time: '昨天' },
  { id: 'tx-1036', user: 'Elena Rossi', type: 'Deposit', amount: '500.00 USDC', status: 'Completed', time: '8月29日' },
]
const adminUsers: WalletUser[] = [
  { name: 'Amina Yusuf', handle: '@amina', wallet: '0x7A2D...9C4D', balance: '2,480.32 USDC', status: 'Ready', joined: '2026年8月22日' },
  { name: 'Kwame Boateng', handle: '@kwame', wallet: '0x91C2...1A7F', balance: '840.10 USDC', status: 'Ready', joined: '2026年8月20日' },
  { name: 'Elena Rossi', handle: '@elena', wallet: '0xA90D...32B1', balance: '120.00 USDC', status: 'Ready', joined: '2026年8月18日' },
  { name: 'Noah Williams', handle: '@noah', wallet: '待创建', balance: '—', status: 'Pending', joined: '今天 09:22' },
]

const transactionTypeLabels: Record<string, string> = { 'Internal transfer': '站内转账', Withdrawal: '提现', Deposit: '充值' }
const statusLabels: Record<string, string> = { Completed: '已完成', Processing: '处理中', Ready: '正常', Pending: '待处理', Failed: '失败' }
const statusTag = (status: string) => <Tag color={status === 'Completed' || status === 'Ready' ? 'success' : status === 'Processing' || status === 'Pending' ? 'warning' : 'error'}>{statusLabels[status] || status}</Tag>
const initials = (value: string) => value.split(' ').map(word => word[0]).join('')
const viewPath = (view: AdminView) => view === 'dashboard' ? '/admin/wallet' : `/admin/wallet/${view}`

const OverviewPage: FC<{ onNavigate: (view: AdminView) => void }> = ({ onNavigate }) => {
  const bars = [42, 54, 49, 68, 61, 78, 74, 88, 72, 94, 82, 100]
  return <Space direction="vertical" size={16} style={{ width: '100%' }}>
    <Row gutter={[16, 16]}>
      <Col xs={12} xl={6}><Card><Statistic title="钱包用户总数" value="18,492" prefix={<TeamOutlined />} suffix={<Typography.Text type="success" style={{ fontSize: 12 }}>+12.8%</Typography.Text>} /></Card></Col>
      <Col xs={12} xl={6}><Card><Statistic title="近30日 USDC 交易量" value="$2.84M" prefix={<DollarOutlined />} suffix={<Typography.Text type="success" style={{ fontSize: 12 }}>+8.4%</Typography.Text>} /></Card></Col>
      <Col xs={12} xl={6}><Card><Statistic title="交易成功率" value="99.2%" prefix={<CheckCircleOutlined />} suffix={<Typography.Text type="success" style={{ fontSize: 12 }}>+0.6%</Typography.Text>} /></Card></Col>
      <Col xs={12} xl={6}><Card><Statistic title="待处理事项" value={27} prefix={<ClockCircleOutlined />} suffix={<Typography.Text type="warning" style={{ fontSize: 12 }}>9 项待复核</Typography.Text>} /></Card></Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={16}><Card title="钱包活跃度" extra={<Select defaultValue="30" options={[{ value: '30', label: '近30天' }]} style={{ width: 100 }} />}><Typography.Title level={3} style={{ marginTop: 0 }}>$2.84M <Typography.Text type="success" style={{ fontSize: 13 }}>+8.4% 较上一周期</Typography.Text></Typography.Title><div className="wallet-chart" aria-label="钱包活跃度趋势图">{bars.map((height, index) => <div className="wallet-chart__bar" key={index}><i style={{ height: `${height}%` }} /><Typography.Text type="secondary">{[1, 10, 20, 30].includes(index + 1) ? `8月${index + 1}日` : ''}</Typography.Text></div>)}</div><Space style={{ marginTop: 16 }}><Tag color="blue">转账</Tag><Tag color="gold">提现</Tag><Typography.Text type="secondary">USDC · Base 主网</Typography.Text></Space></Card></Col>
      <Col xs={24} xl={8}><Card title="钱包基础设施" extra={<SafetyCertificateOutlined />}><Progress type="circle" percent={99.2} size={84} /><Typography.Title level={4} style={{ display: 'inline-block', marginLeft: 16 }}>健康</Typography.Title><List size="small" dataSource={[['嵌入式钱包创建', '运行正常'], ['Base 主网 RPC', '运行正常'], ['Gas 赞助', '已降级']]} renderItem={([label, value]) => <List.Item><Typography.Text>{label}</Typography.Text><Tag color={value === '已降级' ? 'warning' : 'success'}>{value}</Tag></List.Item>} /><Button type="link" icon={<ArrowRightOutlined />} onClick={() => onNavigate('audit')}>查看系统事件</Button></Card></Col>
    </Row>
    <Card title="待处理提现" extra={<Button type="link" onClick={() => onNavigate('transactions')}>查看全部</Button>}><List dataSource={adminTransactions.filter(item => item.status === 'Processing')} renderItem={item => <List.Item actions={[statusTag(item.status), <Button key="view" type="link" icon={<ArrowRightOutlined />} onClick={() => onNavigate('transactions')}>查看</Button>]}><List.Item.Meta avatar={<ArrowUpOutlined />} title={item.user} description={`${item.id} · ${item.time} · ${item.amount}`} /></List.Item>} /><Alert type="warning" showIcon icon={<AlertOutlined />} message="有 9 笔提现需要复核" description="触发了费用或额度规则" /></Card>
  </Space>
}

const TransactionsPage: FC = () => {
  const columns: TableColumnsType<Transaction> = [{ title: '交易 ID', dataIndex: 'id', key: 'id' }, { title: '用户', key: 'user', render: (_, item) => <Space><span className="wallet-avatar">{initials(item.user)}</span>{item.user}</Space> }, { title: '类型', key: 'type', render: (_, item) => <Space>{item.type === 'Deposit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}{transactionTypeLabels[item.type]}</Space> }, { title: '金额', dataIndex: 'amount', key: 'amount' }, { title: '状态', dataIndex: 'status', key: 'status', render: statusTag }, { title: '创建时间', dataIndex: 'time', key: 'time' }, { title: '', key: 'action', render: (_, item) => <Button type="text" icon={<ArrowRightOutlined />} aria-label={`打开交易 ${item.id}`} /> }]
  return <Card title={<span>全部交易 <Typography.Text type="secondary">共 18,492 笔</Typography.Text></span>} extra={<Space><Button icon={<FilterOutlined />}>筛选</Button><Button type="primary">导出 CSV</Button></Space>}><Space wrap style={{ marginBottom: 16 }}><Tag color="blue">全部交易</Tag><Tag>待处理 27</Tag><Tag>提现</Tag><Tag>失败</Tag><Input prefix={<SearchOutlined />} placeholder="按交易 ID、用户或地址搜索" style={{ width: 240 }} /></Space><Table rowKey="id" columns={columns} dataSource={adminTransactions} scroll={{ x: 760 }} pagination={false} /></Card>
}

const UsersPage: FC = () => {
  const columns: TableColumnsType<WalletUser> = [{ title: '用户', key: 'user', render: (_, user) => <Space><span className="wallet-avatar wallet-avatar--sand">{initials(user.name)}</span><div><Typography.Text strong>{user.name}</Typography.Text><br /><Typography.Text type="secondary">{user.handle}</Typography.Text></div></Space> }, { title: '钱包地址', dataIndex: 'wallet', key: 'wallet' }, { title: '余额', dataIndex: 'balance', key: 'balance' }, { title: '状态', dataIndex: 'status', key: 'status', render: statusTag }, { title: '注册时间', dataIndex: 'joined', key: 'joined' }, { title: '', key: 'action', render: (_, user) => <Button type="text" icon={<ArrowRightOutlined />} aria-label={`打开用户 ${user.name}`} /> }]
  return <Space direction="vertical" size={16} style={{ width: '100%' }}><Card><Row gutter={16}><Col xs={12} md={6}><Statistic title="钱包总数" value="18,492" /></Col><Col xs={12} md={6}><Statistic title="正常" value="18,441" /></Col><Col xs={12} md={6}><Statistic title="待处理 / 失败" value={51} /></Col><Col xs={12} md={6}><Statistic title="总余额" value="$6.2M" /></Col></Row></Card><Card title="用户钱包" extra={<Button icon={<SearchOutlined />}>搜索用户</Button>}><Table rowKey="handle" columns={columns} dataSource={adminUsers} scroll={{ x: 760 }} pagination={false} /></Card></Space>
}

const SettingsPage: FC<{ onToast: (text: string) => void }> = ({ onToast }) => {
  const [fee, setFee] = useState('0.80'); const [minimum, setMinimum] = useState('10.00'); const [daily, setDaily] = useState('5,000.00'); const [review, setReview] = useState('1,000.00')
  return <Row gutter={[16, 16]}><Col xs={24} xl={16}><Card title="提现规则" extra={<SettingOutlined />}><Typography.Paragraph type="secondary">以下规则适用于新的提现申请。SuperIM 站内转账由平台承担 Gas 费用，不收取服务费。</Typography.Paragraph><Form layout="vertical"><Form.Item label="服务费（USDC）" help="从提现金额中扣除的固定费用。"><Input value={fee} onChange={event => setFee(event.target.value)} addonAfter="USDC" /></Form.Item><Form.Item label="最低提现金额（USDC）" help="低于此金额的申请将被拦截。"><Input value={minimum} onChange={event => setMinimum(event.target.value)} addonAfter="USDC" /></Form.Item><Form.Item label="用户每日额度（USDC）" help="每个用户滚动 24 小时的提现额度。"><Input value={daily} onChange={event => setDaily(event.target.value)} addonAfter="USDC" /></Form.Item><Form.Item label="人工审核阈值（USDC）" help="超过此金额的申请将进入人工审核队列。"><Input value={review} onChange={event => setReview(event.target.value)} addonAfter="USDC" /></Form.Item><Button type="primary" onClick={() => onToast('提现规则已保存为草稿')}>保存草稿</Button></Form></Card></Col><Col xs={24} xl={8}><Card title="确认摘要" extra={<EyeOutlined />}><Card className="wallet-preview-card"><Typography.Text>提现</Typography.Text><Typography.Title level={2}>250.00 USDC</Typography.Title><Space direction="vertical" style={{ width: '100%' }}><Space style={{ width: '100%', justifyContent: 'space-between' }}><span>服务费</span><b>-{fee} USDC</b></Space><Space style={{ width: '100%', justifyContent: 'space-between' }}><span>网络费</span><b>由 SuperIM 承担</b></Space><Space style={{ width: '100%', justifyContent: 'space-between' }}><span>实际到账</span><b>{Math.max(0, 250 - Number(fee || 0)).toFixed(2)} USDC</b></Space></Space></Card><Alert type="info" showIcon message="规则变更会记录审计日志，仅对新的提现申请生效。" style={{ marginTop: 16 }} /></Card></Col></Row>
}

const AuditPage: FC = () => <Card title="钱包审计日志" extra={<Button icon={<AuditOutlined />}>导出日志</Button>}><List dataSource={[['Jordan Davis', '更新提现服务费', '0.70 → 0.80 USDC', '12 分钟前', '规则配置'], ['系统', '提现进入人工审核', 'tx-1039 · 250.80 USDC', '昨天 18:05', '交易'], ['Maya Chen', '重试钱包绑定', 'Noah Williams · wallet_pending', '今天 09:25', '钱包生命周期'], ['系统', 'Gas 赞助服务降级', 'Base 主网 · Paymaster 延迟', '今天 08:40', '基础设施']]} renderItem={([actor, action, detail, time, type]) => <List.Item><List.Item.Meta avatar={<AuditOutlined />} title={action} description={`${detail} · ${type}`} /><Typography.Text type="secondary">{actor} · {time}</Typography.Text></List.Item>} /></Card>

const AdminWalletPage: FC = () => {
  const location = useLocation(); const navigate = useNavigate(); const [messageApi, contextHolder] = message.useMessage(); const view: AdminView = (location.pathname.split('/')[3] as AdminView) || 'dashboard'; const titleMap: Record<AdminView, [string, string]> = { dashboard: ['钱包总览', '查看钱包健康度、交易量和待处理事项。'], transactions: ['交易记录', '查看 Base 主网上的 USDC 交易活动。'], users: ['用户钱包', '查看钱包状态和账户绑定情况。'], settings: ['提现规则', '配置提现费用和额度限制。'], audit: ['审计日志', '追踪钱包操作和规则变更。'] }; const activeView = titleMap[view] ? view : 'dashboard'; const onNavigate = (next: AdminView) => navigate(viewPath(next))
  return <>{contextHolder}<AdminShell title={titleMap[activeView][0]} description={titleMap[activeView][1]}>{activeView === 'dashboard' && <OverviewPage onNavigate={onNavigate} />}{activeView === 'transactions' && <TransactionsPage />}{activeView === 'users' && <UsersPage />}{activeView === 'settings' && <SettingsPage onToast={text => messageApi.success(text)} />}{activeView === 'audit' && <AuditPage />}</AdminShell></>
}

export default AdminWalletPage
