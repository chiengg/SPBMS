'use client'

import { useState, useEffect, useMemo } from 'react'
import { Tree, Card, Button, Dropdown, Tooltip, Modal } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MergeCellsOutlined,
  SplitCellsOutlined,
  ArrowRightOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import type { DataNode, TreeProps } from 'antd/es/tree'
import type { OrgNode } from '@/data/orgData'

interface OrgTreePanelProps {
  treeData: OrgNode[]
  selectedOrgId: string
  onSelectOrg: (orgId: string, orgName: string) => void
  onAddOrg: (parentId: string, parentName: string) => void
  onEditOrg: (org: OrgNode) => void
  onRevokeOrg: (org: OrgNode) => void
  onMergeOrg: (orgId: string) => void
  onSplitOrg: (orgId: string) => void
  onTransferOrg: (orgId: string) => void
}

const pendingProcesses: Record<string, number> = {
  'org-006': 2,
  'org-008': 5,
  'org-009': 1,
}

function checkPendingProcesses(orgId: string): boolean {
  return pendingProcesses[orgId] !== undefined && pendingProcesses[orgId] > 0
}

function getPendingCount(orgId: string): number {
  return pendingProcesses[orgId] || 0
}

function buildOrgMap(data: OrgNode[], map: Map<string, OrgNode> = new Map()): Map<string, OrgNode> {
  data.forEach((item) => {
    map.set(item.id, item)
    if (item.children) {
      buildOrgMap(item.children, map)
    }
  })
  return map
}

function buildTreeNodes(data: OrgNode[], level: number = 0): DataNode[] {
  return data.map((item) => {
    const hasChildren = item.children && item.children.length > 0
    return {
      title: (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
            <span>{item.name}</span>
            <span className="text-xs text-gray-400">[{item.memberCount}人]</span>
          </div>
          <Dropdown
            menu={{
              items: getMenuItems(item, level, hasChildren),
            }}
            trigger={['click']}
          >
            <Button type="text" size="small" icon={<MoreOutlined />} className="hover:bg-gray-100" />
          </Dropdown>
        </div>
      ),
      key: item.id,
      icon: null,
      children: item.children && item.children.length > 0 ? buildTreeNodes(item.children, level + 1) : undefined,
    }
  })
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    '正常': 'bg-green-500',
    '已撤销': 'bg-gray-400',
    '撤销审批中': 'bg-yellow-500',
    '合并审批中': 'bg-orange-500',
    '划转审批中': 'bg-blue-500',
  }
  return colors[status] || 'bg-gray-400'
}

const menuItemsCache = new Map<string, any[]>()

function getMenuItems(org: OrgNode, level: number, hasChildren: boolean): any[] {
  const key = `${org.id}-${level}-${hasChildren}`
  if (menuItemsCache.has(key)) {
    return menuItemsCache.get(key)!
  }

  const hasPending = checkPendingProcesses(org.id)

  const items: any[] = [
    {
      key: 'add',
      label: '新增下级组织',
      icon: <PlusOutlined />,
      disabled: level >= 3,
    },
    {
      key: 'edit',
      label: '编辑组织',
      icon: <EditOutlined />,
      disabled: org.status === '已撤销',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'revoke',
      label: '撤销组织',
      icon: <DeleteOutlined />,
      danger: true,
      disabled: org.status !== '正常' || org.id === 'org-001' || hasPending,
    },
    {
      key: 'merge',
      label: '合并组织',
      icon: <MergeCellsOutlined />,
      disabled: org.status !== '正常' || level === 0 || hasPending,
    },
    {
      key: 'split',
      label: '拆分组织',
      icon: <SplitCellsOutlined />,
      disabled: org.status !== '正常' || level < 2 || !hasChildren || hasPending,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'transfer',
      label: '调整隶属关系',
      icon: <ArrowRightOutlined />,
      disabled: org.status !== '正常' || org.id === 'org-001' || hasPending,
    },
  ]

  menuItemsCache.set(key, items)
  return items
}

export default function OrgTreePanel({
  treeData,
  selectedOrgId,
  onSelectOrg,
  onAddOrg,
  onEditOrg,
  onRevokeOrg,
  onMergeOrg,
  onSplitOrg,
  onTransferOrg,
}: OrgTreePanelProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [contextMenuOrg, setContextMenuOrg] = useState<OrgNode | null>(null)
  const [contextMenuLevel, setContextMenuLevel] = useState(0)

  const orgMap = useMemo(() => buildOrgMap(treeData), [treeData])

  const handleSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      const org = orgMap.get(selectedKeys[0])
      if (org) {
        onSelectOrg(selectedKeys[0], org.name)
      }
    }
  }

  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys)
  }

  const handleAddRootOrg = () => {
    onAddOrg('', '')
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    if (!contextMenuOrg) return

    switch (key) {
      case 'add':
        onAddOrg(contextMenuOrg.id, contextMenuOrg.name)
        break
      case 'edit':
        onEditOrg(contextMenuOrg)
        break
      case 'revoke':
        if (checkPendingProcesses(contextMenuOrg.id)) {
          Modal.warning({
            title: '操作提示',
            content: `该组织下存在${getPendingCount(contextMenuOrg.id)}条未办结流程，请处理完成后再操作`,
          })
          return
        }
        onRevokeOrg(contextMenuOrg)
        break
      case 'merge':
        if (checkPendingProcesses(contextMenuOrg.id)) {
          Modal.warning({
            title: '操作提示',
            content: `该组织下存在${getPendingCount(contextMenuOrg.id)}条未办结流程，请处理完成后再操作`,
          })
          return
        }
        onMergeOrg(contextMenuOrg.id)
        break
      case 'split':
        if (checkPendingProcesses(contextMenuOrg.id)) {
          Modal.warning({
            title: '操作提示',
            content: `该组织下存在${getPendingCount(contextMenuOrg.id)}条未办结流程，请处理完成后再操作`,
          })
          return
        }
        onSplitOrg(contextMenuOrg.id)
        break
      case 'transfer':
        if (checkPendingProcesses(contextMenuOrg.id)) {
          Modal.warning({
            title: '操作提示',
            content: `该组织下存在${getPendingCount(contextMenuOrg.id)}条未办结流程，请处理完成后再操作`,
          })
          return
        }
        onTransferOrg(contextMenuOrg.id)
        break
    }
  }

  const handleDropdownVisibleChange = (visible: boolean, org?: OrgNode, level?: number) => {
    if (visible && org && level !== undefined) {
      setContextMenuOrg(org)
      setContextMenuLevel(level)
    }
  }

  const treeDataWithMenuHandler = useMemo(() => {
    const traverse = (nodes: DataNode[], data: OrgNode[], level: number = 0): DataNode[] => {
      return nodes.map((node, index) => {
        const org = data[index]
        const hasChildren = org.children && org.children.length > 0
        return {
          ...node,
          title: (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(org.status)}`} />
                <span>{org.name}</span>
                <span className="text-xs text-gray-400">[{org.memberCount}人]</span>
              </div>
              <Dropdown
                menu={{
                  items: getMenuItems(org, level, hasChildren),
                  onClick: handleMenuClick,
                }}
                trigger={['click']}
                onVisibleChange={(visible) => handleDropdownVisibleChange(visible, org, level)}
              >
                <Button type="text" size="small" icon={<MoreOutlined />} className="hover:bg-gray-100" />
              </Dropdown>
            </div>
          ),
          children: node.children && org.children
            ? traverse(node.children, org.children, level + 1)
            : undefined,
        }
      })
    }

    const baseNodes = buildTreeNodes(treeData)
    return traverse(baseNodes, treeData)
  }, [treeData])

  return (
    <Card
      title="组织架构"
      className="h-[calc(100vh-180px)]"
      extra={
        <Tooltip title="新增顶层组织">
          <Button icon={<PlusOutlined />} size="small" onClick={handleAddRootOrg} />
        </Tooltip>
      }
    >
      <Tree
        treeData={treeDataWithMenuHandler}
        expandedKeys={expandedKeys}
        onExpand={handleExpand}
        defaultExpandAll
        selectedKeys={[selectedOrgId]}
        onSelect={handleSelect}
        className="text-sm"
      />
    </Card>
  )
}