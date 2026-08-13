'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Input, Select, DatePicker, Space } from 'antd'
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface LogItem {
  key: string
  id: string
  time: string
  operator: string
  action: string
  module: string
  result: string
  ip: string
}

const logList: LogItem[] = [
  { key: '1', id: 'log-001', time: '2024-01-15 09:30:25', operator: '张管理员', action: '登录系统', module: '系统管理', result: '成功', ip: '192.168.1.100' },
  { key: '2', id: 'log-002', time: '2024-01-15 09:35:12', operator: '王芳', action: '创建组织生活计划', module: '组织生活', result: '成功', ip: '192.168.1.101' },
  { key: '3', id: 'log-003', time: '2024-01-15 10:20:45', operator: '张伟', action: '导入党员数据', module: '党员管理', result: '成功', ip: '192.168.1.102' },
  { key: '4', id: 'log-004', time: '2024-01-15 11:15:30', operator: 'admin', action: '修改角色权限', module: '系统管理', result: '成功', ip: '192.168.1.100' },
  { key: '5', id: 'log-005', time: '2024-01-15 14:40:18', operator: '刘洋', action: '提交党费缴纳', module: '党费管理', result: '成功', ip: '192.168.1.103' },
  { key: '6', id: 'log-006', time: '2024-01-15 15:25:55', operator: '孙强', action: '登录系统', module: '系统管理', result: '失败', ip: '192.168.1.105' },
]

const columns: ColumnsType<LogItem> = [
  { title: '日志编号', dataIndex: 'id', key: 'id', width: '10%' },
  { title: '操作时间', dataIndex: 'time', key: 'time', width: '18%' },
  { title: '操作人', dataIndex: 'operator', key: 'operator', width: '12%' },
  { title: '操作模块', dataIndex: 'module', key: 'module', width: '12%' },
  { title: '操作内容', dataIndex: 'action', key: 'action', width: '20%' },
  {
    title: '操作结果',
    dataIndex: 'result',
    key: 'result',
    width: '10%',
    render: (result: string) => <Tag color={result === '成功' ? 'green' : 'red'}>{result}</Tag>,
  },
  { title: '操作IP', dataIndex: 'ip', key: 'ip', width: '18%' },
]

export default function LogsManagement() {
  const [searchValue, setSearchValue] = useState('')

  const filteredData = logList.filter((item) => {
    return item.operator.includes(searchValue) || item.action.includes(searchValue)
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">系统日志管理</h1>
          <p className="text-gray-500 mt-1">记录系统操作日志，支持查询和导出</p>
        </div>
        <Button icon={<DownloadOutlined />}>导出日志</Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索操作人或操作内容..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select placeholder="操作模块" style={{ width: 140 }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="系统管理">系统管理</Select.Option>
            <Select.Option value="党员管理">党员管理</Select.Option>
            <Select.Option value="组织生活">组织生活</Select.Option>
            <Select.Option value="党费管理">党费管理</Select.Option>
          </Select>
          <DatePicker.RangePicker style={{ width: 300 }} />
          <Button type="primary">查询</Button>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 20 }}
          rowKey="key"
          className="text-sm"
        />
      </Card>
    </div>
  )
}