import { Hono } from 'hono'
import type { Context } from 'hono'

const app = new Hono()

const PORT = Number(process.env.PORT) || 8080
const BACKEND1_BASE_URL = process.env.BACKEND1_BASE_URL || 'http://backend1.demo-apps.svc.cluster.local:8080'
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS) || 5000

app.get('/car/:carID', async (c: Context) => {
  const carID = c.req.param('carID')
  const url = `${BACKEND1_BASE_URL}/data/car/${carID}`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    console.log(`[bff1] GET /car/${carID} - Calling backend1`)
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const text = await response.text()
      console.log(`[bff1] GET /car/${carID} - ${response.status} from backend1`)
      return c.text(text, { status: response.status as any })
    }

    const data = await response.text()
    console.log(`[bff1] GET /car/${carID} - ${response.status} OK`)
    return c.text(data, { status: response.status as any })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[bff1] GET /car/${carID} - 504 Timeout`)
      return c.text('Request timeout', 504)
    }
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    console.error(`[bff1] GET /car/${carID} - 500 Error: ${errorMessage}`)
    return c.text(errorMessage, 500)
  }
})

app.get('/healthz', (c: Context) => {
  return c.json({ status: 'ok', service: 'bff1' })
})

console.log(`Server running on port ${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}