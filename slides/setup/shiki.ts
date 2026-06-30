import { defineShikiSetup } from '@slidev/types';

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: 'one-dark-pro',
      light: 'one-light',
    },
    langs: ['bash', 'powershell', 'json', 'markdown', 'mdc'],
  };
});
