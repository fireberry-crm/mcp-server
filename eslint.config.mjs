// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';

import prettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

const tsESLintConfig = defineConfig(
    {
        ignores: ['dist/', 'node_modules/', '**/*.d.ts', 'coverage/'],
    },
    {
        settings: {
            'import-x/resolver': {
                typescript: true,
                node: true,
            },
        },
    },
    eslint.configs.recommended, // base ESLint recommended
    {
        files: ['**/*.{ts,cts,mts,js,cjs,mjs}'],
        extends: [tseslint.configs.strictTypeChecked], // use strict recommended
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error', // enforce type safety
            '@typescript-eslint/no-confusing-void-expression': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            '@typescript-eslint/no-restricted-types': [
                'error',
                {
                    types: {
                        '{}': {
                            message: 'Use object instead — `{}` means "any non-nullish value" and is usually not what you want.',
                        },
                        Function: {
                            message: 'Avoid using the `Function` type. Prefer a specific function signature.',
                        },
                    },
                },
            ],
            '@typescript-eslint/no-deprecated': 'warn',
            'prettier/prettier': 'error', // formatting as lint errors
        },
    },
    {
        files: ['**/*.{ts,cts,mts}'],
        rules: {
            'import-x/no-cycle': 'error',
            'import-x/no-unresolved': 'off',
        },
        extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    },
    prettierRecommended // disables rules already handled by Prettier
);
export default tsESLintConfig;
