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
    next(`User not authenticated`)
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
      next(`Got invalid token`)
    })
}

// Extremely simple authorization: only accept users with email address ending in 'allowedDomain'.
// If any email is ok, you don't need this.
const authorize = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!allowedDomain) {
    // no domain restriction set
    next()
  } else if (!req.user || !req.user.email) {
    next(`Missing user email`)
  } else if (!req.user.email.endsWith(allowedDomain)) {
    next(`Unauthorized user email '${req.user.email}'`)
  } else {
    // user authorized
    next()
  }
}

// handle authentication and authorization errors
const rejectOnAuthError = (
  err: express.ErrorRequestHandler,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(err)
  denyAccess(res)
}

app.use(authenticate)
app.use(authorize)
app.use(rejectOnAuthError)

app.get(`/api`, (req: express.Request, res: express.Response) => {
  res.send(`${Date.now()}`)
})

export const api = functions.https.onRequest(app)
