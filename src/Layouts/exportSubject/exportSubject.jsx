import { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Button, Form, Row, Checkbox } from 'antd'
import { notifyError } from '../../assets/common/core/notify.js';
import fileDownload from 'js-file-download';
import RestClient from '../../utils/restClient.js';
const ExportSubject = ({ t, idSubject, token, nameSubject }) => {

    const [form] = Form.useForm();

    const [isLoading, setLoading] = useState(false);
    const restClient = new RestClient({token: ''})

    const formItemLayout = {
        labelCol: {
            span: 8,

        },
        wrapperCol: {
            span: 4,
        },
    };

    const onChangeSelect = (cbx) => {
        //console.log(cbx);
        if (cbx.id === 'isTimelines' && cbx.checked) {
            form.setFieldsValue({
                isSurveyBank: true,
                isQuizBank: true
            })
        } else if ((cbx.id === 'isSurveyBank' || cbx.id === 'isQuizBank') && !cbx.checked) {
            form.setFieldsValue({
                isTimelines: false
            })
        }
    }

    const onFinish = async (values) => {
        //console.log('values', values);
        setLoading(true);
        await restClient.asyncPost(`/subject/${idSubject}/export-teacher`, values, token)
            .then(res => {
                setLoading(false);
                if (!res.hasError) {
                    //console.log('res', res);
                    fileDownload(JSON.stringify(res.data), `${nameSubject}.json`);
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            });
    }

    return (
        <>
            <Form
                {...formItemLayout}
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    label={t('timeline')}
                    name='isTimelines'
                    valuePropName='checked'
                >
                    <Checkbox onChange={(e) => onChangeSelect(e.target)} />
                </Form.Item>

                <Form.Item
                    label={t('quiz_bank')}
                    name='isQuizBank'
                    valuePropName='checked'
                >
                    <Checkbox onChange={(e) => onChangeSelect(e.target)} />
                </Form.Item>

                <Form.Item
                    label={t('survey_bank')}
                    name='isSurveyBank'
                    valuePropName='checked'
                >
                    <Checkbox onChange={(e) => onChangeSelect(e.target)} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 7 }}>
                    <Button type="primary" loading={isLoading} htmlType="submit">
                        {t('export_data')}</Button>
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
                    <h2>{t('export_h1')}</h2>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('export_h2')}</p>
                    <p style={{
                        fontStyle: 'italic',
                        color: '#9d9393'
                    }}>{t('export_h3')} </p>
                </div>
            </Row>
        </>
    )
}


export default withTranslation('translations')(ExportSubject)
