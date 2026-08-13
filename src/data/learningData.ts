export interface Course {
  key: string
  id: string
  title: string
  type: string
  duration: string
  category: string
  status: string
  learners: number
  completionRate: number
}

export interface Task {
  key: string
  id: string
  title: string
  orgName: string
  deadline: string
  status: string
  progress: number
  assignedCount: number
  completedCount: number
}

export interface Exam {
  key: string
  id: string
  title: string
  type: string
  duration: number
  passScore: number
  status: string
  totalQuestions: number
  participants: number
  passRate: number
}

export const courses: Course[] = [
  { key: '1', id: 'c-001', title: '党的二十大精神专题学习', type: '视频', duration: '45分钟', category: '政治理论', status: '已发布', learners: 1256, completionRate: 85 },
  { key: '2', id: 'c-002', title: '习近平新时代中国特色社会主义思想', type: '视频', duration: '90分钟', category: '政治理论', status: '已发布', learners: 1120, completionRate: 78 },
  { key: '3', id: 'c-003', title: '党史学习教育专题', type: '视频', duration: '60分钟', category: '党史党建', status: '已发布', learners: 980, completionRate: 92 },
  { key: '4', id: 'c-004', title: '党章党规学习', type: '文档', duration: '30分钟', category: '党规党纪', status: '已发布', learners: 850, completionRate: 65 },
  { key: '5', id: 'c-005', title: '廉洁自律准则解读', type: '视频', duration: '40分钟', category: '党规党纪', status: '待审核', learners: 0, completionRate: 0 },
]

export const tasks: Task[] = [
  { key: '1', id: 't-001', title: '党的二十大精神学习任务', orgName: '中共XX市委员会', deadline: '2024-02-28', status: '进行中', progress: 78, assignedCount: 1256, completedCount: 980 },
  { key: '2', id: 't-002', title: '月度学习任务', orgName: '机关党总支', deadline: '2024-01-31', status: '进行中', progress: 92, assignedCount: 234, completedCount: 215 },
  { key: '3', id: 't-003', title: '党史学习教育', orgName: '企业党总支', deadline: '2024-03-15', status: '未开始', progress: 0, assignedCount: 567, completedCount: 0 },
]

export const exams: Exam[] = [
  { key: '1', id: 'e-001', title: '党的二十大精神知识测试', type: '随机组卷', duration: 60, passScore: 60, status: '进行中', totalQuestions: 50, participants: 850, passRate: 92 },
  { key: '2', id: 'e-002', title: '党章党规知识考试', type: '固定组卷', duration: 90, passScore: 60, status: '已结束', totalQuestions: 100, participants: 1200, passRate: 88 },
  { key: '3', id: 'e-003', title: '年度党建知识考核', type: '随机组卷', duration: 120, passScore: 60, status: '未开始', totalQuestions: 120, participants: 0, passRate: 0 },
]