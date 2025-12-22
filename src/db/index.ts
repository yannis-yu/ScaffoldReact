import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import schema from '../models/schema'
import Flight from '../models/Flight'

// In a real app, you might check Platform.OS to switch between SQLite and LokiJS
// But for this Expo web environment, we stick to LokiJS or handle it conditionally.
// Since I can't easily install generic SQLite on pure web without expo-sqlite (which I can do, but WatermelonDB generic sqlite adapter is native only).
// WatermelonDB documents using LokiJS for Web.

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
})

export const database = new Database({
  adapter,
  modelClasses: [Flight],
})
