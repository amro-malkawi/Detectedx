/**
 * App Language Provider
 * Add more locales here
 */
import enLang from './locales/en_US';
import frLang from './locales/fr_FR';
import esLang from './locales/es_ES';
import zhLang from './locales/zh_CN';

const AppLocale = {
    en: {
        locale: 'en-US',
        messages: enLang
    },
    fr: {
        locale: 'fr-FR',
        messages: frLang
    },
    es: {
        locale: 'es-ES',
        messages: esLang
    },
    zh: {
        locale: 'zh-Hans-CN',
        messages: zhLang
    },

};
export default AppLocale;
