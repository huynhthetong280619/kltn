import { useState, useEffect } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import formatTime from '../../assets/common/core/formatTime';
import { Input, Select, Button, Checkbox, Form, DatePicker, Skeleton } from 'antd'
import downloadFile from '../../assets/common/core/downloadFile.js';
import { notifyError } from '../../assets/common/core/notify.js';
// import Loading from '../../loading/loading.jsx';
import moment from 'moment'
import word from '../../assets/images/contents/word.png'
import pdf from '../../assets/images/contents/pdf.png'
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
            restClient.asyncGet(`/assignment/${idAssignment}/update/?idSubject=${idSubject}&idTimeline=${idTimeline}`)
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
            idSubject: idSubject,
            idTimeline: idTimelineAdd,
            data: assignment
        }
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
            idSubject: idSubject,
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item
                                label={t('startTime')}
                                name={['assignment', 'setting', 'startTime']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_begin_time'),
                                    }
                                ]}
                                style={{ width: '30%' }}
                                hasFeedback>
                                <DatePicker className="alt-date-picker" showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>

                            <Form.Item
                                dependencies={['assignment', 'setting', 'startTime']}
                                label={t('expireTime')}
                                name={['assignment', 'setting', 'expireTime']}
                                style={{ width: '30%' }}
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
                                style={{ width: '30%' }}
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
                        </div>




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
                                        <a style={{ marginLeft: 10 }}>
                                            <span onClick={() => downloadFile(f)}>{f.name}.{f.type}</span>
                                        </a>
                                    </span>
                                </Form.Item>
                            })
                            )}

                        <Form.Item
                            label={t('addFileAttach')}
                        >
                            <Input type="file" style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
                        </Form.Item>
                        <div style={{ display: 'flex' }}>
                            <Form.Item
                                label={t('isOverDue')}
                                name={['assignment', 'setting', 'isOverDue']}
                                valuePropName="checked"
                                style={{ flexDirection: 'row', width: '49%', alignItems: 'baseline' }}
                            >
                                <Checkbox onChange={e => handleOnchangeOverDue(e)} />
                            </Form.Item>

                            <Form.Item
                                label={t('display')}
                                name={['assignment', 'isDeleted']}
                                valuePropName="checked"
                                style={{ flexDirection: 'row', width: '49%', alignItems: 'baseline' }}
                            >
                                <Checkbox />
                            </Form.Item>
                        </div>
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


                        <Form.Item >
                            <Button type="primary" loading={isLoading} htmlType="submit" className="lms-btn">
                                {t('submit')}</Button>
                        </Form.Item>

                    </Form>)}
        </>
    )
}


export default withTranslation('translations')(AddAssignment)
