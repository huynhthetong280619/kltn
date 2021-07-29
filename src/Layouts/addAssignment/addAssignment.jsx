import { Button, Checkbox, DatePicker, Form, Input, Select, Skeleton } from 'antd';
// import Loading from '../../loading/loading.jsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import downloadFile from '../../assets/common/core/downloadFile.js';
import formatTime from '../../assets/common/core/formatTime';
import { notifyError } from '../../assets/common/core/notify.js';
import pdf from '../../assets/images/contents/pdf.png';
import word from '../../assets/images/contents/word.png';
import RestClient from '../../utils/restClient';
const { Option } = Select;
const { TextArea } = Input;

const AddAssignment = ({ timelinesList, createAssignment, updateAssignment, idSubject, idTimeline, idAssignment }) => {

    const { t } = useTranslation()
    const [form] = Form.useForm();
    const [isOverDue, setIsOverDue] = useState(false);
    const [fileAttach, setFileAttach] = useState(null);

    const [assignment, setAssignment] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const restClient = new RestClient({ token: '' })




    useEffect(() => {
        if (assignment) {
            setIsOverDue(assignment.setting.isOverDue);
            form.setFieldsValue({
                idTimeline: idTimeline,
                assignment: { ...assignment, isDeleted: !assignment.isDeleted }
            })
        }
    }, [assignment])

    useEffect(() => {
        console.log('timelineList', timelinesList)

        if (idAssignment) {
            restClient.asyncGet(`/assignment/${idAssignment}/update/?idCourse=${idSubject}&idTimeline=${idTimeline}`)
                .then(res => {
                    if (!res.hasError) {
                        const assign = res.data.assignment;
                        setAssignment({
                            ...assign,
                            setting: {
                                ...assign.setting,
                                startTime: moment(assign.setting.startTime),
                                expireTime: moment(assign.setting.expireTime),
                                overDueDate: assign.setting.isOverDue ? moment(assign.setting.overDueDate) : null,
                            },
                        });
                    } else {
                        notifyError(t('failure'), res.data.message);
                    }
                })

        } else {
            const object = {
                setting: {
                    isOverDue: false,
                    fileSize: 5,
                },
                isDeleted: !false,
            }
            form.setFieldsValue({
                idTimeline: timelinesList[0] ? timelinesList[0]._id : null,
                assignment: object
            })
        }
    }, []);

    const handleOnchangeOverDue = (e) => {
        setIsOverDue(e.target.checked);
    }

    const handleProcessFile = (e) => {
        setFileAttach(e.target.files[0]);

    }

    const handleCreateAssignment = async (assignment, idTimelineAdd) => {
        const data = {
            idCourse: idSubject,
            idTimeline: idTimelineAdd,
            data: assignment
        }
        console.log(JSON.stringify(data))
        setLoading(true);
        await restClient.asyncPost('/assignment', data)
            .then(res => {
                //console.log('handleCreateAssignment', res)
                setLoading(false);
                if (!res.hasError) {
                    createAssignment({ assignment: res.data.assignment, idTimeline: idTimelineAdd })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const handleUpdateAssignment = async (assignment, idTimelineUpdate) => {
        const data = {
            idCourse: idSubject,
            idTimeline: idTimelineUpdate,
            data: assignment
        }
        setLoading(true);
        await restClient.asyncPut(`/assignment/${idAssignment}`, data)
            .then(res => {
                //console.log('handleUpdateAssignment', res)
                setLoading(false);
                if (!res.hasError) {
                    updateAssignment({ assignment: res.data.assignment, idTimeline: idTimelineUpdate })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const onFinish = async (fieldsValue) => {
        setLoading(true);
        //console.log('fileAttach', fileAttach);
        const assign = {
            ...fieldsValue.assignment,
            isDeleted: !fieldsValue.assignment.isDeleted,
        };
        const setting = {
            ...assign.setting,
            startTime: formatTime(assign.setting.startTime),
            expireTime: formatTime(assign.setting.expireTime),
            overDueDate: assign.setting.isOverDue ? formatTime(assign.setting.overDueDate) : null
        };
        //console.log('setting', setting);
        let file = []
        let data = null;
        if (fileAttach) {
            const objectFile = await restClient.asyncUploadFile(fileAttach);
            if (objectFile) {
                file.push(objectFile);
                data = {
                    name: assign.name,
                    content: assign.content,
                    setting: setting,
                    isDeleted: assign.isDeleted,
                    file: file
                }
                if (!idAssignment) {
                    handleCreateAssignment(data, fieldsValue.idTimeline);
                } else {
                    data = { ...data, file: assignment.attachments.concat(file) }
                    handleUpdateAssignment(data, idTimeline)
                }
            } else {
                setLoading(false);
                notifyError(t('failure'), t('err_upload_file'));
            }

        } else {
            data = {
                name: assign.name,
                content: assign.content,
                setting: setting,
                isDeleted: assign.isDeleted,
            }
            if (!idAssignment) {
                handleCreateAssignment(data, fieldsValue.idTimeline);
            } else {
                handleUpdateAssignment(data, idTimeline)
            }
        }
    }


    return (
        <>
            {
                (idAssignment && !assignment) ?
                    // <Loading />
                    <Skeleton />
                    : (<Form
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
                        form={form}
                        layout="horizontal"
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
                            <Select dropdownClassName="ant-customize-dropdown" disabled={idAssignment || null}>
                                {
                                    timelinesList.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('name')}
                            name={['assignment', 'name']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_title_assignment')
                                }
                            ]}
                            hasFeedback>
                            <Input placeholder={t('name_of_assign')} id="antd-customize" className="ant-input-customize" />
                        </Form.Item>

                        <Form.Item
                            label={t('content')}
                            name={['assignment', 'content']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_assign_requirement')
                                }
                            ]}
                            hasFeedback
                        >
                            <TextArea
                                id="antd-customize" className="ant-input-customize"
                                placeholder={t('content_req_assign')}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('startTime')}
                            name={['assignment', 'setting', 'startTime']}
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
                            dependencies={['assignment', 'setting', 'startTime']}
                            label={t('expireTime')}
                            name={['assignment', 'setting', 'expireTime']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: t('req_end_time'),
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || value.isAfter(getFieldValue(['assignment', 'setting', 'startTime']))) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(t('condition_start_end'));
                                        }
                                    },
                                }),
                            ]}
                        >
                            <DatePicker className="alt-date-picker" showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>

                        <Form.Item
                            label={t('fileSize')}
                            name={['assignment', 'setting', 'fileSize']}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_size_file')
                                }
                            ]}
                            hasFeedback>
                            <Select dropdownClassName="ant-customize-dropdown">
                                <Option value="5">5</Option>
                                <Option value="10">10</Option>
                                <Option value="15">15</Option>
                                <Option value="20">20</Option>
                            </Select>
                        </Form.Item>




                        {assignment &&
                            (assignment.attachments.map(f => {
                                return <Form.Item
                                    label={t('fileAttach')}>
                                    <span style={{
                                        verticalAlign: '-webkit-baseline-middle',
                                        border: '1px dashed #cacaca',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                    }}>
                                        {f.type.includes('doc')
                                            ? <img src={word} width={20} /> : <img src={pdf} width={20} />}
                                        <span style={{ marginLeft: 10 }} onClick={e => e.preventDefault()}>
                                            <span onClick={() => downloadFile(f)}>{f.name}.{f.type}</span>
                                        </span>
                                    </span>
                                </Form.Item>
                            })
                            )}

                        <Form.Item
                            label={t('addFileAttach')}
                        >
                            <Input type="file" style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
                        </Form.Item>
                        <Form.Item
                            label={t('isOverDue')}
                            name={['assignment', 'setting', 'isOverDue']}
                            valuePropName="checked"
                        >
                            <Checkbox onChange={e => handleOnchangeOverDue(e)} />
                        </Form.Item>

                        {isOverDue && (
                            <Form.Item
                                label={t('overDueDate')}
                                name={['assignment', 'setting', 'overDueDate']}
                                hasFeedback
                                dependencies={['assignment', 'setting', 'expireTime']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_over_time'),
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || value.isAfter(getFieldValue(['assignment', 'setting', 'expireTime']))) {
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject(t('condition_end_over'));
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker className="alt-date-picker" showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                        )}


                        <Form.Item
                            label={t('display')}
                            name={['assignment', 'isDeleted']}
                            valuePropName="checked"
                        >
                            <Checkbox />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button type="primary" loading={isLoading} htmlType="submit" >
                                {t('submit')}</Button>
                        </Form.Item>

                    </Form>)}
        </>
    )
}


export default AddAssignment
