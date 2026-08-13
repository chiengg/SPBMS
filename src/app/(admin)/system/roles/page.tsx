'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message, Tree } from 'antd'
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface RoleItem {
  key: string
  id: string
  name: string
  description: string
  userCount: number
  status: string
}

const roleList: RoleItem[] = [
  { key: '1', id: 'r-001', name: '超级管理员', description: '系统最高权限，可操作所有功能', userCount: 2, status: '启用' },
  { key: '2', id: 'r-002', name: '党委管理员', description: '管理下级党组织数据，审批流程', userCount: 5, status: '启用' },
  { key: '3', id: 'r-003', name: '支部管理员', description: '管理本支部党员、组织生活', userCount: 23, status: '启用' },
  { key: '4', id: 'r-004', name: '普通党员', description: '查看本人信息、参与学习活动', userCount: 1226, status: '启用' },
]

const columns: ColumnsType<RoleItem> = [
  { title: '角色编号', dataIndex: 'id', key: 'id', width: '12%' },
  { title: '角色名称', dataIndex: 'name', key: 'name', width: '20%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '角色描述', dataIndex: 'description', key: 'description', width: '35%' },
  { title: '用户数量', dataIndex: 'userCount', key: 'userCount', width: '12%' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (status: string) => <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    width: '16%',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} size="small">权限</Button>
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </div>
    ),
  },
]

const permissionTreeData = [
  {
    title: '组织架构管理',
    key: 'org',
    children: [
      { title: '组织树维护', key: 'org_tree' },
      { title: '党组织列表', key: 'org_list' },
      { title: '换届选举', key: 'org_election' },
    ],
  },
  {
    title: '党员管理',
    key: 'member',
    children: [
      { title: '党员花名册', key: 'member_list' },
      { title: '发展党员', key: 'member_develop' },
      { title: '组织关系转接', key: 'member_transfer' },
    ],
  },
  {
    title: '组织生活管理',
    key: 'meeting',
    children: [
      { title: '三会一课计划', key: 'meeting_plan' },
      { title: '主题党日', key: 'meeting_theme' },
    ],
  },
]

export default function RolesManagement() {
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('角色已创建')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">角色权限管理</h1>
          <p className="text-gray-500 mt-1">管理系统角色，配置功能权限和数据权限</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>新建角色</Button>
      </div>

      <Card title="角色列表">
        <Table
          dataSource={roleList}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="新建角色"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="description" label="角色描述">
            <Input.TextArea rows={2} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item name="permissions" label="功能权限">
            <Tree
              checkable
              treeData={permissionTreeData}
              defaultExpandAll
              className="max-h-48 overflow-auto"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}