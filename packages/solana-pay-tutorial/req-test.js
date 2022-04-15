const https = require('https')

const data = JSON.stringify({
  todo: 'Buy the milk'
})

const options = {
  hostname: 'localhost',
  port: 7890,
  path:   'https://api.devnet.solana.com',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Host':  'api.devnet.solana.com'
  }
}

console.log('send request')

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.on('close', error => {
  console.error(error)
})

req.write(data)
req.end()

