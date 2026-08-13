'use client'

import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd'
import { WalletOutlined, TrendingUpOutlined, AlertCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { ColumnsType } from 'antd/es/table'

interface FeeStat {
  key: string
  orgName: string
  totalAmount: string
  collectedAmount: string
  uncollected: string
  rate: string
}

const feeStats: FeeStat[] = [
  { key: '1', orgName: '第一党支部', totalAmount: '¥4,500', collectedAmount: '¥4,320', uncollected: '¥180', rate: '96%' },
  { key: '2', orgName: '第二党支部', totalAmount: '¥5,600', collectedAmount: '¥5,040', uncollected: '¥560', rate: '90%' },
  { key: '3', orgName: '生产党支部', totalAmount: '¥12,000', collectedAmount: '¥10,800', uncollected: '¥1,200', rate: '90%' },
  { key: '4', orgName: '销售党支部', totalAmount: '¥8,900', collectedAmount: '¥8,544', uncollected: '¥356', rate: '96%' },
]

const columns: ColumnsType<FeeStat> = [
  { title: '组织名称', dataIndex: 'orgName', key: 'orgName', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '应收金额', dataIndex: 'totalAmount', key: 'totalAmount' },
  { title: '已收金额', dataIndex: 'collectedAmount', key: 'collectedAmount' },
  { title: '未收金额', dataIndex: 'uncollected', key: 'uncollected', render: (text: string) => <span className="text-red-600">{text}</span> },
  { title: '收缴率', dataIndex: 'rate', key: 'rate', render: (rate: string) => <span className={parseFloat(rate) >= 95 ? 'text-green-600' : parseFloat(rate) >= 90 ? 'text-yellow-600' : 'text-red-600'}>{rate}</span> },
]

export default function FeeDashboard() {
  const trendChartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['应收', '已收'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value', name: '金额(元)' },
    series: [
      { name: '应收', type: 'line', data: [52000, 54000, 53000, 55000, 56000, 58000], itemStyle: { color: '#dc2626' } },
      { name: '已收', type: 'line', data: [49000, 51000, 50000, 52000, 53000, 54000], itemStyle: { color: '#22c55e' } },
    ],
  }

  const pieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}元 ({d}%)' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c}元' },
      data: [
        { value: 31208, name: '已收缴', itemStyle: { color: '#22c55e' } },
        { value: 2256, name: '未收缴', itemStyle: { color: '#dc2626' } },
      ],
    }],
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党费管理看板</h1>
          <p className="text-gray-500 mt-1">党费收缴情况、使用统计、公示管理</p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月应收党费</p>
                <Statistic value="¥33,456" prefix={<WalletOutlined className="text-primary-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月已收党费</p>
                <Statistic value="¥31,208" prefix={<TrendingUpOutlined className="text-green-500" />} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">收缴率</p>
                <Statistic value="93.3%" />
              </div>
              <Progress percent={93.3} strokeColor="#dc2626" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">未缴人数</p>
                <Statistic value="86" prefix={<AlertCircleOutlined className="text-orange-500" />} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="党费收缴趋势">
            <ReactECharts option={trendChartOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="收缴比例">
            <ReactECharts option={pieOption} style={{ height: 250 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="各支部收缴情况">
            <Table
              dataSource={feeStats}
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