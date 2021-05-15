import React, { Component, useEffect } from 'react'
import { Button, Col, Row } from 'antd'

// import styles from './styles.scss'
// import vn from '../../../assets/images/contents/vn.png'
// import en from '../../../assets/images/contents/en.png'

import { useTranslation } from 'react-i18next';
// import i18n from '../../../i18n';
// import glb_sv from '../../../assets/global/global.service'

const FooterLayout = () => {
    const { t } = useTranslation()

    useEffect(() => {
        // localStorage.getItem('LANGUAGE_KEY') ? this.setState({
        //     lang: localStorage.getItem('LANGUAGE_KEY')
        // }) : this.setState({ lang: 'vi' })

        // i18n.changeLanguage(localStorage.getItem('LANGUAGE_KEY'))

        // if (localStorage.getItem('LANGUAGE_KEY') == 'vi') {
        //     this.setState({
        //         langFlag: vn
        //     })
        // }

        // if (localStorage.getItem('LANGUAGE_KEY') == 'en') {
        //     this.setState({
        //         langFlag: en
        //     })
        // }
    }, [])

    const handleChangeLanguage = (lang) => {
        // this.setState({
        //     lang
        // });

        // lang == 'vi' ? this.setState({ langFlag: vn }) : this.setState({ langFlag: en });
        // if (lang) i18n.changeLanguage(lang)
        // if (typeof (Storage) !== 'undefined') {
        //     localStorage.setItem('LANGUAGE_KEY', lang);
        // }
    }


    return <>
        <Row style={{ color: '#fff', marginBottom: '15px', justifyContent: 'space-around' }}>
            <Col span={10}>
                <div>{t('systm_onl')}</div>
                <div>{t('univers_nm')}</div>
                <i></i>
                <span>www.itonline.hcmute.edu.vn</span>
                <div>Copyright HCMUTE © 2020</div>
            </Col>
            <Col span={8}>
                <div>{t('term_condt')}</div>
                <div>{t('policy')}</div>
                <div>{t('social_ntw')}</div>
                {/* <img src={this.state.langFlag} alt="" style={{ width: 22.5, height: 22.5, marginBottom: 4 }} /> */}
                <select style={{ marginLeft: 5, color: '#000' }} /*value={this.state.lang} onChange={e => this.handleChangeLanguage(e.target.value)}*/ className="form-control cursor_ponter form-control-sm acntTopDiv disabled">
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                </select>
            </Col>
        </Row>
    </>
}

export default FooterLayout
