import { I18n } from 'i18n-js';
import { en } from './en';
import {tr} from './tr'
export const i18n = new I18n({
  tr : {...tr},
  en : {...en},
});

i18n.defaultLocale = "tr";
i18n.locale = "tr";
