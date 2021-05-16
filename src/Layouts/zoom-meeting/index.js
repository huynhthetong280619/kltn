import React, { useState, useEffect, useRef, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Join_Meeting } from '../../assets/images/contents/join_meeting.svg'
import { ReactComponent as New_Meeting } from '../../assets/images/contents/new_meeting.svg'
import { ReactComponent as Share_Screen } from '../../assets/images/contents/share_screen.svg'
import { ReactComponent as Schedule_Meeting } from '../../assets/images/contents/schedule_meeting.svg'
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'
import { Row, Col, Avatar, Form, Button, List, Input, Tooltip, Comment, Skeleton, Modal } from 'antd'

import ModalWrapper from '../../components/basic/modal-wrapper'
import './zoom.scss'
import { get, indexOf, startCase } from 'lodash'
import moment from 'moment'
import { useLocation } from 'react-router'

import io from "socket.io-client";

import { SERVER_SOCKET } from "../../assets/constants/const";
import * as localStorage from "../../assets/common/core/localStorage";
import * as notify from "../../assets/common/core/notify";
import Peer from "peerjs";
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
            <Input onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onSubmit();
                }
            }} onChange={onChange} value={value} placeholder="Nội dung thảo luận..." />
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
    const [submitting, setSubmitting] = useState(false);
    const location = useLocation()
    const idSubject = useRef('')
    const [socket, setSocket] = useState(null)
    const peer = new Peer();

    const [myVideoStream, setVideoStream] = useState(null);

    const [myShareScreen, setShareScreen] = useState(null);

    const [isMute, setMute] = React.useState(false);
    const [isHideCamera, setCamera] = React.useState(false);
    const [isOpenShare, setIsOpenShare] = React.useState(false);

    const currentUser = JSON.parse(localStorage.getLocalStorage('user'));

    const [arrayStream, setArrayStream] = useState([]);

    const setupSocket = () => {
        const token = localStorage.getCookie("token");
        if (token) {
            const newSocket = io(SERVER_SOCKET, {
                query: {
                    token,
                },
            });

            newSocket.on("connect", () => {
                notify.notifySuccess(t("success"), t("join_success"));
            });

            setSocket(newSocket);
        }
    };

    useEffect(() => {
        idSubject.current = location.search.slice(1).split("&")[0].split("=")[1]
        console.log('Id subject', idSubject.current)
        setupSocket();
    }, []);

    const connectToNewUser = (peerId, stream, user) => {
        const call = peer.call(peerId, stream)
        call.on('stream', (userVideoStream) => {
            addVideoStream(peerId, userVideoStream, user);
        });

        dispatchPeers({
            method: 'ADD', peer: {
                peerId: peerId,
                call: call
            }
        });
    }

    const peersReducer = (state, action) => {
        switch (action.method) {
            case 'ADD':
                const { peer } = action;
                return { ...state, [peer.peerId]: peer.call }
            case 'DELETE':
                const { peerId } = action;
                if (state[peerId]) {
                    state[peerId].close();
                    delete state[peerId];
                }
                return state;
            default:
                break;
        }
    }
    const [peers, dispatchPeers] = useReducer(peersReducer, {})

    const replaceVideoStream = (stream) => {
        // Replace video stream of person in call
        const videoTrack = stream.getVideoTracks()[0];
        for (var key in peers) {
            const peerConnection = peers[key].peerConnection;
            var videoSender = peerConnection.getSenders().find(function (s) {
                return s.track.kind === videoTrack.kind;
            });
            videoSender.replaceTrack(videoTrack);
        }

        //Replace video of current user

        setArrayStream(arrayStream.map(video => {
            if (video.user._id === currentUser._id) {
                video.stream = stream;
            }
            return video;
        }))
    }

    const stopShareScreen = () => {
        if (myShareScreen) {
            myShareScreen.getVideoTracks()[0].stop();
            setShareScreen(null);
            replaceVideoStream(myVideoStream);
        }
    }

    const shareScreen = () => {
        navigator.mediaDevices.getDisplayMedia(
            {
                video: true,
            }
        ).then(mediaStream => {
            if (myShareScreen) {
                myShareScreen.getVideoTracks()[0].stop();
                setShareScreen(null);
            }

            // Handle display share screen
            replaceVideoStream(mediaStream);
            setShareScreen(mediaStream);

            mediaStream.getVideoTracks()[0].onended = function () {
                // doWhatYouNeedToDo();
                setShareScreen(null);
                replaceVideoStream(myVideoStream);
            };
        }).catch(err => {
            if (err.message === 'Permission denied') {
                if (myShareScreen) {
                    myShareScreen.getVideoTracks()[0].stop();
                    replaceVideoStream(myVideoStream);
                }
            }
        })
    }

    const removeVideoStream = (id) => {
        setArrayStream(preState => preState.filter(value => {
            if (value.id === id) {
                value.stream.getTracks().forEach(track => track.stop());
                return false
            }
            return true;
        }));
    }

    const addVideoStream = (id, stream, user) => {
        setArrayStream(preState => {
            const index = preState.findIndex(value => value.id === id)
            if (index < 0) {
                return [...preState, { id, stream, user }]
            }
            return [...preState]
        });
    }

    const handleWhenHasAlreadyJoinInAnotherPlace = (message) => {
        notify.notifyError("Error!", message);
    }

    useEffect(() => {
        if (socket) {
            peer.on('open', (id) => {
                socket.emit('join-zoom', idSubject.current, id);
                socket.on('403', (message) => {
                    handleWhenHasAlreadyJoinInAnotherPlace(message);
                })
                socket.on('200', () => {
                    navigator.mediaDevices
                        .getUserMedia({
                            video: true,
                            audio: true,
                        })
                        .then((stream) => {
                            setVideoStream(stream);
                            addVideoStream(peer._id, stream, currentUser);

                            socket.on('user-connected', (peerId, user) => {
                                connectToNewUser(peerId, stream, user)
                            });

                            peer.on('call', (call) => {
                                dispatchPeers({
                                    method: 'ADD', peer: {
                                        peerId: call.peer,
                                        call: call
                                    }
                                });
                                call.answer(stream)
                                call.on('stream', (userVideoStream) => {
                                    socket.emit('get-user', call.peer);
                                    socket.on('receive-user', (user) => {
                                        addVideoStream(call.peer, userVideoStream, user);
                                    })
                                })
                            });
                        })
                    socket.on('user-disconnected', (peerId) => {
                        dispatchPeers({ method: 'DELETE', peerId });
                        removeVideoStream(peerId);
                    });

                    socket.on('newMessage', (message) => {
                        setComments(preState => [...preState, message]);
                    })
                });
            });
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
        const enabled = myVideoStream.getAudioTracks()[0].enabled
        myVideoStream.getAudioTracks()[0].enabled = !enabled;
        setMute(enabled)
    }

    const hideCamera = () => {
        const enabled = myVideoStream.getVideoTracks()[0].enabled
        myVideoStream.getVideoTracks()[0].enabled = !enabled;
        setCamera(enabled);
    }

    const onCloseModalAction = () => {
        setIsOpenModalFunction(false);
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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                columnGap: '1rem',
                position: 'relative'
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

                            {
                                arrayStream.map(({ id, stream, user }) => {
                                    return <VideoContainer key={id} stream={stream} id={id} user={user} />
                                })
                            }

                        </div>

                    </ModalWrapper>

                </div>
                {myShareScreen &&
                    <div className="sharing-screen">
                        <div style={{ display: 'flex' }}>
                            <div className="status-sharing">
                                {t('status_sharing')}
                                <div className="ic_checked"></div>
                            </div>
                            <div className="action-sharing">
                                <div className="ic-stop" onClick={() => stopShareScreen()} ></div>
                                {t('ic_stop')}
                            </div>
                        </div>
                    </div>
                }

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
                                        src={currentUser.urlAvatar}
                                        alt="Avatar"
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
                            <i className={`zm-icon ${isMute ? 'zm-icon-phone-unmuted' : 'zm-icon-phone-muted'}`} style={{ cursor: 'pointer' }}></i>
                        </div>
                    </Tooltip>
                    <Tooltip title="Turn on/off video">
                        <div className="zm-center" onClick={hideCamera}>
                            <i className={`zm-icon ${isHideCamera ? 'zm-icon-stop-video' : 'zm-icon-start-video'}`} style={{ cursor: 'pointer' }}></i>
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
                        <div className="zm-center" style={{ cursor: 'pointer' }} onClick={() => shareScreen()}>
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
        <Modal className="modal-function-customize screen-share"
            onCancel={() => setIsOpenShare(false)}
            visible={isOpenShare}
            closable={false}
            title={<div
                style={{
                    padding: '1rem 0.625rem 0.625rem 0',
                    alignItems: 'center',
                }}

            >
                <div style={{ color: '#f9f9f9' }}>{t(currentTitle)}</div>
                <div className="close-icon-modal" onClick={() => setIsOpenShare(false)}>
                    <IC_CLOSE />
                </div>
            </div>}
            footer={null}>
            <div style={{ height: 470 }}>

            </div>
        </Modal>
    </div>
}

export default ZoomMeeting