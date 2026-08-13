'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Progress, Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { meetingPlans } from '@/data/meetingData'

const columns: ColumnsType<typeof meetingPlans[0]> = [
  { title: '会议编号', dataIndex: 'id', key: 'id', width: '10%' },
  { title: '会议名称', dataIndex: 'name', key: 'name', width: '25%', render: (text: string) => <span className="font-medium">{text}</span> },
  {
    title: '会议类型',
    dataIndex: 'type',
    key: 'type',
    width: '12%',
    render: (type: string) => <Tag color={getTypeColor(type)}>{type}</Tag>,
  },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '15%' },
  { title: '计划时间', dataIndex: 'planDate', key: 'planDate', width: '12%' },
  { title: '主持人', dataIndex: 'host', key: 'host', width: '8%' },
  {
    title: '参会率',
    key: 'attendance',
    width: '12%',
    render: (_: any, record: typeof meetingPlans[0]) => {
      if (record.status === '计划中') return '-'
      const rate = Math.round((record.attendees / record.totalMembers) * 100)
      return (
        <div className="flex items-center gap-2">
          <Progress percent={rate} size="small" strokeColor={rate >= 90 ? '#10b981' : '#f59e0b'} />
          <span className="text-xs">{rate}%</span>
        </div>
      )
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (status: string) => <Tag color={status === '已完成' ? 'green' : 'blue'}>{status}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    width: '16%',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">详情</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
      </div>
    ),
  },
]

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    '支部大会': 'red',
    '支委会': 'orange',
    '党小组会': 'blue',
    '党课': 'green',
  }
  return colors[type] || 'default'
}

export default function MeetingPlan() {
  const [data] = useState(meetingPlans)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const completedCount = data.filter((m) => m.status === '已完成').length
  const totalCount = data.length

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('会议计划已添加')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">三会一课计划</h1>
          <p className="text-gray-500 mt-1">制定年度会议计划，系统自动校验频次要求</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>新增计划</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">本月计划</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{totalCount}</p>
            </div>
            <CalendarOutlined className="text-blue-500 text-3xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">已完成</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedCount}</p>
            </div>
            <CheckCircleOutlined className="text-green-500 text-3xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">进行中</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{totalCount - completedCount}</p>
            </div>
            <ClockCircleOutlined className="text-orange-500 text-3xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">平均参会率</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">95%</p>
            </div>
            <Progress percent={95} strokeColor="#9333ea" size="small" />
          </div>
        </Card>
      </div>

      <Card title="会议计划列表">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="新增会议计划"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="会议名称"
            rules={[{ required: true, message: '请输入会议名称' }]}
          >
            <Input placeholder="请输入会议名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="会议类型"
            rules={[{ required: true, message: '请选择会议类型' }]}
          >
            <Select placeholder="请选择会议类型">
              <Select.Option value="支部大会">支部大会</Select.Option>
              <Select.Option value="支委会">支委会</Select.Option>
              <Select.Option value="党小组会">党小组会</Select.Option>
              <Select.Option value="党课">党课</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="orgId"
            label="所属组织"
            rules={[{ required: true, message: '请选择组织' }]}
          >
            <Select placeholder="请选择组织">
              <Select.Option value="org-003">第一党支部</Select.Option>
              <Select.Option value="org-006">第二党支部</Select.Option>
              <Select.Option value="org-008">生产党支部</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="planDate"
            label="计划时间"
            rules={[{ required: true, message: '请选择计划时间' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="会议地点">
            <Input placeholder="请输入会议地点" />
          </Form.Item>
          <Form.Item name="host" label="主持人">
            <Input placeholder="请输入主持人姓名" />
          </Form.Item>
          <Form.Item name="description" label="会议内容">
            <Input.TextArea rows={3} placeholder="请输入会议内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}