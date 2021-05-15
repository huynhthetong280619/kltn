import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

import vi from '../src/assets/translation/vi.json'
import en from '../src/assets/translation/en.json'

i18n.use(Backend)
    .use(initReactI18next)
    .init({
        // resources,
        fallbackLng: 'VI',
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    })

i18n.addResourceBundle('VI', 'translation', vi, true, true)
i18n.addResourceBundle('EN', 'translation', en, true, true)

export default i18n
