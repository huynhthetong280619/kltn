import { Button, Form, Input, Select } from 'antd';
import { useTranslation, withTranslation } from 'react-i18next';
const { Option } = Select;
const { TextArea } = Input;

const AddTimeline = ({ createTimeline, isLoading }) => {

    const [form] = Form.useForm();
    const { t } = useTranslation()

    const onFinish = (values) => {
        let timeline = {
            name: values.name,
            description: values.description
        }
        createTimeline(timeline);
    }

    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label={t('name')}
                    name={'name'}
                    rules={[
                        {
                            required: true,
                            message: t('require_title_week')
                        }
                    ]}
                    hasFeedback>
                    <Input id="antd-customize" className="ant-input-customize" placeholder={t('name_of_timeline')} />
                </Form.Item>

                <Form.Item
                    label={t('content')}
                    name={'description'}
                    rules={[
                        {
                            required: true,
                            message: t('require_desc_week'),
                        }
                    ]}
                    hasFeedback>
                    <TextArea
                        placeholder={t('desc_of_timeline')}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary"  htmlType="submit" className="lms-btn">
                        {t('submit')}
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}


export default withTranslation('translations')(AddTimeline)
