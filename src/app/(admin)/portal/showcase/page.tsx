'use client'

import { useState } from 'react'
import { Card, Row, Col, Button, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface ShowcaseItem {
  key: string
  title: string
  description: string
  orgName: string
  imageUrl: string
}

const showcaseList: ShowcaseItem[] = [
  { key: '1', title: '第一党支部志愿服务活动', description: '组织党员开展社区志愿服务，帮助孤寡老人和困难群众', orgName: '第一党支部', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volunteer%20community%20service%20activity%20with%20people%20helping%20each%20other&image_size=landscape_16_9' },
  { key: '2', title: '主题党日活动纪实', description: '参观红色教育基地，重温入党誓词，传承革命精神', orgName: '第二党支部', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20education%20base%20visit%20with%20people%20holding%20flags&image_size=landscape_16_9' },
  { key: '3', title: '党员先锋岗创建', description: '在工作岗位上发挥党员先锋模范作用，树立良好形象', orgName: '生产党支部', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=workplace%20with%20employees%20working%20hard&image_size=landscape_16_9' },
]

export default function PortalShowcase() {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('党建风采已发布')
      setModalVisible(false)
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">党建风采</h1>
          <p className="text-gray-500 mt-1">展示党组织和党员的先进事迹和活动风采</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>发布风采</Button>
      </div>

      <Row gutter={[16, 16]}>
        {showcaseList.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.key}>
            <Card
              hoverable
              cover={<img alt={item.title} src={item.imageUrl} className="h-40 object-cover" />}
              actions={[
                <Button icon={<EyeOutlined />} size="small">查看</Button>,
                <Button icon={<EditOutlined />} size="small">编辑</Button>,
                <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>,
              ]}
            >
              <Card.Meta
                title={<span className="font-medium">{item.title}</span>}
                description={
                  <>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    <p className="text-gray-400 text-xs mt-2">{item.orgName}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="发布党建风采"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="请输入活动描述..." />
          </Form.Item>
          <Form.Item name="orgName" label="所属组织">
            <Input placeholder="请输入所属组织" />
          </Form.Item>
          <Form.Item name="imageUrl" label="图片链接">
            <Input placeholder="请输入图片链接" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}