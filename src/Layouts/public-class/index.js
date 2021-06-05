import React, { useEffect, useState } from 'react'
import Title from 'antd/lib/typography/Title'
import { useTranslation } from 'react-i18next'
import { Input, Form, Checkbox, Button, Select } from 'antd'
import RestClient from '../../utils/restClient'

const {Option} = Select

const PublicClass = () => {
    const { t } = useTranslation()
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const restClient = new RestClient({ token: '' })

    const [curriculum, setCurriculum] = useState([])

    useEffect(() => {
        restClient.asyncGet('/curriculum')
            .then(res => {
                if(!res.hasError){
                    // setCurriculum(res?.curriculums)
                }
            })
    }, [])
    const onFinish = () => {

    }

    return <div>
        <main className="main-setting">
            <div className="main-setting__f">
                <Form
                    onFinish={onFinish}
                    form={form}
                    layout="horizontal"
                    {...{
                        labelCol: {
                            span: 5,
                        },
                        wrapperCol: {
                            span: 19,
                        }
                    }}
                >
                    <Form.Item
                        label={t('name')}
                        name={['name']}
                        rules={[
                            {
                                required: true,
                                message: t('Yêu cầu tên lớp học')
                            }
                        ]}
                        hasFeedback>
                        <Input id="antd-customize" className="ant-input-customize" placeholder={t('Tên lớp học')} />
                    </Form.Item>
                    <Form.Item
                        label={t('Hệ đào tạo')}
                        name={['curriculumnId']}
                        rules={[
                            {
                                required: true,
                                message: t('req_qty_question'),
                            }
                        ]}
                        hasFeedback>
                        {/* <InputNumber min={1} max={quizBank ? quizBank.questions : 30} /> */}
                        <Select dropdownClassName="ant-customize-dropdown" onChange={() => {}} >
                            {
                                curriculum.map(q => (<Option value={q} key={q}>{q}</Option>))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t('Enroll acception')}
                        name={['config', 'acceptEnroll']}
                        valuePropName="checked"
                    >
                        <Checkbox />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="primary" loading={isLoading} htmlType="submit" style={{ marginTop: 0 }}>
                            {t('submit')}</Button>
                    </Form.Item>
                </Form>
            </div>

            <div className="main-setting__f">
                <Title level={4}>Thông báo</Title>
                <Title level={5}>Email</Title>
                <div className="main-setting__s">
                    <Title level={5}>Nhận thông báo email</Title>
                </div>
            </div>
        </main>
    </div>
}

export default PublicClass