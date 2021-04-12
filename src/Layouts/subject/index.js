import React, { useContext, useEffect, useState } from 'react'
import Widget from '../../components/widget'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Timeline, Tooltip } from 'antd'
import './styles.scss'
import { useTranslation } from 'react-i18next';
import forum from '../../assets/images/contents/forum.png'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RestClient from '../../utils/restClient';
import { StoreTrading } from '../../store-trading';
import { useLocation } from 'react-router';
import { pick } from 'lodash';
import ModalLoadingLogin from '../login/modal-loading-login';

const Subject = () => {
    const { t } = useTranslation()
    const { authFlag, token } = useContext(StoreTrading)
    const location = useLocation()

    const [detailSubject, setDetailSubject] = useState([])
    const [loadingSubject, setLoadingSubject] = useState(false)
    useEffect(() => {
        queryDetailSubject()

    }, [])

    const queryDetailSubject = () => {
        setLoadingSubject(true)
        const restClient = new RestClient({ token })
        restClient.asyncGet(`/subject/${location.state._id}`)
            .then(res => {
                if (!res.hasError) {
                    console.log(res?.data);
                    setLoadingSubject(false)
                    setDetailSubject(res?.data?.subject?.timelines)
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
    if(loadingSubject){
        return <ModalLoadingLogin visible={loadingSubject} content="He thong dang tai noi dung lop hoc..."/>
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
                                                    <div className="subject-body">
                                                        {

                                                            information && (
                                                                <div className="announce-wrapper">
                                                                    {information.map((info, indexAnnounce) => {
                                                                        return (<div key={indexAnnounce}>
                                                                            <div className="announce-name">{info.name}</div>
                                                                            <div className="announce-content">{info.content}</div>
                                                                        </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="subject-body">
                                                        <div className="subject-main">
                                                            <div className="subject-icon">
                                                                <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />

                                                            </div>
                                                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                                                    <div className="subject-body">
                                                        <div className="subject-main">
                                                            <div className="subject-icon">
                                                                <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />

                                                            </div>
                                                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                                                    <div className="subject-body">
                                                        <div className="subject-main">
                                                            <div className="subject-icon">
                                                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                                                            </div>
                                                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                                                    <div className="subject-body">
                                                        <div className="subject-main">
                                                            <div className="subject-icon">
                                                                <img src={forum} width={30} />
                                                            </div>
                                                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                                                    <div className="subject-body">
                                                        <div className="subject-main">
                                                            <div className="subject-icon">
                                                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                                                            </div>
                                                            <div className="subject-content">Kiểm thử phần mềm</div>
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
        {/* <div className="subject-container">
            <div className="subject-wrapper">
                <div className="subject-header">
                    <div>Week 01: Chương 1: Quy trình kiểm thử</div>
                </div>
                <div className="wrapper-body">
                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <img src={forum} width={30} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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
                </div>


            </div>

            <div className="subject-wrapper">
                <div className="subject-header">
                    <div>Week 01: Chương 1: Quy trình kiểm thử</div>
                </div>
                <div className="wrapper-body">
                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <img src={forum} width={30} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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
                </div>


            </div>

            <div className="subject-wrapper">
                <div className="subject-header">
                    <div>Week 01: Chương 1: Quy trình kiểm thử</div>
                </div>
                <div className="wrapper-body">
                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <img src={forum} width={30} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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
                </div>


            </div>

            <div className="subject-wrapper">
                <div className="subject-header">
                    <div>Week 01: Chương 1: Quy trình kiểm thử</div>
                </div>
                <div className="wrapper-body">
                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <img src={forum} width={30} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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
                </div>


            </div>

            <div className="subject-wrapper">
                <div className="subject-header">
                    <div>Week 01: Chương 1: Quy trình kiểm thử</div>
                </div>
                <div className="wrapper-body">
                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <img src={forum} width={30} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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
                </div>


            </div>


            <div className="subject-wrapper">
                <div className="subject-header">
                    <div>Week 01: Chương 1: Quy trình kiểm thử</div>
                </div>
                <div className="wrapper-body">
                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-powerpoint' style={{ width: 30, height: 30, color: '#d04424' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon='file-word' style={{ width: 30, height: 30, color: '#2d5898' }} />

                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="tasks" style={{ width: 30, height: 30, color: '#009432' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <img src={forum} width={30} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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

                    <div className="subject-body">
                        <div className="subject-main">
                            <div className="subject-icon">
                                <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                            </div>
                            <div className="subject-content">Kiểm thử phần mềm</div>
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
                </div>


            </div>

        </div>
         */}
        <Widget />
    </>
}

export default Subject;