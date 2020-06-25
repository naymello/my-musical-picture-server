const express = require('express')
const request = require('request')
const cors = require('cors')
const querystring = require('querystring')
require('dotenv').config()

const apiRequests = require('./requests')

const app = express()

const corsOptions = {
  origin: 'https://my-musical-picture.netlify.app',
  optionsSuccessStatus: 200
}

const redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback'

app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-top-read',
      redirect_uri
    }))
})

app.get('/callback', (req, res) => {
  const code = req.query.code || null
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, (error, response, body) => {
    const access_token = body.access_token
    const uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

app.get('/topmusic', cors(corsOptions), async (req, res) => {
  const accessToken = req.query.access_token
  const type = req.query.type
  const timeRange = req.query.time_range

  const userTopMusic = await apiRequests.getUserTopMusic(accessToken, type, timeRange)
  res.json(userTopMusic)
})

app.get('/name', cors(corsOptions), async (req, res) => {
  const accessToken = req.query.access_token

  const userFirstName = await apiRequests.getFirstName(accessToken)
  res.json(userFirstName)
})

const port = process.env.PORT || 8888
app.listen(port)