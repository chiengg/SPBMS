'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, message, Row, Col, Progress } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, CheckCircleOutlined, AlertOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { branchAssessments } from '@/data/assessmentData'

const columns: ColumnsType<typeof branchAssessments[0]> = [
  { title: '组织编号', dataIndex: 'id', key: 'id', width: '12%' },
  { title: '组织名称', dataIndex: 'name', key: 'name', width: '25%', render: (text: string) => <span className="font-medium">{text}</span> },
  { 
    title: '考核得分', 
    dataIndex: 'score', 
    key: 'score', 
    width: '12%',
    render: (score: number) => <span className={`font-bold ${score >= 90 ? 'text-green-600' : score >= 80 ? 'text-blue-600' : score >= 70 ? 'text-orange-600' : 'text-red-600'}`}>{score}</span>,
  },
  { 
    title: '评定等级', 
    dataIndex: 'level', 
    key: 'level', 
    width: '12%',
    render: (level: string) => <Tag color={level === '优秀' ? 'green' : level === '良好' ? 'blue' : 'orange'}>{level}</Tag>,
  },
  { title: '考核时间', dataIndex: 'evaluationDate', key: 'evaluationDate', width: '15%' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '12%',
    render: (status: string) => (
      <span className={`flex items-center gap-1 ${status === '已完成' ? 'text-green-600' : 'text-orange-600'}`}>
        {status === '已完成' ? <CheckCircleOutlined /> : <AlertOutlined />}
        <span>{status}</span>
      </span>
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

export default function BranchAssessment() {
  const [data] = useState(branchAssessments)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const excellentCount = data.filter((b) => b.level === '优秀').length
  const goodCount = data.filter((b) => b.level === '良好').length
  const passCount = data.filter((b) => b.level === '合格').length
  const avgScore = Math.round(data.reduce((sum, b) => sum + b.score, 0) / data.length)

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('考核任务已创建')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">支部考核管理</h1>
          <p className="text-gray-500 mt-1">考核支部工作，评定等级</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>发起考核</Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">优秀</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{excellentCount}</p>
              </div>
              <Progress percent={Math.round((excellentCount / data.length) * 100)} strokeColor="#22c55e" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">良好</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{goodCount}</p>
              </div>
              <Progress percent={Math.round((goodCount / data.length) * 100)} strokeColor="#3b82f6" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">合格</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{passCount}</p>
              </div>
              <Progress percent={Math.round((passCount / data.length) * 100)} strokeColor="#f97316" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">平均分</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{avgScore}</p>
              </div>
              <Progress percent={avgScore} strokeColor="#9333ea" size="small" />
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="支部考核列表">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="发起支部考核"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="orgId"
            label="考核组织"
            rules={[{ required: true, message: '请选择考核组织' }]}
          >
            <Input placeholder="请选择考核组织" />
          </Form.Item>
          <Form.Item
            name="evaluationDate"
            label="考核日期"
            rules={[{ required: true, message: '请选择考核日期' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item name="description" label="考核说明">
            <Input.TextArea rows={3} placeholder="请输入考核说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}