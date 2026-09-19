import pg from 'pg'

const url = process.env.PAYLOAD_DATABASE_URL
if (!url) {
  console.error('PAYLOAD_DATABASE_URL is not set')
  process.exit(1)
}

const maxAttempts = 30
const delayMs = 2000

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const client = new pg.Client({ connectionString: url })
  try {
    await client.connect()
    await client.end()
    console.log('Postgres is ready')
    process.exit(0)
  } catch {
    await client.end().catch(() => {})
    if (attempt === maxAttempts) {
      console.error('Postgres did not become ready in time')
      process.exit(1)
    }
    console.log(`Waiting for Postgres (${attempt}/${maxAttempts})...`)
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
}
