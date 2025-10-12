import { locales, mainLocale } from './locales';

export const getTranslate = (
  key: keyof (typeof locales)[typeof mainLocale],
  locale: string,
  params?: object,
): string => {
  let translates = locales[locale || mainLocale];
  if (!translates) {
    translates = locales[mainLocale];
  }

  let str: string = translates[key];
  if (str && params && Object.keys(params).length) {
    for (const key of Object.keys(params)) {
      str = str.replace(`{{${key}}}`, params[key]);
    }
  }
  return str;
};
