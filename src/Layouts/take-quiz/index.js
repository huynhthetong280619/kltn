import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Radio, Checkbox, notification, Tooltip, Skeleton } from 'antd'

import survey from '../../assets/images/contents/surveylogo.png'
import { get } from 'lodash'
import './overwrite.css'
import Countdown from "react-countdown";
import { notifyError, notifySuccess } from '../../assets/common/core/notify';
import CountDownTest from '../countDown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from 'react-i18next'
import '../../components/font-awesome-icon'
import { useHistory, useLocation } from 'react-router';
import RestClient from '../../utils/restClient';
import ModalWrapper from '../../components/basic/modal-wrapper';

const TakeQuiz = () => {

    const { t } = useTranslation()

    const [answer, setAnswer] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const location = useLocation()
    const history = useHistory()
    const { examId, idSubject, idTimeline, idSubmission } = location.state
    const [callBackResponse, setCallBackResponse] = useState(false)
    const [examQuestions, setExamQuestions] = useState([])
    const restClient = new RestClient({ token: '' })


    useEffect(() => {
        restClient.asyncGet(`/exam/${examId}/attempt${idSubmission ? `/${idSubmission}` : ''}?idSubject=${idSubject}&idTimeline=${idTimeline}`)
            .then(res => {
                console.log('setExamQuestions', res)
                if (!res.hasError) {
                    const examQuestion = get(res, 'data').quiz
                    setExamQuestions(examQuestion)
                    if (examQuestion != null) {
                        const objTemp = {}
                        get(examQuestion, 'questions').map(question => {
                            objTemp[question._id] = null
                        })

                        setAnswer(objTemp)
                        setCallBackResponse(false)
                    }
                }
            })

    }, [])

    const onChoice = (questionAns, questionsId) => {
        //console.log('onChange', { ...state.answer, [questionsId]: questionAns.target.value })
        setAnswer((prev) => ({ ...prev, [questionsId]: questionAns.target.value }))
    };

    const onChangeMultipleChoice = (questionAns, questionsId) => {
        //console.log('checked = ', questionAns, questionsId);
        setAnswer(prev => ({ ...prev, [questionsId]: questionAns }))
    }

    const submitExam = async () => {
        // setState({ loading: true });
        setIsLoading(true)
        const questionId = Object.keys(answer)

        let convert = []
        questionId.map(key => {
            convert.push({
                ['idQuestion']: key,
                ['idAnswer']: answer[key]
            })
        })



        // Push up to server
        //console.log(convert)
        const data = {
            idSubject: idSubject,
            idTimeline: idTimeline,
            data: convert
        }

        console.log(data)
        await restClient.asyncPost(`/exam/${examId}/submit/${idSubmission}?idSubject=${idSubject}&idTimeline=${idTimeline}`, data)
            .then(res => {
                if (!res.hasError) {
                    notification.success({
                        message: res.data.message,
                        placement: 'topRight'
                    });
                    history.go(-1)
                    //console.log('Rest client', get(res, 'data'));
                    // Router.push(`/quizzis/${examId}?idSubject=${idSubject}&idTimeline=${idTimeline}`)
                } else {
                    setIsLoading(false);
                    notifyError(t('failure'), res.data.message);
                }
            })
    }


    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    };

    //console.log(examQuestion)

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <div className="timeout-quiz">{t('time_out')}</div>;
        } else {
            // Render a countdown
            return <CountDownTest hours={hours} minutes={minutes} seconds={seconds} />
            // return <span>{hours} hours {minutes} minutes {seconds} seconds</span>;
        }
    };

    return <>
        <ModalWrapper style={{ width: '90%', margin: '0 auto' }}>
            <Row style={{
                width: '100%', position: 'fixed',
                top: 0,
                left: '42%'
            }}>
                {get(examQuestions, 'timeToDo') && <Countdown date={Date.now() + get(examQuestions, 'timeToDo')} renderer={renderer} />}
            </Row>
            <div style={{ display: 'flex', justifyContent: 'center', columnGap: '0.5rem', color: '#f9f9f9' }}>
                <span>
                    <FontAwesomeIcon icon="spell-check" style={{ width: 30, height: 30, color: '#F79F1F' }} />
                </span>
                <span style={{ fontWeight: '700' }}>{get(examQuestions, 'name') && get(examQuestions, 'name').toUpperCase()}</span>
            </div>
            <div style={{
                rowGap: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <ModalWrapper style={{ backgroundColor: '#494949', color: '#f9f9f9' }}>
                    {
                        get(examQuestions, 'questions')?.length ?
                        (get(examQuestions, 'questions') || []).map((q, index) => (
                            q.typeQuestion === "multiple" ?
                                (
                                    <div className="ant-row" style={{ marginBottom: 10 }}>
                                        <Col span={24} style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: 600 }}><span>{t('question')} {index + 1}: </span>{q.question}</div>
                                            <ModalWrapper style={{ backgroundColor: '#232323' }}>
                                                <Checkbox.Group style={{ width: '100%' }} onChange={e => onChangeMultipleChoice(e, q._id)}>
                                                    <Row>
                                                        <Col span={12} style={{ textAlign: 'left' }}>
                                                            <div>
                                                                {
                                                                    q.answers.map(a => (
                                                                        <div>
                                                                            <Tooltip title={a.answer}><Checkbox value={a._id}>{a.answer}</Checkbox></Tooltip>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                        </Col>
                                                    </Row>
                                                </Checkbox.Group>
                                            </ModalWrapper>
                                        </Col>

                                    </div>
                                )
                                :
                                (<div className="ant-row" style={{ marginBottom: 10 }}>
                                    <Col span={24} style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 600 }}><span>{t('question')} {index + 1}: </span>{q.question}</div>
                                        <ModalWrapper style={{ backgroundColor: '#232323', color: '#f9f9f9' }}>
                                            <Radio.Group onChange={e => onChoice(e, q._id)} value={get(answer, q._id)}>
                                                {
                                                    q.answers.map(a => (
                                                        <Radio style={radioStyle} value={a._id}>
                                                            <Tooltip title={a.answer}>{a.answer.length > 150 ? a.answer.slice(0, 150) + '...' : a.answer}</Tooltip>
                                                        </Radio>
                                                    ))
                                                }
                                            </Radio.Group>
                                        </ModalWrapper>
                                    </Col>
                                </div>)
                        )) : <Skeleton />
                    }
                </ModalWrapper>
                <div style={{textAlign: 'center'}}> 
                    <Button type="primary" loading={isLoading} onClick={() => submitExam()} className="lms-btn">{t('quiz_submit')}</Button>
                </div>
                <div style={{textAlign: 'center' }}>
                    <Button type="primary" style={{background: '#232323'}} onClick={() => history.go(-1)} className="lms-btn">{t('go_back')}</Button>
                </div>
            </div>
        </ModalWrapper>
    </>
}


export default TakeQuiz;
