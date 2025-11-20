// ESLint configuration for Next.js with Prettier integration
// Based on official Next.js documentation: https://nextjs.org/docs/app/api-reference/config/eslint

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  {
    rules: {
      // Allow setState in useEffect for legitimate hydration patterns
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  // Override default ignores
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'Veridian/**',
  ]),
]);

export default eslintConfig;
