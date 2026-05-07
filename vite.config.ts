import { defineConfig } from 'vite-plus';

export default defineConfig({
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
