import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'node',
    include: [
      'src/collections/**/*.test.ts',
      'src/fields/**/*.test.ts',
      'src/app/(payload)/**/*.test.ts',
      'src/app/my-route/**/*.test.ts',
      'src/lib/server/**/*.test.ts',
      'src/lib/common/**/*.test.ts',
      'src/payload.config.test.ts',
    ],
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.node.ts'],
    testTimeout: 10000,
  },
  resolve: {
    tsconfigPaths: true,
  },
})
