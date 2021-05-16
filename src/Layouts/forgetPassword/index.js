import {
    Button, Form,
    Input,

    notification,

    Select
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Logo from '../../assets/images/logo-utex.png';
import RestClient from '../../utils/restClient';




const ForgetPassword = () => {
    const { t } = useTranslation()
    const restClient = new RestClient({ token: '' })
    const history = useHistory()


    const [form] = Form.useForm();

    const onFinish = (values) => {
        restClient.asyncPost(`/user/password/forget`, values)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    notification.success({
                        message: res?.data?.message,
                        description: '',
                        placement: 'bottomRight'
                    })
                    history.replace('/login')
                }
                notification.warning({
                    message: res?.data?.message,
                    description: '',
                    placement: 'bottomRight'
                })
            })
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const tailLayout = {
        wrapperCol: {offset:8, span: 16 },
    };

    return (<div className="login-container">
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', rowGap: '1rem'
        }}>
            <div className="form-login">
                <div className="login-logo" style={{ textAlign: 'center' }}>
                    <img src={Logo} width={90} />
                </div>
                <Form
                    {...layout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                >

                    <Form.Item
                        name="emailAddress"
                        label={t('Email')}
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input placeholder={t('profile_description')} />
                    </Form.Item>


                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            {t('reset_pwd')}
                        </Button>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="danger" onClick={() => history.go(-1)}>
                            {t('go_back')}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>
    );
}

export default ForgetPassword