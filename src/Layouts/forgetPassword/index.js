import {
    Button,
    Form,
    Input,
} from 'antd';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Logo from '../../assets/images/logo-utex.png';
import RestClient from '../../utils/restClient';
import * as notify from '../../assets/common/core/notify';



const ForgetPassword = () => {
    const { t } = useTranslation()
    const restClient = new RestClient({ token: '' })
    const history = useHistory()

    const [isLoading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        restClient.asyncPost(`/user/password/forget`, values)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    notify.notifySuccess(res?.data?.message);

                    history.replace('/login')
                } else {
                    notify.notifySuccess(res?.data?.message)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
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


                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="primary" htmlType="submit"
                            loading={isLoading}>
                            {t('reset_pwd')}
                        </Button>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="danger" style={{ width: '100%' }} onClick={() => history.go(-1)}>
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