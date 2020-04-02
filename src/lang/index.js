/**
 * App Language Provider
 * Add more locales here
 */
import enLang from './locales/en_US';
import frLang from './locales/fr_FR';
import esLang from './locales/es_ES';

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

};
export default AppLocale;
