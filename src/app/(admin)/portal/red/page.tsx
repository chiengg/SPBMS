'use client'

import { useState } from 'react'
import { Card, Row, Col, Button, Select, Tag, Modal } from 'antd'
import { EyeOutlined, MapPinOutlined, ClockCircleOutlined } from '@ant-design/icons'

interface RedResource {
  key: string
  name: string
  type: string
  location: string
  description: string
  imageUrl: string
}

const redResources: RedResource[] = [
  { key: '1', name: '南湖红船纪念馆', type: '纪念馆', location: '浙江省嘉兴市', description: '中国共产党诞生地，承载着开天辟地、敢为人先的首创精神', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20boat%20memorial%20museum%20with%20historical%20exhibits&image_size=landscape_16_9' },
  { key: '2', name: '井冈山革命根据地', type: '革命根据地', location: '江西省井冈山市', description: '中国革命摇篮，开创了农村包围城市的革命道路', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jingshan%20mountain%20revolutionary%20base%20camp%20scenic%20view&image_size=landscape_16_9' },
  { key: '3', name: '延安革命纪念馆', type: '纪念馆', location: '陕西省延安市', description: '中国革命圣地，见证了中国共产党的发展壮大', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yanan%20revolutionary%20memorial%20museum%20traditional%20building&image_size=landscape_16_9' },
]

export default function RedEducation() {
  const [modalVisible, setModalVisible] = useState(false)

  const handleViewDetail = () => {
    setModalVisible(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">红色教育资源</h1>
          <p className="text-gray-500 mt-1">展示红色教育基地和革命历史资源</p>
        </div>
        <Select placeholder="资源类型" style={{ width: 140 }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="museum">纪念馆</Select.Option>
          <Select.Option value="base">革命根据地</Select.Option>
          <Select.Option value="site">旧址</Select.Option>
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {redResources.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.key}>
            <Card
              hoverable
              cover={<img alt={item.name} src={item.imageUrl} className="h-48 object-cover" />}
              actions={[
                <Button icon={<EyeOutlined />} size="small" onClick={handleViewDetail}>查看详情</Button>,
              ]}
            >
              <Card.Meta
                title={<span className="font-medium">{item.name}</span>}
                description={
                  <>
                    <div className="flex items-center gap-2 mt-2">
                      <Tag color={item.type === '纪念馆' ? 'red' : item.type === '革命根据地' ? 'orange' : 'blue'}>{item.type}</Tag>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      <MapPinOutlined className="text-xs" />
                      <span>{item.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="红色教育基地详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={null}
      >
        <div className="space-y-4">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20boat%20memorial%20museum%20with%20historical%20exhibits&image_size=landscape_16_9" alt="南湖红船纪念馆" className="w-full h-48 object-cover rounded" />
          <div>
            <h3 className="text-xl font-bold">南湖红船纪念馆</h3>
            <div className="flex items-center gap-2 mt-2">
              <Tag color="red">纪念馆</Tag>
              <span className="text-gray-500 text-sm"><MapPinOutlined className="text-xs" /> 浙江省嘉兴市</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">简介</h4>
            <p className="text-gray-600">南湖红船纪念馆位于浙江省嘉兴市南湖区，是为纪念中国共产党第一次全国代表大会在南湖红船上胜利闭幕而建造的。纪念馆承载着开天辟地、敢为人先的首创精神，坚定理想、百折不挠的奋斗精神，立党为公、忠诚为民的奉献精神。</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">参观信息</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span><ClockCircleOutlined className="text-gray-400 mr-1" />开放时间：9:00-17:00</span>
              <span><MapPinOutlined className="text-gray-400 mr-1" />地址：浙江省嘉兴市南湖区南湖路1号</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}