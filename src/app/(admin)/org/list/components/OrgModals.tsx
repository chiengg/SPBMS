'use client'

import { useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, Upload, Button, message, Row, Col, Tag, Divider } from 'antd'
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import type { OrgNode } from '@/data/orgData'

interface OrgFormModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (data: any) => void
  title: string
  editData?: OrgNode | null
  parentOrgName?: string
  parentOrgCode?: string
  level?: number
}

const typeOptions = [
  { value: '党委', label: '党委' },
  { value: '党总支', label: '党总支' },
  { value: '党支部', label: '党支部' },
  { value: '党小组', label: '党小组' },
]

const levelTypeMap: Record<number, string[]> = {
  0: ['党委'],
  1: ['党总支'],
  2: ['党支部'],
  3: ['党小组'],
}

export function OrgFormModal({ visible, onCancel, onSubmit, title, editData, parentOrgName, parentOrgCode, level = 0 }: OrgFormModalProps) {
  const [form] = Form.useForm()
  const [committeeMembers, setCommitteeMembers] = useState<string[]>(editData?.committeeMembers || [])

  const filteredTypes = levelTypeMap[level] || typeOptions.map((t) => t.value)

  const handleAddMember = () => {
    setCommitteeMembers([...committeeMembers, ''])
  }

  const handleUpdateMember = (index: number, value: string) => {
    const newMembers = [...committeeMembers]
    newMembers[index] = value
    setCommitteeMembers(newMembers)
  }

  const handleRemoveMember = (index: number) => {
    setCommitteeMembers(committeeMembers.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, committeeMembers })
      form.resetFields()
      setCommitteeMembers([])
    })
  }

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={700}
      okText="提交"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" initialValues={editData}>
        {!editData && parentOrgName && (
          <Form.Item label="上级组织">
            <Input disabled value={parentOrgName} />
          </Form.Item>
        )}

        {!editData && (
          <Form.Item label="组织编码">
            <Input disabled value={parentOrgCode ? `${parentOrgCode}-001` : 'DQ-001'} />
          </Form.Item>
        )}

        <Form.Item label="组织名称" name="name" rules={[{ required: true, message: '请输入组织名称' }]}>
          <Input placeholder="请输入组织名称" />
        </Form.Item>

        <Form.Item label="组织类型" name="type" rules={[{ required: true, message: '请选择组织类型' }]}>
          <Select options={typeOptions.filter((t) => filteredTypes.includes(t.value))} />
        </Form.Item>

        <Form.Item label="成立时间" name="foundDate" rules={[{ required: true, message: '请选择成立时间' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="支部书记" name="secretary" rules={[{ required: true, message: '请输入支部书记' }]}>
          <Input placeholder="请输入支部书记姓名" />
        </Form.Item>

        <Form.Item label="联系地址" name="address">
          <Input placeholder="请输入联系地址" />
        </Form.Item>

        <Form.Item label="支委成员">
          <div className="space-y-2">
            {committeeMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={member}
                  onChange={(e) => handleUpdateMember(index, e.target.value)}
                  placeholder={`支委成员 ${index + 1}（格式：姓名（职务））`}
                  style={{ flex: 1 }}
                />
                <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleRemoveMember(index)} />
              </div>
            ))}
            <Button icon={<PlusOutlined />} size="small" onClick={handleAddMember}>
              添加支委成员
            </Button>
          </div>
        </Form.Item>

        <Form.Item label="编制人数" name="establishmentCount">
          <Input type="number" placeholder="请输入编制人数" min={0} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface RevokeModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (data: any) => void
  org?: OrgNode | null
}

export function RevokeModal({ visible, onCancel, onSubmit, org }: RevokeModalProps) {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={`撤销组织 - ${org?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      okText="提交审批"
      cancelText="取消"
      confirmLoading={false}
    >
      <div className="mb-4 p-3 bg-red-50 rounded-lg">
        <p className="text-red-600 text-sm">
          <strong>注意：</strong>组织撤销需提交上级党委线上审批，审批通过后组织状态标记为「已撤销」，数据永久归档封存，不可物理删除。
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item label="撤销原因" name="reason" rules={[{ required: true, message: '请填写撤销原因' }]}>
          <Input.TextArea rows={4} placeholder="请详细说明撤销原因" />
        </Form.Item>

        <Form.Item label="党员接收组织" name="targetOrg" rules={[{ required: true, message: '请选择党员接收组织' }]}>
          <Select placeholder="请选择党员接收组织">
            <Select.Option value="org-006">第二党支部</Select.Option>
            <Select.Option value="org-009">销售党支部</Select.Option>
            <Select.Option value="org-011">退休第一党支部</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="证明材料">
          <Upload.Dragger>
            <p className="text-sm">
              <UploadOutlined />
              点击或拖拽上传证明材料
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface MergeModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (data: any) => void
  orgId?: string
}

export function MergeModal({ visible, onCancel, onSubmit, orgId }: MergeModalProps) {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title="合并组织"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      okText="提交审批"
      cancelText="取消"
    >
      <div className="mb-4 p-3 bg-orange-50 rounded-lg">
        <p className="text-orange-600 text-sm">
          <strong>注意：</strong>仅支持同级党组织合并，需上级党委审批，历史数据随组织关系同步迁移。
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item label="选择合并组织" name="targetOrg" rules={[{ required: true, message: '请选择合并目标组织' }]}>
          <Select placeholder="请选择合并目标组织（同级）">
            <Select.Option value="org-006">第二党支部</Select.Option>
            <Select.Option value="org-009">销售党支部</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="合并后组织名称" name="newName" rules={[{ required: true, message: '请输入合并后组织名称' }]}>
          <Input placeholder="请输入合并后组织名称" />
        </Form.Item>

        <Form.Item label="合并原因" name="reason" rules={[{ required: true, message: '请填写合并原因' }]}>
          <Input.TextArea rows={4} placeholder="请详细说明合并原因" />
        </Form.Item>

        <Form.Item label="证明材料">
          <Upload.Dragger>
            <p className="text-sm">
              <UploadOutlined />
              点击或拖拽上传证明材料
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface SplitModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (data: any) => void
  orgId?: string
}

export function SplitModal({ visible, onCancel, onSubmit, orgId }: SplitModalProps) {
  const [form] = Form.useForm()
  const [newOrgs, setNewOrgs] = useState<{ name: string; secretary: string }[]>([{ name: '', secretary: '' }])

  const handleAddOrg = () => {
    setNewOrgs([...newOrgs, { name: '', secretary: '' }])
  }

  const handleUpdateOrg = (index: number, field: 'name' | 'secretary', value: string) => {
    const newList = [...newOrgs]
    newList[index][field] = value
    setNewOrgs(newList)
  }

  const handleRemoveOrg = (index: number) => {
    if (newOrgs.length > 1) {
      setNewOrgs(newOrgs.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, newOrgs })
      form.resetFields()
      setNewOrgs([{ name: '', secretary: '' }])
    })
  }

  return (
    <Modal
      title="拆分组织"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      okText="提交审批"
      cancelText="取消"
    >
      <div className="mb-4 p-3 bg-purple-50 rounded-lg">
        <p className="text-purple-600 text-sm">
          <strong>注意：</strong>仅支持党支部拆分，需上级党委审批，历史数据随组织关系同步迁移。
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item label="拆分原因" name="reason" rules={[{ required: true, message: '请填写拆分原因' }]}>
          <Input.TextArea rows={4} placeholder="请详细说明拆分原因" />
        </Form.Item>

        <Divider orientation="left">新建组织信息</Divider>

        <div className="space-y-4">
          {newOrgs.map((org, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">拆分组织 {index + 1}</span>
                {newOrgs.length > 1 && (
                  <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleRemoveOrg(index)} />
                )}
              </div>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Form.Item
                    name={`newOrg_${index}_name`}
                    rules={[{ required: true, message: '请输入组织名称' }]}
                  >
                    <Input placeholder="组织名称" value={org.name} onChange={(e) => handleUpdateOrg(index, 'name', e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={`newOrg_${index}_secretary`}
                    rules={[{ required: true, message: '请输入支部书记' }]}
                  >
                    <Input placeholder="支部书记" value={org.secretary} onChange={(e) => handleUpdateOrg(index, 'secretary', e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-2">
          <Button icon={<PlusOutlined />} size="small" onClick={handleAddOrg}>
            添加拆分组织
          </Button>
        </div>

        <Form.Item label="证明材料">
          <Upload.Dragger>
            <p className="text-sm">
              <UploadOutlined />
              点击或拖拽上传证明材料
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface TransferModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (data: any) => void
  org?: OrgNode | null
}

export function TransferModal({ visible, onCancel, onSubmit, org }: TransferModalProps) {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={`调整隶属关系 - ${org?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      okText="提交审批"
      cancelText="取消"
    >
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-blue-600 text-sm">
          <strong>注意：</strong>支持整建制划转党组织，划转后该组织及下属所有组织、党员、业务数据同步迁移至新上级组织。
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item label="原上级组织">
          <Input disabled value={org?.parentName || '-'} />
        </Form.Item>

        <Form.Item label="新上级组织" name="newParentOrg" rules={[{ required: true, message: '请选择新上级组织' }]}>
          <Select placeholder="请选择新上级组织">
            <Select.Option value="org-007">企业党总支</Select.Option>
            <Select.Option value="org-010">离退休党总支</Select.Option>
            <Select.Option value="org-001">中共XX市委员会</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="划转原因" name="reason" rules={[{ required: true, message: '请填写划转原因' }]}>
          <Input.TextArea rows={4} placeholder="请详细说明划转原因" />
        </Form.Item>

        <Form.Item label="证明材料">
          <Upload.Dragger>
            <p className="text-sm">
              <UploadOutlined />
              点击或拖拽上传证明材料
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}