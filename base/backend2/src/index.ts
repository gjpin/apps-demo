import { Hono } from 'hono'
import type { Context } from 'hono'

const app = new Hono()

const PORT = Number(process.env.PORT) || 8080

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Route to handle POST requests at /sales/extras
app.post('/sales/extras', (c: Context) => {
  // Simulate 1.5% chance of returning an error (400 or 500)
  const errorChance = getRandomInt(1, 10000)
  if (errorChance <= 150) {
    const errorTypes = [400, 500] as const
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)]
    console.log(`[backend2] POST /sales/extras - ${errorType} Simulated Error`)
    return c.text(`Simulated ${errorType} error`, errorType)
  }

  // Otherwise, return 201 Created
  console.log(`[backend2] POST /sales/extras - 201 Created`)
  return c.text('Successfully created', 201)
})

app.get('/healthz', (c: Context) => {
  return c.json({ status: 'ok', service: 'backend2' })
})

console.log(`Server running on port ${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}