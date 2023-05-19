import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// config documentation: https://www.i18next.com/overview/configuration-options
const i18nConfig = {
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
        en: {
            languageName: 'English',
            translation: require('./Assets/i18n/en.json')
        }
    }
};

export const SupportedLanguages = {};
for (const langId in i18nConfig.resources) {
    SupportedLanguages[langId] = i18nConfig.resources[langId].languageName;
}


i18next
    .use(initReactI18next)
    .init(i18nConfig);
