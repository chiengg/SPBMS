'use client'

import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd'
import { UserOutlined, TrendingUpOutlined, ArrowRightOutlined, FilterOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { ColumnsType } from 'antd/es/table'

interface MemberStat {
  key: string
  name: string
  orgName: string
  joinDate: string
  status: string
  transferCount: number
}

const memberStats: MemberStat[] = [
  { key: '1', name: '孙强', orgName: '第二党支部', joinDate: '2012-08-20', status: '转出中', transferCount: 1 },
  { key: '2', name: '李娜', orgName: '机关党总支', joinDate: '2015-06-15', status: '转入审核', transferCount: 1 },
  { key: '3', name: '王浩', orgName: '第一党支部', joinDate: '2018-03-20', status: '跨省转接', transferCount: 1 },
]

const columns: ColumnsType<MemberStat> = [
  { title: '姓名', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '所属组织', dataIndex: 'orgName', key: 'orgName' },
  { title: '入党时间', dataIndex: 'joinDate', key: 'joinDate' },
  { 
    title: '转接状态', 
    dataIndex: 'status', 
    key: 'status', 
    render: (status: string) => <Tag color={status === '转出中' ? 'orange' : status === '转入审核' ? 'blue' : 'cyan'}>{status}</Tag>,
  },
]

export default function MemberDashboard() {
  const funnelOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}人' },
    legend: { data: ['申请入党', '积极分子', '发展对象', '预备党员', '正式党员'] },
    series: [{
      type: 'funnel',
      left: '10%',
      top: '10%',
      bottom: '10%',
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside' },
      labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      emphasis: { label: { fontSize: 16 } },
      data: [
        { value: 1256, name: '正式党员', itemStyle: { color: '#dc2626' } },
        { value: 120, name: '预备党员', itemStyle: { color: '#f97316' } },
        { value: 80, name: '发展对象', itemStyle: { color: '#eab308' } },
        { value: 150, name: '积极分子', itemStyle: { color: '#3b82f6' } },
        { value: 200, name: '申请入党', itemStyle: { color: '#22c55e' } },
      ],
    }],
  }

  const structureOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['56岁以上', '46-55岁', '36-45岁', '26-35岁', '25岁以下'] },
    series: [{
      data: [86, 220, 350, 420, 180],
      type: 'bar',
      barWidth: '60%',
      itemStyle: { borderRadius: [0, 4, 4, 0], color: '#dc2626' },
    }],
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党员队伍看板</h1>
          <p className="text-gray-500 mt-1">党员总数、发展进度、结构分布分析</p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">党员总数</p>
                <Statistic value={1256} prefix={<UserOutlined className="text-primary-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本年发展</p>
                <Statistic value={12} prefix={<TrendingUpOutlined className="text-green-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">流动党员占比</p>
                <Statistic value="5%" />
              </div>
              <Progress percent={5} strokeColor="#3b82f6" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">转接中</p>
                <Statistic value={3} prefix={<ArrowRightOutlined className="text-orange-500" />} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="年度发展进度">
            <ReactECharts option={funnelOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="党员年龄分布">
            <ReactECharts option={structureOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="组织关系转接">
            <Table
              dataSource={memberStats}
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