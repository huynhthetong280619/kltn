import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { STORE_KEY } from './utils/STORE_KEY';

export const StoreTrading = React.createContext(null);

export default ({ children }) => {

    const {i18n} = useTranslation()
    const [authFlag, setAuth] = useState(false)
    const [token, setToken] = useState(false)
    // userInfo
    const [userInfo, setUserInfo] = useState({
        code: '',
        emailAddress: '',
        firstName: '',
        idPrivilege: '',
        surName: '',
        urlAvatar: ''
    })

    const [language, setLanguage] = useState('VI')

    useEffect(() => {
        const lang = localStorage.getItem(STORE_KEY.LANGUAGE)

        if (!lang) {
            localStorage.setItem(STORE_KEY.LANGUAGE, language)
        }

        i18n.changeLanguage(localStorage.getItem(STORE_KEY.LANGUAGE))
        setLanguage(localStorage.getItem(STORE_KEY.LANGUAGE))

    }, [])
    
    const store = {
        token,
        setToken,
        userInfo,
        setUserInfo,
        authFlag,
        setAuth,
        setLanguage,
        language
    };

    return (
        <StoreTrading.Provider value={store}>
            {children}
        </StoreTrading.Provider>
    );
};