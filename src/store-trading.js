import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { STORE_KEY } from './utils/STORE_KEY';
import io from "socket.io-client"

import { SERVER_SOCKET } from "./assets/constants/const"

export const StoreTrading = React.createContext(null);

const Store = ({ children }) => {

    const { i18n } = useTranslation()
    const [authFlag, setAuth] = useState(false)
    const [token, setToken] = useState(false)
    const [socket, setSocket] = useState(null)
    // userInfo
    const [userInfo, setUserInfo] = useState({
        code: '',
        emailAddress: '',
        firstName: '',
        idPrivilege: '',
        lastName: '',
        urlAvatar: ''
    })
    const setupSocket = () => {
        const newSocket = io(SERVER_SOCKET, {
            query: {
                token,
            },
        });
        setSocket(newSocket);
    }

    useEffect(() => {
        if (token) {
            setupSocket();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const [language, setLanguage] = useState('VI')

    useEffect(() => {
        const lang = localStorage.getItem(STORE_KEY.LANGUAGE)

        if (!lang) {
            localStorage.setItem(STORE_KEY.LANGUAGE, language)
        }

        i18n.changeLanguage(localStorage.getItem(STORE_KEY.LANGUAGE))
        setLanguage(localStorage.getItem(STORE_KEY.LANGUAGE))

    }, [language, i18n])

    const store = {
        token,
        setToken,
        userInfo,
        setUserInfo,
        authFlag,
        setAuth,
        setLanguage,
        language,
        socket,
    };

    return (
        <StoreTrading.Provider value={store}>
            {children}
        </StoreTrading.Provider>
    );
};

export default Store