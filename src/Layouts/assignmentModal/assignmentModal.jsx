import React, { useState } from 'react'
import { get } from 'lodash';
import { useTranslation, withTranslation } from 'react-i18next';
import { Row, Input, Modal, Tabs, Button, Typography } from 'antd'
import { notifyError, notifyWarning } from '../../assets/common/core/notify.js';
import downloadFile from '../../assets/common/core/downloadFile.js';
import moment from 'moment'
import file from '../../assets/images/contents/file.png'
import word from '../../assets/images/contents/word.png'
import rar from '../../assets/images/contents/rar.png'
import pdf from '../../assets/images/contents/pdf.png'
import RestClient from '../../utils/restClient.js';
// import Loading from '../../loading/loading.jsx'
import { ReactComponent as IC_CLOSE } from '../../assets/images/contents/ic_close.svg'
import LoadingRequest from '../loading-request/loading.jsx';


const { TextArea } = Input;
const { TabPane } = Tabs;


const { Text } = Typography;

const AssignmentModal = (props) => {
    const { t } = useTranslation()
    const [fileData, setFileData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [comment, setComment] = useState('')

    const restClient = new RestClient({ token: '' })

    const transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    const handleProcessFile = (e) => {
        setFileData(e.target.files[0])
    }

    const handleSubmit = async () => {
        props.onSubmitAssignment();
        const idAssignment = props.assignment._id;
        if (fileData) {

            const objectFile = await restClient.asyncUploadFile(fileData);
            if (objectFile) {
                props.submitAssignment({ file: objectFile, idAssignment: idAssignment });
            } else {
                props.onCancelSubmitAssignment();
                notifyError(t('failure'), t('err_upload_file'));
            }
        } else {
            props.onCancelSubmitAssignment();
            notifyWarning(t('warning'), t('warning_choose_file_submit'));
        }

    }
    const commentFeedback = () => {
        const idAssignment = props.assignment._id;
        props.commentAssignmentGrade({ comment, idAssignment });
    }

    const handleCancel = () => {
        setFileData(null)
        setComment('')
        props.handleCancelModal();
    }


    return <Modal
        closable={false}
        className="modal-function-customize"
        title={<div
            style={{
                padding: '1rem 0.625rem 0.625rem 0',
                alignItems: 'center',
            }}

        >
            <div style={{ color: '#f9f9f9' }}>{`[ ${t('exercise')} ] ${props.assignment ? props.assignment.name : ' '}`}</div>
            <div className="close-icon-modal" onClick={() => handleCancel()()}>
                <IC_CLOSE />
            </div></div>}
        visible={props.isTodoModal}
        onCancel={() => handleCancel()}
        footer={null}
    >
        {props.assignment ?
            (
                <Tabs defaultActiveKey="1" centered type="card">
                    <TabPane tab={`${t('submission')}`} key="1">
                        <div>
                            <div style={{ margin: '10px 0' }}>
                                <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('sbmit_stat')} </span>
                                {(get(props.assignment, 'submissionStatus') ? <Text type='success'>{t('status_submitted')}</Text> : <Text type='danger'>{t('status_not_submit')}</Text>)}
                            </div>
                            <div style={{ margin: '10px 0' }}>
                                <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('dueTo')} </span>
                                <span style={{ color: '#f9f9f9' }}>{transTime(get(props.assignment, 'setting')?.expireTime)}</span>
                            </div>
                            <div style={{ margin: '10px 0' }}>
                                <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('time_remain')} </span>
                                <span style={{ color: '#f9f9f9' }}>{get(props.assignment, 'timingRemain')}</span>
                            </div>
                            {props.assignment.submission && (<div style={{ margin: '10px 0' }}>
                                <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('last_modified')} </span>
                                <span style={{ color: '#f9f9f9' }}>{transTime(get(props.assignment, 'submission').submitTime)}</span>
                            </div>)}
                            {get(props.assignment, 'isCanSubmit') && (<div style={{ margin: '10px 0' }} >
                                <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('file_submit')} </span>
                                <Input type="file" onChange={e => handleProcessFile(e)} style={{ width: 200, borderRadius: 20, overflow: 'hidden' }} />
                            </div>)}
                            {
                                (props.assignment.submission !== null) && <div style={{ margin: '10px 0' }}>
                                    <div style={{
                                        padding: '5px 20px',
                                        textAlign: 'center'
                                    }}>
                                        <img src={get(props.assignment.submission, 'file')?.type.includes('doc') ? word : get(props.assignment.submission, 'file')?.type == 'rar' ? rar : file} />
                                        <a>
                                            <span onClick={() => downloadFile(get(props.assignment.submission, 'file'))}>
                                                {get(props.assignment.submission, 'file')?.name}.{get(props.assignment.submission, 'file')?.type}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            }


                        </div>
                        {
                            get(props.assignment, 'isCanSubmit') &&
                            <Row style={{ marginTop: 10 }}>
                                <div>
                                    <Button type="primary" loading={props.isSubmitAssignment} onClick={handleSubmit} style={{ borderRadius: 20 }}>{t('submit_assign')}</Button>
                                </div>
                            </Row>
                        }

                    </TabPane>
                    <TabPane tab={t('requirement')} key="2">
                        <div style={{ fontWeight: "700", color: '#f9f9f9' }} > [{t('require_content')}]</div>
                        <div style={{ whiteSpace: 'pre-line', color: '#f9f9f9' }} dangerouslySetInnerHTML={{ __html: get(props.assignment, 'content') }} />
                        <div style={{ fontWeight: "700", color: '#f9f9f9' }}>{t('file_submit')}</div>
                        <div style={{ height: 50 }}>
                            {
                                (get(props.assignment, 'attachments') || []).map(f => {
                                    return <span style={{
                                        verticalAlign: '-webkit-baseline-middle',
                                        border: '1px dashed #cacaca',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                    }}>
                                        {f.type.includes('doc')
                                            ? <img src={word} width={20} /> : <img src={pdf} width={20} />}
                                        <a style={{ marginLeft: 10 }}>
                                            <span onClick={() => downloadFile(f)}>{f.name}.{f.type}</span>
                                        </a>
                                    </span>
                                })
                            }
                        </div>
                    </TabPane>
                    <TabPane tab={t('grade')} key="3">
                        {
                            get(props.assignment, 'gradeStatus') ? (<>
                                <div style={{ margin: '10px 0' }}>
                                    <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('grade_status')}: </span>
                                    <Text type="success">{t('status_graded')}</Text>
                                </div>
                                <div>
                                    <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('grade')}: </span>
                                    <span>{get(get(props.assignment, 'submission')?.feedBack, 'grade')}</span>
                                </div>
                                <div>
                                    <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('grade_on')}: </span>
                                    <span>{transTime(get(get(props.assignment, 'submission')?.feedBack, 'gradeOn'))}</span>
                                </div>
                                {
                                    (props.assignment.submission.feedBack.comment) ?
                                        (
                                            <div>
                                                <span style={{ fontWeight: 600, color: '#f9f9f9' }}>{t('comment')}: </span>
                                                <span>{props.assignment.submission.feedBack.comment}</span>
                                            </div>
                                        )
                                        : (
                                            <>
                                                <div>
                                                    <div style={{ marginBottom: 10 }}>{t('fback_comt')}</div>
                                                    <TextArea rows={2}
                                                        placeholder="Comment about grade..."
                                                        autoSize={{ minRows: 2, maxRows: 5 }}
                                                        showCount
                                                        onChange={e => {
                                                            setComment(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                                <Row style={{ marginTop: 10 }}>
                                                    <div>
                                                        <Button type="primary" loading={props.isCommentAssignment} onClick={commentFeedback} style={{ borderRadius: 20 }}>{t('send')}</Button>
                                                    </div>
                                                </Row>
                                            </>
                                        )
                                }
                            </>
                            )
                                :
                                (
                                    <div style={{ color: '#ff4000', fontStyle: 'italic' }}>{t('not_review')}</div>
                                )
                        }
                    </TabPane>
                </Tabs>
            ) : <LoadingRequest />
        }
    </Modal>
}



export default AssignmentModal
