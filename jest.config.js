module.exports = {
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/jestHelpers/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jestHelpers/setupFilesAfterEnv.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'styl'],
  moduleNameMapper: {
    '.(png|gif|jpe?g)$': '<rootDir>/jestHelpers/mocks/fileMock.js',
    '.svg$': '<rootDir>/jestHelpers/mocks/iconMock.js',
    '.styl$': 'identity-obj-proxy',
    '\\.(css|less)$': 'identity-obj-proxy',
    '^photos/locales/.*': '<rootDir>/src/photos/locales/en.json',
    '^models(.*)': '<rootDir>/src/models$1',
    '^photos/(.*)': '<rootDir>/src/photos/$1',
    '^sharing(.*)': '<rootDir>/src/sharing$1',
    '^authentication(.*)': '<rootDir>/src/authentication$1',
    '^viewer(.*)': '<rootDir>/src/viewer$1',
    '^react-cozy-helpers(.*)': '<rootDir>/src/lib/react-cozy-helpers$1',
    '^components(.*)': '<rootDir>/src/components$1',
    '^hooks(.*)': '<rootDir>/src/hooks$1',
    '^test(.*)': '<rootDir>/test/$1',
    '^folder-references(.*)': '<rootDir>/src/folder-references$1',
    '^lib(.*)': '<rootDir>/src/lib$1',
    'react-pdf/dist/esm/pdf.worker.entry':
      '<rootDir>/jestHelpers/mocks/pdfjsWorkerMock.js',
    '^cozy-client$': 'cozy-client/dist/index.js',
    '^react-redux': '<rootDir>/node_modules/react-redux',
    '^cozy-ui/react(.*)$': '<rootDir>/node_modules/cozy-ui/transpiled/react$1',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  clearMocks: true,
  transform: {
    '\\.(js|jsx|mjs)$': [
      '@swc/jest',
      {
        jsc: {
          experimental: {
            plugins: [['swc_mut_cjs_exports', {}]]
          },
          parser: {
            jsx: true
          }
        }
      }
    ],
    '\\.(ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
          experimental: {
            plugins: [['swc_mut_cjs_exports', {}]]
          },
          parser: {
            syntax: 'typescript',
            tsx: true
          }
        }
      }
    ],
    '^.+\\.webapp$': '<rootDir>/test/jestLib/json-transformer.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!cozy-ui|cozy-sharing|)',
    'jest-runner'
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://cozy.localhost:8080/'
  },
  testMatch: ['**/(*.)(spec|test).[jt]s?(x)'],
  reporters: ['default', '<rootDir>/jestHelpers/ConsoleUsageReporter.js']
}
