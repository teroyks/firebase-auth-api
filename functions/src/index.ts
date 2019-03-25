import * as functions from 'firebase-functions'

import express from 'express'

const app = express()

app.get(`/api`, (req, res) => {
  res.send(`${Date.now()}`)
})

export const api = functions.https.onRequest(app)
