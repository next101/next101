import * as migration_20260820_123532 from './20260820_123532';
import * as migration_20260820_123745 from './20260820_123745';

export const migrations = [
  {
    up: migration_20260820_123532.up,
    down: migration_20260820_123532.down,
    name: '20260820_123532',
  },
  {
    up: migration_20260820_123745.up,
    down: migration_20260820_123745.down,
    name: '20260820_123745'
  },
];
