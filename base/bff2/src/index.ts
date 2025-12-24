import { Hono } from 'hono'
import type { Context } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

const PORT = Number(process.env.PORT || 8080)
const BACKEND1_BASE_URL = process.env.BACKEND1_BASE_URL || 'http://backend1.demo-apps.svc.cluster.local:8080'
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS) || 5000

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

app.post('/car/:carID/extras/:extraID', async (c: Context) => {
  const { carID, extraID } = c.req.param()

  // Simulate 1% chance of error
  const errorChance = getRandomInt(1, 100)
  if (errorChance === 1) {
    const errorTypes = [500, 503, 504, 403] as const
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)]
    console.log(`[bff2] POST /car/${carID}/extras/${extraID} - ${errorType} Simulated Error`)
    return c.text(`Simulated ${errorType} error`, errorType)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    console.log(`[bff2] POST /car/${carID}/extras/${extraID} - Calling backend1`)
    const response = await fetch(`${BACKEND1_BASE_URL}/data/car/${carID}/extras/${extraID}`, {
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const text = await response.text()
      console.log(`[bff2] POST /car/${carID}/extras/${extraID} - ${response.status} from backend1`)
      return c.text(text, { status: response.status as any })
    }

    const data = await response.text()
    console.log(`[bff2] POST /car/${carID}/extras/${extraID} - ${response.status} OK`)
    return c.text(data, { status: response.status as any })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[bff2] POST /car/${carID}/extras/${extraID} - 504 Timeout`)
      return c.text('Request timeout', 504)
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[bff2] POST /car/${carID}/extras/${extraID} - 500 Error: ${message}`)
    return c.text(message, 500)
  }
})

app.get('/healthz', (c: Context) => {
  return c.json({ status: 'ok', service: 'bff2' })
})

console.log(`Starting server on port ${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT,
})