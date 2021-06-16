import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Form, Button, List, Input, Tooltip, Comment } from 'antd'

import ModalWrapper from '../../../components/basic/modal-wrapper'
import { get } from 'lodash'

const CommentList = ({ t, comments }) => (
    <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props => <Comment author={<span className="color-default">{get(get(props, 'user'), 'firstName') + " " + get(get(props, 'user'), 'lastName')}</span>}
            avatar={
                <Avatar
                    src={get(get(props, 'user'), 'urlAvatar')}
                    alt={get(get(props, 'user'), 'firstName') + " " + get(get(props, 'user'), 'lastName')}
                />
            }

            content={
                <p className="color-default">
                    {get(get(props, 'message'), 'message')}
                </p>
            }

            datetime={
                <Tooltip title={get(props, 'time')}>
                    <span>{get(props, 'time')}</span>
                </Tooltip>
            }
        />}


    />
);

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
            }} onChange={onChange} value={value} placeholder="Nội dung thảo luận..." />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                {t('send')}
            </Button>
        </Form.Item>
    </div>
);

const ChatTab = ({ socket, openChatTab, currentUser }) => {
    const { t } = useTranslation()

    const [commentInput, setCommentInput] = useState('')
    const [comments, setComments] = useState([])
    const [submitting, setSubmitting] = useState(false);

    socket.on('newMessage', (message) => {
        setComments([...comments, message]);
        scrollToNewMessage();
    })

    const handleSubmit = () => {

        if (!commentInput) {
            return;
        }

        setSubmitting(true)

        socket.emit('message', { message: commentInput });

        setSubmitting(false)
        setCommentInput('')
    }

    const scrollToNewMessage = () => {
        const elm = document.querySelector('.ant-list-items')

        if (elm) {
            setTimeout(() => {
                elm.scrollTo({ left: 0, top: elm.scrollHeight + elm.clientHeight, behavior: "smooth" })
            }, 1000)
        }
    }

    const handleChange = (e) => {
        setCommentInput(e.target.value)
    }

    return <>
        {openChatTab &&
            <div style={{ width: '40%' }}>
                <ModalWrapper style={{ height: '100%', position: 'relative' }} className="zoom-list">


                    {comments.length > 0 && <CommentList t={t} comments={comments} />}

                    <Comment
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '2rem'
                        }}
                        avatar={
                            <Avatar
                                src={currentUser.urlAvatar}
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
                </ModalWrapper>
            </div>
        }
    </>
}

export default ChatTab