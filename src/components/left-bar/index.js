import React, { useState } from 'react';
import { Drawer, Button, Divider, Typography } from 'antd';
import { ReactComponent as IC_FOLDER } from '../../assets/images/ic_folder.svg'
import { ReactComponent as IC_TODO } from '../../assets/images/ic_todo.svg'
import { ReactComponent as IC_STORAGE } from '../../assets/images/ic_storage.svg'
import { ReactComponent as IC_SETTING } from '../../assets/images/ic_set.svg'
import { ReactComponent as IC_CLASS } from '../../assets/images/ic_class.svg'
import { useHistory } from 'react-router';

const { Title } = Typography;

const LeftBar = ({ isOpen, setOpen }) => {

    const history = useHistory()

    const onClose = () => {
        setOpen(false);
    };

    const navigationTo = (url) => {
        history.push(url)
    }

    return (
        <Drawer
            placement="left"
            closable={false}
            onClose={onClose}
            visible={isOpen}
            maskStyle={{ backgroundColor: 'transparent' }}
            width={304}
            headerStyle={{ display: 'none' }}
            footer={null}
        >
            <div className="drawer-item-app" onClick={() => navigationTo('/home/main-app')}>
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_CLASS />
                </div>
                <div className="drawer-item__c">Lớp học</div>
            </div>
            <Divider />
            <Title level={5}>Giảng dạy</Title>
            <div className="drawer-item-app">
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_FOLDER />
                </div>
                <div className="drawer-item__c">Để đánh giá</div>
            </div>
            <Divider />
            <Title level={5}>Đã đăng ký</Title>
            <div className="drawer-item-app">
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_TODO />
                </div>
                <div className="drawer-item__c">Việc cần làm</div>
            </div>
            <Divider />
            <div className="drawer-item-app">
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_STORAGE />
                </div>
                <div className="drawer-item__c">Lớp học đã lưu trữ</div>
            </div>
            <div className="drawer-item-app" onClick={() => navigationTo('/home/setting')}>
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_SETTING />
                </div>
                <div className="drawer-item__c">Cài đặt</div>
            </div>
        </Drawer>
    )
}

export default LeftBar