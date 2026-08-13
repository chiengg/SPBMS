'use client'

import { BellOutlined, SearchOutlined, UserOutlined, DownOutlined, MailOutlined } from '@ant-design/icons'
import { Badge, Dropdown, Input, Space } from 'antd'
import { useState } from 'react'

interface HeaderProps {
  collapsed: boolean
}

export default function Header({ collapsed }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('')

  const userMenuItems = [
    { key: '1', label: '个人中心' },
    { key: '2', label: '修改密码' },
    { key: '3', label: '退出登录' },
  ]

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索党组织、党员、会议..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Space className="cursor-pointer">
            <Badge count={3} dot>
              <MailOutlined className="text-gray-500 text-lg" />
            </Badge>
          </Space>

          <Space className="cursor-pointer">
            <Badge count={5} overflowCount={99}>
              <BellOutlined className="text-gray-500 text-lg" />
            </Badge>
          </Space>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
              <UserOutlined className="text-primary-600 text-lg" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-800">张管理员</div>
              <div className="text-xs text-gray-500">党委管理员</div>
            </div>
            <Dropdown menu={{ items: userMenuItems }}>
              <div className="flex items-center cursor-pointer">
                <DownOutlined className="text-gray-400" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}