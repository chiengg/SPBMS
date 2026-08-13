export interface MeetingPlan {
  key: string
  id: string
  name: string
  type: string
  orgName: string
  planDate: string
  actualDate: string
  location: string
  host: string
  status: string
  attendees: number
  totalMembers: number
}

export interface ThemeActivity {
  key: string
  id: string
  title: string
  orgName: string
  activityDate: string
  location: string
  status: string
  participants: number
  views: number
  images: number
}

export interface LifeMeeting {
  key: string
  id: string
  title: string
  orgName: string
  meetingDate: string
  status: string
  problems: number
  completedTasks: number
  totalTasks: number
}

export const meetingPlans: MeetingPlan[] = [
  { key: '1', id: 'mt-001', name: '第一党支部党员大会', type: '支部大会', orgName: '第一党支部', planDate: '2024-01-15', actualDate: '2024-01-15', location: '会议室A', host: '张伟', status: '已完成', attendees: 42, totalMembers: 45 },
  { key: '2', id: 'mt-002', name: '总支委员会会议', type: '支委会', orgName: '机关党总支', planDate: '2024-01-12', actualDate: '2024-01-12', location: '会议室B', host: '王芳', status: '已完成', attendees: 8, totalMembers: 10 },
  { key: '3', id: 'mt-003', name: '第二党支部党课', type: '党课', orgName: '第二党支部', planDate: '2024-01-10', actualDate: '2024-01-10', location: '会议室C', host: '赵敏', status: '已完成', attendees: 52, totalMembers: 56 },
  { key: '4', id: 'mt-004', name: '第一党小组会议', type: '党小组会', orgName: '第一党小组', planDate: '2024-01-08', actualDate: '2024-01-08', location: '办公室', host: '刘洋', status: '已完成', attendees: 14, totalMembers: 15 },
  { key: '5', id: 'mt-005', name: '生产党支部党员大会', type: '支部大会', orgName: '生产党支部', planDate: '2024-01-20', actualDate: '', location: '车间会议室', host: '周强', status: '计划中', attendees: 0, totalMembers: 120 },
  { key: '6', id: 'mt-006', name: '销售党支部党课', type: '党课', orgName: '销售党支部', planDate: '2024-01-22', actualDate: '', location: '销售部会议室', host: '吴丽', status: '计划中', attendees: 0, totalMembers: 89 },
]

export const themeActivities: ThemeActivity[] = [
  { key: '1', id: 'ta-001', title: '重温入党誓词主题党日活动', orgName: '第一党支部', activityDate: '2024-01-05', location: '红色教育基地', status: '已完成', participants: 45, views: 120, images: 8 },
  { key: '2', id: 'ta-002', title: '学雷锋志愿服务活动', orgName: '第二党支部', activityDate: '2024-01-10', location: '社区', status: '已完成', participants: 38, views: 95, images: 12 },
  { key: '3', id: 'ta-003', title: '党的二十大精神学习研讨', orgName: '机关党总支', activityDate: '2024-01-18', location: '会议室A', status: '进行中', participants: 234, views: 68, images: 0 },
  { key: '4', id: 'ta-004', title: '七一建党节庆祝活动', orgName: '企业党总支', activityDate: '2024-07-01', location: '待定', status: '筹备中', participants: 0, views: 0, images: 0 },
]

export const lifeMeetings: LifeMeeting[] = [
  { key: '1', id: 'lm-001', title: '2023年度组织生活会', orgName: '第一党支部', meetingDate: '2024-01-05', status: '已完成', problems: 8, completedTasks: 8, totalTasks: 8 },
  { key: '2', id: 'lm-002', title: '2023年度组织生活会', orgName: '第二党支部', meetingDate: '2024-01-08', status: '整改中', problems: 12, completedTasks: 5, totalTasks: 12 },
  { key: '3', id: 'lm-003', title: '2023年度组织生活会', orgName: '生产党支部', meetingDate: '2024-01-10', status: '待召开', problems: 0, completedTasks: 0, totalTasks: 0 },
]