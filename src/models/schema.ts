import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'flights',
      columns: [
        { name: 'flight_number', type: 'string' },
        { name: 'date', type: 'string' }, // ISO date string
        { name: 'origin', type: 'string', isOptional: true },
        { name: 'destination', type: 'string', isOptional: true },
        { name: 'status', type: 'string', isOptional: true },
        { name: 'carrier_code', type: 'string' },
        { name: 'scheduled_departure', type: 'string', isOptional: true },
        { name: 'scheduled_arrival', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ]
    }),
  ]
})
