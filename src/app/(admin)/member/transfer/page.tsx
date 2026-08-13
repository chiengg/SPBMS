'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { transferRecords } from '@/data/memberData'

const columns: ColumnsType<typeof transferRecords[0]> = [
  { title: '转接编号', dataIndex: 'id', key: 'id', width: '12%' },
  { title: '党员姓名', dataIndex: 'memberName', key: 'memberName', width: '10%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '转出组织', dataIndex: 'fromOrg', key: 'fromOrg', width: '20%' },
  { title: '转入组织', dataIndex: 'toOrg', key: 'toOrg', width: '20%' },
  { title: '转接原因', dataIndex: 'reason', key: 'reason', width: '15%', render: (text: string) => <Tag color="blue">{text}</Tag> },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '13%',
    render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
  },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: '10%' },
]

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    '待转出审核': 'orange',
    '转出审核通过': 'blue',
    '待转入审核': 'orange',
    '转入审核通过': 'green',
    '跨省转接中': 'cyan',
    '已完成': 'green',
    '已驳回': 'red',
  }
  return colors[status] || 'default'
}

export default function TransferManagement() {
  const [data] = useState(transferRecords)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('转接申请已提交')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">组织关系转接</h1>
          <p className="text-gray-500 mt-1">管理党员组织关系转接，支持系统内转接和跨省转接</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>发起转接</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">待审核</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
            </div>
            <ClockCircleOutlined className="text-orange-500 text-3xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">进行中</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">2</p>
            </div>
            <CheckCircleOutlined className="text-blue-500 text-3xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">已完成</p>
              <p className="text-2xl font-bold text-green-600 mt-1">15</p>
            </div>
            <CheckCircleOutlined className="text-green-500 text-3xl" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">跨省转接</p>
              <p className="text-2xl font-bold text-cyan-600 mt-1">1</p>
            </div>
            <AlertOutlined className="text-cyan-500 text-3xl" />
          </div>
        </Card>
      </div>

      <Card title="转接记录">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="发起组织关系转接"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="memberId"
            label="党员姓名"
            rules={[{ required: true, message: '请选择党员' }]}
          >
            <Select placeholder="请选择党员">
              <Select.Option value="m-006">孙强</Select.Option>
              <Select.Option value="m-007">周丽</Select.Option>
              <Select.Option value="m-008">吴刚</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fromOrg"
            label="转出组织"
            rules={[{ required: true, message: '请选择转出组织' }]}
          >
            <Select placeholder="请选择转出组织">
              <Select.Option value="org-006">第二党支部</Select.Option>
              <Select.Option value="org-009">销售党支部</Select.Option>
              <Select.Option value="org-003">第一党支部</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="toOrg"
            label="转入组织"
            rules={[{ required: true, message: '请选择转入组织' }]}
          >
            <Select placeholder="请选择转入组织">
              <Select.Option value="org-008">生产党支部</Select.Option>
              <Select.Option value="org-002">机关党总支</Select.Option>
              <Select.Option value="cross">跨省/跨系统转接</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="reason"
            label="转接原因"
            rules={[{ required: true, message: '请选择转接原因' }]}
          >
            <Select placeholder="请选择转接原因">
              <Select.Option value="工作调动">工作调动</Select.Option>
              <Select.Option value="毕业">毕业</Select.Option>
              <Select.Option value="退伍">退伍</Select.Option>
              <Select.Option value="居住地变更">居住地变更</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注说明">
            <Input.TextArea rows={3} placeholder="请输入备注说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}