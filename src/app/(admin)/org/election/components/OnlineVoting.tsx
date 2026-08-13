'use client'

import { useState } from 'react'
import { Card, Table, Button, Tag, Progress, Modal, Form, Radio, message, Alert, Row, Col } from 'antd'
import { RocketOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Candidate } from '@/data/orgData'

interface OnlineVotingProps {
  candidates: Candidate[]
  electionId: string
  electionName: string
}

interface VoteChoice {
  candidateId: string
  choice: 'approve' | 'oppose' | 'abstain'
}

const columns: ColumnsType<Candidate> = [
  { title: '候选人', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: '8%' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: '8%' },
  { title: '竞选职务', dataIndex: 'position', key: 'position', width: '15%' },
  { title: '状态', dataIndex: 'status', key: 'status', width: '12%', render: (status: string) => <Tag color={status === 'nominated' ? 'blue' : status === 'elected' ? 'green' : 'red'}>{status === 'nominated' ? '提名' : status === 'elected' ? '当选' : '落选'}</Tag> },
  { title: '得票数', dataIndex: 'votes', key: 'votes', width: '10%', render: (votes: number) => <span className="font-bold text-primary-600">{votes}</span> },
  { title: '得票率', dataIndex: 'votePercent', key: 'votePercent', width: '15%', render: (percent: number) => <Progress percent={percent} strokeColor={percent >= 50 ? '#dc2626' : '#9ca3af'} size="small" /> },
]

export default function OnlineVoting({ candidates, electionId, electionName }: OnlineVotingProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [voteChoices, setVoteChoices] = useState<VoteChoice[]>([])
  const [form] = Form.useForm()

  const totalVoters = 120
  const validVotes = candidates.reduce((sum, c) => sum + c.votes, 0)
  const turnout = Math.round((validVotes / totalVoters) * 100)

  const handleVote = () => {
    if (hasVoted) {
      message.warning('您已完成投票，不可重复投票')
      return
    }
    setShowVoteModal(true)
  }

  const handleSubmitVote = () => {
    form.validateFields().then(() => {
      message.success('投票成功！')
      setHasVoted(true)
      setShowVoteModal(false)
    })
  }

  const handleVoteChange = (candidateId: string, choice: 'approve' | 'oppose' | 'abstain') => {
    setVoteChoices((prev) => {
      const existing = prev.find((v) => v.candidateId === candidateId)
      if (existing) {
        return prev.map((v) => (v.candidateId === candidateId ? { ...v, choice } : v))
      }
      return [...prev, { candidateId, choice }]
    })
  }

  return (
    <Card
      title="线上投票"
      extra={
        <Button
          type={hasVoted ? 'default' : 'primary'}
          icon={<RocketOutlined />}
          onClick={handleVote}
          disabled={hasVoted}
        >
          {hasVoted ? '已投票' : '参与投票'}
        </Button>
      }
    >
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={8}>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600">应到党员</p>
            <p className="text-2xl font-bold text-blue-700">{totalVoters}人</p>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600">有效票数</p>
            <p className="text-2xl font-bold text-green-700">{validVotes}票</p>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-sm text-orange-600">投票率</p>
            <p className="text-2xl font-bold text-orange-700">{turnout}%</p>
          </div>
        </Col>
      </Row>

      {hasVoted && (
        <Alert
          message="投票成功"
          description="您的投票已成功提交，投票记录已加密存储"
          type="success"
          showIcon
          className="mb-4"
        />
      )}

      <Table
        dataSource={candidates}
        columns={columns}
        pagination={false}
        rowKey="id"
        className="text-sm"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5} className="text-right font-medium">
              当选规则：需获得应到会党员半数以上赞成票
            </Table.Summary.Cell>
            <Table.Summary.Cell colSpan={2}>
              {candidates.filter((c) => c.votePercent >= 50).length}/{candidates.length} 人达到当选标准
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Modal
        title={`${electionName} - 线上投票`}
        open={showVoteModal}
        onCancel={() => setShowVoteModal(false)}
        onOk={handleSubmitVote}
        width={700}
        okText="提交投票"
        cancelText="取消"
      >
        <Alert
          message="投票规则"
          description="请对每位候选人进行投票，每人一票，不可重复投票。投票结果将自动统计并公示。"
          type="info"
          showIcon
          className="mb-4"
        />

        <Form form={form} layout="vertical">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <UserOutlined className="text-gray-400" />
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-gray-500">{candidate.gender} | {candidate.age}岁 | 竞选：{candidate.position}</p>
                  </div>
                </div>
              </div>
              <Form.Item
                name={`vote_${candidate.id}`}
                rules={[{ required: true, message: '请对该候选人进行投票' }]}
              >
                <Radio.Group
                  onChange={(e) => handleVoteChange(candidate.id, e.target.value)}
                  defaultValue={voteChoices.find((v) => v.candidateId === candidate.id)?.choice}
                >
                  <Radio value="approve">赞成</Radio>
                  <Radio value="oppose">反对</Radio>
                  <Radio value="abstain">弃权</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          ))}
        </Form>

        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">
            <CheckCircleOutlined /> 投票记录将加密存储，不可篡改，全程留痕
          </p>
        </div>
      </Modal>
    </Card>
  )
}