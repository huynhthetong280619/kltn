import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Skeleton } from 'antd';
// import Loading from '../../loading/loading.jsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notifyError } from '../../assets/common/core/notify.js';
import RestClient from '../../utils/restClient';
const { Option } = Select;
const { TextArea } = Input;

const AddQuiz = ({ timelinesList, quizList, createQuiz, updateQuiz, idSubject, idTimeline, idExam }) => {

    const [form] = Form.useForm();

    const [quizBank, setQuizBank] = useState({});

    const [exam, setExam] = useState(null);
    const [quantityBankSelect, setQuantityBankSelect] = useState({})

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
        console.log('Exam id: ', idExam)
        if (idExam) {
            restClient.asyncGet(`/exam/${idExam}/update/?idCourse=${idSubject}&idTimeline=${idTimeline}`)
                .then(res => {
                    if (!res.hasError) {
                        const ex = res.data.exam;
                        console.log('Exam', ex);
                        setExam({
                            ...ex,
                            setting: {
                                ...ex?.setting,
                                startTime: moment(ex.setting.startTime),
                                expireTime: moment(ex.setting.expireTime),
                            }

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
        console.log(ex)
        const data = {
            idCourse: idSubject,
            idTimeline: idTimelineAdd,
            data: ex
        }
        setLoading(true);
        console.log('data', JSON.stringify(data))
        await restClient.asyncPost('/exam', data)
            .then(res => {
                console.log('handleCreateExam', res)
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
            idCourse: idSubject,
            idTimeline: idTimelineUpdate,
            data: ex
        }
        setLoading(true);
        await restClient.asyncPut(`/exam/${idExam}`, data)
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
        console.log('fieldsValue', fieldsValue)
        const data = {
            ...fieldsValue.exam,
            isDeleted: !fieldsValue.exam.isDeleted,
            // startTime: formatTime(fieldsValue.exam.startTime),
            // expireTime: formatTime(fieldsValue.exam.expireTime)
        };

        createQuiz({ exam: data, idTimeline: fieldsValue.idTimeline });
        if (!idExam) {
            handleCreateExam(data, fieldsValue.idTimeline);
        } else {
            handleUpdateExam(data, idTimeline);
        }
    }

    const handleChangeQuizBank = (key, value) => {
        const data = quizList.find(quiz => quiz._id === value);
        setQuizBank({ ...quizBank, [`${key}`]: data });
    }


    console.log('quizList', quizList)

    return (
        <>
            {
                (idExam && !exam) ?
                    <Skeleton />
                    : (<Form
                        onFinish={onFinish}
                        form={form}
                        layout="horizontal"
                        {...{
                            labelCol: {
                                span: 4,
                            },
                            wrapperCol: {
                                span: 20,
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

                        <Form.Item
                            label={t('startTime')}
                            name={['exam', 'setting', 'startTime']}
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
                            name={['exam', 'setting', 'expireTime']}
                            hasFeedback
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

                        <Form.List name={['exam', 'setting', 'questionnaires']}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        <div>
                                            <Form.Item
                                                {...restField}
                                                label={t('code_quiz_bank') + ' ' + key}
                                                name={[fieldKey, 'id']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('req_code_quiz'),
                                                    }
                                                ]}
                                                hasFeedback
                                            >
                                                <Select dropdownClassName="ant-customize-dropdown" onChange={(value) => handleChangeQuizBank(fieldKey, value)} >
                                                    {
                                                        quizList.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <Form.Item className="customize-add-form" wrapperCol={{ span: 24 }}>
                                                <Form.Item
                                                    {...restField}
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 20 }}
                                                    label={t('quantity_question')}
                                                    name={[fieldKey, 'questionCount']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: t('req_qty_question'),
                                                        }
                                                    ]}
                                                    hasFeedback>
                                                    {/* <InputNumber min={1} max={quizBank ? quizBank.questions : 30} /> */}
                                                    <Select dropdownClassName="ant-customize-dropdown" onChange={(value) => setQuantityBankSelect({ ...quantityBankSelect, [`${fieldKey}`]: value })} >
                                                        {
                                                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => (<Option value={q} key={q}>{q}</Option>))
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button onClick={() => remove(name)}>Xóa</Button>
                                                </Form.Item>
                                            </Form.Item>

                                        </div>
                                    ))}
                                    <Form.Item wrapperCol={{ wrapperCol: 20, offset: 4 }}>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            {t('add_quiz_bank')}
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item
                            label={t('timeTodo')}
                            name={['exam', 'setting', 'timeToDo']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_time_take_quiz'),
                                }
                            ]}
                            hasFeedback>
                            <InputNumber min={1} max={180}
                                formatter={value => `${value} ${t('minutes')}`}
                                parser={value => value.replace(` ${t('minutes')}`, '')} />

                        </Form.Item>

                        <Form.Item
                            label={t('quantity_join')}
                            name={['exam', 'setting', 'attemptCount']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_count_attempt'),
                                }
                            ]}

                            hasFeedback>
                            {/* <InputNumber min={1} max={10}
                                    formatter={value => `${value} ${t('times')}`}
                                    parser={value => value.replace(` ${t('times')}`, '')}
                                /> */}
                            <Select dropdownClassName="ant-customize-dropdown" onChange={handleChangeQuizBank} >
                                {
                                    [1, 2, 3, 5, 7, 10, 100].map(q => (<Option value={q} key={q}>{q}</Option>))
                                }
                            </Select>

                        </Form.Item>


                        <Form.Item
                            label={t('display')}
                            name={['exam', 'isDeleted']}
                            valuePropName="checked"
                            style={{ flexDirection: 'row', alignItems: 'baseline' }}
                        >
                            <Checkbox />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button type="primary" loading={isLoading} htmlType="submit" style={{ marginTop: 0 }}>
                                {t('submit')}
                            </Button>
                        </Form.Item>

                    </Form>)}
        </>
    )
}


export default AddQuiz
