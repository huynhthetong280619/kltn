import React, { useContext } from 'react'
import { Form, Button, Input, Divider, Col, Checkbox } from 'antd'
import { useTranslation } from 'react-i18next'
import { UserOutlined, KeyOutlined, FacebookOutlined, GooglePlusOutlined, } from '@ant-design/icons';
import Facebook from '../../assets/images/facebook.svg'
import Google from '../../assets/images/google.svg'
import Logo from '../../assets/images/logo.svg'
import { StoreTrading } from '../../store-trading';
import { useHistory } from 'react-router';
import RestClient from '../../utils/restClient';
const Login = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const { setAuth, setToken, setUserInfo } = useContext(StoreTrading)

    const handleLoginForm = async (values) => {

        const data = {
            code: values.username,
            password: values.password
        }

        const restClientAPI = new RestClient({ token: null });
        restClientAPI.asyncPost('/user/authenticate', data)
            .then(res => {
                if (!res.hasError) {
                    const { token, user } = res.data;
                    setAuth(true);
                    setToken(token);
                    setUserInfo(user)

                    history.push('/home/main-app')
                }
            })

    }

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    }

    return <div className="login-container">
        <div>
            <div className="form-login">
                <div className="login-logo">
                    <img src={Logo} width={90} />
                </div>
                <Form
                    onFinish={handleLoginForm}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: t('req_username'),
                            },
                        ]}
                    >
                        <Input
                            size='large'
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder={t('placeholder_username')} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: t('req_password'),
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                            size='large'
                            placeholder={t('placeholder_password')}
                        />
                    </Form.Item>

                    <div className="login-utils">
                        <Col span={12} className="remember-me">
                            <Checkbox onChange={onChange} />
                            <div style={{ marginLeft: 10 }}>Lưu tên đăng nhập</div>
                        </Col>
                        <Col span={12} className="forget-pass">
                            <div>Quên mật khẩu ?</div>
                        </Col>
                    </div>

                    <Form.Item
                        style={{ textAlign: 'center' }}
                    >
                        <Button className="btn-login" type="primary" size='large' htmlType="submit">
                            Đăng nhập</Button>
                    </Form.Item>
                </Form>


                <Divider style={{ color: '#fff' }}>Hoặc</Divider>

                <div className="social-login">
                    <Col span={12} className="facebook-login">
                        <img src={Facebook} />
                    </Col>
                    <Col span={12} className="google-login">
                        <img src={Google} />
                    </Col>
                </div>

                <div className="register-account">Bạn chưa có tài khoản? Tạo tài khoản</div>
            </div>
        </div>
    </div>
}


export default Login