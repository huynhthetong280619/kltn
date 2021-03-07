import React, { useState } from 'react';

export const StoreTrading = React.createContext(null);

export default ({ children }) => {

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

    const store = {
        token,
        setToken,
        userInfo,
        setUserInfo,
        authFlag,
        setAuth
    };

    return (
        <StoreTrading.Provider value={store}>
            {children}
        </StoreTrading.Provider>
    );
};