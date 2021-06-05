import React, { useContext, useEffect, useState } from 'react'
import { Card, Avatar, Tooltip, Menu, Dropdown, Tabs } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import IC_CHART from '../../assets/images/ic_chart.svg'
import IC_FAKE_BG from '../../assets/images/fake_bg.svg'
import { useHistory } from 'react-router';
import { StoreTrading } from '../../store-trading';
import RestClient from '../../utils/restClient';
import ModalLoadingLogin from '../login/modal-loading-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Footer } from 'antd/lib/layout/layout';
import FooterLayout from '../footer-layout';

const { Meta } = Card;
const { TabPane } = Tabs;

const generateColor = () => {
    return '#' + Math.random().toString(16).substr(-6);
}

const MainAppLayout = () => {
    const { t } = useTranslation()
    const { authFlag, token } = useContext(StoreTrading)
    const history = useHistory()

    const [listSubjectJoined, setListSubjectJoined] = useState([])
    const [loadingCourse, setLoadingCourse] = useState(false)
    const [publicSubject, setPublicSubject] = useState([])

    const [isTeacherFlag, setIsTeacherFlag] = useState(false)

    useEffect(() => {

        if (!authFlag) {
            history.push('/login')
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.idPrivilege == 'student') {
            setIsTeacherFlag(false)
        }

        if (user?.idPrivilege == 'teacher') {
            setIsTeacherFlag(true)
        }


        getListSubjectJoin();


    }, [])

    const getListSubjectJoin = async () => {
        setLoadingCourse(true)

        const restClientApi = new RestClient({ token })

        await restClientApi.asyncGet('/course')
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    const { allCourses } = res.data
                    setListSubjectJoined(allCourses)
                }
            })


        await restClientApi.asyncGet('/course/public')
            .then(res => {
                console.log('response', res)
                if (!res.hasError) {
                    const { allCourses } = res.data
                    setPublicSubject(allCourses)
                }
                setLoadingCourse(false)
            })
    }

    const menuPrivate = (
        <Menu>
            {isTeacherFlag && <Menu.Item key="2">Export</Menu.Item>}
        </Menu>
    );

    const menuPublic = (
        <Menu>
            <Menu.Item key="1">Enroll</Menu.Item>
            {isTeacherFlag && <Menu.Item key="2">Export</Menu.Item>}
        </Menu>
    );

    const navigationTo = (item) => {
        history.push('/home/course-app', item)
    }

    if (loadingCourse) {
        return <ModalLoadingLogin visible={loadingCourse} content={t("loading_subject")} />
    }

    return (<><div className="wrapper-main-app">
        <Tabs defaultActiveKey="1" type='card' style={{ width: '92%' }}>
            <TabPane
                tab={
                    <span>
                        <AppleOutlined />
          Private
        </span>
                }
                key="1"
            ><div className="main-app-layout">
                    {
                        listSubjectJoined.map((item, index) => {
                            console.log('item', item)
                            return <Card

                                key={index}
                                className="course-card"
                                cover={
                                    <div style={{ background: generateColor(), width: '100%', height: 50, borderRadius: '0.25rem 0.25rem 0 0' }}></div>
                                }
                                actions={[
                                    <Dropdown overlay={menuPrivate} trigger={['click']} placement="topCenter">
                                        <SettingOutlined key="setting" />
                                    </Dropdown>,
                                    <Tooltip placement="topLeft" title="Mở sổ điểm cho">
                                        <img src={IC_CHART} />
                                    </Tooltip>,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    onClick={() => navigationTo(item)}
                                    avatar={<FontAwesomeIcon icon="graduation-cap" style={{ width: 50, height: 50, color: '#0F70B8' }} />}
                                    title={item?.name}
                                    description="Chào mứng đến lớp học vui vẻ của tôi ^_^"
                                    style={{ cursor: 'pointer' }}
                                />
                            </Card>
                        })
                    }

                </div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <AndroidOutlined />
          Public
        </span>
                }
                key="2"
            >
                <div className="main-app-layout">
                    {
                        publicSubject.map((item, index) => {
                            console.log('item', item)
                            return <Card

                                key={index}
                                className="course-card"
                                cover={
                                    <div style={{ background: generateColor(), width: '100%', height: 50, borderRadius: '0.25rem 0.25rem 0 0' }}></div>
                                }
                                actions={[
                                    <Dropdown overlay={menuPublic} trigger={['click']} placement="topCenter">
                                        <SettingOutlined key="setting" />
                                    </Dropdown>,
                                    <Tooltip placement="topLeft" title="Mở sổ điểm cho">
                                        <img src={IC_CHART} />
                                    </Tooltip>,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    onClick={() => navigationTo(item)}
                                    avatar={<FontAwesomeIcon icon="graduation-cap" style={{ width: 50, height: 50, color: '#0F70B8' }} />}
                                    title={item?.name}
                                    description="Chào mứng đến lớp học vui vẻ của tôi ^_^"
                                    style={{ cursor: 'pointer' }}
                                />
                            </Card>
                        })
                    }

                </div>
            </TabPane>
        </Tabs>

    </div>
    </>
    )
}

export default MainAppLayout