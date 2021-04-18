import { useState, useEffect } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
// import Loading from '../../loading/loading.jsx';
import moment from 'moment'
import { notifyError } from '../../assets/common/core/notify.js';
import { Input, Select, Button, InputNumber, DatePicker, Checkbox, Form } from 'antd'
import RestClient from '../../utils/restClient';
import formatTime from '../../assets/common/core/formatTime.js';
const { Option } = Select;
const { TextArea } = Input;

const AddQuiz = ({ timelinesList, quizList, createQuiz, updateQuiz, idSubject, idTimeline, idExam, token }) => {

    const [form] = Form.useForm();

    const [quizBank, setQuizBank] = useState(quizList[0]);

    const [exam, setExam] = useState(null);

    const [isLoading, setLoading] = useState(false);
    const restClient = new RestClient({ token: '' })
    const { t } = useTranslation()

    useEffect(() => {
        if (exam) {
            //console.log(exam);
            form.setFieldsValue({
                idTimeline: idTimeline,
                exam: { ...exam, isDeleted: !exam.isDeleted }
            })
        }
    }, [exam])

    useEffect(() => {
        if (idExam) {
            restClient.asyncGet(`/exam/${idExam}/update/?idSubject=${idSubject}&idTimeline=${idTimeline}`, token)
                .then(res => {
                    if (!res.hasError) {
                        const ex = res.data.exam;
                        //console.log('Exam', ex);
                        setExam({
                            ...ex,
                            startTime: moment(ex.startTime),
                            expireTime: moment(ex.expireTime),
                        });
                    } else {
                        notifyError(t('failure'), res.data.message);
                    }
                })

        } else {

            const object = {
                setting: {
                    code: quizBank ? quizBank._id : null,
                    questionCount: 1,
                    attemptCount: 3,
                    timeToDo: 15,
                },
                isDeleted: !false,
            }
            form.setFieldsValue({
                idTimeline: timelinesList[0] ? timelinesList[0]._id : null,
                exam: object
            })
        }
    }, []);

    const handleCreateExam = async (ex, idTimelineAdd) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineAdd,
            data: ex
        }
        setLoading(true);
        await restClient.asyncPost('/exam', data, token)
            .then(res => {
                //console.log('handleCreateExam', res)
                setLoading(false);
                if (!res.hasError) {
                    createQuiz({ exam: res.data.exam, idTimeline: idTimelineAdd })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const handleUpdateExam = async (ex, idTimelineUpdate) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineUpdate,
            data: ex
        }
        setLoading(true);
        await restClient.asyncPut(`/exam/${idExam}`, data, token)
            .then(res => {
                //console.log('handleUpdateExam', res)
                setLoading(false);
                if (!res.hasError) {
                    updateQuiz({ exam: res.data.exam, idTimeline: idTimelineUpdate })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const onFinish = (fieldsValue) => {
        const data = {
            ...fieldsValue.exam,
            isDeleted: !fieldsValue.exam.isDeleted,
            startTime: formatTime(fieldsValue.exam.startTime),
            expireTime: formatTime(fieldsValue.exam.expireTime)
        };
        //console.log(data);
        //createQuiz({ quiz: data, idTimeline: fieldsValue.idTimeline });
        if (!idExam) {
            handleCreateExam(data, fieldsValue.idTimeline);
        } else {
            handleUpdateExam(data, idTimeline);
        }
    }

    const handleChangeQuizBank = value => {
        const data = quizList.find(quiz => quiz._id === value);
        setQuizBank(data);
    }



    return (
        <>
            {
                (idExam && !exam) ?
                    <div>Loading</div>
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
                            <Select dropdownClassName="ant-customize-dropdown" disabled={idExam || false}>
                                {
                                    timelinesList.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('name')}
                            name={['exam', 'name']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_title_quiz')
                                }
                            ]}
                            hasFeedback>
                            <Input id="antd-customize" className="ant-input-customize" placeholder={t('name_of_quiz')} />
                        </Form.Item>

                        <Form.Item
                            label={t('content')}
                            name={['exam', 'content']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_quiz_content'),
                                }
                            ]}
                            hasFeedback>
                            <TextArea
                                placeholder={t('content_of_quiz')}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item
                                label={t('startTime')}
                                name={['exam', 'startTime']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_begin_time'),
                                    }
                                ]}
                                hasFeedback>
                                <DatePicker className="alt-date-picker" showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>

                            <Form.Item
                                dependencies={['exam', 'startTime']}
                                label={t('expireTime')}
                                name={['exam', 'expireTime']}
                                hasFeedback
                                style={{ width: '30%' }}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_end_time'),
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || value.isAfter(getFieldValue(['exam', 'startTime']))) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(t('condition_start_end'));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker className="alt-date-picker" showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>

                            <Form.Item
                                label={t('questionCount')}
                                name={['exam', 'setting', 'questionCount']}
                                style={{ width: '30%' }}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_qty_question'),
                                    }
                                ]}
                                hasFeedback>
                                <InputNumber min={1} max={quizBank ? quizBank.questions : 30} />

                            </Form.Item>
                        </div>
                        <Form.Item
                            label={t('code_quiz_bank')}
                            name={['exam', 'setting', 'code']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_code_quiz'),
                                }
                            ]}
                            hasFeedback
                        >
                            <Select dropdownClassName="ant-customize-dropdown" onChange={handleChangeQuizBank} >
                                {
                                    quizList.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                                }
                            </Select>
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item
                                label={t('timeTodo')}
                                name={['exam', 'setting', 'timeToDo']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_time_take_quiz'),
                                    }
                                ]}
                                style={{ width: '49%' }}

                                hasFeedback>
                                <InputNumber min={1} max={180}
                                    formatter={value => `${value} ${t('minutes')}`}
                                    parser={value => value.replace(` ${t('minutes')}`, '')} />

                            </Form.Item>

                            <Form.Item
                                label={t('attemptQuantity')}
                                name={['exam', 'setting', 'attemptCount']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_count_attempt'),
                                    }
                                ]}
                                style={{ width: '49%' }}

                                hasFeedback>
                                <InputNumber min={1} max={10}
                                    formatter={value => `${value} ${t('times')}`}
                                    parser={value => value.replace(` ${t('times')}`, '')}
                                />

                            </Form.Item>

                            

                        </div>



                        <Form.Item
                                label={t('display')}
                                name={['exam', 'isDeleted']}
                                valuePropName="checked"
                                style={{ flexDirection: 'row', alignItems: 'baseline'}}
                            >
                                <Checkbox />
                            </Form.Item>

                        <Form.Item>
                            <Button type="primary" loading={isLoading} htmlType="submit" className="lms-btn">
                                {t('submit')}</Button>
                        </Form.Item>

                    </Form>)}
        </>
    )
}


export default withTranslation('translations')(AddQuiz)
