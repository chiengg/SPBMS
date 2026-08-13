'use client'

import { useState } from 'react'
import { Table, Button, Input, Tag, Card, Space, Select, Pagination } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { memberList } from '@/data/memberData'

const columns: ColumnsType<typeof memberList[0]> = [
  { title: '党员编号', dataIndex: 'id', key: 'id', width: '10%' },
  { title: '姓名', dataIndex: 'name', key: 'name', width: '8%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: '6%' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: '6%' },
  { title: '学历', dataIndex: 'education', key: 'education', width: '8%' },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '15%' },
  {
    title: '党籍状态',
    dataIndex: 'partyStatus',
    key: 'partyStatus',
    width: '12%',
    render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
  },
  { title: '入党时间', dataIndex: 'joinDate', key: 'joinDate', width: '12%' },
  { title: '转正时间', dataIndex: 'regularDate', key: 'regularDate', width: '12%' },
  {
    title: '党费状态',
    dataIndex: 'feeStatus',
    key: 'feeStatus',
    width: '8%',
    render: (status: string) => <Tag color={status === '已缴' ? 'green' : status === '欠缴' ? 'red' : 'default'}>{status}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    width: '13%',
    render: () => (
      <Space>
        <Button icon={<EyeOutlined />} size="small">详情</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
      </Space>
    ),
  },
]

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    '正式党员': 'green',
    '预备党员': 'blue',
    '积极分子': 'orange',
    '发展对象': 'gold',
    '流动党员': 'cyan',
  }
  return colors[status] || 'default'
}

export default function MemberList() {
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [orgFilter, setOrgFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filteredData = memberList.filter((item) => {
    const matchSearch = item.name.includes(searchValue) || item.id.includes(searchValue)
    const matchStatus = !statusFilter || item.partyStatus === statusFilter
    const matchOrg = !orgFilter || item.orgName === orgFilter
    return matchSearch && matchStatus && matchOrg
  })

  const orgOptions = [...new Set(memberList.map((item) => item.orgName))]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党员花名册</h1>
          <p className="text-gray-500 mt-1">管理党员基础信息，查看党员档案</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<DownloadOutlined />}>导出花名册</Button>
          <Button type="primary" icon={<PlusOutlined />}>新增党员</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索党员姓名或编号..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="筛选党籍状态"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
            style={{ width: 140 }}
            options={[
              { value: '', label: '全部' },
              { value: '正式党员', label: '正式党员' },
              { value: '预备党员', label: '预备党员' },
              { value: '积极分子', label: '积极分子' },
            ]}
          />
          <Select
            placeholder="筛选所属组织"
            value={orgFilter}
            onChange={(value) => {
              setOrgFilter(value)
              setCurrentPage(1)
            }}
            style={{ width: 160 }}
            options={[{ value: '', label: '全部' }, ...orgOptions.map((o) => ({ value: o, label: o }))]}
          />
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />

        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showTotal={(total) => `共 ${total} 名党员`}
          />
        </div>
      </Card>
    </div>
  )
}