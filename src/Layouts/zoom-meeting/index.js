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
        renderItem={props => <Comment author={<span className="color-default">{get(get(props, 'user'), 'firstName') + " " + get(get(props, 'user'), 'lastName')}</span>}
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

    const [isMute, setMute] = React.useState(false);
    const [isHideCamera, setCamera] = React.useState(false);
    const [isOpenShare, setIsOpenShare] = React.useState(false);

    const currentUser = JSON.parse(localStorage.getLocalStorage('user'));

    const [arrayStream, dispatchArrayStream] = useReducer((state, action) => {
        switch (action.method) {
            case 'add':
                const { video } = action;
                const temp = state.find(value => value.id === video.id);
                if (temp) {
                    return state;
                }
                return [...state, video]
            case 'remove':
                const { peerId } = action;
                state = state.filter(value => {
                    if (value.id === peerId) {
                        value.stream.getTracks().forEach(track => track.stop());
                        return false
                    }
                    return true;
                })
                return state;
            case 'replace':
                const { stream } = action;
                state = state.map(video => {
                    if (video.user._id === currentUser._id) {
                        video.stream = stream;
                    }
                    return video;
                });
                return state;
            default:
                break;
        }
    }, []);

    const handleDispatchStream = (state, action) => {
        switch (action.method) {
            case 'set':
                return action.stream;
            case 'remove':
                if (state) {
                    state.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
                return null;
            default:
                return null;
        }
    }

    const [localStream, dispatchLocalScreen] = useReducer((state, action) => {
        return handleDispatchStream(state, action);
    }, null);

    const [shareScreen, dispatchShareScreen] = useReducer((state, action) => {
        return handleDispatchStream(state, action);
    }, null);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connectToNewUser = (peerId, stream, user) => {
        console.log(localStream, shareScreen);
        const call = peer.call(peerId, stream);
        var isReceive = false;
        call.on('stream', (remoteStream) => {
            if (!isReceive) {
                addVideoStream(peerId, remoteStream, user);
                isReceive = true;
            }
        });
        dispatchPeers({
            method: 'ADD',
            peer: {
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

    const replaceLocalStream = (stream) => {
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

        dispatchArrayStream({
            method: 'replace',
            stream: stream,
        });
    }

    const stopShareScreen = () => {
        if (shareScreen) {
            dispatchShareScreen({ method: 'remove' });
            replaceLocalStream(localStream);
        }
    }

    const handleShareScreen = () => {
        navigator.mediaDevices.getDisplayMedia(
            {
                video: true,
            }
        ).then(mediaStream => {
            if (shareScreen) {
                dispatchShareScreen({ method: 'remove' });
            }

            // Handle display share screen
            replaceLocalStream(mediaStream);
            dispatchShareScreen({ method: 'set', stream: mediaStream });

            mediaStream.getVideoTracks()[0].onended = function () {
                // doWhatYouNeedToDo();
                dispatchShareScreen({ method: 'remove' });
                replaceLocalStream(localStream);
            };
        }).catch(err => {
            if (err.message === 'Permission denied') {
                if (shareScreen) {
                    dispatchShareScreen({ method: 'remove' });
                    replaceLocalStream(localStream);
                }
            }
        })
    }

    const removeVideoStream = (peerId) => {

        dispatchArrayStream({
            method: 'remove',
            peerId: peerId,
        });

    }

    const addVideoStream = (id, stream, user) => {

        dispatchArrayStream({
            method: 'add',
            video: {
                id, stream, user
            }
        });

    }

    const handleWhenHasAlreadyJoinInAnotherPlace = (message) => {
        notify.notifyError("Error!", message);
    }

    const [peer, setPeer] = useState(new Peer(currentUser._id, {
        secure: true,
        host: 'lms-api-server.herokuapp.com',
        port: 443,
        path: '/',
        config: {
            iceServers: [
                { url: 'stun:stun1.l.google.com:19302' },
            ]
        }
        // 'iceServers': [
        //     { url: 'stun:stun.ekiga.net' },
        //     { url: 'stun:stun1.l.google.com:19302' },
        //     { url: 'stun:stun2.l.google.com:19302' },
        //     { url: 'stun:stun3.l.google.com:19302' },
        //     { url: 'stun:stun4.l.google.com:19302' },
        //     { url: 'stun:stun01.sipphone.com' },
        //     { url: 'stun:stun.l.google.com:19302' }
        // ]
    }));

    useEffect(() => {
        if (socket && !localStream && !shareScreen) {
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
                            dispatchLocalScreen({ method: 'set', stream });

                            addVideoStream(peer._id, stream, currentUser);

                            socket.emit('share-screen');

                            socket.on('user-connected', (peerId, user) => {
                                connectToNewUser(peerId, stream, user);
                            });

                            peer.on('call', (call) => {

                                dispatchPeers({
                                    method: 'ADD',
                                    peer: {
                                        peerId: call.peer,
                                        call: call
                                    }
                                });

                                call.answer(stream);

                                var isReceive = false;

                                call.on('stream', (remoteStream) => {
                                    if (!isReceive) {
                                        socket.emit('get-user', call.peer);
                                        socket.on(`receive-user-${call.peer}`, (user) => {
                                            addVideoStream(call.peer, remoteStream, user);
                                        });
                                        isReceive = true;
                                    }
                                });
                            });
                        }).catch(err => {
                            if (err.message === 'Permission denied') {
                                notify.notifyError("Fail to access device", "Please turn on camera and mic to join zoom");
                                socket.emit("leave");
                            }
                        })
                    socket.on('user-disconnected', (peerId) => {
                        dispatchPeers({ method: 'DELETE', peerId });
                        removeVideoStream(peerId);
                    });

                    socket.on('newMessage', (message) => {
                        setComments(preState => [...preState, message]);
                        scrollToNewMessage();
                    })
                });
            });

            return () => {
                //Component Unmount

                socket.emit("leave");

                removeAllScreen();

                peer.disconnect();

            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const removeAllScreen = () => {

        dispatchShareScreen({ method: 'remove' });

        dispatchLocalScreen({ method: 'remove' });
    }

    const muteMic = () => {
        if (localStream) {
            const enabled = localStream.getAudioTracks()[0].enabled
            localStream.getAudioTracks()[0].enabled = !enabled;
            setMute(enabled);
        }
    }

    const hideCamera = () => {
        if (localStream) {
            const enabled = localStream.getVideoTracks()[0].enabled
            localStream.getVideoTracks()[0].enabled = !enabled;
            setCamera(enabled);
        }
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

    const scrollToNewMessage = () => {
        const elm = document.querySelector('.ant-list-items')

        if (elm) {
            setTimeout(() => {
                elm.scrollTo({ left: 0, top: elm.scrollHeight + elm.clientHeight, behavior: "smooth" })
            }, 1000)
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
                {shareScreen &&
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
                        <div className="zm-center" style={{ cursor: 'pointer' }} onClick={() => handleShareScreen()}>
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