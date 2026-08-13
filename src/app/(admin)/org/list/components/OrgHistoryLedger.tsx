'use client'

import { Card, Table, Tag, Input, Space } from 'antd'
import { SearchOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { OrgHistoryRecord } from '@/data/orgData'

interface OrgHistoryLedgerProps {
  records: OrgHistoryRecord[]
  orgId: string
}

const columns: ColumnsType<OrgHistoryRecord> = [
  {
    title: '序号',
    key: 'index',
    width: '6%',
    render: (_, __, index) => <span className="text-sm">{index + 1}</span>,
  },
  {
    title: '操作类型',
    dataIndex: 'actionType',
    key: 'actionType',
    width: '10%',
    render: (type: string) => {
      const colors: Record<string, string> = {
        '新增': 'green',
        '编辑': 'blue',
        '撤销': 'red',
        '合并': 'orange',
        '拆分': 'purple',
        '划转': 'cyan',
        '换届': 'gold',
      }
      return <Tag color={colors[type]}>{type}</Tag>
    },
  },
  {
    title: '操作时间',
    dataIndex: 'actionTime',
    key: 'actionTime',
    width: '16%',
    render: (time: string) => (
      <div className="flex items-center gap-1 text-sm">
        <ClockCircleOutlined className="text-gray-400" />
        <span>{time}</span>
      </div>
    ),
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: '10%',
    render: (name: string) => (
      <div className="flex items-center gap-1 text-sm">
        <UserOutlined className="text-gray-400" />
        <span>{name}</span>
      </div>
    ),
  },
  {
    title: '操作详情',
    dataIndex: 'detail',
    key: 'detail',
    ellipsis: true,
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    width: '12%',
    render: (status: string) => {
      const colors: Record<string, string> = {
        '已审批': 'green',
        '待审批': 'orange',
        '审批驳回': 'red',
      }
      return <Tag color={colors[status]}>{status}</Tag>
    },
  },
  {
    title: '审批人',
    dataIndex: 'approvalBy',
    key: 'approvalBy',
    width: '10%',
    render: (name?: string) => <span className="text-sm">{name || '-'}</span>,
  },
  {
    title: '审批时间',
    dataIndex: 'approvalTime',
    key: 'approvalTime',
    width: '12%',
    render: (time?: string) => <span className="text-sm">{time || '-'}</span>,
  },
]

export default function OrgHistoryLedger({ records, orgId }: OrgHistoryLedgerProps) {
  const filteredRecords = records.filter((r) => r.orgId === orgId || orgId === 'org-001')

  return (
    <Card
      className="h-[calc(100vh-230px)]"
      extra={
        <div className="relative max-w-xs">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="搜索操作记录..." className="pl-10" />
        </div>
      }
    >
      <Table
        dataSource={filteredRecords}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        className="text-sm"
        locale={{
          emptyText: '暂无沿革记录',
        }}
      />
    </Card>
  )
}