import { Row, Col, Table, Input, Button, Form, notification, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next';
import downloadFile from '../../assets/common/core/downloadFile.js';
import { notifyError, notifySuccess } from '../../assets/common/core/notify.js';
import RestClient from '../../utils/restClient.js';
import { useLocation } from 'react-router';
import ModalWrapper from '../../components/basic/modal-wrapper/index.js';
import ModalLoadingLogin from '../login/modal-loading-login.js';
import { ReactComponent as Logout } from '../../assets/images/contents/logout.svg'
import { useHistory } from 'react-router-dom';

const AssignmentCheck = () => {
    const { t } = useTranslation()
    const [form] = Form.useForm();
    const [assignment, setAssignment] = useState({})
    const location = useLocation()
    const history = useHistory()
    const { idSubject, idTodo, idTimeline } = location.state
    const restClient = new RestClient({ token: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState({
        assignment: assignment,
        lstSubmission: assignment.submission,
        editingKey: null,
        isConfirm: false,
    });

    useEffect(() => {
        setIsLoading(true)
        restClient.asyncGet(`/assignment/${idTodo}?idCourse=${idSubject}&idTimeline=${idTimeline}`)
            .then(res => {
                console.log('Assignment', res)
                if (!res.hasError) {
                    setAssignment(get(res, 'data').assignment)
                    setState(prev => ({
                        ...prev,
                        assignment: get(res, 'data').assignment,
                        lstSubmission: get(res, 'data').assignment?.submission,

                    }))
                }
                setIsLoading(false)
            })
    }, [])


    //console.log(assignment);

    const isEditingRow = (record) => {
        return state.editingKey === record._id;
    }
    const editRow = (record) => {
        setState({ ...state, editingKey: record._id });
        form.setFieldsValue({
            grade: record.feedBack ? record.feedBack.grade : 0
        })
    }

    const enterGradeVerify = async (idSubmission) => {
        setState({ ...state, isConfirm: true });
        // const row = await form.validateFields()
        //     .then(value => value).catch(error => {
        //         return null;
        //     });
        // if (!row) { setState({ ...state, isConfirm: false }); return; }
        //console.log('enterGradeVerify', grade)
        let grade = form.getFieldValue('grade');
        if (grade < 0 || grade > 10) { setState({ ...state, isConfirm: false }); return; }
        const data = {
            idCourse: idSubject,
            idTimeline: idTimeline,
            grade: grade
        }
        console.log('enterGradeVerify', data)

        await restClient.asyncPost(`/assignment/${idTodo}/grade/${idSubmission}`, data)
            .then(res => {
                setState({ ...state, isConfirm: false });
                //console.log('enterGradeVerify', res)
                if (!res.hasError) {
                    notifySuccess(t('success'), res.data.message);
                    let newData = state.lstSubmission;
                    const rowIndex = newData.findIndex(value => value._id === idSubmission);
                    //console.log('rowIndex', rowIndex);
                    newData[rowIndex].feedBack = res.data.feedBack;
                    setState({ ...state, editingKey: null, lstSubmission: newData });
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const columns = [
        {
            title: t('code_student'),
            dataIndex: ['student', 'code'],
            key: 'code',
            sorter: (a, b) => parseInt(b.student.code) - parseInt(a.student.code),
            sortDirections: ['descend'],
            sortOrder: 'descend',
        },
        { title: t('fullName'), dataIndex: 'student', key: 'student', render: data => <span>{get(data, 'firstName') + " " + get(data, 'lastName')}</span> },
        {
            title: t('file_submission'), dataIndex: 'file', key: 'file',
            render: data => <span onClick={(e) => { e.preventDefault(); downloadFile(data) }} >{data.name}.{data.type}</span>
        },
        {
            title: t('grade'),
            dataIndex: '',
            render: (data) => {
                if (isEditingRow(data)) {
                    return (
                        <Form.Item
                            name="grade"
                            rules={[
                                {
                                    required: true,
                                    message: t('req_grade')
                                },
                                ({ }) => ({
                                    validator(rule, value) {
                                        if (!value) {
                                            return Promise.resolve();
                                        } else if (value < 0) {
                                            return Promise.reject(t('req_grade_min'));
                                        } else if (value > 10) {
                                            return Promise.reject(t('req_grade_max'));
                                        }
                                    },
                                }),
                            ]}>
                            <Input type="number" min='0' max='10' />
                        </Form.Item>
                    )
                } else {
                    return <span>{data.feedBack ? data.feedBack.grade : t('not_grade')}</span>
                }
            }
        },
        {
            title: t('action'),
            dataIndex: '',
            render: (data) => {
                if (isEditingRow(data)) {
                    return (
                        <div style={{ display: 'flex' }}>
                            <Button
                                onClick={() => enterGradeVerify(data._id)}
                                style={{
                                    marginRight: 8,
                                }}
                                loading={state.isConfirm}
                                type='primary'>{t('submit')}</Button>
                            <Button
                                disabled={state.isConfirm}
                                onClick={() => { setState({ ...state, editingKey: null }) }}
                            >{t('cancel')}</Button>
                        </div>
                    )

                } else {
                    return (
                        <Button
                            onClick={() => editRow(data)}
                        >
                            {t('edit')}
                        </Button>
                    )
                }
            },
        }
    ];


    return (

        <ModalWrapper style={{ margin: '0 auto', width: '90%' }}>

            <Row style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ padding: '25px', fontSize: '2em', color: '#f9f9f9' }}>{get(state.assignment, 'name')}</div>
                <div style={{ textAlign: 'center' }} className="mt-4">
                    <Tooltip title="Exit">
                        <Logout style={{ cursor: 'pointer' }} onClick={() => history.go(-1)} />
                    </Tooltip>
                </div>
            </Row>
            <Row style={{ width: '100%', padding: 10 }}>
                <div style={{ width: '100%', border: '1px solid #cacaca' }} className="style-table">
                    <Form
                        form={form}
                    >
                        <Table
                            columns={columns}
                            scroll={{ y: 240 }}
                            dataSource={state.lstSubmission}
                            rowKey={["student"], ["_id"]}
                            pagination={false}
                            bordered
                        />
                    </Form>
                </div>
            </Row>

            <ModalLoadingLogin visible={isLoading} content={t('loading_survey')} />
        </ModalWrapper>
    )
}

export default AssignmentCheck
