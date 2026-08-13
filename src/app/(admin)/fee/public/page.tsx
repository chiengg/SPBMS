'use client'

import { useState } from 'react'
import { Card, Table, Button, Select, DatePicker, Input, Tag, Modal } from 'antd'
import { EyeOutlined, FileTextOutlined, PrinterOutlined, ShareAltOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface PublicItem {
  key: string
  period: string
  orgName: string
  totalAmount: string
  paidAmount: string
  rate: string
  status: string
  publishDate: string
}

const publicList: PublicItem[] = [
  { key: '1', period: '2024年1月', orgName: '第一党支部', totalAmount: '¥4,500', paidAmount: '¥4,320', rate: '96%', status: '已公示', publishDate: '2024-01-10' },
  { key: '2', period: '2024年1月', orgName: '第二党支部', totalAmount: '¥5,600', paidAmount: '¥5,040', rate: '90%', status: '已公示', publishDate: '2024-01-10' },
  { key: '3', period: '2023年12月', orgName: '第一党支部', totalAmount: '¥4,500', paidAmount: '¥4,500', rate: '100%', status: '已公示', publishDate: '2023-12-10' },
  { key: '4', period: '2023年12月', orgName: '第二党支部', totalAmount: '¥5,600', paidAmount: '¥5,320', rate: '95%', status: '已公示', publishDate: '2023-12-10' },
]

const columns: ColumnsType<PublicItem> = [
  { title: '公示周期', dataIndex: 'period', key: 'period' },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '应收金额', dataIndex: 'totalAmount', key: 'totalAmount' },
  { title: '实收金额', dataIndex: 'paidAmount', key: 'paidAmount' },
  { title: '收缴率', dataIndex: 'rate', key: 'rate', render: (rate: string) => <span className={parseFloat(rate) >= 95 ? 'text-green-600' : 'text-orange-600'}>{rate}</span> },
  {
    title: '公示状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color="green">{status}</Tag>,
  },
  { title: '公示日期', dataIndex: 'publishDate', key: 'publishDate' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">查看详情</Button>
        <Button icon={<PrinterOutlined />} size="small">打印</Button>
        <Button icon={<ShareAltOutlined />} size="small">分享</Button>
      </div>
    ),
  },
]

export default function FeePublic() {
  const [modalVisible, setModalVisible] = useState(false)

  const handleViewDetail = () => {
    setModalVisible(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党费公示</h1>
          <p className="text-gray-500 mt-1">查看各党组织党费收缴情况公示</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出公示表</Button>
          <Button icon={<PrinterOutlined />}>打印公示</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="选择党组织" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="org-1">第一党支部</Select.Option>
          <Select.Option value="org-2">第二党支部</Select.Option>
        </Select>
        <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 300 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={publicList}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="党费公示详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={null}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>公示周期</span>
            <span className="font-medium">2024年1月</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>所属组织</span>
            <span className="font-medium">第一党支部</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>应收金额</span>
            <span className="font-medium">¥4,500.00</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>实收金额</span>
            <span className="font-medium text-green-600">¥4,320.00</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>收缴率</span>
            <span className="font-medium">96%</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>公示日期</span>
            <span className="font-medium">2024-01-10</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>公示期限</span>
            <span className="font-medium">2024-01-10 至 2024-01-17</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}