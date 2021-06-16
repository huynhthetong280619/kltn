import React, { useState, useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'

import ModalWrapper from '../../../components/basic/modal-wrapper'

import VideoContainer from "../components/videoContainer";

import ChatTab from "../chat-tab";


const VideoFrame = ({ currentUser, socket, peer, userStream }) => {

    const { t } = useTranslation()

    const [isMute, setMute] = React.useState(!userStream.getAudioTracks()[0].enabled);

    const [isHideCamera, setCamera] = React.useState(false);

    const [arrayStream, setArrayStream] = useState([]);

    const [shareScreen, setShareScreen] = useState(null);

    const [peers, setPeers] = useState({});

    const [stateShareScreen, dispatchShareScreen] = useReducer((state, action) => {
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
            case 'replace':
                if (state) {
                    const videoTrack = state.getVideoTracks()[0];

                    const peerConnection = action.call.peerConnection;

                    var videoSender = peerConnection.getSenders().find(function (s) {
                        return s.track.kind === videoTrack.kind;
                    });
                    videoSender.replaceTrack(videoTrack);
                }
                return state;
            default:
                return state;
        }
    }, null);

    const [statePeers, dispatchStatePeers] = useReducer((state, action) => {
        switch (action.method) {
            case 'set':
                return action.peers;
            case 'replace-stream':
                // Replace video stream of person in call
                const videoTrack = action.stream.getVideoTracks()[0];

                for (var key in peers) {
                    const peerConnection = peers[key].peerConnection;

                    var videoSender = peerConnection.getSenders().find(function (s) {
                        return s.track.kind === videoTrack.kind;
                    });
                    videoSender.replaceTrack(videoTrack);
                }

                //Replace video of current user
                setArrayStream(preState => preState.map(video => {
                    if (video.user._id === currentUser._id) {
                        video.stream = action.stream;
                    }
                    return video;
                }))
                return state;
            default:
                return state;
        }
    }, {});

    useEffect(() => {
        addVideoStream(peer._id, userStream, currentUser, isMute);

        socket.emit('share-screen', isMute);

        socket.on('user-connected', (peerId, user, isMuted) => {
            connectToNewUser(peerId, userStream, user, isMuted);
        });

        peer.on('call', (call) => {
            setPeers(preState => {
                return { ...preState, [call.peer]: call }
            });

            call.answer(userStream);

            var isReceive = false;

            call.on('stream', (remoteStream) => {
                if (!isReceive) {
                    socket.emit('get-user', call.peer);
                    socket.on(`receive-user-${call.peer}`, (user, isMuted) => {
                        addVideoStream(call.peer, remoteStream, user, isMuted);
                    });
                    isReceive = true;
                }
            });
        });

        socket.on('user-disconnected', (peerId) => {

            setPeers(preState => {
                if (preState[peerId]) {
                    preState[peerId].close();
                    delete preState[peerId];
                }
                return preState;
            });

            removeVideoStream(peerId);
        });

        socket.on('user-muted', (peerId, isMuted) => {

            setArrayStream(preState => preState.map(video => {
                if (video.id === peerId) {
                    video.isMuted = isMuted
                }
                return video;
            }))
        })

        return () => {
            peer.disconnect();

            socket.emit("leave");

            removeAllScreen();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (shareScreen) {
            dispatchShareScreen({ method: 'set', stream: shareScreen });
        } else {
            dispatchShareScreen({ method: 'remove' });
        }
    }, [shareScreen]);

    useEffect(() => {
        dispatchStatePeers({ method: 'set', peers: peers });

    }, [peers]);


    const connectToNewUser = (peerId, stream, user, isMuted) => {
        const call = peer.call(peerId, stream);
        var isReceive = false;
        call.on('stream', (remoteStream) => {
            if (!isReceive) {
                addVideoStream(peerId, remoteStream, user, isMuted);
                isReceive = true;
            }
        });

        setPeers(preState => {
            return { ...preState, [peerId]: call }
        });

        dispatchShareScreen({
            method: 'replace',
            call: call
        })
    }

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
        setArrayStream(preState => preState.map(video => {
            if (video.user._id === currentUser._id) {
                video.stream = stream;
            }
            return video;
        }))
    }

    const stopShareScreen = () => {
        if (shareScreen) {

            shareScreen.getTracks().forEach(function (track) {
                track.stop();
            });

            setShareScreen(null);

            replaceLocalStream(userStream);
        }
    }

    const handleShareScreen = () => {
        navigator.mediaDevices.getDisplayMedia(
            {
                video: true,
            }
        ).then(mediaStream => {
            if (shareScreen) {
                shareScreen.getTracks().forEach(function (track) {
                    track.stop();
                });
            }

            // Handle display share screen
            replaceLocalStream(mediaStream);

            setShareScreen(mediaStream);

            mediaStream.getVideoTracks()[0].onended = function () {

                mediaStream.getTracks().forEach(function (track) {
                    track.stop();
                });

                setShareScreen(null);

                // replaceLocalStream(userStream);

                dispatchStatePeers({
                    method: 'replace-stream',
                    stream: userStream
                })
            };
        }).catch(err => {
            if (err.message === 'Permission denied') {
                if (shareScreen) {
                    shareScreen.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    setShareScreen(null);
                    replaceLocalStream(userStream);
                }
            }
        })
    }

    const removeVideoStream = (peerId) => {

        setArrayStream(preState => preState.filter(video => {
            if (video.id === peerId) {
                video.stream.getTracks().forEach(track => track.stop());
                return false
            }
            return true;
        }))

    }

    const addVideoStream = (id, stream, user, isMuted) => {
        setArrayStream(preState => [...preState, { id, stream, user, isMuted }])
    }

    const removeAllScreen = () => {

        if (shareScreen) {
            shareScreen.getTracks().forEach(function (track) {
                track.stop();
            });
        }

        userStream.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    const [openChatTab, setOpenChatTab] = useState(false)


    const muteMic = () => {
        const enabled = userStream.getAudioTracks()[0].enabled
        userStream.getAudioTracks()[0].enabled = !enabled;
        setMute(enabled);


        socket.emit('mute-mic', peer._id, enabled);
    }

    const hideCamera = () => {
        if (userStream) {
            const enabled = userStream.getVideoTracks()[0].enabled
            userStream.getVideoTracks()[0].enabled = !enabled;
            setCamera(enabled);
        }
    }

    return <>
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
                                arrayStream.map(({ id, stream, user, isMuted }) => {
                                    return <VideoContainer key={id} stream={stream} id={id} user={user} isMuted={isMuted} />
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

                <ChatTab socket={socket} openChatTab={openChatTab} currentUser={currentUser} />

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
                        <div className="zm-center" onClick={setOpenChatTab}>
                            <div className="footer-button__chat-icon" style={{ cursor: 'pointer' }}></div>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </ModalWrapper>
    </>
}

export default VideoFrame