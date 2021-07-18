import {
    DisconnectOutlined, FacebookOutlined
} from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Row, Tag, Upload, Switch } from 'antd'
// import HeadPage from '../headPage/headPage.jsx';
import 'antd/dist/antd.css'
import Title from 'antd/lib/skeleton/Title'
import React, { useEffect, useState } from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { useTranslation } from 'react-i18next'
import { getCookie } from '../../assets/common/core/localStorage'
import { notifyError, notifySuccess } from '../../assets/common/core/notify'
import { FACEBOOK_CLIENT_ID } from '../../assets/constants/const'
import ModalWrapper from '../../components/basic/modal-wrapper'
import RestClient from '../../utils/restClient'
import './overwrite.css'



const fileTypes = [
    "image/jpeg",
    "image/png"
];

const SectionDescription = ({ title, content }) => (
    <div>
        <p className="section-description-title">{title}:</p>
        <p className="section-description-content">{content}</p>
    </div>
);

function getBase64(img, callback) {
    //console.log(img);
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const Profile = ({ }) => {
    const { t } = useTranslation()
    const [state, setState] = useState({
        loading: false,
        fileData: null,
        connectFacebook: false,
        disconnectFacebook: false,
        submitProfile: false,
        submitPassword: false,
    });
    const [formProfile] = Form.useForm();
    const [formPassword] = Form.useForm();
    const [, forceUpdate] = useState(); // To disable submit button at the beginning.

    const [profile, setProfile] = useState({});

    const restClient = new RestClient({ token: '' })

    useEffect(() => {
        forceUpdate({});
        const usrObj = JSON.parse(localStorage.getItem('user'))

        if (!usrObj) {
            return
        }
        setState({
            ...state,
            imageUrl: usrObj.urlAvatar,
        });
        setProfile(usrObj);

        console.log(usrObj)
        formProfile.setFieldsValue({
            emailAddress: usrObj.emailAddress,
            lastName: usrObj.lastName,
            firstName: usrObj.firstName,
            code: usrObj.code
        });

    }, []);

    const { loading, imageUrl, connectFacebook, disconnectFacebook,
        submitPassword, submitProfile } = state;

    const beforeUpload = (file) => {
        //console.log('beforeUpload', file)
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            notifyError(t('failure'), t('condition_avatar_type'));
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            notifyError(t('failure'), t('condition_avatar_size'));
        }
        return isJpgOrPng && isLt2M;
    }


    const updateProfile = async (values) => {
        setState({ ...state, submitProfile: true });
        await restClient.asyncPut(`/user/`, {
            lastName: values.lastName,
            firstName: values.firstName,
            urlAvatar: imageUrl,
        })
            .then(res => {
                setState({ ...state, submitProfile: false });
                //console.log('resLink', res)
                // localStorage.removeItem('user');
                if (!res.hasError) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setProfile(res.data.user);
                    notifySuccess(t('success'), t('update_profile_success'));
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const updatePassword = async (values) => {
        //console.log('password', values);
        setState({ ...state, submitPassword: true });
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/password`, {
            password: values.current,
            newPassword: values.new
        }, tokenCookies)
            .then(res => {
                setState({ ...state, submitPassword: false });
                //console.log('resLink', res)
                // localStorage.removeItem('user');
                if (!res.hasError) {
                    formPassword.resetFields();
                    notifySuccess(t('success'), t('update_password_success'));
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }


    const handleImageUpload = (info) => {
        setState({
            ...state,
            loading: true,
        });
        const formData = new FormData();
        getBase64(info.file, (async (data) => {
            formData.append('file', data)
            // replace this with your upload preset name
            formData.append('upload_preset', 'gmttm4bo');
            const options = {
                method: 'POST',
                body: formData,
                header: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Accept',
                    mode: 'no-cors'
                }
            };

            // replace cloudname with your Cloudinary cloud_name
            await fetch('https://api.Cloudinary.com/v1_1/dkepvw2rz/upload', options)
                .then(res => res.json())
                .then(res => {
                    //console.log('url', res.url);
                    setState({
                        ...state,
                        imageUrl: res.url,
                        loading: false
                    });
                })
                .catch(err => {
                    //console.log(err)
                    setState({
                        ...state,
                        loading: false
                    });
                });
        }));
    }

    const linkSocial = async (data) => {
        setState({ ...state, connectFacebook: true });
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/auth/facebook/link`, data, tokenCookies)
            .then(res => {
                //console.log('resLink', res)
                setState({ ...state, connectFacebook: false });
                // localStorage.removeItem('user');
                if (!res.hasError) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setProfile(res.data.user);
                    notifySuccess(t('success'), res.data.message);
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const unlinkSocial = async () => {
        setState({ ...state, disconnectFacebook: true });
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/auth/facebook/unlink`, {
            token: tokenCookies
        }, tokenCookies)
            .then(res => {
                setState({ ...state, disconnectFacebook: false });
                //console.log('resLink unlink', res)
                if (!res.hasError) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setProfile(res.data.user);
                    notifySuccess(t('success'), res.data.message);
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const responseFacebook = async (response) => {
        //console.log('responseFacebook', response);
        const token = response.accessToken;
        //console.log('responseFacebook', token);
        const data = {
            token: token
        }

        linkSocial(data)
    }

    return (
        <>
            <Row className="profile-lms-ws color-default" style={{
                background: '#232323',
                minHeight: '200px',
                maxWidth: '86%',
                justifyContent: 'center',
                padding: '2rem',
                margin: '0 auto'
            }}>

                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', columnGap: '1rem' }}>
                    <div >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            customRequest={handleImageUpload}
                            accept={fileTypes}
                            loading={loading}
                        >

                            <img src={imageUrl ? imageUrl : profile.urlAvatar} alt="avatar" style={{ width: '100%' }} />

                        </Upload>
                    </div>
                    <ModalWrapper style={{ width: '100%' }}>
                        <Row style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                            <div>
                                <SectionDescription title={t('profile')} content={t('profile_description')} />
                            </div>

                            <div>
                                <Form
                                    id="form-profile"
                                    name="form-profile"
                                    form={formProfile}
                                    layout="vertical"
                                    className="form-profile"
                                    requiredMark='optional'
                                    onFinish={updateProfile}
                                >
                                    <Form.Item
                                        label="Code"
                                        name={"code"}>
                                        <Input readOnly disabled style={{
                                            border: '0 !important',
                                            background: '#494949 !important'
                                        }} />
                                    </Form.Item>
                                    <Form.Item
                                        label={t('email_address')}
                                        name={"emailAddress"}>
                                        <Input readOnly disabled />
                                    </Form.Item>
                                    <Form.Item
                                        label={t('firstName')}
                                        name={"firstName"}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('req_firstName'),
                                            }
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label={t('lastName')}
                                        name={"lastName"}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('req_lastName'),
                                            }
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label={t('active_notification')}
                                    name="isNotify">
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ textAlign: 'center' }}>
                                        <Button style={{ marginTop: 8 }}
                                            type="primary"
                                            htmlType="submit"
                                            form="form-profile"
                                            size='large'
                                            loading={submitProfile}
                                        >{t('save')}</Button>

                                    </Form.Item>
                                </Form>

                                <Divider style={{ color: '#f9f9f9' }}>{t('social_ntw')}</Divider>
                                {!profile.facebookId ? (<FacebookLogin
                                    appId={`${FACEBOOK_CLIENT_ID}`}
                                    autoLoad={false}
                                    callback={responseFacebook}
                                    render={(renderProps) => (
                                        <Button
                                            style={{ color: '#131394' }}
                                            loading={connectFacebook}
                                            onClick={renderProps.onClick}
                                            icon={<FacebookOutlined />}
                                        >
                                            {t('connect_facebook')}
                                        </Button>
                                    )}
                                />) : (<Row style={{ justifyContent: 'space-between' }}>
                                    <Col>
                                        <Tag icon={<FacebookOutlined />} color="#3b5999">Facebook</Tag>
                                    </Col>
                                    <Col>
                                        <Tag color="purple">ID: {profile.facebookId}</Tag>
                                    </Col>
                                    <Col>
                                        <Button
                                            size={"small"}
                                            style={{ marginLeft: 8 }}
                                            type={"primary"}
                                            danger
                                            icon={<DisconnectOutlined />}
                                            loading={disconnectFacebook}
                                            onClick={unlinkSocial}
                                        >
                                            {t('unlink_facebook')}
                                        </Button>
                                    </Col>

                                </Row>)}
                            </div>
                        </Row>
                    </ModalWrapper>
                    <ModalWrapper style={{ width: '100%' }}>
                        <Row style={{ flexDirection: 'column' }}>
                            <div >
                                <SectionDescription title={t('password')} content={t('password_description')} />
                            </div>
                            <div />
                            <div >
                                <Form
                                    onFinish={updatePassword}
                                    name="password"
                                    id='form-password'
                                    form={formPassword}
                                    layout="vertical"
                                    className="form-password"
                                    requiredMark={"optional"}
                                >
                                    <Form.Item
                                        label={t('current_password')}
                                        name="current"

                                        rules={[
                                            {
                                                required: true,
                                                message: t('req_current_password'),
                                            }
                                        ]}
                                        hasFeedback>
                                        <Input.Password style={{
                                            background: '#494949',
                                            border: 0
                                        }} placeholder={t('placeholder_current_password')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={t('new_password')}
                                        name="new"
                                        rules={[
                                            {
                                                required: true,
                                                message: t('req_new_password'),
                                            },
                                            {
                                                min: 8,
                                                message: t('req_length_password')
                                            }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password
                                            placeholder={t('placeholder_new_password')} />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirm"
                                        dependencies={['new']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: t('req_confirm_password'),
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (!value || getFieldValue('new') === value) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(t('req_match_password'));
                                                },
                                            }),
                                        ]}
                                        label={t('confirm_password')}>
                                        <Input.Password placeholder={t('placeholder_confirm_password')} />
                                    </Form.Item>
                                    <Form.Item shouldUpdate={true}>
                                        {() => (
                                            <Button style={{ marginTop: 8 }}
                                                className="ant-btn-primary"
                                                loading={submitPassword}
                                                htmlType="submit"
                                                form='form-password'
                                                disabled={
                                                    !formPassword.isFieldsTouched(true) ||
                                                    formPassword.getFieldsError().filter(({ errors }) => errors.length).length
                                                }
                                            >{t('update_password')}</Button>
                                        )}
                                    </Form.Item>
                                </Form>
                            </div>

                        </Row>

                    </ModalWrapper>
                </div>
            </Row>
        </>
    )
}

export default Profile