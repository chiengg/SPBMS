export interface MemberPoint {
  key: string
  id: string
  name: string
  orgName: string
  totalPoints: number
  basicPoints: number
  bonusPoints: number
  deductPoints: number
  rank: number
  lastWeekPoints: number
}

export interface BranchAssessment {
  key: string
  id: string
  name: string
  score: number
  level: string
  evaluationDate: string
  status: string
}

export const memberPoints: MemberPoint[] = [
  { key: '1', id: 'm-001', name: '张伟', orgName: '第一党支部', totalPoints: 95, basicPoints: 85, bonusPoints: 15, deductPoints: 5, rank: 1, lastWeekPoints: 12 },
  { key: '2', id: 'm-002', name: '刘洋', orgName: '第一党支部', totalPoints: 92, basicPoints: 82, bonusPoints: 18, deductPoints: 8, rank: 2, lastWeekPoints: 10 },
  { key: '3', id: 'm-003', name: '陈静', orgName: '第一党支部', totalPoints: 88, basicPoints: 80, bonusPoints: 12, deductPoints: 4, rank: 3, lastWeekPoints: 8 },
  { key: '4', id: 'm-004', name: '王磊', orgName: '第一党支部', totalPoints: 75, basicPoints: 72, bonusPoints: 8, deductPoints: 5, rank: 4, lastWeekPoints: 5 },
  { key: '5', id: 'm-005', name: '赵雪', orgName: '第一党支部', totalPoints: 82, basicPoints: 78, bonusPoints: 6, deductPoints: 2, rank: 5, lastWeekPoints: 7 },
]

export const branchAssessments: BranchAssessment[] = [
  { key: '1', id: 'org-003', name: '第一党支部', score: 92, level: '优秀', evaluationDate: '2024-01-10', status: '已完成' },
  { key: '2', id: 'org-006', name: '第二党支部', score: 85, level: '良好', evaluationDate: '2024-01-08', status: '已完成' },
  { key: '3', id: 'org-008', name: '生产党支部', score: 78, level: '合格', evaluationDate: '2024-01-12', status: '已完成' },
  { key: '4', id: 'org-009', name: '销售党支部', score: 72, level: '合格', evaluationDate: '2024-01-15', status: '整改中' },
]