import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Join_Meeting } from '../../assets/images/contents/join_meeting.svg'
import { ReactComponent as New_Meeting } from '../../assets/images/contents/new_meeting.svg'
import { ReactComponent as Share_Screen } from '../../assets/images/contents/share_screen.svg'
import { ReactComponent as Schedule_Meeting } from '../../assets/images/contents/schedule_meeting.svg'
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'

import ModalWrapper from '../../components/basic/modal-wrapper'
import { Tooltip, Modal } from 'antd'
import './zoom.scss'

const ZoomMeeting = () => {
    const { t } = useTranslation()
    const [isOpenModalFunction, setIsOpenModalFunction] = useState(false)
    const [currentTitle, setCurrentTitle] = useState('')
    const [openChatTab, setOpenChatTab] = useState(false)

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

    const fullScreen = (e) => {
        const currentElement = e.currentTarget

        if(currentElement){
            currentElement.classList.toggle('fullsize-screen-item')
        }
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
                            justifyContent: 'space-between',
                            width: '100%',
                            display: 'flex',
                            position: 'relative'
                        }}>
                            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                                <div className="full-screen">
                                    <i class="full-screen-widget__icon"></i>
                                </div>
                            </div>
                            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                                <div className="full-screen">
                                    <i class="full-screen-widget__icon"></i>
                                </div>
                            </div>
                            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                                <div className="full-screen">
                                    <i class="full-screen-widget__icon"></i>
                                </div>
                            </div>
                            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                                <div className="full-screen">
                                    <i class="full-screen-widget__icon"></i>
                                </div>
                            </div>
                            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                                <div className="full-screen">
                                    <i class="full-screen-widget__icon"></i>
                                </div>
                            </div>
                            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                                <div className="full-screen">
                                    <i class="full-screen-widget__icon"></i>
                                </div>
                            </div>
                            <div style={{ width: 200, height: 150, background: 'blue', position: 'relative' }} onClick={(e) => fullScreen(e)}>
                                <div className="full-screen">
                                    <i class="full-screen-widget__icon"></i>
                                </div>
                            </div>
                        </div>
                    </ModalWrapper>
                </div>
                {
                    openChatTab && <div style={{ width: '40%' }}>
                        <ModalWrapper style={{ height: '100%' }}>

                        </ModalWrapper>
                    </div>
                }

            </div>
            <div className="mt-4">
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Tooltip title="Join Audio">
                        <div className="zm-center">
                            <i className="zm-icon zm-icon-join-audio" style={{ cursor: 'pointer' }}></i>
                        </div>
                    </Tooltip>
                    <Tooltip title="Turn on/off video">
                        <div className="zm-center">
                            <i class="zm-icon zm-icon-stop-video" style={{ cursor: 'pointer' }}></i>
                        </div>
                    </Tooltip>
                    <Tooltip title="Participant">
                        <div className="zm-center" style={{ cursor: 'pointer' }}>
                            <div class="footer-button__participants-icon">
                                <span class="footer-button__number-counter" >
                                    <span>1</span>
                                </span>
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Share screen">
                        <div className="zm-center" style={{ cursor: 'pointer' }}>
                            <div class="footer-button__share-icon" ></div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Chat">
                        <div className="zm-center" onClick={() => setOpenChatTab(!openChatTab)}>
                            <div class="footer-button__chat-icon" style={{ cursor: 'pointer' }}></div>
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
                        <i class="zm-icon zm-icon-stop-video"></i>
                    </div>
                    <div className="zm-center">
                        <div class="footer-button__participants-icon">
                            <span class="footer-button__number-counter">
                                <span>1</span>
                            </span>
                        </div>
                    </div>
                    <div className="zm-center">
                        <div class="footer-button__chat-icon"></div>
                    </div>
                </div> */}
            </div>
        </Modal>
    </div>
}

export default ZoomMeeting