import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Join_Meeting } from '../../assets/images/contents/join_meeting.svg'
import { ReactComponent as New_Meeting } from '../../assets/images/contents/new_meeting.svg'
import { ReactComponent as Share_Screen } from '../../assets/images/contents/share_screen.svg'
import { ReactComponent as Schedule_Meeting } from '../../assets/images/contents/schedule_meeting.svg'
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'
import { Row, Col, Avatar, Form, Button, List, Input, Tooltip, Comment, Skeleton, Modal } from 'antd'

import ModalWrapper from '../../components/basic/modal-wrapper'
import './zoom.scss'
import { get, indexOf } from 'lodash'
import moment from 'moment'
import { useLocation } from 'react-router'

import io from "socket.io-client";

import { SERVER_SOCKET } from "../../assets/constants/const";
import * as localStorage from "../../assets/common/core/localStorage";
import * as notify from "../../assets/common/core/notify";
import Peer from "peerjs";
import $ from "jquery";
import VideoContainer from "./components/videoContainer";

const { TextArea } = Input;

const CommentList = ({ t, comments }) => (
    <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props => <Comment author={<a className="color-default">{get(get(props, 'user'), 'firstName') + " " + get(get(props, 'user'), 'lastName')}</a>}
            avatar={
                <Avatar
                    src={get(get(props, 'user'), 'urlAvatar')}
                    alt={get(get(props, 'user'), 'firstName') + " " + get(get(props, 'user'), 'lastName')}
                />
            }

            content={
                <p className="color-default">
                    {get(get(props, 'message'), 'message')}
                </p>
            }

            datetime={
                <Tooltip title={get(props, 'time')}>
                    <span>{get(props, 'time')}</span>
                </Tooltip>
            }
        />}


    />
);

const Editor = ({ t, onChange, onSubmit, submitting, value }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        columnGap: '1rem'
    }}>
        <Form.Item>
            <Input onChange={onChange} value={value} placeholder="Nội dung thảo luận..." />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                {t('send')}
            </Button>
        </Form.Item>
    </div>
);

const ZoomMeeting = () => {
    const { t } = useTranslation()
    const [isOpenModalFunction, setIsOpenModalFunction] = useState(false)
    const [currentTitle, setCurrentTitle] = useState('')
    const [openChatTab, setOpenChatTab] = useState(false)
    const [commentInput, setCommentInput] = useState('')
    const [comments, setComments] = useState([])
    const [profile, setProfile] = useState({})
    const [submitting, setSubmitting] = useState(false);
    const location = useLocation()
    const { idSubject } = location.state;

    const [socket, setSocket] = useState(null)
    const peer = new Peer();
    let peers = {};
    const [videoGrid, setVideoGrid] = useState([]);
    const zoomId = '607ed25c51de952650cddd76';
    const [videoStream, setVideoStream] = useState(null);
    const [isMute, setMute] = React.useState(false);
    const [isCamera, setCamera] = React.useState(false);

    let arrayStream = [];
    let arrayComments = [];

    const setupSocket = () => {
        const token = localStorage.getCookie("token");
        if (token) {
            const newSocket = io(SERVER_SOCKET, {
                query: {
                    token,
                },
            });

            newSocket.on("connect", () => {
                notify.notifySuccess("success", "Socket Connected!");
            });

            setSocket(newSocket);
        }
    };

    useEffect(() => {
        setupSocket();
    }, []);

    const connectToNewUser = (userId, stream) => {
        const call = peer.call(userId, stream)
        call.on('stream', (userVideoStream) => {
            addVideoStream(userId, userVideoStream);
        })

        peers[userId] = call
    }

    const removeVideoStream = (id) => {
        const index = arrayStream.findIndex(value => value.id === id);
        if (index) {
            arrayStream[index].stream.getTracks().forEach(track => track.stop());
            arrayStream.splice(index, 1);
        }
        displayVideoStream();
    }

    const addVideoStream = (id, stream) => {
        console.log(arrayStream);
        const index = arrayStream.findIndex(value => value.id === id)
        if (index < 0) {
            arrayStream.push({ id, stream });
        } 
        displayVideoStream();
    }

    const displayVideoStream = () => {
        const container = arrayStream.map((value) => {
            return <VideoContainer key={value.id} stream={value.stream} id={value.id} />
        })

        setVideoGrid(container);
    }

    useEffect(() => {
        if (socket) {
            peer.on('open', (id) => {
                socket.emit('join-zoom', zoomId, id);
                navigator.mediaDevices
                    .getUserMedia({
                        video: true,
                        audio: true,
                    })
                    .then((stream) => {
                        setVideoStream(stream);
                        addVideoStream(peer._id, stream);

                        socket.on('user-connected', (userId) => {
                            connectToNewUser(userId, stream)
                            alert('Somebody connected', userId)
                        });

                        peer.on('call', (call) => {
                            call.answer(stream)
                            call.on('stream', (userVideoStream) => {
                                addVideoStream(call.peer, userVideoStream);
                            })
                        });
                    })
            });
            socket.on('user-disconnected', (userId) => {
                if (peers[userId]) peers[userId].close()
                removeVideoStream(userId);
            });

            socket.on('createMessage', (message) => {
                arrayComments.push(message);
                setComments([...comments, ...arrayComments]);
            })
        }
        return () => {
            //Component Unmount
            if (socket) {
                socket.emit("leave");
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const muteMic = () => {
        const enabled = videoStream.getAudioTracks()[0].enabled
        videoStream.getAudioTracks()[0].enabled = !enabled;
        setMute(enabled)
    }

    const hideCamera = () => {
        const enabled = videoStream.getVideoTracks()[0].enabled
        videoStream.getVideoTracks()[0].enabled = !enabled;
        setCamera(enabled);
    }

    const onCloseModalAction = () => {
        setIsOpenModalFunction(false)
    }

    const openZoomFunction = (type) => {
        setCurrentTitle(type)
        setIsOpenModalFunction(true)
    }

    const renderLayoutFunction = () => {
        return <div></div>
    }

    const handleSubmit = () => {
        if (socket) {

            if (!commentInput) {
                return;
            }

            setSubmitting(true)

            socket.emit('message', { message: commentInput });

            setSubmitting(false)
            setCommentInput('')
        }
    }

    const handleChange = (e) => {
        setCommentInput(e.target.value)
    }

    return <div className="mt-4" style={{
        justifyContent: 'center',
        display: 'flex'
    }}>
        <ModalWrapper style={{ width: '80.5rem', background: '#494949' }}>
            {/* <div className="menu-container-zoom-meeting">
                <Tooltip title="Join meeting class" >
                    <Join_Meeting style={{ cursor: 'pointer' }} onClick={() => openZoomFunction('Join meeting class')} />
                </Tooltip>
                <Tooltip title="Create new meeting class">
                    <New_Meeting style={{ cursor: 'pointer' }} onClick={() => openZoomFunction('Create new meeting class')} />
                </Tooltip>
                <Tooltip title="Share your screen">
                    <Share_Screen style={{ cursor: 'pointer' }} onClick={() => openZoomFunction('Share your screen')} />
                </Tooltip>
                <Tooltip title="Shedule meeting class">
                    <Schedule_Meeting style={{ cursor: 'pointer' }} onClick={() => openZoomFunction('Shedule meeting class')} />
                </Tooltip>
            </div> */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                columnGap: '1rem',
            }}>
                <div style={{ width: '100%' }}>
                    <ModalWrapper style={{ minHeight: '450px', }}>
                        <div style={{
                            columnGap: '0.5rem',
                            flexWrap: 'wrap',
                            rowGap: '0.5rem',
                            justifyContent: 'flex-start',
                            width: '100%',
                            display: 'flex',
                            position: 'relative'
                        }} >
                            {videoGrid}
                        </div>
                    </ModalWrapper>
                </div>
                {
                    openChatTab && <div style={{ width: '40%' }}>
                        <ModalWrapper style={{ height: '100%', position: 'relative' }} className="zoom-list">
                            {comments.length > 0 && <CommentList t={t} comments={comments} />}
                            <Comment
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '2rem'
                                }}
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
                        </ModalWrapper>
                    </div>
                }

            </div>
            <div className="mt-4">
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Tooltip title="Join Audio">
                        <div className="zm-center" onClick={muteMic}>
                            <i className="zm-icon zm-icon-join-audio" style={{ cursor: 'pointer' }}></i>
                        </div>
                    </Tooltip>
                    <Tooltip title="Turn on/off video">
                        <div className="zm-center" onClick={hideCamera}>
                            <i className="zm-icon zm-icon-stop-video" style={{ cursor: 'pointer' }}></i>
                        </div>
                    </Tooltip>
                    <Tooltip title="Participant">
                        <div className="zm-center" style={{ cursor: 'pointer' }}>
                            <div className="footer-button__participants-icon">
                                <span className="footer-button__number-counter" >
                                    <span>1</span>
                                </span>
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Share screen">
                        <div className="zm-center" style={{ cursor: 'pointer' }}>
                            <div className="footer-button__share-icon" ></div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Chat">
                        <div className="zm-center" onClick={() => setOpenChatTab(!openChatTab)}>
                            <div className="footer-button__chat-icon" style={{ cursor: 'pointer' }}></div>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </ModalWrapper>



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
            <div>
                {
                    renderLayoutFunction()
                }
                {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div className="zm-center">
                        <i className="zm-icon zm-icon-join-audio"></i>
                    </div>
                    <div className="zm-center">
                        <i className="zm-icon zm-icon-stop-video"></i>
                    </div>
                    <div className="zm-center">
                        <div className="footer-button__participants-icon">
                            <span className="footer-button__number-counter">
                                <span>1</span>
                            </span>
                        </div>
                    </div>
                    <div className="zm-center">
                        <div className="footer-button__chat-icon"></div>
                    </div>
                </div> */}
            </div>
        </Modal>
    </div>
}

export default ZoomMeeting