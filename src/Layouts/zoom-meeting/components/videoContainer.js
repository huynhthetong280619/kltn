import React, { useState, useEffect } from 'react';
import "./videoContainer.css"
import * as localStorage from "../../../assets/common/core/localStorage";

const VideoContainer = ({ id, stream, user }) => {

    const currentUser = JSON.parse(localStorage.getLocalStorage('user'));

    const fullScreen = (e) => {
        const currentElement = e.currentTarget

        if (currentElement) {
            currentElement.classList.toggle('fullsize-screen-item')
        }
    }

    useEffect(() => {
        let video;
        if (stream) {
            video = document.getElementById(id);
            if (user._id === currentUser._id) {
                video.muted = true;
            }

            video.srcObject = stream;
        }
        // return () => {
        //     if (video) {
        //         video.pause();
        //         video.srcObject = null;
        //     }
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream])

    return (
        <>
            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                <div className="full-screen">
                    <i className="full-screen-widget__icon"></i>
                </div>
                <video id={id} autoPlay></video>
                <div>
                    <div className="user-stream">{user.firstName + " " + user.lastName}</div>
                    <div className={stream.getAudioTracks()[0]?.enabled ? 'mic-video-unmute' : 'mic-video-mute'} onClick={(e) => { e.stopPropagation(); }}></div>
                </div>
            </div>
        </>
    )
}

export default VideoContainer;