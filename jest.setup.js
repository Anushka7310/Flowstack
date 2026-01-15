// Add custom jest matchers
require('@testing-library/jest-dom')

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters-long'
process.env.JWT_EXPIRES_IN = '7d'
process.env.NODE_ENV = 'test'
