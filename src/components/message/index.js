import React, {useState} from 'react'
import Like from '../../assets/images/like.svg'
import Attachment from '../../assets/images/attachment.svg'
import { Col, Row, Typography } from 'antd'
import IC_AVATAR_THIRD from '../../assets/images/ic_avatar_third.svg'

const init = [
    {
        id: 1,
        content: 'Hi Anni, What’s Up?',
    },
    {
        id: 0,
        content: 'Oh, hello! All perfect',
    },
    {
        id: 1,
        content: 'COOL!! Let’s Meet?',
    },
    {
        id: 0,
        content: 'How about this friday?',
    },
    {
        id: 1,
        content: 'Sounds Cool!!',
    },
    {
        id: 0,
        content: 'Great Let’s catch up.',
    }
]




const Message = () => {
    const [conversation, setConversation] = useState(init)
    const [msg, setMsg] = useState('')

    const handleSendMessage = (event) => {
        if(event.keyCode == 13){
            console.log('Type enter key...')
            confirmSendMessage()
        }
    }

    const confirmSendMessage = () => {
        const nodeMsg = {
            id: 0,
            content: msg
        }

        setConversation([...conversation, nodeMsg])
        setMsg('')
    }
    
    return (
        <div className="chat-tab" >

            <div className="chat-tab-header">
                <Col span={12}>
                    <div></div>
                    <div> Nguyễn Anh Quân</div>
                </Col>
                <Col span={12}></Col>

            </div>
            <div className="chat-tab-content">
                {
                    conversation.map((item, index) => item.id !== 0 ? (
                        <div key={index.toString()} className="item-message-tab">
                            <Col span={4}>
                                <img src={IC_AVATAR_THIRD} height={30} />
                            </Col>
                            <Col span={16} className="item-message-content message-client">
                                <div>{item.content}</div>
                            </Col>

                        </div>
                    ) : <div key={index.toString()} className="item-message-tab" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className="item-message-content message-server">
                                <div>{item.content}</div>
                            </div>
                        </div>)
                }
            </div>
            <div className="chat-tab-footer">
                <Col span={3} style={{ textAlign: 'center' }}>
                    <img src={Attachment} />
                </Col>
                <Col span={17} style={{ marginRight: 10 }}>
                    <input value={msg} className="input-message" placeholder="Aa ..." onChange={e => setMsg(e.target.value)} onKeyDown={e => handleSendMessage(e)} />
                </Col>
                <Col span={3}>
                    <img src={Like} />
                </Col>
            </div>
        </div>
    )
}

export default Message