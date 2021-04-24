import React, { useContext, useEffect, useState } from 'react'
import WidgetLeft from '../../components/widget-left'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Timeline, Tooltip } from 'antd'
import './styles.scss'
import { useTranslation } from 'react-i18next';
import FORUM from '../../assets/images/contents/forum.png'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RestClient from '../../utils/restClient';
import { StoreTrading } from '../../store-trading';
import { useHistory, useLocation } from 'react-router';
import { get, isEmpty, pick } from 'lodash';
import ModalLoadingLogin from '../login/modal-loading-login';
import AssignmentModal from '../assignmentModal/assignmentModal';
import AddAssignment from '../addAssignment/addAssignment.jsx';
import WidgeRight from '../../components/widget-right';
import { notifyError, notifySuccess } from '../../assets/common/core/notify';


const Subject = () => {
    const { t } = useTranslation()
    const { authFlag, token } = useContext(StoreTrading)
    const location = useLocation()

    const [detailSubject, setDetailSubject] = useState([])
    const [loadingSubject, setLoadingSubject] = useState(false)
    const [timelinesList, setTimelinesList] = useState([])
    const [quizList, setQuizList] = useState([])
    const [surveyList, setSurveyList] = useState([])
    const [assignmentRequirement, setAssignmentRequirement] = useState({})
    const [idTimelineRequired, setIdTimelineRequired] = useState('')
    const [isSubmitAssignment, setIsSubmitAssignment] = useState(false)
    const [isTodoModal, setIsTodoModal] = useState(false)
    const [isCommentAssignment, setIsCommentAssignment] = useState(false)
    const history = useHistory()
    const restClient = new RestClient({ token })

    useEffect(() => {
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

        restClient.asyncGet(`/subject/${location.state._id}`)
            .then(res => {
                if (!res.hasError) {
                    console.log(res?.data);
                    setLoadingSubject(false)
                    setDetailSubject(res?.data?.subject?.timelines)
                }
            })
    }

    const queryListTimelines = () => {

        restClient.asyncGet(`/timeline?idSubject=${location.state._id}`)
            .then(res => {
                if (!res.hasError) {
                    console.log(res?.data);
                    setTimelinesList(res?.data?.timelines)
                }
            })
    }

    const queryListQuiz = () => {
        restClient.asyncGet(`/quiz?idSubject=${location.state._id}`)
            .then(res => {
                if (!res.hasError) {
                    setQuizList(res?.data?.quizBank)
                }
            })
    }

    const querySurveyList = () => {
        restClient.asyncGet(`/questionnaire?idSubject=${location.state._id}`)
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

    }

    const getRequirementTodo = async (obj) => {

        setIsTodoModal(true)
        await restClient.asyncGet(`/assignment/${obj.idTodo}?idSubject=${location.state._id}&idTimeline=${obj.idTimeline}`)
            .then(res => {
                if (!res.hasError) {
                    setAssignmentRequirement(get(res, 'data').assignment)
                    setIdTimelineRequired(obj.idTimeline)
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const onSubmitAssignment = () => {
        setIsSubmitAssignment(true)
    }

    const onCancelSubmitAssignment = () => {
        setIsSubmitAssignment(false)
    }


    const commentAssignmentGrade = async ({ comment, idAssignment }) => {
        setIsCommentAssignment(true);
        await restClient.asyncPost(`/assignment/${idAssignment}/comment`, { idSubject: location.state._id, idTimeline: idTimelineRequired, comment: comment }, token)
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
                this.setState({ isSubmitAssignment: false });
                if (!res.hasError) {
                    notifySuccess(t('success'), t('submit_success'))
                    //console.log('Notification', res)
                    let submission = res.data.submission;
                    //console.log('OLD-ASSIGNMENT', this.state.assignmentRequirement);
                    setAssignmentRequirement({ ...this.state.assignmentRequirement, submission: submission, submissionStatus: true })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const directForum = (obj) => {
        history.push('topic', obj)
    }

    if (loadingSubject) {
        return <ModalLoadingLogin visible={loadingSubject} content={t("loading_class")} />
    }

    return <>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
                {(provided) => (
                    <div  {...provided.droppableProps}
                        ref={provided.innerRef}>
                        {
                            detailSubject.map(({ _id, name, description, assignments, exams, forums, information, files, surveys }, index) => {
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

                                                        !isEmpty(information) && (
                                                            <div className="subject-body">
                                                                <div className="announce-wrapper">
                                                                    {information.map((info, indexAnnounce) => {
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
                                                                    <div className="subject-body">
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                {/* <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} /> */}
                                                                                <FontAwesomeIcon icon="poll" style={{ width: 30, height: 30, color: '#ff4000' }} />
                                                                            </div>
                                                                            <div className="subject-content">{survey.name}</div>
                                                                        </div>
                                                                        <div className="subject-action">
                                                                            <div>
                                                                                <Tooltip title={t('edit_file')}>
                                                                                    <a>
                                                                                        <FontAwesomeIcon icon="edit" />
                                                                                    </a>
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                            </div>
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
                                                                            <div className="subject-content">{file.name}</div>
                                                                        </div>
                                                                        <div className="subject-action">
                                                                            <div>
                                                                                <Tooltip title={t('edit_file')}>
                                                                                    <a>
                                                                                        <FontAwesomeIcon icon="edit" />
                                                                                    </a>
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                            </div>
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
                                                                            <div>
                                                                                <Tooltip title={t('edit_file')}>
                                                                                    <a>
                                                                                        <FontAwesomeIcon icon="edit" />
                                                                                    </a>
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                            </div>
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
                                                                    <div className="subject-body" onClick={() => directForum({forumId: forum._id, idSubject: location.state._id, idTimeline: _id})}>
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                <img src={FORUM} width={30} />
                                                                            </div>
                                                                            <div className="subject-content">{forum.name}</div>
                                                                        </div>
                                                                        <div className="subject-action">
                                                                            <div>
                                                                                <Tooltip title={t('edit_file')}>
                                                                                    <a>
                                                                                        <FontAwesomeIcon icon="edit" />
                                                                                    </a>
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                            </div>
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
                                                                    <div className="subject-body">
                                                                        <div className="subject-main">
                                                                            <div className="subject-icon">
                                                                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                                                                            </div>
                                                                            <div className="subject-content">{exam.name}</div>
                                                                        </div>
                                                                        <div className="subject-action">
                                                                            <div>
                                                                                <Tooltip title={t('edit_file')}>
                                                                                    <a>
                                                                                        <FontAwesomeIcon icon="edit" />
                                                                                    </a>
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />
                                                                            </div>
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
        <WidgetLeft timelinesList={timelinesList} setTimelinesList={setTimelinesList} quizList={quizList} setQuizList={setQuizList} surveyList={surveyList} setSurveyList={setSurveyList} />
        <WidgeRight />
        <AssignmentModal isTodoModal={isTodoModal} isSubmitAssignment={isSubmitAssignment} isCommentAssignment={isCommentAssignment} commentAssignmentGrade={commentAssignmentGrade} assignment={assignmentRequirement} handleCancelModal={closeTodoModal} submitAssignment={submissionFile} onSubmitAssignment={onSubmitAssignment} onCancelSubmitAssignment={onCancelSubmitAssignment} />

    </>
}

export default Subject;