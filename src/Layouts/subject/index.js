import React, { useContext, useEffect, useState } from 'react'
import WidgetLeft from '../../components/widget'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Timeline, Tooltip } from 'antd'
import './styles.scss'
import { useTranslation } from 'react-i18next';
import FORUM from '../../assets/images/contents/forum.png'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RestClient from '../../utils/restClient';
import { StoreTrading } from '../../store-trading';
import { useLocation } from 'react-router';
import { isEmpty, pick } from 'lodash';
import ModalLoadingLogin from '../login/modal-loading-login';
import AssignmentModal from '../assignmentModal/assignmentModal';
import AddAssignment from '../addAssignment/addAssignment.jsx';
import WidgeRight from '../../components/widget-right';

const Subject = () => {
    const { t } = useTranslation()
    const { authFlag, token } = useContext(StoreTrading)
    const location = useLocation()

    const [detailSubject, setDetailSubject] = useState([])
    const [loadingSubject, setLoadingSubject] = useState(false)
    const [timelinesList, setTimelinesList] = useState([])
    const [quizList, setQuizList] = useState([])
    const [surveyList, setSurveyList] = useState([])
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

    console.log(detailSubject)

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
                                return <Draggable key={_id} draggableId={_id} index={index}>
                                    {(provided) => (
                                        <div className="subject-container" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index}>
                                            <div className="subject-wrapper">
                                                <div className="subject-header">
                                                    <div>{`${t('week')} ${index < 9 ? ('0' + (index + 1)) : (index + 1)}: ${name}`}</div>
                                                    <div className="description">{description}</div>
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
                                                                    <div className="subject-body">
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
                                                                    <div className="subject-body">
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
    </>
}

export default Subject;