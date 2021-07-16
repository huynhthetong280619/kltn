import { Button, Input, Row, Select, Table } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModalWrapper from '../../components/basic/modal-wrapper'

const SearchCourse = ({ keySearch, setKeySearch, listSearch, setListSearch }) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)

    const columnsCourses = [
        {
            title: t('STT'),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t('Tên môn học'),
            dataIndex: "grade",
            key: "grade"

        },
        {
            title: t('Giáo viên'),
            dataIndex: "grade",
            key: "grade"
        },
        {
            title: t('Tác vụ'),
            dataIndex: "grade",
            key: "grade",
            render: () => <div>
                <Button type="primary" loading={isLoading} onClick={() => {
                    setIsLoading(true);
                }}>{t('enroll')}</Button>
            </div>
        }
    ]
    return <>
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <Input.Group compact>
                <Select dropdownClassName="ant-customize-dropdown" style={{ width: '186px' }} value={keySearch} onChange={(e) => setKeySearch(e)}>
                    <Select.Option value="1">{t('Chương trình đào tạo')}</Select.Option>
                    <Select.Option value="2">{t('Môn học')}</Select.Option>
                </Select>
                <Input style={{ width: '50%' }} placeholder={t('content_search_guide')} />
            </Input.Group>
        </div>
        <ModalWrapper>
            <Row style={{ overflow: 'auto' }} className="style-table">
                <Table pagination={true} columns={columnsCourses} dataSource={listSearch} style={{ width: '100%' }} scroll={{ y: 240, x: 700 }} />
            </Row>
        </ModalWrapper>
    </>
}

export default SearchCourse