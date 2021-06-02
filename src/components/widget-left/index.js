import React, { useEffect, useState } from 'react'
import './widget.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../font-awesome-icon'
import { useTranslation } from 'react-i18next';
import { Drawer, Col, Row, Button } from 'antd'
import { UploadOutlined, ExportOutlined } from '@ant-design/icons'
import AddAssignment from '../../Layouts/addAssignment/addAssignment';
import { notifySuccess, notifyError } from '../../assets/common/core/notify';
import { head } from 'lodash';
import { useHistory, useLocation } from 'react-router';
import AddQuiz from '../../Layouts/addQuiz/addQuiz';
import AddSurvey from '../../Layouts/addSurvey/addSurvey';
import AddFile from '../../Layouts/addFile/addFile';
import AddInformation from '../../Layouts/addInformation/addInformation';
import AddTimeline from '../../Layouts/addTimeline/addTimeline';
import ImportSubject from '../../Layouts/importSubject/importSubject';
import AddForum from '../../Layouts/addForum/addForum';
import ExportSubject from '../../Layouts/exportSubject/exportSubject';
import RestClient from '../../utils/restClient';
import Modal from 'antd/lib/modal/Modal';
import ModalWrapper from '../basic/modal-wrapper';
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'
import { get } from 'lodash';
import QuizBank from '../../Layouts/quiz-bank';


const WidgetLeft = ({
    timelinesList,
    setTimelinesList,
    quizList,
    setQuizList,
    surveyList,
    setSurveyList,
    detailSubject,
    setDetailSubject,
    isOnEdit,
    setIsOnEdit,
    notificationState,
    setNotificationState,
    documentState,
    setDocumentState,
    todosState,
    setTodosState,
    quizState,
    setQuizState,
    surveyState,
    setSurveyState,
    timelineState,
    setTimelineState,
    forumState,
    setForumState,
    importState,
    setImportState,
    exportState,
    setExportState,
    isOpenModalFunction,
    setIsOpenModalFunction,
    openCreateContent,
    setOpenCreateContent,

    surveyIdEdit,
    timelineIdEdit,
    focusSurveyEdit,
    setFocusSurveyEdit,

    fileIdEdit,
    focusFileEdit,
    setFocusFileEdit,

    assignmentIdEdit,
    focusAssignmentEdit,
    setFocusAssignmentEdit,

    forumIdEdit,
    focusForumEdit,
    setFocusForumEdit,

    examIdEdit,
    focusExamEdit,
    setFocusExamEdit,

    isTeacherFlag,

    quizBankState,
    setQuizBankState,

    surveyBankState,
    setSurveyBankState
}) => {
    const { t } = useTranslation()
    // const [openCreateContent, setOpenCreateContent] = useState(false)

    // const [notificationState, setNotificationState] = useState(false)
    // const [documentState, setDocumentState] = useState(false)
    // const [todosState, setTodosState] = useState(false)
    // const [quizState, setQuizState] = useState(false)
    // const [surveyState, setSurveyState] = useState(false)
    // const [timelineState, setTimelineState] = useState(false)
    // const [forumState, setForumState] = useState(false)
    // const [importState, setImportState] = useState(false)
    // const [exportState, setExportState] = useState(false)
    // const [isOpenModalFunction, setIsOpenModalFunction] = useState(false)
    const [timelinesIndex, setTimelinesIndex] = useState(detailSubject)
    const [currentTitle, setCurrentTitle] = useState('')
    const history = useHistory()

    const restClient = new RestClient({ token: '' })
    const location = useLocation()

    const openModalFunction = (type) => {
        setIsOpenModalFunction(true)
        setCurrentTitle(type)

    }

    const focusTodos = () => {
        setTodosState(true)
        setOpenCreateContent(false)
    }

    const focusNotification = () => {
        setNotificationState(true)
        setOpenCreateContent(false)
    }

    const focusDocument = () => {
        setDocumentState(true)
        setOpenCreateContent(false)
    }

    const focusSurvey = () => {
        setSurveyState(true)
        setOpenCreateContent(false)
    }

    const focusQuiz = () => {
        setQuizState(true)
        setOpenCreateContent(false)
    }

    const focusTimeline = () => {
        setTimelineState(true)
        setOpenCreateContent(false)
    }

    const focusForum = () => {
        setForumState(true)
        setOpenCreateContent(false)
    }

    const focusExportData = () => {
        setExportState(true)
        setOpenCreateContent(false)

    }

    const focusImportData = () => {
        setImportState(true)
        setOpenCreateContent(false)

    }

    const focusQuizBank = () => {
        setQuizBankState(true)
        setOpenCreateContent(false)

    }

    const focusSurveyBank = () => {
        setSurveyBankState(true)
        setOpenCreateContent(false)

    }

    const createAssignment = async ({ assignment, idTimeline }) => {
        notifySuccess(t('success'), t('add_quiz_assign'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)
        console.log('createAssignment', timelineUpdate)
        head(timelineUpdate).assignments.push(assignment)



        setDetailSubject([...detailSubject])
        setTimelinesIndex([...detailSubject])


        setIsOpenModalFunction(false)
        setTodosState(false)
        setOpenCreateContent(false)
    }

    const updateAssignment = ({ assignment, idTimeline }) => {
        notifySuccess(t('success'), t('update_assign_success'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        let target = head(timelineUpdate).assignments.find(({ _id }) => _id === assignment._id);
        //console.log('targetAssignment', target);
        let index = head(timelineUpdate).assignments.indexOf(target);

        head(timelineUpdate).assignments.splice(index, 1, assignment);

        setIsOpenModalFunction(false)
        setFocusAssignmentEdit(false)
        setOpenCreateContent(false)

        // setState({
        //     timelines: [...timelines],
        // }, () => {
        //     setState({
        //         timelinesIndex: timelines
        //     })
        //     //console.log(timelines)

        //     onCloseModalAction();
        // })
    }

    const createInformation = async ({ information, idTimeline }) => {
        // this.setState({ isLoading: true });
        const data = {
            idSubject: location.state._id,
            idTimeline: idTimeline,
            data: information
        }
        //console.log('createInformation', data);
        await restClient.asyncPost(`/announcement`, data)
            .then(res => {
                console.log('Res', res)
                if (!res.hasError) {
                    notifySuccess(t('success'), t('add_quiz_information'))
                    //console.log('information', res)
                    let timelineUpdate = detailSubject.filter(({ _id }) => _id === data.idTimeline)
                    console.log('Timeline update', timelineUpdate, res.data)
                    head(timelineUpdate).announcements.push(res.data.announcement)
                    setDetailSubject([...detailSubject])
                    setTimeout(() => setTimelinesIndex(detailSubject), 1000)
                    setOpenCreateContent(false);
                    setIsOpenModalFunction(false)
                    setNotificationState(false)
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const updateForum = ({ forum, idTimeline }) => {

        notifySuccess(t('success'), t('update_forum_success'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        let target = head(timelineUpdate).forums.find(({ _id }) => _id === forum._id);
        //console.log('targetForum', target);
        let index = head(timelineUpdate).forums.indexOf(target);

        head(timelineUpdate).forums.splice(index, 1, forum);

        setFocusForumEdit(false)
        setOpenCreateContent(false)
        setOpenCreateContent(false)
        //console.log(timelineUpdate)

        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     //console.log(timelinesList)
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })
    }

    const createForum = async ({ forum, idTimeline }) => {
        notifySuccess(t('success'), t('add_forum_timeline'))

        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        head(timelineUpdate).forums.push(forum)


        setDetailSubject([...detailSubject])



        setTimelinesIndex([...detailSubject])
        setOpenCreateContent(false)
        setIsOpenModalFunction(false)
        setForumState(false)


        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })
    }




    const createTimeline = async (timeline) => {
        // this.setState({
        //     isLoading: true
        // })

        const data = {
            idSubject: location.state._id,
            data: timeline
        }

        await restClient.asyncPost('/timeline', data)
            .then(res => {
                // this.setState({ isLoading: false });
                if (!res.hasError) {
                    notifySuccess(t('success'), t('add_quiz_timeline'))
                    setDetailSubject([...detailSubject, get(res, 'data')?.timeline])
                    setTimelinesIndex([...detailSubject, get(res, 'data')?.timeline])
                    setOpenCreateContent(false)
                    setIsOpenModalFunction(false)
                    setTimelineState(false)
                    // this.setState({
                    //     timelines: [...timelinesList, get(res, 'data').timeline],
                    //     lstTimelines: [...this.state.lstTimelines, {
                    //         _id: get(res, 'data').timeline._id,
                    //         isDeleted: get(res, 'data').timeline.isDeleted,
                    //         name: get(res, 'data').timeline.name,
                    //         description: get(res, 'data').timeline.description
                    //     }],
                    // }, () => {
                    //     this.setState({
                    //         timelinesIndex: timelinesList
                    //     })
                    // });
                    // this.onCloseModalAction();

                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const createFile = ({ file, idTimeline }) => {

        notifySuccess(t('success'), t('add_document_success'))

        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        head(timelineUpdate).files.push(file)

        //console.log(timelineUpdate)

        setDetailSubject([...detailSubject])

        setTimelinesIndex([...detailSubject])

        setIsOpenModalFunction(false)
        setOpenCreateContent(false)
        setDocumentState(false)

        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     //console.log(timelinesList)
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })
    }

    const updateFile = ({ file, idTimeline }) => {
        notifySuccess(t('success'), t('update_document_success'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)
        let target = head(timelineUpdate).files.find(({ _id }) => _id === file._id);
        //console.log('targetFile', target);
        let index = head(timelineUpdate).files.indexOf(target);
        head(timelineUpdate).files.splice(index, 1, file);

        setIsOpenModalFunction(false)
        setOpenCreateContent(false)
        setFocusFileEdit(false)
        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     //console.log(timelinesList)
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })
    }


    const createQuiz = ({ exam, idTimeline }) => {

        notifySuccess(t('success'), t('add_quiz_success'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        head(timelineUpdate).exams.push(exam)

        setDetailSubject([...detailSubject])
        setTimelinesIndex(timelinesList)

        setOpenCreateContent(false)
        setIsOpenModalFunction(false)
        setQuizState(false)


    }

    const updateQuiz = ({ exam, idTimeline }) => {
        notifySuccess(t('success'), t('update_quiz_success'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        //console.log('updateExam', exam);
        let target = head(timelineUpdate).exams.find(({ _id }) => _id === exam._id);
        //console.log('targetExam', target);
        let index = head(timelineUpdate).exams.indexOf(target);

        head(timelineUpdate).exams.splice(index, 1, exam);

        setFocusExamEdit(false)
        setOpenCreateContent(false)
        setOpenCreateContent(false)
        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     //console.log(timelinesList)
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })
    }


    const createSurvey = ({ survey, idTimeline }) => {

        notifySuccess(t('success'), t('add_quiz_survey'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        head(timelineUpdate).surveys.push(survey)

        setDetailSubject([...detailSubject])

        setTimelinesIndex(timelinesList)


        setIsOpenModalFunction(false)
        setOpenCreateContent(false)
        setSurveyState(false)
        //console.log(timelineUpdate)

        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     //console.log(timelinesList)
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })

    }
    const updateSurvey = ({ survey, idTimeline }) => {

        notifySuccess(t('success'), t('add_quiz_survey'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        console.log(head(timelineUpdate))
        let target = head(timelineUpdate).surveys.find(({ _id }) => _id === survey._id);
        //console.log('targetSurvey', target);
        let index = head(timelineUpdate).surveys.indexOf(target);

        head(timelineUpdate).surveys.splice(index, 1, survey);

        setIsOpenModalFunction(false)
        setOpenCreateContent(false)
        setFocusSurveyEdit(false)
        //console.log(timelineUpdate)

        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     //console.log(timelinesList)
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })
    }

    const onCloseModalAction = () => {
        if (focusSurveyEdit || focusFileEdit || focusAssignmentEdit || focusForumEdit || focusExamEdit) {
            setOpenCreateContent(false)
            setFocusSurveyEdit(false)
            setFocusFileEdit(false)
            setFocusAssignmentEdit(false)
            setFocusForumEdit(false)
            setFocusExamEdit(false)
        } else if (importState || exportState) {
            setOpenCreateContent(false)
        } else {
            setOpenCreateContent(true)
        }
        setIsOpenModalFunction(false);
        setNotificationState(false)
        setDocumentState(false)
        setTodosState(false)
        setQuizState(false)
        setSurveyState(false)
        setTimelineState(false)
        setForumState(false)
        setImportState(false)
        setExportState(false)
    }

    const handleImportSubject = async (data) => {
        await restClient.asyncPost(`/course/${location.state._id}/import`, data)
            .then(res => {
                console.log('res', res);
                if (!res.hasError) {
                    setDetailSubject(res.data.timelines)
                    setSurveyList(res.data.surveyBank)
                    setQuizList(res.data.quizBank)
                    notifySuccess(t('success'), res.data.message);

                    setImportState(false)
                    setOpenCreateContent(false)
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            });
    }

    const closeModalCurrentQuizBank = () => {
        setOpenCreateContent(false)
        setIsOpenModalFunction(false)
        setQuizBankState(false)
    }

    return (<>
        <div className="container-left">
            {
                isTeacherFlag && <><div onClick={(e) => { e.preventDefault(); setOpenCreateContent(true) }}>
                    <i><FontAwesomeIcon icon="wrench" /></i>
                    <span>{t('setting')}</span>
                </div>
                    <div onClick={(e) => {
                        e.preventDefault();
                        setIsOnEdit(!isOnEdit)
                    }}>
                        <i><FontAwesomeIcon icon="edit" /></i>
                        <span>{t('update')}</span>
                    </div></>
            }

            <div onClick={(e) => { e.preventDefault(); history.push(`zoom-meeting?idCourse=${location.state._id}`, { idSubject: location.state._id }) }}>
                <i><FontAwesomeIcon icon="video" /></i>
                <span>{t('call_video')}</span>
            </div>
        </div>
        <Modal visible={openCreateContent}
            className="modal-function-customize"
            onCancel={() => setOpenCreateContent(false)}
            closable={false}
            title={<div
                style={{
                    padding: '1rem 0.625rem 0.625rem 0',
                    alignItems: 'center',
                }}

            >
                <div style={{ color: '#f9f9f9' }}>{t('CHUC NANG')}</div>
                <div className="close-icon-modal" onClick={() => setOpenCreateContent(false)}>
                    <IC_CLOSE />
                </div>
            </div>}
            footer={null}
        >

            <Row style={{ justifyContent: 'space-around' }}>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#3498db',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('create_information');
                    focusNotification();
                }} >
                    {t('information')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f1c40f',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }}
                    onClick={() => {
                        openModalFunction('create_document');
                        focusDocument();
                    }}
                >
                    {t('document')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#2c3e50',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }}
                    onClick={() => {
                        openModalFunction('create_assign');
                        focusTodos();
                    }}
                >
                    {t('exercise')}
                </Col>
            </Row>
            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: "#5f27cd",
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }}
                    onClick={() => {
                        openModalFunction('create_quiz');
                        focusQuiz();
                    }}>
                    {t('quiz')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#5f27cd',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('create_survey');
                    focusSurvey();
                }}>
                    {t('survey')}
                </Col>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#1dd1a1',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('create_timeline');
                    focusTimeline();
                }}>
                    {t('timeline')}
                </Col>



            </Row>

            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#0c2461',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('create_forum');
                    focusForum();
                }} >
                    {t('forum')}
                </Col>
            </Row>

            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#0c2461',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('export_data');
                    focusExportData();
                }} >
                    {t('export')}
                </Col>
            </Row>

            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#0c2461',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('import');
                    focusImportData();
                }} >
                    {t('import')}
                </Col>
            </Row>

            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#0c2461',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('create_forum');
                    focusQuizBank();
                }} >
                    {t('Quiz Bank')}
                </Col>
            </Row>

            <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                <Col span={6} className="action-select-add-content" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#0c2461',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }} onClick={() => {
                    openModalFunction('create_forum');
                    focusSurveyBank();
                }} >
                    {t('Survey bank')}
                </Col>
            </Row>

        </Modal>
        {isOpenModalFunction && <Modal className="modal-function-customize"
            onCancel={() => onCloseModalAction()}
            visible={isOpenModalFunction}
            closable={false}
            title={<div
                style={{
                    padding: '1rem 0.625rem 0.625rem 0',
                    alignItems: 'center',
                }}

            >
                <div style={{ color: '#f9f9f9' }}>{t(currentTitle)}</div>
                <div className="close-icon-modal" onClick={() => onCloseModalAction()}>
                    <IC_CLOSE />
                </div>
            </div>}
            footer={null}
        >
            <ModalWrapper>
                {(todosState || focusAssignmentEdit) && (<AddAssignment timelinesList={timelinesList} createAssignment={createAssignment} updateAssignment={updateAssignment} idSubject={location.state._id} idTimeline={timelineIdEdit} idAssignment={assignmentIdEdit} />)}
                {(quizState || focusExamEdit) && (<AddQuiz quizList={quizList} timelinesList={timelinesList} createQuiz={createQuiz} updateQuiz={updateQuiz} idSubject={location.state._id} idTimeline={timelineIdEdit} idExam={examIdEdit} />)}
                {(surveyState || focusSurveyEdit) && (<AddSurvey timelinesList={timelinesList} surveyList={surveyList} createSurvey={createSurvey} updateSurvey={updateSurvey} idSubject={location.state._id} idTimeline={timelineIdEdit} idSurvey={surveyIdEdit} />)}
                {(documentState || focusFileEdit) && (<AddFile timelinesList={timelinesList} createFile={createFile} updateFile={updateFile} idSubject={location.state._id} idTimeline={timelineIdEdit} idFile={fileIdEdit} />)}
                {notificationState && (<AddInformation timelinesList={timelinesList} isLoading={null} createInformation={createInformation} idSubject={location.state._id} idTimeline={null} idInformation={null} />)}
                {timelineState && (<AddTimeline createTimeline={createTimeline} isLoading={null} />)}
                {(forumState || focusForumEdit) && (<AddForum timelinesList={timelinesList} createForum={createForum} updateForum={updateForum} idSubject={location.state._id} idTimeline={timelineIdEdit} idForum={forumIdEdit} />)}
                {importState && (<ImportSubject isLoading={null} handleImportSubject={handleImportSubject} />)}
                {exportState && (<ExportSubject idSubject={location.state._id} nameSubject={null} />)}
                {quizBankState && (<QuizBank idSubject={location.state._id} closeModalCurrentQuizBank={closeModalCurrentQuizBank}/>)}
            </ModalWrapper>
        </Modal>}
    </>
    )
}


export default WidgetLeft