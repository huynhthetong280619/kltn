import { useEffect, useState } from 'react';
import { Input, Select, Button, Form, Checkbox, Skeleton } from 'antd'
// import Loading from '../../loading/loading.jsx';
import { notifyError } from '../../assets/common/core/notify.js';
import RestClient from '../../utils/restClient.js';
import { useTranslation } from 'react-i18next';
const { Option } = Select;
const { TextArea } = Input;

const AddForum = ({timelinesList, createForum, updateForum, idSubject, idTimeline, idForum, token }) => {

    const [form] = Form.useForm();

    const [isLoading, setLoading] = useState(false);

    const [forum, setForum] = useState(null);
    const {t} = useTranslation()
    const restClient = new RestClient({ token: '' })


    useEffect(() => {
        if (forum) {
            form.setFieldsValue({
                idTimeline: idTimeline,
                forum: { ...forum, isDeleted: !forum.isDeleted }
            })
        }
    }, [forum])

    useEffect(() => {
        if (idForum) {
            restClient.asyncGet(`/forum/${idForum}/update/?idCourse=${idSubject}&idTimeline=${idTimeline}`, token)
                .then(res => {
                    if (!res.hasError) {
                        setForum(res.data.forum);
                    } else {
                        notifyError(t('failure'), res.data.message);
                    }
                })

        } else {
            form.setFieldsValue({
                idTimeline: timelinesList[0] ? timelinesList[0]._id : null,
                forum: {
                    isDeleted: !false,
                }
            })
        }
    }, []);

    const onFinish = (values) => {
        const data = {
            ...values.forum,
            isDeleted: !values.forum.isDeleted
        }
        //console.log('forum', data)

        if (!idForum) {
            handleCreateForum(data, values.idTimeline);
        } else {
            handleUpdateForum(data, idTimeline);
        }
    }

    const handleCreateForum = async (forum, idTimelineAdd) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineAdd,
            data: forum
        }
        setLoading(true);
        await restClient.asyncPost('/forum', data, token)
            .then(res => {
                //console.log('handleCreateForum', res)
                setLoading(false);
                if (!res.hasError) {
                    createForum({ forum: res.data.forum, idTimeline: idTimelineAdd })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const handleUpdateForum = async (forum, idTimelineUpdate) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineUpdate,
            data: forum
        }
        setLoading(true);
        await restClient.asyncPut(`/forum/${idForum}`, data, token)
            .then(res => {
                //console.log('handleUpdateForum', res)
                setLoading(false);
                if (!res.hasError) {
                    updateForum({ forum: res.data.forum, idTimeline: idTimelineUpdate })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    return (
        <>
            {
                (idForum && !forum) ?
                    <Skeleton />
                    :
                    (<Form
                        onFinish={onFinish}
                        form={form}
                        layout="vertical"
                        
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
                            hasFeedback>
                            <Select dropdownClassName="ant-customize-dropdown" disabled={idForum || false}>
                                {
                                    timelinesList.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('name')}
                            name={['forum', 'name']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_forum_name')
                                }
                            ]}
                            hasFeedback>
                            <Input id="antd-customize" className="ant-input-customize" placeholder={t('forum_name')} />
                        </Form.Item>

                        <Form.Item
                            label={t('content')}
                            name={['forum', 'description']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_forum_description'),
                                }
                            ]}
                            hasFeedback>
                            <TextArea
                                placeholder={t('forum_description')}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('display')}
                            name={['forum', 'isDeleted']}
                            valuePropName="checked"
                            style={{flexDirection: 'row', alignItems: 'baseline'}}
                        >
                            <Checkbox />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" loading={isLoading} htmlType="submit" className="lms-btn">
                                {t('submit')}</Button>
                        </Form.Item>
                    </Form>)}
        </>
    )
}


export default AddForum
