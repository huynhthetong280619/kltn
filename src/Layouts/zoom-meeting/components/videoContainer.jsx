import React, { useState, useEffect } from 'react';
import "./videoContainer.css"
const VideoContainer = ({id, stream }) => {

    const fullScreen = (e) => {
        const currentElement = e.currentTarget

        if (currentElement) {
            currentElement.classList.toggle('fullsize-screen-item')
        }
    }

    useEffect(() => {
        if (stream) {
            const video = document.getElementById(id);
            video.srcObject = stream
            video.addEventListener('loadedmetadata', () => {
                video.play()
            });
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
                <div style={{textAlign: 'center', color: '#f9f9f9'}}>Usr name</div>
            </div>
        </>
    )
}

export default VideoContainer;