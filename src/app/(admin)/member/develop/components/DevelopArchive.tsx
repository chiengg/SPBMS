'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Tree } from 'antd'
import { DownloadOutlined, FileTextOutlined, CheckCircleOutlined, AlertCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DevelopArchive } from '@/data/memberData'

interface DevelopArchiveProps {
  archives: DevelopArchive[]
}

const archiveColumns: ColumnsType<DevelopArchive> = [
  { title: '档案编号', dataIndex: 'archiveNo', key: 'archiveNo', width: '15%' },
  { title: '姓名', dataIndex: 'personName', key: 'personName', width: '10%' },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '15%' },
  {
    title: '材料完整性',
    key: 'completeness',
    width: '15%',
    render: (_, record) => {
      const totalRequired = record.stageFiles.reduce((sum, sf) => sum + sf.files.filter((f) => f.required).length, 0)
      const uploadedRequired = record.stageFiles.reduce((sum, sf) => sum + sf.files.filter((f) => f.required && f.uploaded).length, 0)
      const percent = totalRequired > 0 ? Math.round((uploadedRequired / totalRequired) * 100) : 100
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${percent === 100 ? 'bg-green-500' : percent >= 80 ? 'bg-blue-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-gray-600">{percent}%</span>
        </div>
      )
    },
  },
  {
    title: '状态',
    key: 'status',
    width: '10%',
    render: (_, record) => {
      const hasMissingRequired = record.stageFiles.some((sf) => sf.files.some((f) => f.required && !f.uploaded))
      return <Tag color={hasMissingRequired ? 'red' : 'green'}>{hasMissingRequired ? '材料不全' : '完整'}</Tag>
    },
  },
  { title: '创建日期', dataIndex: 'createdAt', key: 'createdAt', width: '12%' },
  {
    title: '操作',
    key: 'action',
    width: '23%',
    render: (_, record) => (
      <div className="flex gap-2">
        <Button size="small" onClick={() => handleViewArchive(record)}>查看详情</Button>
        <Button size="small" type="primary" icon={<DownloadOutlined />}>下载归档包</Button>
      </div>
    ),
  },
]

let archiveModalInstance: any = null

const handleViewArchive = (archive: DevelopArchive) => {
  archiveModalInstance = Modal.info({
    title: `${archive.personName} - 发展党员材料归档`,
    width: 800,
    content: (
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium">{archive.personName}</span>
            <span className="text-gray-500 ml-2">{archive.orgName}</span>
          </div>
          <span className="text-sm text-gray-500">档案编号：{archive.archiveNo}</span>
        </div>

        <Tree
          defaultExpandAll
          treeData={archive.stageFiles.map((stage) => ({
            title: (
              <div className="flex items-center justify-between">
                <span className="font-medium">{stage.stageName}</span>
                <span className="text-xs text-gray-500">
                  {stage.files.filter((f) => f.uploaded).length}/{stage.files.length} 份材料
                </span>
              </div>
            ),
            key: stage.stageName,
            children: stage.files.map((file) => ({
              title: (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {file.uploaded ? <CheckCircleOutlined className="text-green-500" /> : <WarningOutlined className="text-red-500" />}
                    <FileTextOutlined className="text-gray-400" />
                    <span className={file.required && !file.uploaded ? 'text-red-600' : ''}>{file.name}</span>
                    {file.required && <Tag color="default" className="text-xs">必传</Tag>}
                  </div>
                  <span className="text-xs text-gray-400">{file.size}</span>
                </div>
              ),
              key: file.name,
            })),
          }))}
        />
      </div>
    ),
    okText: '关闭',
  })
}

export default function DevelopArchiveList({ archives }: DevelopArchiveProps) {
  return (
    <div className="space-y-4">
      <Card title="发展党员材料归档" extra={
        <Button type="primary" icon={<DownloadOutlined />}>批量下载</Button>
      }>
        <Table
          dataSource={archives}
          columns={archiveColumns}
          rowKey="personId"
          pagination={{ pageSize: 20 }}
          className="text-sm"
        />
      </Card>
    </div>
  )
}