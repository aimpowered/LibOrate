/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// This file ensures the Jest types (expect, jest, toBe, etc.) are available
// to the TypeScript language server and the compiler in test files.

// Explicitly declare Jest globals to prevent Cypress/Chai type conflicts
declare global {
  const expect: jest.Expect;
  const jest: typeof import("@jest/globals").jest;
}

export {};
