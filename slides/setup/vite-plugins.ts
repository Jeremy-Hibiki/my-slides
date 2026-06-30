import { defineVitePluginsSetup } from '@slidev/types';
import Unfonts from 'unplugin-fonts/vite';

export default defineVitePluginsSetup(() => {
  return [
    Unfonts({
      inlineFontFace: true,
      custom: {
        families: [
          {
            name: '苹方-简',
            local: '苹方-简',
            src: '../public/fonts/PingFang.ttc',
            fallback: {
              category: 'sans-serif',
            },
          },
          {
            name: 'Cascadia Code',
            local: 'Cascadia Code',
            src: '../public/fonts/CascadiaCode-2404.23/woff2/*.woff2',
            fallback: {
              category: 'monospace',
            },
          },
        ],
        display: 'auto',
        prefetch: true,
        injectTo: 'head-prepend',
      },
    }),
  ];
});
