import { Badge, Button, Card, Col, Form, Input, Modal, notification, Row, Skeleton, Tooltip } from 'antd'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import discussion from '../../assets/images/contents/discussion.jpg'
import ModalWrapper from '../../components/basic/modal-wrapper'
import RestClient from '../../utils/restClient'
import ModalLoadingLogin from '../login/modal-loading-login'
import './overwrite.css'
import { ReactComponent as Logout } from '../../assets/images/contents/logout.svg';


const { Meta } = Card;

const Topic = () => {
    const { t } = useTranslation()
    const restClient = new RestClient({ token: '' })
    const location = useLocation()
    const history = useHistory()
    const [isModalCreateTopic, setIsModalCreateTopic] = useState(false)
    const [detailForum, setDetailForum] = useState([])
    const [forum, setForum] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { forumId, idSubject, idTimeline } = location.state


    useEffect(async () => {
        setIsLoading(true)
        await restClient.asyncGet(`/forum/${forumId}?idCourse=${idSubject}&idTimeline=${idTimeline}`)
            .then(res => {
                if (!res.hasError) {
                    console.log(res)
                    setForum(get(res, 'data'))
                    setDetailForum(get(get(res, 'data'), 'topics'))
                }
                setIsLoading(false)
            })
    }, [])

    const showModal = () => {
        setIsModalCreateTopic(true)
    };

    const handleCancel = () => {
        setIsModalCreateTopic(false)
    };

    const createTopic = async (topic) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimeline,
            idForum: forumId,
            data: {
                name: topic.name,
                content: topic.content
            }
        }
        console.log(data)

        await restClient.asyncPost(`/topic?idCourse=${idSubject}&idTimeline=${idTimeline}&idForum=${forumId}`, data)
            .then(res => {
                if (!res.hasError) {
                    notifySuccess(t('success'), t('add_topic_success'))
                    setDetailForum([...detailForum, get(res, 'data').topic])
                    setIsModalCreateTopic(false)
                } else {
                    notifyError(t('failure'), res.data.message);
                }

            })
    }

    const notifySuccess = (message, description) => {
        notification.success({
            message,
            description,
            placement: 'bottomRight'
        });
    };

    const notifyWarning = (message, description) => {
        notification.warning({
            message,
            description,
            placement: 'bottomRight'
        });
    };


    const notifyError = (message, description) => {
        notification.error({
            message,
            description,
            placement: 'bottomRight'
        });
    };

    const onFinish = (values) => {
        console.log(values)
        createTopic(values)
    }

    return <div><ModalWrapper style={{ width: '90%', margin: '0 auto' }} className="mt-4">
        <Row style={{ textAlign: 'left', padding: '10px 0', justifyContent: 'space-between' }}>
            <Col style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <span className="mr-4">
                    <img src={discussion} width="25px" style={{ borderRadius: '1rem' }} />
                </span>
                <span className="color-default">[ {t('discussion_forum')} ] {get(forum, 'name')}</span>
            </Col>
            <Col style={{display: 'flex', alignItems: 'center', columnGap: '0.25rem'}}>
                <Button type="primary" onClick={() => setIsModalCreateTopic(true)} className="lms-btn" style={{ marginTop: 0 }}>{t('new_topic')}</Button>
                <Tooltip title="Exit">
                    <div className="zm-center" onClick={() => { history.goBack() }}>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Logout />
                        </div>
                    </div>
                </Tooltip>
            </Col>
        </Row>


        <div >
            <ModalWrapper style={{ background: '#494949', display: 'flex', justifyContent: 'center' }}>
                {
                    isLoading ? <Skeleton avatar paragraph={{ rows: 4 }} /> : detailForum.map(({ _id, create, name, description, replies }) => {
                        return (
                            <div style={{ display: 'grid', justifyContent: 'center', margin: '0.5rem' }} key={_id}>
                                <Badge.Ribbon text={`${t('replies_in_topic')}${replies ? replies : 0}`}
                                >
                                    <Card
                                        onClick={() => { history.push('discuss', { ...location.state, idTopic: _id }) }}
                                        hoverable
                                        style={{
                                            width: 161,
                                            borderRadius: '0.25rem'
                                        }}
                                        cover={<img alt="example" src={get(create, 'urlAvatar')} height={183} />}
                                    >

                                        <Tooltip title={name}>
                                            <Meta title={name} description={description} />
                                        </Tooltip>
                                    </Card>
                                </Badge.Ribbon>
                            </div>
                        )
                    })
                }
            </ModalWrapper>
        </div>
        <Modal
            className="modal-function-customize"
            title={<div
                style={{
                    padding: '1rem 0.625rem 0.625rem 0',
                    alignItems: 'center',
                }}

            >
                <div className="color-default">{t('new_topic')}</div>
            </div>}
            visible={isModalCreateTopic}
            onCancel={handleCancel}
            // confirmLoading={isLoading}
            footer={null}
        >
            <Form
                layout="vertical"
                name='frm_add_topic'
                id='frm_add_topic'
                onFinish={onFinish}
            >
                <Form.Item
                    name='name'
                    label={t('name')}
                    rules={[
                        {
                            required: true,
                            message: t('req_topic_name')
                        }
                    ]}
                >
                    <Input placeholder={t('topic_name')} style={{ borderRadius: 20 }} />
                </Form.Item>
                <Form.Item

                    name='content'
                    label={t('content')}
                    rules={[
                        {
                            required: true,
                            message: t('req_topic_content')
                        }
                    ]}
                >
                    <Input placeholder={t('topic_content')} style={{ borderRadius: 20 }} />
                </Form.Item>
                <Form.Item>

                    <Button key="submit" form="frm_add_topic" htmlType="submit" type="primary" className="lms-btn">
                        {t('save')}
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button key="back" type="danger" onClick={handleCancel} className="lms-btn">
                        {t('cancel')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>

        <ModalLoadingLogin visible={isLoading} content={t('loading_survey')} />
    </ModalWrapper>
    </div>

}



export default Topic
