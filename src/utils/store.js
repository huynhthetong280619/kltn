import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STORE_KEY } from './STORE_KEY';

export const StoreContext = React.createContext(null);
export default ({ children }) => {
    console.log('Store context', children)
    const { i18n } = useTranslation();

    const [language, setLanguage] = useState('vi')

    const langStore = localStorage.getItem(STORE_KEY.LANGUAGE)

    if (langStore) {
        setLanguage(langStore)
        i18n.changeLanguage(langStore);
    }

    const store = {
        language,
        setLanguage
    };


    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );

}
