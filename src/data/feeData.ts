export interface FeeRecord {
  key: string
  id: string
  memberName: string
  orgName: string
  month: string
  shouldAmount: number
  actualAmount: number
  payType: string
  payStatus: string
  payTime: string
}

export interface FeeUseRecord {
  key: string
  id: string
  orgName: string
  amount: number
  purpose: string
  status: string
  applyTime: string
  approveTime?: string
}

export const feeRecords: FeeRecord[] = [
  { key: '1', id: 'f-001', memberName: '张伟', orgName: '第一党支部', month: '2024-01', shouldAmount: 48, actualAmount: 48, payType: '微信', payStatus: '已缴', payTime: '2024-01-05' },
  { key: '2', id: 'f-002', memberName: '刘洋', orgName: '第一党支部', month: '2024-01', shouldAmount: 48, actualAmount: 48, payType: '微信', payStatus: '已缴', payTime: '2024-01-08' },
  { key: '3', id: 'f-003', memberName: '陈静', orgName: '第一党支部', month: '2024-01', shouldAmount: 36, actualAmount: 36, payType: '支付宝', payStatus: '已缴', payTime: '2024-01-03' },
  { key: '4', id: 'f-004', memberName: '王磊', orgName: '第一党支部', month: '2024-01', shouldAmount: 36, actualAmount: 0, payType: '-', payStatus: '欠缴', payTime: '-' },
  { key: '5', id: 'f-005', memberName: '赵雪', orgName: '第一党支部', month: '2024-01', shouldAmount: 24, actualAmount: 24, payType: '微信', payStatus: '已缴', payTime: '2024-01-10' },
  { key: '6', id: 'f-006', memberName: '孙强', orgName: '第二党支部', month: '2024-01', shouldAmount: 48, actualAmount: 0, payType: '-', payStatus: '欠缴', payTime: '-' },
]

export const feeUseRecords: FeeUseRecord[] = [
  { key: '1', id: 'u-001', orgName: '第一党支部', amount: 5000, purpose: '购买学习资料', status: '已审批', applyTime: '2024-01-05', approveTime: '2024-01-06' },
  { key: '2', id: 'u-002', orgName: '第二党支部', amount: 3000, purpose: '组织红色教育活动', status: '待审批', applyTime: '2024-01-12' },
  { key: '3', id: 'u-003', orgName: '机关党总支', amount: 10000, purpose: '七一庆祝活动', status: '待审批', applyTime: '2024-01-15' },
]