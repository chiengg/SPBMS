'use client'

import { useState } from 'react'
import { Card, Tag, Button, Modal, Form, Input, DatePicker, Select, message, Row, Col } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, CalendarOutlined, UsersOutlined, EyeOutlined as EyeIcon, PictureOutlined } from '@ant-design/icons'
import { themeActivities } from '@/data/meetingData'

export default function ThemeActivity() {
  const [data] = useState(themeActivities)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('主题党日活动已发布')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">主题党日活动</h1>
          <p className="text-gray-500 mt-1">发布主题党日活动，管理报名与纪实</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>发布活动</Button>
      </div>

      <Row gutter={[16, 16]}>
        {data.map((activity) => (
          <Col xs={24} sm={12} lg={6} key={activity.key}>
            <Card
              className="h-full hover:shadow-lg transition-shadow cursor-pointer"
              actions={[
                <EyeOutlined key="view" />,
                <EditOutlined key="edit" />,
              ]}
            >
              <div className="mb-3">
                <Tag color={activity.status === '已完成' ? 'green' : activity.status === '进行中' ? 'blue' : 'orange'}>
                  {activity.status}
                </Tag>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{activity.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{activity.orgName}</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarOutlined className="text-gray-400" />
                  <span>{activity.activityDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <UsersOutlined className="text-gray-400" />
                  <span>{activity.participants}人参与</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <EyeIcon className="text-gray-400" />
                  <span>{activity.views}次浏览</span>
                </div>
                {activity.images > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <PictureOutlined className="text-gray-400" />
                    <span>{activity.images}张照片</span>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="发布主题党日活动"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="活动标题"
            rules={[{ required: true, message: '请输入活动标题' }]}
          >
            <Input placeholder="请输入活动标题" />
          </Form.Item>
          <Form.Item
            name="orgId"
            label="发起组织"
            rules={[{ required: true, message: '请选择发起组织' }]}
          >
            <Select placeholder="请选择发起组织">
              <Select.Option value="org-003">第一党支部</Select.Option>
              <Select.Option value="org-006">第二党支部</Select.Option>
              <Select.Option value="org-002">机关党总支</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="activityDate"
            label="活动日期"
            rules={[{ required: true, message: '请选择活动日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="活动地点">
            <Input placeholder="请输入活动地点" />
          </Form.Item>
          <Form.Item name="description" label="活动内容">
            <Input.TextArea rows={4} placeholder="请输入活动内容描述" />
          </Form.Item>
          <Form.Item name="requirements" label="报名要求">
            <Input.TextArea rows={2} placeholder="请输入报名要求" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}