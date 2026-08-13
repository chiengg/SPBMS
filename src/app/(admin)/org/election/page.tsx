'use client'

import { useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Progress, Modal, Form, Input, Select, DatePicker, message, Tabs, Row, Col, Alert } from 'antd'
import { PlusOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined, CalendarOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { electionRecords, electionStages, electionCandidates, electionReminders } from '@/data/orgData'
import ElectionDetail from './components/ElectionDetail'
import OnlineVoting from './components/OnlineVoting'
import ElectionResult from './components/ElectionResult'
import ReminderList from './components/ReminderList'
import type { ElectionRecord, ElectionReminder } from '@/data/orgData'

export default function ElectionManagement() {
  const [data] = useState<ElectionRecord[]>(electionRecords)
  const [modalVisible, setModalVisible] = useState(false)
  const [extendModalVisible, setExtendModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailElection, setDetailElection] = useState<ElectionRecord | null>(null)
  const [detailTab, setDetailTab] = useState('process')
  const [form] = Form.useForm()

  const urgentCount = electionReminders.filter((r) => r.reminderLevel === 'danger').length
  const inProgressCount = data.filter((d) => d.status === '进行中').length
  const pendingCount = data.filter((d) => d.status === '待审批').length

  const handleViewDetail = (record: ElectionRecord) => {
    setDetailElection(record)
    setDetailTab('process')
    setDetailModalVisible(true)
  }

  const columns = useMemo<ColumnsType<ElectionRecord>>(() => [
    { title: '党组织', dataIndex: 'orgName', key: 'orgName', render: (text: string) => <span className="font-medium">{text}</span> },
    {
      title: '选举类型',
      dataIndex: 'electionType',
      key: 'electionType',
      render: (type: string) => <Tag color={type === '换届选举' ? 'red' : 'orange'}>{type}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <div className="flex items-center gap-1">
          {status === '筹备中' && <ClockCircleOutlined className="text-blue-500" />}
          {status === '进行中' && <CheckCircleOutlined className="text-green-500" />}
          {status === '待审批' && <AlertOutlined className="text-orange-500" />}
          <span>{status}</span>
        </div>
      ),
    },
    { title: '当前阶段', dataIndex: 'currentStage', key: 'currentStage', width: '15%' },
    {
      title: '任期',
      key: 'term',
      width: '20%',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-xs">{record.termStartDate}</span>
          <span className="text-xs text-gray-500">至 {record.termEndDate}</span>
          {record.isExtended && <Tag color="orange" className="mt-1 text-xs">已延期</Tag>}
        </div>
      ),
    },
    { title: '截止日期', dataIndex: 'deadline', key: 'deadline', width: '12%' },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: '12%',
      render: (progress: number) => (
        <div className="w-24">
          <Progress percent={progress} strokeColor="#dc2626" size="small" />
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)}>详情</Button>
          {record.status === '待审批' && (
            <Button icon={<EditOutlined />} size="small">编辑</Button>
          )}
        </div>
      ),
    },
  ], [])

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('换届申请已提交')
      setModalVisible(false)
    })
  }

  const handleExtend = () => {
    setExtendModalVisible(true)
  }

  const handleSubmitExtend = () => {
    message.success('延期申请已提交，等待上级党委审批')
    setExtendModalVisible(false)
  }

  const handleReminderAction = (reminder: ElectionReminder) => {
    if (reminder.hasPendingProcess) {
      message.warning('该组织下存在未办结流程，请先处理完成')
    } else {
      handleAdd()
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">换届选举管理</h1>
          <p className="text-gray-500 mt-1">管理党组织换届选举流程，自动提醒到期支部，支持线上投票</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<CalendarOutlined />} onClick={handleExtend}>延期换届申请</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>发起换届申请</Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">紧急换届提醒</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{urgentCount}</p>
              </div>
              <AlertOutlined className="text-red-500 text-3xl" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">换届进行中</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
              </div>
              <CheckCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待审批</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{pendingCount}</p>
              </div>
              <ClockCircleOutlined className="text-orange-500 text-3xl" />
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="list" items={[
        {
          key: 'list',
          label: '换届选举列表',
          children: (
            <Card>
              <Table
                dataSource={data}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                className="text-sm"
              />
            </Card>
          ),
        },
        {
          key: 'reminder',
          label: '换届提醒清单',
          children: <ReminderList reminders={electionReminders} onHandleReminder={handleReminderAction} />,
        },
        {
          key: 'voting',
          label: '线上投票',
          children: (
            <OnlineVoting
              candidates={electionCandidates['2'] || []}
              electionId="2"
              electionName="生产党支部换届选举"
            />
          ),
        },
        {
          key: 'result',
          label: '选举结果公示',
          children: (
            <ElectionResult
              candidates={electionCandidates['2'] || []}
              electionName="生产党支部换届选举"
            />
          ),
        },
      ]} />

      <Modal
        title="发起换届申请"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
        okText="提交申请"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="orgId"
            label="党组织"
            rules={[{ required: true, message: '请选择党组织' }]}
          >
            <Select placeholder="请选择党组织">
              <Select.Option value="org-006">第二党支部</Select.Option>
              <Select.Option value="org-008">生产党支部</Select.Option>
              <Select.Option value="org-011">退休第一党支部</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="electionType"
            label="选举类型"
            rules={[{ required: true, message: '请选择选举类型' }]}
          >
            <Select placeholder="请选择选举类型">
              <Select.Option value="换届选举">换届选举</Select.Option>
              <Select.Option value="委员补选">委员补选</Select.Option>
              <Select.Option value="书记选举">书记选举</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="deadline"
            label="计划完成日期"
            rules={[{ required: true, message: '请选择计划完成日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="换届原因">
            <Input.TextArea rows={3} placeholder="请输入换届原因" />
          </Form.Item>
          <Form.Item name="attachment" label="换届请示文件">
            <Input.TextArea rows={2} placeholder="请上传换届请示文件" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="延期/提前换届申请"
        open={extendModalVisible}
        onCancel={() => setExtendModalVisible(false)}
        onOk={handleSubmitExtend}
        width={600}
        okText="提交申请"
        cancelText="取消"
      >
        <Alert
          message="申请说明"
          description="延期或提前换届需提交申请并说明原因，上级党委审批通过后方可调整。"
          type="info"
          showIcon
          className="mb-4"
        />
        <Form layout="vertical">
          <Form.Item
            name="orgId"
            label="党组织"
            rules={[{ required: true, message: '请选择党组织' }]}
          >
            <Select placeholder="请选择党组织">
              <Select.Option value="org-006">第二党支部</Select.Option>
              <Select.Option value="org-008">生产党支部</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="extendType"
            label="申请类型"
            rules={[{ required: true, message: '请选择申请类型' }]}
          >
            <Select placeholder="请选择申请类型">
              <Select.Option value="extend">延期换届</Select.Option>
              <Select.Option value="advance">提前换届</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="newDate"
            label="调整后日期"
            rules={[{ required: true, message: '请选择调整后日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reason"
            label="申请原因"
            rules={[{ required: true, message: '请说明申请原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细说明延期或提前换届的原因" />
          </Form.Item>
          <Form.Item name="attachment" label="证明材料">
            <Input.TextArea rows={2} placeholder="请上传相关证明材料" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${detailElection?.orgName} - 换届详情`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={null}
      >
        {detailElection && (
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div>
                <p className="font-medium text-lg">{detailElection.orgName}</p>
                <p className="text-sm text-gray-500">
                  {detailElection.electionType} | 状态：{detailElection.status}
                  {detailElection.isExtended && <Tag color="orange" className="ml-2">已延期</Tag>}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">任期：{detailElection.termStartDate} 至 {detailElection.termEndDate}</p>
                <p className="text-sm text-gray-500">申请时间：{detailElection.createdAt}</p>
              </div>
            </div>

            <Tabs activeKey={detailTab} onChange={setDetailTab} items={[
              {
                key: 'process',
                label: '流程进度',
                children: <ElectionDetail stages={electionStages[detailElection.id] || []} />,
              },
              {
                key: 'voting',
                label: '线上投票',
                children: (
                  <OnlineVoting
                    candidates={electionCandidates[detailElection.id] || []}
                    electionId={detailElection.id}
                    electionName={detailElection.orgName}
                  />
                ),
              },
              {
                key: 'result',
                label: '选举结果',
                children: (
                  <ElectionResult
                    candidates={electionCandidates[detailElection.id] || []}
                    electionName={detailElection.orgName}
                  />
                ),
              },
            ]} />
          </div>
        )}
      </Modal>
    </div>
  )
}