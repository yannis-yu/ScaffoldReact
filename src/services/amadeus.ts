import { useSettingsStore } from '../store/useSettingsStore'

const BASE_URL = 'https://test.api.amadeus.com' // Use test environment for now

interface TokenResponse {
  access_token: string
  expires_in: number
}

// Simple in-memory cache for token
let accessToken: string | null = null
let tokenExpiry: number = 0

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const { amadeusClientId, amadeusClientSecret } = useSettingsStore.getState()

  if (!amadeusClientId || !amadeusClientSecret) {
    throw new Error('Amadeus API Credentials not set')
  }

  const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${amadeusClientId}&client_secret=${amadeusClientSecret}`,
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with Amadeus')
  }

  const data: TokenResponse = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Buffer 60s
  return accessToken
}

export const fetchFlightStatus = async (carrierCode: string, flightNumber: string, date: string) => {
    // date format: YYYY-MM-DD
    const token = await getAccessToken()

    // Using Flight Status API
    const url = `${BASE_URL}/v2/schedule/flights?carrierCode=${carrierCode}&flightNumber=${flightNumber}&scheduledDepartureDate=${date}`

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error("Amadeus API Error:", errorText)
        throw new Error('Failed to fetch flight status')
    }

    const data = await response.json()
    return data
}
