/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/types/**/*.ts',
        '!src/index.ts',
        '!src/**/*.d.ts'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
}; 