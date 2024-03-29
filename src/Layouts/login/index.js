import React, { useContext, useState } from 'react'
import { Form, Button, Input, Divider, Col, Checkbox, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID } from '../../assets/constants/const'
import Facebook from '../../assets/images/facebook.svg'
import Google from '../../assets/images/google.svg'
import Logo from '../../assets/images/logo-utex.png'
import { StoreTrading } from '../../store-trading';
import { useHistory } from 'react-router';
import RestClient from '../../utils/restClient';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { authenticate } from '../../assets/common/core/localStorage'
import ModalLoadingLogin from './modal-loading-login';

const Login = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const { setAuth, setToken, setUserInfo } = useContext(StoreTrading)
    const [loadingLogin, setLoadingLogin] = useState(false)
    const handleLoginForm = async (values) => {
        setLoadingLogin(true)
        const data = {
            code: values.username,
            password: values.password
        }

        const restClientAPI = new RestClient({ token: null });

        restClientAPI.asyncPost('/user/authenticate', data)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    authenticate(res, () => {
                        const { token, user } = res.data;
                        setAuth(true);
                        setToken(token);
                        setUserInfo(user)

                        localStorage.setItem('API_TOKEN', token)


                        history.push('/home/main-app')
                    })

                } else {
                    notification.warning({
                        message: res?.data?.message,
                        description: '',
                        placement: 'bottomRight'
                    })
                }
                setLoadingLogin(false)
            })

    }

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    }

    const responseGoogle = async (response) => {
        const token = response.tokenId;

        const data = {
            token: token
        }

        localStorage.setItem('API_TOKEN', token);

        const restClientAPI = new RestClient({ token: token });

        await restClientAPI.asyncPost(`/user/auth/google`, data)
            .then(res => {
                if (!res.hasError) {
                    authenticate(res, () => {
                        const { token, user } = res.data;
                        setAuth(true);
                        setToken(token);
                        setUserInfo(user)

                        history.push('/home/main-app')
                    })
                }
                else {
                    console.log('Failure !')
                }
            })
    }

    const responseGoogleFailure = async (response) => {
        console.log('responseGoogleFailure', response);
    }

    const responseFacebook = async (response) => {
        const token = response.accessToken;

        const data = {
            token: token
        }

        localStorage.setItem('API_TOKEN', token);

        const restClientAPI = new RestClient({ token: token });

        await restClientAPI.asyncPost(`/user/auth/facebook`, data)
            .then(res => {
                if (!res.hasError) {
                    authenticate(res, () => {
                        const { token, user } = res.data;
                        setAuth(true);
                        setToken(token);
                        setUserInfo(user)

                        history.push('/home/main-app')
                    })
                }
                else {
                    console.log('Error login Facebook...')
                }
            })
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
                            prefix={<UserOutlined className="site-form-item-icon" style={{color: '#f9f9f9' }} />}
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
                            className="pwd-login"
                            prefix={<KeyOutlined className="site-form-item-icon" style={{color: '#f9f9f9' }}/>}
                            size='large'
                            placeholder={t('placeholder_password')}
                        />
                    </Form.Item>

                    <div className="login-utils">
                        <Col span={12} className="remember-me">
                            {/* <Checkbox onChange={onChange} /> */}
                            {/* <div style={{ marginLeft: 10, cursor: 'pointer' }}>Lưu tên đăng nhập</div> */}
                        </Col>
                        <Col span={12} className="forget-pass" onClick={() => history.push('forget')}>
                            <div style={{ cursor: 'pointer' }}>{t('forget_pass')}</div>
                        </Col>
                    </div>

                    <Form.Item
                        style={{ textAlign: 'center' }}
                    >
                        <Button className="btn-login" type="primary" size='large' htmlType="submit" style={{ fontSize: 'initial' }}>
                            Đăng nhập</Button>
                    </Form.Item>
                </Form>


                <Divider style={{ color: '#fff' }}>Hoặc</Divider>

                <div className="social-login">
                    <Col span={12} className="facebook-login">
                        <FacebookLogin
                            appId={FACEBOOK_CLIENT_ID}
                            callback={responseFacebook}
                            render={renderProps => (
                                <img className="button-google-login" style={{ cursor: "pointer" }} src={Facebook} onClick={() => renderProps.onClick()} disabled={renderProps.disabled} />
                            )}
                        />

                    </Col>
                    <Col span={12} className="google-login">
                        <GoogleLogin clientId={GOOGLE_CLIENT_ID}
                            render={renderProps => (
                                <img className="button-google-login" style={{ cursor: "pointer" }} src={Google} onClick={() => renderProps.onClick()} disabled={renderProps.disabled} />
                            )}
                            onSuccess={responseGoogle}
                            onFailure={responseGoogleFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </Col>
                </div>

                <div className="register-account"><div>{t('have_account')}</div> <span style={{ cursor: 'pointer', color: '#0f70b8' }} className="ml-2" onClick={(e) => { e.preventDefault(); history.push('/create-account') }}>{t('create_account')}</span></div>
            </div>
        </div>

        <ModalLoadingLogin visible={loadingLogin} content={t('loading_login')} />

    </div>
}


export default Login