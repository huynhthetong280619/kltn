import { Button, Drawer, Form, Input, Row, Table, Tooltip } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import { useTranslation } from 'react-i18next';
import { notifyError, notifySuccess } from '../../../assets/common/core/notify.js';
import excel from '../../../assets/images/contents/excel.png';
import RestClient from '../../../utils/restClient';


const StudentManage = ({ idSubject }) => {

    const { t } = useTranslation()
    const [list, setList] = useState([]);

    const [visibleDrawer, setVisible] = useState(false);
    const restClient = new RestClient({ token: '' })

    const [form] = Form.useForm();

    const [isLoadingDelete, setLoadingDelete] = useState(false);
    const [idCurrentStudent, setIdStudent] = useState(null);

    const [isLoadingAdd, setLoadingAdd] = useState(false);

    useEffect(() => {
        restClient.asyncGet(`/course/${idSubject}/students`)
            .then(res => {
                console.log('student', res)
                if (!res.hasError) {
                    setList(get(res, 'data').students)
                }
            })
    }, [])

    const handleDeleteStudent = async (record) => {
        setLoadingDelete(true);
        setIdStudent(record._id)
        await restClient.asyncDelete(`/course/${idSubject}/remove-student`, {
            idStudent: record._id
        })
            .then(res => {
                setLoadingDelete(false);
                setIdStudent(null);
                if (!res.hasError) {
                    notifySuccess('Thành công!', res.data.message);
                    const res = list.filter(item => item._id !== record._id)
                    setList(res);
                } else {
                    notifyError('Thất bại!', res.data.message);
                }
            })
    }

    const onCloseDrawer = () => {
        setVisible(false);
        form.resetFields();
    }

    const showDrawer = () => {
        setVisible(true);
    }

    const addStudentToClass = async (codeStudent) => {
        setLoadingAdd(true);
        await restClient.asyncPost(`/course/${idSubject}/add-student`,
            { idStudent: codeStudent })
            .then(res => {
                console.log('student ', res)
                setLoadingAdd(false);
                if (!res.hasError) {
                    notifySuccess('Thành công!', res.data.message);
                    setList([...list, res.data.student]);
                    onCloseDrawer();
                } else {
                    notifyError('Thất bại!', res.data.message);
                }
            })
    }


    const onFinish = (values) => {
        addStudentToClass(values.codeStudent);
    }

    const isFocusDelete = (idFocus) => {
        return idFocus === idCurrentStudent;
    }


    const columns = [
        {
            title: t('avatar'),
            dataIndex: 'urlAvatar',
            key: 'urlAvatar',
            render: (data) => <img src={data} width="50px" />
        },
        {
            title: t('code_student'),
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: t('email_address'),
            dataIndex: 'emailAddress',
            key: 'emailAddress'
        },
        {
            title: t('firstName'),
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: t('lastName'),
            dataIndex: 'lastName',
            key: 'lastName',
        },


        {
            title: t('action'),
            key: 'action',
            render: (text, record) => (
                <Button
                    type='primary'
                    danger
                    loading={isLoadingDelete && isFocusDelete(record._id)}
                    onClick={() => handleDeleteStudent(record)}
                >{t('delete')}</Button>
            ),
        },
    ];

    const headersCSVClass = [
        { label: t('code_student'), key: 'code' },
        { label: t('Email'), key: 'emailAddress' },
        { label: t('firstName'), key: 'firstName' },
        { label: t('lastName'), key: 'lastName' },
    ]

    console.log('List student', list)
    return (
        <>
            <Drawer
                title={t('add_student')}
                placement="right"
                closable={false}
                onClose={() => onCloseDrawer()}
                width={440}
                visible={visibleDrawer}
            >
                <Form onFinish={onFinish}
                    form={form}>
                    <Form.Item label={t('code_student')} name="codeStudent" rules={[
                        {
                            required: true,
                            message: t('req_code_student'),
                        },
                    ]}>
                        <Input type="text" placeholder="Student code..." style={{
                            marginBottom: 10
                        }} />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={isLoadingAdd} type="primary" htmlType="submit" > {t('add_student')} </Button>
                    </Form.Item>
                </Form>

            </Drawer>
            <div>
                <Row style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex' }}>
                            <Tooltip title="Xuất file excel">
                                <CSVLink
                                    filename={"Danh Sách lớp.csv"}
                                    data={list}
                                    headers={headersCSVClass}
                                    target="_blank"
                                    style={{ color: "inherit", marginLeft: 5 }}
                                >
                                    <span
                                        id="Tooltip_history_csv"
                                        className="left5"
                                        placement="top"
                                        style={{ padding: 0, marginTop: 3 }}
                                    >
                                        <img src={excel} width={20} />
                                    </span>
                                </CSVLink>
                            </Tooltip>
                        </div>
                        <Button type="primary" className="lms-btn" style={{ marginTop: 0 }} onClick={() => showDrawer()}>{t('add_student')}</Button>
                    </div>

                </Row>
                <Row style={{ width: '100%' }} className="style-table">
                    <Table columns={columns} dataSource={list} style={{ width: '100%' }} pagination={false} />
                </Row>
            </div>
        </>
    )
}

export default StudentManage