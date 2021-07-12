import { Col, Row, Typography, Input, } from 'antd';
import React, { useEffect, useState } from 'react';
import RestClient from '../../../utils/restClient';
import ChatBox from './chat-box';
import SearchContact from './search-contact';

import * as notify from "../../../assets/common/core/notify";
import { isFile } from '@babel/types';

const { Text } = Typography;

const Messenger = ({ profile, socket, isOpen, setOpen }) => {

    const [isOpenChatBox, setOpenChatBox] = useState(false);

    const [room, setRoom] = useState(null);

    const restClient = new RestClient({ token: '' });

    const [rooms, setRooms] = useState([]);

    const [isShowSearch, setIsShowSearch] = useState(false);

    const [searchText, setSearchText] = useState('');

    const [isSearching, setIsSearching] = useState(false);

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
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('message-income', (message => {
                notify.notifyMessage(`${message.user.lastName} đã gửi cho bạn 1 tin nhắn`, message.message);
            }))
        }
    }, [socket]);

    const [newContact, setNewContact] = useState(null);

    const handleOpenNewContactBox = (contact) => {
        setOpenChatBox(true);
        setNewContact(contact);
    }

    const handleAddNewContact = (room) => {
        setRooms([...rooms, room]);
        setRoom(room);
        setOpen(false);
        setIsSearching(false);
        setIsShowSearch(false);
        setSearchText("");
        setNewContact(null);
    }

    return <>
        <div style={{
            display: isOpen ? 'block' : 'none'
        }} className="message-dialog">
            <div className="title-message">Message</div>
            <Input.Search
                placeholder="Search messager"
                className="input-message"
                onChange={(e) => {
                    const text = e.target.value;
                    if (!text.trim()) {
                        setIsShowSearch(false);
                    }
                }}
                allowClear
                onSearch={(value) => {
                    setIsSearching(true);
                    setIsShowSearch(true);
                    setSearchText(value);
                }}
            />
            <div style={{
                maxHeight: '262px',
                overflowY: 'auto',
            }}>
                {isShowSearch
                    ? <SearchContact
                        searchText={searchText}
                        isSearching={isSearching}
                        setIsSearching={setIsSearching}
                        openContactBox={handleOpenNewContactBox} />
                    : rooms.map(room =>
                        <Row
                            key={room._id}
                            style={{ padding: '4px', margin: ' 10px 4px' }}
                            className="item-message"
                            onClick={() => {
                                setOpen(false);
                                setOpenChatBox(true);
                                setRoom(room);
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
            newContact={newContact}
            addNewContact={handleAddNewContact}
            profile={profile}
            isOpen={isOpenChatBox}
            setOpen={setOpenChatBox}
            room={room}
            socket={socket} />
    </>
}

export default Messenger;