'use client'

import { useState } from 'react'
import { Card, Table, Button, Select, DatePicker, Tag, Modal } from 'antd'
import { EyeOutlined, EditOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface ReportItem {
  key: string
  name: string
  orgName: string
  community: string
  reportDate: string
  serviceHours: number
  status: string
}

const reportList: ReportItem[] = [
  { key: '1', name: '王建国', orgName: '第一党支部', community: '幸福社区', reportDate: '2024-01-15', serviceHours: 8, status: '已报到' },
  { key: '2', name: '李芳芳', orgName: '第一党支部', community: '阳光社区', reportDate: '2024-01-14', serviceHours: 6, status: '已报到' },
  { key: '3', name: '张志强', orgName: '第二党支部', community: '和谐社区', reportDate: '2024-01-13', serviceHours: 4, status: '已报到' },
]

const columns: ColumnsType<ReportItem> = [
  { title: '姓名', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName' },
  { title: '报到社区', dataIndex: 'community', key: 'community' },
  { title: '报到日期', dataIndex: 'reportDate', key: 'reportDate' },
  { title: '服务时长(小时)', dataIndex: 'serviceHours', key: 'serviceHours' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color="green">{status}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">查看详情</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
      </div>
    ),
  },
]

export default function DoubleReport() {
  const [modalVisible, setModalVisible] = useState(false)

  const handleViewDetail = () => {
    setModalVisible(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">双报到双服务</h1>
          <p className="text-gray-500 mt-1">党员到社区报到，开展志愿服务活动</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出报到记录</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="选择党组织" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="org-1">第一党支部</Select.Option>
          <Select.Option value="org-2">第二党支部</Select.Option>
        </Select>
        <Select placeholder="选择社区" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="comm-1">幸福社区</Select.Option>
          <Select.Option value="comm-2">阳光社区</Select.Option>
        </Select>
        <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 300 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={reportList}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="报到详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={null}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>姓名</span>
            <span className="font-medium">王建国</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>所属组织</span>
            <span className="font-medium">第一党支部</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>报到社区</span>
            <span className="font-medium">幸福社区</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>报到日期</span>
            <span className="font-medium">2024-01-15</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>服务时长</span>
            <span className="font-medium">8小时</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>服务内容</span>
            <span className="font-medium">社区环境卫生整治、看望孤寡老人</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}