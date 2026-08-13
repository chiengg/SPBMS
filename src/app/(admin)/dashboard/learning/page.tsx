'use client'

import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd'
import { BookOutlined, UserOutlined, AwardOutlined, FileTextOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { ColumnsType } from 'antd/es/table'

interface LearningStat {
  key: string
  courseName: string
  category: string
  learners: number
  completionRate: string
}

const learningStats: LearningStat[] = [
  { key: '1', courseName: '习近平新时代中国特色社会主义思想', category: '必修课', learners: 1256, completionRate: '95%' },
  { key: '2', courseName: '党的二十大精神学习', category: '必修课', learners: 1200, completionRate: '88%' },
  { key: '3', courseName: '党史学习教育', category: '必修课', learners: 1180, completionRate: '92%' },
  { key: '4', courseName: '党风廉政建设', category: '选修课', learners: 520, completionRate: '75%' },
]

const columns: ColumnsType<LearningStat> = [
  { title: '课程名称', dataIndex: 'courseName', key: 'courseName', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '课程类别', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color={cat === '必修课' ? 'red' : 'blue'}>{cat}</Tag> },
  { title: '学习人数', dataIndex: 'learners', key: 'learners' },
  { title: '完成率', dataIndex: 'completionRate', key: 'completionRate', render: (rate: string) => <span className="text-green-600">{rate}</span> },
]

export default function LearningDashboard() {
  const hoursChartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value', name: '学习时长(小时)' },
    series: [{
      data: [850, 920, 880, 1050, 980, 1120],
      type: 'bar',
      barWidth: '60%',
      itemStyle: { borderRadius: [4, 4, 0, 0], color: '#dc2626' },
    }],
  }

  const categoryOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}门 ({d}%)' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c}门' },
      data: [
        { value: 15, name: '必修课', itemStyle: { color: '#dc2626' } },
        { value: 30, name: '选修课', itemStyle: { color: '#3b82f6' } },
        { value: 10, name: '专题讲座', itemStyle: { color: '#f97316' } },
        { value: 25, name: '视频课程', itemStyle: { color: '#22c55e' } },
      ],
    }],
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">学习教育看板</h1>
          <p className="text-gray-500 mt-1">学习时长、课程资源、考试成绩统计</p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">学习资源总数</p>
                <Statistic value={80} prefix={<BookOutlined className="text-primary-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月学习时长(小时)</p>
                <Statistic value={1120} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">学习完成率</p>
                <Statistic value="86%" />
              </div>
              <Progress percent={86} strokeColor="#dc2626" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">心得体会</p>
                <Statistic value={45} prefix={<FileTextOutlined className="text-blue-500" />} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="学习时长趋势">
            <ReactECharts option={hoursChartOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="课程类别分布">
            <ReactECharts option={categoryOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="热门课程">
            <Table
              dataSource={learningStats}
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