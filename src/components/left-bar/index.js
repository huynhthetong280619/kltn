import React, { useContext, useEffect, useState } from 'react';
import { Drawer, Button, Divider, Typography } from 'antd';
import { ReactComponent as IC_FOLDER } from '../../assets/images/ic_folder.svg'
import { ReactComponent as IC_TODO } from '../../assets/images/ic_todo.svg'
import { ReactComponent as IC_STORAGE } from '../../assets/images/ic_storage.svg'
import { ReactComponent as IC_SETTING } from '../../assets/images/ic_set.svg'
import { ReactComponent as IC_CLASS } from '../../assets/images/ic_class.svg'
import { useHistory } from 'react-router';
import { StoreTrading } from '../../store-trading';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const LeftBar = ({ isOpen, setOpen }) => {
    const {t} = useTranslation()
    const history = useHistory()
    const { token } = useContext(StoreTrading)
    const [isTeacherFlag, setIsTeacherFlag] = useState(false)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.idPrivilege == 'student') {
            setIsTeacherFlag(false)
        }

        if (user?.idPrivilege == 'teacher') {
            setIsTeacherFlag(true)
        }
    }, [])


    const onClose = () => {
        setOpen(false);
    };

    const navigationTo = (url) => {
        history.push(url)
        onClose()
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
                <div className="drawer-item__c color-default">{t('class')}</div>
            </div>
            <Divider />
            {
                isTeacherFlag ? <>
                    <Title level={5} style={{ color: '#f9f9f9' }}>Giảng dạy</Title>
                    <div className="drawer-item-app" onClick={() => navigationTo('/home/public-class')}>
                        <div className="mask-hover"></div>
                        <div className="drawer-item__i">
                            <IC_FOLDER />
                        </div>
                        <div className="drawer-item__c color-default">Lớp học public</div>
                    </div>
                    {/* <Divider />
                    <div className="drawer-item-app">
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_STORAGE />
                </div>
                <div className="drawer-item__c color-default">Lớp học đã lưu trữ</div>
            </div> */}
                </>  : <>
                <Title level={5} style={{ color: '#f9f9f9' }}>{t('registered_subject')}</Title>
            <div className="drawer-item-app" onClick={() => navigationTo('/home/todo-list')}>
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_TODO />
                </div>
                <div className="drawer-item__c color-default">{t('todo_list')}</div>
            </div>
            <Divider />
                </>
            }

            
            
            <div className="drawer-item-app" onClick={() => navigationTo('/home/setting')}>
                <div className="mask-hover"></div>
                <div className="drawer-item__i">
                    <IC_SETTING />
                </div>
                <div className="drawer-item__c color-default">{t('setting')}</div>
            </div>
        </Drawer>
    )
}

export default LeftBar