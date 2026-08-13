'use client'

import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ApartmentOutlined,
  BookOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Card, Table, Tag, Progress, Statistic, Row, Col, Button, Calendar } from 'antd'
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface TodoItem {
  key: string
  title: string
  type: string
  deadline: string
  status: string
}

interface QuickStat {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendType?: 'up' | 'down'
}

const quickStats: QuickStat[] = [
  { title: '党组织总数', value: '23', icon: <ApartmentOutlined className="text-primary-600" /> },
  { title: '党员总数', value: '1,256', icon: <UserOutlined className="text-blue-600" /> },
  { title: '本月组织生活', value: '48', icon: <CalendarOutlined className="text-green-600" /> },
  { title: '党费收缴率', value: '94.2%', icon: <WalletOutlined className="text-yellow-600" /> },
]

const todoItems: TodoItem[] = [
  { key: '1', title: '审核第三党支部换届申请', type: '换届', deadline: '今天', status: '待审批' },
  { key: '2', title: '查看发展党员进度', type: '发展党员', deadline: '明天', status: '进行中' },
  { key: '3', title: '确认组织关系转接回执', type: '组织关系', deadline: '本周', status: '待确认' },
  { key: '4', title: '发布本月学习任务', type: '学习教育', deadline: '本周', status: '待处理' },
  { key: '5', title: '审核党费使用申请', type: '党费管理', deadline: '下周', status: '待审批' },
]

const recentMeetings = [
  { key: '1', name: '第一党支部党员大会', date: '2024-01-15', type: '支部大会', status: '已完成' },
  { key: '2', name: '总支委员会会议', date: '2024-01-12', type: '支委会', status: '已完成' },
  { key: '3', name: '主题党日活动', date: '2024-01-10', type: '主题党日', status: '已完成' },
  { key: '4', name: '第二党支部党课', date: '2024-01-08', type: '党课', status: '已完成' },
  { key: '5', name: '组织生活会', date: '2024-01-05', type: '组织生活会', status: '已完成' },
]

const columns: ColumnsType<TodoItem> = [
  { title: '待办事项', dataIndex: 'title', key: 'title', width: '40%' },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => (
      <Tag color={getTypeColor(type)}>{type}</Tag>
    ),
  },
  { title: '截止时间', dataIndex: 'deadline', key: 'deadline' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={getStatusColor(status)}>{status}</Tag>
    ),
  },
]

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    '换届': 'orange',
    '发展党员': 'red',
    '组织关系': 'blue',
    '学习教育': 'green',
    '党费管理': 'gold',
  }
  return colors[type] || 'default'
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    '待审批': 'red',
    '进行中': 'blue',
    '待确认': 'orange',
    '待处理': 'default',
  }
  return colors[status] || 'default'
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'todo' | 'meeting'>('todo')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">首页工作台</h1>
        <p className="text-gray-500 mt-1">欢迎回来，张管理员！这是您的党务工作概览。</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        {quickStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <Statistic value={stat.value} className="text-2xl font-bold text-gray-800" />
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col lg={16} xs={24}>
          <Card
            title="待办事项"
            extra={
              <div className="flex gap-2">
                <Button
                  type={activeTab === 'todo' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setActiveTab('todo')}
                >
                  待办
                </Button>
                <Button
                  type={activeTab === 'meeting' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setActiveTab('meeting')}
                >
                  近期会议
                </Button>
              </div>
            }
          >
            {activeTab === 'todo' ? (
              <Table
                dataSource={todoItems}
                columns={columns}
                pagination={false}
                rowKey="key"
                className="text-sm"
              />
            ) : (
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div
                    key={meeting.key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarOutlined className="text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-800">{meeting.name}</p>
                        <p className="text-xs text-gray-500">{meeting.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Tag color="blue">{meeting.type}</Tag>
                      <CheckCircleOutlined className="text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        <Col lg={8} xs={24}>
          <Card title="预警提醒">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertOutlined className="text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">党费逾期提醒</p>
                  <p className="text-xs text-gray-500 mt-1">3名党员本月党费未缴纳</p>
                  <Button type="link" size="small" className="text-primary-600 p-0 h-auto mt-2">
                    立即催缴
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <ClockCircleOutlined className="text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">换届到期提醒</p>
                  <p className="text-xs text-gray-500 mt-1">2个支部将在1个月内到期</p>
                  <Button type="link" size="small" className="text-primary-600 p-0 h-auto mt-2">
                    查看详情
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <BookOutlined className="text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">学习任务提醒</p>
                  <p className="text-xs text-gray-500 mt-1">本周学习任务即将截止</p>
                  <Button type="link" size="small" className="text-primary-600 p-0 h-auto mt-2">
                    查看进度
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col lg={8} xs={24}>
          <Card title="学习进度">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">年度学习达标率</span>
                  <span className="font-medium text-gray-800">78%</span>
                </div>
                <Progress percent={78} strokeColor="#dc2626" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">本月学习完成率</span>
                  <span className="font-medium text-gray-800">92%</span>
                </div>
                <Progress percent={92} strokeColor="#10b981" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">考试通过率</span>
                  <span className="font-medium text-gray-800">85%</span>
                </div>
                <Progress percent={85} strokeColor="#3b82f6" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">心得体会完成率</span>
                  <span className="font-medium text-gray-800">72%</span>
                </div>
                <Progress percent={72} strokeColor="#f59e0b" />
              </div>
            </div>
          </Card>
        </Col>

        <Col lg={8} xs={24}>
          <Card title="工作日历">
            <Calendar
              value={dayjs()}
              onSelect={(value) => {
                console.log('Selected date:', value?.format('YYYY-MM-DD'))
              }}
              cellRender={(date) => {
                const dateStr = date.format('YYYY-MM-DD')
                const events: Record<string, string[]> = {
                  '2024-01-15': ['党员大会'],
                  '2024-01-17': ['主题党日'],
                  '2024-01-20': ['组织生活会'],
                }
                const dayEvents = events[dateStr] || []
                return (
                  <div className="relative">
                    <span className="block text-center">
                      {date.date()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 2).map((_, idx) => (
                          <span key={idx} className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}