import Title from 'antd/lib/typography/Title'
import React from 'react'
import { Switch } from 'antd'
import AVATAR from '../../assets/images/ic_avatar.svg'

const Setting = () => {
    return <div>
        <main className="main-setting">
            <div className="main-setting__f">
                <Title level={4}>Hỗ trợ</Title>
                <Title level={5}>Ảnh hồ sơ</Title>
                <div style={{ margin: "0.5rem 0" }}>
                    <span className="main-setting__f-avatar">
                        <span className="main-setting__f-avatar__">
                            <img className="avatar-display" alt="" height="32px" width="32px" aria-hidden="true" jsname="xJzy8c" src={AVATAR} />Thay đổi
                    </span>
                    </span>
                </div>
                <Title level={5}>Cài đặt tài khoản</Title>
                <Title level={5}>Đổi tên hiển thị</Title>
            </div>

            <div className="main-setting__f">
                <Title level={4}>Thông báo</Title>
                <Title level={5}>Email</Title>
                <div className="main-setting__s">
                    <Title level={5}>Nhận thông báo email</Title>
                    <Switch defaultChecked />
                </div>
            </div>
        </main>
    </div>
}

export default Setting