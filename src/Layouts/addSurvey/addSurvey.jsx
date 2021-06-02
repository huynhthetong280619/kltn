import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, Form, DatePicker, Checkbox, Skeleton } from 'antd'
// import Loading from '../../loading/loading.jsx';
import moment from 'moment';
import RestClient from '../../utils/restClient';
import formatTime from '../../assets/common/core/formatTime.js';
import { notifyError } from '../../assets/common/core/notify';
import { useTranslation } from 'react-i18next';
const { Option } = Select;
const { TextArea } = Input;

const AddSurvey = ({ timelinesList, surveyList, createSurvey, updateSurvey, idSubject, idTimeline, idSurvey, token }) => {

    const [form] = Form.useForm();

    const [bank] = useState(surveyList[0]);

    const [survey, setSurvey] = useState(null);

    const [isLoading, setLoading] = useState(false);

    const { t } = useTranslation()

    const restClient = new RestClient({ token: '' })

    useEffect(() => {
        if (survey) {
            //console.log(survey);
            form.setFieldsValue({
                idTimeline: idTimeline,
                survey: { ...survey, isDeleted: !survey.isDeleted }
            })
        }
    }, [survey])

    useEffect(async () => {
        if (idSurvey) {
            await restClient.asyncGet(`/survey/${idSurvey}/update/?idCourse=${idSubject}&idTimeline=${idTimeline}`)
                .then(res => {
                    console.log('Survey', res)
                    if (!res.hasError) {
                        setSurvey({
                            ...res.data.survey,
                            expireTime: moment(res.data.survey.expireTime),
                        });
                    } else {
                        notifyError(t('failure'), res.data.message);
                    }
                })

        } else {
            const object = {
                code: bank ? bank._id : null,
                isDeleted: !false,
            }
            form.setFieldsValue({
                idTimeline: timelinesList[0] ? timelinesList[0]._id : null,
                survey: object
            })
        }
    }, []);

    const onFinish = (fieldsValue) => {

        const data = {
            ...fieldsValue.survey,
            expireTime: formatTime(fieldsValue.survey.expireTime),
            isDeleted: !fieldsValue.survey.isDeleted
        };

        if (!idSurvey) {
            handleCreateSurvey(data, fieldsValue.idTimeline);
        } else {
            handleUpdateSurvey(data, idTimeline);
            //console.log('data', data);
        }
    }

    const handleCreateSurvey = async (survey, idTimelineAdd) => {
        const data = {
            idCourse: idSubject,
            idTimeline: idTimelineAdd,
            data: survey
        }
        setLoading(true);
        await restClient.asyncPost('/survey', data, token)
            .then(res => {
                //console.log('createSurvey', res)
                setLoading(false);
                if (!res.hasError) {
                    createSurvey({ survey: res.data.survey, idTimeline: idTimelineAdd })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const handleUpdateSurvey = async (survey, idTimelineUpdate) => {
        const data = {
            idCourse: idSubject,
            idTimeline: idTimelineUpdate,
            data: survey
        }
        setLoading(true);
        await restClient.asyncPut(`/survey/${idSurvey}`, data, token)
            .then(res => {
                //console.log('UpdateSurvey', res)
                setLoading(false);
                if (!res.hasError) {
                    updateSurvey({ survey: res.data.survey, idTimeline: idTimelineUpdate })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }


    return (<>
        {
            (idSurvey && !survey) ?
                <Skeleton />
                : (<Form
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
                        <Select dropdownClassName="ant-customize-dropdown" disabled={idSurvey || false}>
                            {
                                timelinesList.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={t('name')}
                        name={['survey', 'name']}
                        rules={[
                            {
                                required: true,
                                message: t('req_title_survey')
                            }
                        ]}
                        hasFeedback>
                        <Input id="antd-customize" className="ant-input-customize" placeholder={t('name_of_survey')} />
                    </Form.Item>

                    <Form.Item
                        label={t('content')}
                        name={['survey', 'description']}>
                        <TextArea
                            placeholder={t('desc_of_survey')}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>

                    <Form.Item
                        dependencies={['exam', 'startTime']}
                        label={t('expireTime')}
                        name={['survey', 'expireTime']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: t('req_begin_time'),
                            }
                        ]}
                    >
                        <DatePicker className="alt-date-picker" showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>

                    <Form.Item
                        label={t('code_survey')}
                        name={['survey', 'code']}
                        rules={[
                            {
                                required: true,
                                message: t('req_code_survey'),
                            }
                        ]}
                        hasFeedback
                    >
                        <Select dropdownClassName="ant-customize-dropdown">
                            {
                                surveyList.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                            }
                        </Select>
                    </Form.Item>


                    <Form.Item
                        label={t('display')}
                        name={['survey', 'isDeleted']}
                        valuePropName="checked"
                        style={{ flexDirection: 'row', alignItems: 'baseline' }}

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


export default withTranslation('translations')(AddSurvey)
