'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Input, Select, Modal, Form, message } from 'antd'
import { PlusOutlined, SearchOutlined, PlayCircleOutlined, FileTextOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { courses } from '@/data/learningData'

const columns: ColumnsType<typeof courses[0]> = [
  { title: '课程编号', dataIndex: 'id', key: 'id', width: '10%' },
  { 
    title: '课程名称', 
    dataIndex: 'title', 
    key: 'title', 
    width: '25%',
    render: (text: string) => <span className="font-medium">{text}</span>
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: '10%',
    render: (type: string) => (
      <span className="flex items-center gap-1">
        {type === '视频' ? <PlayCircleOutlined className="text-red-500" /> : <FileTextOutlined className="text-blue-500" />}
        <span>{type}</span>
      </span>
    ),
  },
  { title: '时长', dataIndex: 'duration', key: 'duration', width: '10%' },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: '12%',
    render: (category: string) => <Tag color={getCategoryColor(category)}>{category}</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (status: string) => <Tag color={status === '已发布' ? 'green' : 'orange'}>{status}</Tag>,
  },
  { title: '学习人数', dataIndex: 'learners', key: 'learners', width: '10%' },
  {
    title: '完成率',
    dataIndex: 'completionRate',
    key: 'completionRate',
    width: '12%',
    render: (rate: number) => <span className="text-green-600 font-medium">{rate}%</span>,
  },
  {
    title: '操作',
    key: 'action',
    width: '16%',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">预览</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
      </div>
    ),
  },
]

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    '政治理论': 'red',
    '党史党建': 'orange',
    '党规党纪': 'blue',
    '业务知识': 'green',
  }
  return colors[category] || 'default'
}

export default function LearningResources() {
  const [searchValue, setSearchValue] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const filteredData = courses.filter((item) => {
    const matchSearch = item.title.includes(searchValue) || item.id.includes(searchValue)
    const matchType = !typeFilter || item.type === typeFilter
    return matchSearch && matchType
  })

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('课程已添加')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">学习资源库</h1>
          <p className="text-gray-500 mt-1">管理学习资源，发布课程供党员学习</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>上传课程</Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索课程名称..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="筛选类型"
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 120 }}
            options={[
              { value: '', label: '全部' },
              { value: '视频', label: '视频' },
              { value: '文档', label: '文档' },
            ]}
          />
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="上传课程"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="课程类型"
            rules={[{ required: true, message: '请选择课程类型' }]}
          >
            <Select placeholder="请选择课程类型">
              <Select.Option value="视频">视频</Select.Option>
              <Select.Option value="文档">文档</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="category"
            label="课程分类"
            rules={[{ required: true, message: '请选择课程分类' }]}
          >
            <Select placeholder="请选择课程分类">
              <Select.Option value="政治理论">政治理论</Select.Option>
              <Select.Option value="党史党建">党史党建</Select.Option>
              <Select.Option value="党规党纪">党规党纪</Select.Option>
              <Select.Option value="业务知识">业务知识</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="课程时长">
            <Input placeholder="请输入课程时长，如：45分钟" />
          </Form.Item>
          <Form.Item name="description" label="课程简介">
            <Input.TextArea rows={3} placeholder="请输入课程简介" />
          </Form.Item>
          <Form.Item name="file" label="上传文件">
            <Input type="file" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}