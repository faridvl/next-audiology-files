import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './es.json'; // Archivo de traducciones en inglés
// Agrega más archivos de traducción según sea necesario

const resources = {
    en: {
        translation: translationEN,
    },
    // Agrega más idiomas aquí según sea necesario
};

i18n
    .use(initReactI18next) // inicializa react-i18next
    .init({
        resources,
        lng: 'es', // idioma predeterminado
        fallbackLng: 'es', // idioma de respaldo
        interpolation: {
            escapeValue: false, // no necesitamos escapar valores en los componentes de React
        },
    });

export default i18n;
