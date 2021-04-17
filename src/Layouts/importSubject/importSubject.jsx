import { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Button, Form, Row } from 'antd'
import { notifyWarning } from '../../assets/common/core/notify.js';

const ImportSubject = ({ t, isLoading, handleImportSubject }) => {

    const [form] = Form.useForm();
    const [fileAttach, setFileAttach] = useState(null);


    const handleProcessFile = (e) => {
        setFileAttach(e.target.files[0])
    }

    const readFileAsDataURL = async (file) => {
        let result_base64 = await new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.readAsText(file);
        });
        return result_base64;
    }

    const formItemLayout = {
        labelCol: {
            span: 8,

        },
        wrapperCol: {
            span: 16,
        },
    };

    const onFinish = async (values) => {
        //console.log('fileAttach', fileAttach);

        if (fileAttach) {
            let text = await readFileAsDataURL(fileAttach)
            let data = null;
            try {
                data = JSON.parse(text);
            }
            catch (error) {
                notifyWarning(t('warning'), t('warning_choose_file_upload'))
                return;
            }

            values = {
                quizBank: data.quizBank || null,
                surveyBank: data.surveyBank || null,
                timelines: data.timelines || null,
                studentIds: data.studentIds || null,
            }
            //console.log(data);
            if (!values.quizBank && !values.surveyBank && !values.timelines && !values.studentIds) {
                notifyWarning(t('warning'), t('condition_file_import'))
            } else {
                handleImportSubject(values);
            }

        } else {
            notifyWarning(t('warning'), t('warning_choose_file_upload'))
        }
    }

    return (
        <>
            <Form
                {...formItemLayout}
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    label={t('fileAttach')}
                >
                    <Input type="file" accept='.json' style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 6 }}>
                    <Button type="primary" loading={isLoading} htmlType="submit">
                        {t('import_subject')}</Button>
                </Form.Item>

            </Form>
            <Row>
                <div style={{
                    border: "2px solid #cacaca",
                    padding: "20px 0",
                    borderRadius: "11px",
                    position: 'relative',
                    margin: '20px',
                    width: '100%'
                }}>
                    <h2>{t('import_h1')}</h2>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('import_h2')}</p>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('import_h3')} </p>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('import_h4')}</p>
                </div>
            </Row>
        </>
    )
}


export default withTranslation('translations')(ImportSubject)
