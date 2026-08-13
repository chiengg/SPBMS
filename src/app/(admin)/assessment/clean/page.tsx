'use client'

import { useState } from 'react'
import { Card, Row, Col, Table, Button, Select, DatePicker, Tag, Modal, Input, Form, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, FileTextOutlined, AlertCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface CleanItem {
  key: string
  title: string
  type: string
  status: string
  responsible: string
  deadline: string
  createDate: string
}

const cleanItems: CleanItem[] = [
  { key: '1', title: '开展廉洁从业专项教育', type: '教育活动', status: '进行中', responsible: '王建国', deadline: '2024-02-28', createDate: '2024-01-01' },
  { key: '2', title: '岗位廉政风险排查', type: '风险防控', status: '已完成', responsible: '李芳芳', deadline: '2024-01-15', createDate: '2023-12-01' },
  { key: '3', title: '违规违纪案例学习', type: '教育活动', status: '待启动', responsible: '张志强', deadline: '2024-03-15', createDate: '2024-01-10' },
]

const columns: ColumnsType<CleanItem> = [
  { title: '事项名称', dataIndex: 'title', key: 'title', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '事项类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === '教育活动' ? 'blue' : 'orange'}>{type}</Tag> },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '已完成' ? 'green' : status === '进行中' ? 'blue' : 'orange'}>{status}</Tag>,
  },
  { title: '责任人', dataIndex: 'responsible', key: 'responsible' },
  { title: '截止日期', dataIndex: 'deadline', key: 'deadline' },
  { title: '创建日期', dataIndex: 'createDate', key: 'createDate' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">查看</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
      </div>
    ),
  },
]

export default function CleanGovernment() {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('党风廉政事项已创建')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党风廉政</h1>
          <p className="text-gray-500 mt-1">开展廉政教育、风险防控和监督检查</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出报表</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增事项</Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircleOutlined className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">廉政教育活动</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircleOutlined className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">风险排查项</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <AlertCircleOutlined className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">已完成事项</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="事项类型" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="education">教育活动</Select.Option>
          <Select.Option value="risk">风险防控</Select.Option>
        </Select>
        <Select placeholder="状态" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
          <Select.Option value="ongoing">进行中</Select.Option>
          <Select.Option value="pending">待启动</Select.Option>
        </Select>
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={cleanItems}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="新增党风廉政事项"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="事项名称" rules={[{ required: true }]}>
            <Input placeholder="请输入事项名称" />
          </Form.Item>
          <Form.Item name="type" label="事项类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="education">教育活动</Select.Option>
              <Select.Option value="risk">风险防控</Select.Option>
              <Select.Option value="inspection">监督检查</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="responsible" label="责任人" rules={[{ required: true }]}>
            <Input placeholder="请输入责任人" />
          </Form.Item>
          <Form.Item name="deadline" label="截止日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}