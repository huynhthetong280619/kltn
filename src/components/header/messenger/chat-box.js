import { Avatar, Button, Col, Comment, Drawer, Form, Input, List, Row, Spin, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import RestClient from '../../../utils/restClient';
import ModalWrapper from '../../../components/basic/modal-wrapper/index.js';

import PerfectScrollbar from 'react-perfect-scrollbar'

const { Text } = Typography;

const Messages = ({ t, messages }) => (
    <List
        dataSource={messages}
        itemLayout="horizontal"
        renderItem={props =>
            <Comment author={<span className="color-default">{props.user.firstName + " " + props.user.lastName}</span>}
                avatar={
                    <Avatar
                        src={props.user.urlAvatar}
                        alt={props.user.firstName + " " + props.user.lastName}
                    />
                }

                content={
                    <p className="color-default">
                        {props.message}
                    </p>
                }

                datetime={
                    <Tooltip title={props.time}>
                        <span>{props.time}</span>
                    </Tooltip>
                }
            />
        }
    />
)

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

const ChatBox = ({ isOpen, setOpen, socket, roomId, setRoomId, room, profile }) => {
    const { t, i18n } = useTranslation();

    const [commentInput, setCommentInput] = useState('')
    const [messages, setMessages] = useState([])
    const [submitting, setSubmitting] = useState(false);

    const [isLoadMessages, setLoadMessages] = useState(true);

    const restClient = new RestClient({ token: '' });

    const handleSubmit = () => {

        if (commentInput.trim().length > 0) {
            socket.emit("chat", { message: commentInput, chatroomId: room._id })
        }
        setCommentInput('');
    }

    const scrollToNewMessage = (speed = 500) => {
        const elm = document.querySelector('.ant-list-items')

        if (elm) {
            setTimeout(() => {
                elm.scrollTo({ left: 0, top: elm.scrollHeight + elm.clientHeight, behavior: "smooth" })
            }, speed)
        }
    }

    const handleChange = (e) => {
        setCommentInput(e.target.value)
    }

    const loadMessages = () => {
        setLoadMessages(true);
        restClient.asyncPost(`/chatroom/${roomId}/messages`, {
            current: messages.length
        })
            .then(res => {
                if (!res.hasError) {
                    setMessages(preState => preState.concat(res.data.messages));
                }
            })
            .finally(() => {
                setLoadMessages(false);
            })
    }

    useEffect(() => {
        if (roomId) {
            loadMessages(() => {
                scrollToNewMessage(0);
            });
        } else {
            setMessages([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId])

    useEffect(() => {
        if (socket) {
            if (isOpen) {
                socket.emit('join-chat', { chatroomId: room._id });
                socket.on("chatMessage", (message) => {
                    setMessages(preState => [...preState, message]);
                    scrollToNewMessage();
                })
            } else {
                socket.emit('leave-chat', { chatroomId: roomId });
                setRoomId(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

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
                    <img src={room?.image} height={46} alt={room?.name} />
                </Col>
                <Col span={18} style={{
                    height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Text style={{ color: '#e4e6eb' }}>{room?.name}</Text>
                    <Text style={{ color: '#232323', fontSize: '0.75rem' }}></Text>
                </Col>

            </Row>

            <ModalWrapper style={{height: 314, overflow: 'auto'}}>
                <PerfectScrollbar
                    onScrollUp={(ref) => {
                        console.log(ref.scrollTop)
                        if (ref.scrollTop === 0) {
                            if (room._id) {
                            }
                        }
                    }}
                    >
                    {
                        isLoadMessages &&
                        <Row justify="center">
                            <Spin tip="Loading..."></Spin>
                        </Row>
                    }
                    {/* <Messages t={t} messages={messages} /> */}

                    {messages.map(props => (
                        <Comment author={<span className="color-default">{props.user.firstName + " " + props.user.lastName}</span>}
                            avatar={
                                <Avatar
                                    src={props.user.urlAvatar}
                                    alt={props.user.firstName + " " + props.user.lastName}
                                />
                            }

                            content={
                                <p className="color-default">
                                    {props.message}
                                </p>
                            }

                            datetime={
                                <Tooltip title={props.time}>
                                    <span>{props.time}</span>
                                </Tooltip>
                            }
                        />
                    ))}
                </PerfectScrollbar>
            </ModalWrapper>

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
        </Drawer>
    </>
}

export default ChatBox;