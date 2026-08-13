'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Progress, Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { tasks } from '@/data/learningData'

const columns: ColumnsType<typeof tasks[0]> = [
  { title: '任务编号', dataIndex: 'id', key: 'id', width: '10%' },
  { 
    title: '任务名称', 
    dataIndex: 'title', 
    key: 'title', 
    width: '25%',
    render: (text: string) => <span className="font-medium">{text}</span>
  },
  { title: '下发组织', dataIndex: 'orgName', key: 'orgName', width: '18%' },
  { title: '截止日期', dataIndex: 'deadline', key: 'deadline', width: '12%' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (status: string) => <Tag color={status === '进行中' ? 'blue' : status === '已结束' ? 'green' : 'default'}>{status}</Tag>,
  },
  {
    title: '完成进度',
    key: 'progress',
    width: '18%',
    render: (_: any, record: typeof tasks[0]) => (
      <div className="flex items-center gap-2">
        <Progress percent={record.progress} size="small" strokeColor="#dc2626" />
        <span className="text-xs">{record.completedCount}/{record.assignedCount}</span>
      </div>
    ),
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

export default function LearningTasks() {
  const [data] = useState(tasks)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('学习任务已下发')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">学习任务管理</h1>
          <p className="text-gray-500 mt-1">下发学习任务，跟踪学习进度</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>下发任务</Button>
      </div>

      <Card title="学习任务列表">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="下发学习任务"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item
            name="orgId"
            label="下发组织"
            rules={[{ required: true, message: '请选择下发组织' }]}
          >
            <Select placeholder="请选择下发组织">
              <Select.Option value="org-001">中共XX市委员会</Select.Option>
              <Select.Option value="org-002">机关党总支</Select.Option>
              <Select.Option value="org-007">企业党总支</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="deadline"
            label="截止日期"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="任务说明">
            <Input.TextArea rows={3} placeholder="请输入任务说明" />
          </Form.Item>
          <Form.Item name="courseIds" label="关联课程">
            <Select mode="multiple" placeholder="请选择课程">
              <Select.Option value="c-001">党的二十大精神专题学习</Select.Option>
              <Select.Option value="c-002">习近平新时代中国特色社会主义思想</Select.Option>
              <Select.Option value="c-003">党史学习教育专题</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}