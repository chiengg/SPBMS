export interface MemberItem {
  key: string
  id: string
  name: string
  gender: string
  age: number
  education: string
  orgName: string
  partyStatus: string
  joinDate: string
  regularDate: string
  feeStatus: string
}

export interface MemberDetail {
  id: string
  name: string
  gender: string
  idCard: string
  birthday: string
  education: string
  workDate: string
  orgId: string
  orgName: string
  identityType: string
  joinDate: string
  regularDate: string
  partyStatus: string
  feeBase: number
  introducer: string
  archiveNo: string
  phone: string
  address: string
  politicalStatus: string
  title: string
  department: string
}

export interface DevelopStage {
  id: string
  name: string
  status: 'completed' | 'current' | 'pending'
  deadline?: string
  description?: string
}

export interface StageRecord {
  stageId: string
  stageName: string
  order: number
  status: 'completed' | 'current' | 'pending'
  actualDate?: string
  deadline?: string
  approver?: string
  attachments?: string[]
  remarks?: string
  validations?: {
    rule: string
    passed: boolean
    message?: string
  }[]
}

export interface PersonDevelopDetail {
  id: string
  name: string
  gender: string
  birthday: string
  age: number
  orgId: string
  orgName: string
  applyDate: string
  currentStage: string
  currentStageIndex: number
  totalStages: number
  status: string
  stages: StageRecord[]
  thoughtReports: {
    id: string
    title: string
    submitDate: string
    content: string
    reviewer?: string
    reviewDate?: string
  }[]
  inspectRecords: {
    id: string
    inspectDate: string
    inspector: string
    content: string
    conclusion: string
  }[]
  voteResults?: {
    meetingDate: string
    totalMembers: number
    attendedMembers: number
    eligibleVoters: number
    attendVoters: number
    approveVotes: number
    opposeVotes: number
    abstainVotes: number
    result: string
    meetingMinutes?: string
  }
  trainInfo?: {
    trainDate: string
    durationDays: number
    durationHours: number
    content: string
    certificate?: string
  }
  politicalReview?: {
    reviewDate: string
    reviewer: string
    result: '合格' | '不合格'
    materials: string[]
  }
  introducers?: string[]
  probationStartDate?: string
  probationEndDate?: string
  transferReason?: string
  transferDays?: number
}

export interface WarningRecord {
  id: string
  personId: string
  personName: string
  orgName: string
  stageName: string
  deadline: string
  daysOverdue: number
  warningLevel: 'danger' | 'warning' | 'info'
  warningType: 'time' | 'material' | 'condition'
  description: string
  hasProcess: boolean
  createdAt: string
}

export interface DevelopArchive {
  personId: string
  personName: string
  orgName: string
  archiveNo: string
  stageFiles: {
    stageName: string
    files: {
      name: string
      type: string
      size: string
      uploadDate: string
      required: boolean
      uploaded: boolean
    }[]
  }[]
  createdAt: string
}

export interface TransferRecord {
  key: string
  id: string
  memberName: string
  fromOrg: string
  toOrg: string
  reason: string
  status: string
  applyTime: string
}

export const memberList: MemberItem[] = [
  { key: '1', id: 'm-001', name: '张伟', gender: '男', age: 35, education: '本科', orgName: '第一党支部', partyStatus: '正式党员', joinDate: '2015-06-15', regularDate: '2016-06-15', feeStatus: '已缴' },
  { key: '2', id: 'm-002', name: '刘洋', gender: '男', age: 28, education: '硕士', orgName: '第一党支部', partyStatus: '正式党员', joinDate: '2018-03-20', regularDate: '2019-03-20', feeStatus: '已缴' },
  { key: '3', id: 'm-003', name: '陈静', gender: '女', age: 42, education: '本科', orgName: '第一党支部', partyStatus: '正式党员', joinDate: '2008-11-05', regularDate: '2009-11-05', feeStatus: '已缴' },
  { key: '4', id: 'm-004', name: '王磊', gender: '男', age: 31, education: '大专', orgName: '第一党支部', partyStatus: '正式党员', joinDate: '2016-09-10', regularDate: '2017-09-10', feeStatus: '已缴' },
  { key: '5', id: 'm-005', name: '赵雪', gender: '女', age: 26, education: '本科', orgName: '第一党支部', partyStatus: '预备党员', joinDate: '2023-05-15', regularDate: '2024-05-15', feeStatus: '已缴' },
  { key: '6', id: 'm-006', name: '孙强', gender: '男', age: 38, education: '本科', orgName: '第二党支部', partyStatus: '正式党员', joinDate: '2012-08-20', regularDate: '2013-08-20', feeStatus: '欠缴' },
  { key: '7', id: 'm-007', name: '周丽', gender: '女', age: 33, education: '硕士', orgName: '第二党支部', partyStatus: '正式党员', joinDate: '2014-04-10', regularDate: '2015-04-10', feeStatus: '已缴' },
  { key: '8', id: 'm-008', name: '吴刚', gender: '男', age: 52, education: '大专', orgName: '生产党支部', partyStatus: '正式党员', joinDate: '1998-07-01', regularDate: '1999-07-01', feeStatus: '已缴' },
  { key: '9', id: 'm-009', name: '郑敏', gender: '女', age: 45, education: '本科', orgName: '生产党支部', partyStatus: '正式党员', joinDate: '2005-03-15', regularDate: '2006-03-15', feeStatus: '已缴' },
  { key: '10', id: 'm-010', name: '黄鹏', gender: '男', age: 29, education: '本科', orgName: '销售党支部', partyStatus: '积极分子', joinDate: '-', regularDate: '-', feeStatus: '-' },
]

export const memberDetailData: MemberDetail = {
  id: 'm-001',
  name: '张伟',
  gender: '男',
  idCard: '3201011989XXXX1234',
  birthday: '1989-03-15',
  education: '本科',
  workDate: '2012-07-01',
  orgId: 'org-003',
  orgName: '第一党支部',
  identityType: '在职',
  joinDate: '2015-06-15',
  regularDate: '2016-06-15',
  partyStatus: '正式党员',
  feeBase: 8000,
  introducer: '李明、王芳',
  archiveNo: 'DA2015001',
  phone: '138XXXX1234',
  address: 'XX市XX区XX路XX号',
  politicalStatus: '中共党员',
  title: '工程师',
  department: '技术部',
}

export const developStages: DevelopStage[] = [
  { id: '1', name: '提交入党申请书', status: 'completed', description: '2023-03-15 提交' },
  { id: '2', name: '支部派人谈话', status: 'completed', description: '2023-03-25 完成', deadline: '2023-04-15' },
  { id: '3', name: '党员推荐', status: 'completed', description: '2023-04-10 完成' },
  { id: '4', name: '群团组织推优', status: 'completed', description: '2023-04-12 完成' },
  { id: '5', name: '支委会研究确定积极分子', status: 'completed', description: '2023-04-15 完成' },
  { id: '6', name: '指定培养联系人', status: 'completed', description: '2023-04-16 指定：李明、王芳' },
  { id: '7', name: '积极分子思想汇报(第1季度)', status: 'completed', description: '2023-06-20 提交' },
  { id: '8', name: '培养联系人考察意见(第1季度)', status: 'completed', description: '2023-06-25 填写' },
  { id: '9', name: '支部半年考察(第1次)', status: 'completed', description: '2023-09-30 完成' },
  { id: '10', name: '积极分子思想汇报(第2季度)', status: 'completed', description: '2023-09-15 提交' },
  { id: '11', name: '培养联系人考察意见(第2季度)', status: 'completed', description: '2023-09-20 填写' },
  { id: '12', name: '积极分子思想汇报(第3季度)', status: 'completed', description: '2023-12-20 提交' },
  { id: '13', name: '培养联系人考察意见(第3季度)', status: 'completed', description: '2023-12-25 填写' },
  { id: '14', name: '支部半年考察(第2次)', status: 'completed', description: '2024-03-30 完成' },
  { id: '15', name: '积极分子思想汇报(第4季度)', status: 'completed', description: '2024-03-15 提交' },
  { id: '16', name: '培养联系人考察意见(第4季度)', status: 'completed', description: '2024-03-20 填写' },
  { id: '17', name: '支委会讨论确定发展对象', status: 'completed', description: '2024-04-20 完成' },
  { id: '18', name: '上级党委备案', status: 'completed', description: '2024-04-25 完成' },
  { id: '19', name: '政治审查', status: 'completed', description: '2024-05-10 完成，结论：合格', deadline: '2024-05-20' },
  { id: '20', name: '短期集中培训', status: 'completed', description: '2024-05-20 完成，24学时', deadline: '2024-06-10' },
  { id: '21', name: '确定入党介绍人', status: 'completed', description: '李明、王芳' },
  { id: '22', name: '填写入党志愿书', status: 'current', deadline: '2024-06-15' },
  { id: '23', name: '支部大会讨论表决', status: 'pending' },
  { id: '24', name: '上级党委派人谈话', status: 'pending' },
  { id: '25', name: '党委审批', status: 'pending', deadline: '2024-09-15' },
  { id: '26', name: '编入支部/党小组', status: 'pending' },
  { id: '27', name: '预备党员思想汇报(第1季度)', status: 'pending' },
  { id: '28', name: '预备期考察(第1季度)', status: 'pending' },
  { id: '29', name: '预备党员思想汇报(第2季度)', status: 'pending' },
  { id: '30', name: '预备期考察(第2季度)', status: 'pending' },
  { id: '31', name: '预备党员思想汇报(第3季度)', status: 'pending' },
  { id: '32', name: '预备期考察(第3季度)', status: 'pending' },
  { id: '33', name: '预备党员思想汇报(第4季度)', status: 'pending' },
  { id: '34', name: '预备期考察(第4季度)', status: 'pending' },
  { id: '35', name: '提交转正申请', status: 'pending', deadline: '2025-06-15' },
  { id: '36', name: '支部审查', status: 'pending' },
  { id: '37', name: '支部大会讨论表决', status: 'pending' },
  { id: '38', name: '上级党委审批', status: 'pending' },
]

export const personDevelopDetails: PersonDevelopDetail[] = [
  {
    id: 'd-001',
    name: '赵雪',
    gender: '女',
    birthday: '1998-05-15',
    age: 26,
    orgId: 'org-001',
    orgName: '第一党支部',
    applyDate: '2023-03-15',
    currentStage: '填写入党志愿书',
    currentStageIndex: 22,
    totalStages: 38,
    status: '进行中',
    stages: [
      { stageId: 's1', stageName: '提交入党申请书', order: 1, status: 'completed', actualDate: '2023-03-15', validations: [{ rule: '年满18周岁', passed: true, message: '申请人25岁，符合要求' }] },
      { stageId: 's2', stageName: '支部派人谈话', order: 2, status: 'completed', actualDate: '2023-03-25', deadline: '2023-04-15', approver: '张书记', validations: [{ rule: '1个月内完成', passed: true, message: '提前20天完成' }] },
      { stageId: 's3', stageName: '党员推荐', order: 3, status: 'completed', actualDate: '2023-04-10', validations: [{ rule: '推荐人数达标', passed: true }] },
      { stageId: 's4', stageName: '群团组织推优', order: 4, status: 'completed', actualDate: '2023-04-12' },
      { stageId: 's5', stageName: '支委会研究确定积极分子', order: 5, status: 'completed', actualDate: '2023-04-15', approver: '支委会' },
      { stageId: 's6', stageName: '指定培养联系人', order: 6, status: 'completed', actualDate: '2023-04-16', attachments: ['培养联系人指定表.pdf'] },
      { stageId: 's7', stageName: '积极分子思想汇报(第1季度)', order: 7, status: 'completed', actualDate: '2023-06-20' },
      { stageId: 's8', stageName: '培养联系人考察意见(第1季度)', order: 8, status: 'completed', actualDate: '2023-06-25' },
      { stageId: 's9', stageName: '支部半年考察(第1次)', order: 9, status: 'completed', actualDate: '2023-09-30' },
      { stageId: 's10', stageName: '积极分子思想汇报(第2季度)', order: 10, status: 'completed', actualDate: '2023-09-15' },
      { stageId: 's11', stageName: '培养联系人考察意见(第2季度)', order: 11, status: 'completed', actualDate: '2023-09-20' },
      { stageId: 's12', stageName: '积极分子思想汇报(第3季度)', order: 12, status: 'completed', actualDate: '2023-12-20' },
      { stageId: 's13', stageName: '培养联系人考察意见(第3季度)', order: 13, status: 'completed', actualDate: '2023-12-25' },
      { stageId: 's14', stageName: '支部半年考察(第2次)', order: 14, status: 'completed', actualDate: '2024-03-30' },
      { stageId: 's15', stageName: '积极分子思想汇报(第4季度)', order: 15, status: 'completed', actualDate: '2024-03-15' },
      { stageId: 's16', stageName: '培养联系人考察意见(第4季度)', order: 16, status: 'completed', actualDate: '2024-03-20' },
      { stageId: 's17', stageName: '支委会讨论确定发展对象', order: 17, status: 'completed', actualDate: '2024-04-20', validations: [{ rule: '培养考察满12个月', passed: true, message: '培养时长12个月，符合要求' }] },
      { stageId: 's18', stageName: '上级党委备案', order: 18, status: 'completed', actualDate: '2024-04-25', approver: '组织部' },
      { stageId: 's19', stageName: '政治审查', order: 19, status: 'completed', actualDate: '2024-05-10', deadline: '2024-05-20', approver: '审查小组', attachments: ['政审报告.pdf', '外调材料.pdf'], validations: [{ rule: '政审合格', passed: true }] },
      { stageId: 's20', stageName: '短期集中培训', order: 20, status: 'completed', actualDate: '2024-05-20', deadline: '2024-06-10', attachments: ['培训证书.pdf'], validations: [{ rule: '培训时长24学时', passed: true, message: '培训3天，共24学时' }] },
      { stageId: 's21', stageName: '确定入党介绍人', order: 21, status: 'completed', actualDate: '2024-05-25' },
      { stageId: 's22', stageName: '填写入党志愿书', order: 22, status: 'current', deadline: '2024-06-15' },
    ],
    thoughtReports: [
      { id: 'tr1', title: '第一季度思想汇报', submitDate: '2023-06-20', content: '本季度思想汇报内容...', reviewer: '李明', reviewDate: '2023-06-22' },
      { id: 'tr2', title: '第二季度思想汇报', submitDate: '2023-09-15', content: '本季度思想汇报内容...', reviewer: '李明', reviewDate: '2023-09-18' },
      { id: 'tr3', title: '第三季度思想汇报', submitDate: '2023-12-20', content: '本季度思想汇报内容...', reviewer: '王芳', reviewDate: '2023-12-23' },
      { id: 'tr4', title: '第四季度思想汇报', submitDate: '2024-03-15', content: '本季度思想汇报内容...', reviewer: '王芳', reviewDate: '2024-03-18' },
    ],
    inspectRecords: [
      { id: 'ir1', inspectDate: '2023-06-25', inspector: '李明', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir2', inspectDate: '2023-09-20', inspector: '李明', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir3', inspectDate: '2023-09-30', inspector: '支委会', content: '半年考察内容...', conclusion: '合格' },
      { id: 'ir4', inspectDate: '2023-12-25', inspector: '王芳', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir5', inspectDate: '2024-03-20', inspector: '王芳', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir6', inspectDate: '2024-03-30', inspector: '支委会', content: '半年考察内容...', conclusion: '合格' },
    ],
    introducers: ['李明', '王芳'],
    trainInfo: { trainDate: '2024-05-20', durationDays: 3, durationHours: 24, content: '党的基本知识、党史、党的纪律等', certificate: '培训合格证书' },
    politicalReview: { reviewDate: '2024-05-10', reviewer: '审查小组', result: '合格', materials: ['政审报告.pdf', '外调材料.pdf'] },
  },
  {
    id: 'd-002',
    name: '黄鹏',
    gender: '男',
    birthday: '1995-08-20',
    age: 29,
    orgId: 'org-004',
    orgName: '销售党支部',
    applyDate: '2023-05-20',
    currentStage: '确定发展对象',
    currentStageIndex: 17,
    totalStages: 38,
    status: '进行中',
    stages: [
      { stageId: 's1', stageName: '提交入党申请书', order: 1, status: 'completed', actualDate: '2023-05-20', validations: [{ rule: '年满18周岁', passed: true }] },
      { stageId: 's2', stageName: '支部派人谈话', order: 2, status: 'completed', actualDate: '2023-05-28', deadline: '2023-06-20', validations: [{ rule: '1个月内完成', passed: true }] },
      { stageId: 's3', stageName: '党员推荐', order: 3, status: 'completed', actualDate: '2023-06-10' },
      { stageId: 's4', stageName: '群团组织推优', order: 4, status: 'completed', actualDate: '2023-06-12' },
      { stageId: 's5', stageName: '支委会研究确定积极分子', order: 5, status: 'completed', actualDate: '2023-06-15' },
      { stageId: 's6', stageName: '指定培养联系人', order: 6, status: 'completed', actualDate: '2023-06-18', attachments: ['培养联系人指定表.pdf'] },
      { stageId: 's7', stageName: '积极分子思想汇报(第1季度)', order: 7, status: 'completed', actualDate: '2023-08-20' },
      { stageId: 's8', stageName: '培养联系人考察意见(第1季度)', order: 8, status: 'completed', actualDate: '2023-08-25' },
      { stageId: 's9', stageName: '支部半年考察(第1次)', order: 9, status: 'completed', actualDate: '2023-11-30' },
      { stageId: 's10', stageName: '积极分子思想汇报(第2季度)', order: 10, status: 'completed', actualDate: '2023-11-15' },
      { stageId: 's11', stageName: '培养联系人考察意见(第2季度)', order: 11, status: 'completed', actualDate: '2023-11-20' },
      { stageId: 's12', stageName: '积极分子思想汇报(第3季度)', order: 12, status: 'completed', actualDate: '2024-02-20' },
      { stageId: 's13', stageName: '培养联系人考察意见(第3季度)', order: 13, status: 'completed', actualDate: '2024-02-25' },
      { stageId: 's14', stageName: '支部半年考察(第2次)', order: 14, status: 'completed', actualDate: '2024-04-30' },
      { stageId: 's15', stageName: '积极分子思想汇报(第4季度)', order: 15, status: 'completed', actualDate: '2024-05-15' },
      { stageId: 's16', stageName: '培养联系人考察意见(第4季度)', order: 16, status: 'completed', actualDate: '2024-05-20' },
      { stageId: 's17', stageName: '支委会讨论确定发展对象', order: 17, status: 'current', validations: [{ rule: '培养考察满12个月', passed: true, message: '培养时长12个月，符合要求' }] },
    ],
    thoughtReports: [
      { id: 'tr1', title: '第一季度思想汇报', submitDate: '2023-08-20', content: '本季度思想汇报内容...', reviewer: '张伟', reviewDate: '2023-08-22' },
      { id: 'tr2', title: '第二季度思想汇报', submitDate: '2023-11-15', content: '本季度思想汇报内容...', reviewer: '张伟', reviewDate: '2023-11-18' },
      { id: 'tr3', title: '第三季度思想汇报', submitDate: '2024-02-20', content: '本季度思想汇报内容...', reviewer: '刘洋', reviewDate: '2024-02-23' },
      { id: 'tr4', title: '第四季度思想汇报', submitDate: '2024-05-15', content: '本季度思想汇报内容...', reviewer: '刘洋', reviewDate: '2024-05-18' },
    ],
    inspectRecords: [
      { id: 'ir1', inspectDate: '2023-08-25', inspector: '张伟', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir2', inspectDate: '2023-11-20', inspector: '张伟', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir3', inspectDate: '2023-11-30', inspector: '支委会', content: '半年考察内容...', conclusion: '合格' },
      { id: 'ir4', inspectDate: '2024-02-25', inspector: '刘洋', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir5', inspectDate: '2024-05-20', inspector: '刘洋', content: '考察意见内容...', conclusion: '合格' },
      { id: 'ir6', inspectDate: '2024-04-30', inspector: '支委会', content: '半年考察内容...', conclusion: '合格' },
    ],
    introducers: ['张伟', '刘洋'],
  },
  {
    id: 'd-003',
    name: '周明',
    gender: '男',
    birthday: '1992-03-10',
    age: 32,
    orgId: 'org-003',
    orgName: '生产党支部',
    applyDate: '2023-08-10',
    currentStage: '短期集中培训',
    currentStageIndex: 20,
    totalStages: 38,
    status: '进行中',
    stages: [
      { stageId: 's1', stageName: '提交入党申请书', order: 1, status: 'completed', actualDate: '2023-08-10', validations: [{ rule: '年满18周岁', passed: true }] },
      { stageId: 's2', stageName: '支部派人谈话', order: 2, status: 'completed', actualDate: '2023-08-18', deadline: '2023-09-10', validations: [{ rule: '1个月内完成', passed: true }] },
      { stageId: 's3', stageName: '党员推荐', order: 3, status: 'completed', actualDate: '2023-08-25' },
      { stageId: 's4', stageName: '群团组织推优', order: 4, status: 'completed', actualDate: '2023-08-28' },
      { stageId: 's5', stageName: '支委会研究确定积极分子', order: 5, status: 'completed', actualDate: '2023-09-01' },
      { stageId: 's6', stageName: '指定培养联系人', order: 6, status: 'completed', actualDate: '2023-09-05' },
      { stageId: 's7', stageName: '积极分子思想汇报(第1季度)', order: 7, status: 'completed', actualDate: '2023-10-10' },
      { stageId: 's8', stageName: '培养联系人考察意见(第1季度)', order: 8, status: 'completed', actualDate: '2023-10-15' },
      { stageId: 's9', stageName: '支部半年考察(第1次)', order: 9, status: 'completed', actualDate: '2024-01-31' },
      { stageId: 's10', stageName: '积极分子思想汇报(第2季度)', order: 10, status: 'completed', actualDate: '2024-01-10' },
      { stageId: 's11', stageName: '培养联系人考察意见(第2季度)', order: 11, status: 'completed', actualDate: '2024-01-15' },
      { stageId: 's12', stageName: '积极分子思想汇报(第3季度)', order: 12, status: 'completed', actualDate: '2024-04-10' },
      { stageId: 's13', stageName: '培养联系人考察意见(第3季度)', order: 13, status: 'completed', actualDate: '2024-04-15' },
      { stageId: 's14', stageName: '支部半年考察(第2次)', order: 14, status: 'completed', actualDate: '2024-07-31' },
      { stageId: 's15', stageName: '积极分子思想汇报(第4季度)', order: 15, status: 'completed', actualDate: '2024-07-10' },
      { stageId: 's16', stageName: '培养联系人考察意见(第4季度)', order: 16, status: 'completed', actualDate: '2024-07-15' },
      { stageId: 's17', stageName: '支委会讨论确定发展对象', order: 17, status: 'completed', actualDate: '2024-08-10', validations: [{ rule: '培养考察满12个月', passed: true }] },
      { stageId: 's18', stageName: '上级党委备案', order: 18, status: 'completed', actualDate: '2024-08-15' },
      { stageId: 's19', stageName: '政治审查', order: 19, status: 'completed', actualDate: '2024-08-25', deadline: '2024-09-15', validations: [{ rule: '政审合格', passed: true }] },
      { stageId: 's20', stageName: '短期集中培训', order: 20, status: 'current', deadline: '2024-09-25', validations: [{ rule: '培训时长24学时', passed: false, message: '尚未完成培训' }] },
    ],
    thoughtReports: [
      { id: 'tr1', title: '第一季度思想汇报', submitDate: '2023-10-10', content: '本季度思想汇报内容...', reviewer: '吴刚', reviewDate: '2023-10-12' },
      { id: 'tr2', title: '第二季度思想汇报', submitDate: '2024-01-10', content: '本季度思想汇报内容...', reviewer: '吴刚', reviewDate: '2024-01-12' },
      { id: 'tr3', title: '第三季度思想汇报', submitDate: '2024-04-10', content: '本季度思想汇报内容...', reviewer: '郑敏', reviewDate: '2024-04-12' },
      { id: 'tr4', title: '第四季度思想汇报', submitDate: '2024-07-10', content: '本季度思想汇报内容...', reviewer: '郑敏', reviewDate: '2024-07-12' },
    ],
    politicalReview: { reviewDate: '2024-08-25', reviewer: '审查小组', result: '合格', materials: ['政审报告.pdf'] },
    trainInfo: { trainDate: '2024-09-01', durationDays: 2, durationHours: 16, content: '培训进行中...', certificate: '' },
  },
]

export const warningRecords: WarningRecord[] = [
  { id: 'w1', personId: 'd-004', personName: '吴雨', orgName: '第二党支部', stageName: '支部派人谈话', deadline: '2023-07-25', daysOverdue: 30, warningLevel: 'danger', warningType: 'time', description: '距提交入党申请书已超过1个月，支部未派人谈话', hasProcess: false, createdAt: '2023-07-26' },
  { id: 'w2', personId: 'd-005', personName: '郑飞', orgName: '第一党支部', stageName: '党委审批', deadline: '2023-03-01', daysOverdue: 15, warningLevel: 'danger', warningType: 'time', description: '支部大会表决通过已超过3个月，上级党委尚未审批', hasProcess: true, createdAt: '2023-02-28' },
  { id: 'w3', personId: 'd-006', personName: '钱娜', orgName: '机关党总支', stageName: '党员推荐', deadline: '2024-02-10', daysOverdue: 7, warningLevel: 'warning', warningType: 'time', description: '入党申请书提交后党员推荐环节即将超期', hasProcess: false, createdAt: '2024-02-03' },
  { id: 'w4', personId: 'd-007', personName: '孙磊', orgName: '生产党支部', stageName: '政治审查', deadline: '2024-03-15', daysOverdue: 0, warningLevel: 'info', warningType: 'material', description: '政治审查材料尚未完整上传，请及时补充', hasProcess: false, createdAt: '2024-03-10' },
  { id: 'w5', personId: 'd-008', personName: '周婷', orgName: '销售党支部', stageName: '短期集中培训', deadline: '2024-04-20', daysOverdue: 5, warningLevel: 'warning', warningType: 'condition', description: '培训学时不足24学时，当前仅完成18学时', hasProcess: true, createdAt: '2024-04-15' },
]

export const developArchives: DevelopArchive[] = [
  {
    personId: 'd-001',
    personName: '赵雪',
    orgName: '第一党支部',
    archiveNo: 'DA2023001',
    stageFiles: [
      {
        stageName: '提交入党申请书',
        files: [
          { name: '入党申请书.docx', type: '文档', size: '25KB', uploadDate: '2023-03-15', required: true, uploaded: true },
          { name: '身份证复印件.pdf', type: '文档', size: '156KB', uploadDate: '2023-03-15', required: true, uploaded: true },
          { name: '个人简历.docx', type: '文档', size: '18KB', uploadDate: '2023-03-16', required: false, uploaded: true },
        ],
      },
      {
        stageName: '支部派人谈话',
        files: [
          { name: '谈话记录.docx', type: '文档', size: '12KB', uploadDate: '2023-03-25', required: true, uploaded: true },
        ],
      },
      {
        stageName: '政治审查',
        files: [
          { name: '政审报告.pdf', type: '文档', size: '89KB', uploadDate: '2024-05-10', required: true, uploaded: true },
          { name: '外调材料.pdf', type: '文档', size: '156KB', uploadDate: '2024-05-10', required: true, uploaded: true },
        ],
      },
      {
        stageName: '短期集中培训',
        files: [
          { name: '培训证书.pdf', type: '证书', size: '234KB', uploadDate: '2024-05-25', required: true, uploaded: true },
        ],
      },
    ],
    createdAt: '2023-03-15',
  },
  {
    personId: 'd-002',
    personName: '黄鹏',
    orgName: '销售党支部',
    archiveNo: 'DA2023002',
    stageFiles: [
      {
        stageName: '提交入党申请书',
        files: [
          { name: '入党申请书.docx', type: '文档', size: '28KB', uploadDate: '2023-05-20', required: true, uploaded: true },
          { name: '身份证复印件.pdf', type: '文档', size: '145KB', uploadDate: '2023-05-20', required: true, uploaded: true },
        ],
      },
      {
        stageName: '支部派人谈话',
        files: [
          { name: '谈话记录.docx', type: '文档', size: '15KB', uploadDate: '2023-05-28', required: true, uploaded: true },
        ],
      },
    ],
    createdAt: '2023-05-20',
  },
]

export const transferRecords: TransferRecord[] = [
  { key: '1', id: 't-001', memberName: '孙强', fromOrg: '第二党支部', toOrg: '生产党支部', reason: '工作调动', status: '待转出审核', applyTime: '2024-01-15' },
  { key: '2', id: 't-002', memberName: '李娜', fromOrg: '销售党支部', toOrg: '机关党总支', reason: '岗位调整', status: '转出审核通过', applyTime: '2024-01-12' },
  { key: '3', id: 't-003', memberName: '王浩', fromOrg: '第一党支部', toOrg: '外地单位', reason: '异地调动', status: '跨省转接中', applyTime: '2024-01-10' },
]