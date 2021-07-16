import { Button, Input, Row, Select, Table, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ModalWrapper from '../../components/basic/modal-wrapper'

import * as notify from "../../assets/common/core/notify";

const { Option } = Select;
const { Text } = Typography;



const SearchCourse = ({ isTeacherFlag, restClientApi, addCourse }) => {
    const { t } = useTranslation()

    const [isLoading, setIsLoading] = useState(false)

    const [curriculums, setCurriculums] = useState([]);

    const [isLoadingCourses, setLoadingCourses] = useState(false);

    const [courses, setCourses] = useState([]);

    const [totalRecords, setTotalRecords] = useState(0);

    const [searchText, setSearchText] = useState("");

    const [idCurriculum, setIdCurriculum] = useState();

    const [pageConfig, setPageConfig] = useState({
        page: 1,
        pageSize: 20
    });

    const pagination = {
        defaultCurrent: pageConfig.page,
        defaultPageSize: pageConfig.pageSize,
        showQuickJumper: true,
        total: totalRecords,
        showTotal: total => `Total ${total} records`,
    }

    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        setPageConfig({ page: current, pageSize });
    }

    useEffect(() => {
        if (idCurriculum) {
            getCourses(pageConfig.page, pageConfig.pageSize, searchText, idCurriculum);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageConfig]);


    const getCourses = (page, pageSize, name, idCurriculum) => {
        setLoadingCourses(true)
        restClientApi.asyncPost('/course/filter', {
            idCurriculum,
            name,
            page,
            pageSize
        })
            .then(res => {
                if (!res.hasError) {
                    setCourses(res.data.courses);
                    setTotalRecords(res.data.total)
                }
                setLoadingCourses(false)
            })
    }
    const handleSearchCourses = () => {
        console.log(searchText, idCurriculum)
        getCourses(1, 20, searchText, idCurriculum);
    }

    const handleEnrollCourses = (idCourse) => {
        setIsLoading(true)
        restClientApi.asyncPost(`/course/${idCourse}/enroll`, {})
            .then(res => {
                if (!res.hasError) {
                    notify.notifySuccess(res.data.error);
                    addCourse(courses.find(value => value._id === idCourse))
                    setCourses(courses.filter(value => value._id !== idCourse));
                    setTotalRecords(totalRecords - 1);
                } else {
                    notify.notifyError(res.data.message)
                }
                setIsLoading(false)
            })

    }

    useEffect(() => {
        restClientApi.asyncGet('/curriculum')
            .then(res => {
                if (!res.hasError) {
                    setCurriculums(res.data.curriculums);
                }
            })
    }, [])

    const columnsCourses = [
        {
            title: t('STT'),
            render: (text, record, index) => {
                return (pageConfig.page - 1) * pageConfig.pageSize + index + 1
            },
        },
        {
            title: t('Tên môn học'),
            dataIndex: "name",
            key: "name"

        },
        {
            title: t('Giáo viên'),
            dataIndex: "teacher",
            key: "teacher",
            render: (text, record) => {
                return (
                    <Text strong > {record.teacher.firstName + " " + record.teacher.lastName}</Text>
                )
            },
        },
        {
            title: t('Tác vụ'),
            dataIndex: "action",
            key: "action",
            render: (text, record) => <div>
                <Button type="primary"
                    loading={isLoading}
                    onClick={() => {
                        handleEnrollCourses(record._id);
                    }}>{t('enroll')}</Button>
            </div>
        }
    ]
    return <>
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <Input.Group compact>
                <Select
                    dropdownClassName="ant-customize-dropdown"
                    style={{ width: '186px' }}
                    value={idCurriculum}
                    onChange={(e) => setIdCurriculum(e)}
                >
                    {curriculums.map(cur => <Option
                        key={cur._id}
                        value={cur._id}>
                        {cur.name}
                    </Option>)}
                </Select>
                <Input style={{ width: '50%' }}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={t('content_search_guide')}

                />
                <Button
                    loading={isLoadingCourses}
                    onClick={handleSearchCourses}
                >Search</Button>
            </Input.Group>

        </div>
        <ModalWrapper>
            <Row style={{ overflow: 'auto' }} className="style-table">
                <Table
                    pagination={pagination}
                    columns={columnsCourses}
                    dataSource={courses}
                    style={{ width: '100%' }}
                    scroll={{ y: 240, x: 700 }}
                    onChange={handleTableChange}
                />
            </Row>
        </ModalWrapper>
    </>
}

export default SearchCourse