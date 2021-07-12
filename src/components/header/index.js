import { Col, Switch, Typography } from 'antd'
import { isEmpty } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { ReactComponent as Logout } from '../../assets/images/contents/logout.svg'
// import IC_MENU from '../../assets/images/ic_menu_bar.png'
import Menu from '../../assets/images/ic_menu.svg'
import IC_MESSAGE from '../../assets/images/ic_message.svg'
import IC_USER from '../../assets/images/ic_user_login.svg'
import { StoreTrading } from '../../store-trading'
import { STORE_KEY } from '../../utils/STORE_KEY'
import Messenger from './messenger'


const { Text } = Typography;

const HeaderLayout = ({ setOpen }) => {
    const { t, i18n } = useTranslation()
    const { authFlag, setAuth, language, setLanguage, socket } = useContext(StoreTrading)

    const [openMessage, setOpenMessage] = useState(false)
    const [profile, setProfile] = useState({});
    const history = useHistory()

    useEffect(() => {
        const lang = localStorage.getItem(STORE_KEY.LANGUAGE)

        if (!authFlag) {
            const API_TOKEN = localStorage.getItem('API_TOKEN')

            if (API_TOKEN) {
                setAuth(true)
            }
        }

        if (!lang) {
            localStorage.setItem(STORE_KEY.LANGUAGE, language)
        }

        const usrObj = JSON.parse(localStorage.getItem('user'))

        if (!usrObj) {
            return
        }

        setProfile(usrObj);
    }, [])

    const changeLanguage = (key) => {
        i18n.changeLanguage(key)
        localStorage.setItem(STORE_KEY.LANGUAGE, key)
        setLanguage(key)
    }

    const handleLogIn = () => {
        history.push('/login')
    }

    const handleLogout = () => {
        localStorage.removeItem('API_TOKEN')

        history.push('/login')
    }

    return <div className="header-layout ant-col-24">
        <Col span={12} className="header-layout-left">
            <Col span={4} className="header-layout--element__first" onClick={() => setOpen(true)}>
                <div>
                    <img src={Menu} width="20px" />
                </div>
            </Col>
            <Col span={7} className="header-layout--element__second">
                <div className="header-text__second">
                    {t('Hệ thống dạy học số')}
                </div>
            </Col>
        </Col>
        <Col span={12} style={{ height: '64px' }} className="header-layout-right">
            <div className="mr-2">
                <Switch style={{
                    minWidth: 85,
                    height: 22
                }}
                    className=""
                    checkedChildren={'Tiếng Việt'}
                    unCheckedChildren={'English'}
                    onChange={(e) => {
                        changeLanguage(language === 'VI' ? 'EN' : 'VI')
                    }}
                    checked={language === 'EN'}
                />
            </div>
            {/* <Col>
                <div style={{ display: 'flex' }} onClick={() => changeLanguage({ key: 'vi' })}>
                    <div>
                        <img src={en} />
                    </div>
                    <div className="title-lang-choose" style={{ color: '#fff', margin: '0 5px' }}>{t(`title_${language.toLowerCase()}`)}</div>
                    <div>
                        <img src={ArrowDown} />
                    </div>
                </div>
            </Col> */}
            {/* <Col className="header-message cursor-act ml-2 mr-2">
                <div>
                    <img src={IC_NOTIFICATION} width="20px" />
                </div>
                <div className="user-message">{t('title_notification')}</div>
            </Col> */}
            <Col className="header-message cursor-act ml-2 mr-2" >
                <div style={{ display: 'inline-flex' }} className="cursor-act" onClick={() => { setOpenMessage(!openMessage) }}>
                    <div>
                        <img src={IC_MESSAGE} width="20px" />
                    </div>
                    <div className="user-message" >{t('title_message')}</div>
                </div>

                <Messenger profile={profile} isOpen={openMessage} setOpen={setOpenMessage} socket={socket} />
            </Col>
            {/* <Col span={4} className="header-setting cursor-act">
                <div>
                    <img src={IC_SETTING} width="20px" />
                </div>
                <div className="user-setting">{t('title_setting')}</div>
            </Col> */}
            <Col className="header-user-login cursor-act ml-2 mr-4">
                <div style={{ display: 'flex' }} onClick={() => !authFlag ? handleLogIn() : history.push('/home/profile')}>
                    <div >
                        <img src={!isEmpty(profile) ? profile.urlAvatar : IC_USER} width="20px" style={{
                            borderRadius: '0.25rem',
                            width: '25px',
                            height: '25px'
                        }} />
                    </div>
                    <div className="user-login-text" ><div style={{
                        display: 'inline',
                        border: '1px solid rgb(15, 112, 184)',
                        padding: '5px 16px',
                        borderRadius: '0.5rem',
                    }}>{authFlag ? profile?.firstName + ' ' + profile?.lastName : t('title_login')}</div>
                    </div>
                </div>
                {
                    authFlag && <div className="ml-2" style={{ display: 'flex', alignItems: 'center', }}>
                        <div style={{ display: 'flex', padding: '7px 9px' }} onClick={() => handleLogout()}>
                            <Logout />
                        </div>
                    </div>
                }
            </Col>

        </Col>
    </div>
}

export default HeaderLayout