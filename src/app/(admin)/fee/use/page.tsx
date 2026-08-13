'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { feeUseRecords } from '@/data/feeData'

const columns: ColumnsType<typeof feeUseRecords[0]> = [
  { title: '申请编号', dataIndex: 'id', key: 'id', width: '12%' },
  { title: '申请组织', dataIndex: 'orgName', key: 'orgName', width: '18%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '申请金额', dataIndex: 'amount', key: 'amount', width: '15%', render: (a: number) => <span className="text-red-600 font-medium">¥{a}</span> },
  { title: '使用用途', dataIndex: 'purpose', key: 'purpose', width: '25%' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '12%',
    render: (status: string) => <Tag color={status === '已审批' ? 'green' : 'orange'}>{status}</Tag>,
  },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: '18%' },
  {
    title: '操作',
    key: 'action',
    width: '20%',
    render: (_: any, record: typeof feeUseRecords[0]) => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">详情</Button>
        {record.status === '待审批' && (
          <>
            <Button icon={<CheckOutlined />} size="small" type="primary">通过</Button>
            <Button icon={<CloseOutlined />} size="small" danger>驳回</Button>
          </>
        )}
      </div>
    ),
  },
]

export default function FeeUse() {
  const [data] = useState(feeUseRecords)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('党费使用申请已提交')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党费使用管理</h1>
          <p className="text-gray-500 mt-1">审批党费使用申请，管理党费支出</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>申请使用</Button>
      </div>

      <Card title="党费使用申请">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="申请使用党费"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="orgId"
            label="申请组织"
            rules={[{ required: true, message: '请选择申请组织' }]}
          >
            <Select placeholder="请选择申请组织">
              <Select.Option value="org-003">第一党支部</Select.Option>
              <Select.Option value="org-006">第二党支部</Select.Option>
              <Select.Option value="org-002">机关党总支</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="申请金额（元）"
            rules={[{ required: true, message: '请输入申请金额' }]}
          >
            <Input type="number" placeholder="请输入申请金额" />
          </Form.Item>
          <Form.Item
            name="purpose"
            label="使用用途"
            rules={[{ required: true, message: '请输入使用用途' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入使用用途" />
          </Form.Item>
          <Form.Item name="attachment" label="附件材料">
            <Input type="file" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}