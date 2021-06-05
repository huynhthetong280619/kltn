import { Button, Checkbox, Form } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notifyError } from '../../assets/common/core/notify.js';
import RestClient from '../../utils/restClient.js';

const ExportSubject = ({ idSubject, nameSubject }) => {

    const [form] = Form.useForm();

    const [isLoading, setLoading] = useState(false);
    const restClient = new RestClient({ token: '' })
    const { t } = useTranslation()
    const formItemLayout = {
        labelCol: {
            span: 8,

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

    const onFinish = (values) => {
        console.log('values', values);
        setLoading(true);
        restClient.asyncPost(`/course/${idSubject}/export`, values)
            .then(res => {
                console.log(res)
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
                <Form.Item >
                    <Button type="primary" loading={isLoading} htmlType="submit">
                        {t('export_data')}
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}


export default ExportSubject
