import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import express from 'express'

// If you want to restrict users to email with specific domain, e.g. '@gmail.com'
const allowedDomain = ``

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
    console.log(`User not authenticated`)
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

// Extremely simple authorization: only accept users with email address ending in 'allowedDomain'.
// If any email is ok, you don't need this.
const authorize = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.user || !req.user.email.endsWith(allowedDomain)) {
    console.log(`Unauthorized user email`)
    denyAccess(res)
  } else {
    console.log(`User ok`)
    next()
  }
}

app.use(authenticate)
app.use(authorize)

app.get(`/api`, (req: express.Request, res: express.Response) => {
  res.send(`${Date.now()}`)
})

export const api = functions.https.onRequest(app)
