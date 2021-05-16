import { useTranslation, withTranslation } from 'react-i18next'
import { Row, Col, Table, Typography } from 'antd'
import statisticsPoint from '../../../assets/images/contents/statistics-point.png'
import { useState } from 'react';
const { Text } = Typography;

const ManageScore = () => {

    const { t } = useTranslation()

    const [lstSubmissionCore, setLstSubmissionCore] = useState([])


    useEffect(() => {
        //console.log('componentDidMount', this.props.lstSubmissionCore)
        // this.setState({
        //     lstSubmissionCore: this.props.lstSubmissionCore,
        // })
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
        <Row style={{
            width: '80%',
            textAlign: 'center',
            background: '#fff',
            minHeight: '20px', justifyContent: 'center',
            margin: '0 auto'
        }}>
            <Row style={{ width: '100%' }}>
                {/* <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</Col> */}
            </Row>
            <div style={{ width: '90%' }}>
                <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                    <span>
                        <img src={statisticsPoint} width="80px" />
                    </span>
                    <span style={{ fontWeight: '700' }}>[Statistics] {t('student_score_statictis')}</span>
                </div>
                <div style={{ width: '100%', minHeight: '150px' }}>
                    <div style={{
                        textAlign: 'center',
                        padding: '45px',
                        marginBottom: "25px",
                        border: "2px solid #c4c4c4",
                        borderRadius: "20px"

                    }}>

                        <Row style={{ border: '2px solid #cacaca' }}>
                            <Table rowKey="name" pagination={false} columns={columnsGrade} dataSource={this.state.lstSubmissionCore} scroll={{ y: 240 }} style={{ width: '100%' }} />
                        </Row>

                    </div>
                </div>
            </div>
        </Row>

    </>
}


export default ManageScore
