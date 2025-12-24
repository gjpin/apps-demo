const {
  GET_BASE_URL = 'http://bff1.demo-apps.svc.cluster.local:8080',
  POST_BASE_URL = 'http://bff2.demo-apps.svc.cluster.local:8080',
  GET_RPS = '10',
  POST_RPS = '10',
  PORT = '8080',
  TIMEOUT_MS = '5000',
} = process.env

if (!GET_BASE_URL || !POST_BASE_URL) {
  throw new Error('GET_BASE_URL and POST_BASE_URL must be set')
}

const MAX_ID = 1_000_000

// Request counters for observability
let getSuccessCount = 0
let getErrorCount = 0
let postSuccessCount = 0
let postErrorCount = 0

function randomId() {
  return Math.floor(Math.random() * MAX_ID) + 1
}

function startRateLoop(rps: number, fn: () => Promise<void>) {
  if (rps <= 0) return

  const intervalMs = 1000 / rps

  setInterval(() => {
    fn().catch(err => {
      console.error(`[ERROR] ${err.message}`)
    })
  }, intervalMs)
}

/* ---------- GET loop ---------- */
startRateLoop(Number(GET_RPS), async () => {
  const carID = randomId()
  const url = `${GET_BASE_URL}/car/${carID}`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), Number(TIMEOUT_MS))
    
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (response.ok) {
      getSuccessCount++
    } else {
      getErrorCount++
      console.log(`[GET] Non-OK response: ${response.status} for car ${carID}`)
    }
  } catch (error) {
    getErrorCount++
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`[GET] Timeout for car ${carID}`)
    } else {
      console.error(`[GET] Error for car ${carID}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
})

/* ---------- POST loop ---------- */
startRateLoop(Number(POST_RPS), async () => {
  const carID = randomId()
  const extraID = randomId()
  const url = `${POST_BASE_URL}/car/${carID}/extras/${extraID}`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), Number(TIMEOUT_MS))
    
    const response = await fetch(url, { method: 'POST', signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (response.ok) {
      postSuccessCount++
    } else {
      postErrorCount++
      console.log(`[POST] Non-OK response: ${response.status} for car ${carID}, extra ${extraID}`)
    }
  } catch (error) {
    postErrorCount++
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`[POST] Timeout for car ${carID}, extra ${extraID}`)
    } else {
      console.error(`[POST] Error for car ${carID}, extra ${extraID}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
})

// Log stats every 10 seconds
setInterval(() => {
  console.log(`[STATS] GET - Success: ${getSuccessCount}, Errors: ${getErrorCount} | POST - Success: ${postSuccessCount}, Errors: ${postErrorCount}`)
}, 10000)

/* ---------- health endpoint ---------- */
export default {
  port: Number(PORT),
  fetch(req: Request) {
    const url = new URL(req.url)
    
    if (url.pathname === '/healthz') {
      return Response.json({
        status: 'ok',
        service: 'load-app',
        config: {
          getRps: Number(GET_RPS),
          postRps: Number(POST_RPS),
          timeoutMs: Number(TIMEOUT_MS),
        },
        stats: {
          get: { success: getSuccessCount, errors: getErrorCount },
          post: { success: postSuccessCount, errors: postErrorCount },
        }
      })
    }
    
    return new Response('Not Found', { status: 404 })
  },
}