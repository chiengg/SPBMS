'use client'

import { useState } from 'react'
import { Card, Table, Button, Select, DatePicker, Tag, Modal } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface FloatingMember {
  key: string
  name: string
  idCard: string
  originalOrg: string
  currentLocation: string
  contact: string
  status: string
  floatDate: string
}

const floatingMembers: FloatingMember[] = [
  { key: '1', name: '孙强', idCard: '320XXXXXXXXXXXX1234', originalOrg: '第二党支部', currentLocation: '上海市浦东新区', contact: '138XXXX1234', status: '流出', floatDate: '2024-01-01' },
  { key: '2', name: '李娜', idCard: '310XXXXXXXXXXXX5678', originalOrg: '机关党总支', currentLocation: '北京市朝阳区', contact: '139XXXX5678', status: '流出', floatDate: '2023-12-15' },
  { key: '3', name: '王浩', idCard: '210XXXXXXXXXXXX9012', originalOrg: '第一党支部', currentLocation: '广东省深圳市', contact: '137XXXX9012', status: '流出', floatDate: '2024-01-10' },
]

const columns: ColumnsType<FloatingMember> = [
  { title: '姓名', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '身份证号', dataIndex: 'idCard', key: 'idCard' },
  { title: '原所属组织', dataIndex: 'originalOrg', key: 'originalOrg' },
  { title: '当前地点', dataIndex: 'currentLocation', key: 'currentLocation' },
  { title: '联系方式', dataIndex: 'contact', key: 'contact' },
  {
    title: '流动状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color="orange">{status}</Tag>,
  },
  { title: '流动日期', dataIndex: 'floatDate', key: 'floatDate' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">查看详情</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </div>
    ),
  },
]

export default function FloatingMembers() {
  const [modalVisible, setModalVisible] = useState(false)

  const handleViewDetail = () => {
    setModalVisible(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">流动党员管理</h1>
          <p className="text-gray-500 mt-1">管理流出、流入党员信息，跟踪联系情况</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出名单</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="选择原组织" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="org-1">第一党支部</Select.Option>
          <Select.Option value="org-2">第二党支部</Select.Option>
        </Select>
        <Select placeholder="流动状态" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="out">流出</Select.Option>
          <Select.Option value="in">流入</Select.Option>
        </Select>
        <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 300 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={floatingMembers}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="流动党员详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={null}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>姓名</span>
            <span className="font-medium">孙强</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>身份证号</span>
            <span className="font-medium">320XXXXXXXXXXXX1234</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>原所属组织</span>
            <span className="font-medium">第二党支部</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>当前地点</span>
            <span className="font-medium">上海市浦东新区</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>联系方式</span>
            <span className="font-medium">138XXXX1234</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>流动状态</span>
            <Tag color="orange">流出</Tag>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>流动日期</span>
            <span className="font-medium">2024-01-01</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}