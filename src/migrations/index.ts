import * as migration_20261020_000000_initial_schema from './20261020_000000_initial_schema'
import * as migration_20261020_000001_seed_data from './20261020_000001_seed_data'

export const migrations = [
  {
    up: migration_20261020_000000_initial_schema.up,
    down: migration_20261020_000000_initial_schema.down,
    name: '20261020_000000_initial_schema',
  },
  {
    up: migration_20261020_000001_seed_data.up,
    down: migration_20261020_000001_seed_data.down,
    name: '20261020_000001_seed_data',
  },
]
