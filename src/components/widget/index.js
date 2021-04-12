import React, { useState } from 'react'
import './widget.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../font-awesome-icon'
import { useTranslation } from 'react-i18next';
import { Drawer, Col, Row, Button } from 'antd'
import { UploadOutlined, ExportOutlined } from '@ant-design/icons'

const Widget = () => {
    const { t } = useTranslation()
    const [openCreateContent, setOpenCreateContent] = useState(false)

    const [notificationState, setNotificationState] = useState(false)
    const [documentState, setDocumentState] = useState(false)
    const [todosState, setTodosState] = useState(false)
    const [quizState, setQuizState] = useState(false)
    const [surveyState, setSurveyState] = useState(false)
    const [timelineState, setTimelineState] = useState(false)
    const [forumState, setForumState] = useState(false)


    return (<>
        <div className="container">
            <a onClick={() => setOpenCreateContent(true)}>
                <i><FontAwesomeIcon icon="wrench" /></i>
                <span>{t('setting')}</span>
            </a>
            <a>
                <i><FontAwesomeIcon icon="sort-amount-up" /> </i>
                <span>{t('arrange')}</span>
            </a>
            <a>
                <i><FontAwesomeIcon icon="edit" /></i>
                <span>{t('update')}</span>
            </a>
        </div>
        <Drawer
            title={t('manage_content')}
            placement="right"
            closable={false}
            onClose={() => setOpenCreateContent(false)}
            visible={openCreateContent}
            key="right"
            width={540}
            style={{ textAlign: 'center' }}
        >

            <Row style={{ justifyContent: 'space-around' }}>
                <Col span={6} className="action-select-add-content" style={{
                    height: '50px',
                    border: '2px solid #cacaca',
                    background: '#192a56',
                    color: '#fff',
                    lineHeight: '50px',
                    cursor: 'pointer'
                }} >
                    {t('information')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    height: '50px',
                    border: '2px solid #cacaca',
                    background: '#44bd32',
                    color: '#fff',
                    lineHeight: '50px',
                    cursor: 'pointer'
                }}
                >
                    {t('document')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    height: '50px',
                    border: '2px solid #cacaca',
                    background: '#e84118',
                    color: '#fff',
                    lineHeight: '50px',
                    cursor: 'pointer'
                }} >
                    {t('exercise')}
                </Col>
            </Row>
            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    height: '50px',
                    border: '2px solid #cacaca',
                    background: '#7f8fa6',
                    color: '#fff',
                    lineHeight: '50px',
                    cursor: 'pointer'
                }} >
                    {t('quiz')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    height: '50px',
                    border: '2px solid #cacaca',
                    background: '#3c40c6',
                    color: '#fff',
                    lineHeight: '50px',
                    cursor: 'pointer'
                }} >
                    {t('survey')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    height: '50px',
                    border: '2px solid #cacaca',
                    background: '#ffa801',
                    color: '#fff',
                    lineHeight: '50px',
                    cursor: 'pointer'
                }} >
                    {t('timeline')}
                </Col>


            </Row>

            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    height: '50px',
                    border: '2px solid #cacaca',
                    background: '#ffa801',
                    color: '#fff',
                    lineHeight: '50px',
                    cursor: 'pointer'
                }} >
                    {t('forum')}
                </Col>
            </Row>

            <Row>
                <div style={{
                    border: "2px solid #cacaca",
                    padding: "20px 0",
                    borderRadius: "11px",
                    position: 'relative',
                    margin: '20px',
                    width: '100%'
                }}>
                    <h2>{t('h1')}</h2>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('h2')}</p>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('h3')} </p>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('h4')}</p>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('h5')}</p>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('h6')}</p>
                </div>
            </Row>
            <Row>
                <Col span={12} className="action-select-add-content" >
                    <Button
                        type='primary'
                        size='large'
                        icon={<UploadOutlined />}

                    > {t('import').toUpperCase()}</Button>

                </Col>
                <Col span={12} className="action-select-add-content" >
                    <Button

                        type='primary'
                        size='large'
                        icon={<ExportOutlined />}
                    > {t('export').toUpperCase()}</Button>
                </Col>
            </Row>



        </Drawer>
        {/* <Drawer
            title=''
            placement="left"
            onClose={this.closeDrawerCreate}
            visible={isOpenDrawerCreate}
            key="left"
            width={540}
            style={{ textAlign: 'center' }}
        >
            {quizState && (<AddQuiz lstQuizzes={lstQuizzes} lstTimelines={lstTimelines} createQuiz={this.createQuiz} updateQuiz={this.updateQuiz} idSubject={this.props.idSubject} idTimeline={idTimelineRequired} idExam={idExamFocus} token={this.props.token} />)}
            {surveyState && (<AddSurvey lstTimelines={lstTimelines} lstSurveys={lstSurveys} createSurvey={this.createSurvey} updateSurvey={this.updateSurvey} idSubject={this.props.idSubject} idTimeline={idTimelineRequired} idSurvey={idSurveyFocus} token={this.props.token} />)}
            {todosState && (<AddAssignment lstTimelines={lstTimelines} createAssignment={this.createAssignment} updateAssignment={this.updateAssignment} idSubject={this.props.idSubject} idTimeline={idTimelineRequired} idAssignment={idAssignmentFocus} token={this.props.token} />)}
            {documentState && (<AddFile lstTimelines={lstTimelines} createFile={this.createFile} updateFile={this.updateFile} idSubject={this.props.idSubject} idTimeline={idTimelineRequired} idFile={idFileFocus} token={this.props.token} />)}
            {notificationState && (<AddInformation lstTimelines={lstTimelines} isLoading={isLoading} createInformation={this.createInformation} idSubject={this.props.idSubject} idTimeline={this.props.idTimeline} idInformation={idInformationFocus} />)}
            {timelineState && (<AddTimeline createTimeline={this.createTimeline} isLoading={isLoading} />)}
            {forumState && (<AddForum lstTimelines={lstTimelines} createForum={this.createForum} updateForum={this.updateForum} idSubject={this.props.idSubject} idTimeline={idTimelineRequired} idForum={idForumFocus} token={this.props.token} />)}
        </Drawer> */}
    </>
    )
}


export default Widget