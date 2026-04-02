import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Run test files sequentially — all share the same process, isolation
    // is handled by per-file temp DBs in setupTestApp()
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 15000,
    reporter: ['verbose'],
    include: ['**/*.test.js'],
  },
});
