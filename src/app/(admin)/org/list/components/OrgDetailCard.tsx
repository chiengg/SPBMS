'use client'

import { Card, Tag, Descriptions, Divider, Row, Col, Progress } from 'antd'
import { BuildOutlined, TeamOutlined, CalendarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons'
import type { OrgNode } from '@/data/orgData'

interface OrgDetailCardProps {
  org: OrgNode | null
}

export default function OrgDetailCard({ org }: OrgDetailCardProps) {
  if (!org) {
    return (
      <Card className="h-[calc(100vh-230px)] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BuildOutlined className="text-4xl mb-2" />
          <p>请选择一个党组织查看详情</p>
        </div>
      </Card>
    )
  }

  const getTypeConfig = () => {
    const configs: Record<string, { color: string; bg: string }> = {
      '党委': { color: 'red', bg: 'bg-red-50' },
      '党总支': { color: 'orange', bg: 'bg-orange-50' },
      '党支部': { color: 'blue', bg: 'bg-blue-50' },
      '党小组': { color: 'green', bg: 'bg-green-50' },
    }
    return configs[org.type] || configs['党支部']
  }

  const typeConfig = getTypeConfig()

  return (
    <Card className={`${typeConfig.bg} h-[calc(100vh-230px)] overflow-y-auto`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">{org.name}</h2>
            <Tag color={typeConfig.color}>{org.type}</Tag>
            <Tag color={org.status === '正常' ? 'green' : 'gray'}>{org.status}</Tag>
          </div>
        </div>
        <p className="text-sm text-gray-500">组织编码：{org.orgCode}</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <TeamOutlined />
              <span className="text-xs">党员人数</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{org.memberCount}</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <CalendarOutlined />
              <span className="text-xs">成立时间</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{org.foundDate}</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <BuildOutlined />
              <span className="text-xs">换届次数</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{org.establishmentCount}</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <UserOutlined />
              <span className="text-xs">支部书记</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{org.secretary}</p>
          </div>
        </Col>
      </Row>

      <Divider orientation="left">基本信息</Divider>

      <Descriptions column={2} bordered className="mb-6">
        <Descriptions.Item label="上级组织" span={2}>
          {org.parentName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="联系地址">
          <div className="flex items-center gap-1">
            <EnvironmentOutlined className="text-gray-400" />
            <span>{org.address}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="组织类型">{org.type}</Descriptions.Item>
      </Descriptions>

      {org.committeeMembers && org.committeeMembers.length > 0 && (
        <>
          <Divider orientation="left">支委成员</Divider>
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <div className="grid grid-cols-2 gap-3">
              {org.committeeMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Divider orientation="left">组织沿革</Divider>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">组织成立</p>
              <p className="text-xs text-gray-500">{org.foundDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">第{org.establishmentCount}次换届</p>
              <p className="text-xs text-gray-500">当前班子任期内</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}