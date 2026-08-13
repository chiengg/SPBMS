export interface OrgNode {
  id: string
  orgCode: string
  name: string
  type: '党委' | '党总支' | '党支部' | '党小组'
  parentId: string | null
  parentName: string
  secretary: string
  committeeMembers: string[]
  establishmentCount: number
  memberCount: number
  foundDate: string
  address: string
  status: '正常' | '已撤销' | '撤销审批中' | '合并审批中' | '划转审批中'
  children?: OrgNode[]
}

export interface OrgHistoryRecord {
  id: string
  orgId: string
  orgName: string
  orgCode: string
  actionType: '新增' | '编辑' | '撤销' | '合并' | '拆分' | '划转' | '换届'
  actionTime: string
  operator: string
  detail: string
  approvalStatus: '已审批' | '待审批' | '审批驳回'
  approvalBy?: string
  approvalTime?: string
}

export interface ApprovalFlow {
  id: string
  orgId: string
  orgName: string
  type: '撤销' | '合并' | '拆分' | '划转'
  status: '待审批' | '审批中' | '已通过' | '已驳回'
  applyTime: string
  applyBy: string
  reason: string
  attachmentUrls: string[]
}

export interface OrgDetail {
  id: string
  orgCode: string
  name: string
  type: '党委' | '党总支' | '党支部' | '党小组'
  parentId: string
  parentName: string
  foundDate: string
  secretary: string
  committeeMembers: string[]
  establishmentCount: number
  termEndDate: string
  address: string
  memberCount: number
  status: string
}

export interface ElectionRecord {
  id: string
  orgId: string
  orgName: string
  electionType: string
  status: string
  deadline: string
  progress: number
  currentStage: string
  termStartDate: string
  termEndDate: string
  isExtended: boolean
  extendedReason?: string
  createdAt: string
  applyBy: string
}

export interface ElectionStage {
  id: string
  name: string
  order: number
  status: 'completed' | 'current' | 'pending'
  deadline?: string
  completedAt?: string
  approvedBy?: string
  attachments?: string[]
}

export interface Candidate {
  id: string
  name: string
  gender: string
  age: number
  position: string
  status: 'nominated' | 'elected' | 'defeated'
  votes: number
  votePercent: number
}

export interface VoteRecord {
  id: string
  electionId: string
  voterId: string
  voterName: string
  voteTime: string
  votes: { candidateId: string; voteType: 'approve' | 'oppose' | 'abstain' }[]
  isValid: boolean
}

export interface ElectionReminder {
  id: string
  orgId: string
  orgName: string
  orgType: string
  termEndDate: string
  daysUntilExpiry: number
  reminderLevel: 'warning' | 'danger' | 'info'
  hasPendingProcess: boolean
}

export const orgTreeData: OrgNode[] = [
  {
    id: 'org-001',
    orgCode: 'DQ-001',
    name: '中共XX市委员会',
    type: '党委',
    parentId: null,
    parentName: '-',
    secretary: '李明',
    committeeMembers: ['李明（书记）', '王建国（副书记）', '张卫国（组织部长）', '刘芳（宣传部长）'],
    establishmentCount: 5,
    memberCount: 1256,
    foundDate: '1995-01-15',
    address: 'XX市人民政府大楼A座8层',
    status: '正常',
    children: [
      {
        id: 'org-002',
        orgCode: 'DQ-001-001',
        name: '机关党总支',
        type: '党总支',
        parentId: 'org-001',
        parentName: '中共XX市委员会',
        secretary: '王芳',
        committeeMembers: ['王芳（书记）', '赵强（组织委员）'],
        establishmentCount: 3,
        memberCount: 234,
        foundDate: '2000-03-20',
        address: 'XX市人民政府大楼A座6层',
        status: '正常',
        children: [
          {
            id: 'org-003',
            orgCode: 'DQ-001-001-001',
            name: '第一党支部',
            type: '党支部',
            parentId: 'org-002',
            parentName: '机关党总支',
            secretary: '张伟',
            committeeMembers: ['张伟（书记）', '刘洋（组织委员）', '陈静（宣传委员）', '王磊（纪检委员）'],
            establishmentCount: 2,
            memberCount: 45,
            foundDate: '2010-05-15',
            address: 'XX市人民政府大楼A座601室',
            status: '正常',
            children: [
              {
                id: 'org-004',
                orgCode: 'DQ-001-001-001-001',
                name: '第一党小组',
                type: '党小组',
                parentId: 'org-003',
                parentName: '第一党支部',
                secretary: '刘洋',
                committeeMembers: [],
                establishmentCount: 0,
                memberCount: 15,
                foundDate: '2015-06-01',
                address: 'XX市人民政府大楼A座601室',
                status: '正常',
              },
              {
                id: 'org-005',
                orgCode: 'DQ-001-001-001-002',
                name: '第二党小组',
                type: '党小组',
                parentId: 'org-003',
                parentName: '第一党支部',
                secretary: '陈静',
                committeeMembers: [],
                establishmentCount: 0,
                memberCount: 15,
                foundDate: '2015-06-01',
                address: 'XX市人民政府大楼A座602室',
                status: '正常',
              },
            ],
          },
          {
            id: 'org-006',
            orgCode: 'DQ-001-001-002',
            name: '第二党支部',
            type: '党支部',
            parentId: 'org-002',
            parentName: '机关党总支',
            secretary: '赵敏',
            committeeMembers: ['赵敏（书记）', '孙磊（组织委员）', '周丽（宣传委员）'],
            establishmentCount: 2,
            memberCount: 56,
            foundDate: '2012-08-20',
            address: 'XX市人民政府大楼A座603室',
            status: '正常',
          },
        ],
      },
      {
        id: 'org-007',
        orgCode: 'DQ-001-002',
        name: '企业党总支',
        type: '党总支',
        parentId: 'org-001',
        parentName: '中共XX市委员会',
        secretary: '孙伟',
        committeeMembers: ['孙伟（书记）', '吴强（组织委员）'],
        establishmentCount: 4,
        memberCount: 567,
        foundDate: '2005-07-10',
        address: 'XX市工业园区XX路88号',
        status: '正常',
        children: [
          {
            id: 'org-008',
            orgCode: 'DQ-001-002-001',
            name: '生产党支部',
            type: '党支部',
            parentId: 'org-007',
            parentName: '企业党总支',
            secretary: '周强',
            committeeMembers: ['周强（书记）', '郑凯（组织委员）'],
            establishmentCount: 3,
            memberCount: 120,
            foundDate: '2008-01-15',
            address: 'XX市工业园区XX路88号生产大楼',
            status: '正常',
          },
          {
            id: 'org-009',
            orgCode: 'DQ-001-002-002',
            name: '销售党支部',
            type: '党支部',
            parentId: 'org-007',
            parentName: '企业党总支',
            secretary: '吴丽',
            committeeMembers: ['吴丽（书记）', '黄敏（组织委员）'],
            establishmentCount: 2,
            memberCount: 89,
            foundDate: '2010-03-25',
            address: 'XX市工业园区XX路88号销售大楼',
            status: '正常',
          },
        ],
      },
      {
        id: 'org-010',
        orgCode: 'DQ-001-003',
        name: '离退休党总支',
        type: '党总支',
        parentId: 'org-001',
        parentName: '中共XX市委员会',
        secretary: '郑凯',
        committeeMembers: ['郑凯（书记）', '陈明（组织委员）'],
        establishmentCount: 2,
        memberCount: 455,
        foundDate: '2015-09-01',
        address: 'XX市XX区XX路XX号老干部活动中心',
        status: '正常',
        children: [
          {
            id: 'org-011',
            orgCode: 'DQ-001-003-001',
            name: '退休第一党支部',
            type: '党支部',
            parentId: 'org-010',
            parentName: '离退休党总支',
            secretary: '黄敏',
            committeeMembers: ['黄敏（书记）', '李强（组织委员）'],
            establishmentCount: 1,
            memberCount: 180,
            foundDate: '2016-01-10',
            address: 'XX市XX区XX路XX号老干部活动中心3楼',
            status: '正常',
          },
        ],
      },
    ],
  },
]

export const orgDetailData: OrgDetail = {
  id: 'org-003',
  orgCode: 'DQ-001-001-001',
  name: '第一党支部',
  type: '党支部',
  parentId: 'org-002',
  parentName: '机关党总支',
  foundDate: '2010-05-15',
  secretary: '张伟',
  committeeMembers: ['张伟（书记）', '刘洋（组织委员）', '陈静（宣传委员）', '王磊（纪检委员）'],
  establishmentCount: 2,
  termEndDate: '2025-05-15',
  address: 'XX市XX区XX路XX号',
  memberCount: 45,
  status: '正常',
}

export const orgHistoryRecords: OrgHistoryRecord[] = [
  { id: '1', orgId: 'org-003', orgName: '第一党支部', orgCode: 'DQ-001-001-001', actionType: '新增', actionTime: '2010-05-15 10:30:00', operator: '李明', detail: '经机关党总支研究决定，成立第一党支部', approvalStatus: '已审批', approvalBy: '王建国', approvalTime: '2010-05-15 14:00:00' },
  { id: '2', orgId: 'org-003', orgName: '第一党支部', orgCode: 'DQ-001-001-001', actionType: '换届', actionTime: '2015-05-20 09:00:00', operator: '王芳', detail: '召开支部大会，选举产生新一届支部委员会', approvalStatus: '已审批', approvalBy: '张卫国', approvalTime: '2015-05-25 10:30:00' },
  { id: '3', orgId: 'org-003', orgName: '第一党支部', orgCode: 'DQ-001-001-001', actionType: '编辑', actionTime: '2020-03-10 11:00:00', operator: '张伟', detail: '更新支部联系地址', approvalStatus: '已审批', approvalBy: '王芳', approvalTime: '2020-03-10 15:00:00' },
  { id: '4', orgId: 'org-003', orgName: '第一党支部', orgCode: 'DQ-001-001-001', actionType: '换届', actionTime: '2023-05-15 09:00:00', operator: '张伟', detail: '召开支部大会，选举张伟为支部书记', approvalStatus: '已审批', approvalBy: '王芳', approvalTime: '2023-05-20 10:00:00' },
  { id: '5', orgId: 'org-006', orgName: '第二党支部', orgCode: 'DQ-001-001-002', actionType: '划转', actionTime: '2021-08-01 09:00:00', operator: '张卫国', detail: '由原企业党总支划转至机关党总支管理', approvalStatus: '已审批', approvalBy: '李明', approvalTime: '2021-08-05 14:00:00' },
]

export const approvalFlows: ApprovalFlow[] = [
  { id: 'af-001', orgId: 'org-008', orgName: '生产党支部', type: '撤销', status: '待审批', applyTime: '2024-01-15 10:00:00', applyBy: '周强', reason: '因机构调整，需撤销生产党支部，党员划转至销售党支部', attachmentUrls: ['/attachments/20240115/001.pdf'] },
  { id: 'af-002', orgId: 'org-009', orgName: '销售党支部', type: '合并', status: '审批中', applyTime: '2024-01-20 09:00:00', applyBy: '吴丽', reason: '生产党支部与销售党支部合并为综合党支部', attachmentUrls: ['/attachments/20240120/001.pdf', '/attachments/20240120/002.pdf'] },
]

export const electionRecords: ElectionRecord[] = [
  { id: '1', orgId: 'org-006', orgName: '第二党支部', electionType: '换届选举', status: '筹备中', deadline: '2024-03-15', progress: 30, currentStage: '换届筹备', termStartDate: '2021-03-15', termEndDate: '2024-03-15', isExtended: false, createdAt: '2024-01-10 09:00:00', applyBy: '赵敏' },
  { id: '2', orgId: 'org-008', orgName: '生产党支部', electionType: '换届选举', status: '进行中', deadline: '2024-04-20', progress: 60, currentStage: '选举大会', termStartDate: '2021-04-20', termEndDate: '2024-04-20', isExtended: false, createdAt: '2024-02-01 10:00:00', applyBy: '周强' },
  { id: '3', orgId: 'org-011', orgName: '退休第一党支部', electionType: '委员补选', status: '待审批', deadline: '2024-02-28', progress: 10, currentStage: '换届请示', termStartDate: '2021-01-10', termEndDate: '2024-01-10', isExtended: true, extendedReason: '因疫情影响延期换届', createdAt: '2024-01-20 14:00:00', applyBy: '黄敏' },
]

export const electionStages: Record<string, ElectionStage[]> = {
  '1': [
    { id: 's1', name: '换届请示', order: 1, status: 'completed', deadline: '2024-01-20', completedAt: '2024-01-18', approvedBy: '王芳', attachments: ['换届请示.pdf'] },
    { id: 's2', name: '上级批复', order: 2, status: 'completed', deadline: '2024-01-25', completedAt: '2024-01-22', approvedBy: '张卫国', attachments: ['上级批复.pdf'] },
    { id: 's3', name: '换届筹备', order: 3, status: 'current', deadline: '2024-02-28' },
    { id: 's4', name: '选举大会', order: 4, status: 'pending', deadline: '2024-03-10' },
    { id: 's5', name: '选举结果上报', order: 5, status: 'pending', deadline: '2024-03-12' },
    { id: 's6', name: '上级批复', order: 6, status: 'pending', deadline: '2024-03-15' },
    { id: 's7', name: '委员分工备案', order: 7, status: 'pending', deadline: '2024-03-20' },
  ],
  '2': [
    { id: 's1', name: '换届请示', order: 1, status: 'completed', deadline: '2024-02-10', completedAt: '2024-02-08', approvedBy: '孙伟', attachments: ['换届请示.pdf'] },
    { id: 's2', name: '上级批复', order: 2, status: 'completed', deadline: '2024-02-15', completedAt: '2024-02-12', approvedBy: '李明', attachments: ['上级批复.pdf'] },
    { id: 's3', name: '换届筹备', order: 3, status: 'completed', deadline: '2024-03-30', completedAt: '2024-03-28', approvedBy: '周强', attachments: ['选举方案.pdf', '候选人名单.pdf'] },
    { id: 's4', name: '选举大会', order: 4, status: 'current', deadline: '2024-04-15' },
    { id: 's5', name: '选举结果上报', order: 5, status: 'pending', deadline: '2024-04-18' },
    { id: 's6', name: '上级批复', order: 6, status: 'pending', deadline: '2024-04-20' },
    { id: 's7', name: '委员分工备案', order: 7, status: 'pending', deadline: '2024-04-25' },
  ],
  '3': [
    { id: 's1', name: '换届请示', order: 1, status: 'current', deadline: '2024-02-10' },
    { id: 's2', name: '上级批复', order: 2, status: 'pending', deadline: '2024-02-15' },
    { id: 's3', name: '换届筹备', order: 3, status: 'pending', deadline: '2024-02-25' },
    { id: 's4', name: '选举大会', order: 4, status: 'pending', deadline: '2024-02-28' },
    { id: 's5', name: '选举结果上报', order: 5, status: 'pending', deadline: '2024-03-02' },
    { id: 's6', name: '上级批复', order: 6, status: 'pending', deadline: '2024-03-05' },
    { id: 's7', name: '委员分工备案', order: 7, status: 'pending', deadline: '2024-03-10' },
  ],
}

export const electionCandidates: Record<string, Candidate[]> = {
  '2': [
    { id: 'c1', name: '周强', gender: '男', age: 45, position: '支部书记', status: 'nominated', votes: 85, votePercent: 70.8 },
    { id: 'c2', name: '郑凯', gender: '男', age: 40, position: '组织委员', status: 'nominated', votes: 92, votePercent: 76.7 },
    { id: 'c3', name: '王莉', gender: '女', age: 38, position: '宣传委员', status: 'nominated', votes: 78, votePercent: 65.0 },
    { id: 'c4', name: '陈刚', gender: '男', age: 42, position: '纪检委员', status: 'nominated', votes: 88, votePercent: 73.3 },
    { id: 'c5', name: '赵丽', gender: '女', age: 35, position: '纪检委员', status: 'nominated', votes: 72, votePercent: 60.0 },
  ],
}

export const voteRecords: VoteRecord[] = [
  { id: 'v1', electionId: '2', voterId: 'm-001', voterName: '张三', voteTime: '2024-04-10 09:30:00', votes: [{ candidateId: 'c1', voteType: 'approve' }, { candidateId: 'c2', voteType: 'approve' }, { candidateId: 'c3', voteType: 'approve' }, { candidateId: 'c4', voteType: 'approve' }, { candidateId: 'c5', voteType: 'abstain' }], isValid: true },
  { id: 'v2', electionId: '2', voterId: 'm-002', voterName: '李四', voteTime: '2024-04-10 09:35:00', votes: [{ candidateId: 'c1', voteType: 'approve' }, { candidateId: 'c2', voteType: 'approve' }, { candidateId: 'c3', voteType: 'oppose' }, { candidateId: 'c4', voteType: 'approve' }, { candidateId: 'c5', voteType: 'approve' }], isValid: true },
  { id: 'v3', electionId: '2', voterId: 'm-003', voterName: '王五', voteTime: '2024-04-10 09:40:00', votes: [{ candidateId: 'c1', voteType: 'approve' }, { candidateId: 'c2', voteType: 'approve' }, { candidateId: 'c3', voteType: 'approve' }, { candidateId: 'c4', voteType: 'approve' }, { candidateId: 'c5', voteType: 'oppose' }], isValid: true },
]

export const electionReminders: ElectionReminder[] = [
  { id: 'r1', orgId: 'org-003', orgName: '第一党支部', orgType: '党支部', termEndDate: '2026-05-15', daysUntilExpiry: 63, reminderLevel: 'info', hasPendingProcess: false },
  { id: 'r2', orgId: 'org-005', orgName: '第二党小组', orgType: '党小组', termEndDate: '2024-06-01', daysUntilExpiry: 45, reminderLevel: 'warning', hasPendingProcess: true },
  { id: 'r3', orgId: 'org-007', orgName: '企业党总支', orgType: '党总支', termEndDate: '2024-07-10', daysUntilExpiry: 90, reminderLevel: 'warning', hasPendingProcess: false },
  { id: 'r4', orgId: 'org-009', orgName: '销售党支部', orgType: '党支部', termEndDate: '2024-03-25', daysUntilExpiry: 5, reminderLevel: 'danger', hasPendingProcess: false },
  { id: 'r5', orgId: 'org-010', orgName: '离退休党总支', orgType: '党总支', termEndDate: '2025-09-01', daysUntilExpiry: 180, reminderLevel: 'info', hasPendingProcess: false },
]