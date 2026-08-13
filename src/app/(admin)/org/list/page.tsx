'use client'

import { useState } from 'react'
import { Row, Col, Tabs, message, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import OrgTreePanel from './components/OrgTreePanel'
import MemberListPanel from './components/MemberListPanel'
import OrgDetailCard from './components/OrgDetailCard'
import OrgHistoryLedger from './components/OrgHistoryLedger'
import { OrgFormModal, RevokeModal, MergeModal, SplitModal, TransferModal } from './components/OrgModals'
import { orgTreeData, orgHistoryRecords } from '@/data/orgData'
import { memberList } from '@/data/memberData'
import type { OrgNode } from '@/data/orgData'

export default function OrgMemberPage() {
  const [selectedOrgId, setSelectedOrgId] = useState('org-001')
  const [selectedOrgName, setSelectedOrgName] = useState('中共XX市委员会')
  const [activeTab, setActiveTab] = useState('members')

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [revokeModalVisible, setRevokeModalVisible] = useState(false)
  const [mergeModalVisible, setMergeModalVisible] = useState(false)
  const [splitModalVisible, setSplitModalVisible] = useState(false)
  const [transferModalVisible, setTransferModalVisible] = useState(false)

  const [parentOrg, setParentOrg] = useState<{ id: string; name: string; orgCode: string }>({ id: '', name: '', orgCode: '' })
  const [editingOrg, setEditingOrg] = useState<OrgNode | null>(null)
  const [revokingOrg, setRevokingOrg] = useState<OrgNode | null>(null)
  const [transferringOrg, setTransferringOrg] = useState<OrgNode | null>(null)

  const findOrgById = (id: string, data: OrgNode[] = orgTreeData): OrgNode | null => {
    for (const org of data) {
      if (org.id === id) return org
      if (org.children) {
        const found = findOrgById(id, org.children)
        if (found) return found
      }
    }
    return null
  }

  const getMembersForOrg = () => {
    if (selectedOrgId === 'org-001') {
      return memberList
    }
    const orgNameMap: Record<string, string> = {
      'org-002': '机关党总支',
      'org-003': '第一党支部',
      'org-004': '第一党小组',
      'org-005': '第二党小组',
      'org-006': '第二党支部',
      'org-007': '企业党总支',
      'org-008': '生产党支部',
      'org-009': '销售党支部',
      'org-010': '离退休党总支',
      'org-011': '退休第一党支部',
    }
    const orgName = orgNameMap[selectedOrgId] || ''
    if (orgName.includes('党小组')) {
      const parentOrgName = orgName.replace('党小组', '党支部')
      return memberList.filter((m) => m.orgName === parentOrgName)
    }
    if (orgName.includes('党总支')) {
      return memberList.filter((m) => m.orgName.includes('第一党支部') || m.orgName.includes('第二党支部'))
    }
    return memberList.filter((m) => m.orgName === orgName)
  }

  const handleSelectOrg = (orgId: string, orgName: string) => {
    setSelectedOrgId(orgId)
    setSelectedOrgName(orgName)
  }

  const handleAddOrg = (parentId: string, parentName: string) => {
    const parentOrgData = parentId ? findOrgById(parentId) : null
    setParentOrg({ id: parentId, name: parentName, orgCode: parentOrgData?.orgCode || '' })
    setAddModalVisible(true)
  }

  const handleEditOrg = (org: OrgNode) => {
    setEditingOrg(org)
    setEditModalVisible(true)
  }

  const handleRevokeOrg = (org: OrgNode) => {
    setRevokingOrg(org)
    setRevokeModalVisible(true)
  }

  const handleMergeOrg = (orgId: string) => {
    setMergeModalVisible(true)
  }

  const handleSplitOrg = (orgId: string) => {
    setSplitModalVisible(true)
  }

  const handleTransferOrg = (orgId: string) => {
    const org = findOrgById(orgId)
    if (org) {
      setTransferringOrg(org)
      setTransferModalVisible(true)
    }
  }

  const handleAddOrgSubmit = (data: any) => {
    message.success('组织新增申请已提交，等待审批')
    setAddModalVisible(false)
  }

  const handleEditOrgSubmit = (data: any) => {
    message.success('组织信息已更新')
    setEditModalVisible(false)
  }

  const handleRevokeOrgSubmit = (data: any) => {
    message.success('撤销申请已提交，等待上级党委审批')
    setRevokeModalVisible(false)
  }

  const handleMergeOrgSubmit = (data: any) => {
    message.success('合并申请已提交，等待上级党委审批')
    setMergeModalVisible(false)
  }

  const handleSplitOrgSubmit = (data: any) => {
    message.success('拆分申请已提交，等待上级党委审批')
    setSplitModalVisible(false)
  }

  const handleTransferOrgSubmit = (data: any) => {
    message.success('划转申请已提交，等待上级党委审批')
    setTransferModalVisible(false)
  }

  const currentOrg = findOrgById(selectedOrgId)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">组织与党员</h1>
          <p className="text-gray-500 mt-1">党组织全生命周期线上管理，支持新增、编辑、撤销、合并、拆分、划转操作</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>发起组织申请</Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col lg={6} xs={24}>
          <OrgTreePanel
            treeData={orgTreeData}
            selectedOrgId={selectedOrgId}
            onSelectOrg={handleSelectOrg}
            onAddOrg={handleAddOrg}
            onEditOrg={handleEditOrg}
            onRevokeOrg={handleRevokeOrg}
            onMergeOrg={handleMergeOrg}
            onSplitOrg={handleSplitOrg}
            onTransferOrg={handleTransferOrg}
          />
        </Col>

        <Col lg={18} xs={24}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
            {
              key: 'members',
              label: `党员列表 (${getMembersForOrg().length})`,
              children: (
                <MemberListPanel
                  members={getMembersForOrg()}
                  orgName={selectedOrgName}
                />
              ),
            },
            {
              key: 'detail',
              label: '组织档案',
              children: <OrgDetailCard org={currentOrg} />,
            },
            {
              key: 'history',
              label: '沿革记录',
              children: <OrgHistoryLedger records={orgHistoryRecords} orgId={selectedOrgId} />,
            },
          ]} />
        </Col>
      </Row>

      <OrgFormModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSubmit={handleAddOrgSubmit}
        title="新增组织"
        parentOrgName={parentOrg.name}
        parentOrgCode={parentOrg.orgCode}
      />

      <OrgFormModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleEditOrgSubmit}
        title="编辑组织"
        editData={editingOrg}
      />

      <RevokeModal
        visible={revokeModalVisible}
        onCancel={() => setRevokeModalVisible(false)}
        onSubmit={handleRevokeOrgSubmit}
        org={revokingOrg}
      />

      <MergeModal
        visible={mergeModalVisible}
        onCancel={() => setMergeModalVisible(false)}
        onSubmit={handleMergeOrgSubmit}
        orgId={selectedOrgId}
      />

      <SplitModal
        visible={splitModalVisible}
        onCancel={() => setSplitModalVisible(false)}
        onSubmit={handleSplitOrgSubmit}
        orgId={selectedOrgId}
      />

      <TransferModal
        visible={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onSubmit={handleTransferOrgSubmit}
        org={transferringOrg}
      />
    </div>
  )
}