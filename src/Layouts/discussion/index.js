import { get, isEmpty } from 'lodash'
import React, { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import RestClient from '../../utils/restClient'
import { Row, Col, Avatar, Form, Button, List, Input, Tooltip, Comment, Skeleton } from 'antd'
import moment from 'moment';
import discussion from '../../assets/images/contents/discussion.jpg'
import './overwrite.css'
import ModalWrapper from '../../components/basic/modal-wrapper'
import { ReactComponent as Logout } from '../../assets/images/contents/logout.svg'
import ModalLoadingLogin from '../login/modal-loading-login';

import * as notify from "../../assets/common/core/notify";
import * as localStorage from "../../assets/common/core/localStorage";
import { StoreTrading } from '../../store-trading'

const { TextArea } = Input;
const CommentList = ({ t, comments }) => (
    <List
        dataSource={comments}
        header={<div className="color-default">{`${comments.length} ${comments.length > 1 ? t('replies') : t('reply')}`}</div>}
        itemLayout="horizontal"
        renderItem={props => <Comment author={<span className="color-default">{get(get(props, 'create'), 'firstName') + ' ' + get(get(props, 'create'), 'lastName')}</span>}
            avatar={
                <Avatar
                    src={get(get(props, 'create'), 'urlAvatar')}
                    alt={get(get(props, 'create'), 'firstName') + ' ' + get(get(props, 'create'), 'lastName')}
                />
            }

            content={
                <p className="color-default">
                    {get(props, 'content')}
                </p>
            }

            datetime={
                <Tooltip title={moment.utc(get(props, 'time')).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment.utc(get(props, 'time')).fromNow()}</span>
                </Tooltip>
            }
        />}


    />
);

const Editor = ({ t, onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} placeholder="Nội dung thảo luận..." />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                {t('add_comment')}
            </Button>
        </Form.Item>
    </>
);

const Discussion = () => {
    const restClient = new RestClient({ token: '' })
    const location = useLocation()
    const history = useHistory()
    const { t } = useTranslation()
    const { idSubject, forumId, idTimeline, idTopic } = location.state
    const [comments, setComments] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [profile, setProfile] = useState({})
    const [commentInput, setCommentInput] = useState('')
    const [detailTopic, setDetailTopic] = useState({})
    const [loadingDiscussion, setLoadingDiscussion] = useState(false)

    const { socket } = useContext(StoreTrading);

    useEffect(() => {
        setProfile(JSON.parse(localStorage.getLocalStorage('user')))

        setLoadingDiscussion(true)

        restClient.asyncGet(`/topic/${idTopic}?idCourse=${idSubject}&idTimeline=${idTimeline}&idForum=${forumId}`)
            .then(res => {
                console.log(res)
                setLoadingDiscussion(false)
                if (!res.hasError) {
                    setDetailTopic(get(res, 'data').topic)
                    setComments(get(res, 'data').topic?.discussions)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('join-topic', {
                idSubject: idSubject,
                idTimeline: idTimeline,
                idForum: forumId,
                idTopic: idTopic
            });
            
            socket.on('not-accessible', (message) => {
                notify.notifyError(t("failure"), message);
            })

            socket.on('error', (message) => {
                notify.notifyError(t("failure"), message);
            })

            socket.on('newDiscuss', newDiscuss => {
                setComments(preState => [newDiscuss, ...preState]);
            });

            socket.on('discuss-success', () => {
                setSubmitting(false);
                setCommentInput('');
            })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])


    const handleSubmit = () => {
        if (!commentInput) {
            return;
        }

        setSubmitting(true);

        socket.emit('discuss', commentInput);
    };

    const handleChange = e => {
        setCommentInput(e.target.value)
    };

    return <div>
        <ModalWrapper style={{ width: '90%', margin: '0 auto' }} className="mt-4">
            <div style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ textAlign: 'center', width: '100%', padding: '0 0 10px 0' }}>
                        <span className="mr-4">
                            <img src={discussion} width="25px" style={{ borderRadius: '1rem' }} />
                        </span>
                        <span style={{ fontWeight: '700' }} className="color-default">[ {t('topic')} ] {!isEmpty(detailTopic) && get(detailTopic, 'name').toUpperCase()}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', columnGap: '0.75rem' }}>
                    <ModalWrapper style={{ minWidth: '29%', background: '#494949' }}>
                        {
                            isEmpty(detailTopic) ? <Skeleton avatar paragraph={{ rows: 4 }} /> : <>
                                <div style={{ textAlign: 'center' }}>
                                    <div>
                                        <Avatar size={64} icon={<img src={get(get(detailTopic, 'create'), 'urlAvatar')} />} />
                                    </div>
                                    <div>
                                        <div className="color-default">{get(get(detailTopic, 'create'), 'firstName') + ' ' + get(get(detailTopic, 'create'), 'lastName')}  • <span>{moment.utc(get(detailTopic, 'time')).fromNow()}</span></div>
                                        <div className="color-default">@{get(get(detailTopic, 'create'), 'code')}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', color: 'yellow', fontSize: '1rem' }}>
                                    {get(detailTopic, 'content').toUpperCase()}
                                </div>
                                <div style={{ textAlign: 'center' }} className="mt-4">
                                    <Tooltip title="Exit">
                                        <Logout style={{ cursor: 'pointer' }} onClick={() => history.go(-1)} />
                                    </Tooltip>
                                </div>
                            </>
                        }

                    </ModalWrapper>
                    <ModalWrapper style={{ minWidth: '70%', background: '#494949' }}>
                        {
                            loadingDiscussion ? <Skeleton avatar paragraph={{ rows: 4 }} /> : <>
                                {comments.length > 0 && <CommentList t={t} comments={comments} />}
                                <Comment
                                    avatar={
                                        <Avatar
                                            src={profile.urlAvatar}
                                            alt="Han Solo"
                                        />
                                    }
                                    content={
                                        <Editor
                                            t={t}
                                            onChange={handleChange}
                                            onSubmit={handleSubmit}
                                            submitting={submitting}
                                            value={commentInput}
                                        />
                                    }
                                />
                            </>
                        }

                    </ModalWrapper>
                </div>
            </div>
        </ModalWrapper>
        <ModalLoadingLogin visible={loadingDiscussion} content={t("loading_class")} />
    </div>
}

export default Discussion