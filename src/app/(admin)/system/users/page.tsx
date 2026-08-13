'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Input, Select, Modal, Form, message } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface UserItem {
  key: string
  id: string
  username: string
  name: string
  role: string
  orgName: string
  status: string
  lastLogin: string
}

const userList: UserItem[] = [
  { key: '1', id: 'u-001', username: 'admin', name: '张管理员', role: '超级管理员', orgName: '中共XX市委员会', status: '正常', lastLogin: '2024-01-15 09:30' },
  { key: '2', id: 'u-002', username: 'wangfang', name: '王芳', role: '党委管理员', orgName: '机关党总支', status: '正常', lastLogin: '2024-01-15 08:45' },
  { key: '3', id: 'u-003', username: 'zhangwei', name: '张伟', role: '支部管理员', orgName: '第一党支部', status: '正常', lastLogin: '2024-01-14 17:20' },
  { key: '4', id: 'u-004', username: 'liuyang', name: '刘洋', role: '支部管理员', orgName: '第一党支部', status: '正常', lastLogin: '2024-01-14 16:30' },
  { key: '5', id: 'u-005', username: 'sunqiang', name: '孙强', role: '普通党员', orgName: '第二党支部', status: '锁定', lastLogin: '-' },
]

const columns: ColumnsType<UserItem> = [
  { title: '用户编号', dataIndex: 'id', key: 'id', width: '10%' },
  { title: '用户名', dataIndex: 'username', key: 'username', width: '12%' },
  { title: '真实姓名', dataIndex: 'name', key: 'name', width: '12%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '角色', dataIndex: 'role', key: 'role', width: '15%', render: (role: string) => <Tag color={role === '超级管理员' ? 'red' : role === '党委管理员' ? 'orange' : role === '支部管理员' ? 'blue' : 'green'}>{role}</Tag> },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '20%' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (status: string) => (
      <span className={`flex items-center gap-1 ${status === '正常' ? 'text-green-600' : 'text-red-600'}`}>
        {status === '正常' ? <UnlockOutlined /> : <LockOutlined />}
        <span>{status}</span>
      </span>
    ),
  },
  { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin', width: '15%' },
  {
    title: '操作',
    key: 'action',
    width: '16%',
    render: () => (
      <div className="flex gap-2">
        <Button icon={<EditOutlined />} size="small">编辑</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </div>
    ),
  },
]

export default function UsersManagement() {
  const [searchValue, setSearchValue] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const filteredData = userList.filter((item) => {
    const matchSearch = item.name.includes(searchValue) || item.username.includes(searchValue)
    const matchRole = !roleFilter || item.role === roleFilter
    return matchSearch && matchRole
  })

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('用户已创建')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">用户管理</h1>
          <p className="text-gray-500 mt-1">管理系统用户账号，分配角色权限</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>新增用户</Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索用户名或姓名..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="筛选角色"
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 140 }}
            options={[
              { value: '', label: '全部' },
              { value: '超级管理员', label: '超级管理员' },
              { value: '党委管理员', label: '党委管理员' },
              { value: '支部管理员', label: '支部管理员' },
              { value: '普通党员', label: '普通党员' },
            ]}
          />
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>

      <Modal
        title="新增用户"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="name"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="超级管理员">超级管理员</Select.Option>
              <Select.Option value="党委管理员">党委管理员</Select.Option>
              <Select.Option value="支部管理员">支部管理员</Select.Option>
              <Select.Option value="普通党员">普通党员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="orgId" label="所属组织">
            <Select placeholder="请选择所属组织">
              <Select.Option value="org-001">中共XX市委员会</Select.Option>
              <Select.Option value="org-002">机关党总支</Select.Option>
              <Select.Option value="org-003">第一党支部</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}