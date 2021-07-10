import React, { useState, useEffect } from 'react'
import { Col, Row, Typography } from 'antd'

import IC_AVATAR from '../../../assets/images/ic_avatar.svg'

import ChatBox from './chat-box';

import RestClient from '../../../utils/restClient';
const { Text } = Typography;

const Messenger = ({ profile, socket, isOpen, setOpen }) => {

    const [isOpenChatBox, setOpenChatBox] = useState(false);

    const [roomId, setRoomId] = useState(null);

    const restClient = new RestClient({ token: '' });

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (isOpenChatBox && isOpen) {
            setOpenChatBox(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        restClient.asyncGet('/chatroom/')
            .then(res => {
                if (!res.hasError) {
                    setRooms(res.data.rooms);
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>
        <div style={{
            display: isOpen ? 'block' : 'none'
        }} className="message-dialog">
            <div className="title-message">Message</div>
            <input style={{ width: '98%', height: '36px', borderRadius: '30px', outline: 'none', backgroundColor: '#3A3B3C', paddingLeft: 20, color: '#fff', border: 0 }} placeholder="Search messager" className="input-message" />
            <div style={{
                maxHeight: '262px',
                overflowY: 'auto',
            }}>

                {rooms.map(room =>
                    <Row
                        key={room._id}
                        style={{ padding: '4px', margin: ' 10px 4px' }}
                        className="item-message"
                        onClick={() => {
                            setOpen(false);
                            setOpenChatBox(true);
                            setRoomId(room._id);
                        }}>
                        <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                            <img src={room.image} height={46} alt={room.name} />
                        </Col>
                        <Col span={18} style={{
                            height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Text style={{ color: '#e4e6eb' }}>{room.name}</Text>
                            {/* <Text style={{ color: '#b0b3b8' }}>{room.message}</Text> */}
                        </Col>
                    </Row>
                )}
            </div>
        </div>

        <ChatBox
            profile={profile}
            isOpen={isOpenChatBox}
            setOpen={setOpenChatBox}
            roomId={roomId}
            room={rooms.find(({ _id }) => _id === roomId)}
            setRoomId={setRoomId}
            socket={socket} />
    </>
}

export default Messenger;