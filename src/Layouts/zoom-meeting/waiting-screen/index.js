import React, { useState, useEffect } from 'react'
import { Tooltip, Switch, Button } from 'antd'

const WaitingScreen = ({ isReady, setJoin, stream, currentUser }) => {

    const [isOnMic, setOnMic] = useState(true);
    const [isOnCamera, setOnCamera] = useState(true);

    const onStatusMicChange = (status) => {
        setOnMic(status);
        stream.getAudioTracks()[0].enabled = status;
    }

    const onStatusCameraChange = (status) => {
        setOnCamera(status);
        stream.getVideoTracks()[0].enabled = status;
    }

    useEffect(() => {
        const video = document.getElementById("camera-video");
        if (video) {
            video.srcObject = stream;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream])

    return <div>
        <div style={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            marginTop: '6rem'
        }}>
            {
                stream &&
                <video id="camera-video" autoPlay style={{ display: `${isOnCamera ? 'flex' : 'none'}` }} />
            }
            <div style={{
                width: '200px',
                height: '200px',
                fontSize: '3rem',
                color: '#f9f9f9',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#494949',
                padding: '2rem',
                borderRadius: '50%',
                display: `${isOnCamera ? 'none' : 'flex'}`
            }}>
                <img src={currentUser.urlAvatar} alt={currentUser.firstName + " " + currentUser.lastName} />
            </div>


        </div>
        <div className="mt-4" style={{ position: 'absolute', width: '100%', bottom: '4rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}>
                <Button
                    onClick={() => { setJoin(true) }}
                    loading={!isReady}
                    size="large"
                >
                    Join Now
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Tooltip title="Join Audio">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '1rem',
                    }}>
                        <div className="zm-center" >
                            <i className={`zm-icon ${isOnMic ? 'zm-icon-phone-muted' : 'zm-icon-phone-unmuted'}`} style={{ cursor: 'pointer' }}></i>
                        </div>
                        <Switch defaultChecked onChange={onStatusMicChange} />
                    </div>
                </Tooltip>
                <Tooltip title="Turn on/off video">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '1rem',
                    }}>
                        <div className="zm-center" >
                            <i className={`zm-icon ${isOnCamera ? 'zm-icon-start-video' : 'zm-icon-stop-video'}`} style={{ cursor: 'pointer' }}></i>
                        </div>
                        <Switch defaultChecked onChange={onStatusCameraChange} />
                    </div>
                </Tooltip>
            </div>
        </div>
    </div>
}

export default WaitingScreen;