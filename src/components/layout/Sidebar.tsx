'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  DashboardOutlined,
  ApartmentOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  WalletOutlined,
  FlagOutlined,
  TrophyOutlined,
  HeartOutlined,
  BarChartOutlined,
  SettingOutlined,
  RightOutlined,
  LeftOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined className="text-primary-600" />,
    label: '首页工作台',
  },
  {
    key: '/org',
    icon: <ApartmentOutlined className="text-primary-600" />,
    label: '组织与党员',
    children: [
      { key: '/org/list', label: '组织与党员' },
      { key: '/org/election', label: '换届选举管理' },
      { key: '/member/develop', label: '发展党员' },
      { key: '/member/transfer', label: '组织关系转接' },
      { key: '/member/floating', label: '流动党员管理' },
    ],
  },
  {
    key: '/meeting',
    icon: <CalendarOutlined className="text-primary-600" />,
    label: '组织生活管理',
    children: [
      { key: '/meeting/plan', label: '三会一课计划' },
      { key: '/meeting/list', label: '会议记录' },
      { key: '/meeting/theme', label: '主题党日' },
      { key: '/meeting/life', label: '组织生活会' },
    ],
  },
  {
    key: '/learning',
    icon: <BookOutlined className="text-primary-600" />,
    label: '学习教育',
    children: [
      { key: '/learning/resources', label: '学习资源库' },
      { key: '/learning/tasks', label: '学习任务' },
      { key: '/learning/exam', label: '在线考试' },
      { key: '/learning/notes', label: '心得体会' },
    ],
  },
  {
    key: '/fee',
    icon: <WalletOutlined className="text-primary-600" />,
    label: '党费管理',
    children: [
      { key: '/fee/calculate', label: '党费核算' },
      { key: '/fee/collect', label: '党费收缴' },
      { key: '/fee/use', label: '党费使用' },
      { key: '/fee/public', label: '党费公示' },
    ],
  },
  {
    key: '/portal',
    icon: <FlagOutlined className="text-primary-600" />,
    label: '宣传与思想阵地',
    children: [
      { key: '/portal/news', label: '党建资讯' },
      { key: '/portal/showcase', label: '党建风采' },
      { key: '/portal/red', label: '红色教育资源' },
    ],
  },
  {
    key: '/assessment',
    icon: <TrophyOutlined className="text-primary-600" />,
    label: '监督考核',
    children: [
      { key: '/assessment/points', label: '党员积分' },
      { key: '/assessment/branch', label: '支部考核' },
      { key: '/assessment/clean', label: '党风廉政' },
    ],
  },
  {
    key: '/feature',
    icon: <HeartOutlined className="text-primary-600" />,
    label: '特色业务',
    children: [
      { key: '/feature/double-report', label: '双报到双服务' },
      { key: '/feature/volunteer', label: '志愿服务' },
      { key: '/feature/people', label: '我为群众办实事' },
    ],
  },
  {
    key: '/dashboard',
    icon: <BarChartOutlined className="text-primary-600" />,
    label: '数据驾驶舱',
    children: [
      { key: '/dashboard/big-screen', label: '党委指挥大屏' },
      { key: '/dashboard/org', label: '组织建设看板' },
      { key: '/dashboard/member', label: '党员队伍看板' },
      { key: '/dashboard/meeting', label: '组织生活看板' },
      { key: '/dashboard/learning', label: '学习教育看板' },
      { key: '/dashboard/fee', label: '党费管理看板' },
      { key: '/dashboard/assessment', label: '考核监督看板' },
    ],
  },
  {
    key: '/system',
    icon: <SettingOutlined className="text-primary-600" />,
    label: '系统管理',
    children: [
      { key: '/system/roles', label: '角色权限管理' },
      { key: '/system/users', label: '用户管理' },
      { key: '/system/messages', label: '消息中心' },
      { key: '/system/config', label: '系统配置' },
      { key: '/system/logs', label: '日志查询' },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [openKeys, setOpenKeys] = useState<string[]>(['/org', '/member'])

  useEffect(() => {
    const parentKey = pathname.split('/').slice(0, 2).join('/') || '/'
    if (parentKey !== '/') {
      setOpenKeys([parentKey])
    }
  }, [pathname])

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center h-16 px-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <CrownOutlined className="text-white text-xl" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">党建管理系统</span>
              <span className="text-xs text-gray-400">Party Building System</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[pathname]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={handleMenuClick}
          className="bg-gray-900 border-none h-full"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
          }}
        />
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        {collapsed ? (
          <RightOutlined className="text-gray-400 text-sm" />
        ) : (
          <LeftOutlined className="text-gray-400 text-sm" />
        )}
      </button>
    </aside>
  )
}