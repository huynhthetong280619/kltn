import { Button, Checkbox, DatePicker, Form, Input, Select, Skeleton, Row, Col, notification } from 'antd';
// import Loading from '../../loading/loading.jsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import formatTime from '../../assets/common/core/formatTime.js';
import { notifyError } from '../../assets/common/core/notify';
import ModalWrapper from '../../components/basic/modal-wrapper/index.js';
import RestClient from '../../utils/restClient';
import Survey from '../survey/index.js';
const { Option } = Select;
const { TextArea } = Input;

const AddSurvey = ({ timelinesList, surveyList, createSurvey, updateSurvey, idSubject, idTimeline, idSurvey }) => {

    const [form] = Form.useForm();

    const [bank] = useState(surveyList[0]);

    const [survey, setSurvey] = useState(null);

    const [surveyQuestion, setSurveyQuestion] = useState({})
    const [isLoading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false)

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
            setIsEdit(true);
            await restClient.asyncGet(`/survey/${idSurvey}/update/?idCourse=${idSubject}&idTimeline=${idTimeline}`)
                .then(res => {
                    console.log('Survey', res)
                    if (!res.hasError) {
                        setSurvey({
                            ...res.data.survey,
                            setting: {
                                startTime: moment(res.data.survey.setting.startTime),
                                expireTime: moment(res.data.survey.setting.expireTime)
                            }
                        });

                        let temp = {}
                        res.data.survey.questionnaire.map(item => {
                            temp = {
                                ...temp,
                                [`${item.identity}`]: item
                            }
                        })
                        setSurveyQuestion(temp)
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
        if (Object.values(surveyQuestion).length < 1) {
            notification.warning({
                message: "Vui lòng chọn câu hỏi khảo săt!",
                description: "Thông báo hệ thống",
                placement: 'bottomRight'
                
            })
            return
        }
        const data = {
            ...fieldsValue.survey,
            setting: {
                startTime: formatTime(fieldsValue.survey.setting.startTime),
                expireTime: formatTime(fieldsValue.survey.setting.expireTime),
            },
            isDeleted: !fieldsValue.survey.isDeleted,
            questions: Object.values(surveyQuestion)
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
        console.log(data)
        await restClient.asyncPost('/survey', data)
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
        console.log('handleUpdateSurvey', survey)
        const data = {
            idCourse: idSubject,
            idTimeline: idTimelineUpdate,
            data: survey
        }
        setLoading(true);
        await restClient.asyncPut(`/survey/${idSurvey}`, data)
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

    const handleChangeSelectSurvey = (selected) => {
        console.log(selected)
        if (surveyQuestion[`${selected.identity}`]) {
            delete surveyQuestion[`${selected.identity}`]
            setSurveyQuestion({...surveyQuestion});
            return;
        }
        setSurveyQuestion({ ...surveyQuestion, [`${selected.identity}`]: selected })
    }


    return (<>
        {
            (idSurvey && !survey) ?
                <Skeleton />
                : (<Form
                    onFinish={onFinish}
                    form={form}
                    layout="horizontal"
                    {...{
                        labelCol: {
                            span: 4
                        },
                        wrapperCol: {
                            span: 20
                        }
                    }}
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
                        dependencies={['survey', 'startTime']}
                        label={t('startTime')}
                        name={['survey', 'setting', 'startTime']}
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
                        dependencies={['survey', 'expireTime']}
                        label={t('expireTime')}
                        name={['survey', 'setting', 'expireTime']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: t('req_end_time'),
                            }
                        ]}
                    >
                        <DatePicker className="alt-date-picker" showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>

                    <Form.Item
                        label={t('display')}
                        name={['survey', 'isDeleted']}
                        valuePropName="checked"
                        style={{ flexDirection: 'row', alignItems: 'baseline' }}
                    >
                        <Checkbox />
                    </Form.Item>

                    {
                        surveyList.map((survey, index) => {

                            return <ModalWrapper style={{ minHeight: 0, background: '#232323', marginBottom: '0.15rem' }}>
                                <Row>
                                    <Col span={23}>
                                        <div style={{ color: '#f9f9f9' }}>Câu {index}: {survey['content']}</div>
                                        <div style={{ color: '#f9f9f9' }}><span style={{ color: "#c0c0c0" }}>Loại câu hỏi: </span>{survey['typeQuestion']}</div>
                                    </Col>
                                    <Col span={1}>
                                        <Checkbox disabled={idSubject && isEdit ? true : !isEdit ? false : true} checked={surveyQuestion[`${survey?.identity}`] ? true : false} onChange={() => handleChangeSelectSurvey(survey)} />
                                    </Col>
                                </Row>
                            </ModalWrapper>
                        })
                    }




                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="primary" loading={isLoading} htmlType="submit">
                            {t('submit')}</Button>
                    </Form.Item>

                </Form>)}
    </>
    )
}


export default AddSurvey
