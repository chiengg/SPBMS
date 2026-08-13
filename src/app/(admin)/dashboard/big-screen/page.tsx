'use client'

import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Tag, Alert, Progress } from 'antd'
import { ApartmentOutlined, UserOutlined, CalendarOutlined, WalletOutlined, TrendingUpOutlined, AwardOutlined, AlertOutlined, CheckCircleOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

export default function BigScreen() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const orgChartOption = {
    tooltip: { trigger: 'item' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
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

  const memberChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['25岁以下', '26-35岁', '36-45岁', '46-55岁', '56岁以上'] },
    yAxis: { type: 'value' },
    series: [{
      data: [180, 420, 350, 220, 86],
      type: 'bar',
      barWidth: '60%',
      itemStyle: { borderRadius: [4, 4, 0, 0], color: '#dc2626' },
    }],
  }

  const activityChartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['三会一课', '主题党日', '组织生活会'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: '三会一课', type: 'line', smooth: true,
        data: [45, 52, 48, 55, 60, 58, 65, 70, 68, 72, 75, 80],
        lineStyle: { color: '#dc2626' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(220, 38, 38, 0.3)' }, { offset: 1, color: 'rgba(220, 38, 38, 0.05)' }] } },
      },
      {
        name: '主题党日', type: 'line', smooth: true,
        data: [12, 15, 14, 18, 20, 19, 22, 25, 24, 28, 30, 32],
        lineStyle: { color: '#3b82f6' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(59, 130, 246, 0.3)' }, { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }] } },
      },
      {
        name: '组织生活会', type: 'line', smooth: true,
        data: [2, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 4],
        lineStyle: { color: '#22c55e' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(34, 197, 94, 0.3)' }, { offset: 1, color: 'rgba(34, 197, 94, 0.05)' }] } },
      },
    ],
  }

  const rankChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['销售党支部', '生产党支部', '退休第一党支部', '第二党支部', '第一党支部'] },
    series: [{
      data: [72, 78, 85, 92, 98],
      type: 'bar',
      barWidth: '50%',
      label: { show: true, position: 'right', formatter: '{c}分' },
      itemStyle: { borderRadius: [0, 4, 4, 0], color: '#dc2626' },
    }],
  }

  const warnings = [
    { type: '党费逾期', content: '孙强、王磊等3名党员本月党费未缴纳', level: 'error' },
    { type: '换届提醒', content: '第二党支部将在1个月内到期换届', level: 'warning' },
    { type: '学习预警', content: '5名党员年度学习学时未达标60%', level: 'warning' },
    { type: '组织生活', content: '2名党员连续3个月未参加组织生活', level: 'error' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <ApartmentOutlined className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">党建智慧指挥平台</h1>
            <p className="text-gray-400 text-sm">中共XX市委员会</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">实时数据</p>
          <p className="text-lg font-mono">{time.toLocaleString('zh-CN')}</p>
        </div>
      </div>

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gray-800 border-gray-700">
            <Statistic title="党组织总数" value={23} prefix={<ApartmentOutlined className="text-primary-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gray-800 border-gray-700">
            <Statistic title="党员总数" value={1256} prefix={<UserOutlined className="text-blue-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gray-800 border-gray-700">
            <Statistic title="本月组织生活" value={48} prefix={<CalendarOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gray-800 border-gray-700">
            <Statistic title="党费收缴率" value="94.2%" prefix={<WalletOutlined className="text-yellow-500" />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={5}>
          <Card className="bg-gray-800 border-gray-700" title="组织与人员结构">
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">党组织层级分布</p>
              <ReactECharts option={orgChartOption} style={{ height: 200 }} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">党员年龄分布</p>
              <ReactECharts option={memberChartOption} style={{ height: 200 }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="bg-gray-800 border-gray-700" title="核心业务活跃度">
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">近12个月组织生活趋势</p>
              <ReactECharts option={activityChartOption} style={{ height: 300 }} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-500">85%</p>
                <p className="text-xs text-gray-400">年度学时达标率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">92%</p>
                <p className="text-xs text-gray-400">组织生活完成率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">88%</p>
                <p className="text-xs text-gray-400">考核通过率</p>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={5}>
          <Card className="bg-gray-800 border-gray-700" title="排名与监督预警">
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">支部考核排名</p>
              <ReactECharts option={rankChartOption} style={{ height: 220 }} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm">待审批</span>
                <Tag color="orange">3</Tag>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm">超期流程</span>
                <Tag color="red">2</Tag>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm">重点预警</span>
                <Tag color="red">4</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="mt-6">
        <Card className="bg-gray-800 border-gray-700" title="高风险预警">
          <div className="flex gap-4 overflow-x-auto">
            {warnings.map((warning, index) => (
              <Alert
                key={index}
                message={warning.type}
                description={warning.content}
                type={warning.level === 'error' ? 'error' : 'warning'}
                showIcon
                className="flex-shrink-0 w-72"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}