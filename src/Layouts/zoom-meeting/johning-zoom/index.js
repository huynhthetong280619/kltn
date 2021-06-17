import React from 'react'
import { Tooltip, Switch } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'

const JoiningZoom = ({ idSubject, setIsJoin }) => {
    const history = useHistory()
    const location = useLocation()

    return <div>
        <div style={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            marginTop: '6rem'
        }}>
            <div style={{
                width: '200px',
                height: '200px',
                fontSize: '3rem',
                color: '#f9f9f9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#494949',
                padding: '2rem',
                borderRadius: '50%',
            }}>
                CMI
            </div>
        </div>
        <div className="mt-4" style={{ position: 'absolute', width: '100%', bottom: '4rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}>
                <div style={{
                    padding: '1rem',
                    background: '#494949',
                    letterSpacing: '2px',
                    color: '#f9f9f9',
                    cursor: 'pointer'
                }}
                    onClick={(e) => { e.preventDefault(); history.push(`zoom-meeting?idCourse=${idSubject}`, { idSubject: idSubject }) }}
                >Join Now</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Tooltip title="Join Audio">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '1rem',
                    }}>
                        <div className="zm-center" >
                            <i className={`zm-icon zm-icon-phone-unmuted`} style={{ cursor: 'pointer' }}></i>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </Tooltip>
                <Tooltip title="Turn on/off video">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '1rem',
                    }}>
                        <div className="zm-center" >
                            <i className={`zm-icon zm-icon-stop-video`} style={{ cursor: 'pointer' }}></i>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </Tooltip>
            </div>
        </div>
    </div>
}

export default JoiningZoom;