import React, { useContext, useEffect, useState } from 'react'
import { Card, Avatar, Tooltip, Menu, Dropdown } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import IC_CHART from '../../assets/images/ic_chart.svg'
import IC_FAKE_BG from '../../assets/images/fake_bg.svg'
import { useHistory } from 'react-router';
import { StoreTrading } from '../../store-trading';
import RestClient from '../../utils/restClient';
import ModalLoadingLogin from '../login/modal-loading-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { Meta } = Card;

const generateColor = () => {
    return '#' + Math.random().toString(16).substr(-6);
}

const MainAppLayout = () => {
    const { t } = useTranslation()
    const { authFlag, token } = useContext(StoreTrading)
    const history = useHistory()

    const [listSubjectJoined, setListSubjectJoined] = useState([])
    const [loadingCourse, setLoadingCourse] = useState(false)

    useEffect(() => {
        getListSubjectJoin();

        if(!authFlag){
            history.push('/login')
        }
    }, [])

    const getListSubjectJoin = async () => {
        setLoadingCourse(true)
        setTimeout(() => {
            setLoadingCourse(false)
        }, 15000);
        const restClientApi = new RestClient({ token })

        await restClientApi.asyncGet('/subject')
            .then(res => {
                if (!res.hasError) {
                    const { allSubject } = res.data
                    setLoadingCourse(true)
                    setListSubjectJoined(allSubject)
                }
            })
    }

    const menu = (
        <Menu>
            <Menu.Item key="1">Chỉnh sửa</Menu.Item>
            <Menu.Item key="2">Sao chép</Menu.Item>
            <Menu.Item key="3">Lưu trữ</Menu.Item>
        </Menu>
    );

    const navigationTo = (item) => {
        history.push('/home/course-app', item)
    }

    if(loadingCourse){
        return <ModalLoadingLogin visible={loadingCourse} content={t("loading_subject")} />
    }

    return (<div className="main-app-layout">
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
                        <Dropdown overlay={menu} trigger={['click']} placement="topCenter">
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
                        avatar={<FontAwesomeIcon icon="graduation-cap" style={{width: 50, height: 50, color: '#0F70B8'}} />}
                        title={item?.name}
                        description="Chào mứng đến lớp học vui vẻ của tôi ^_^"
                        style={{cursor: 'pointer'}}
                    />
                </Card>
            })
        }

    </div>
    )
}

export default MainAppLayout