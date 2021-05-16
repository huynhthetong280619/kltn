import React, { useState, useEffect } from 'react';
import "./videoContainer.css"
const VideoContainer = ({ id, stream, user }) => {

    const [isMute, setIsMute] = useState(false)

    const fullScreen = (e) => {
        const currentElement = e.currentTarget

        if (currentElement) {
            currentElement.classList.toggle('fullsize-screen-item')
        }
    }

    useEffect(() => {
        const video = document.getElementById(id);
        if (stream) {
            video.srcObject = stream
            video.addEventListener('loadedmetadata', () => {
                video.play()
            });
        }
        return () => {
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream])

    return (
        <>
            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                <div className="full-screen">
                    <i className="full-screen-widget__icon"></i>
                </div>
                <video id={id}></video>
                <div>
                    <div className="user-stream">{user.firstName + " " + user.lastName}</div>
                    <div className={isMute ? 'mic-video-unmute' : 'mic-video-mute'} onClick={(e) => { e.stopPropagation(); setIsMute(!isMute)}}></div>
                </div>
            </div>
        </>
    )
}

export default VideoContainer;