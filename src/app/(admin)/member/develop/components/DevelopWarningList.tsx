'use client'

import { Card, Table, Tag, Alert, Button } from 'antd'
import { WarningOutlined, ClockCircleOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { WarningRecord } from '@/data/memberData'

interface DevelopWarningListProps {
  warnings: WarningRecord[]
  onHandleWarning?: (warning: WarningRecord) => void
}

const warningColumns: ColumnsType<WarningRecord> = [
  {
    title: '预警级别',
    key: 'warningLevel',
    width: '10%',
    render: (_, record) => {
      const icon = record.warningLevel === 'danger' ? (
        <WarningOutlined className="text-red-500" />
      ) : record.warningLevel === 'warning' ? (
        <ClockCircleOutlined className="text-orange-500" />
      ) : (
        <FileTextOutlined className="text-blue-500" />
      )
      const color = record.warningLevel === 'danger' ? 'red' : record.warningLevel === 'warning' ? 'orange' : 'blue'
      const text = record.warningLevel === 'danger' ? '紧急' : record.warningLevel === 'warning' ? '预警' : '提示'
      return <Tag color={color} icon={icon}>{text}</Tag>
    },
  },
  {
    title: '预警类型',
    dataIndex: 'warningType',
    key: 'warningType',
    width: '10%',
    render: (type: string) => {
      const typeMap: Record<string, string> = {
        time: '时间超期',
        material: '材料缺失',
        condition: '条件不满足',
      }
      return <span>{typeMap[type] || type}</span>
    },
  },
  {
    title: '姓名',
    dataIndex: 'personName',
    key: 'personName',
    width: '10%',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
    key: 'orgName',
    width: '15%',
  },
  {
    title: '当前阶段',
    dataIndex: 'stageName',
    key: 'stageName',
    width: '15%',
  },
  {
    title: '截止日期',
    dataIndex: 'deadline',
    key: 'deadline',
    width: '12%',
  },
  {
    title: '超期天数',
    dataIndex: 'daysOverdue',
    key: 'daysOverdue',
    width: '10%',
    render: (days: number) => (
      <span className={days > 0 ? 'text-red-600 font-medium' : days === 0 ? 'text-orange-500' : 'text-gray-500'}>
        {days > 0 ? `超期${days}天` : days === 0 ? '即将到期' : `剩余${Math.abs(days)}天`}
      </span>
    ),
  },
  {
    title: '预警描述',
    dataIndex: 'description',
    key: 'description',
    width: '18%',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: '10%',
    render: (_, record) => (
      <Button size="small" type={record.hasProcess ? 'default' : 'primary'}>
        {record.hasProcess ? '处理中' : '立即处理'}
      </Button>
    ),
  },
]

export default function DevelopWarningList({ warnings }: DevelopWarningListProps) {
  const dangerCount = warnings.filter((w) => w.warningLevel === 'danger').length
  const warningCount = warnings.filter((w) => w.warningLevel === 'warning').length
  const infoCount = warnings.filter((w) => w.warningLevel === 'info').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">紧急预警</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{dangerCount}</p>
            </div>
            <AlertCircleOutlined className="text-red-500 text-3xl" />
          </div>
        </Card>
        <Card className="border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">一般预警</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{warningCount}</p>
            </div>
            <ClockCircleOutlined className="text-orange-500 text-3xl" />
          </div>
        </Card>
        <Card className="border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">提示信息</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{infoCount}</p>
            </div>
            <FileTextOutlined className="text-blue-500 text-3xl" />
          </div>
        </Card>
      </div>

      {dangerCount > 0 && (
        <Alert
          message={`有 ${dangerCount} 条紧急预警需要立即处理`}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Card title="发展党员超期预警清单">
        <Table
          dataSource={warnings}
          columns={warningColumns}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          className="text-sm"
        />
      </Card>
    </div>
  )
}