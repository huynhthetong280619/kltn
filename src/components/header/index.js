import React, { useState, useEffect } from 'react'
import { Col, Row, Typography } from 'antd'
// import IC_MENU from '../../assets/images/ic_menu_bar.png'
import Menu from '../../assets/images/ic_menu.svg'
import IC_SETTING from '../../assets/images/ic_setting.svg'
import IC_USER from '../../assets/images/ic_user_login.svg'
import IC_MESSAGE from '../../assets/images/ic_message.svg'
import IC_NOTIFICATION from '../../assets/images/ic_notification.svg'
import IC_AVATAR from '../../assets/images/ic_avatar.svg'
import IC_AVATAR_SEC from '../../assets/images/ic_avatar_second.svg'
import IC_AVATAR_THIRD from '../../assets/images/ic_avatar_third.svg'
import { useTranslation } from 'react-i18next'
import { STORE_KEY } from '../../utils/STORE_KEY'
import en from '../../assets/images/en.png'
// import vi from '../../assets/images/vn.png'
import ArrowDown from '../../assets/images/ic_arr_down.png'
import { Link, Redirect } from 'react-router-dom'
import Message from '../message'


const { Text } = Typography;




const HeaderLayout = () => {
    const { t, i18n } = useTranslation()

    const [openMessage, setOpenMessage] = useState(false)

    const [language, setLanguage] = useState('vi')


    useEffect(() => {
        const lang = localStorage.getItem(STORE_KEY.LANGUAGE)

        if (!lang) {
            localStorage.setItem(STORE_KEY.LANGUAGE, language)
        }
    })

    const changeLanguage = ({ key }) => {
        console.log(key)
        if (language === key) return
        i18n.changeLanguage(key)
        localStorage.setItem(STORE_KEY.LANGUAGE, key)
        setLanguage(key)
    }


    return <div className="header-layout ant-col-24">
        <Col span={12} className="header-layout-left">
            <Col span={4} className="header-layout--element__first">
                <div>
                    {/* <Menu /> */}
                    <img src={Menu} width="25px" />
                </div>
            </Col>
            <Col span={7} className="header-layout--element__second">
                <div className="header-text__second">
                    {t('Hệ thống dạy học số')}
                </div>
            </Col>
        </Col>
        <Col span={12} style={{ height: '64px' }} className="header-layout-right">
            <Col>
                <div style={{ display: 'flex' }} onClick={() => changeLanguage({ key: 'vi' })}>
                    <div>
                        <img src={en} />
                    </div>
                    <div className="title-lang-choose" style={{ color: '#fff', margin: '0 5px' }}>{t(`title_${language.toLowerCase()}`)}</div>
                    <div>
                        <img src={ArrowDown} />
                    </div>
                </div>
            </Col>
            <Col span={4} className="header-message cursor-act">
                <div>
                    <img src={IC_NOTIFICATION} width="25px" />
                </div>
                <div className="user-message">{t('title_notification')}</div>
            </Col>
            <Col span={5} className="header-message cursor-act" >
                <div style={{ display: 'inline-flex' }} className="cursor-act" onClick={() => setOpenMessage(!openMessage)}>
                    <div>
                        <img src={IC_MESSAGE} width="25px" />
                    </div>
                    <div className="user-message" >{t('title_message')}</div>
                </div>
                <div style={{
                    display: openMessage ? 'block' : 'none'
                }} className="message-dialog">
                    <div className="title-message">Message</div>
                    <input style={{ width: '98%', height: '36px', borderRadius: '30px', outline: 'none', backgroundColor: '#3A3B3C', paddingLeft: 20, color: '#fff', border: 0 }} placeholder="Search messager" className="input-message" />
                    <div style={{
                        maxHeight: '262px',
                        overflowY: 'auto',
                    }}>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message" onClick={() => setOpenMessage(false)}>
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Nguyễn Anh Quân</Text>
                                <Text style={{ color: '#b0b3b8' }}>You: Socket connection... • 7h</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_SEC} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Huỳnh Thế Tông</Text>
                                <Text style={{ color: '#b0b3b8' }}>Go to home... • 3m</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_SEC} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Huỳnh Thế Tông</Text>
                                <Text style={{ color: '#b0b3b8' }}>Go to home... • 3m</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_SEC} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Huỳnh Thế Tông</Text>
                                <Text style={{ color: '#b0b3b8' }}>Go to home... • 3m</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_SEC} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Huỳnh Thế Tông</Text>
                                <Text style={{ color: '#b0b3b8' }}>Go to home... • 3m</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_SEC} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Huỳnh Thế Tông</Text>
                                <Text style={{ color: '#b0b3b8' }}>Go to home... • 3m</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_THIRD} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Nguyễn Trần Thi Văn</Text>
                                <Text style={{ color: '#b0b3b8' }}>Ngày 22/3 em nhé! • 5s</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_THIRD} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Nguyễn Trần Thi Văn</Text>
                                <Text style={{ color: '#b0b3b8' }}>Ngày 22/3 em nhé! • 5s</Text>
                            </Col>
                        </Row>
                        <Row style={{ padding: '4px', margin: ' 10px 4px' }} className="item-message">
                            <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                                <img src={IC_AVATAR_THIRD} height={46} />
                            </Col>
                            <Col span={18} style={{
                                height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Text style={{ color: '#e4e6eb' }}>Nguyễn Trần Thi Văn</Text>
                                <Text style={{ color: '#b0b3b8' }}>Ngày 22/3 em nhé! • 5s</Text>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
            <Col span={4} className="header-setting cursor-act">
                <div>
                    <img src={IC_SETTING} width="25px" />
                </div>
                <div className="user-setting">{t('title_setting')}</div>
            </Col>
            <Col span={6} className="header-user-login cursor-act">
                <Link to="/login" style={{display: 'flex'}}>
                    <div>
                        <img src={IC_USER} width="25px" />
                    </div>
                    <div className="user-login-text">{t('title_login')}</div>
                </Link>
            </Col>
        </Col>

        <Message />
    </div>
}

export default HeaderLayout