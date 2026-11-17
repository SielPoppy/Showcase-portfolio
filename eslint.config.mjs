import parser from '@typescript-eslint/parser';
import typescript from '@typescript-eslint/eslint-plugin';

export default [{
  files: ['src/**/*.{ts,tsx}', 'scripts/*.ts', 'vite.config.mts'],
  languageOptions: { parser, parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },
  plugins: { '@typescript-eslint': typescript },
  rules: {
    'no-debugger': 'error',
    'no-dupe-keys': 'error',
    'no-constant-condition': 'error',
    'no-duplicate-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
  },
}];
