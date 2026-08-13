'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Drawer,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Progress,
  List,
  Upload,
  Divider,
  Space,
  InputNumber,
  Tabs,
  Alert,
  DatePicker,
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  SettingOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UserAddOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { personDevelopDetails, warningRecords, developArchives, developStages } from '@/data/memberData'
import type { PersonDevelopDetail, WarningRecord, DevelopArchive, StageRecord } from '@/data/memberData'
import DevelopWarningList from './components/DevelopWarningList'
import DevelopDetail from './components/DevelopDetail'
import DevelopArchiveList from './components/DevelopArchive'

interface DevelopPerson {
  key: string
  id: string
  name: string
  gender: string
  age: number
  orgName: string
  currentStage: string
  stageIndex: number
  totalStages: number
  applyDate: string
  status: string
  birthday: string
}

const developPeople: DevelopPerson[] = personDevelopDetails.map((p) => ({
  key: p.id,
  id: p.id,
  name: p.name,
  gender: p.gender,
  age: p.age,
  orgName: p.orgName,
  currentStage: p.currentStage,
  stageIndex: p.currentStageIndex,
  totalStages: p.totalStages,
  applyDate: p.applyDate,
  status: p.status,
  birthday: p.birthday,
}))

interface FlowNodeConfig {
  id: string
  name: string
  order: number
  stage: string
  requiredFields: { name: string; label: string; type: string; required: boolean }[]
  requiredFiles: { name: string; label: string; required: boolean }[]
}

const initialFlowNodes: FlowNodeConfig[] = [
  {
    id: 'node-1',
    name: '提交入党申请书',
    order: 1,
    stage: '申请入党',
    requiredFields: [
      { name: 'name', label: '申请人姓名', type: 'text', required: true },
      { name: 'gender', label: '性别', type: 'select', required: true },
      { name: 'birthday', label: '出生日期', type: 'date', required: true },
      { name: 'applyDate', label: '申请日期', type: 'date', required: true },
      { name: 'nativePlace', label: '籍贯', type: 'text', required: false },
    ],
    requiredFiles: [
      { name: 'applicationLetter', label: '入党申请书', required: true },
      { name: 'idCopy', label: '身份证复印件', required: true },
      { name: 'resume', label: '个人简历', required: false },
    ],
  },
  {
    id: 'node-2',
    name: '支部派人谈话',
    order: 2,
    stage: '申请入党',
    requiredFields: [
      { name: 'talker', label: '谈话人', type: 'text', required: true },
      { name: 'talkDate', label: '谈话日期', type: 'date', required: true },
      { name: 'talkContent', label: '谈话内容', type: 'textarea', required: true },
      { name: 'talkResult', label: '谈话意见', type: 'select', required: true },
    ],
    requiredFiles: [
      { name: 'talkRecord', label: '谈话记录', required: true },
    ],
  },
  {
    id: 'node-3',
    name: '党员推荐/群团推优',
    order: 3,
    stage: '积极分子',
    requiredFields: [
      { name: 'recommender', label: '推荐人', type: 'text', required: true },
      { name: 'recommendDate', label: '推荐日期', type: 'date', required: true },
      { name: 'recommendOpinion', label: '推荐意见', type: 'textarea', required: true },
    ],
    requiredFiles: [
      { name: 'recommendForm', label: '推荐表', required: true },
      { name: 'groupRecommend', label: '群团推优表', required: false },
    ],
  },
  {
    id: 'node-4',
    name: '确定积极分子',
    order: 4,
    stage: '积极分子',
    requiredFields: [
      { name: 'confirmDate', label: '确定日期', type: 'date', required: true },
      { name: 'branchDecision', label: '支部决议', type: 'textarea', required: true },
      { name: 'superiorApproval', label: '上级批复', type: 'select', required: false },
    ],
    requiredFiles: [
      { name: 'branchMeetingRecord', label: '支部会议记录', required: true },
      { name: 'superiorReply', label: '上级批复文件', required: false },
    ],
  },
  {
    id: 'node-5',
    name: '培养考察(满12个月)',
    order: 5,
    stage: '积极分子',
    requiredFields: [
      { name: 'cultivator', label: '培养联系人', type: 'text', required: true },
      { name: 'inspectContent', label: '考察内容', type: 'textarea', required: true },
      { name: 'inspectResult', label: '考察结论', type: 'select', required: true },
    ],
    requiredFiles: [
      { name: 'inspectRecord', label: '培养考察记录', required: true },
      { name: 'thoughtReport', label: '思想汇报', required: true },
    ],
  },
]

const columns: ColumnsType<DevelopPerson> = [
  { title: '编号', dataIndex: 'id', key: 'id', width: '8%' },
  { title: '姓名', dataIndex: 'name', key: 'name', width: '8%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: '6%' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: '6%' },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '12%' },
  {
    title: '当前阶段',
    dataIndex: 'currentStage',
    key: 'currentStage',
    width: '18%',
    render: (text: string) => <span className="font-medium">{text}</span>,
  },
  {
    title: '发展进度',
    key: 'progress',
    width: '15%',
    render: (_, record) => (
      <div className="flex items-center gap-2">
        <Progress percent={Math.round((record.stageIndex / record.totalStages) * 100)} size="small" strokeColor="#dc2626" />
        <span className="text-xs text-gray-500">{record.stageIndex}/{record.totalStages}</span>
      </div>
    ),
  },
  { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: '10%' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '8%',
    render: (status: string) => (
      <Tag color={status === '进行中' ? 'blue' : status === '即将完成' ? 'green' : 'orange'}>{status}</Tag>
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: '9%',
    render: (_, record) => (
      <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record.id)}>查看进度</Button>
    ),
  },
]

let detailModal: any = null

const handleViewDetail = (id: string) => {
  const detail = personDevelopDetails.find((p) => p.id === id)
  if (!detail) return
  detailModal = Modal.info({
    title: '',
    width: 900,
    content: <DevelopDetail detail={detail} onClose={() => detailModal.destroy()} />,
    okText: null,
    cancelText: null,
    footer: null,
    closable: true,
    onCancel: () => detailModal.destroy(),
  })
}

export default function DevelopMember() {
  const [flowNodes, setFlowNodes] = useState<FlowNodeConfig[]>(initialFlowNodes)
  const [flowDrawerVisible, setFlowDrawerVisible] = useState(false)
  const [applyModalVisible, setApplyModalVisible] = useState(false)
  const [editingNode, setEditingNode] = useState<FlowNodeConfig | null>(null)
  const [nodeModalVisible, setNodeModalVisible] = useState(false)
  const [nodeForm] = Form.useForm()
  const [applyForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('list')

  const handleFlowManagement = () => {
    setFlowDrawerVisible(true)
  }

  const handleApply = () => {
    setApplyModalVisible(true)
  }

  const handleEditNode = (node: FlowNodeConfig) => {
    setEditingNode(node)
    nodeForm.setFieldsValue({
      name: node.name,
      stage: node.stage,
      order: node.order,
    })
    setNodeModalVisible(true)
  }

  const handleSaveNode = () => {
    nodeForm.validateFields().then(() => {
      const values = nodeForm.getFieldsValue()
      setFlowNodes((prev) =>
        prev.map((node) =>
          node.id === editingNode?.id
            ? { ...node, ...values }
            : node
        )
      )
      message.success('节点配置已保存')
      setNodeModalVisible(false)
    })
  }

  const handleAddField = () => {
    if (!editingNode) return
    const newField = {
      name: `field_${Date.now()}`,
      label: '新字段',
      type: 'text',
      required: false,
    }
    setEditingNode({
      ...editingNode,
      requiredFields: [...editingNode.requiredFields, newField],
    })
  }

  const handleDeleteField = (fieldName: string) => {
    if (!editingNode) return
    setEditingNode({
      ...editingNode,
      requiredFields: editingNode.requiredFields.filter((f) => f.name !== fieldName),
    })
  }

  const handleAddFile = () => {
    if (!editingNode) return
    const newFile = {
      name: `file_${Date.now()}`,
      label: '新附件',
      required: false,
    }
    setEditingNode({
      ...editingNode,
      requiredFiles: [...editingNode.requiredFiles, newFile],
    })
  }

  const handleDeleteFile = (fileName: string) => {
    if (!editingNode) return
    setEditingNode({
      ...editingNode,
      requiredFiles: editingNode.requiredFiles.filter((f) => f.name !== fileName),
    })
  }

  const handleSaveNodeConfig = () => {
    if (!editingNode) return
    setFlowNodes((prev) =>
      prev.map((node) =>
        node.id === editingNode.id ? editingNode : node
      )
    )
    message.success('节点配置已更新')
    setNodeModalVisible(false)
  }

  const handleSubmitApply = () => {
    applyForm.validateFields().then((values) => {
      const birthday = values.birthday as string
      const age = new Date().getFullYear() - new Date(birthday).getFullYear()
      
      if (age < 18) {
        message.error(`申请人年龄为${age}岁，未满18周岁，不符合入党申请条件`)
        return
      }

      message.success('发展党员申请已提交，系统将自动校验并进入下一环节')
      setApplyModalVisible(false)
      applyForm.resetFields()
    })
  }

  const tabs = [
    { key: 'list', label: '发展党员列表', icon: <UserAddOutlined /> },
    { key: 'warning', label: '预警清单', icon: <AlertOutlined /> },
    { key: 'archive', label: '材料归档', icon: <FileTextOutlined /> },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">发展党员</h1>
          <p className="text-gray-500 mt-1">管理发展党员全流程，严格遵循发展党员工作细则</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<SettingOutlined />} onClick={handleFlowManagement}>流程管理</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleApply}>发起发展流程</Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">进行中流程</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{developPeople.length}</p>
              </div>
              <ClockCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">超期预警</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{warningRecords.filter((w) => w.warningLevel === 'danger').length}</p>
              </div>
              <AlertOutlined className="text-red-500 text-3xl" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本年度发展</p>
                <p className="text-2xl font-bold text-green-600 mt-1">12</p>
              </div>
              <CheckCircleOutlined className="text-green-500 text-3xl" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">转化率</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">85%</p>
              </div>
              <Progress percent={85} strokeColor="#f97316" size="small" />
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs}>
        <Tabs.TabPane key="list">
          <Card title="发展党员人员列表">
            <Table
              dataSource={developPeople}
              columns={columns}
              pagination={{ pageSize: 20 }}
              rowKey="key"
              className="text-sm"
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane key="warning">
          <DevelopWarningList warnings={warningRecords} />
        </Tabs.TabPane>

        <Tabs.TabPane key="archive">
          <DevelopArchiveList archives={developArchives} />
        </Tabs.TabPane>
      </Tabs>

      <Drawer
        title="发展党员流程管理"
        placement="right"
        width={700}
        onClose={() => setFlowDrawerVisible(false)}
        open={flowDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setFlowDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => message.success('流程配置已保存')}>保存配置</Button>
          </Space>
        }
      >
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">流程节点列表（共 {flowNodes.length} 个节点）</span>
            <Button type="primary" icon={<PlusOutlined />} size="small">新增节点</Button>
          </div>
        </div>

        <List
          dataSource={flowNodes}
          renderItem={(node) => (
            <List.Item
              key={node.id}
              actions={[
                <Button icon={<EditOutlined />} size="small" onClick={() => handleEditNode(node)}>
                  编辑
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
                      {node.order}
                    </span>
                    <span className="font-medium">{node.name}</span>
                    <Tag color="blue">{node.stage}</Tag>
                  </div>
                }
                description={
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>必填字段：{node.requiredFields.filter((f) => f.required).length} 个</span>
                    <span>选填字段：{node.requiredFields.filter((f) => !f.required).length} 个</span>
                    <span>必传附件：{node.requiredFiles.filter((f) => f.required).length} 个</span>
                    <span>选传附件：{node.requiredFiles.filter((f) => !f.required).length} 个</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>

      <Modal
        title={`编辑流程节点 - ${editingNode?.name}`}
        open={nodeModalVisible}
        onCancel={() => setNodeModalVisible(false)}
        onOk={handleSaveNodeConfig}
        width={700}
        okText="保存配置"
        cancelText="取消"
      >
        {editingNode && (
          <div className="space-y-6">
            <Form form={nodeForm} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Form.Item label="节点名称" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="所属阶段" name="stage" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="申请入党">申请入党</Select.Option>
                  <Select.Option value="积极分子">积极分子</Select.Option>
                  <Select.Option value="发展对象">发展对象</Select.Option>
                  <Select.Option value="预备党员">预备党员</Select.Option>
                  <Select.Option value="正式党员">正式党员</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="节点顺序" name="order">
                <InputNumber min={1} />
              </Form.Item>
            </Form>

            <Divider orientation="left">
              <span className="font-medium">字段配置</span>
            </Divider>

            <div className="flex justify-end mb-3">
              <Button icon={<PlusCircleOutlined />} size="small" onClick={handleAddField}>
                添加字段
              </Button>
            </div>

            <div className="space-y-2">
              {editingNode.requiredFields.map((field) => (
                <div key={field.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Input
                    value={field.label}
                    onChange={(e) => {
                      setEditingNode({
                        ...editingNode,
                        requiredFields: editingNode.requiredFields.map((f) =>
                          f.name === field.name ? { ...f, label: e.target.value } : f
                        ),
                      })
                    }}
                    style={{ width: 120 }}
                    placeholder="字段名称"
                  />
                  <Select
                    value={field.type}
                    onChange={(val) => {
                      setEditingNode({
                        ...editingNode,
                        requiredFields: editingNode.requiredFields.map((f) =>
                          f.name === field.name ? { ...f, type: val } : f
                        ),
                      })
                    }}
                    style={{ width: 100 }}
                  >
                    <Select.Option value="text">文本</Select.Option>
                    <Select.Option value="textarea">多行文本</Select.Option>
                    <Select.Option value="select">下拉选择</Select.Option>
                    <Select.Option value="date">日期</Select.Option>
                    <Select.Option value="number">数字</Select.Option>
                  </Select>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => {
                        setEditingNode({
                          ...editingNode,
                          requiredFields: editingNode.requiredFields.map((f) =>
                            f.name === field.name ? { ...f, required: e.target.checked } : f
                          ),
                        })
                      }}
                    />
                    <span className="text-sm">必填</span>
                  </div>
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => handleDeleteField(field.name)}
                    className="ml-auto"
                  />
                </div>
              ))}
            </div>

            <Divider orientation="left">
              <span className="font-medium">附件配置</span>
            </Divider>

            <div className="flex justify-end mb-3">
              <Button icon={<PlusCircleOutlined />} size="small" onClick={handleAddFile}>
                添加附件
              </Button>
            </div>

            <div className="space-y-2">
              {editingNode.requiredFiles.map((file) => (
                <div key={file.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Input
                    value={file.label}
                    onChange={(e) => {
                      setEditingNode({
                        ...editingNode,
                        requiredFiles: editingNode.requiredFiles.map((f) =>
                          f.name === file.name ? { ...f, label: e.target.value } : f
                        ),
                      })
                    }}
                    style={{ width: 200 }}
                    placeholder="附件名称"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={file.required}
                      onChange={(e) => {
                        setEditingNode({
                          ...editingNode,
                          requiredFiles: editingNode.requiredFiles.map((f) =>
                            f.name === file.name ? { ...f, required: e.target.checked } : f
                          ),
                        })
                      }}
                    />
                    <span className="text-sm">必传</span>
                  </div>
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => handleDeleteFile(file.name)}
                    className="ml-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="发起发展党员流程"
        open={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
        onOk={handleSubmitApply}
        width={700}
        okText="提交申请"
        cancelText="取消"
      >
        <Form form={applyForm} layout="vertical" className="space-y-6">
          <Alert
            message="业务规则提醒"
            description="入党申请人需年满18周岁，系统将自动校验年龄"
            type="info"
            showIcon
            className="mb-4"
          />

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="申请人姓名" name="name" rules={[{ required: true, message: '请输入申请人姓名' }]}>
              <Input placeholder="请输入申请人姓名" />
            </Form.Item>
            <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请选择性别' }]}>
              <Select placeholder="请选择性别">
                <Select.Option value="男">男</Select.Option>
                <Select.Option value="女">女</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="出生日期" name="birthday" rules={[{ required: true, message: '请选择出生日期' }]}>
              <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
            </Form.Item>
            <Form.Item label="籍贯" name="nativePlace">
              <Input placeholder="请输入籍贯" />
            </Form.Item>
            <Form.Item label="申请日期" name="applyDate" rules={[{ required: true, message: '请选择申请日期' }]}>
              <DatePicker style={{ width: '100%' }} placeholder="请选择申请日期" />
            </Form.Item>
            <Form.Item label="所属组织" name="orgName" rules={[{ required: true, message: '请选择所属组织' }]}>
              <Select placeholder="请选择所属组织">
                <Select.Option value="第一党支部">第一党支部</Select.Option>
                <Select.Option value="第二党支部">第二党支部</Select.Option>
                <Select.Option value="生产党支部">生产党支部</Select.Option>
                <Select.Option value="销售党支部">销售党支部</Select.Option>
                <Select.Option value="机关党总支">机关党总支</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Divider>上传材料</Divider>

          <Form.Item label="入党申请书">
            <Upload.Dragger>
              <p className="text-sm">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="身份证复印件">
            <Upload.Dragger>
              <p className="text-sm">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="个人简历（选填）">
            <Upload.Dragger>
              <p className="text-sm">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}