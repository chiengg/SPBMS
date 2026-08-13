'use client'

import { useState } from 'react'
import { Card, Table, Button, Select, DatePicker, Tag, Modal } from 'antd'
import { EyeOutlined, FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface MeetingRecord {
  key: string
  name: string
  type: string
  date: string
  location: string
  host: string
  participants: number
  status: string
}

const meetingRecords: MeetingRecord[] = [
  { key: '1', name: '第一党支部党员大会', type: '党员大会', date: '2024-01-15', location: '党员活动室', host: '王建国', participants: 45, status: '已完成' },
  { key: '2', name: '第二党支部支委会', type: '支委会', date: '2024-01-14', location: '会议室301', host: '李芳芳', participants: 5, status: '已完成' },
  { key: '3', name: '机关党总支党课', type: '党课', date: '2024-01-16', location: '大会议室', host: '张志强', participants: 0, status: '未开始' },
  { key: '4', name: '生产党支部党小组会', type: '党小组会', date: '2024-01-17', location: '车间会议室', host: '刘建华', participants: 0, status: '未开始' },
]

const columns: ColumnsType<MeetingRecord> = [
  { title: '会议名称', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '会议类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === '党员大会' ? 'red' : type === '支委会' ? 'orange' : type === '党课' ? 'blue' : 'green'}>{type}</Tag> },
  { title: '会议日期', dataIndex: 'date', key: 'date' },
  { title: '会议地点', dataIndex: 'location', key: 'location' },
  { title: '主持人', dataIndex: 'host', key: 'host' },
  { title: '参与人数', dataIndex: 'participants', key: 'participants' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '已完成' ? 'green' : 'orange'}>{status}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">查看记录</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </div>
    ),
  },
]

export default function MeetingList() {
  const [modalVisible, setModalVisible] = useState(false)

  const handleViewRecord = () => {
    setModalVisible(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">会议记录</h1>
          <p className="text-gray-500 mt-1">查看和管理所有组织生活会议记录</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出会议纪要</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="选择党组织" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="org-1">第一党支部</Select.Option>
          <Select.Option value="org-2">第二党支部</Select.Option>
        </Select>
        <Select placeholder="会议类型" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="党员大会">党员大会</Select.Option>
          <Select.Option value="支委会">支委会</Select.Option>
          <Select.Option value="党小组会">党小组会</Select.Option>
          <Select.Option value="党课">党课</Select.Option>
        </Select>
        <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 300 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={meetingRecords}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="会议记录详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={null}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>会议名称</span>
            <span className="font-medium">第一党支部党员大会</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>会议类型</span>
            <Tag color="red">党员大会</Tag>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>会议日期</span>
            <span className="font-medium">2024-01-15</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>会议地点</span>
            <span className="font-medium">党员活动室</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>主持人</span>
            <span className="font-medium">王建国</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>参与人数</span>
            <span className="font-medium">45人</span>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <span className="block mb-2">会议内容：</span>
            <p className="text-gray-600">本次党员大会主要学习了习近平总书记在二十届中央纪委二次全会上的重要讲话精神，通报了2023年度支部工作情况，并对2024年工作进行了部署...</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}