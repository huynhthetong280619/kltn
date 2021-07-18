import { Button, Input, Form } from 'antd'
import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/logo-utex.png'
import RestClient from '../../utils/restClient'
import * as notify from '../../assets/common/core/notify';

const ResetPassword = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const history = useHistory()

    const restClient = new RestClient({ token: location.pathname.split('/')[3] })

    const [isLoading, setLoading] = useState(false);

    const handleResetPassword = (fieldValues) => {
        console.log(fieldValues)
        setLoading(true);
        restClient.asyncPost('/user/password/reset', { password: fieldValues['password'] })
            .then(res => {
                if (!res.hasError) {
                    notify.notifySuccess(res.data.message);
                    history.push('/login')
                } else {
                    notify.notifyError(res.data.message);
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return <div className="login-container">
        <div>
            <div className="form-login">
                <div className="login-logo">
                    <img src={Logo} width={90} />
                </div>
                <Form
                    onFinish={handleResetPassword}
                >
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: t('req_username'),
                            },
                        ]}
                    >
                        <Input.Password className="pwd-login"
                            size='large'
                            placeholder={t('placeholder_new_password')} />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            className="pwd-login"
                            size='large'
                            placeholder={t('placeholder_confirm_password')}
                        />
                    </Form.Item>


                    <Form.Item
                        style={{ textAlign: 'center' }}
                    >
                        <Button
                            loading={isLoading} className="btn-login" type="primary" size='large' htmlType="submit" style={{ fontSize: 'initial', width: '100%' }}>
                            Tạo mật khẩu mới</Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    </div>
}

export default ResetPassword