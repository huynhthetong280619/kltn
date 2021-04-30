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
    setIsOnEdit }) => {
    const { t } = useTranslation()
    const [openCreateContent, setOpenCreateContent] = useState(false)

    const [notificationState, setNotificationState] = useState(false)
    const [documentState, setDocumentState] = useState(false)
    const [todosState, setTodosState] = useState(false)
    const [quizState, setQuizState] = useState(false)
    const [surveyState, setSurveyState] = useState(false)
    const [timelineState, setTimelineState] = useState(false)
    const [forumState, setForumState] = useState(false)
    const [importState, setImportState] = useState(false)
    const [exportState, setExportState] = useState(false)
    const [isOpenModalFunction, setIsOpenModalFunction] = useState(false)
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
        // setOpenCreateContent(false)
    }

    const focusNotification = () => {
        setNotificationState(true)
        // setOpenCreateContent(false)
    }

    const focusDocument = () => {
        setDocumentState(true)
        // setOpenCreateContent(false)
    }

    const focusSurvey = () => {
        setSurveyState(true)
        // setOpenCreateContent(false)
    }

    const focusQuiz = () => {
        setQuizState(true)
        // setOpenCreateContent(false)
    }

    const focusTimeline = () => {
        setTimelineState(true)
        // setOpenCreateContent(false)
    }

    const focusForum = () => {
        setForumState(true)
        // setOpenCreateContent(false)
    }

    const createAssignment = async ({ assignment, idTimeline }) => {
        notifySuccess(t('success'), t('add_quiz_assign'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)
        console.log('createAssignment', timelineUpdate)
        head(timelineUpdate).assignments.push(assignment)


        //console.log(timelineUpdate)

        setTimeout(() => {

            setDetailSubject([...detailSubject])
        }, 3000)

        setTimeout(() => {
            setTimelinesIndex([...detailSubject])
            onCloseModalAction();
        }, 3000)


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

    const updateAssignment = ({ assignment, idTimeline }) => {
        notifySuccess(t('success'), t('update_assign_success'))
        let timelineUpdate = timelinesList.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        let target = head(timelineUpdate).assignments.find(({ _id }) => _id === assignment._id);
        //console.log('targetAssignment', target);
        let index = head(timelineUpdate).assignments.indexOf(target);

        head(timelineUpdate).assignments.splice(index, 1, assignment);

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
        await restClient.asyncPost('/information', data)
            .then(res => {
                if (!res.hasError) {
                    notifySuccess(t('success'), t('add_quiz_information'))
                    //console.log('information', res)
                    let timelineUpdate = detailSubject.filter(({ _id }) => _id === data.idTimeline)
                    head(timelineUpdate).information.push(res.data.information)
                    setTimelinesList([...detailSubject])
                    setTimeout(() => setTimelinesIndex(detailSubject), 1000)
                    setOpenCreateContent(false);
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const updateForum = ({ forum, idTimeline }) => {

        notifySuccess(t('success'), t('update_forum_success'))
        let timelineUpdate = timelinesList.filter(({ _id }) => _id === idTimeline)

        let target = head(timelineUpdate).forums.find(({ _id }) => _id === forum._id);
        //console.log('targetForum', target);
        let index = head(timelineUpdate).forums.indexOf(target);

        head(timelineUpdate).forums.splice(index, 1, forum);

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

        setTimeout(() => {

            setDetailSubject([...detailSubject])
        }, 3000)

        setTimeout(() => {
            setTimelinesIndex([...detailSubject])
            onCloseModalAction();
        }, 3000)

        // this.setState({
        //     timelines: [...timelinesList],
        // }, () => {
        //     this.setState({
        //         timelinesIndex: timelinesList
        //     })
        //     this.onCloseModalAction();
        // })
    }


    const handleImportSubject = async (data) => {
        await restClient.asyncPost(`/subject/${location.state._id}/import-teacher`, data)
            .then(res => {
                this.setState({ isLoading: false });
                //console.log('res', res);
                if (!res.hasError) {
                    // this.setState({
                    //     lstTimelines: res.data.timelines.map(value => { return { _id: value._id, name: value.name } }),
                    //     lstSurveys: res.data.surveyBank,
                    //     lstQuizzes: res.data.quizBank,
                    //     timelines: res.data.timelines,
                    //     timelinesIndex: res.data.timelines
                    // });
                    notifySuccess(t('success'), res.data.message);
                    // this.onCloseModalAction();
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            });
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

        setTimeout(() => {
            setDetailSubject([...detailSubject])
        }, 3000)

        setTimeout(() => {
            setTimelinesIndex([...detailSubject])
            onCloseModalAction()
        }, 3000)

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
        let timelineUpdate = timelinesList.filter(({ _id }) => _id === idTimeline)
        let target = head(timelineUpdate).files.find(({ _id }) => _id === file._id);
        //console.log('targetFile', target);
        let index = head(timelineUpdate).files.indexOf(target);
        head(timelineUpdate).files.splice(index, 1, file);
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

        console.log('timelineUpdate', timelineUpdate, exam, idTimeline)
        head(timelineUpdate).exams.push(exam)


        //console.log(timelineUpdate)

        setTimeout(() => {
            setTimelinesList([...timelinesList])
        }, 3000)

        setTimeout(() => {
            setTimelinesIndex(timelinesList)
        }, 3000)

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

    const updateQuiz = ({ exam, idTimeline }) => {
        notifySuccess(t('success'), t('update_quiz_success'))
        let timelineUpdate = detailSubject.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        //console.log('updateExam', exam);
        let target = head(timelineUpdate).exams.find(({ _id }) => _id === exam._id);
        //console.log('targetExam', target);
        let index = head(timelineUpdate).exams.indexOf(target);

        head(timelineUpdate).exams.splice(index, 1, exam);

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

        setTimeout(() => {
            setTimelinesList([...timelinesList])
        }, 3000)

        setTimeout(() => {
            setTimelinesIndex(timelinesList)
            onCloseModalAction()
        }, 3000)

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
        let timelineUpdate = timelinesList.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        let target = head(timelineUpdate).surveys.find(({ _id }) => _id === survey._id);
        //console.log('targetSurvey', target);
        let index = head(timelineUpdate).surveys.indexOf(target);

        head(timelineUpdate).surveys.splice(index, 1, survey);


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
        setIsOpenModalFunction(false);
        setOpenCreateContent(true)
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

    return (<>
        <div className="container-left">
            <a onClick={() => setOpenCreateContent(true)}>
                <i><FontAwesomeIcon icon="wrench" /></i>
                <span>{t('setting')}</span>
            </a>
            <a>
                <i><FontAwesomeIcon icon="sort-amount-up" /> </i>
                <span>{t('arrange')}</span>
            </a>
            <a onClick={(e) => {
                e.preventDefault();
                setIsOnEdit(!isOnEdit)
            }}>
                <i><FontAwesomeIcon icon="edit" /></i>
                <span>{t('update')}</span>
            </a>
            <a onClick={() => history.push('zoom-meeting')}>
                <i><FontAwesomeIcon icon="video" /></i>
                <span>{t('call_video')}</span>
            </a>
        </div>
        <Drawer
            title={t('manage_content')}
            placement="bottom"
            closable={false}
            onClose={() => setOpenCreateContent(false)}
            visible={openCreateContent}
            key="right"
            width={540}
            style={{ textAlign: 'center' }}
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

        </Drawer>
        <Modal className="modal-function-customize"
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
                {todosState && (<AddAssignment timelinesList={timelinesList} createAssignment={createAssignment} updateAssignment={updateAssignment} idSubject={location.state._id} idTimeline={null} idAssignment={null} />)}
                {quizState && (<AddQuiz quizList={quizList} timelinesList={timelinesList} createQuiz={createQuiz} updateQuiz={updateQuiz} idSubject={location.state._id} idTimeline={null} idExam={null} />)}
                {surveyState && (<AddSurvey timelinesList={timelinesList} surveyList={surveyList} createSurvey={createSurvey} updateSurvey={updateSurvey} idSubject={location.state._id} idTimeline={null} idSurvey={null} />)}
                {documentState && (<AddFile timelinesList={timelinesList} createFile={createFile} updateFile={updateFile} idSubject={location.state._id} idTimeline={null} idFile={null} />)}
                {notificationState && (<AddInformation timelinesList={timelinesList} isLoading={null} createInformation={createInformation} idSubject={location.state._id} idTimeline={null} idInformation={null} />)}
                {timelineState && (<AddTimeline createTimeline={createTimeline} isLoading={null} />)}
                {importState && (<ImportSubject isLoading={null} handleImportSubject={handleImportSubject} />)}
                {forumState && (<AddForum timelinesList={timelinesList} createForum={createForum} updateForum={updateForum} idSubject={location.state._id} idTimeline={null} idForum={null} />)}
                {exportState && (<ExportSubject idSubject={location.state._id} nameSubject={null} />)}
            </ModalWrapper>
        </Modal>
    </>
    )
}


export default WidgetLeft