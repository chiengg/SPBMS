'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { exams } from '@/data/learningData'

const columns: ColumnsType<typeof exams[0]> = [
  { title: '考试编号', dataIndex: 'id', key: 'id', width: '10%' },
  { 
    title: '考试名称', 
    dataIndex: 'title', 
    key: 'title', 
    width: '25%',
    render: (text: string) => <span className="font-medium">{text}</span>
  },
  {
    title: '组卷方式',
    dataIndex: 'type',
    key: 'type',
    width: '12%',
    render: (type: string) => <Tag color={type === '随机组卷' ? 'blue' : 'green'}>{type}</Tag>,
  },
  { title: '时长', dataIndex: 'duration', key: 'duration', width: '8%', render: (d: number) => `${d}分钟` },
  { title: '及格线', dataIndex: 'passScore', key: 'passScore', width: '8%', render: (s: number) => `${s}分` },
  { title: '题目数', dataIndex: 'totalQuestions', key: 'totalQuestions', width: '8%' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (status: string) => <Tag color={status === '进行中' ? 'blue' : status === '已结束' ? 'green' : 'default'}>{status}</Tag>,
  },
  { title: '参与人数', dataIndex: 'participants', key: 'participants', width: '10%' },
  { title: '通过率', dataIndex: 'passRate', key: 'passRate', width: '10%', render: (r: number) => <span className="text-green-600">{r}%</span> },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    render: (_: any, record: typeof exams[0]) => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">详情</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        {record.status === '进行中' && <Button icon={<PlayCircleOutlined />} size="small" type="primary">进入考试</Button>}
      </div>
    ),
  },
]

export default function ExamManagement() {
  const [data] = useState(exams)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('考试已创建')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">在线考试管理</h1>
          <p className="text-gray-500 mt-1">创建考试、管理试卷、查看成绩</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>创建考试</Button>
      </div>

      <Card title="考试列表">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="创建考试"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="考试名称"
            rules={[{ required: true, message: '请输入考试名称' }]}
          >
            <Input placeholder="请输入考试名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="组卷方式"
            rules={[{ required: true, message: '请选择组卷方式' }]}
          >
            <Select placeholder="请选择组卷方式">
              <Select.Option value="随机组卷">随机组卷</Select.Option>
              <Select.Option value="固定组卷">固定组卷</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="考试时长（分钟）">
            <Input type="number" placeholder="请输入考试时长" />
          </Form.Item>
          <Form.Item name="passScore" label="及格线（分）">
            <Input type="number" placeholder="请输入及格线" />
          </Form.Item>
          <Form.Item name="totalQuestions" label="题目数量">
            <Input type="number" placeholder="请输入题目数量" />
          </Form.Item>
          <Form.Item name="description" label="考试说明">
            <Input.TextArea rows={3} placeholder="请输入考试说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}