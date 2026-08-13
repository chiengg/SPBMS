'use client'

import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd'
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { ColumnsType } from 'antd/es/table'

interface MeetingStat {
  key: string
  name: string
  type: string
  date: string
  status: string
  participants: number
}

const meetingStats: MeetingStat[] = [
  { key: '1', name: '第一党支部党员大会', type: '党员大会', date: '2024-01-15', status: '已完成', participants: 45 },
  { key: '2', name: '第二党支部支委会', type: '支委会', date: '2024-01-14', status: '已完成', participants: 5 },
  { key: '3', name: '机关党总支党课', type: '党课', date: '2024-01-16', status: '未开始', participants: 0 },
  { key: '4', name: '生产党支部党小组会', type: '党小组会', date: '2024-01-17', status: '未开始', participants: 0 },
]

const columns: ColumnsType<MeetingStat> = [
  { title: '会议名称', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '会议类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === '党员大会' ? 'red' : type === '支委会' ? 'orange' : type === '党课' ? 'blue' : 'green'}>{type}</Tag> },
  { title: '会议日期', dataIndex: 'date', key: 'date' },
  {
    title: '会议状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '已完成' ? 'green' : 'orange'}>{status}</Tag>,
  },
  { title: '参与人数', dataIndex: 'participants', key: 'participants' },
]

export default function MeetingDashboard() {
  const trendChartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['党员大会', '支委会', '党小组会', '党课'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [
      { name: '党员大会', type: 'line', data: [8, 10, 9, 12, 11, 10], itemStyle: { color: '#dc2626' } },
      { name: '支委会', type: 'line', data: [12, 14, 13, 15, 14, 16], itemStyle: { color: '#f97316' } },
      { name: '党小组会', type: 'line', data: [24, 28, 26, 30, 28, 32], itemStyle: { color: '#3b82f6' } },
      { name: '党课', type: 'line', data: [6, 8, 7, 9, 8, 10], itemStyle: { color: '#22c55e' } },
    ],
  }

  const pieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}次 ({d}%)' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c}次' },
      data: [
        { value: 48, name: '党员大会', itemStyle: { color: '#dc2626' } },
        { value: 78, name: '支委会', itemStyle: { color: '#f97316' } },
        { value: 168, name: '党小组会', itemStyle: { color: '#3b82f6' } },
        { value: 48, name: '党课', itemStyle: { color: '#22c55e' } },
      ],
    }],
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">组织生活看板</h1>
          <p className="text-gray-500 mt-1">三会一课开展情况、主题党日活动统计</p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月组织生活</p>
                <Statistic value={48} prefix={<CalendarOutlined className="text-primary-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">完成率</p>
                <Statistic value="85%" />
              </div>
              <Progress percent={85} strokeColor="#dc2626" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">主题党日</p>
                <Statistic value={5} prefix={<FileTextOutlined className="text-blue-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">会议记录完整率</p>
                <Statistic value="92%" />
              </div>
              <Progress percent={92} strokeColor="#22c55e" size="small" />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="三会一课趋势">
            <ReactECharts option={trendChartOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="会议类型分布">
            <ReactECharts option={pieOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="近期会议">
            <Table
              dataSource={meetingStats}
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