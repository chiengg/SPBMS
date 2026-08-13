'use client'

import { useState } from 'react'
import { Card, List, Button, Select, DatePicker, Input, Tag, Modal, Form, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons'

interface NewsItem {
  key: string
  title: string
  category: string
  author: string
  publishDate: string
  views: number
  status: string
}

const newsList: NewsItem[] = [
  { key: '1', title: '习近平总书记在二十届中央纪委二次全会上发表重要讲话', category: '重要讲话', author: '系统管理员', publishDate: '2024-01-15', views: 1256, status: '已发布' },
  { key: '2', title: '学习贯彻党的二十大精神专题培训开班', category: '学习动态', author: '组织部门', publishDate: '2024-01-14', views: 856, status: '已发布' },
  { key: '3', title: '2024年度党建工作计划', category: '工作动态', author: '党委办公室', publishDate: '2024-01-13', views: 623, status: '已发布' },
  { key: '4', title: '党风廉政建设工作会议召开', category: '廉政建设', author: '纪检部门', publishDate: '2024-01-12', views: 542, status: '已发布' },
]

export default function PortalNews() {
  const [searchValue, setSearchValue] = useState('')
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const filteredNews = newsList.filter((item) => {
    return item.title.includes(searchValue) || item.author.includes(searchValue)
  })

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('新闻资讯已发布')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党建资讯</h1>
          <p className="text-gray-500 mt-1">发布和管理党建相关新闻资讯</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>发布新闻</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索新闻标题..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select placeholder="新闻分类" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="important">重要讲话</Select.Option>
          <Select.Option value="learning">学习动态</Select.Option>
          <Select.Option value="work">工作动态</Select.Option>
          <Select.Option value="clean">廉政建设</Select.Option>
        </Select>
        <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 300 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <List
          dataSource={filteredNews}
          renderItem={(item) => (
            <List.Item
              key={item.key}
              className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <Tag color={item.category === '重要讲话' ? 'red' : item.category === '学习动态' ? 'blue' : item.category === '工作动态' ? 'green' : 'orange'}>
                    {item.category}
                  </Tag>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>作者：{item.author}</span>
                  <span>{item.publishDate}</span>
                  <span>阅读：{item.views}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button icon={<EyeOutlined />} size="small">查看</Button>
                <Button icon={<EditOutlined />} size="small">编辑</Button>
                <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="发布新闻资讯"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="新闻标题" rules={[{ required: true }]}>
            <Input placeholder="请输入新闻标题" />
          </Form.Item>
          <Form.Item name="category" label="新闻分类" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="important">重要讲话</Select.Option>
              <Select.Option value="learning">学习动态</Select.Option>
              <Select.Option value="work">工作动态</Select.Option>
              <Select.Option value="clean">廉政建设</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="新闻内容" rules={[{ required: true }]}>
            <Input.TextArea rows={8} placeholder="请输入新闻内容..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}