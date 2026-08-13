'use client'

import { useState } from 'react'
import { Card, Table, Button, Select, DatePicker, Input, Tag, Modal, Form, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface NoteItem {
  key: string
  title: string
  author: string
  orgName: string
  courseName: string
  status: string
  submitDate: string
}

const noteList: NoteItem[] = [
  { key: '1', title: '学习习近平新时代中国特色社会主义思想心得体会', author: '王建国', orgName: '第一党支部', courseName: '习近平新时代中国特色社会主义思想', status: '已审核', submitDate: '2024-01-15' },
  { key: '2', title: '党的二十大精神学习感悟', author: '李芳芳', orgName: '第一党支部', courseName: '党的二十大精神学习', status: '已审核', submitDate: '2024-01-14' },
  { key: '3', title: '党史学习教育体会', author: '张志强', orgName: '第二党支部', courseName: '党史学习教育', status: '待审核', submitDate: '2024-01-13' },
  { key: '4', title: '党风廉政建设学习心得', author: '刘建华', orgName: '第二党支部', courseName: '党风廉政建设', status: '待审核', submitDate: '2024-01-12' },
]

const columns: ColumnsType<NoteItem> = [
  { title: '心得体会标题', dataIndex: 'title', key: 'title', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '作者', dataIndex: 'author', key: 'author' },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName' },
  { title: '关联课程', dataIndex: 'courseName', key: 'courseName' },
  {
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '已审核' ? 'green' : 'orange'}>{status}</Tag>,
  },
  { title: '提交日期', dataIndex: 'submitDate', key: 'submitDate' },
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

export default function LearningNotes() {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('心得体会已提交')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">心得体会</h1>
          <p className="text-gray-500 mt-1">管理党员学习心得体会，进行审核和查看</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>提交心得</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="选择党组织" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="org-1">第一党支部</Select.Option>
          <Select.Option value="org-2">第二党支部</Select.Option>
        </Select>
        <Select placeholder="审核状态" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="pending">待审核</Select.Option>
          <Select.Option value="approved">已审核</Select.Option>
        </Select>
        <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 300 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={noteList}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="提交心得体会"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="请输入心得体会标题" />
          </Form.Item>
          <Form.Item name="courseName" label="关联课程">
            <Select placeholder="选择课程">
              <Select.Option value="course-1">习近平新时代中国特色社会主义思想</Select.Option>
              <Select.Option value="course-2">党的二十大精神学习</Select.Option>
              <Select.Option value="course-3">党史学习教育</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <Input.TextArea rows={8} placeholder="请输入心得体会内容..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}