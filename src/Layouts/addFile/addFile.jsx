import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, Form, Checkbox, Skeleton } from 'antd'
// import Loading from '../../loading/loading.jsx';
import downloadFile from '../../assets/common/core/downloadFile.js';
import word from '../../assets/images/contents/word.png'
import pdf from '../../assets/images/contents/pdf.png'
import rar from '../../assets/images/contents/rar.png'
import RestClient from '../../utils/restClient.js';
import { notifyError, notifyWarning } from '../../assets/common/core/notify.js';
import { useTranslation } from 'react-i18next';
const { Option } = Select;

const AddFile = ({ timelinesList, createFile, updateFile, idSubject, idTimeline, idFile, token }) => {

    const [form] = Form.useForm();
    const [fileAttach, setFileAttach] = useState(null);

    const [isLoading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const { t } = useTranslation()
    const restClient = new RestClient({ token: '' })

    useEffect(() => {
        if (file) {
            form.setFieldsValue({
                idTimeline: idTimeline,
                file: { ...file, isDeleted: !file.isDeleted }
            })
        }
    }, [file])

    useEffect(() => {
        if (idFile) {
            restClient.asyncGet(`/timeline/${idTimeline}/files/${idFile}/?idSubject=${idSubject}`, token)
                .then(res => {
                    if (!res.hasError) {
                        setFile(res.data.file);
                    } else {
                        notifyError(t('failure'), res.data.message);
                    }
                })

        } else {
            form.setFieldsValue({
                idTimeline: timelinesList[0] ? timelinesList[0]._id : null,
                file: {
                    isDeleted: !false,
                }
            })
        }
    }, []);


    const handleCreateFile = async (file, idTimelineAdd) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineAdd,
            data: file
        }
        await restClient.asyncPost(`/timeline/${idTimelineAdd}/upload?idSubject=${idSubject}`, data)
            .then(res => {
                //console.log('handleCreateFile', res)
                setLoading(false);
                if (!res.hasError) {
                    createFile({ file: res.data.file, idTimeline: idTimelineAdd })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const handleUpdateFile = async (file, idTimelineUpdate) => {
        const data = {
            idSubject: idSubject,
            data: file
        }
        await restClient.asyncPut(`/timeline/${idTimelineUpdate}/files/${idFile}`, data, token)
            .then(res => {
                //console.log('handleUpdateFile', res)
                setLoading(false);
                if (!res.hasError) {
                    updateFile({ file: res.data.file, idTimeline: idTimelineUpdate })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const handleProcessFile = (e) => {
        setFileAttach(e.target.files[0])
    }



    const onFinish = async (values) => {
        setLoading(true);
        console.log('fileAttach', fileAttach);
        if (fileAttach) {
            const objectFile = await restClient.asyncUploadFile(fileAttach);
            if (objectFile) {
                const f = {
                    ...objectFile,
                    isDeleted: !values.file.isDeleted
                }
                //console.log('File', f);
                if (!idFile) {
                    handleCreateFile(f, values.idTimeline);
                }
                else {
                    handleUpdateFile(f, values.idTimeline);
                }
            } else {
                setLoading(false);
                notifyError(t('failure'), t('err_upload_file'));
            }
        } else if (idFile) {
            const f = {
                ...file,
                isDeleted: !values.file.isDeleted
            }
            handleUpdateFile(f, values.idTimeline);
        } else {
            setLoading(false);
            notifyWarning(t('warning'), t('warning_choose_file_upload'));
        }
    }

    return (
        <>
            {
                (idFile && !file) ?
                    <Skeleton />
                    : (<Form
                        onFinish={onFinish}
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                            label={t('timeline')}
                            name="idTimeline"
                            rules={[
                                {
                                    required: true,
                                    message: t('req_select_week')
                                }
                            ]}
                            hasFeedback>
                            <Select dropdownClassName="ant-customize-dropdown" disabled={idFile || false}>
                                {
                                    timelinesList.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                }
                            </Select>
                        </Form.Item>


                        {file &&
                            (
                                <Form.Item
                                    label={t('fileAttach')}>
                                    <span style={{
                                        verticalAlign: '-webkit-baseline-middle',
                                        border: '1px dashed #cacaca',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                    }}>
                                        {file.type.includes('doc')
                                            ? <img src={word} width={20} /> : <img src={pdf} width={20} />}
                                        <a style={{ marginLeft: 10 }} href="#">
                                            <span onClick={() => downloadFile(file)}>{file.name}.{file.type}</span>
                                        </a>
                                    </span>
                                </Form.Item>
                            )}

                        <Form.Item
                            label={!idFile ? t('addFileAttach') : t('updateFileAttach')}
                        >
                            <Input type="file" style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
                        </Form.Item>

                        <Form.Item
                            label={t('display')}
                            name={['file', 'isDeleted']}
                            valuePropName="checked"
                            style={{ flexDirection: 'row', alignItems: 'baseline' }}
                        >
                            <Checkbox />
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" loading={isLoading} htmlType="submit" className="lms-btn">
                                {t('submit')}</Button>
                        </Form.Item>

                    </Form>)}
        </>
    )
}


export default withTranslation('translations')(AddFile)
