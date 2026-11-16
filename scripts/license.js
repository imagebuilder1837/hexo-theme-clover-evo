'use strict';

hexo.extend.helper.register('clover_license', function () {
  const license = this.theme.license;
  if (license === false) return false;
  if (license === undefined || license === null || license === '') return null;
  if (typeof license !== 'object' || Array.isArray(license) ||
      typeof license.name !== 'string' || !license.name.trim() ||
      typeof license.url !== 'string' || !license.url.trim()) {
    throw new Error('theme_config.license must contain non-empty name and url strings (omit it for all rights reserved, or use false to hide it)');
  }
  return { name: license.name.trim(), url: license.url.trim() };
});
