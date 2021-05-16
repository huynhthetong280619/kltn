import { Button, Checkbox, Col, Input, Radio, Row } from 'antd'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router'
import { notifyError, notifySuccess } from '../../assets/common/core/notify'
import ModalWrapper from '../../components/basic/modal-wrapper'
import RestClient from '../../utils/restClient'
import './overwrite.css'

const SurveyTake = () => {
    const { t } = useTranslation()
    const [answer, setAnswer] = useState({})
    const [question, setQuestion] = useState([])
    const location = useLocation()
    const { idSurvey, idSubject, idTimeline } = location.state
    const restClient = new RestClient({ token: '' })
    const history = useHistory()


    useEffect(() => {
        console.log('Survey take')

        restClient.asyncGet(`/survey/${idSurvey}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`)
            .then(res => {
                console.log('Question', res)
                if (!res.hasError) {
                    setQuestion(get(res, 'data').questionnaire?.questions)
                }
            })
    }, [])


    useEffect(() => {

        const obj = {}
        if (question.questions != null) {
            question.questions.map(ques => {
                obj[ques._id] = null
            })

            setAnswer(obj)
        }

    }, [question])



    const onChoice = (questionAns, questionsId) => {
        console.log(questionAns, questionsId)
        setAnswer({ ...answer, [questionsId]: questionAns.target.value })
    };

    const onChangeMultipleChoice = (questionAns, questionsId) => {
        setAnswer({ ...answer, [questionsId]: questionAns })
    }

    const onFill = (questionAns, questionsId) => {
        setAnswer({ ...answer, [questionsId]: questionAns.target.value })
    }

    const submitSurvey = async () => {
        // setState({ loading: true });
        const questionId = Object.keys(answer)

        let convert = []
        questionId.map(key => {
            convert.push({
                ['idQuestion']: key,
                ['answer']: answer[key]
            })
        })

        // Push up to server
        const data = {
            data: convert
        }

        await restClient.asyncPost(`/survey/${idSurvey}/submit?idSubject=${idSubject}&idTimeline=${idTimeline}`, data)
            .then(res => {
                if (!res.hasError) {
                    history.go(-1)
                    notifySuccess(t('success'), res.data.message)
                } else {
                    // setState({ loading: false });
                    notifyError(t('failure'), res.data.message)
                }
            })
    }

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    };

    return <>
        <ModalWrapper style={{ width: '90%', margin: '0 auto' }}>
            <ModalWrapper style={{ backgroundColor: '#494949', color: '#f9f9f9' }}>

                {
                    question.map((q, index) => (
                        q.typeQuestion == 'choice' ?
                            (<div style={{ marginBottom: '0.5rem', textAlign: 'left' }} key={q._id}>
                                <div style={{ fontWeight: 600 }}><span>{t('question')} {index + 1}: </span>{q.question}</div>
                                <div>
                                    <Radio.Group onChange={e => onChoice(e, q._id)} value={get(answer, q._id)}>
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
                                q.typeQuestion == 'multiple' ? (<div style={{ textAlign: 'left', marginBottom: '0.5rem' }} key={q._id}>
                                    <div style={{ fontWeight: 600 }}>
                                        <span>{t('question')} {index + 1}: </span>{q.question}
                                    </div>
                                    <div>
                                        <Checkbox.Group style={{ width: '100%' }} onChange={e => onChangeMultipleChoice(e, q._id)}>
                                            <Row>
                                                <Col span={12} style={{ textAlign: 'left' }}>
                                                    <div>
                                                        {
                                                            q.answer.map(a => (
                                                                <div key={a._id}>
                                                                    <Checkbox value={a._id}>{a.content}</Checkbox>
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
                                        <div style={{ fontWeight: 600 }}>
                                            <span>{t('question')} {index + 1}: </span>{q.question}
                                        </div>
                                        <div>
                                            <Input style={{ width: '400px' }} type="text" onChange={(e) => onFill(e, q._id)} />
                                        </div>
                                    </div>
                            )
                    )
                    )
                }

            </ModalWrapper>
            <div style={{ textAlign: 'center' }}>
                <Button type="primary" /*loading={isLoading}*/ onClick={() => submitSurvey()} className="lms-btn">{t('quiz_submit')}</Button>
            </div>
            <div style={{ textAlign: 'center' }}>
                <Button type="primary" style={{ background: '#232323' }} onClick={() => history.go(-1)} className="lms-btn">{t('go_back')}</Button>
            </div>
        </ModalWrapper>
    </>
}

export default SurveyTake
