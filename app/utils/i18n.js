export default function i18n(text, config) {
  return Object.entries(config).reduce((str, [key, value]) => {
    const regexp = new RegExp(`\\%${key}\\%`, 'g');
    return str.replace(regexp, value || key);
  }, text);
}