'use client'

import { Card, Row, Col, Table, Tag, Progress, Statistic } from 'antd'
import { ApartmentOutlined, TrendingUpOutlined, CalendarOutlined, MapPinOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { ColumnsType } from 'antd/es/table'

interface OrgStat {
  key: string
  name: string
  type: string
  memberCount: number
  thisYearNew: number
  electionStatus: string
  deadline: string
}

const orgStats: OrgStat[] = [
  { key: '1', name: '第一党支部', type: '党支部', memberCount: 45, thisYearNew: 3, electionStatus: '正常', deadline: '2025-05-15' },
  { key: '2', name: '第二党支部', type: '党支部', memberCount: 56, thisYearNew: 2, electionStatus: '即将换届', deadline: '2024-03-15' },
  { key: '3', name: '生产党支部', type: '党支部', memberCount: 120, thisYearNew: 5, electionStatus: '换届中', deadline: '2024-04-20' },
  { key: '4', name: '销售党支部', type: '党支部', memberCount: 89, thisYearNew: 1, electionStatus: '正常', deadline: '2025-09-10' },
]

const columns: ColumnsType<OrgStat> = [
  { title: '组织名称', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '组织类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === '党委' ? 'red' : type === '党总支' ? 'orange' : 'blue'}>{type}</Tag> },
  { title: '党员人数', dataIndex: 'memberCount', key: 'memberCount' },
  { title: '本年新增', dataIndex: 'thisYearNew', key: 'thisYearNew', render: (n: number) => <span className="text-green-600">+{n}</span> },
  { 
    title: '换届状态', 
    dataIndex: 'electionStatus', 
    key: 'electionStatus', 
    render: (status: string) => <Tag color={status === '正常' ? 'green' : status === '即将换届' ? 'orange' : 'blue'}>{status}</Tag>,
  },
  { title: '任期到期', dataIndex: 'deadline', key: 'deadline' },
]

export default function OrgDashboard() {
  const orgChartOption = {
    tooltip: { trigger: 'item' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c}个' },
      data: [
        { value: 1, name: '党委', itemStyle: { color: '#dc2626' } },
        { value: 3, name: '党总支', itemStyle: { color: '#f97316' } },
        { value: 8, name: '党支部', itemStyle: { color: '#3b82f6' } },
        { value: 2, name: '党小组', itemStyle: { color: '#22c55e' } },
      ],
    }],
  }

  const trendChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [
      { name: '新增', type: 'bar', data: [5, 8, 3, 6, 4, 7], itemStyle: { color: '#22c55e' } },
      { name: '撤销', type: 'bar', data: [0, 1, 0, 0, 1, 0], itemStyle: { color: '#ef4444' } },
    ],
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">组织建设看板</h1>
          <p className="text-gray-500 mt-1">党组织数量、新增撤销、换届进度分析</p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">党组织总数</p>
                <Statistic value={23} prefix={<ApartmentOutlined className="text-primary-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本年新增</p>
                <Statistic value={12} prefix={<TrendingUpOutlined className="text-green-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">换届完成率</p>
                <Statistic value="75%" />
              </div>
              <Progress percent={75} strokeColor="#dc2626" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">即将到期</p>
                <Statistic value={2} prefix={<CalendarOutlined className="text-orange-500" />} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="党组织层级分布">
            <ReactECharts option={orgChartOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="本年新增/撤销趋势">
            <ReactECharts option={trendChartOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="组织分布地图">
            <div className="h-60 bg-gray-100 rounded flex items-center justify-center">
              <MapPinOutlined className="text-gray-400 text-4xl" />
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="党组织明细" className="mt-6">
        <Table
          dataSource={orgStats}
          columns={columns}
          pagination={false}
          rowKey="key"
          className="text-sm"
        />
      </Card>
    </div>
  )
}