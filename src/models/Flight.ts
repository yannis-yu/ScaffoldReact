import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Flight extends Model {
  static table = 'flights'

  @field('flight_number') flightNumber!: string
  @field('date') date!: string
  @field('origin') origin!: string
  @field('destination') destination!: string
  @field('status') status!: string
  @field('carrier_code') carrierCode!: string
  @field('scheduled_departure') scheduledDeparture!: string
  @field('scheduled_arrival') scheduledArrival!: string
  @readonly createdAt!: number
}
