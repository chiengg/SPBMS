'use client'

import { Card, Timeline, Tag, Button, Upload, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons'
import type { ElectionStage } from '@/data/orgData'

interface ElectionDetailProps {
  stages: ElectionStage[]
}

export default function ElectionDetail({ stages }: ElectionDetailProps) {
  const handleUpload = () => {
    message.success('材料已上传')
  }

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined className="text-green-500" />
      case 'current':
        return <ClockCircleOutlined className="text-blue-500" />
      default:
        return <span className="w-4 h-4 rounded-full bg-gray-300" />
    }
  }

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'current':
        return 'text-blue-500 font-medium'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <Card title="换届流程进度">
      <Timeline>
        {stages.map((stage) => (
          <Timeline.Item
            key={stage.id}
            dot={getStageIcon(stage.status)}
            color={stage.status === 'current' ? 'blue' : stage.status === 'completed' ? 'green' : 'gray'}
          >
            <div className="flex items-start justify-between w-full">
              <div>
                <p className={getStageColor(stage.status)}>{stage.name}</p>
                <div className="flex gap-4 mt-1">
                  {stage.deadline && (
                    <span className="text-xs text-gray-500">截止：{stage.deadline}</span>
                  )}
                  {stage.completedAt && (
                    <span className="text-xs text-gray-500">完成：{stage.completedAt}</span>
                  )}
                  {stage.approvedBy && (
                    <span className="text-xs text-gray-500">审批：{stage.approvedBy}</span>
                  )}
                </div>
                {stage.attachments && stage.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stage.attachments.map((file, index) => (
                      <Tag key={index} icon={<EyeOutlined />} color="blue">
                        {file}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
              {stage.status === 'current' && (
                <Button icon={<UploadOutlined />} size="small" onClick={handleUpload}>
                  上传材料
                </Button>
              )}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">流程说明</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 换届请示：向上级党组织提交换届申请报告</li>
          <li>• 上级批复：上级党组织对换届请示的书面批复</li>
          <li>• 换届筹备：制定选举方案、确定候选人、准备选举材料</li>
          <li>• 选举大会：召开党员大会进行选举投票</li>
          <li>• 选举结果上报：将选举结果上报上级党组织</li>
          <li>• 上级批复：上级党组织对选举结果的批复</li>
          <li>• 委员分工备案：新任委员分工情况备案</li>
        </ul>
      </div>
    </Card>
  )
}