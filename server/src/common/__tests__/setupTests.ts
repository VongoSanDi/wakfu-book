import { initTestDB, closeTestDB } from '../../common/__tests__/db.setup';

/**
 * Global setup before running any test suite.
 */
beforeAll(async () => {
  await initTestDB();
});

/**
 * Global teardown after all test suites have completed.
 */
afterAll(async () => {
  await closeTestDB();
});
