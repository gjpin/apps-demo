import { Hono } from 'hono'
import type { Context } from 'hono'

const app = new Hono()

const PORT = Number(process.env.PORT || 8080)
const BACKEND2_BASE_URL = process.env.BACKEND2_BASE_URL || 'http://backend2.demo-apps.svc.cluster.local:8080'
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS) || 5000
const MAX_RETRIES = Number(process.env.MAX_RETRIES) || 2

// Generate random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Retry helper function
const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> => {
  try {
    const response = await fetch(url, options)
    if (response.status >= 500 && retries > 0) {
      console.log(`Retrying request to ${url}, attempts left: ${retries}`)
      await new Promise(resolve => setTimeout(resolve, 100))
      return fetchWithRetry(url, options, retries - 1)
    }
    return response
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request to ${url} after error, attempts left: ${retries}`)
      await new Promise(resolve => setTimeout(resolve, 100))
      return fetchWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

// Endpoint /data/car/:carID
app.get('/data/car/:carID', (c: Context) => {
  const carID = c.req.param('carID')
  
  // Simulate 2% chance of returning a 404 error
  const errorChance = getRandomInt(1, 100)
  if (errorChance <= 2) {
    console.log(`[backend1] GET /data/car/${carID} - 404 Not Found`)
    return c.text('Car ID not found', 404)
  }

  console.log(`[backend1] GET /data/car/${carID} - 200 OK`)
  return c.text('Your car ID has full battery', 200)
})

// Endpoint /data/car/:carID/extras/:extraID
app.get('/data/car/:carID/extras/:extraID', async (c: Context) => {
  const { carID, extraID } = c.req.param()
  
  // Simulate 5% chance of returning a 502 or 401 error
  const errorChance = getRandomInt(1, 200)
  if (errorChance <= 5) {
    const errorTypes = [502, 401] as const
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)]
    console.log(`[backend1] GET /data/car/${carID}/extras/${extraID} - ${errorType} Simulated Error`)
    return c.text(`Simulated ${errorType} error`, errorType as any)
  }

  const postData = { data: 'dummy-data' }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    console.log(`[backend1] Calling backend2 POST /sales/extras`)
    const response = await fetchWithRetry(`${BACKEND2_BASE_URL}/sales/extras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await response.text()
    console.log(`[backend1] GET /data/car/${carID}/extras/${extraID} - ${response.status} (from backend2)`)
    return c.text(data, response.status as any)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[backend1] GET /data/car/${carID}/extras/${extraID} - 504 Timeout`)
      return c.text('Request timeout', 504)
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[backend1] GET /data/car/${carID}/extras/${extraID} - 500 Error: ${message}`)
    return c.text(message, 500)
  }
})

app.get('/healthz', (c: Context) => {
  return c.json({ status: 'ok', service: 'backend1' })
})

console.log(`Server running on port ${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}