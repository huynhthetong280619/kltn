import { Avatar, Button, Col, Comment, Drawer, Form, Input, List, Row, Spin, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RestClient from '../../../utils/restClient';
import "react-perfect-scrollbar/dist/css/styles.css";

import Messages from './messages';

const { Text } = Typography;

const Editor = ({ t, onChange, onSubmit, submitting, value }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        columnGap: '1rem'
    }}>
        <Form.Item>
            <Input onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onSubmit();
                }
            }} onChange={onChange} value={value} placeholder="Nội dung tin nhắn..." />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                {t('send')}
            </Button>
        </Form.Item>
    </div>
);

const ChatBox = ({ isOpen, setOpen, socket, room, profile, newContact, addNewContact }) => {
    const { t, i18n } = useTranslation();

    const [commentInput, setCommentInput] = useState('');

    const [submitting, setSubmitting] = useState(false);

    const [isMakingContact, setIsMakingContact] = useState(false);

    const restClient = new RestClient({ token: '' });

    const handleSubmit = () => {

        if (commentInput.trim().length > 0) {
            socket.emit("chat", { message: commentInput, chatroomId: room._id })
        }
        setCommentInput('');
    }

    const handleChange = (e) => {
        setCommentInput(e.target.value)
    }

    const handleAddNewContact = () => {
        setIsMakingContact(true);
        restClient.asyncPost('/chatroom',
            {
                to: newContact._id
            })
            .then(res => {
                if (!res.hasError) {
                    addNewContact(res.data.room);
                }
            })
            .finally(() => {
                setIsMakingContact(false);
            })
    }

    return <>
        <Drawer
            placement="right"
            closable={false}
            onClose={() => setOpen(false)}
            visible={isOpen}
            maskStyle={{ backgroundColor: 'transparent' }}
            width={350}
            style={{ height: 500, bottom: 0, top: 'unset' }}
            headerStyle={{ display: 'none' }}
            footer={null}
            className="message-content"
            level
        >
            <Row style={{ padding: '4px', marginBottom: '1rem' }}>
                <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                    <img src={room?.image || newContact?.urlAvatar} height={46} alt={room?.name || `${newContact?.firstName} ${newContact?.lastName}`} />
                </Col>
                <Col span={18} style={{
                    height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Text style={{ color: '#e4e6eb' }}>{room?.name || `${newContact?.firstName} ${newContact?.lastName}`} </Text>
                    <Text style={{ color: '#232323', fontSize: '0.75rem' }}></Text>
                </Col>

            </Row>

            {
                newContact ?
                    (
                        <Row
                            justify="center">
                            <Button
                                loading={isMakingContact}
                                onClick={handleAddNewContact}
                            >
                                Make new contact</Button>
                        </Row>
                    ) :
                    (<>
                        {room && socket && isOpen && <Messages socket={socket} room={room} />}

                        <Comment
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                padding: '0px 20px'
                            }}
                            avatar={
                                <Avatar
                                    src={profile.urlAvatar}
                                    alt="Avatar"
                                />
                            }
                            content={
                                <Editor
                                    t={t}
                                    onChange={handleChange}
                                    onSubmit={handleSubmit}
                                    submitting={submitting}
                                    value={commentInput}
                                />
                            }
                        />
                    </>)
            }

        </Drawer>
    </>
}

export default ChatBox;