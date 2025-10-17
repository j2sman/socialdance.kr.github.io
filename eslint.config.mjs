import tsESLint from '@typescript-eslint/eslint-plugin'
import tsESLintParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-node'
import sortPropertiesPlugin from 'eslint-plugin-sort-properties'

export default [
  // .nuxt 폴더 완전 제외
  {
    ignores: ['.nuxt/**', '.nuxt/**/*', '.nuxt/**/**'],
  },

  // 기본 설정
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'logs/**', // PM2 로그 디렉토리
      'pids/**', // PM2 PID 파일들
      '*.log', // 로그 파일들
      'ecosystem.config.js', // PM2 설정 파일 (필요시)
      '.nuxt/**', // 모든 .nuxt 폴더 제외
      '.output/**', // 모든 .output 폴더 제외
      'tailwind.config.ts', // Tailwind 설정 파일 제외
      'deploy/**/*', // 배포 관련 파일들 제외
      'server/middleware/authMiddleware.ts', // 인증 미들웨어 파일 제외
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node.js 전역 변수들
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        console: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-console': 'off', // console.log 허용 (개발 및 디버깅용)
      'no-unused-vars': 'off',
      'prefer-const': 'error',
      'no-process-exit': 'warn', // PM2에서 process.exit() 사용 주의
      'no-process-env': 'off', // 환경변수 사용 허용
    },
  },

  // JavaScript 파일 설정
  {
    files: ['**/*.js'],
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'logs/**', // PM2 로그 디렉토리
      'pids/**', // PM2 PID 파일들
      '*.log', // 로그 파일들
      'ecosystem.config.js', // PM2 설정 파일 (필요시)
      '.nuxt/**', // 모든 .nuxt 폴더 제외
      '.output/**', // 모든 .output 폴더 제외
      'tailwind.config.js', // Tailwind 설정 파일 제외
      'deploy/**/*', // 배포 관련 파일들 제외
      'server/middleware/authMiddleware.ts', // 인증 미들웨어 파일 제외
    ],
    plugins: {
      prettier: prettierPlugin,
      node: nodePlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'node/no-process-exit': 'warn',
    },
  },

  // TypeScript 파일 설정 (프로젝트 파일만)
  {
    files: ['**/*.ts'],
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'logs/**', // PM2 로그 디렉토리
      'pids/**', // PM2 PID 파일들
      '*.log', // 로그 파일들
      'ecosystem.config.js', // PM2 설정 파일 (필요시)
      '.nuxt/**', // 모든 .nuxt 폴더 제외
      '.output/**', // 모든 .output 폴더 제외
      'tailwind.config.ts', // Tailwind 설정 파일 제외
      'deploy/**/*', // 배포 관련 파일들 제외
      'middleware/**/*.ts', // 미들웨어 파일 제외
      'server/middleware/authMiddleware.ts', // 인증 미들웨어 파일 제외
    ],
    plugins: {
      '@typescript-eslint': tsESLint,
      prettier: prettierPlugin,
      import: importPlugin,
      node: nodePlugin,
      'sort-properties': sortPropertiesPlugin,
    },
    languageOptions: {
      parser: tsESLintParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': 'error',
      'import/order': [
        'warn', // error에서 warn으로 변경
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // Node.js/PM2 관련 규칙들
      'node/no-process-exit': 'warn',
      '@typescript-eslint/no-floating-promises': 'off', // 경고를 끔

      // sort-properties 규칙들 추가
      'sort-properties/sort-interface': 'warn',
      'sort-properties/sort-object-expression': [
        'warn',
        {
          allowLineSeparatedGroups: false,
          caseSensitive: true,
          functionOrder: 'higher',
          includeComments: 'leading',
          minKeys: 2,
          natural: true,
          order: 'asc',
        },
      ],
      'sort-properties/sort-type-literal': 'warn',
    },
  },

  // Middleware 파일 설정 (프로젝트 설정 없이)
  {
    files: ['middleware/**/*.ts'],
    plugins: {
      '@typescript-eslint': tsESLint,
      prettier: prettierPlugin,
      import: importPlugin,
      node: nodePlugin,
      'sort-properties': sortPropertiesPlugin,
    },
    languageOptions: {
      parser: tsESLintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'node/no-process-exit': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      'sort-properties/sort-interface': 'warn',
      'sort-properties/sort-object-expression': [
        'warn',
        {
          allowLineSeparatedGroups: false,
          caseSensitive: true,
          functionOrder: 'higher',
          includeComments: 'leading',
          minKeys: 2,
          natural: true,
          order: 'asc',
        },
      ],
      'sort-properties/sort-type-literal': 'warn',
    },
  },

  // TypeScript 파일 설정 (프로젝트 설정 없이)
  {
    files: ['server/middleware/authMiddleware.ts', 'tailwind.config.ts', 'deploy/**/*.ts'],
    plugins: {
      '@typescript-eslint': tsESLint,
      prettier: prettierPlugin,
      import: importPlugin,
      node: nodePlugin,
      'sort-properties': sortPropertiesPlugin,
    },
    languageOptions: {
      parser: tsESLintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': 'error',
      'import/order': [
        'warn', // error에서 warn으로 변경
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'node/no-process-exit': 'warn',
      '@typescript-eslint/no-floating-promises': 'off', // 경고를 끔

      // sort-properties 규칙들 추가
      'sort-properties/sort-interface': 'warn',
      'sort-properties/sort-object-expression': [
        'warn',
        {
          allowLineSeparatedGroups: false,
          caseSensitive: true,
          functionOrder: 'higher',
          includeComments: 'leading',
          minKeys: 2,
          natural: true,
          order: 'asc',
        },
      ],
      'sort-properties/sort-type-literal': 'warn',
    },
  },

  // PM2 ecosystem 설정 파일용
  {
    files: ['ecosystem.config.js', 'ecosystem.*.js'],
    languageOptions: {
      sourceType: 'script', // CommonJS 모듈 시스템
      globals: {
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // 설정 파일에서는 console 허용
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // 테스트 파일용 (필요시)
  {
    files: ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts'],
    rules: {
      'no-console': 'off', // 테스트에서는 console 허용
    },
  },
]
