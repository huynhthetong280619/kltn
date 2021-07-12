import React, { useState, useEffect, useRef, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Join_Meeting } from '../../assets/images/contents/join_meeting.svg'
import { ReactComponent as New_Meeting } from '../../assets/images/contents/new_meeting.svg'
import { ReactComponent as Share_Screen } from '../../assets/images/contents/share_screen.svg'
import { ReactComponent as Schedule_Meeting } from '../../assets/images/contents/schedule_meeting.svg'
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'
import { Modal } from 'antd'

import './zoom.scss'

import { useLocation } from 'react-router'

import io from "socket.io-client";

import { SERVER_SOCKET } from "../../assets/constants/const";
import * as localStorage from "../../assets/common/core/localStorage";
import * as notify from "../../assets/common/core/notify";
import Peer from "peerjs";
import VideoFrame from "./video-frame";
import WaitingScreen from "./waiting-screen";
import { useHistory } from 'react-router-dom'

const ZoomMeeting = () => {
    const { t } = useTranslation()
    const [isOpenModalFunction, setIsOpenModalFunction] = useState(false)
    const [currentTitle, setCurrentTitle] = useState('')
    const history = useHistory()

    const location = useLocation()
    const idSubject = useRef('')

    const [isReady, setReady] = useState(false);

    const [isJoin, setJoin] = useState(false);

    const [socket, setSocket] = useState(null)

    const [isOpenShare, setIsOpenShare] = React.useState(false);

    const currentUser = JSON.parse(localStorage.getLocalStorage('user'));

    const [userStream, setUserStream] = useState(null);

    useEffect(() => {
        idSubject.current = location.search.slice(1).split("&")[0].split("=")[1]
        console.log('Id subject', idSubject.current)
        setupSocket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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
                {
                    urls: [
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",

                    ]
                },
                { urls: 'stun:stun.services.mozilla.com' },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'lapth82@gmail.com',
                    username: 'lapth82@gmail.com'
                }
            ],
            iceCandidatePoolSize: 3,
            iceTransportPolicy: 'all'
        }
    }));

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

                            setUserStream(stream);

                            setReady(true);

                        }).catch(err => {
                            if (err.message === 'Permission denied') {
                                notify.notifyError("Fail to access device", "Please turn on camera and mic to join zoom");
                                socket.emit("leave");
                            }
                        })
                });
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);


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

    return <>{
        isJoin ?
            <div className="mt-4" style={{
                justifyContent: 'center',
                display: 'flex'
            }}>


                <VideoFrame currentUser={currentUser} socket={socket} peer={peer} userStream={userStream} />

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
            :
            <WaitingScreen currentUser={currentUser} isReady={isReady} setJoin={setJoin} stream={userStream} history={history}/>
    }
    </>

}

export default ZoomMeeting