import React from 'react'
import { Card, Avatar, Tooltip, Menu, Dropdown } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import IC_CHART from '../../assets/images/ic_chart.svg'
import IC_FAKE_BG from '../../assets/images/fake_bg.svg'
import { useHistory } from 'react-router';

const { Meta } = Card;

const generateColor = () => {
    return '#' + Math.random().toString(16).substr(-6);
}

const MainAppLayout = () => {
    const { t } = useTranslation()
    const history = useHistory()

    const menu = (
        <Menu>
            <Menu.Item key="1">Chỉnh sửa</Menu.Item>
            <Menu.Item key="2">Sao chép</Menu.Item>
            <Menu.Item key="3">Lưu trữ</Menu.Item>
        </Menu>
    );

    

    const navigationTo = () => {
        history.push('/home/course-app')
    }

    return (<div className="main-app-layout">
        {
            [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                return <Card

                    key={index}
                    className="course-card"
                    cover={
                        <div style={{ background: generateColor(), width: '100%', height: 50, borderRadius: '8px 8px 0 0' }}></div>
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
                        onClick={() => navigationTo()}
                        avatar={<img src={IC_FAKE_BG} />}
                        title="Card title"
                        description="This is the description"
                    />
                </Card>
            })
        }

    </div>
    )
}

export default MainAppLayout