'use client'

import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd'
import { TrophyOutlined, TrendingUpOutlined, AlertOutlined, CheckCircleOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { ColumnsType } from 'antd/es/table'

interface AssessmentStat {
  key: string
  rank: number
  name: string
  orgName: string
  score: number
  level: string
}

const assessmentStats: AssessmentStat[] = [
  { key: '1', rank: 1, name: '王建国', orgName: '第一党支部', score: 98, level: '优秀' },
  { key: '2', rank: 2, name: '李芳芳', orgName: '机关党总支', score: 95, level: '优秀' },
  { key: '3', rank: 3, name: '张志强', orgName: '第二党支部', score: 93, level: '优秀' },
  { key: '4', rank: 4, name: '刘建华', orgName: '生产党支部', score: 91, level: '良好' },
  { key: '5', rank: 5, name: '陈明辉', orgName: '销售党支部', score: 89, level: '良好' },
]

const columns: ColumnsType<AssessmentStat> = [
  { 
    title: '排名', 
    dataIndex: 'rank', 
    key: 'rank', 
    width: '8%',
    render: (rank: number) => (
      <span className={`font-bold ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-500' : 'text-gray-500'}`}>
        {rank}
      </span>
    ),
  },
  { title: '姓名', dataIndex: 'name', key: 'name', width: '15%', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName', width: '25%' },
  { title: '考核得分', dataIndex: 'score', key: 'score', width: '15%', render: (score: number) => <span className="font-bold">{score}</span> },
  { 
    title: '考核等级', 
    dataIndex: 'level', 
    key: 'level', 
    width: '15%',
    render: (level: string) => <Tag color={level === '优秀' ? 'red' : level === '良好' ? 'orange' : level === '合格' ? 'blue' : 'gray'}>{level}</Tag>,
  },
]

export default function AssessmentDashboard() {
  const barChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['第一党支部', '第二党支部', '机关党总支', '生产党支部', '销售党支部'] },
    yAxis: { type: 'value', max: 100 },
    series: [{
      data: [92, 88, 95, 85, 90],
      type: 'bar',
      barWidth: '60%',
      itemStyle: { borderRadius: [4, 4, 0, 0], color: '#dc2626' },
    }],
  }

  const pieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c}人' },
      data: [
        { value: 256, name: '优秀', itemStyle: { color: '#dc2626' } },
        { value: 520, name: '良好', itemStyle: { color: '#f97316' } },
        { value: 450, name: '合格', itemStyle: { color: '#3b82f6' } },
        { value: 30, name: '不合格', itemStyle: { color: '#6b7280' } },
      ],
    }],
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">考核监督看板</h1>
          <p className="text-gray-500 mt-1">党员积分、支部考核、党风廉政情况</p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">党员积分达标率</p>
                <Statistic value="89%" />
              </div>
              <Progress percent={89} strokeColor="#dc2626" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">支部考核平均分</p>
                <Statistic value="90" prefix={<TrophyOutlined className="text-yellow-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">优秀党员</p>
                <Statistic value="256" prefix={<CheckCircleOutlined className="text-green-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">预警提醒</p>
                <Statistic value="3" prefix={<AlertOutlined className="text-orange-500" />} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="支部考核排名">
            <ReactECharts option={barChartOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="考核等级分布">
            <ReactECharts option={pieOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="党员积分TOP5">
            <Table
              dataSource={assessmentStats}
              columns={columns}
              pagination={false}
              rowKey="key"
              className="text-sm"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}