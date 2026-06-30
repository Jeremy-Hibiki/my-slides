import type { SlidevPluginOptions } from '@slidev/types';
import { defineConfig } from 'vite-plus';

// extend vite.config.ts
declare module 'vite-plus' {
  interface UserConfig {
    /**
     * Custom internal plugin options for Slidev (advanced)
     *
     * See https://github.com/slidevjs/slidev/blob/main/packages/slidev/node/options.ts#L50
     */
    slidev?: SlidevPluginOptions;
  }
}

export default defineConfig({
  server: {
    fs: {
      allow: ['*'],
    },
  },
  slidev: {},
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    printWidth: 120,
    semi: true,
    singleQuote: true,
    sortTailwindcss: true,
    sortImports: true,
    ignorePatterns: ['*.md'],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
