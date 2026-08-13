'use client'

import { useState } from 'react'
import { Card, Tabs, Timeline, Tag, Alert, Button, Progress, Table, Row, Col, Descriptions, Modal, Form, Input, DatePicker, Select, Upload, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, FileTextOutlined, UserOutlined, BookOutlined, RocketOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { PersonDevelopDetail } from '@/data/memberData'

interface DevelopDetailProps {
  detail: PersonDevelopDetail
  onClose: () => void
}

const stageGroups = [
  { key: 'apply', label: '申请入党阶段', stages: [1, 2, 3, 4, 5, 6] },
  { key: 'cultivate', label: '培养考察阶段', stages: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  { key: 'object', label: '发展对象阶段', stages: [17, 18, 19, 20] },
  { key: 'probation', label: '接收预备党员阶段', stages: [21, 22, 23, 24, 25] },
  { key: 'formal', label: '预备党员转正阶段', stages: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38] },
]

const thoughtReportColumns: ColumnsType<PersonDevelopDetail['thoughtReports'][0]> = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '提交日期', dataIndex: 'submitDate', key: 'submitDate' },
  { title: '审阅人', dataIndex: 'reviewer', key: 'reviewer' },
  { title: '审阅日期', dataIndex: 'reviewDate', key: 'reviewDate' },
]

const inspectRecordColumns: ColumnsType<PersonDevelopDetail['inspectRecords'][0]> = [
  { title: '考察日期', dataIndex: 'inspectDate', key: 'inspectDate' },
  { title: '考察人', dataIndex: 'inspector', key: 'inspector' },
  { title: '考察结论', dataIndex: 'conclusion', key: 'conclusion', render: (c: string) => <Tag color={c === '合格' ? 'green' : 'red'}>{c}</Tag> },
]

export default function DevelopDetail({ detail, onClose }: DevelopDetailProps) {
  const [activeTab, setActiveTab] = useState('process')
  const [submitModalVisible, setSubmitModalVisible] = useState(false)
  const [form] = Form.useForm()

  const currentStageRecord = detail.stages.find((s) => s.status === 'current')
  const hasValidationFailures = currentStageRecord?.validations?.some((v) => !v.passed)

  const getStageIcon = (status: string) => {
    if (status === 'completed') return <CheckCircleOutlined />
    if (status === 'current') return <ClockCircleOutlined />
    return null
  }

  const getStageColor = (status: string) => {
    if (status === 'completed') return 'green'
    if (status === 'current') return 'blue'
    return 'gray'
  }

  const groupedStages = stageGroups.map((group) => ({
    ...group,
    stageRecords: detail.stages.filter((s) => group.stages.includes(s.order)),
  }))

  const filteredGroupedStages = groupedStages.filter((g) => g.stageRecords.length > 0)

  const handleSubmitStage = () => {
    if (hasValidationFailures) {
      message.error('当前阶段存在未通过的校验项，请先处理')
      return
    }
    form.validateFields().then(() => {
      message.success('阶段提交成功')
      setSubmitModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={`发展党员详情 - ${detail.name}`}
      open={true}
      onCancel={onClose}
      width={900}
      footer={null}
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <Descriptions title={detail.name} column={2} size="small">
                <Descriptions.Item label="性别">{detail.gender}</Descriptions.Item>
                <Descriptions.Item label="年龄">{detail.age}岁</Descriptions.Item>
                <Descriptions.Item label="出生日期">{detail.birthday}</Descriptions.Item>
                <Descriptions.Item label="所属组织">{detail.orgName}</Descriptions.Item>
                <Descriptions.Item label="申请日期">{detail.applyDate}</Descriptions.Item>
                <Descriptions.Item label="当前阶段">
                  <Tag color="blue">{detail.currentStage}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm text-gray-500">总体进度</span>
                <p className="text-xl font-bold text-red-600">
                  {detail.currentStageIndex}/{detail.totalStages}
                </p>
              </div>
              <Progress
                percent={Math.round((detail.currentStageIndex / detail.totalStages) * 100)}
                strokeColor="#dc2626"
                size="small"
              />
            </div>
          </div>
        </Card>

        {hasValidationFailures && (
          <Alert
            message="校验失败"
            description={currentStageRecord?.validations?.filter((v) => !v.passed).map((v) => v.message).join('；')}
            type="error"
            showIcon
            closable
          />
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab} className="custom-tabs">
          <Tabs.TabPane tab={<span><ClockCircleOutlined /> 流程进度</span>} key="process">
            <div className="space-y-4">
              {filteredGroupedStages.map((group) => (
                <Card key={group.key} title={group.label} size="small">
                  <Timeline>
                    {group.stageRecords.map((stage) => (
                      <Timeline.Item
                        key={stage.stageId}
                        dot={getStageIcon(stage.status)}
                        color={getStageColor(stage.status)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{stage.stageName}</span>
                              {stage.status === 'current' && (
                                <Tag color="blue">进行中</Tag>
                              )}
                            </div>
                            {stage.actualDate && (
                              <p className="text-xs text-gray-500 mt-1">完成日期：{stage.actualDate}</p>
                            )}
                            {stage.deadline && (
                              <p className="text-xs text-orange-500 mt-1">截止日期：{stage.deadline}</p>
                            )}
                            {stage.approver && (
                              <p className="text-xs text-gray-500 mt-1">审批人：{stage.approver}</p>
                            )}
                            {stage.attachments && stage.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {stage.attachments.map((file, idx) => (
                                  <Tag key={idx} color="default" className="text-xs">
                                    <FileTextOutlined /> {file}
                                  </Tag>
                                ))}
                              </div>
                            )}
                            {stage.validations && stage.validations.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {stage.validations.map((v, idx) => (
                                  <div key={idx} className={`flex items-center gap-2 text-xs ${v.passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {v.passed ? <CheckCircleOutlined /> : <WarningOutlined />}
                                    <span>{v.rule}</span>
                                    {v.message && <span> - {v.message}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              ))}
            </div>

            {currentStageRecord && (
              <div className="mt-4">
                <Button
                  type="primary"
                  block
                  disabled={hasValidationFailures}
                  onClick={() => setSubmitModalVisible(true)}
                >
                  {hasValidationFailures ? '校验未通过，无法提交' : '提交当前阶段'}
                </Button>
              </div>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><BookOutlined /> 思想汇报</span>} key="thought">
            <Card title="思想汇报列表">
              <Table
                dataSource={detail.thoughtReports}
                columns={thoughtReportColumns}
                rowKey="id"
                pagination={false}
                className="text-sm"
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><UserOutlined /> 考察记录</span>} key="inspect">
            <Card title="培养考察记录">
              <Table
                dataSource={detail.inspectRecords}
                columns={inspectRecordColumns}
                rowKey="id"
                pagination={false}
                className="text-sm"
              />
            </Card>
          </Tabs.TabPane>

          {detail.voteResults && (
            <Tabs.TabPane tab={<span><RocketOutlined /> 表决结果</span>} key="vote">
              <Card title="支部大会表决结果">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="会议日期">{detail.voteResults.meetingDate}</Descriptions.Item>
                  <Descriptions.Item label="应到党员">{detail.voteResults.totalMembers}人</Descriptions.Item>
                  <Descriptions.Item label="实到党员">{detail.voteResults.attendedMembers}人</Descriptions.Item>
                  <Descriptions.Item label="有表决权党员">{detail.voteResults.eligibleVoters}人</Descriptions.Item>
                  <Descriptions.Item label="出席表决">{detail.voteResults.attendVoters}人</Descriptions.Item>
                  <Descriptions.Item label="赞成票">{detail.voteResults.approveVotes}票</Descriptions.Item>
                  <Descriptions.Item label="反对票">{detail.voteResults.opposeVotes}票</Descriptions.Item>
                  <Descriptions.Item label="弃权票">{detail.voteResults.abstainVotes}票</Descriptions.Item>
                  <Descriptions.Item label="表决结果" span={2}>
                    <Tag color={detail.voteResults.result === '通过' ? 'green' : 'red'}>
                      {detail.voteResults.result}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Tabs.TabPane>
          )}

          {detail.trainInfo && (
            <Tabs.TabPane tab={<span><BookOutlined /> 培训信息</span>} key="train">
              <Card title="短期集中培训">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="培训日期">{detail.trainInfo.trainDate}</Descriptions.Item>
                  <Descriptions.Item label="培训天数">{detail.trainInfo.durationDays}天</Descriptions.Item>
                  <Descriptions.Item label="培训学时">{detail.trainInfo.durationHours}学时</Descriptions.Item>
                  <Descriptions.Item label="培训证书">{detail.trainInfo.certificate || '暂无'}</Descriptions.Item>
                  <Descriptions.Item label="培训内容" span={2}>
                    {detail.trainInfo.content}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Tabs.TabPane>
          )}

          {detail.politicalReview && (
            <Tabs.TabPane tab={<span><FileTextOutlined /> 政审材料</span>} key="review">
              <Card title="政治审查">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="审查日期">{detail.politicalReview.reviewDate}</Descriptions.Item>
                  <Descriptions.Item label="审查人">{detail.politicalReview.reviewer}</Descriptions.Item>
                  <Descriptions.Item label="审查结论">
                    <Tag color={detail.politicalReview.result === '合格' ? 'green' : 'red'}>
                      {detail.politicalReview.result}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">政审材料：</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.politicalReview.materials.map((file, idx) => (
                      <Tag key={idx} color="default">
                        <FileTextOutlined /> {file}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>

      <Modal
        title={`提交阶段 - ${currentStageRecord?.stageName}`}
        open={submitModalVisible}
        onCancel={() => setSubmitModalVisible(false)}
        onOk={handleSubmitStage}
        width={600}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item label="完成日期" name="actualDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="审批人" name="approver">
            <Input placeholder="请输入审批人姓名" />
          </Form.Item>
          <Form.Item label="备注" name="remarks">
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>
          <Form.Item label="上传附件">
            <Upload.Dragger>
              <p className="text-sm">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  )
}