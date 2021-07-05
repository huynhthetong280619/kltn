import { Row, Table, Typography } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import statisticsPoint from '../../assets/images/contents/statistics-point.png';
import ModalWrapper from '../../components/basic/modal-wrapper';
import RestClient from '../../utils/restClient';
const { Text } = Typography;

const ManageScore = () => {

    const { t } = useTranslation()
    const location = useLocation()
    const { idSubject } = location.state;
    const [lstSubmissionCore, setLstSubmissionCore] = useState([])
    const restClient = new RestClient({ token: '' })


    useEffect(() => {
        //console.log('componentDidMount', this.props.lstSubmissionCore)
        // this.setState({
        //     lstSubmissionCore: this.props.lstSubmissionCore,
        // })
        restClient.asyncGet(`/course/${idSubject}/score`)
            .then(res => {
                console.log(res);
                if (!res.hasError) {
                    setLstSubmissionCore(get(res, 'data')?.transcript)
                }
            })
    }, [])


    const columnsGrade = [
        {
            title: t('test'),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t('grade'),
            dataIndex: "grade",
            key: "grade",
            render: (data, record) => (
                (data !== null) ? data :
                    (<>
                        {  record.status === 'notSubmit' && <Text type='danger'>{t('status_not_submit')}</Text>}
                        {  record.status === 'notGrade' && <Text type='warning'>{t('status_not_graded')}</Text>}
                    </>
                    )
            )
        }
    ]

    return <>
        <ModalWrapper style={{ width: '90%', margin: '0 auto'}}>
                <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                    <span>
                        <img src={statisticsPoint} width="80px" />
                    </span>
                    <span style={{ fontWeight: '700', color: '#f9f9f9' }}>[Statistics] {t('student_score_statictis')}</span>
                </div>
                <div style={{ width: '100%', minHeight: '150px', padding: '1rem' }}>
                    <div>

                        <Row style={{ border: '2px solid #cacaca' }} className="style-table">
                            <Table rowKey="name" pagination={false} columns={columnsGrade} dataSource={lstSubmissionCore} scroll={{ y: 240 }} style={{ width: '100%' }} />
                        </Row>

                    </div>
                </div>
        </ModalWrapper>
    </>
}


export default ManageScore
