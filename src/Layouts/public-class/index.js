import React, { useEffect, useState } from 'react'
import Title from 'antd/lib/typography/Title'
import { useTranslation } from 'react-i18next'
import { Input, Form, Checkbox, Button, Select, notification } from 'antd'
import RestClient from '../../utils/restClient'
import { useHistory } from 'react-router'

const { Option } = Select

const PublicClass = () => {
    const { t } = useTranslation()
    const [form] = Form.useForm();
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const restClient = new RestClient({ token: '' })

    const [curriculum, setCurriculum] = useState([])
    const [currId, setCurrId] = useState('')
    const [subject, setSubject] = useState([])

    useEffect(() => {
        restClient.asyncGet('/curriculum')
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    setCurriculum(res?.data.curriculums)
                }
            })
    }, [])
    const onFinish = (fieldValues) => {
        const data = {
            ...fieldValues,
            config: {
                acceptEnroll: Boolean(fieldValues.config.acceptEnroll),
            }
        };

        console.log(data)
        restClient.asyncPost(`/course`, data)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    notification.success({
                        message: res.data.message,
                        placement: 'topRight'
                    })
                    history.push('/home/main-app')
                }
                notification.warning({
                    message: res.data.message,
                    placement: 'topRight'
                })
            })
    }

    const onChangeCurriculum = (curr) => {
        console.log(curr)
        // restClient.asyncGet(`/curriculum/${curr}/subjects`)
        // .then(res => {
        //     if(!res.hasError){
        //         console.log(res)
        //         setSubject(res?.data.subjects)
        //     }
        // })
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
                        name={['idSubject']}
                        rules={[
                            {
                                required: true,
                                message: t('req_qty_question'),
                            }
                        ]}
                        hasFeedback>
                        <Select dropdownClassName="ant-customize-dropdown" onChange={(selected) => onChangeCurriculum(selected)} >
                            {
                                curriculum.map(curr => (<Option value={curr['_id']} key={curr['_id']}>{curr['name']}</Option>))
                            }
                        </Select>
                    </Form.Item>
                    {/* <Form.Item
                        label={t('Môn học (Tuy chọn)')}
                        name={['subjectId']}
                        rules={[
                            {
                                required: true,
                                message: t('req_qty_question'),
                            }
                        ]}
                        hasFeedback>
                        <Select dropdownClassName="ant-customize-dropdown">
                            {
                                subject.map(sub => (<Option value={sub['_id']} key={sub['_id']}>{sub['name']}</Option>))
                            }
                        </Select>
                    </Form.Item> */}
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