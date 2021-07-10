import { Avatar, Comment, Row, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import RestClient from '../../../utils/restClient';
import ModalWrapper from '../../../components/basic/modal-wrapper/index.js';

import PerfectScrollbar from 'react-perfect-scrollbar'
import "react-perfect-scrollbar/dist/css/styles.css";


const Messages = ({ socket, room }) => {
    const [messages, setMessages] = useState([])

    const [isLoadMessages, setLoadMessages] = useState(true);

    const restClient = new RestClient({ token: '' });

    const [scrollCtrRef, setScrollCtrRef] = useState(null);

    const scrollToNewMessage = (speed = 500) => {
        const elm = document.querySelector('#scroll-message');

        if (elm) {

            setTimeout(() => {
                elm.scrollTo({ left: 0, top: elm.scrollHeight + elm.clientHeight, behavior: "smooth" })
            }, speed)
        }
    }


    const loadMessages = (callBack) => {
        setLoadMessages(true);
        restClient.asyncPost(`/chatroom/${room._id}/messages`, {
            current: messages.length
        })
            .then(res => {
                if (!res.hasError) {
                    setMessages(preState => res.data.messages.concat(preState));
                }
            })
            .finally(() => {
                setLoadMessages(false);
                callBack();
            })
    }

    useEffect(() => {
        loadMessages(() => {
            scrollToBottom();
        });

        socket.emit('join-chat', { chatroomId: room._id });
        socket.on("chatMessage", (message) => {
            setMessages(preState => [...preState, message]);
            scrollToNewMessage();
        })

        return () => {
            setMessages([]);

            socket.emit('leave-chat', { chatroomId: room._id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const scrollToBottom = () => {
        const elm = document.querySelector('#scroll-message');

        if (elm) {
            elm.scrollTop = elm.scrollHeight + elm.clientHeight;
        }
    }

    const handleLoadMoreMessages = () => {
        const preHeight = scrollCtrRef.scrollHeight;
        loadMessages(() => {
            const currentHeight = scrollCtrRef.scrollHeight;
            scrollTo(currentHeight - preHeight);
        })
    }

    const scrollTo = (height) => {
        if (scrollCtrRef) {
            scrollCtrRef.scrollTop = height;
        }
    }

    return <>
        <ModalWrapper>
            <div style={{ height: '314px' }}>
                <PerfectScrollbar
                    id="scroll-message"
                    component="div"
                    onScrollUp={(ref) => {
                        if (ref.scrollTop === 0) {
                            if (room?._id) {
                                handleLoadMoreMessages();
                            }
                        }
                    }}
                    containerRef={ref => {
                        setScrollCtrRef(ref);
                    }}

                >
                    <div style={{ minHeight: '314px' }}>
                        {
                            isLoadMessages &&
                            <Row justify="center">
                                <Spin tip="Loading..."></Spin>
                            </Row>
                        }

                        {messages.map(props => (
                            <Comment
                                key={props._id}
                                author={<span className="color-default">{props.user.firstName + " " + props.user.lastName}</span>}
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
                    </div>
                </PerfectScrollbar>

            </div>

        </ModalWrapper>
    </>
}

export default Messages;