import 'dotenv/config'
import { parse } from './parser'
import basicAuth from 'express-basic-auth'
import express from 'express'

const app = express()

app.use(express.json())
app.use(
  basicAuth({
    users: {
      [process.env.BASIC_USER || '']: process.env.BASIC_PASS || '',
    },
  }),
)

const port = process.env.PORT

app.post('/', async (req, res) => {
  const body = req.body

  const name = body.name
  const region = body.region
  const group = body.group as boolean
  if (!name) {
    res.status(400)
    return res.send('Name param is required')
  } else if (!region) {
    res.status(400)
    return res.send('Region param is required')
  }

  try {
    const resData = await parse(region, name, group)
    if (resData) {
      return res.json(resData)
    }
  } catch (e) {
    res.status(500)
    console.error(e)
    return res.send(e as any)
  }

  return res.send('Success')
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
