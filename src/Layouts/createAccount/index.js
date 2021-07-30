import {
    Button, Form,
    Input,

    Select
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { notifySuccess, notifyWarning } from '../../assets/common/core/notify';
import Logo from '../../assets/images/logo-utex.png'
import RestClient from '../../utils/restClient';




const CreateAccount = () => {
    const { t } = useTranslation()
    const restClient = new RestClient({ token: '' })
    const history = useHistory()


    const [form] = Form.useForm();

    const [isLoading, setIsLoading] = useState(false)

    const onFinish = (values) => {
        console.log(values)
        setIsLoading(true)
        restClient.asyncPost(`/user/register`, values)
            .then(res => {
                setIsLoading(false)
                if (!res.hasError) {
                    history.replace('/login')
                    notifySuccess('Thành công!', res.data.message);
                } else {
                    notifyWarning('Thành công!', res.data.message);
                }
            })
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const tailLayout = {
        wrapperCol: { span: 24 },
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
                        name="firstName"
                        label="First name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your first name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your last name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="User name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="emailAddress"
                        label="E-mail"
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
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Register
                        </Button>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="danger" style={{ width: '100%' }} onClick={() => history.go(-1)}>
                            Back
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>
    );
}

export default CreateAccount