'use client'

import { Card, Table, Tag, Button, Alert, Row, Col, Statistic } from 'antd'
import { AlertOutlined, ClockCircleOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { ElectionReminder } from '@/data/orgData'

interface ReminderListProps {
  reminders: ElectionReminder[]
  onHandleReminder: (reminder: ElectionReminder) => void
}

const columns: ColumnsType<ElectionReminder> = [
  {
    title: '提醒级别',
    key: 'level',
    width: '10%',
    render: (_, record) => {
      const configs = {
        danger: { color: 'red', icon: <AlertOutlined />, text: '紧急' },
        warning: { color: 'orange', icon: <WarningOutlined />, text: '预警' },
        info: { color: 'blue', icon: <ClockCircleOutlined />, text: '提醒' },
      }
      const config = configs[record.reminderLevel]
      return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
    },
  },
  { title: '党组织', dataIndex: 'orgName', key: 'orgName', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '组织类型', dataIndex: 'orgType', key: 'orgType', width: '12%', render: (type: string) => <Tag color="gray">{type}</Tag> },
  { title: '任期截止', dataIndex: 'termEndDate', key: 'termEndDate', width: '15%' },
  {
    title: '剩余天数',
    dataIndex: 'daysUntilExpiry',
    key: 'daysUntilExpiry',
    width: '12%',
    render: (days: number) => (
      <span className={`font-bold ${days <= 30 ? 'text-red-600' : days <= 90 ? 'text-orange-600' : 'text-blue-600'}`}>
        {days <= 0 ? '已到期' : `${days}天`}
      </span>
    ),
  },
  {
    title: '未办结流程',
    key: 'pending',
    width: '12%',
    render: (_, record) => (
      record.hasPendingProcess ? (
        <Tag color="red" icon={<AlertOutlined />}>存在</Tag>
      ) : (
        <Tag color="green" icon={<CheckCircleOutlined />}>无</Tag>
      )
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: '12%',
    render: (_, record) => (
      <Button size="small" type={record.hasPendingProcess ? 'default' : 'primary'} disabled={record.hasPendingProcess}>
        {record.hasPendingProcess ? '处理流程' : '发起换届'}
      </Button>
    ),
  },
]

export default function ReminderList({ reminders, onHandleReminder }: ReminderListProps) {
  const urgentCount = reminders.filter((r) => r.reminderLevel === 'danger').length
  const warningCount = reminders.filter((r) => r.reminderLevel === 'warning').length
  const infoCount = reminders.filter((r) => r.reminderLevel === 'info').length
  const pendingCount = reminders.filter((r) => r.hasPendingProcess).length

  return (
    <Card title="换届提醒清单">
      <Alert
        message="任期规则说明"
        description="支部委员会每届任期3年，总支部委员会、基层委员会每届任期3-5年。系统提前3个月推送预警，提前1个月推送紧急提醒。"
        type="info"
        showIcon
        className="mb-6"
      />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <Statistic title="紧急提醒" value={urgentCount} suffix="条" valueStyle={{ color: '#dc2626' }} />
            <p className="text-xs text-red-500 mt-1">剩余≤30天</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Statistic title="预警提醒" value={warningCount} suffix="条" valueStyle={{ color: '#f97316' }} />
            <p className="text-xs text-orange-500 mt-1">剩余31-90天</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Statistic title="常规提醒" value={infoCount} suffix="条" valueStyle={{ color: '#3b82f6' }} />
            <p className="text-xs text-blue-500 mt-1">剩余&gt;90天</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Statistic title="有未办结流程" value={pendingCount} suffix="个" valueStyle={{ color: '#6b7280' }} />
            <p className="text-xs text-gray-500 mt-1">需先处理</p>
          </div>
        </Col>
      </Row>

      <Table
        dataSource={reminders}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        className="text-sm"
      />

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <ClockCircleOutlined className="mr-2" />
          <strong>提醒规则：</strong>支部委员会每届任期3年，总支部委员会、基层委员会每届任期3-5年。
          系统自动计算到期日，提前3个月推送预警提醒，提前1个月推送紧急提醒。
          如需延期或提前换届，需提交申请并说明原因，上级党委审批通过后方可调整。
        </p>
      </div>
    </Card>
  )
}