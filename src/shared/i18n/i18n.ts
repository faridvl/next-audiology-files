import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationES from '@/static/texts/es.json';

const resources = {
    // en: {
    //     translation: { },
    // },
    es: {
        translation: {
            ...translationES
        }
    }
};

const interpolation = {
    formatSeparator: ',',
    escapeValue: false,
    // format(value, formatting, lng) {
    //     // TODO(!): ADD SOME FORMAT FOR TEXT
    // }
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        interpolation,
        lng: 'es',
        fallbackLng: 'es',
        returnNull: false,
    });

export default i18n;
