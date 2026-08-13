'use client'

import { useState } from 'react'
import { Card, Table, Button, Input, Select, DatePicker, Form, message, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CalculatorOutlined, FileTextOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface CalculateItem {
  key: string
  name: string
  orgName: string
  baseSalary: string
  rate: string
  amount: string
  status: string
}

const calculateList: CalculateItem[] = [
  { key: '1', name: '王建国', orgName: '第一党支部', baseSalary: '¥8,500', rate: '0.5%', amount: '¥42.50', status: '已核算' },
  { key: '2', name: '李芳芳', orgName: '第一党支部', baseSalary: '¥7,200', rate: '0.5%', amount: '¥36.00', status: '已核算' },
  { key: '3', name: '张志强', orgName: '第二党支部', baseSalary: '¥9,800', rate: '1%', amount: '¥98.00', status: '已核算' },
  { key: '4', name: '刘建华', orgName: '第二党支部', baseSalary: '¥6,500', rate: '0.5%', amount: '¥32.50', status: '待核算' },
]

const columns: ColumnsType<CalculateItem> = [
  { title: '党员姓名', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName' },
  { title: '工资基数', dataIndex: 'baseSalary', key: 'baseSalary' },
  { title: '缴纳比例', dataIndex: 'rate', key: 'rate' },
  { title: '核算金额', dataIndex: 'amount', key: 'amount', render: (text: string) => <span className="font-bold text-primary-600">{text}</span> },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <span className={status === '已核算' ? 'text-green-600' : 'text-orange-600'}>{status}</span>,
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </div>
    ),
  },
]

export default function FeeCalculate() {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleBatchCalculate = () => {
    message.success('批量核算完成')
  }

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('核算标准已保存')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党费核算</h1>
          <p className="text-gray-500 mt-1">管理党费计算标准，进行批量核算</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<FileTextOutlined />}>导出核算表</Button>
          <Button icon={<CalculatorOutlined />} onClick={handleBatchCalculate}>批量核算</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增核算标准</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select placeholder="选择党组织" style={{ width: 200 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="org-1">第一党支部</Select.Option>
          <Select.Option value="org-2">第二党支部</Select.Option>
        </Select>
        <DatePicker placeholder="选择月份" style={{ width: 200 }} />
        <Button type="primary">查询</Button>
      </div>

      <Card>
        <Table
          dataSource={calculateList}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="新增核算标准"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="orgId" label="所属组织" rules={[{ required: true }]}>
            <Select placeholder="请选择党组织">
              <Select.Option value="org-1">第一党支部</Select.Option>
              <Select.Option value="org-2">第二党支部</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="name" label="党员姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入党员姓名" />
          </Form.Item>
          <Form.Item name="baseSalary" label="工资基数" rules={[{ required: true }]}>
            <Input placeholder="请输入工资基数" />
          </Form.Item>
          <Form.Item name="rate" label="缴纳比例" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="0.5%">0.5%</Select.Option>
              <Select.Option value="1%">1%</Select.Option>
              <Select.Option value="1.5%">1.5%</Select.Option>
              <Select.Option value="2%">2%</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}