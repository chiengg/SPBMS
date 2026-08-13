'use client'

import { useState } from 'react'
import { Card, Form, Input, Select, Switch, Button, message, Divider, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

export default function SystemConfig() {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      message.success('配置已保存')
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">系统配置</h1>
          <p className="text-gray-500 mt-1">配置系统基础参数和运行参数</p>
        </div>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={handleSubmit}>保存配置</Button>
      </div>

      <Card title="基础配置">
        <Form form={form} layout="vertical" className="max-w-3xl">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="系统名称">
              <Input defaultValue="党建管理系统" />
            </Form.Item>
            <Form.Item label="系统版本">
              <Input defaultValue="V2.0.0" />
            </Form.Item>
            <Form.Item label="单位名称">
              <Input defaultValue="中共XX市委员会" />
            </Form.Item>
            <Form.Item label="联系邮箱">
              <Input defaultValue="dangjian@xxx.gov.cn" />
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="安全配置" className="mt-6">
        <Form form={form} layout="vertical" className="max-w-3xl">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="登录密码有效期（天）">
              <Input type="number" defaultValue="90" />
            </Form.Item>
            <Form.Item label="登录失败锁定次数">
              <Input type="number" defaultValue="5" />
            </Form.Item>
            <Form.Item label="开启验证码">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="开启IP白名单">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="数据配置" className="mt-6">
        <Form form={form} layout="vertical" className="max-w-3xl">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="数据备份周期（天）">
              <Input type="number" defaultValue="7" />
            </Form.Item>
            <Form.Item label="日志保留天数">
              <Input type="number" defaultValue="90" />
            </Form.Item>
            <Form.Item label="自动清理过期数据">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="开启数据审计">
              <Switch defaultChecked />
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="党费配置" className="mt-6">
        <Form form={form} layout="vertical" className="max-w-3xl">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="党费计算基数">
              <Select defaultValue="应发工资">
                <Select.Option value="应发工资">应发工资</Select.Option>
                <Select.Option value="基本工资">基本工资</Select.Option>
                <Select.Option value="固定工资">固定工资</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="收缴截止日期">
              <Input type="number" placeholder="每月几号" defaultValue="15" />
            </Form.Item>
            <Form.Item label="自动提醒催缴">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="逾期提醒天数">
              <Input type="number" defaultValue="3" />
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="学习配置" className="mt-6">
        <Form form={form} layout="vertical" className="max-w-3xl">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="月度学习时长要求（小时）">
              <Input type="number" defaultValue="8" />
            </Form.Item>
            <Form.Item label="年度学时要求（学时）">
              <Input type="number" defaultValue="96" />
            </Form.Item>
            <Form.Item label="开启学习提醒">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="学习完成审核">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  )
}