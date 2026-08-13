'use client'

import { useState } from 'react'
import { Card, Row, Col, Table, Button, Select, DatePicker, Tag, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface PeopleItem {
  key: string
  title: string
  requester: string
  orgName: string
  category: string
  status: string
  createDate: string
  completeDate?: string
}

const peopleList: PeopleItem[] = [
  { key: '1', title: '解决社区老年人买菜难问题', requester: '张大爷', orgName: '第一党支部', category: '民生服务', status: '已完成', createDate: '2024-01-01', completeDate: '2024-01-10' },
  { key: '2', title: '修复小区路灯照明', requester: '李阿姨', orgName: '第二党支部', category: '基础设施', status: '已完成', createDate: '2024-01-05', completeDate: '2024-01-12' },
  { key: '3', title: '帮助困难家庭子女助学', requester: '王老师', orgName: '机关党总支', category: '教育帮扶', status: '进行中', createDate: '2024-01-10' },
  { key: '4', title: '开展健康义诊活动', requester: '社区居民', orgName: '生产党支部', category: '医疗服务', status: '待处理', createDate: '2024-01-15' },
]

const columns: ColumnsType<PeopleItem> = [
  { title: '事项名称', dataIndex: 'title', key: 'title', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '申请人', dataIndex: 'requester', key: 'requester' },
  { title: '承办组织', dataIndex: 'orgName', key: 'orgName' },
  { title: '事项类别', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color={cat === '民生服务' ? 'blue' : cat === '基础设施' ? 'orange' : cat === '教育帮扶' ? 'green' : 'purple'}>{cat}</Tag> },
  {
    title: '办理状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '已完成' ? 'green' : status === '进行中' ? 'blue' : 'orange'}>{status}</Tag>,
  },
  { title: '创建日期', dataIndex: 'createDate', key: 'createDate' },
  { title: '完成日期', dataIndex: 'completeDate', key: 'completeDate' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">查看</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </div>
    ),
  },
]

export default function PeopleService() {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('事项已登记')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">我为群众办实事</h1>
          <p className="text-gray-500 mt-1">收集和解决群众需求，践行为民服务宗旨</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>登记事项</Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserOutlined className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">总事项数</p>
                <p className="text-2xl font-bold text-gray-800">48</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleOutlined className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">已完成</p>
                <p className="text-2xl font-bold text-gray-800">35</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <ClockCircleOutlined className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">进行中</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <ClockCircleOutlined className="text-gray-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">待处理</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="事项类别" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="living">民生服务</Select.Option>
          <Select.Option value="infrastructure">基础设施</Select.Option>
          <Select.Option value="education">教育帮扶</Select.Option>
          <Select.Option value="medical">医疗服务</Select.Option>
        </Select>
        <Select placeholder="办理状态" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
          <Select.Option value="ongoing">进行中</Select.Option>
          <Select.Option value="pending">待处理</Select.Option>
        </Select>
        <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 300 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={peopleList}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="登记办实事事项"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="事项名称" rules={[{ required: true }]}>
            <Input placeholder="请输入事项名称" />
          </Form.Item>
          <Form.Item name="requester" label="申请人" rules={[{ required: true }]}>
            <Input placeholder="请输入申请人" />
          </Form.Item>
          <Form.Item name="category" label="事项类别" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="living">民生服务</Select.Option>
              <Select.Option value="infrastructure">基础设施</Select.Option>
              <Select.Option value="education">教育帮扶</Select.Option>
              <Select.Option value="medical">医疗服务</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="orgName" label="承办组织" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="org-1">第一党支部</Select.Option>
              <Select.Option value="org-2">第二党支部</Select.Option>
              <Select.Option value="org-3">机关党总支</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}