'use client'

import { Card, Table, Tag, Progress, Row, Col, Statistic, Alert, Timeline } from 'antd'
import { CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Candidate } from '@/data/orgData'

interface ElectionResultProps {
  candidates: Candidate[]
  electionName: string
}

const columns: ColumnsType<Candidate> = [
  { title: '排名', key: 'rank', width: '8%', render: (_, __, index) => <span className="font-bold text-lg">{index + 1}</span> },
  { title: '候选人', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium text-lg">{text}</span> },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: '8%' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: '8%' },
  { title: '竞选职务', dataIndex: 'position', key: 'position', width: '15%', render: (text: string) => <Tag color="blue">{text}</Tag> },
  { title: '得票数', dataIndex: 'votes', key: 'votes', width: '12%', render: (votes: number) => <span className="font-bold text-xl text-primary-600">{votes}</span> },
  { title: '得票率', dataIndex: 'votePercent', key: 'votePercent', width: '18%', render: (percent: number) => <Progress percent={percent} strokeColor={percent >= 50 ? '#dc2626' : '#9ca3af'} /> },
  {
    title: '结果',
    key: 'result',
    width: '12%',
    render: (_, record) => (
      record.votePercent >= 50 ? (
        <Tag color="green" icon={<CheckCircleOutlined />}>当选</Tag>
      ) : (
        <Tag color="red">未当选</Tag>
      )
    ),
  },
]

export default function ElectionResult({ candidates, electionName }: ElectionResultProps) {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)
  const totalVotes = sortedCandidates.reduce((sum, c) => sum + c.votes, 0)
  const electedCount = sortedCandidates.filter((c) => c.votePercent >= 50).length

  return (
    <Card title="选举结果公示">
      <Alert
        message="选举结果公示"
        description={`${electionName}选举结果已统计完成，现将结果公示如下。公示期为5个工作日，如有异议请在公示期内反映。`}
        type="success"
        showIcon
        className="mb-6"
      />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-4 text-white text-center">
            <TrophyOutlined className="text-3xl mb-2" />
            <p className="text-sm opacity-80">当选人数</p>
            <p className="text-3xl font-bold">{electedCount}</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Statistic title="总票数" value={totalVotes} suffix="票" />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Statistic title="候选人总数" value={candidates.length} suffix="人" />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Statistic title="当选率" value={Math.round((electedCount / candidates.length) * 100)} suffix="%" />
          </div>
        </Col>
      </Row>

      <Table
        dataSource={sortedCandidates}
        columns={columns}
        pagination={false}
        rowKey="id"
        className="text-sm"
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5} className="text-right font-medium">
              当选标准：获得应到会党员半数以上（≥50%）赞成票
            </Table.Summary.Cell>
            <Table.Summary.Cell colSpan={3}>
              {electedCount}人当选，{candidates.length - electedCount}人未当选
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <div className="mt-6">
        <h4 className="font-medium mb-3">当选人员分工</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sortedCandidates.filter((c) => c.votePercent >= 50).map((candidate) => (
            <div key={candidate.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-medium text-green-800">{candidate.name}</p>
              <p className="text-sm text-green-600">{candidate.position}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">选举流程记录</h4>
        <Timeline>
          <Timeline.Item color="green">
            <p className="font-medium">投票开始</p>
            <p className="text-sm text-gray-500">2024-04-10 09:00:00</p>
          </Timeline.Item>
          <Timeline.Item color="green">
            <p className="font-medium">投票结束</p>
            <p className="text-sm text-gray-500">2024-04-10 12:00:00</p>
          </Timeline.Item>
          <Timeline.Item color="green">
            <p className="font-medium">计票完成</p>
            <p className="text-sm text-gray-500">2024-04-10 14:30:00</p>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p className="font-medium">结果公示中</p>
            <p className="text-sm text-gray-500">公示期：2024-04-11 至 2024-04-17</p>
          </Timeline.Item>
          <Timeline.Item color="gray">
            <p className="font-medium">上报上级党组织审批</p>
            <p className="text-sm text-gray-500">待公示期结束后提交</p>
          </Timeline.Item>
        </Timeline>
      </div>
    </Card>
  )
}