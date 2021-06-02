import React, { useEffect, useState } from 'react'
import { Row, Col, Tabs } from 'antd'
import { useTranslation, withTranslation } from 'react-i18next'
import './overwrite.css'
import RestClient from '../../../utils/restClient'
import { useHistory, useLocation } from 'react-router';
import StudentManage from '../student-manage';
import ExamManage from '../exam-manage';
import TranscriptManage from '../transcript-manage';
import { get } from 'lodash';
import ModalWrapper from '../../../components/basic/modal-wrapper'
import ModalLoadingLogin from '../../login/modal-loading-login';
import { ReactComponent as Logout } from '../../../assets/images/contents/logout.svg'


const { TabPane } = Tabs;

const Student = () => {

    const { t } = useTranslation()
    const [lstSubmissionCore, setLstSubmissionCore] = useState([])
    const [lstClassScore, setLstClassScore] = useState(null)
    const [loadingData, setLoadingData] = useState(false)
    const location = useLocation()
    const history = useHistory()
    const { idSubject } = location.state
    const restClient = new RestClient({ token: '' })

    useEffect(async () => {
        setLoadingData(true)
        await restClient.asyncGet(`/course/${idSubject}/score`)
            .then(res => {
                console.log('submissioin core', res)
                if (!res.hasError) {
                    setLstSubmissionCore(get(res, 'data'))
                }
            })

        await restClient.asyncGet(`/course/${idSubject}/transcript`)
            .then(res => {
                console.log('class core', res)
                if (!res.hasError) {
                    setLstClassScore(get(res, 'data'))
                }
            })

        setLoadingData(false)

    }, [])

    if (loadingData) {
        return <ModalLoadingLogin visible={loadingData} content={t("loading_class")} />
    }


    return (
        <ModalWrapper style={{ width: '90%', margin: '0 auto' }}>
            <div>
                <Logout onClick={() => history.go(-1)} style={{cursor: 'pointer'}}/>
            </div>
            <Tabs defaultActiveKey="1" centered style={{ width: "100%" }} type="card">
                <TabPane tab={t('class')} key="1">
                    <StudentManage idSubject={idSubject} />
                </TabPane>
                <TabPane tab={t('test')} key="2">
                    <ExamManage lstSubmissionCore={lstSubmissionCore} />
                </TabPane>
                <TabPane tab={t('transcript')} key="3">
                    <TranscriptManage lstClassScore={lstClassScore} idSubject={idSubject} />
                </TabPane>
            </Tabs>
        </ModalWrapper>
    )
}
export default withTranslation('translations')(Student)
