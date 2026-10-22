import * as migration_20261020_000000_initial_schema from './20261020_000000_initial_schema'
import * as migration_20261020_000001_seed_data from './20261020_000001_seed_data'
import * as migration_20261021_000000_auth_sessions from './20261021_000000_auth_sessions'
import * as migration_20261022_000000_unlock_and_sync_admin from './20261022_000000_unlock_and_sync_admin'

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
  {
    up: migration_20261021_000000_auth_sessions.up,
    down: migration_20261021_000000_auth_sessions.down,
    name: '20261021_000000_auth_sessions',
  },
  {
    up: migration_20261022_000000_unlock_and_sync_admin.up,
    down: migration_20261022_000000_unlock_and_sync_admin.down,
    name: '20261022_000000_unlock_and_sync_admin',
  },
]
