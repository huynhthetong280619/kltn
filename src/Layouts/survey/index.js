import React, { useEffect, useState } from 'react'

import surveyImg from '../../assets/images/contents/survey.png'
import { get, isEmpty } from 'lodash'
import moment from 'moment'
import { Row, Checkbox, Radio, Progress, Col, Tabs, Button, Tooltip, Skeleton } from 'antd'
import './overwrite.css'
import '../../components/font-awesome-icon/index'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from 'react-i18next'
import RestClient from '../../utils/restClient'
import { useHistory, useLocation } from 'react-router'
import ModalWrapper from '../../components/basic/modal-wrapper'
import { ReactComponent as Logout } from '../../assets/images/contents/logout.svg'
import ModalLoadingLogin from '../login/modal-loading-login'


const { TabPane } = Tabs;

const Survey = () => {
    const { t } = useTranslation()
    const [survey, setSurvey] = useState({})
    const [replyCurrent, setRelyCurrent] = useState({})
    const [responseSurvey, setResponseSurvey] = useState({})
    const location = useLocation()
    const history = useHistory()
    const { surveyId, timelineId, idSubject } = location.state
    const [isLoading, setIsLoading] = useState(false)
    const restClient = new RestClient({ token: '' })

    useEffect(async () => {
        setIsLoading(true)
        await restClient.asyncGet(`/survey/${surveyId}?idCourse=${idSubject}&idTimeline=${timelineId}`)
            .then(res => {
                if (!res.hasError) {
                    setSurvey(get(res, 'data').survey)
                }
            })

        await restClient.asyncGet(`/survey/${surveyId}/view?idCourse=${idSubject}&idTimeline=${timelineId}`)
            .then(res => {
                setRelyCurrent(get(res, 'data'))
            })

        await restClient.asyncGet(`/survey/${surveyId}/responses?idCourse=${idSubject}&idTimeline=${timelineId}`)
            .then(res => {
                if (!res.hasError) {
                    setResponseSurvey(get(res, 'data'))
                }

                setIsLoading(false)
            })
    }, [])

    const transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }


    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    };

    console.log(replyCurrent.questionnaire)

return <>
        <ModalWrapper style={{ width: '90%', margin: '0 auto', display: 'flex', rowGap: '1rem', flexDirection: 'column' }}>
            <ModalWrapper style={{ backgroundColor: '#494949' }}>
                {
                    isLoading ? <Skeleton /> : <div style={{ textAlign: 'center', color: '#f9f9f9' }}>
                        <i>
                            <FontAwesomeIcon icon="poll" style={{ width: 105, height: 105, color: '#ff4000' }} />
                        </i>
                        <div style={{ fontSize: '2em' }}>[ {t('survey')}] {get(survey, 'name')}</div>
                        <div>
                            <div><span style={{ fontWeight: 700 }}>{t('close')}: </span> {transTime(get(survey, 'expireTime'))}</div>
                            <div><span style={{ fontWeight: 700 }}>{t('time_remain')}: </span> {moment.utc(get(survey, 'expireTime')).fromNow()}</div>
                            <div><span style={{ fontWeight: 700 }}>{t('status')}: </span>{get(survey, 'isRemain') ? <span style={{ color: '#44bd32', fontWeight: 900 }}>{t('opening')}</span> : <span style={{ color: '#e84118', fontWeight: 900 }}>{t('closed')}</span>}</div>
                        </div>
                        <div>
                            {(get(survey, 'isRemain') && get(survey, 'canAttempt')) && <Button type="primary" onClick={() => history.push('/home/survey-take', { idSurvey: surveyId, idSubject, idTimeline: timelineId })} style={{ marginTop: 25 }}>{t('take_survey')}</Button>}
                            {(get(survey, 'isRemain') == false) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>{t('msg_timeup_survey')}</div>}
                            {(get(survey, 'isRemain') == false) && <Tooltip title="Thoát">
                                <div className="logout-action">
                                    <Logout style={{ cursor: 'pointer' }} onClick={() => history.go(-1)} />
                                </div>
                            </Tooltip>
                            }
                        </div>
                    </div>

                }

            </ModalWrapper>

            <ModalWrapper style={{ backgroundColor: '#494949' }}>
                {
                    isLoading ? <Skeleton /> : <Tabs defaultActiveKey="1" centered style={{ width: "100%" }} type="card">
                        <TabPane tab={t('view_your_response')} key="1" >

                            {!replyCurrent.success ? <div style={{ color: '#f9f9f9', textAlign: 'center' }}>{replyCurrent.message}</div> :
                                <div>
                                    {
                                        (replyCurrent.questionnaire).map((q, index) => (
                                            q.typeQuestion == 'choice' ?
                                                (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                                    <div style={{ fontWeight: 600, color: '#f9f9f9' }}><span>{t('question')} {index + 1}: </span>{q.content}</div>
                                                    <div>
                                                        <Radio.Group disabled value={replyCurrent.response.answerSheet[index].answer}>
                                                            {
                                                                q.answer.map(a => (
                                                                    <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                        {a.content}
                                                                    </Radio>
                                                                ))
                                                            }
                                                        </Radio.Group>
                                                    </div>
                                                </div>) :
                                                (
                                                    q.typeQuestion == 'multiple' ? (<div style={{ textAlign: 'left' }} key={q._id}>
                                                        <div style={{ fontWeight: 600, color: '#f9f9f9' }}>
                                                            <span>{t('question')} {index + 1}: </span>{q.question}
                                                        </div>
                                                        <div>
                                                            <Checkbox.Group style={{ width: '100%' }} disabled value={replyCurrent.response.answerSheet[index].answer}>
                                                                <Row>
                                                                    <Col span={12} style={{ textAlign: 'left' }}>
                                                                        <div>
                                                                            {
                                                                                q.answer.map(a => (
                                                                                    <div key={a._id}>
                                                                                        <Checkbox style={radioStyle} value={a._id}>{a.content}</Checkbox>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col span={12}>
                                                                    </Col>
                                                                </Row>
                                                            </Checkbox.Group>
                                                        </div>
                                                    </div>
                                                    )

                                                        : <div style={{ textAlign: 'left' }} key={q._id}>
                                                            <div style={{ fontWeight: 600, width: '100%', color: '#f9f9f9' }}>
                                                                <span>{t('question')} {index + 1}: </span>{q.question}
                                                            </div>
                                                            <div>
                                                                <input type="text" style={{ width: '40%' }} value={replyCurrent.response.answerSheet[index].answer} disabled />
                                                            </div>
                                                        </div>
                                                )
                                        )
                                        )
                                    }
                                </div>
                            }
                        </TabPane>
                        <TabPane tab={`${t('view_all_responses')} (${responseSurvey.totalResponses})`} key="2" >
                            {
                                !isEmpty(responseSurvey) && (responseSurvey?.questionnaire).map((q, index) => (
                                    q.typeQuestion == 'choice' ?
                                        (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                            <div style={{ fontWeight: 600, color: '#f9f9f9' }}><span>{t('question')} {index + 1}: </span>{q.question}</div>
                                            <Row>
                                                <Col span={12}>
                                                    <Radio.Group disabled>
                                                        {
                                                            q.answer.map(a => (<div style={{ display: 'flex' }}>
                                                                <div >
                                                                    <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                        {a.content}
                                                                    </Radio>
                                                                </div>
                                                            </div>
                                                            ))
                                                        }
                                                    </Radio.Group>
                                                </Col>
                                                <Col span={12}>
                                                    {
                                                        q.answer.map(a => (<div style={{ display: 'flex', height: 30 }}>
                                                            <div style={{ width: '50%' }}>
                                                                <Progress percent={a.percent.split('%')[0]} />
                                                            </div>
                                                        </div>
                                                        ))
                                                    }
                                                </Col>
                                            </Row>
                                        </div>) :
                                        (
                                            q.typeQuestion == 'multiple' ? (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                                <div style={{ fontWeight: 600, color: '#f9f9f9' }}><span>{t('question')} {index + 1}: </span>{q.question}</div>
                                                <Row>
                                                    <Col span={12} >
                                                        <Checkbox.Group disabled>
                                                            {
                                                                q.answer.map(a => (<div style={{ display: 'flex' }}>
                                                                    <div >
                                                                        {/* <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                                {a.content}
                                                                            </Radio> */}

                                                                        <Checkbox style={radioStyle} value={a._id} key={a._id}>
                                                                            {a.content}
                                                                        </Checkbox>
                                                                    </div>

                                                                </div>
                                                                ))
                                                            }
                                                        </Checkbox.Group>
                                                    </Col>
                                                    <Col span={12}>
                                                        {
                                                            q.answer.map(a => (<div style={{ display: 'flex', height: 30 }}>
                                                                <div style={{ width: '50%' }}>
                                                                    <Progress percent={a.percent.split('%')[0]} />
                                                                </div>
                                                            </div>
                                                            ))
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>)

                                                : <div style={{ textAlign: 'left' }} key={q._id}>
                                                    <div style={{ fontWeight: 600, color: '#f9f9f9' }}>
                                                        <span>{t('question')} {index + 1}: </span>{q.question}
                                                    </div>
                                                    {q.answer.map(value => (
                                                        <div>
                                                            <span>{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                        )
                                )
                                )
                            }
                        </TabPane>
                    </Tabs>

                }

                <ModalLoadingLogin visible={isLoading} content={t('loading_survey')}/>

            </ModalWrapper>
        </ModalWrapper>
    </>
}


export default Survey
