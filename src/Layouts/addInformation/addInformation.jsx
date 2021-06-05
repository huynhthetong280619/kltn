import { Button, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notifyError } from '../../assets/common/core/notify';
import RestClient from '../../utils/restClient';
// import Loading from '../../loading/loading.jsx';
const { Option } = Select;
const { TextArea } = Input;

const AddInformation = ({ timelinesList, isLoading, createInformation, idSubject, idTimeline, idInformation, token }) => {

    const [form] = Form.useForm();
    const [information, setInformation] = useState(null);
    const {t} = useTranslation()
    const restClient = new RestClient({ token: '' })

    useEffect(() => {
        if (idInformation) {
            restClient.asyncGet(`/announcement/${idInformation}?idCourse=${idSubject}&idTimeline=${idTimeline}`)
                .then(res => {
                    if (!res.hasError) {
                        setInformation(res.data.announcements);
                        form.setFieldsValue({
                            idTimeline: idTimeline,
                            information: res.data.announcements
                        })
                    } else {
                        notifyError(t('failure'), res.data.message );
                    }
                })

        } else {
            form.setFieldsValue({
                idTimeline: timelinesList[0] ? timelinesList[0]._id : null
            })
        }
    }, []);

    const onFinish = (values) => {
        let information = {
            name: values.information.name,
            content: values.information.content
        }
        //console.log('information', information)
        if (!idInformation) {
            createInformation({ idTimeline: values.idTimeline, information: information });
        }
    }

 

    return (
        <>
            {
                (idInformation && !information) ?
                    <div>Loading</div>
                    : (
                        <Form
                        {
                            ...{
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                }
                            }
                        }
                            onFinish={onFinish}
                            layout="horizontal"
                            form={form}
                        >
                            <Form.Item
                                label={t('timeline')}
                                name="idTimeline"
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_select_week')
                                    }
                                ]}
                                hasFeedback
                            >
                                <Select dropdownClassName="ant-customize-dropdown" disabled={idInformation || false}>
                                    {
                                        timelinesList.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={t('name')}
                                name={['information', 'name']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_title_announce')
                                    }
                                ]}
                                hasFeedback>
                                <Input id="antd-customize" className="ant-input-customize" placeholder={t('name_of_announce')} />
                            </Form.Item>

                            <Form.Item
                                label={t('content')}
                                name={['information', 'content']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_content_announce'),
                                    }
                                ]}
                                hasFeedback>
                                <TextArea
                                    placeholder={t('content_announce')}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            </Form.Item>

                            <Form.Item wrapperCol={{span: 24}}>
                                <Button type="primary" htmlType="submit">
                                    {t('submit')}</Button>
                            </Form.Item>
                        </Form>
                    )}
        </>
    )
}


export default AddInformation
