module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/test/jestSetup.js'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest']
    },
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/test/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/*.mock.ts'
    ],
    moduleDirectories: ['node_modules', 'src'],
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
        '<rootDir>/src/test/jest-watch-plugin.js'
    ],
    // Options for watch mode
    watchPathIgnorePatterns: [
        'node_modules',
        'dist',
        'coverage'
    ],
    // Disable notifications to avoid the dependency requirement
    notify: false
};
