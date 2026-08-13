'use client'

import { useState } from 'react'
import { Card, List, Tag, Button, Input, Space, message } from 'antd'
import { SearchOutlined, BellOutlined, Bell, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

interface MessageItem {
  key: string
  type: string
  title: string
  content: string
  time: string
  read: boolean
}

const messageList: MessageItem[] = [
  { key: '1', type: 'system', title: '系统升级通知', content: '系统将于2024年1月18日22:00-00:00进行升级维护，届时系统将暂停服务，请提前做好数据备份。', time: '2024-01-15 09:00', read: false },
  { key: '2', type: 'fee', title: '党费催缴提醒', content: '您本月党费尚未缴纳，请在1月15日前完成缴纳，逾期将影响党员积分。', time: '2024-01-14 14:30', read: false },
  { key: '3', type: 'meeting', title: '组织生活通知', content: '第一党支部定于2024年1月16日下午3点召开党员大会，请准时参加。', time: '2024-01-14 10:00', read: true },
  { key: '4', type: 'learning', title: '学习任务提醒', content: '本月学习任务即将到期，请及时完成《习近平新时代中国特色社会主义思想》课程学习。', time: '2024-01-13 16:45', read: true },
  { key: '5', type: 'assessment', title: '考核结果通知', content: '2023年度党员考核结果已公布，请登录系统查看您的考核成绩。', time: '2024-01-12 11:00', read: true },
]

export default function MessageCenter() {
  const [searchValue, setSearchValue] = useState('')
  const [messages, setMessages] = useState(messageList)

  const filteredMessages = messages.filter((item) => {
    return item.title.includes(searchValue) || item.content.includes(searchValue)
  })

  const handleMarkAllRead = () => {
    setMessages(messages.map((msg) => ({ ...msg, read: true })))
    message.success('已全部标为已读')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <BellOutlined className="text-gray-500" />
      case 'fee':
        return <ClockCircleOutlined className="text-orange-500" />
      case 'meeting':
        return <CheckCircleOutlined className="text-blue-500" />
      case 'learning':
        return <Bell className="text-green-500" />
      case 'assessment':
        return <Bell className="text-purple-500" />
      default:
        return <BellOutlined className="text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'system':
        return '系统通知'
      case 'fee':
        return '党费提醒'
      case 'meeting':
        return '组织生活'
      case 'learning':
        return '学习提醒'
      case 'assessment':
        return '考核通知'
      default:
        return '通知'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">消息中心</h1>
          <p className="text-gray-500 mt-1">查看系统通知和业务提醒</p>
        </div>
        <Button onClick={handleMarkAllRead}>全部标为已读</Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索消息内容..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Space>
          <Tag color="blue" className="cursor-pointer">全部</Tag>
          <Tag className="cursor-pointer">系统通知</Tag>
          <Tag className="cursor-pointer">业务提醒</Tag>
        </Space>
      </div>

      <Card>
        <List
          dataSource={filteredMessages}
          renderItem={(item) => (
            <List.Item
              key={item.key}
              className={`flex items-start gap-4 p-4 border-b border-gray-100 last:border-b-0 ${
                !item.read ? 'bg-gray-50' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!item.read ? 'bg-primary-100' : 'bg-gray-100'}`}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className={`font-medium ${!item.read ? 'text-gray-900' : 'text-gray-600'}`}>{item.title}</h3>
                  <Tag color={item.type === 'system' ? 'gray' : item.type === 'fee' ? 'orange' : item.type === 'meeting' ? 'blue' : item.type === 'learning' ? 'green' : 'purple'}>
                    {getTypeLabel(item.type)}
                  </Tag>
                  {!item.read && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
                </div>
                <p className="text-gray-500 text-sm mt-1">{item.content}</p>
                <p className="text-gray-400 text-xs mt-2">{item.time}</p>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}