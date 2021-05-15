import {
    Button, Form,
    Input,

    Select
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Logo from '../../assets/images/logo.svg';
import RestClient from '../../utils/restClient';



const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const ForgetPassword = () => {
    const { t } = useTranslation()
    const restClient = new RestClient({ token: '' })
    const history = useHistory()


    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values)
        restClient.asyncPost(`/user/password/forget`, values)
            .then(res => {
                history.replace('/login')
                if (!res.hasError) {
                }
            })
    };

    return (<div className="login-container">
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', rowGap: '1rem'
        }}>
            <div className="login-logo" style={{ textAlign: 'center' }}>
                <img src={Logo} width={90} />
            </div>
            <Form
                style={{ minWidth: 500 }}
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >

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


                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Reset password
        </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
    );
}

export default ForgetPassword