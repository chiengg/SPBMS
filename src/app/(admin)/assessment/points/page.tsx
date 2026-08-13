'use client'

import { useState } from 'react'
import { Card, Table, Tag, Button, Row, Col, Progress, Statistic } from 'antd'
import { TrophyOutlined, TrendingUpOutlined, TrendingDownOutlined, FileTextOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { memberPoints } from '@/data/assessmentData'

const columns: ColumnsType<typeof memberPoints[0]> = [
  { 
    title: '排名', 
    dataIndex: 'rank', 
    key: 'rank', 
    width: '8%',
    render: (rank: number) => {
      if (rank === 1) return <Tag color="gold">1</Tag>
      if (rank === 2) return <Tag color="silver">2</Tag>
      if (rank === 3) return <Tag color="bronze">3</Tag>
      return <span className="text-gray-500">{rank}</span>
    },
  },
  { title: '党员编号', dataIndex: 'id', key: 'id', width: '10%' },
  { title: '姓名', dataIndex: 'name', key: 'name', width: '10%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '18%' },
  { 
    title: '总积分', 
    dataIndex: 'totalPoints', 
    key: 'totalPoints', 
    width: '10%',
    render: (points: number) => <span className="font-bold text-primary-600">{points}</span>,
  },
  { title: '基础分', dataIndex: 'basicPoints', key: 'basicPoints', width: '10%' },
  { title: '加分', dataIndex: 'bonusPoints', key: 'bonusPoints', width: '8%', render: (p: number) => <span className="text-green-600">+{p}</span> },
  { title: '扣分', dataIndex: 'deductPoints', key: 'deductPoints', width: '8%', render: (p: number) => <span className="text-red-600">-{p}</span> },
  { 
    title: '周增长', 
    key: 'trend', 
    width: '10%',
    render: (_: any, record: typeof memberPoints[0]) => (
      <span className={`flex items-center gap-1 ${record.lastWeekPoints >= 8 ? 'text-green-600' : 'text-red-600'}`}>
        {record.lastWeekPoints >= 8 ? <TrendingUpOutlined /> : <TrendingDownOutlined />}
        +{record.lastWeekPoints}
      </span>
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: '16%',
    render: () => (
      <Button icon={<FileTextOutlined />} size="small">查看详情</Button>
    ),
  },
]

export default function PointsManagement() {
  const [data] = useState(memberPoints)

  const avgPoints = Math.round(data.reduce((sum, m) => sum + m.totalPoints, 0) / data.length)
  const maxPoints = Math.max(...data.map((m) => m.totalPoints))
  const minPoints = Math.min(...data.map((m) => m.totalPoints))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党员积分管理</h1>
          <p className="text-gray-500 mt-1">管理党员积分，自动核算积分排名</p>
        </div>
        <Button icon={<FileTextOutlined />}>导出积分报表</Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">平均积分</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{avgPoints}</p>
              </div>
              <Statistic prefix={<TrendingUpOutlined />} value={5} suffix="%" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">最高积分</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{maxPoints}</p>
              </div>
              <TrophyOutlined className="text-yellow-500 text-3xl" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">最低积分</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{minPoints}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">达标率</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">80%</p>
              </div>
              <Progress percent={80} strokeColor="#9333ea" size="small" />
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="党员积分排行榜">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>
    </div>
  )
}