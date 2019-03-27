import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import express from 'express'

admin.initializeApp()
const app = express()

// enable adding the user token to request
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken
    }
  }
}

const denyAccess = (res: express.Response) => {
  res.status(403).send(`Unauthorized`)
}

// Validate Firebase ID Tokens
const authenticate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith(`Bearer `)
  ) {
    denyAccess(res)
    return
  }

  const idToken = req.headers.authorization.split(`Bearer `)[1]
  console.log(`id token: ${idToken}`)
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      req.user = decodedIdToken
      console.log(`authenticated user:`, decodedIdToken)
      next()
    })
    .catch(() => {
      console.log(`Got invalid token`)
      denyAccess(res)
      return
    })
}

app.use(authenticate)

app.get(`/api`, (req: express.Request, res: express.Response) => {
  res.send(`${Date.now()}`)
})

export const api = functions.https.onRequest(app)
