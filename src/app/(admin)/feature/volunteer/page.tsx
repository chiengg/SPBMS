'use client'

import { useState } from 'react'
import { Card, Row, Col, Table, Button, Select, DatePicker, Tag, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined, ClockCircleOutlined, MapPinOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface VolunteerActivity {
  key: string
  title: string
  orgName: string
  location: string
  startTime: string
  participants: number
  status: string
}

const activityList: VolunteerActivity[] = [
  { key: '1', title: '社区卫生大扫除', orgName: '第一党支部', location: '幸福社区', startTime: '2024-01-20 09:00', participants: 20, status: '报名中' },
  { key: '2', title: '关爱孤寡老人', orgName: '第二党支部', location: '阳光社区', startTime: '2024-01-21 14:00', participants: 15, status: '报名中' },
  { key: '3', title: '文明交通劝导', orgName: '机关党总支', location: '市中心广场', startTime: '2024-01-22 08:00', participants: 25, status: '已结束' },
]

const columns: ColumnsType<VolunteerActivity> = [
  { title: '活动名称', dataIndex: 'title', key: 'title', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '发起组织', dataIndex: 'orgName', key: 'orgName' },
  { title: '活动地点', dataIndex: 'location', key: 'location' },
  { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
  { title: '参与人数', dataIndex: 'participants', key: 'participants', render: (n: number) => <span className="text-green-600">{n}人</span> },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '报名中' ? 'blue' : 'green'}>{status}</Tag>,
  },
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

export default function VolunteerService() {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('志愿服务活动已创建')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">志愿服务</h1>
          <p className="text-gray-500 mt-1">组织和管理党员志愿服务活动</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>创建活动</Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserOutlined className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">注册志愿者</p>
                <p className="text-2xl font-bold text-gray-800">125</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ClockCircleOutlined className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">累计服务时长</p>
                <p className="text-2xl font-bold text-gray-800">2,580小时</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPinOutlined className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">活动次数</p>
                <p className="text-2xl font-bold text-gray-800">48次</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="选择组织" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="org-1">第一党支部</Select.Option>
          <Select.Option value="org-2">第二党支部</Select.Option>
        </Select>
        <Select placeholder="活动状态" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="recruiting">报名中</Select.Option>
          <Select.Option value="ended">已结束</Select.Option>
        </Select>
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={activityList}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="创建志愿服务活动"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="活动名称" rules={[{ required: true }]}>
            <Input placeholder="请输入活动名称" />
          </Form.Item>
          <Form.Item name="orgName" label="发起组织" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="org-1">第一党支部</Select.Option>
              <Select.Option value="org-2">第二党支部</Select.Option>
              <Select.Option value="org-3">机关党总支</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="location" label="活动地点" rules={[{ required: true }]}>
            <Input placeholder="请输入活动地点" />
          </Form.Item>
          <Form.Item name="startTime" label="开始时间" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}