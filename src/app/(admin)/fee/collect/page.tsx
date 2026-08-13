'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Input, Select, Modal, Form, message, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, SendOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { feeRecords } from '@/data/feeData'

const columns: ColumnsType<typeof feeRecords[0]> = [
  { title: '流水号', dataIndex: 'id', key: 'id', width: '10%' },
  { title: '党员姓名', dataIndex: 'memberName', key: 'memberName', width: '12%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '15%' },
  { title: '缴费月份', dataIndex: 'month', key: 'month', width: '10%' },
  { title: '应交金额', dataIndex: 'shouldAmount', key: 'shouldAmount', width: '10%', render: (a: number) => `¥${a}` },
  { title: '实缴金额', dataIndex: 'actualAmount', key: 'actualAmount', width: '10%', render: (a: number) => `¥${a}` },
  {
    title: '缴费方式',
    dataIndex: 'payType',
    key: 'payType',
    width: '10%',
    render: (type: string) => <Tag color={type === '微信' ? 'green' : type === '支付宝' ? 'blue' : 'default'}>{type}</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'payStatus',
    key: 'payStatus',
    width: '10%',
    render: (status: string) => <Tag color={status === '已缴' ? 'green' : 'red'}>{status}</Tag>,
  },
  { title: '缴费时间', dataIndex: 'payTime', key: 'payTime', width: '13%' },
]

export default function FeeCollect() {
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [data] = useState(feeRecords)

  const filteredData = data.filter((item) => {
    const matchSearch = item.memberName.includes(searchValue) || item.id.includes(searchValue)
    const matchStatus = !statusFilter || item.payStatus === statusFilter
    return matchSearch && matchStatus
  })

  const collectedCount = data.filter((f) => f.payStatus === '已缴').length
  const totalAmount = data.reduce((sum, f) => sum + f.shouldAmount, 0)
  const collectedAmount = data.filter((f) => f.payStatus === '已缴').reduce((sum, f) => sum + f.actualAmount, 0)
  const collectRate = Math.round((collectedAmount / totalAmount) * 100)

  const handleRemind = () => {
    const unpaid = data.filter((f) => f.payStatus === '欠缴')
    if (unpaid.length > 0) {
      message.success(`已向${unpaid.length}名欠缴党员发送催缴提醒`)
    } else {
      message.info('当前没有欠缴党员')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党费收缴管理</h1>
          <p className="text-gray-500 mt-1">管理党费收缴，支持多种缴费方式</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<SendOutlined />} onClick={handleRemind}>催缴提醒</Button>
          <Button type="primary" icon={<PlusOutlined />}>手动登记</Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月应收</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">¥{totalAmount}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已收缴</p>
                <p className="text-2xl font-bold text-green-600 mt-1">¥{collectedAmount}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">收缴率</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{collectRate}%</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">欠缴人数</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{data.length - collectedCount}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索党员姓名或流水号..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="筛选缴费状态"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { value: '', label: '全部' },
              { value: '已缴', label: '已缴' },
              { value: '欠缴', label: '欠缴' },
            ]}
          />
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>
    </div>
  )
}