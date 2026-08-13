'use client'

import { useState } from 'react'
import { Card, Tag, Button, Progress, Modal, Form, Input, Select, DatePicker, message, Row, Col } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined } from '@ant-design/icons'
import { lifeMeetings } from '@/data/meetingData'

export default function LifeMeeting() {
  const [data] = useState(lifeMeetings)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('组织生活会已创建')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">组织生活会</h1>
          <p className="text-gray-500 mt-1">管理组织生活会与民主评议，跟踪问题整改</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>创建会议</Button>
      </div>

      <Row gutter={[16, 16]}>
        {data.map((meeting) => (
          <Col xs={24} sm={12} lg={8} key={meeting.key}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-3">
                <Tag color={meeting.status === '已完成' ? 'green' : meeting.status === '整改中' ? 'orange' : 'blue'}>
                  {meeting.status}
                </Tag>
                <div className="flex gap-2">
                  <Button icon={<EyeOutlined />} size="small" />
                  <Button icon={<EditOutlined />} size="small" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{meeting.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{meeting.orgName}</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">问题数量</span>
                    <span className="font-medium text-gray-800">{meeting.problems}个</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">整改进度</span>
                    <span className="font-medium text-gray-800">{meeting.completedTasks}/{meeting.totalTasks}</span>
                  </div>
                  <Progress 
                    percent={meeting.totalTasks > 0 ? Math.round((meeting.completedTasks / meeting.totalTasks) * 100) : 0} 
                    strokeColor={meeting.status === '已完成' ? '#10b981' : '#f59e0b'} 
                  />
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">召开时间：{meeting.meetingDate}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="创建组织生活会"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="会议标题"
            rules={[{ required: true, message: '请输入会议标题' }]}
          >
            <Input placeholder="请输入会议标题" />
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
            name="meetingDate"
            label="计划时间"
            rules={[{ required: true, message: '请选择计划时间' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="会议地点">
            <Input placeholder="请输入会议地点" />
          </Form.Item>
          <Form.Item name="description" label="会议方案">
            <Input.TextArea rows={4} placeholder="请输入会议方案" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}