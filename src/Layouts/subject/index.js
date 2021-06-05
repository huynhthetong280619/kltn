import React, { useContext, useEffect, useState } from 'react'
import WidgetLeft from '../../components/widget-left'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Timeline, Tooltip, Row, Col, Modal } from 'antd'
import './styles.scss'
import { useTranslation } from 'react-i18next';
import FORUM from '../../assets/images/contents/forum.png'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RestClient from '../../utils/restClient';
import { StoreTrading } from '../../store-trading';
import { useHistory, useLocation } from 'react-router';
import { get, isEmpty, pick, head } from 'lodash';
import ModalLoadingLogin from '../login/modal-loading-login';
import AssignmentModal from '../assignmentModal/assignmentModal';
import AddAssignment from '../addAssignment/addAssignment.jsx';
import WidgeRight from '../../components/widget-right';
import { notifyError, notifySuccess } from '../../assets/common/core/notify';

import { ReactComponent as DashManage } from '../../assets/images/contents/dashboard.svg'
import { CSVLink } from 'react-csv';
import downloadFile from '../../assets/common/core/downloadFile';
import { ReactComponent as ManageSubject } from '../../assets/images/mn.svg'
import ModalWrapper from '../../components/basic/modal-wrapper';

import AddQuiz from '../addQuiz/addQuiz';
import AddSurvey from '../addSurvey/addSurvey';

import AddInformation from '../addInformation/addInformation';
import AddTimeline from '../addTimeline/addTimeline';
import AddForum from '../addForum/addForum';
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'
import QuizBank from '../quiz-bank';
import AddFile from '../addFile/addFile';

const Subject = () => {
    const { t } = useTranslation()
    const { authFlag, token } = useContext(StoreTrading)
    const location = useLocation()

    const [currentTitle, setCurrentTitle] = useState('')
    const [detailSubject, setDetailSubject] = useState([])
    const [timelinesIndex, setTimelinesIndex] = useState(detailSubject)
    const [loadingSubject, setLoadingSubject] = useState(true)
    const [timelinesList, setTimelinesList] = useState([])
    const [quizList, setQuizList] = useState([])
    const [surveyList, setSurveyList] = useState([])
    const [assignmentRequirement, setAssignmentRequirement] = useState({})
    const [idTimelineRequired, setIdTimelineRequired] = useState('')
    const [isSubmitAssignment, setIsSubmitAssignment] = useState(false)
    const [isTodoModal, setIsTodoModal] = useState(false)
    const [isCommentAssignment, setIsCommentAssignment] = useState(false)
    const [isOnEdit, setIsOnEdit] = useState(false)

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

    const [timelineIdEdit, setTimelineIdEdit] = useState('')
    const [surveyIdEdit, setSurveyIdEdit] = useState('')
    const [focusSurveyEdit, setFocusSurveyEdit] = useState(false)

    const [fileIdEdit, setFileIdEdit] = useState('')
    const [focusFileEdit, setFocusFileEdit] = useState(false)

    const [assignmentIdEdit, setAssignmentIdEdit] = useState('')
    const [focusAssignmentEdit, setFocusAssignmentEdit] = useState(false)

    const [forumIdEdit, setForumIdEdit] = useState('')
    const [focusForumEdit, setFocusForumEdit] = useState(false)

    const [examIdEdit, setExamIdEdit] = useState('')
    const [focusExamEdit, setFocusExamEdit] = useState(false)

    const [isTeacherFlag, setIsTeacherFlag] = useState(false)

    const [quizBankState, setQuizBankState] = useState(false)
    const [submissionAssigmentId, setSubmissionAssigmentId] = useState('')

    const history = useHistory()
    const restClient = new RestClient({ token })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.idPrivilege == 'student') {
            setIsTeacherFlag(false)
        }

        if (user?.idPrivilege == 'teacher') {
            setIsTeacherFlag(true)
        }

        queryDetailSubject()
        queryListTimelines()
        queryListQuiz()
        querySurveyList()

        setTimeout(() => {
            setLoadingSubject(false)
        }, 5000);
    }, [])

    const queryDetailSubject = () => {
        setLoadingSubject(true)

        restClient.asyncGet(`/course/${location.state._id}`)
            .then(res => {
                console.log('res', res)
                if (!res.hasError) {
                    console.log(res?.data);
                    setLoadingSubject(false)
                    setDetailSubject(res?.data?.course?.timelines)
                }
            })
    }

    const queryListTimelines = () => {

        restClient.asyncGet(`/timeline?idCourse=${location.state._id}`)
            .then(res => {
                console.log('res', res)
                if (!res.hasError) {
                    console.log(res?.data);
                    setTimelinesList(res?.data?.timelines)
                }
            })
    }

    const queryListQuiz = () => {
        restClient.asyncGet(`/quiz-bank?idCourse=${location.state._id}`)
            .then(res => {
                console.log('quiz list', res)
                if (!res.hasError) {
                    setQuizList(res?.data?.quizBank)
                }
            })
    }

    const querySurveyList = () => {
        restClient.asyncGet(`/survey-bank?idCourse=${location.state._id}`)
            .then(res => {
                if (!res.hasError) {
                    setSurveyList(res?.data?.surveyBank)
                }
            })
    }


    const handleOnDragEnd = async (result) => {
        //console.log('handleOnDragEnd', result)
        if (!result.destination) return;

        const items = Array.from(detailSubject);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDetailSubject(items)

        let uptTimelines = [];
        uptTimelines = items.map(item => pick(item, ['_id', 'index']));

        const cv = uptTimelines.map((item, index) => {
            return {
                ...item,
                index: index + 1,
                //name: `Tuần ${index < 10 ? 0 : ''}` + (index + 1)
            }
        })

        updateTimelinesIndex(cv)

    }

    const updateTimelinesIndex = async (updateTimelines) => {
        await restClient.asyncPost(`/course/${location.state._id}/index`, updateTimelines)
            .then(res => {
                console.log('Update timeline', res)
                if (!res.hasError) {
                    notifySuccess(t('success'), get(res, 'data').message);
                    // setTimelineState(get(res, 'data').timelines)
                    // this.setState({
                    //     timelines: get(res, 'data').timelines,
                    //     timelineIndex: get(res, 'data').timelines,
                    // })
                    return true;
                }
                return false
            })


    }

    const getRequirementTodo = async (obj) => {

        if (isTeacherFlag) {
            history.push('check-assignment', { ...obj, idSubject: location.state._id })
        } else {
            setIsTodoModal(true)
            await restClient.asyncGet(`/assignment/${obj.idTodo}?idCourse=${location.state._id}&idTimeline=${obj.idTimeline}`)
                .then(res => {
                    console.log('getRequirementTodo', res)
                    if (!res.hasError) {
                        setAssignmentRequirement(get(res, 'data').assignment)
                        setIdTimelineRequired(obj.idTimeline)
                        setSubmissionAssigmentId(get(res, 'data').assignment?.submission?._id)
                    } else {
                        notifyError(t('failure'), res.data.message);
                    }
                })
        }


    }

    const onSubmitAssignment = () => {
        setIsSubmitAssignment(true)
    }

    const onCancelSubmitAssignment = () => {
        setIsSubmitAssignment(false)
    }


    const commentAssignmentGrade = async ({ comment, idAssignment }) => {
        setIsCommentAssignment(true);
        await restClient.asyncPost(`/assignment/${idAssignment}/comment/${submissionAssigmentId}?idCourse=${location.state._id}&idTimeline=${idTimelineRequired}`, { idSubject: location.state._id, idTimeline: idTimelineRequired, comment: comment }, token)
            .then(res => {
                setIsCommentAssignment(false);
                if (!res.hasError) {
                    notifySuccess(t('success'), res.data.message)
                    //console.log('Notification', res)
                    let submission = res.data.submission;
                    //console.log('OLD-ASSIGNMENT', assignmentRequirement);
                    setAssignmentRequirement({ ...assignmentRequirement, submission: submission })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const closeTodoModal = () => {
        setIsTodoModal(false)
        setAssignmentRequirement(null)
    };

    const submissionFile = async ({ file, idAssignment }) => {
        await restClient.asyncPost(`/assignment/${idAssignment}/submit`, { idSubject: location.state._id, idTimeline: idTimelineRequired, file: file })
            .then(res => {
                setIsSubmitAssignment(false)
                if (!res.hasError) {
                    notifySuccess(t('success'), t('submit_success'))
                    //console.log('Notification', res)
                    let submission = res.data.submission;
                    //console.log('OLD-ASSIGNMENT', this.state.assignmentRequirement);
                    setAssignmentRequirement({ ...assignmentRequirement, submission: submission, submissionStatus: true })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const directForum = (obj) => {
        history.push('topic', obj)
    }

    const directExams = (obj) => {
        history.push('quiz', obj)
    }

    const directManageStudent = () => {
        history.push('manage-student', { idSubject: location.state._id })
    }

    const directManageScore = () => {
        history.push('manage-score', { idSubject: location.state._id })
    }

    const directSurvey = (obj) => {
        history.push('survey', obj)
    }

    const focusEditSurvey = (surveyId, timelineId) => {
        console.log('focusEditSurvey', surveyId, timelineId)
        setSurveyIdEdit(surveyId);
        setTimelineIdEdit(timelineId)
        setFocusSurveyEdit(true)
        setIsOpenModalFunction(true)
    }

    const focusEditFile = (fileId, timelineId) => {
        console.log('focusEditFile', fileId, timelineId)
        setFileIdEdit(fileId);
        setTimelineIdEdit(timelineId)
        setFocusFileEdit(true)
        setIsOpenModalFunction(true)
    }

    const focusEditAssignment = (assignmentId, timelineId) => {
        console.log('focusEditAssignment', assignmentId, timelineId)
        setAssignmentIdEdit(assignmentId);
        setTimelineIdEdit(timelineId)
        setFocusAssignmentEdit(true)
        setIsOpenModalFunction(true)
    }

    const focusEditForum = (forumId, timelineId) => {
        console.log('focusEditForum', forumId, timelineId)
        setForumIdEdit(forumId);
        setTimelineIdEdit(timelineId)
        setFocusForumEdit(true)
        setIsOpenModalFunction(true)
    }

    const focusEditExams = (examId, timelineId) => {
        console.log('focusEditExam', examId, timelineId)
        setExamIdEdit(examId);
        setTimelineIdEdit(timelineId)
        setFocusExamEdit(true)
        setIsOpenModalFunction(true)
    }

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


    const focusQuizBank = () => {
        setQuizBankState(true)
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
            idCourse: location.state._id,
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
        setIsOpenModalFunction(false)
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
            idCourse: location.state._id,
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
        setQuizBankState(false)
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

    if (loadingSubject) {
        return <ModalLoadingLogin visible={loadingSubject} content={t("loading_class")} />
    } else {
        return <>
            {
                isTeacherFlag ? (<>
                    <Row>
                        <Col span={16}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="characters">
                                    {(provided) => (
                                        <div  {...provided.droppableProps}
                                            ref={provided.innerRef}>
                                            {
                                                detailSubject.map(({ _id, name, description, assignments, exams, forums, announcements, files, surveys }, index) => {
                                                    return <Draggable key={_id.toString()} draggableId={_id} index={index}>
                                                        {(provided) => (
                                                            <div className="subject-container" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index.toString()}>
                                                                <div className="subject-wrapper">
                                                                    <div className="subject-header">
                                                                        <div className="text-center">{`${t('week')} ${index < 9 ? ('0' + (index + 1)) : (index + 1)}: ${name}`}</div>
                                                                        <div className="description text-center">{description}</div>
                                                                    </div>
                                                                    <div className="wrapper-body">

                                                                        {

                                                                            !isEmpty(announcements) && (
                                                                                <div className="subject-body">
                                                                                    <div className="announce-wrapper">
                                                                                        {announcements.map((info, indexAnnounce) => {
                                                                                            return (<div key={indexAnnounce}>
                                                                                                <div className="announce-name">{info.name}</div>
                                                                                                <div className="announce-content">{info.content}</div>
                                                                                            </div>
                                                                                            )
                                                                                        })}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }

                                                                        {

                                                                            !isEmpty(surveys) && (<>
                                                                                {
                                                                                    surveys.map((survey, index) => (
                                                                                        <div className="subject-body" onClick={() => directSurvey({ surveyId: survey._id, idSubject: location.state._id, timelineId: _id })}>
                                                                                            <div className="subject-main">
                                                                                                <div className="subject-icon">
                                                                                                    {/* <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} /> */}
                                                                                                    <FontAwesomeIcon icon="poll" style={{ width: 30, height: 30, color: '#ff4000' }} />
                                                                                                </div>
                                                                                                <div className="subject-content">{survey.name}</div>
                                                                                            </div>
                                                                                            <div className="subject-action">
                                                                                                {
                                                                                                    isOnEdit && <div>
                                                                                                        <Tooltip title={t('edit_file')}>
                                                                                                            <FontAwesomeIcon icon="edit" onClick={(e) => { e.stopPropagation(); focusEditSurvey(survey._id, _id) }} />
                                                                                                        </Tooltip>
                                                                                                    </div>
                                                                                                }
                                                                                                {
                                                                                                    !survey.isDeleted ?
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                            )
                                                                        }

                                                                        {

                                                                            !isEmpty(files) && (<>
                                                                                {
                                                                                    files.map((file, index) => (
                                                                                        <div className="subject-body">
                                                                                            <div className="subject-main" >
                                                                                                <div className="subject-icon">
                                                                                                    {file.type.includes('doc') && (
                                                                                                        <i>
                                                                                                            <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />
                                                                                                        </i>
                                                                                                    )}
                                                                                                    {file.type.includes('pdf') && (
                                                                                                        <i>
                                                                                                            <FontAwesomeIcon icon='file-pdf' style={{ width: 30, height: 30, color: '#f44236' }} />
                                                                                                        </i>
                                                                                                    )}
                                                                                                    {file.type.includes('ppt') && (
                                                                                                        <i>
                                                                                                            <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />
                                                                                                        </i>
                                                                                                    )}
                                                                                                    {(file.type.includes('xls') || file.type.includes('csv')) && (
                                                                                                        <i>
                                                                                                            <FontAwesomeIcon icon='file-excel' style={{ width: 30, height: 30, color: '#1a7243' }} />
                                                                                                        </i>
                                                                                                    )}

                                                                                                    {(file.type.includes('rar') || (file.type.includes('zip')) && (
                                                                                                        <i>
                                                                                                            <FontAwesomeIcon icon='archive' style={{ width: 30, height: 30, color: '#9e6fb2' }} />
                                                                                                        </i>
                                                                                                    ))}

                                                                                                    {!(file.type.includes('ppt')) && !(file.type.includes('doc')) && !(file.type.includes('pdf'))
                                                                                                        && !(file.type.includes('xls')) && !(file.type.includes('csv')) && !(file.type.includes('rar')) && !(file.type.includes('zip'))
                                                                                                        && (
                                                                                                            <i>
                                                                                                                <FontAwesomeIcon icon='file-alt' style={{ width: 30, height: 30, color: '#273c75' }} />
                                                                                                            </i>
                                                                                                        )}
                                                                                                </div>
                                                                                                <div className="subject-content" onClick={(e) => { downloadFile(file) }}>{file.name}</div>
                                                                                            </div>
                                                                                            <div className="subject-action">
                                                                                                {
                                                                                                    isOnEdit && <div>
                                                                                                        <Tooltip title={t('edit_file')}>
                                                                                                            <FontAwesomeIcon icoăn="edit" onClick={(e) => { e.stopPropagation(); focusEditFile(file._id, _id) }} />
                                                                                                        </Tooltip>
                                                                                                    </div>
                                                                                                }
                                                                                                {
                                                                                                    !file.isDeleted ?
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                            )
                                                                        }

                                                                        {
                                                                            !isEmpty(assignments) && (<>
                                                                                {
                                                                                    assignments.map((assignment, index) => (
                                                                                        <div className="subject-body" onClick={() => getRequirementTodo({ idTodo: assignment._id, idTimeline: _id })}>
                                                                                            <div className="subject-main">
                                                                                                <div className="subject-icon">
                                                                                                    <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                                                                                                </div>
                                                                                                <div className="subject-content">{assignment.name}</div>
                                                                                            </div>
                                                                                            <div className="subject-action">
                                                                                                {
                                                                                                    isOnEdit && <div>
                                                                                                        <Tooltip title={t('edit_file')}>
                                                                                                            <FontAwesomeIcon icon="edit" onClick={(e) => { e.stopPropagation(); focusEditAssignment(assignment._id, _id) }} />
                                                                                                        </Tooltip>
                                                                                                    </div>
                                                                                                }
                                                                                                {
                                                                                                    !assignment.isDeleted ?
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                            )
                                                                        }


                                                                        {
                                                                            !isEmpty(forums) && (<>
                                                                                {
                                                                                    forums.map((forum, index) => (
                                                                                        <div className="subject-body" onClick={() => directForum({ forumId: forum._id, idSubject: location.state._id, idTimeline: _id })}>
                                                                                            <div className="subject-main">
                                                                                                <div className="subject-icon">
                                                                                                    <img src={FORUM} width={30} />
                                                                                                </div>
                                                                                                <div className="subject-content">{forum.name}</div>
                                                                                            </div>
                                                                                            <div className="subject-action">
                                                                                                {
                                                                                                    isOnEdit && <div>
                                                                                                        <Tooltip title={t('edit_file')}>
                                                                                                            <FontAwesomeIcon icon="edit" onClick={(e) => { e.stopPropagation(); focusEditForum(forum._id, _id) }} />
                                                                                                        </Tooltip>
                                                                                                    </div>
                                                                                                }
                                                                                                {
                                                                                                    !forum.isDeleted ?
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                            )
                                                                        }


                                                                        {
                                                                            !isEmpty(exams) && (<>
                                                                                {
                                                                                    exams.map((exam, index) => (
                                                                                        <div className="subject-body" onClick={() => directExams({ examId: exam._id, idSubject: location.state._id, idTimeline: _id })}>
                                                                                            <div className="subject-main">
                                                                                                <div className="subject-icon">
                                                                                                    <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                                                                                                </div>
                                                                                                <div className="subject-content">{exam.name}</div>
                                                                                            </div>
                                                                                            <div className="subject-action">
                                                                                                {
                                                                                                    isOnEdit && <div>
                                                                                                        <Tooltip title={t('edit_file')}>
                                                                                                            <FontAwesomeIcon icon="edit" onClick={(e) => { e.stopPropagation(); focusEditExams(exam._id, _id) }} />
                                                                                                        </Tooltip>
                                                                                                    </div>
                                                                                                }

                                                                                                {
                                                                                                    !exam.isDeleted ?
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div>
                                                                                                            <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                                                        </div>
                                                                                                }

                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                            )
                                                                        }

                                                                    </div>


                                                                </div>

                                                            </div>
                                                        )}
                                                    </Draggable>
                                                })
                                            }
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Col>
                        <Col span={8} style={{ padding: '10px', display: 'flex', flexDirection: 'column', rowGap: '0.75rem' }}>
                            <ModalWrapper>
                                <div style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#f9f9f9' }}>QUẢN LÝ & TIỆN ÍCH</div>
                                <Row style={{ justifyContent: 'space-between', columnGap: '0.5rem' }}>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#3498db',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                        onClick={() => isTeacherFlag ? directManageStudent() : directManageScore()}
                                    >
                                        {isTeacherFlag ? t('manage_student') : t('manage_point')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#f1c40f',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                        onClick={(e) => { e.preventDefault(); history.push(`zoom-meeting?idCourse=${location.state._id}`, { idSubject: location.state._id }) }}
                                    >
                                        {t('call_video')}
                                    </Col>
                                    {isTeacherFlag &&
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#2c3e50',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsOnEdit(!isOnEdit)
                                        }}
                                    >
                                        {t('update')}
                                    </Col>}
                                </Row>
                            </ModalWrapper>
                            <ModalWrapper>
                                <div style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#f9f9f9' }}>CHỨC NĂNG NGHIỆP VỤ</div>
                                <Row style={{ justifyContent: 'space-between', columnGap: '0.5rem' }}>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#3498db',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('create_information');
                                        focusNotification();
                                    }} 
                                    >
                                        {t('information')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#f1c40f',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('create_document');
                                        focusDocument();
                                    }}
                                    >
                                        {t('document')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#2c3e50',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('create_assign');
                                        focusTodos();
                                    }}
                                    >
                                        {t('exercise')}
                                    </Col>
                                </Row>
                                <Row style={{ justifyContent: 'space-between', marginTop: '10px', columnGap: '0.5rem' }}>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: "#5f27cd",
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('create_quiz');
                                        focusQuiz();
                                    }}
                                    >
                                        {t('quiz')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#5f27cd',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('create_survey');
                                        focusSurvey();
                                    }}
                                    >
                                        {t('survey')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#1dd1a1',
                                        color: '#fff',
                                        borderRadius: '0.5rem',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('create_timeline');
                                        focusTimeline();
                                    }}
                                    >
                                        {t('timeline')}
                                    </Col>



                                </Row>
                                <Row style={{ justifyContent: 'space-between', marginTop: '10px', columnGap: '0.5rem' }}>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#0c2461',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('create_forum');
                                        focusForum();
                                    }}
                                    >
                                        {t('forum')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#0c2461',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                    onClick={() => {
                                        openModalFunction('Quiz Bank');
                                        focusQuizBank();
                                    }}
                                    >
                                        {t('Quiz Bank')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" 
                                    >
                                    </Col>
                                </Row>
                            </ModalWrapper>
                        </Col>
                    </Row>

                    {/* <WidgeRight

                        isOpenModalFunction={is OpenModalFunction}
                        setIsOpenModalFunction={setIsOpenModalFunction}
                        importState={importState}
                        setImportState={setImportState}
                        exportState={exportState}
                        setExportState={setExportState} /> */}
                </>
                ) : (
                    <Row>
                        <Col span={16}>
                            {
                                detailSubject.map(({ _id, name, description, assignments, exams, forums, announcements, files, surveys }, index) => {
                                    return (
                                        <div className="subject-container" key={index.toString()}>
                                            <div className="subject-wrapper">
                                                <div className="subject-header">
                                                    <div className="text-center">{`${t('week')} ${index < 9 ? ('0' + (index + 1)) : (index + 1)}: ${name}`}</div>
                                                    <div className="description text-center">{description}</div>
                                                </div>
                                                <div className="wrapper-body">
            
                                                    {
            
                                                        !isEmpty(announcements) && (
                                                            <div className="subject-body">
                                                                <div className="announce-wrapper">
                                                                    {announcements.map((info, indexAnnounce) => {
                                                                        return (<div key={indexAnnounce}>
                                                                            <div className="announce-name">{info.name}</div>
                                                                            <div className="announce-content">{info.content}</div>
                                                                        </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
            
                                                    {
            
                                                        !isEmpty(surveys) && (<>
                                                            {
                                                                surveys.map((survey, index) => (
                                                                    <div className="subject-body" onClick={() => directSurvey({ surveyId: survey._id, idSubject: location.state._id, timelineId: _id })}>
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                {/* <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} /> */}
                                                                                <FontAwesomeIcon icon="poll" style={{ width: 30, height: 30, color: '#ff4000' }} />
                                                                            </div>
                                                                            <div className="subject-content">{survey.name}</div>
                                                                        </div>
            
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                        )
                                                    }
            
                                                    {
            
                                                        !isEmpty(files) && (<>
                                                            {
                                                                files.map((file, index) => (
                                                                    <div className="subject-body">
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                {file.type.includes('doc') && (
                                                                                    <i>
                                                                                        <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />
                                                                                    </i>
                                                                                )}
                                                                                {file.type.includes('pdf') && (
                                                                                    <i>
                                                                                        <FontAwesomeIcon icon='file-pdf' style={{ width: 30, height: 30, color: '#f44236' }} />
                                                                                    </i>
                                                                                )}
                                                                                {file.type.includes('ppt') && (
                                                                                    <i>
                                                                                        <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />
                                                                                    </i>
                                                                                )}
                                                                                {(file.type.includes('xls') || file.type.includes('csv')) && (
                                                                                    <i>
                                                                                        <FontAwesomeIcon icon='file-excel' style={{ width: 30, height: 30, color: '#1a7243' }} />
                                                                                    </i>
                                                                                )}
            
                                                                                {(file.type.includes('rar') || (file.type.includes('zip')) && (
                                                                                    <i>
                                                                                        <FontAwesomeIcon icon='archive' style={{ width: 30, height: 30, color: '#9e6fb2' }} />
                                                                                    </i>
                                                                                ))}
            
                                                                                {!(file.type.includes('ppt')) && !(file.type.includes('doc')) && !(file.type.includes('pdf'))
                                                                                    && !(file.type.includes('xls')) && !(file.type.includes('csv')) && !(file.type.includes('rar')) && !(file.type.includes('zip'))
                                                                                    && (
                                                                                        <i>
                                                                                            <FontAwesomeIcon icon='file-alt' style={{ width: 30, height: 30, color: '#273c75' }} />
                                                                                        </i>
                                                                                    )}
                                                                            </div>
                                                                            <div className="subject-content" onClick={(e) => { downloadFile(file) }}>{file.name}</div>
                                                                        </div>
            
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                        )
                                                    }
            
                                                    {
                                                        !isEmpty(assignments) && (<>
                                                            {
                                                                assignments.map((assignment, index) => (
                                                                    <div className="subject-body" onClick={() => getRequirementTodo({ idTodo: assignment._id, idTimeline: _id })}>
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                                                                            </div>
                                                                            <div className="subject-content">{assignment.name}</div>
                                                                        </div>
            
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                        )
                                                    }
            
            
                                                    {
                                                        !isEmpty(forums) && (<>
                                                            {
                                                                forums.map((forum, index) => (
                                                                    <div className="subject-body" onClick={() => directForum({ forumId: forum._id, idSubject: location.state._id, idTimeline: _id })}>
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                <img src={FORUM} width={30} />
                                                                            </div>
                                                                            <div className="subject-content">{forum.name}</div>
                                                                        </div>
            
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                        )
                                                    }
            
            
                                                    {
                                                        !isEmpty(exams) && (<>
                                                            {
                                                                exams.map((exam, index) => (
                                                                    <div className="subject-body" onClick={() => directExams({ examId: exam._id, idSubject: location.state._id, idTimeline: _id })}>
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                                                                            </div>
                                                                            <div className="subject-content">{exam.name}</div>
                                                                        </div>
            
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                        )
                                                    }
            
                                                </div>
            
            
                                            </div>
            
                                        </div>
            
                                    )
                                })
                            }
                        </Col>
                        <Col span={8} style={{ padding: '10px', display: 'flex', flexDirection: 'column', rowGap: '0.75rem' }}>
                            <ModalWrapper>
                                <div style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#f9f9f9' }}>QUẢN LÝ & TIỆN ÍCH</div>
                                <Row style={{ justifyContent: 'space-between', columnGap: '0.5rem' }}>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#3498db',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                        onClick={() => isTeacherFlag ? directManageStudent() : directManageScore()}
                                    >
                                        {isTeacherFlag ? t('manage_student') : t('manage_point')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#f1c40f',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                        onClick={(e) => { e.preventDefault(); history.push(`zoom-meeting?idCourse=${location.state._id}`, { idSubject: location.state._id }) }}
                                    >
                                        {t('call_video')}
                                    </Col>
                                    <Col span={7} className="action-select-add-content" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#2c3e50',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        height: '6rem'
                                    }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsOnEdit(!isOnEdit)
                                        }}
                                    >
                                        {t('update')}
                                    </Col>
                                </Row>
                            </ModalWrapper>
                        </Col>
                    </Row>

                    
                )
            }
            {/* <WidgetLeft
                timelinesList={timelinesList}
                setTimelinesList={setTimelinesList}
                quizList={quizList} setQuizList={setQuizList}
                surveyList={surveyList} setSurveyList={setSurveyList}
                detailSubject={detailSubject}
                setDetailSubject={setDetailSubject}
                isOnEdit={isOnEdit}
                setIsOnEdit={setIsOnEdit}

                openCreateContent={openCreateContent}
                setOpenCreateContent={setOpenCreateContent}
                notificationState={notificationState}
                setNotificationState={setNotificationState}
                documentState={documentState}
                setDocumentState={setDocumentState}
                todosState={todosState}
                setTodosState={setTodosState}
                quizState={quizState}
                setQuizState={setQuizState}
                surveyState={surveyState}
                setSurveyState={setSurveyState}
                timelineState={timelineState}
                setTimelineState={setTimelineState}
                forumState={forumState}
                setForumState={setForumState}

                isOpenModalFunction={isOpenModalFunction}
                setIsOpenModalFunction={setIsOpenModalFunction}

                surveyIdEdit={surveyIdEdit}
                timelineIdEdit={timelineIdEdit}
                focusSurveyEdit={focusSurveyEdit}
                setFocusSurveyEdit={setFocusSurveyEdit}

                fileIdEdit={fileIdEdit}
                focusFileEdit={focusFileEdit}
                setFocusFileEdit={setFocusFileEdit}

                assignmentIdEdit={assignmentIdEdit}
                focusAssignmentEdit={focusAssignmentEdit}
                setFocusAssignmentEdit={setFocusAssignmentEdit}

                forumIdEdit={forumIdEdit}
                focusForumEdit={focusForumEdit}
                setFocusForumEdit={setFocusForumEdit}

                examIdEdit={examIdEdit}
                focusExamEdit={focusExamEdit}
                setFocusExamEdit={setFocusExamEdit}

                setImportState={setImportState}
                setExportState={setExportState}
                importState={importState}
                exportState={exportState}
                isTeacherFlag={isTeacherFlag}

                quizBankState={quizBankState}
                setQuizBankState={setQuizBankState}
            /> */}

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
                    {/* {importState && (<ImportSubject isLoading={null} handleImportSubject={handleImportSubject} />)}
                {exportState && (<ExportSubject idSubject={location.state._id} nameSubject={null} />)} */}
                    {quizBankState && (<QuizBank idSubject={location.state._id} closeModalCurrentQuizBank={closeModalCurrentQuizBank} />)}
                </ModalWrapper>
            </Modal>}


            <AssignmentModal
                isTodoModal={isTodoModal}
                isSubmitAssignment={isSubmitAssignment}
                isCommentAssignment={isCommentAssignment}
                commentAssignmentGrade={commentAssignmentGrade}
                assignment={assignmentRequirement}
                handleCancelModal={closeTodoModal}
                submitAssignment={submissionFile}
                onSubmitAssignment={onSubmitAssignment}
                onCancelSubmitAssignment={onCancelSubmitAssignment} />

        </>
    }
}

export default Subject;