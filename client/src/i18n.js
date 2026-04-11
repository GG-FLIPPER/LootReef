import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all locale files
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import tr from './locales/tr.json';
import nl from './locales/nl.json';
import sv from './locales/sv.json';
import no from './locales/no.json';
import fi from './locales/fi.json';
import da from './locales/da.json';
import cs from './locales/cs.json';
import ro from './locales/ro.json';
import hu from './locales/hu.json';
import uk from './locales/uk.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
      pt: { translation: pt },
      it: { translation: it },
      pl: { translation: pl },
      tr: { translation: tr },
      nl: { translation: nl },
      sv: { translation: sv },
      no: { translation: no },
      fi: { translation: fi },
      da: { translation: da },
      cs: { translation: cs },
      ro: { translation: ro },
      hu: { translation: hu },
      uk: { translation: uk },
      zh: { translation: zh },
      ja: { translation: ja },
      ko: { translation: ko },
      ar: { translation: ar },
    },
    lng: localStorage.getItem('pricescout_language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
