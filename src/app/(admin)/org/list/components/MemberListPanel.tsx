'use client'

import { useState } from 'react'
import { Card, Table, Input, Tag, Button } from 'antd'
import { SearchOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { MemberItem } from '@/data/memberData'

interface MemberListPanelProps {
  members: MemberItem[]
  orgName: string
}

const columns: ColumnsType<MemberItem> = [
  { title: '党员编号', dataIndex: 'id', key: 'id', width: '12%' },
  { title: '姓名', dataIndex: 'name', key: 'name', width: '10%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: '6%' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: '6%' },
  { title: '学历', dataIndex: 'education', key: 'education', width: '8%' },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '15%' },
  {
    title: '党员状态',
    dataIndex: 'partyStatus',
    key: 'partyStatus',
    width: '12%',
    render: (status: string) => <Tag color={status === '正式党员' ? 'green' : status === '预备党员' ? 'blue' : 'orange'}>{status}</Tag>,
  },
  { title: '入党日期', dataIndex: 'joinDate', key: 'joinDate', width: '12%' },
  {
    title: '党费状态',
    dataIndex: 'feeStatus',
    key: 'feeStatus',
    width: '10%',
    render: (status: string) => <Tag color={status === '已缴' ? 'green' : 'red'}>{status}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    width: '9%',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">详情</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
      </div>
    ),
  },
]

export default function MemberListPanel({ members, orgName }: MemberListPanelProps) {
  const [searchValue, setSearchValue] = useState('')

  const filteredMembers = members.filter((member) =>
    member.name.includes(searchValue) || member.id.includes(searchValue)
  )

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>党员列表 - {orgName}</span>
          <span className="text-sm text-gray-500">共 {filteredMembers.length} 名党员</span>
        </div>
      }
      className="h-[calc(100vh-230px)]"
      extra={
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索党员姓名或编号..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="primary" icon={<PlusOutlined />} size="small">新增党员</Button>
        </div>
      }
    >
      <Table
        dataSource={filteredMembers}
        columns={columns}
        pagination={{ pageSize: 20 }}
        rowKey="key"
        className="text-sm"
        locale={{
          emptyText: '暂无党员信息',
        }}
      />
    </Card>
  )
}