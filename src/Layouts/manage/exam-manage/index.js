import React, { useState } from 'react'
import { Row, Table, Select, Tooltip } from 'antd'

import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import { CSVLink } from "react-csv";
import excel from '../../../assets/images/contents/excel.png';

const { Option } = Select
const ExamManage = ({ lstSubmissionCore }) => {

    const { t } = useTranslation()
    const [test, setTest] = useState(lstSubmissionCore[0])

    const handleSelectTest = (e) => {
        //console.log('idTest', e);
        const result = lstSubmissionCore.find(item => get(item, '_id') === e);
        setTest(result);
    }

    const columns = [
        {
            title: t('code_student'),
            dataIndex: "student",
            key: "student",
            render: data => <span>{data.code}</span>
        },
        {
            title: t('firstName'),
            dataIndex: "student",
            key: "firstName",
            render: data => <span>{data.firstName}</span>
        },
        {
            title: t('lastName'),
            dataIndex: "student",
            key: "lastName",
            render: data => <span>{data.lastName}</span>
        },
        {
            title: t('grade'),
            dataIndex: "grade",
            key: '',
            render: (text, data) => data.grade !== null ? data.grade : (
                data.status === 'notSubmit' ? <span style={{ color: '#ff4000', fontStyle: 'italic' }}>Chưa nộp bài</span>
                    : <span style={{ color: '#ff4000', fontStyle: 'italic' }}>Chưa chấm điểm</span>

            )
        }
    ]

    const headersCSV = [
        { label: t('code_student'), key: 'student.code' },
        { label: t('firstName'), key: 'student.firstName' },
        { label: t('lastName'), key: 'student.lastName' },
        { label: t('grade'), key: 'grade' }
    ]

    console.log('lstSubmissionCore', lstSubmissionCore, test?.submissions)
    return (<>
        <Row style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }} className="mb-4">
            <div >
                <Select dropdownClassName="ant-customize-dropdown" defaultValue={test?._id} style={{ width: 200 }} onChange={e => handleSelectTest(e)}>
                    {
                        (lstSubmissionCore).map(q => (<Option value={q._id} key={q._id} style={{ width: '100%' }}>{q.name}</Option>))
                    }
                </Select>
            </div>
            <div>
                <Tooltip title="Xuất file excel">
                    <CSVLink
                        filename={test?.name + ".csv"}
                        data={test?.submissions}
                        headers={headersCSV}
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
        </Row >
        <Row style={{ border: '2px solid #cacaca' }} className="style-table">
            <Table pagination={false} columns={columns} dataSource={test?.submissions} style={{ width: '100%' }} />
        </Row>
    </>)
}

export default ExamManage