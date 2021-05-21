import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Table, Tag, Typography, Skeleton } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import quizTime from '../../assets/images/contents/quiz-time.png'
import { get, isEmpty } from 'lodash'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import RestClient from '../../utils/restClient'

import './overwrite.css'
import { useHistory, useLocation } from 'react-router'
import ModalWrapper from '../../components/basic/modal-wrapper'
import { ReactComponent as Logout } from '../../assets/images/contents/logout.svg'
import ModalLoadingLogin from '../login/modal-loading-login'

const { Text } = Typography;

const Quiz = () => {
    const { t } = useTranslation()
    const [isTeacherPrivilege, setIsTeacherPrivilege] = useState(false)
    const [submissions, setSubmissions] = useState([])
    const restClient = new RestClient({ token: '' })
    const [requirementExam, setRequirementExam] = useState([])
    const location = useLocation()
    const history = useHistory()
    const { examId, idSubject, idTimeline } = location.state
    const [isLoading, setIsLoading] = useState(false)
    const [idSubmission, setIdSubmission] = useState('')

    const transTime = (time) => {
        //console.log('transTime', time)
        return moment(time, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.idPrivilege == 'student') {
            setIsTeacherPrivilege(false)

        }

        if (user?.idPrivilege == 'teacher') {
            setIsTeacherPrivilege(true)

        }

        setIsLoading(true)

        restClient.asyncGet(`/exam/${examId}?idSubject=${idSubject}&idTimeline=${idTimeline}`)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    setRequirementExam(get(res, 'data').exam)
                    setSubmissions(get(get(res, 'data').exam, 'submissions'))
                    setIsLoading(false)
                }
            })


        restClient.asyncGet(`/exam/${examId}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`)
            .then(res => {
                if (!res.hasError) {
                    setIdSubmission(get(res, 'data')?.idSubmission)
                }
            })
    }, [])

    const directJoinQuiz = (obj) => {
        history.push('take-quiz', obj)
    }

    // joinExam = async () => {
    //     await restClient.asyncGet(`/exam/${idExam}/attempt?idSubject=lthdt01&idTimeline=${idTimeline}`, token)
    //         .then(res => {
    //             console.log(res)
    //         })
    // }


    let columns = []

    if (isTeacherPrivilege) {
        columns = [
            {
                title: t('student'),
                dataIndex: 'student',
                key: 'student',
                render: (data) => {
                    //console.log(data);
                    return (<span> {get(data, 'firstName') + " " + get(data, 'lastName')}</span>)
                }
            },
            {
                title: t('grade'),
                dataIndex: 'grade',
                key: 'grade',
                render: (data) => (
                    data !== null ? <Text type='success'>{data}</Text> : <Text type='danger'>{t('not_do')}</Text>
                )
            },
            {
                title: t('review'),
                dataIndex: 'review',
                key: 'review',
                render: () => <a>{t('review')}</a>
            },
        ]
    } else {
        columns = [
            {
                title: t('time_attempt'),
                dataIndex: 'time',
                key: 'time',
                render: data => <span> {data}</span>
            },
            {
                title: t('grade'),
                dataIndex: 'grade',
                key: 'grade',
            },
            {
                title: t('status'),
                dataIndex: 'isContinue',
                key: 'isContinue',
                render: (data) => data ? <Tag icon={<SyncOutlined spin />} color="processing" >{t('doing')}</Tag> : <Tag color="success">{t('completed')}</Tag>
            },
            {
                title: t('action'),
                dataIndex: 'isContinue',
                key: 'isContinue',
                render: (data) => data ? <a onClick={(e) => { e.preventDefault(); directJoinQuiz({ examId, idSubject, idTimeline, idSubmission }) }}>{t('continue')}</a> : null
            }
        ]
    }


    return (
        <>
            <ModalWrapper style={{ width: '90%', margin: '0 auto', display: 'flex', columnGap: '1rem' }} className="mt-4">

                <ModalWrapper style={{ textAlign: 'center', background: '#494949' }} className="color-default">

                    {
                        isLoading ? <Skeleton /> : <><div style={{ position: 'absolute', cursor: 'pointer' }} onClick={() => history.go(-1)}>
                            <Logout />
                        </div><div>
                                <i>
                                    <img src={quizTime} />
                                </i>
                                <div style={{ fontSize: '2em' }}>{get(requirementExam, 'name')}</div>
                                <div>
                                    <div><span style={{ fontWeight: 700 }}>{t('attempt_allowed')} </span> {get(get(requirementExam, 'setting'), 'attemptCount')}</div>
                                    {!isTeacherPrivilege && (<div><span style={{ fontWeight: 700 }}>{t('attempt_available')}</span> {get(requirementExam, 'attemptAvailable')}</div>)}
                                    <div><span style={{ fontWeight: 700 }}>{t('quiz_open')}</span> {transTime(get(requirementExam, 'setting')?.startTime)}</div>
                                    <div><span style={{ fontWeight: 700 }}>{t('quiz_close')}</span> {transTime(get(requirementExam, 'setting')?.expireTime)}</div>
                                    <div><span style={{ fontWeight: 700 }}>{t('quiz_time_remaining')}</span> {get(requirementExam, 'timingRemain')}</div>
                                    <div><span style={{ fontWeight: 700 }}>{t('quiz_status')}</span>{get(requirementExam, 'isOpen') ? <span style={{ color: '#44bd32', fontWeight: 900 }}>{t('opening')}</span> : <span style={{ color: '#e84118', fontWeight: 900 }}>{t('closed')}</span>}</div>
                                    <div><span style={{ fontWeight: 700 }}>{t('quiz_grade_method')}</span>{t('quiz_highest_grade')}</div>
                                </div>
                                {!isTeacherPrivilege && (<div>
                                    {(get(requirementExam, 'attemptAvailable') > 0 && get(requirementExam, 'isAttempt') == true) && <Button type="primary" onClick={() => directJoinQuiz({ examId, idSubject, idTimeline, idSubmission })} style={{ marginTop: 25 }}>{t('take_quiz')}</Button>}
                                    {(get(requirementExam, 'attemptAvailable') == 0) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>{t('quiz_join_run_out')}</div>}
                                    {(!get(requirementExam, 'isOpen')) && (get(requirementExam, 'isRemain')) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>{t('quiz_not_time')}</div>}
                                </div>)}
                            </div></>
                    }
                </ModalWrapper>
                <ModalWrapper style={{ background: '#494949', width: '100%' }}>
                    {!isLoading ? <Table pagination={false} columns={columns} dataSource={submissions} rowKey='key' scroll={{ y: 240 }} /> : <Skeleton />}
                </ModalWrapper>
                <ModalLoadingLogin visible={isLoading} content={t('loading_survey')} />
            </ModalWrapper>
        </>)
}

export default Quiz
